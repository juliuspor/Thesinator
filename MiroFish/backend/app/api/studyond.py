"""
Studyond-specific adapter routes.

These endpoints keep the original MiroFish UI hidden while still letting an
external product layer seed scenario context directly into the backend.
"""

import json
import threading
import traceback
from typing import Any, Dict, List, Optional

from flask import jsonify, request

from . import studyond_bp
from ..config import Config
from ..models.project import ProjectManager, ProjectStatus
from ..models.task import TaskManager, TaskStatus
from ..services.graph_builder import GraphBuilderService
from ..services.ontology_generator import OntologyGenerator
from ..services.text_processor import TextProcessor
from ..utils.llm_client import LLMClient
from ..utils.logger import get_logger

logger = get_logger("mirofish.api.studyond")

DEFAULT_GRAPH_SCENARIO = (
    "Build a stakeholder-first thesis ecosystem graph for a five-year thesis-to-career journey. "
    "Capture the student, thesis directions, companies, universities, supervisors, experts, "
    "and adjacent organizations that shape the path."
)


def _string(value: Any) -> str:
    return value.strip() if isinstance(value, str) else ""


def _list_of_strings(value: Any) -> List[str]:
    if not isinstance(value, list):
        return []
    return [item.strip() for item in value if isinstance(item, str) and item.strip()]


def _truncate(value: str, max_length: int = 160) -> str:
    trimmed = value.strip()
    if len(trimmed) <= max_length:
        return trimmed
    return f"{trimmed[: max(0, max_length - 1)].rstrip()}…"


def _task_progress(
    task_manager: TaskManager,
    task_id: str,
    *,
    status: Optional[TaskStatus] = None,
    progress: Optional[int] = None,
    message: Optional[str] = None,
    stage_label: Optional[str] = None,
    result: Optional[Dict[str, Any]] = None,
    error: Optional[str] = None,
) -> None:
    progress_detail = {"stage_label": stage_label} if stage_label else None
    task_manager.update_task(
        task_id,
        status=status,
        progress=progress,
        message=message,
        progress_detail=progress_detail,
        result=result,
        error=error,
    )


def _graph_status_from_task(task_status: Optional[str]) -> str:
    if task_status == TaskStatus.COMPLETED.value:
        return "ready"
    if task_status == TaskStatus.FAILED.value:
        return "failed"
    if task_status in {TaskStatus.PENDING.value, TaskStatus.PROCESSING.value}:
        return "preparing"
    return "queued"


def _task_response_payload(task_id: str) -> Optional[Dict[str, Any]]:
    task = TaskManager().get_task(task_id)
    if not task:
        return None

    task_dict = task.to_dict()
    project_id = None
    metadata = task_dict.get("metadata")
    if isinstance(metadata, dict):
        project_id = _string(metadata.get("project_id"))

    project = ProjectManager.get_project(project_id) if project_id else None
    graph_id = project.graph_id if project else None
    stage_label = None
    progress_detail = task_dict.get("progress_detail")
    if isinstance(progress_detail, dict):
        stage_label = _string(progress_detail.get("stage_label"))

    return {
        "status": _graph_status_from_task(task_dict.get("status")),
        "stage_label": stage_label or _string(task_dict.get("message")) or None,
        "progress": int(task_dict.get("progress") or 0),
        "mirofish_project_id": project_id or None,
        "task_id": task_id,
        "graph_id": graph_id or None,
        "message": _string(task_dict.get("message")) or None,
        "error": _string(task_dict.get("error")) or None,
        "events": task_dict.get("events") if isinstance(task_dict.get("events"), list) else [],
        "raw_task": task_dict,
    }


def _label_from_node(node: Dict[str, Any]) -> str:
    attributes = node.get("attributes")
    if isinstance(attributes, dict):
        for key in ["full_name", "org_name", "title", "name"]:
            value = _string(attributes.get(key))
            if value:
                return value
    return _string(node.get("name")) or "Unnamed stakeholder"


def _summary_from_node(node: Dict[str, Any]) -> str:
    summary = _string(node.get("summary"))
    if summary:
        return _truncate(summary, 140)

    attributes = node.get("attributes")
    if isinstance(attributes, dict):
        for key in ["description", "about", "role", "position", "location"]:
            value = _string(attributes.get(key))
            if value:
                return _truncate(value, 140)

    labels = node.get("labels")
    if isinstance(labels, list) and labels:
        return _truncate(", ".join(str(label) for label in labels[:3]), 140)

    return "Appears in the emerging thesis stakeholder graph."


def _node_type(node: Dict[str, Any]) -> str:
    labels = node.get("labels") if isinstance(node.get("labels"), list) else []
    attributes = node.get("attributes") if isinstance(node.get("attributes"), dict) else {}
    haystack = " ".join(
        [
            *[str(label).lower() for label in labels],
            _label_from_node(node).lower(),
            _string(node.get("summary")).lower(),
            " ".join(str(value).lower() for value in attributes.values() if isinstance(value, (str, int, float))),
        ]
    )

    if any(keyword in haystack for keyword in ["student", "candidate"]):
        return "student"
    if any(keyword in haystack for keyword in ["thesis", "topic", "research project", "master thesis"]):
        return "thesis"
    if any(keyword in haystack for keyword in ["company", "corporation", "startup", "business"]):
        return "company"
    if any(keyword in haystack for keyword in ["university", "school", "college", "campus"]):
        return "university"
    if any(keyword in haystack for keyword in ["supervisor", "professor", "advisor", "faculty"]):
        return "supervisor"
    if any(keyword in haystack for keyword in ["expert", "researcher", "mentor", "practitioner"]):
        return "expert"
    if any(keyword in haystack for keyword in ["organization", "association", "institution", "agency", "group"]):
        return "organization"
    return "other"


def _node_priority(node_type: str) -> int:
    order = {
        "student": 0,
        "thesis": 1,
        "company": 2,
        "university": 3,
        "supervisor": 4,
        "expert": 5,
        "organization": 6,
        "other": 7,
    }
    return order.get(node_type, 8)


def _build_preview_from_graph_data(graph_data: Dict[str, Any]) -> Dict[str, Any]:
    nodes = graph_data.get("nodes") if isinstance(graph_data.get("nodes"), list) else []
    edges = graph_data.get("edges") if isinstance(graph_data.get("edges"), list) else []

    normalized_nodes: List[Dict[str, Any]] = []
    for node in nodes:
        if not isinstance(node, dict):
            continue
        label = _label_from_node(node)
        if not label:
            continue
        node_type = _node_type(node)
        normalized_nodes.append({
            "id": _string(node.get("uuid")) or label,
            "label": label,
            "type": node_type,
            "summary": _summary_from_node(node),
            "_priority": _node_priority(node_type),
        })

    normalized_nodes.sort(key=lambda item: (item["_priority"], item["label"].lower()))
    kept_nodes = normalized_nodes[:10]
    kept_node_ids = {node["id"] for node in kept_nodes}

    preview_edges: List[Dict[str, Any]] = []
    for edge in edges:
        if not isinstance(edge, dict):
            continue
        source = _string(edge.get("source_node_uuid"))
        target = _string(edge.get("target_node_uuid"))
        if source not in kept_node_ids or target not in kept_node_ids:
            continue

        label = (
            _string(edge.get("fact_type"))
            or _string(edge.get("name"))
            or _string(edge.get("fact"))
            or "related to"
        )

        preview_edges.append({
            "id": _string(edge.get("uuid")) or f"{source}:{target}:{label}",
            "source": source,
            "target": target,
            "label": _truncate(label, 48),
        })

    return {
        "graph_id": _string(graph_data.get("graph_id")) or None,
        "preview_nodes": [
            {
                "id": node["id"],
                "label": node["label"],
                "type": node["type"],
                "summary": node["summary"],
            }
            for node in kept_nodes
        ],
        "preview_edges": preview_edges[:18],
        "node_count": int(graph_data.get("node_count") or len(nodes)),
        "edge_count": int(graph_data.get("edge_count") or len(edges)),
    }


def _fallback_detail(future_card: Dict[str, Any]) -> Dict[str, Any]:
    future_role = _string(future_card.get("future_role")) or "Future role"
    future_org = _string(future_card.get("future_organization")) or "a grounded organization"
    thesis_title = _string(future_card.get("thesis_title")) or "this thesis"
    thesis_summary = _string(future_card.get("thesis_summary")) or "A grounded thesis path."
    why_fit = _string(future_card.get("why_fit")) or "It stays close to the student's stated direction."
    path_snapshot = _string(future_card.get("future_path_snapshot")) or "The thesis compounds into visible career momentum."

    return {
        "hero_title": f"{future_role} at {future_org}",
        "hero_summary": path_snapshot,
        "opening_note": f"This future grows out of {thesis_title} and turns the thesis into concrete proof.",
        "why_this_path": why_fit,
        "future_self_intro": f"I'm your future self on the {thesis_title} path. I made this thesis legible to other people early.",
        "story_beat": f"The thesis moved from scoped curiosity to a signal that opened doors in {future_org}.",
        "persona_brief": f"You are the student's future self. You became {future_role} at {future_org}. Stay calm, grounded, and specific.",
        "milestones": [
            {
                "title": "Scope the thesis carefully",
                "detail": f"You narrow {thesis_title} into a question that is ambitious but still finishable.",
            },
            {
                "title": "Make the work visible",
                "detail": "You turn the thesis into something other people can understand, discuss, and trust.",
            },
            {
                "title": "Carry the signal forward",
                "detail": thesis_summary,
            },
        ],
    }


def _fallback_prompts(future_card: Dict[str, Any]) -> List[str]:
    thesis_title = _string(future_card.get("thesis_title")) or "this thesis"
    return [
        f"What made {thesis_title} worth choosing in the end?",
        "What should I do in the first month so this path becomes real?",
        "What would you avoid repeating if you had to start again?",
    ]


def _run_graph_build(project_id: str, task_id: str) -> None:
    task_manager = TaskManager()
    project = ProjectManager.get_project(project_id)
    if not project:
        task_manager.fail_task(task_id, f"Project not found: {project_id}")
        return

    try:
        if not Config.ZEP_API_KEY:
            raise ValueError("ZEP_API_KEY is not configured")

        text = ProjectManager.get_extracted_text(project_id)
        if not text:
            raise ValueError("Extracted text content not found")

        if not project.ontology:
            raise ValueError("Ontology definition not found")

        builder = GraphBuilderService(api_key=Config.ZEP_API_KEY)

        _task_progress(
            task_manager,
            task_id,
            status=TaskStatus.PROCESSING,
            progress=12,
            message="Creating the thesis graph shell in Zep...",
            stage_label="Creating graph",
        )
        graph_id = builder.create_graph(name=project.name or "Studyond Thesis Graph")
        project.graph_id = graph_id
        project.status = ProjectStatus.GRAPH_BUILDING
        ProjectManager.save_project(project)

        _task_progress(
            task_manager,
            task_id,
            progress=22,
            message="Applying ontology so the graph knows who matters...",
            stage_label="Ontology applied",
        )
        builder.set_ontology(graph_id, project.ontology)

        _task_progress(
            task_manager,
            task_id,
            progress=32,
            message="Chunking the Studyond context for ingestion...",
            stage_label="Preparing context",
        )
        chunks = TextProcessor.split_text(text, chunk_size=project.chunk_size, overlap=project.chunk_overlap)
        total_chunks = len(chunks)

        def add_progress_callback(message: str, progress_ratio: float) -> None:
            _task_progress(
                task_manager,
                task_id,
                progress=32 + int(progress_ratio * 36),
                message=message,
                stage_label="Ingesting context",
            )

        episode_uuids = builder.add_text_batches(
            graph_id,
            chunks,
            batch_size=3,
            progress_callback=add_progress_callback,
        )

        _task_progress(
            task_manager,
            task_id,
            progress=68,
            message="Waiting for Zep to connect the stakeholders...",
            stage_label="Stakeholder discovery",
        )

        def wait_progress_callback(message: str, progress_ratio: float) -> None:
            _task_progress(
                task_manager,
                task_id,
                progress=68 + int(progress_ratio * 24),
                message=message,
                stage_label="Stakeholder discovery",
            )

        builder._wait_for_episodes(episode_uuids, wait_progress_callback)

        _task_progress(
            task_manager,
            task_id,
            progress=94,
            message="Fetching the first graph view...",
            stage_label="Finalizing preview",
        )
        graph_data = builder.get_graph_data(graph_id)

        project.status = ProjectStatus.GRAPH_COMPLETED
        ProjectManager.save_project(project)

        _task_progress(
            task_manager,
            task_id,
            status=TaskStatus.COMPLETED,
            progress=100,
            message="Stakeholder graph ready",
            stage_label="Graph ready",
            result={
                "project_id": project_id,
                "graph_id": graph_id,
                "node_count": int(graph_data.get("node_count") or 0),
                "edge_count": int(graph_data.get("edge_count") or 0),
                "chunk_count": total_chunks,
            },
        )
    except Exception as error:
        logger.error(f"Studyond graph build failed: {error}")
        logger.debug(traceback.format_exc())
        project = ProjectManager.get_project(project_id)
        if project:
            project.status = ProjectStatus.FAILED
            project.error = str(error)
            ProjectManager.save_project(project)
        _task_progress(
            task_manager,
            task_id,
            status=TaskStatus.FAILED,
            progress=100,
            message=f"Graph build failed: {error}",
            stage_label="Failed",
            error=traceback.format_exc(),
        )


@studyond_bp.route("/graph/start", methods=["POST"])
def start_studyond_graph():
    """
    Create a hidden MiroFish project from raw text, generate ontology, and start
    a real Zep-backed graph build for the thesis UI.
    """

    task_id: Optional[str] = None
    task_manager = TaskManager()

    try:
        payload = request.get_json() or {}
        seed_text = _string(payload.get("seed_text"))
        scenario_description = (
            _string(payload.get("scenario_description"))
            or _string(payload.get("scenario_prompt"))
            or DEFAULT_GRAPH_SCENARIO
        )
        project_name = _string(payload.get("project_name")) or "Studyond Thesis Graph"
        additional_context = _string(payload.get("additional_context"))

        if not seed_text:
            return jsonify({
                "success": False,
                "error": "Missing seed_text",
            }), 400

        project = ProjectManager.create_project(name=project_name)
        project.simulation_requirement = scenario_description
        project.total_text_length = len(seed_text)
        ProjectManager.save_project(project)
        ProjectManager.save_extracted_text(project.project_id, seed_text)

        task_id = task_manager.create_task(
            "studyond_graph_build",
            metadata={
                "project_id": project.project_id,
                "project_name": project.name,
            },
        )
        project.graph_build_task_id = task_id
        ProjectManager.save_project(project)

        _task_progress(
            task_manager,
            task_id,
            status=TaskStatus.PENDING,
            progress=2,
            message="Generating ontology from the Studyond seed text...",
            stage_label="Ontology generation",
        )

        context_path = ProjectManager._get_project_dir(project.project_id)
        with open(f"{context_path}/studyond_context.json", "w", encoding="utf-8") as context_file:
            json.dump(
                {
                    "scenario_description": scenario_description,
                    "project_name": project_name,
                    "seed_text_preview": seed_text[:4000],
                },
                context_file,
                ensure_ascii=False,
                indent=2,
            )

        generator = OntologyGenerator()
        ontology = generator.generate(
            document_texts=[seed_text],
            simulation_requirement=scenario_description,
            additional_context=additional_context or None,
        )

        project.ontology = {
            "entity_types": ontology.get("entity_types", []),
            "edge_types": ontology.get("edge_types", []),
        }
        project.analysis_summary = _string(ontology.get("analysis_summary")) or None
        project.status = ProjectStatus.ONTOLOGY_GENERATED
        ProjectManager.save_project(project)

        _task_progress(
            task_manager,
            task_id,
            status=TaskStatus.PROCESSING,
            progress=8,
            message="Ontology generated. Starting the thesis graph build...",
            stage_label="Ontology generated",
        )

        project.status = ProjectStatus.GRAPH_BUILDING
        ProjectManager.save_project(project)

        thread = threading.Thread(target=_run_graph_build, args=(project.project_id, task_id), daemon=True)
        thread.start()

        return jsonify({
            "success": True,
            "data": _task_response_payload(task_id),
        })

    except Exception as error:
        logger.error(f"Studyond graph start failed: {error}")
        logger.debug(traceback.format_exc())
        if task_id:
            _task_progress(
                task_manager,
                task_id,
                status=TaskStatus.FAILED,
                progress=100,
                message=f"Graph start failed: {error}",
                stage_label="Failed",
                error=traceback.format_exc(),
            )
        return jsonify({
            "success": False,
            "error": str(error),
        }), 500


@studyond_bp.route("/graph/task/<task_id>", methods=["GET"])
def get_studyond_graph_task(task_id: str):
    task_payload = _task_response_payload(task_id)
    if not task_payload:
        return jsonify({
            "success": False,
            "error": f"Task not found: {task_id}",
        }), 404

    return jsonify({
        "success": True,
        "data": task_payload,
    })


@studyond_bp.route("/graph/data/<graph_id>", methods=["GET"])
def get_studyond_graph_data(graph_id: str):
    try:
        if not Config.ZEP_API_KEY:
            return jsonify({
                "success": False,
                "error": "ZEP_API_KEY is not configured",
            }), 500

        builder = GraphBuilderService(api_key=Config.ZEP_API_KEY)
        graph_data = builder.get_graph_data(graph_id)
        preview = _build_preview_from_graph_data(graph_data)

        return jsonify({
            "success": True,
            "data": preview,
        })
    except Exception as error:
        logger.error(f"Studyond graph preview unavailable for {graph_id}: {error}")
        return jsonify({
            "success": False,
            "error": str(error),
        }), 500


@studyond_bp.route("/futures/prepare", methods=["POST"])
def prepare_studyond_future():
    """
    Accept a precomposed Studyond seed and store it in MiroFish without exposing
    the original upload-based UI.
    """

    try:
        payload = request.get_json() or {}

        seed_text = _string(payload.get("seed_text"))
        future_card = payload.get("future_card") if isinstance(payload.get("future_card"), dict) else {}
        scenario_description = (
            _string(payload.get("scenario_description"))
            or _string(payload.get("scenario_prompt"))
        )

        if not seed_text:
            return jsonify({
                "success": False,
                "error": "Missing seed_text"
            }), 400

        project_name = _string(future_card.get("thesis_title")) or "Studyond Future"
        project = ProjectManager.create_project(name=project_name)
        project.simulation_requirement = scenario_description or "Studyond future-self scenario"
        project.total_text_length = len(seed_text)
        ProjectManager.save_project(project)
        ProjectManager.save_extracted_text(project.project_id, seed_text)

        context_path = ProjectManager._get_project_dir(project.project_id)
        with open(f"{context_path}/studyond_context.json", "w", encoding="utf-8") as context_file:
            json.dump(
                {
                    "future_card": future_card,
                    "scenario_description": scenario_description,
                    "seed_text_preview": seed_text[:4000],
                },
                context_file,
                ensure_ascii=False,
                indent=2,
            )

        client = LLMClient()
        llm_result = client.chat_json(
            [
                {
                    "role": "system",
                    "content": (
                        "You are a Studyond future-path synthesizer inside the MiroFish backend. "
                        "Return only JSON."
                    ),
                },
                {
                    "role": "user",
                    "content": json.dumps(
                        {
                            "task": (
                                "Turn this thesis future into a calm, student-friendly future-self summary. "
                                "Stay grounded in the provided future card and scenario. "
                                "Do not mention internal simulation tooling."
                            ),
                            "future_card": future_card,
                            "scenario_description": scenario_description,
                            "seed_text_excerpt": seed_text[:12000],
                            "output_schema": {
                                "future_detail": {
                                    "hero_title": "string",
                                    "hero_summary": "string",
                                    "opening_note": "string",
                                    "why_this_path": "string",
                                    "future_self_intro": "string",
                                    "story_beat": "string",
                                    "persona_brief": "string",
                                    "milestones": [
                                        {
                                            "title": "string",
                                            "detail": "string",
                                        }
                                    ],
                                },
                                "suggested_prompts": ["string"],
                            },
                        },
                        ensure_ascii=False,
                        indent=2,
                    ),
                },
            ],
            temperature=0.4,
            max_tokens=1800,
        )

        if not isinstance(llm_result, dict):
            raise ValueError("Future synthesis returned an invalid payload")

        candidate_detail = llm_result.get("future_detail")
        if not isinstance(candidate_detail, dict):
            raise ValueError("Future synthesis did not return future_detail")

        detail = {**_fallback_detail(future_card), **candidate_detail}
        suggested_prompts = _list_of_strings(llm_result.get("suggested_prompts")) or _fallback_prompts(future_card)

        return jsonify({
            "success": True,
            "data": {
                "project_id": project.project_id,
                "mirofish_simulation_id": project.project_id,
                "future_detail": detail,
                "suggested_prompts": suggested_prompts,
            },
        })

    except Exception as error:
        logger.error(f"Studyond future prepare failed: {error}")
        return jsonify({
            "success": False,
            "error": str(error),
        }), 500
