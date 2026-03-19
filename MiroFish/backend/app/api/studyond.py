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
from ..services.simulation_manager import SimulationManager, SimulationStatus
from ..services.simulation_runner import RunnerStatus, SimulationRunner
from ..services.text_processor import TextProcessor
from ..utils.llm_client import LLMClient
from ..utils.logger import get_logger

logger = get_logger("mirofish.api.studyond")

DEFAULT_GRAPH_SCENARIO = (
    "Build a stakeholder-first thesis ecosystem graph for a five-year thesis-to-career journey. "
    "Capture the student, thesis directions, companies, universities, supervisors, experts, "
    "and adjacent organizations that shape the path."
)

DEFAULT_SWARM_SCENARIO = (
    "Simulate a thesis-to-career future around this student's top thesis directions. "
    "Model how the student, supervisors, experts, universities, and companies influence the path. "
    "Keep the run grounded, practical, and useful for a student-facing live future view."
)
DEFAULT_SWARM_PLATFORM = "parallel"
DEFAULT_SWARM_MAX_ROUNDS = 8


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


def _clamp_progress(value: Any) -> int:
    if isinstance(value, (int, float)):
        return max(0, min(100, int(round(value))))
    return 0


def _normalize_action(entry: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "round_num": int(entry.get("round_num") or 0),
        "timestamp": _string(entry.get("timestamp")) or None,
        "platform": _string(entry.get("platform")) or None,
        "agent_id": int(entry.get("agent_id") or 0),
        "agent_name": _string(entry.get("agent_name")) or "Agent",
        "action_type": _string(entry.get("action_type")) or "ACTION",
        "action_args": entry.get("action_args") if isinstance(entry.get("action_args"), dict) else {},
        "result": _string(entry.get("result")) or None,
        "success": entry.get("success") is not False,
    }


def _swarm_status_from_state(
    task_status: Optional[str],
    runner_status: Optional[str],
    simulation_status: Optional[str],
) -> str:
    if runner_status == RunnerStatus.FAILED.value or task_status == TaskStatus.FAILED.value:
        return "failed"
    if runner_status == RunnerStatus.RUNNING.value:
        return "running"
    if runner_status in {
        RunnerStatus.COMPLETED.value,
        RunnerStatus.STOPPED.value,
        RunnerStatus.PAUSED.value,
    }:
        return "ready"
    if task_status in {TaskStatus.PENDING.value, TaskStatus.PROCESSING.value}:
        return "preparing"
    if simulation_status == SimulationStatus.FAILED.value:
        return "failed"
    if simulation_status in {
        SimulationStatus.PREPARING.value,
        SimulationStatus.READY.value,
        SimulationStatus.RUNNING.value,
        SimulationStatus.PAUSED.value,
        SimulationStatus.COMPLETED.value,
    }:
        return "preparing"
    return "queued"


def _swarm_stage_label(
    task: Optional[Any],
    runner_status: Optional[str],
    derived_status: str,
) -> Optional[str]:
    if runner_status == RunnerStatus.RUNNING.value:
        return "Future path running live"
    if runner_status in {
        RunnerStatus.COMPLETED.value,
        RunnerStatus.STOPPED.value,
        RunnerStatus.PAUSED.value,
    }:
        return "Future path ready"

    if task:
        progress_detail = task.progress_detail if isinstance(task.progress_detail, dict) else {}
        stage_label = _string(progress_detail.get("stage_label"))
        if stage_label:
            return stage_label
        task_message = _string(task.message)
        if task_message:
            return task_message

    if derived_status == "queued":
        return "Waiting for stakeholder graph"
    if derived_status == "preparing":
        return "Preparing agents"
    if derived_status == "failed":
        return "Swarm failed"
    return None


def _swarm_message(
    task: Optional[Any],
    runner_state: Optional[Dict[str, Any]],
    derived_status: str,
) -> Optional[str]:
    if runner_state and runner_state.get("runner_status") == RunnerStatus.RUNNING.value:
        total_actions = int(runner_state.get("total_actions_count") or 0)
        if total_actions > 0:
            return f"The live future path is running now with {total_actions} agent actions so far."
        return "The live future path is running now."

    if task:
        task_message = _string(task.message)
        if task_message:
            return task_message

    if derived_status == "queued":
        return "The stakeholder graph is still building. The swarm will start next."
    if derived_status == "preparing":
        return "MiroFish is preparing the agents and simulation world."
    if derived_status == "ready":
        return "The live future path finished and is ready to explore."
    if derived_status == "failed":
        return "The live future path could not be completed."
    return None


def _swarm_progress(
    task: Optional[Any],
    runner_state: Optional[Dict[str, Any]],
    derived_status: str,
) -> int:
    if runner_state:
        runner_status = _string(runner_state.get("runner_status"))
        if runner_status in {
            RunnerStatus.RUNNING.value,
            RunnerStatus.COMPLETED.value,
            RunnerStatus.STOPPED.value,
            RunnerStatus.PAUSED.value,
        }:
            if derived_status == "ready":
                return 100
            return _clamp_progress(runner_state.get("progress_percent"))

    if task:
        return _clamp_progress(getattr(task, "progress", 0))

    if derived_status == "ready":
        return 100
    return 0


def _swarm_events(
    task: Optional[Any],
    runner_state: Optional[Dict[str, Any]],
    derived_status: str,
    stage_label: Optional[str],
    error: Optional[str],
) -> List[Dict[str, Any]]:
    events: List[Dict[str, Any]] = []

    if task and isinstance(task.events, list):
        for entry in task.events:
            if not isinstance(entry, dict):
                continue
            events.append({
                "timestamp": _string(entry.get("timestamp")) or None,
                "message": _string(entry.get("message")) or None,
                "stage_label": _string(entry.get("stage_label")) or None,
                "status": _string(entry.get("status")) or None,
                "progress": _clamp_progress(entry.get("progress")),
                "error": _string(entry.get("error")) or None,
            })

    if runner_state:
        runner_status = _string(runner_state.get("runner_status"))
        if runner_status:
            message = _swarm_message(None, runner_state, derived_status)
            synthetic_event = {
                "timestamp": _string(runner_state.get("updated_at")) or _string(runner_state.get("started_at")) or None,
                "message": message,
                "stage_label": stage_label,
                "status": runner_status,
                "progress": _swarm_progress(None, runner_state, derived_status),
                "error": _string(runner_state.get("error")) or error,
            }
            if not events or events[-1] != synthetic_event:
                events.append(synthetic_event)

    if not events and stage_label:
        events.append({
            "timestamp": None,
            "message": _swarm_message(None, None, derived_status),
            "stage_label": stage_label,
            "status": derived_status,
            "progress": _swarm_progress(None, None, derived_status),
            "error": error,
        })

    return events


def _swarm_response_payload(simulation_id: str, prepare_task_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    simulation_manager = SimulationManager()
    simulation = simulation_manager.get_simulation(simulation_id)
    task = TaskManager().get_task(prepare_task_id) if prepare_task_id else None
    run_state = SimulationRunner.get_run_state(simulation_id)
    run_payload = run_state.to_detail_dict() if run_state else None

    if not simulation and not task and not run_payload:
        return None

    task_status = task.status.value if task else None
    runner_status = _string(run_payload.get("runner_status")) if run_payload else None
    simulation_status = simulation.status.value if simulation else None
    derived_status = _swarm_status_from_state(task_status, runner_status, simulation_status)
    stage_label = _swarm_stage_label(task, runner_status, derived_status)
    error = (
        _string(run_payload.get("error")) if run_payload else None
    ) or (task.error if task else None) or (simulation.error if simulation else None)
    latest_actions = []
    if run_payload and isinstance(run_payload.get("recent_actions"), list):
        latest_actions = [
            _normalize_action(action)
            for action in run_payload.get("recent_actions", [])[:10]
            if isinstance(action, dict)
        ]

    return {
        "status": derived_status,
        "stage_label": stage_label,
        "progress": _swarm_progress(task, run_payload, derived_status),
        "simulation_id": simulation_id,
        "prepare_task_id": prepare_task_id,
        "runner_status": runner_status,
        "latest_actions": latest_actions,
        "events": _swarm_events(task, run_payload, derived_status, stage_label, error),
        "error": error,
        "metrics": {
            "twitter_actions_count": int(run_payload.get("twitter_actions_count") or 0) if run_payload else 0,
            "reddit_actions_count": int(run_payload.get("reddit_actions_count") or 0) if run_payload else 0,
            "total_actions_count": int(run_payload.get("total_actions_count") or 0) if run_payload else 0,
        },
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


def _run_swarm_prepare_and_start(
    project_id: str,
    graph_id: str,
    simulation_id: str,
    task_id: str,
    *,
    simulation_requirement: str,
    max_rounds: int,
    platform: str,
    enable_graph_memory_update: bool,
) -> None:
    task_manager = TaskManager()
    simulation_manager = SimulationManager()

    try:
        project = ProjectManager.get_project(project_id)
        if not project:
            raise ValueError(f"Project not found: {project_id}")

        document_text = ProjectManager.get_extracted_text(project_id)
        if not document_text:
            raise ValueError("Extracted text content not found")

        project.simulation_requirement = simulation_requirement or project.simulation_requirement or DEFAULT_SWARM_SCENARIO
        ProjectManager.save_project(project)

        _task_progress(
            task_manager,
            task_id,
            status=TaskStatus.PROCESSING,
            progress=6,
            message="Preparing the live future path...",
            stage_label="Preparing agents",
        )

        stage_labels = {
            "reading": "Reading graph",
            "generating_profiles": "Preparing agents",
            "generating_config": "Configuring simulation",
            "copying_scripts": "Finalizing run",
        }
        stage_weights = {
            "reading": (8, 28),
            "generating_profiles": (28, 72),
            "generating_config": (72, 90),
            "copying_scripts": (90, 96),
        }

        def progress_callback(stage: str, progress: int, message: str, **kwargs: Any) -> None:
            start, end = stage_weights.get(stage, (8, 96))
            current_progress = start + int((end - start) * max(0, min(100, progress)) / 100)
            current_item = kwargs.get("current")
            total_items = kwargs.get("total")
            detail_message = message
            if isinstance(current_item, int) and isinstance(total_items, int) and total_items > 0:
                detail_message = f"{current_item}/{total_items} - {message}"

            _task_progress(
                task_manager,
                task_id,
                status=TaskStatus.PROCESSING,
                progress=current_progress,
                message=detail_message,
                stage_label=stage_labels.get(stage, "Preparing swarm"),
            )

        simulation_manager.prepare_simulation(
            simulation_id=simulation_id,
            simulation_requirement=project.simulation_requirement,
            document_text=document_text,
            use_llm_for_profiles=True,
            progress_callback=progress_callback,
            parallel_profile_count=3,
        )

        _task_progress(
            task_manager,
            task_id,
            status=TaskStatus.PROCESSING,
            progress=97,
            message="Agent world ready. Starting the live future path...",
            stage_label="Starting live run",
        )

        run_state = SimulationRunner.start_simulation(
            simulation_id=simulation_id,
            platform=platform,
            max_rounds=max_rounds,
            enable_graph_memory_update=enable_graph_memory_update,
            graph_id=graph_id,
        )

        _task_progress(
            task_manager,
            task_id,
            status=TaskStatus.COMPLETED,
            progress=100,
            message="Future path running live",
            stage_label="Future path running live",
            result={
                "simulation_id": simulation_id,
                "runner_status": run_state.runner_status.value,
                "process_pid": run_state.process_pid,
                "max_rounds": max_rounds,
            },
        )
    except Exception as error:
        logger.error(f"Studyond swarm failed: {error}")
        logger.debug(traceback.format_exc())

        simulation_state = simulation_manager.get_simulation(simulation_id)
        if simulation_state:
            simulation_state.status = SimulationStatus.FAILED
            simulation_state.error = str(error)
            simulation_manager._save_simulation_state(simulation_state)

        _task_progress(
            task_manager,
            task_id,
            status=TaskStatus.FAILED,
            progress=100,
            message=f"Future path failed: {error}",
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


@studyond_bp.route("/swarm/start", methods=["POST"])
def start_studyond_swarm():
    task_manager = TaskManager()

    try:
        payload = request.get_json() or {}
        project_id = _string(payload.get("project_id"))
        graph_id = _string(payload.get("graph_id"))
        simulation_requirement = _string(payload.get("simulation_requirement")) or DEFAULT_SWARM_SCENARIO
        requested_platform = _string(payload.get("platform")) or DEFAULT_SWARM_PLATFORM
        platform = requested_platform if requested_platform in {"twitter", "reddit", "parallel"} else DEFAULT_SWARM_PLATFORM
        max_rounds = payload.get("max_rounds", DEFAULT_SWARM_MAX_ROUNDS)
        try:
            max_rounds = int(max_rounds)
        except (TypeError, ValueError):
            max_rounds = DEFAULT_SWARM_MAX_ROUNDS
        max_rounds = max(1, min(24, max_rounds))
        enable_graph_memory_update = payload.get("enable_graph_memory_update", True) is not False

        if not project_id:
            return jsonify({
                "success": False,
                "error": "Missing project_id",
            }), 400

        project = ProjectManager.get_project(project_id)
        if not project:
            return jsonify({
                "success": False,
                "error": f"Project not found: {project_id}",
            }), 404

        graph_id = graph_id or project.graph_id
        if not graph_id:
            return jsonify({
                "success": False,
                "error": "Missing graph_id",
            }), 400

        simulation_manager = SimulationManager()
        simulation = simulation_manager.create_simulation(
            project_id=project_id,
            graph_id=graph_id,
            enable_twitter=platform in {"twitter", "parallel"},
            enable_reddit=platform in {"reddit", "parallel"},
        )

        task_id = task_manager.create_task(
            "studyond_swarm_prepare",
            metadata={
                "project_id": project_id,
                "simulation_id": simulation.simulation_id,
            },
        )

        _task_progress(
            task_manager,
            task_id,
            status=TaskStatus.PENDING,
            progress=2,
            message="Scheduling the live future path...",
            stage_label="Preparing agents",
        )

        thread = threading.Thread(
            target=_run_swarm_prepare_and_start,
            args=(project_id, graph_id, simulation.simulation_id, task_id),
            kwargs={
                "simulation_requirement": simulation_requirement,
                "max_rounds": max_rounds,
                "platform": platform,
                "enable_graph_memory_update": enable_graph_memory_update,
            },
            daemon=True,
        )
        thread.start()

        payload = _swarm_response_payload(simulation.simulation_id, task_id)
        return jsonify({
            "success": True,
            "data": payload,
        })
    except Exception as error:
        logger.error(f"Studyond swarm start failed: {error}")
        logger.debug(traceback.format_exc())
        return jsonify({
            "success": False,
            "error": str(error),
        }), 500


@studyond_bp.route("/swarm/status/<simulation_id>", methods=["GET"])
def get_studyond_swarm_status(simulation_id: str):
    prepare_task_id = _string(request.args.get("prepare_task_id"))
    payload = _swarm_response_payload(simulation_id, prepare_task_id)
    if not payload:
        return jsonify({
            "success": False,
            "error": f"Swarm not found: {simulation_id}",
        }), 404

    return jsonify({
        "success": True,
        "data": payload,
    })


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
        swarm_highlights = payload.get("swarm_highlights") if isinstance(payload.get("swarm_highlights"), list) else []
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
                            "swarm_highlights": swarm_highlights[:8],
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
                "mirofish_project_id": project.project_id,
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
