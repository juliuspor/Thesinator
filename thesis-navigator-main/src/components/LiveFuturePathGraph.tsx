import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { FutureGraphEdge, FutureGraphNode } from "@/services/futureSessions";

type GraphNodeType = FutureGraphNode["type"];

type SanitizedNode = FutureGraphNode & {
  displayLabel: string;
  displaySummary: string;
  labelWidth: number;
};

type SanitizedEdge = FutureGraphEdge & {
  source: string;
  target: string;
  displayLabel: string;
  pairIndex: number;
  pairTotal: number;
  isSelfLoop: boolean;
};

type ForceNode = d3.SimulationNodeDatum & SanitizedNode;
type ForceEdge = d3.SimulationLinkDatum<ForceNode> & SanitizedEdge;

const nodePriority: Record<GraphNodeType, number> = {
  student: 0,
  thesis: 1,
  company: 2,
  university: 3,
  supervisor: 4,
  expert: 5,
  organization: 6,
  other: 7,
};

const nodeColors: Record<GraphNodeType, string> = {
  student: "#111827",
  thesis: "#1d4ed8",
  company: "#0f766e",
  university: "#7c3aed",
  supervisor: "#c2410c",
  expert: "#be123c",
  organization: "#475569",
  other: "#6b7280",
};

const nullishValues = new Set(["null", "none", "undefined", "n/a", "na", "unknown"]);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const prettifyType = (type: GraphNodeType) =>
  type === "other" ? "Stakeholder" : type.charAt(0).toUpperCase() + type.slice(1);

const cleanText = (value: string | null | undefined) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed && !nullishValues.has(trimmed.toLowerCase()) ? trimmed : "";
};

const compactText = (value: string, maxLength: number) =>
  value.length <= maxLength ? value : `${value.slice(0, Math.max(0, maxLength - 1)).trim()}…`;

const getNodeBounds = (node: ForceNode) => {
  const x = node.x ?? 0;
  const y = node.y ?? 0;
  const circleRadius = 11;
  const labelStart = 18;
  const labelWidth = node.labelWidth;

  return {
    left: x - circleRadius,
    right: x + labelStart + labelWidth,
    top: y - 16,
    bottom: y + 16,
  };
};

const getBoundaryPointTowards = (node: ForceNode, targetX: number, targetY: number) => {
  const bounds = getNodeBounds(node);
  const centerX = (bounds.left + bounds.right) / 2;
  const centerY = (bounds.top + bounds.bottom) / 2;
  const dx = targetX - centerX;
  const dy = targetY - centerY;

  if (dx === 0 && dy === 0) {
    return { x: bounds.right, y: centerY };
  }

  const scaleX = dx > 0 ? (bounds.right - centerX) / dx : (bounds.left - centerX) / dx;
  const scaleY = dy > 0 ? (bounds.bottom - centerY) / dy : (bounds.top - centerY) / dy;
  const scale = Math.min(Math.abs(scaleX), Math.abs(scaleY));

  return {
    x: centerX + dx * scale,
    y: centerY + dy * scale,
  };
};

const getLinkGeometry = (link: ForceEdge) => {
  const source = typeof link.source === "string" ? null : link.source;
  const target = typeof link.target === "string" ? null : link.target;

  if (!source || !target) {
    return null;
  }

  const targetCenterX = target.x ?? 0;
  const targetCenterY = target.y ?? 0;
  const sourceCenterX = source.x ?? 0;
  const sourceCenterY = source.y ?? 0;

  const sourcePoint = getBoundaryPointTowards(source, targetCenterX, targetCenterY);
  const targetPoint = getBoundaryPointTowards(target, sourceCenterX, sourceCenterY);
  const sx = sourcePoint.x;
  const sy = sourcePoint.y;
  const tx = targetPoint.x;
  const ty = targetPoint.y;

  if (link.isSelfLoop) {
    const bounds = getNodeBounds(source);
    const loopRadius = 22;
    const startX = bounds.right - 6;
    const startY = sourceCenterY - 10;
    const endX = bounds.right - 6;
    const endY = sourceCenterY + 10;
    return {
      path: `M${startX},${startY} A${loopRadius},${loopRadius} 0 1,1 ${endX},${endY}`,
      labelX: bounds.right + 28,
      labelY: sourceCenterY,
    };
  }

  if (link.pairTotal <= 1) {
    return {
      path: `M${sx},${sy} L${tx},${ty}`,
      labelX: (sx + tx) / 2,
      labelY: (sy + ty) / 2,
    };
  }

  const dx = tx - sx;
  const dy = ty - sy;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;
  const midpointX = (sx + tx) / 2;
  const midpointY = (sy + ty) / 2;
  const spread = ((link.pairIndex / Math.max(1, link.pairTotal - 1)) - 0.5) * 2;
  const curveStrength = Math.max(30, Math.min(68, distance * 0.24));
  const offsetX = (-dy / distance) * spread * curveStrength;
  const offsetY = (dx / distance) * spread * curveStrength;
  const controlX = midpointX + offsetX;
  const controlY = midpointY + offsetY;

  return {
    path: `M${sx},${sy} Q${controlX},${controlY} ${tx},${ty}`,
    labelX: 0.25 * sx + 0.5 * controlX + 0.25 * tx,
    labelY: 0.25 * sy + 0.5 * controlY + 0.25 * ty,
  };
};

export const LiveFuturePathGraph = ({
  nodes,
  edges,
  isLive,
}: {
  nodes: FutureGraphNode[];
  edges: FutureGraphEdge[];
  isLive: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [graphSize, setGraphSize] = useState({ width: 0, height: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const preparedNodes = useMemo<SanitizedNode[]>(
    () =>
      [...nodes]
        .map((node) => {
          const displayLabel = cleanText(node.label) || `Unnamed ${prettifyType(node.type)}`;
          const displaySummary =
            cleanText(node.summary) ||
            `${prettifyType(node.type)} in the emerging thesis path around your future.`;
          const labelWidth = clamp(displayLabel.length * 7 + 26, 90, 210);

          return {
            ...node,
            displayLabel,
            displaySummary,
            labelWidth,
          };
        })
        .sort(
          (a, b) =>
            nodePriority[a.type] - nodePriority[b.type] ||
            a.displayLabel.localeCompare(b.displayLabel),
        )
        .slice(0, 10),
    [nodes],
  );

  const preparedEdges = useMemo<SanitizedEdge[]>(() => {
    const visibleNodeIds = new Set(preparedNodes.map((node) => node.id));
    const relevantEdges = edges
      .filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
      .slice(0, 18);

    const pairCounts = new Map<string, number>();
    for (const edge of relevantEdges) {
      const key =
        edge.source === edge.target ? edge.source : [edge.source, edge.target].sort().join("::");
      pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
    }

    const pairIndices = new Map<string, number>();
    return relevantEdges.map((edge) => {
      const key =
        edge.source === edge.target ? edge.source : [edge.source, edge.target].sort().join("::");
      const pairIndex = pairIndices.get(key) ?? 0;
      pairIndices.set(key, pairIndex + 1);

      return {
        ...edge,
        displayLabel: cleanText(edge.label) || "related to",
        pairIndex,
        pairTotal: pairCounts.get(key) ?? 1,
        isSelfLoop: edge.source === edge.target,
      };
    });
  }, [edges, preparedNodes]);

  const selectedNode = useMemo(
    () => preparedNodes.find((node) => node.id === selectedNodeId) ?? null,
    [preparedNodes, selectedNodeId],
  );

  const legendItems = useMemo(() => {
    const seen = new Set<GraphNodeType>();
    return preparedNodes.filter((node) => {
      if (seen.has(node.type)) {
        return false;
      }
      seen.add(node.type);
      return true;
    });
  }, [preparedNodes]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateSize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      setGraphSize((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      );
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const selectedStillExists = selectedNodeId
      ? preparedNodes.some((node) => node.id === selectedNodeId)
      : true;

    if (!selectedStillExists) {
      setSelectedNodeId(null);
    }
  }, [preparedNodes, selectedNodeId]);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement || graphSize.width === 0 || graphSize.height === 0 || preparedNodes.length === 0) {
      return;
    }

    const width = graphSize.width;
    const height = graphSize.height;
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const root = svg.append("g");

    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.75, 2.5])
        .on("zoom", (event) => {
          root.attr("transform", event.transform);
        }),
    );

    const simulationNodes: ForceNode[] = preparedNodes.map((node) => ({ ...node }));
    const simulationLinks: ForceEdge[] = preparedEdges.map((edge) => ({ ...edge }));

    const linkLayer = root.append("g").attr("stroke-linecap", "round");
    const nodeLayer = root.append("g");

    const linkSelection = linkLayer
      .selectAll("path")
      .data(simulationLinks)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#64748b")
      .attr("stroke-opacity", 0.55)
      .attr("stroke-width", 2.2);

    const linkLabelBackgroundSelection = linkLayer
      .selectAll("rect")
      .data(simulationLinks)
      .enter()
      .append("rect")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "rgba(255,255,255,0.92)")
      .attr("stroke", "rgba(148,163,184,0.22)")
      .attr("stroke-width", 1);

    const linkLabelSelection = linkLayer
      .selectAll("text")
      .data(simulationLinks)
      .enter()
      .append("text")
      .attr("fill", "#475569")
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-family", "system-ui, sans-serif")
      .text((link) => compactText(link.displayLabel, 22));

    const nodeSelection = nodeLayer
      .selectAll("g")
      .data(simulationNodes)
      .enter()
      .append("g")
      .style("cursor", "grab");

    const circleSelection = nodeSelection
      .append("circle")
      .attr("r", 11)
      .attr("fill", (node) => nodeColors[node.type])
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3);

    nodeSelection
      .append("rect")
      .attr("x", 18)
      .attr("y", -16)
      .attr("width", (node) => node.labelWidth)
      .attr("height", 32)
      .attr("rx", 16)
      .attr("fill", "rgba(255,255,255,0.96)")
      .attr("stroke", "rgba(148,163,184,0.22)");

    nodeSelection
      .append("text")
      .attr("x", 32)
      .attr("y", 5)
      .attr("fill", "#0f172a")
      .attr("font-size", 12)
      .attr("font-weight", 600)
      .attr("font-family", "system-ui, sans-serif")
      .text((node) => compactText(node.displayLabel, 24));

    const highlightSelection = (activeNodeId: string | null) => {
      circleSelection
        .attr("stroke", (node) => (node.id === activeNodeId ? "#0f172a" : "#ffffff"))
        .attr("stroke-width", (node) => (node.id === activeNodeId ? 4.5 : 3));

      linkSelection
        .attr("stroke", (link) => {
          const sourceId = typeof link.source === "string" ? link.source : link.source.id;
          const targetId = typeof link.target === "string" ? link.target : link.target.id;
          return activeNodeId && (sourceId === activeNodeId || targetId === activeNodeId)
            ? "#0f172a"
            : "#64748b";
        })
        .attr("stroke-opacity", (link) => {
          const sourceId = typeof link.source === "string" ? link.source : link.source.id;
          const targetId = typeof link.target === "string" ? link.target : link.target.id;
          return activeNodeId && (sourceId === activeNodeId || targetId === activeNodeId) ? 0.9 : 0.55;
        })
        .attr("stroke-width", (link) => {
          const sourceId = typeof link.source === "string" ? link.source : link.source.id;
          const targetId = typeof link.target === "string" ? link.target : link.target.id;
          return activeNodeId && (sourceId === activeNodeId || targetId === activeNodeId) ? 3.2 : 2.2;
        });

      linkLabelSelection
        .attr("fill", (link) => {
          const sourceId = typeof link.source === "string" ? link.source : link.source.id;
          const targetId = typeof link.target === "string" ? link.target : link.target.id;
          return activeNodeId && (sourceId === activeNodeId || targetId === activeNodeId)
            ? "#0f172a"
            : "#475569";
        })
        .attr("opacity", (link) => {
          const sourceId = typeof link.source === "string" ? link.source : link.source.id;
          const targetId = typeof link.target === "string" ? link.target : link.target.id;
          return activeNodeId && (sourceId === activeNodeId || targetId === activeNodeId) ? 1 : 0.88;
        });
    };

    highlightSelection(selectedNodeId);

    const simulation = d3
      .forceSimulation(simulationNodes)
      .force(
        "link",
        d3
          .forceLink<ForceNode, ForceEdge>(simulationLinks)
          .id((node) => node.id)
          .distance((link) => (link.isSelfLoop ? 72 : 120 + (link.pairTotal - 1) * 24)),
      )
      .force("charge", d3.forceManyBody<ForceNode>().strength(-620))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide<ForceNode>().radius((node) =>
          clamp(node.displayLabel.length * 3.2 + 42, 52, 112),
        ),
      )
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    nodeSelection
      .call(
        d3
          .drag<SVGGElement, ForceNode>()
          .on("start", (event, node) => {
            if (!event.active) {
              simulation.alphaTarget(0.25).restart();
            }
            node.fx = node.x;
            node.fy = node.y;
          })
          .on("drag", (event, node) => {
            node.fx = event.x;
            node.fy = event.y;
          })
          .on("end", (event, node) => {
            if (!event.active) {
              simulation.alphaTarget(0);
            }
            node.fx = null;
            node.fy = null;
          }),
      )
      .on("click", (event, node) => {
        event.stopPropagation();
        setSelectedNodeId(node.id);
        highlightSelection(node.id);
      });

    svg.on("click", () => {
      setSelectedNodeId(null);
      highlightSelection(null);
    });

    simulation.on("tick", () => {
      for (const node of simulationNodes) {
        node.x = clamp(node.x ?? width / 2, 30, width - 240);
        node.y = clamp(node.y ?? height / 2, 30, height - 30);
      }

      linkSelection.attr("d", (link) => getLinkGeometry(link)?.path ?? "");
      linkLabelSelection.each(function (link) {
        const geometry = getLinkGeometry(link);
        if (!geometry) {
          return;
        }

        d3.select(this).attr("x", geometry.labelX).attr("y", geometry.labelY);
      });
      linkLabelBackgroundSelection.each(function (link, index) {
        const geometry = getLinkGeometry(link);
        if (!geometry) {
          return;
        }

        const textNode = linkLabelSelection.nodes()[index];
        const bounds = textNode.getBBox();
        d3.select(this)
          .attr("x", geometry.labelX - bounds.width / 2 - 6)
          .attr("y", geometry.labelY - bounds.height / 2 - 3)
          .attr("width", bounds.width + 12)
          .attr("height", bounds.height + 6);
      });
      nodeSelection.attr("transform", (node) => `translate(${node.x ?? width / 2},${node.y ?? height / 2})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graphSize.height, graphSize.width, preparedEdges, preparedNodes, selectedNodeId]);

  return (
    <div className="space-y-4">
      {preparedNodes.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-muted/30">
          <p className="ds-small text-muted-foreground">
            Your map will appear as soon as the first connections are ready.
          </p>
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            className="relative h-[420px] overflow-hidden rounded-[1.5rem] border border-border"
            style={{
              backgroundColor: "#fafaf9",
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.28) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          >
            <svg ref={svgRef} className="h-full w-full" />

            <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-background/95 px-3 py-1 ds-caption text-muted-foreground shadow-sm">
                Drag to rearrange the map
              </span>
              {isLive && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 ds-caption text-primary shadow-sm">
                  Updating now
                </span>
              )}
            </div>

            <div className="pointer-events-none absolute bottom-4 left-4 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
              {legendItems.map((node) => (
                <span
                  key={node.type}
                  className="rounded-full border border-border bg-background/95 px-3 py-1 ds-caption text-foreground shadow-sm"
                >
                  <span
                    className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: nodeColors[node.type] }}
                  />
                  {prettifyType(node.type)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-[1.25rem] border border-border bg-card p-4 shadow-sm">
              <p className="ds-caption uppercase tracking-[0.16em] text-muted-foreground">Selected connection</p>
              {selectedNode ? (
                <>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: nodeColors[selectedNode.type] }}
                    />
                    <span className="rounded-full bg-muted px-3 py-1 ds-caption text-muted-foreground">
                      {prettifyType(selectedNode.type)}
                    </span>
                  </div>
                  <p className="mt-3 ds-label text-foreground">{selectedNode.displayLabel}</p>
                  <p className="mt-2 ds-small text-muted-foreground">{selectedNode.displaySummary}</p>
                </>
              ) : (
                <p className="mt-3 ds-small text-muted-foreground">
                  Click any point on the map to see who they are and why they matter for this path.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
