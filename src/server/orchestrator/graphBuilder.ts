import { v4 as uuidv4 } from "uuid";
import { PlannerProposal, Graph, Node, DirectedEdge, TaskNodeData } from "../../shared/types";
import { MissingDataError, ValidationError, InvalidEdgeError } from "../../shared/utils/errors";

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
 * Transforms an AI-generated PlannerProposal into a strict, deterministic Graph model.
 * Does not implement graph algorithms directly. 
 * Provides the boundary between the AI output and the mathematical engine.
 */
export function buildGraphFromProposal(proposal: PlannerProposal): Graph {
  if (!proposal.tasks || proposal.tasks.length === 0) {
    throw new MissingDataError("PlannerProposal must contain at least one task.");
  }

  const nodeIds = new Set<string>();
  const nodes: Node[] = [];

  // 1. Validate Uniqueness and Map Tasks to Nodes
  for (const task of proposal.tasks) {
    if (nodeIds.has(task.taskId)) {
      throw new ValidationError(`Duplicate task ID found: ${task.taskId}`);
    }
    nodeIds.add(task.taskId);

    const isMilestone = 
      task.optimisticDuration === 0 && 
      task.mostLikelyDuration === 0 && 
      task.pessimisticDuration === 0;

    const baseData: TaskNodeData = {
      title: task.title,
      description: task.description,
      optimisticDuration: task.optimisticDuration,
      mostLikelyDuration: task.mostLikelyDuration,
      pessimisticDuration: task.pessimisticDuration,
      requiredSkills: task.requiredSkills,
      resourceAssumptions: task.resourceAssumptions,
    };

    nodes.push({
      id: task.taskId,
      type: isMilestone ? "MILESTONE" : "STANDARD",
      baseData,
    });
  }

  const edges: DirectedEdge[] = [];
  const edgeSet = new Set<string>();
  const inDegree = new Map<string, number>();
  const outDegree = new Map<string, number>();

  for (const id of nodeIds) {
    inDegree.set(id, 0);
    outDegree.set(id, 0);
  }

  // 2. Validate Dependencies and Build Edges
  if (proposal.dependencies) {
    for (const dep of proposal.dependencies) {
      if (!nodeIds.has(dep.fromTaskId)) {
        throw new InvalidEdgeError(`fromTaskId ${dep.fromTaskId} not found in nodes.`);
      }
      if (!nodeIds.has(dep.toTaskId)) {
        throw new InvalidEdgeError(`toTaskId ${dep.toTaskId} not found in nodes.`);
      }
      if (dep.fromTaskId === dep.toTaskId) {
        throw new ValidationError(`Self-referencing edge found for task: ${dep.fromTaskId}`);
      }
      
      const edgeKey = `${dep.fromTaskId}->${dep.toTaskId}`;
      if (edgeSet.has(edgeKey)) {
        throw new ValidationError(`Duplicate edge found: ${edgeKey}`);
      }
      edgeSet.add(edgeKey);
      
      edges.push({
        sourceId: dep.fromTaskId,
        targetId: dep.toTaskId,
        type: "FINISH_TO_START",
      });
      
      outDegree.set(dep.fromTaskId, outDegree.get(dep.fromTaskId)! + 1);
      inDegree.set(dep.toTaskId, inDegree.get(dep.toTaskId)! + 1);
    }
  }

  // 3. Identify True Roots and Terminals
  const trueRoots: string[] = [];
  const trueTerminals: string[] = [];

  for (const id of nodeIds) {
    if (inDegree.get(id) === 0) {
      trueRoots.push(id);
    }
    if (outDegree.get(id) === 0) {
      trueTerminals.push(id);
    }
  }

  // 4. Generate Virtual Source and Sink
  const virtualSourceId = uuidv4();
  const virtualSinkId = uuidv4();

  nodes.push({
    id: virtualSourceId,
    type: "VIRTUAL_SOURCE",
  });
  nodes.push({
    id: virtualSinkId,
    type: "VIRTUAL_SINK",
  });

  for (const rootId of trueRoots) {
    edges.push({
      sourceId: virtualSourceId,
      targetId: rootId,
      type: "FINISH_TO_START",
    });
  }

  for (const terminalId of trueTerminals) {
    edges.push({
      sourceId: terminalId,
      targetId: virtualSinkId,
      type: "FINISH_TO_START",
    });
  }

  // 5. Calculate Disconnected Components
  const uf = new UnionFind(Array.from(nodeIds));
  if (proposal.dependencies) {
    for (const dep of proposal.dependencies) {
      uf.union(dep.fromTaskId, dep.toTaskId);
    }
  }

  const uniqueRoots = new Set<string>();
  for (const node of nodeIds) {
    uniqueRoots.add(uf.find(node));
  }

  return {
    nodes,
    edges,
    metadata: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      disconnectedComponents: uniqueRoots.size,
    },
  };
}
