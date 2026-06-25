import { Graph, Schedule, CPMResult } from "../../shared/types";
import { topologicalSort } from "./topologicalSort";
import { ValidationError, SystemicAlgorithmicFailure } from "../../shared/utils/errors";

const EPSILON = 1e-9;

/**
 * Executes the Critical Path Method on a validated DAG.
 * Performs forward and backward passes calculating ES, EF, LS, LF, Float.
 */
export function calculateCPM(graph: Graph): Schedule {
  // 1. Validate and Calculate PERT Durations
  const TE = new Map<string, number>();
  
  let virtualSinkId: string | null = null;
  let virtualSourceId: string | null = null;
  
  for (const node of graph.nodes) {
    if (node.type === "VIRTUAL_SOURCE") {
      virtualSourceId = node.id;
      TE.set(node.id, 0);
    } else if (node.type === "VIRTUAL_SINK") {
      virtualSinkId = node.id;
      TE.set(node.id, 0);
    } else if (node.type === "MILESTONE") {
      if (
        node.baseData?.optimisticDuration !== 0 || 
        node.baseData?.mostLikelyDuration !== 0 || 
        node.baseData?.pessimisticDuration !== 0
      ) {
        throw new ValidationError(`Milestone ${node.id} must have exactly 0 duration.`);
      }
      TE.set(node.id, 0);
    } else {
      const data = node.baseData;
      if (!data) throw new ValidationError(`Node ${node.id} missing baseData.`);
      
      if (data.optimisticDuration < 0 || data.mostLikelyDuration < 0 || data.pessimisticDuration < 0) {
        throw new ValidationError(`Node ${node.id} has negative duration values.`);
      }
      if (data.optimisticDuration > data.mostLikelyDuration || data.mostLikelyDuration > data.pessimisticDuration) {
        throw new ValidationError(`Node ${node.id} violates duration bounds: optimistic <= mostLikely <= pessimistic.`);
      }
      
      const expectedTime = (data.optimisticDuration + 4 * data.mostLikelyDuration + data.pessimisticDuration) / 6;
      TE.set(node.id, expectedTime);
    }
  }
  
  if (!virtualSinkId || !virtualSourceId) {
    throw new ValidationError("Graph is missing VIRTUAL_SOURCE or VIRTUAL_SINK.");
  }
  
  // 2. Topological Sort
  const sortedNodes = topologicalSort(graph);
  
  // 3. Adjacency lists for fast lookup
  const predecessors = new Map<string, string[]>();
  const successors = new Map<string, string[]>();
  
  for (const node of graph.nodes) {
    predecessors.set(node.id, []);
    successors.set(node.id, []);
  }
  
  for (const edge of graph.edges) {
    predecessors.get(edge.targetId)!.push(edge.sourceId);
    successors.get(edge.sourceId)!.push(edge.targetId);
  }
  
  // 4. Forward Pass
  const ES = new Map<string, number>();
  const EF = new Map<string, number>();
  
  for (const nodeId of sortedNodes) {
    const preds = predecessors.get(nodeId)!;
    let maxEF = 0;
    for (const p of preds) {
      const pEF = EF.get(p)!;
      if (pEF > maxEF) {
        maxEF = pEF;
      }
    }
    const es = maxEF;
    const ef = es + TE.get(nodeId)!;
    ES.set(nodeId, es);
    EF.set(nodeId, ef);
  }
  
  const projectDuration = EF.get(virtualSinkId)!;
  
  // 5. Backward Pass
  const LS = new Map<string, number>();
  const LF = new Map<string, number>();
  
  const reversedNodes = [...sortedNodes].reverse();
  
  for (const nodeId of reversedNodes) {
    const succs = successors.get(nodeId)!;
    let minLS = projectDuration;
    
    if (succs.length > 0) {
      let tempMin = Infinity;
      for (const s of succs) {
        const sLS = LS.get(s)!;
        if (sLS < tempMin) {
          tempMin = sLS;
        }
      }
      minLS = tempMin;
    }
    
    const lf = minLS;
    const ls = lf - TE.get(nodeId)!;
    LF.set(nodeId, lf);
    LS.set(nodeId, ls);
  }
  
  // 6. Float and Critical Path
  const cpmResults: CPMResult[] = [];
  const criticalPathIds: string[] = [];
  
  for (const nodeId of sortedNodes) {
    const es = ES.get(nodeId)!;
    const ef = EF.get(nodeId)!;
    const ls = LS.get(nodeId)!;
    const lf = LF.get(nodeId)!;
    
    const succs = successors.get(nodeId)!;
    let minSuccES = projectDuration;
    if (succs.length > 0) {
      let tempMin = Infinity;
      for (const s of succs) {
        tempMin = Math.min(tempMin, ES.get(s)!);
      }
      minSuccES = tempMin;
    }
    
    const totalFloatRaw = ls - es;
    const freeFloatRaw = minSuccES - ef;
    
    // Invariant check
    if (es > ef + EPSILON || ls > lf + EPSILON) {
      throw new SystemicAlgorithmicFailure(`Invariant violated for node ${nodeId}: Start > Finish`);
    }
    if (totalFloatRaw < -EPSILON || freeFloatRaw < -EPSILON) {
      throw new SystemicAlgorithmicFailure(`Invariant violated for node ${nodeId}: Float < 0`);
    }
    
    const totalFloat = totalFloatRaw < 0 ? 0 : totalFloatRaw;
    const freeFloat = freeFloatRaw < 0 ? 0 : freeFloatRaw;
    
    const isCritical = totalFloat <= EPSILON;
    if (isCritical) {
      criticalPathIds.push(nodeId);
    }
    
    cpmResults.push({
      nodeId,
      pertDuration: TE.get(nodeId)!,
      earlyStart: es,
      earlyFinish: ef,
      lateStart: ls,
      lateFinish: lf,
      totalFloat,
      freeFloat,
      isCritical
    });
  }
  
  return {
    cpmResults,
    criticalPathIds,
    projectDuration
  };
}
