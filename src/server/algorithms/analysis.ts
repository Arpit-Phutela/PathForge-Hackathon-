import { Graph, Schedule, BottleneckReport, BottleneckNode, Node } from "../../shared/types";
import { SystemicAlgorithmicFailure } from "../../shared/utils/errors";
import { AnalysisThresholds, AlgorithmConstants } from "./constants";

export interface NodeMetrics {
  nodeId: string;
  fanIn: number;
  fanOut: number;
  ancestorCount: number;
  successorCount: number;
  variance: number;
  standardDeviation: number;
  depth: number;
}

export interface GraphMetrics {
  nodes: Map<string, NodeMetrics>;
  projectVariance: number;
  projectStandardDeviation: number;
  criticalDensity: number;
  maxDepth: number;
  fragmentation: number; // Disconnected components
}

/**
 * Computes topological metrics, connectivity stats, and PERT variances for a graph.
 * @param graph - The directed acyclic graph.
 * @param schedule - The calculated schedule from CPM.
 * @returns {GraphMetrics} A full metric profile of the graph and its nodes.
 * @timeComplexity O(V * (V + E)) due to transitive closure computation.
 * @spaceComplexity O(V * (V + E)) for tracking ancestors and successors sets.
 */
export function computeGraphMetrics(graph: Graph, schedule: Schedule): GraphMetrics {
  const inDegree = new Map<string, number>();
  const outDegree = new Map<string, number>();
  const adjList = new Map<string, string[]>();
  const revAdjList = new Map<string, string[]>();

  for (const node of graph.nodes) {
    inDegree.set(node.id, 0);
    outDegree.set(node.id, 0);
    adjList.set(node.id, []);
    revAdjList.set(node.id, []);
  }

  for (const edge of graph.edges) {
    outDegree.set(edge.sourceId, outDegree.get(edge.sourceId)! + 1);
    inDegree.set(edge.targetId, inDegree.get(edge.targetId)! + 1);
    adjList.get(edge.sourceId)!.push(edge.targetId);
    revAdjList.get(edge.targetId)!.push(edge.sourceId);
  }

  // Transitive closure for successors and ancestors
  // O(V * (V + E))
  const successors = new Map<string, Set<string>>();
  const ancestors = new Map<string, Set<string>>();
  
  for (const node of graph.nodes) {
    successors.set(node.id, new Set());
    ancestors.set(node.id, new Set());
  }

  function getSuccessors(nodeId: string, visited: Set<string>): void {
    if (successors.get(nodeId)!.size > 0) return; // already computed
    for (const neighbor of adjList.get(nodeId)!) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        successors.get(nodeId)!.add(neighbor);
        getSuccessors(neighbor, visited);
        for (const succ of successors.get(neighbor)!) {
          successors.get(nodeId)!.add(succ);
        }
      }
    }
  }

  function getAncestors(nodeId: string, visited: Set<string>): void {
    if (ancestors.get(nodeId)!.size > 0) return;
    for (const parent of revAdjList.get(nodeId)!) {
      if (!visited.has(parent)) {
        visited.add(parent);
        ancestors.get(nodeId)!.add(parent);
        getAncestors(parent, visited);
        for (const anc of ancestors.get(parent)!) {
          ancestors.get(nodeId)!.add(anc);
        }
      }
    }
  }

  for (const node of graph.nodes) {
    getSuccessors(node.id, new Set<string>());
    getAncestors(node.id, new Set<string>());
  }

  const nodesMetrics = new Map<string, NodeMetrics>();
  let maxDepth = 0;

  for (const node of graph.nodes) {
    const isVirtual = node.type === "VIRTUAL_SOURCE" || node.type === "VIRTUAL_SINK";
    const isMilestone = node.type === "MILESTONE";
    
    let variance = 0;
    if (!isVirtual && !isMilestone && node.baseData) {
      const o = node.baseData.optimisticDuration;
      const p = node.baseData.pessimisticDuration;
      const stdDev = (p - o) / AlgorithmConstants.VARIANCE_DIVISOR;
      variance = stdDev * stdDev;
    }

    const ancCount = ancestors.get(node.id)!.size;
    if (ancCount > maxDepth) {
      maxDepth = ancCount;
    }

    nodesMetrics.set(node.id, {
      nodeId: node.id,
      fanIn: inDegree.get(node.id)!,
      fanOut: outDegree.get(node.id)!,
      ancestorCount: ancCount,
      successorCount: successors.get(node.id)!.size,
      variance,
      standardDeviation: Math.sqrt(variance),
      depth: ancCount,
    });
  }

  // Project variance: sum of variances along the critical path.
  // If multiple critical paths exist, take the max variance.
  let maxProjectVariance = 0;
  
  // To find max variance path, we can do a DP on the critical subgraph.
  // Create critical subgraph
  const criticalNodes = new Set(schedule.criticalPathIds);
  const critAdj = new Map<string, string[]>();
  for (const id of criticalNodes) {
    critAdj.set(id, []);
  }
  for (const edge of graph.edges) {
    if (criticalNodes.has(edge.sourceId) && criticalNodes.has(edge.targetId)) {
      critAdj.get(edge.sourceId)!.push(edge.targetId);
    }
  }

  const varCache = new Map<string, number>();
  function getCritVariance(nodeId: string): number {
    if (varCache.has(nodeId)) return varCache.get(nodeId)!;
    const nVar = nodesMetrics.get(nodeId)!.variance;
    let maxChildVar = 0;
    for (const child of critAdj.get(nodeId) || []) {
      const cv = getCritVariance(child);
      if (cv > maxChildVar) {
        maxChildVar = cv;
      }
    }
    const total = nVar + maxChildVar;
    varCache.set(nodeId, total);
    return total;
  }

  const virtualSourceId = graph.nodes.find(n => n.type === "VIRTUAL_SOURCE")?.id;
  if (virtualSourceId && criticalNodes.has(virtualSourceId)) {
    maxProjectVariance = getCritVariance(virtualSourceId);
  }

  // Critical Density
  const totalStandardTasks = graph.nodes.filter(n => n.type === "STANDARD").length;
  const criticalStandardTasks = schedule.criticalPathIds.filter(id => {
    const node = graph.nodes.find(n => n.id === id);
    return node?.type === "STANDARD";
  }).length;
  const criticalDensity = totalStandardTasks > 0 ? criticalStandardTasks / totalStandardTasks : 0;

  return {
    nodes: nodesMetrics,
    projectVariance: maxProjectVariance,
    projectStandardDeviation: Math.sqrt(maxProjectVariance),
    criticalDensity,
    maxDepth,
    fragmentation: graph.metadata.disconnectedComponents,
  };
}

/**
 * Detects bottlenecks in a project based on fan-in, fan-out, downstream impact, and criticality.
 * @param graph - The directed acyclic graph.
 * @param metrics - The pre-calculated metrics for the graph.
 * @param schedule - The schedule from CPM containing critical paths.
 * @returns {BottleneckReport} Collection of nodes classified as bottlenecks.
 * @timeComplexity O(V log V) to iterate and sort bottlenecks by impact.
 * @spaceComplexity O(V) to store bottlenecks array.
 */
export function detectBottlenecks(graph: Graph, metrics: GraphMetrics, schedule: Schedule): BottleneckReport {
  // Score = fanIn * w1 + fanOut * w2 + successorCount * w3 + isCritical ? w4 : 0
  // Sort by score
  const bottlenecks: BottleneckNode[] = [];
  
  for (const node of graph.nodes) {
    if (node.type === "MILESTONE" || node.type === "VIRTUAL_SOURCE" || node.type === "VIRTUAL_SINK") {
      continue;
    }
    
    const nodeMetrics = metrics.nodes.get(node.id)!;
    
    // Bottleneck conditions:
    if (
      nodeMetrics.fanIn >= AnalysisThresholds.HIGH_FAN_IN || 
      nodeMetrics.fanOut >= AnalysisThresholds.HIGH_FAN_OUT || 
      nodeMetrics.successorCount > (graph.nodes.length * AnalysisThresholds.HIGH_DOWNSTREAM_IMPACT_RATIO)
    ) {
      bottlenecks.push({
        nodeId: node.id,
        fanIn: nodeMetrics.fanIn,
        fanOut: nodeMetrics.fanOut,
        downstreamImpactCount: nodeMetrics.successorCount
      });
    }
  }

  // Sort by downstream impact descending
  bottlenecks.sort((a, b) => b.downstreamImpactCount - a.downstreamImpactCount);

  return { bottleneckNodes: bottlenecks };
}
