import { ExecutionPlan, ScenarioMutation, ScenarioResult, Graph, Schedule, PlannerProposal } from "../../shared/types";
import { validateGraphStructure, detectCycles } from "./graphValidation";
import { topologicalSort } from "./topologicalSort";
import { calculateCPM } from "./cpm";
import { computeDeterministicAnalysis } from "./scoring";

class UnionFind {
  private parent: Map<string, string> = new Map();
  
  constructor(nodes: string[]) {
    for (const node of nodes) {
      this.parent.set(node, node);
    }
  }
  
  find(i: string): string {
    if (this.parent.get(i) === i) {
      return i;
    }
    const root = this.find(this.parent.get(i)!);
    this.parent.set(i, root);
    return root;
  }
  
  union(i: string, j: string): void {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent.set(rootI, rootJ);
    }
  }
}

/**
 * Applies a single mutation to the given graph.
 */
function applyMutation(graph: Graph, mutation: ScenarioMutation) {
  switch(mutation.type) {
    case "DELAY_TASK": {
      const node = graph.nodes.find(n => n.id === mutation.taskId);
      if (node && node.baseData) {
        node.baseData.optimisticDuration += mutation.delayDays;
        node.baseData.mostLikelyDuration += mutation.delayDays;
        node.baseData.pessimisticDuration += mutation.delayDays;
      }
      break;
    }
    case "SHORTEN_TASK": {
      const node = graph.nodes.find(n => n.id === mutation.taskId);
      if (node && node.baseData) {
        node.baseData.optimisticDuration = Math.max(0, node.baseData.optimisticDuration - mutation.shortenDays);
        node.baseData.mostLikelyDuration = Math.max(0, node.baseData.mostLikelyDuration - mutation.shortenDays);
        node.baseData.pessimisticDuration = Math.max(0, node.baseData.pessimisticDuration - mutation.shortenDays);
      }
      break;
    }
    case "REMOVE_DEPENDENCY": {
      graph.edges = graph.edges.filter(e => !(e.sourceId === mutation.fromTaskId && e.targetId === mutation.toTaskId));
      break;
    }
    case "ADD_DEPENDENCY": {
      const exists = graph.edges.some(e => e.sourceId === mutation.fromTaskId && e.targetId === mutation.toTaskId);
      if (!exists) {
        graph.edges.push({
          sourceId: mutation.fromTaskId,
          targetId: mutation.toTaskId,
          type: "FINISH_TO_START"
        });
      }
      break;
    }
    case "MARK_BLOCKED": {
      const node = graph.nodes.find(n => n.id === mutation.taskId);
      if (node && node.baseData) {
        node.baseData.optimisticDuration = 9999;
        node.baseData.mostLikelyDuration = 9999;
        node.baseData.pessimisticDuration = 9999;
      }
      break;
    }
    case "MARK_COMPLETED": {
      const node = graph.nodes.find(n => n.id === mutation.taskId);
      if (node && node.baseData) {
        node.baseData.optimisticDuration = 0;
        node.baseData.mostLikelyDuration = 0;
        node.baseData.pessimisticDuration = 0;
      }
      break;
    }
  }
}

/**
 * Rebuilds virtual source/sink links and metadata after mutations
 */
function rebuildGraphStructure(graph: Graph) {
  const virtualSource = graph.nodes.find(n => n.type === "VIRTUAL_SOURCE");
  const virtualSink = graph.nodes.find(n => n.type === "VIRTUAL_SINK");
  
  if (!virtualSource || !virtualSink) return; // Skip if malformed, validation will catch it
  
  // Remove existing edges involving virtual nodes
  graph.edges = graph.edges.filter(e => e.sourceId !== virtualSource.id && e.targetId !== virtualSink.id);
  
  const inDegree = new Map<string, number>();
  const outDegree = new Map<string, number>();
  const realNodeIds = graph.nodes.filter(n => n.type === "STANDARD" || n.type === "MILESTONE").map(n => n.id);
  
  for (const id of realNodeIds) {
    inDegree.set(id, 0);
    outDegree.set(id, 0);
  }
  
  for (const edge of graph.edges) {
    if (inDegree.has(edge.targetId)) {
      inDegree.set(edge.targetId, inDegree.get(edge.targetId)! + 1);
    }
    if (outDegree.has(edge.sourceId)) {
      outDegree.set(edge.sourceId, outDegree.get(edge.sourceId)! + 1);
    }
  }
  
  // Add edges from virtual source to true roots
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) {
      graph.edges.push({
        sourceId: virtualSource.id,
        targetId: id,
        type: "FINISH_TO_START"
      });
    }
  }
  
  // Add edges from true terminals to virtual sink
  for (const [id, deg] of outDegree.entries()) {
    if (deg === 0) {
      graph.edges.push({
        sourceId: id,
        targetId: virtualSink.id,
        type: "FINISH_TO_START"
      });
    }
  }
  
  // Recompute disconnected components among real nodes
  const uf = new UnionFind(realNodeIds);
  for (const edge of graph.edges) {
    if (edge.sourceId !== virtualSource.id && edge.targetId !== virtualSink.id) {
      uf.union(edge.sourceId, edge.targetId);
    }
  }
  
  const uniqueRoots = new Set<string>();
  for (const id of realNodeIds) {
    uniqueRoots.add(uf.find(id));
  }
  
  graph.metadata = {
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    disconnectedComponents: uniqueRoots.size
  };
}

/**
 * Deterministic Scenario Sandbox.
 * Creates an immutable clone of the plan, applies mutations, and fully recalculates.
 */
export function executeScenario(
  originalPlan: ExecutionPlan,
  mutations: ScenarioMutation[],
  proposal: PlannerProposal
): ScenarioResult {
  // 1. Clone immutably
  const graph: Graph = JSON.parse(JSON.stringify(originalPlan.roadmap.graph));
  
  // 2. Apply mutations
  for (const mutation of mutations) {
    applyMutation(graph, mutation);
  }
  
  // 3. Rebuild graph metadata
  rebuildGraphStructure(graph);
  
  // 4. Run validation
  validateGraphStructure(graph);
  
  // 5. Detect cycles
  detectCycles(graph);
  
  // 6. Run Topological Sort
  topologicalSort(graph);
  
  // 7. Execute CPM
  const schedule = calculateCPM(graph);
  
  // 8. Execute Analysis & Heuristics
  const analysisOutput = computeDeterministicAnalysis(graph, schedule, proposal);
  
  const simulatedPlan: ExecutionPlan = {
    roadmap: {
      graph,
      schedule
    },
    analysis: {
      feasibility: analysisOutput.feasibility,
      confidence: analysisOutput.confidence,
      bottlenecks: analysisOutput.bottlenecks,
      risks: originalPlan.analysis.risks, // Maintain existing risks, could append scenario risks
      optimizations: originalPlan.analysis.optimizations
    }
  };
  
  const durationDelta = schedule.projectDuration - originalPlan.roadmap.schedule.projectDuration;
  const feasibilityDelta = analysisOutput.feasibility.score - originalPlan.analysis.feasibility.score;
  const originalCP = [...originalPlan.roadmap.schedule.criticalPathIds].sort();
  const newCP = [...schedule.criticalPathIds].sort();
  const criticalPathChanged = JSON.stringify(originalCP) !== JSON.stringify(newCP);
  
  return {
    simulatedPlan,
    delta: {
      durationDelta,
      feasibilityDelta,
      newRisks: [],
      criticalPathChanged
    }
  };
}
