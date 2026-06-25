import { Graph, CycleReport } from "../../shared/types";
import { MissingDataError, ValidationError, InvalidEdgeError, CycleDetectedError } from "../../shared/utils/errors";

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
 * Validates the graph structure ensuring no orphans and proper virtual sink/source setup.
 * Throws InvalidEdgeError, MissingDataError, or ValidationError on failure.
 */
export function validateGraphStructure(graph: Graph): void {
  if (!graph || !graph.nodes || !graph.edges) {
    throw new MissingDataError("Graph must contain nodes and edges arrays.");
  }
  
  if (graph.nodes.length === 0) {
    throw new MissingDataError("Graph must contain at least one node.");
  }

  const nodeIds = new Set<string>();
  let virtualSourceCount = 0;
  let virtualSinkCount = 0;

  for (const node of graph.nodes) {
    if (!node.id) {
      throw new MissingDataError("Node is missing an ID.");
    }
    if (nodeIds.has(node.id)) {
      throw new ValidationError(`Duplicate node ID found: ${node.id}`);
    }
    nodeIds.add(node.id);

    if (node.type === "VIRTUAL_SOURCE") {
      virtualSourceCount++;
    } else if (node.type === "VIRTUAL_SINK") {
      virtualSinkCount++;
    } else if (node.type === "MILESTONE") {
      if (
        node.baseData?.optimisticDuration !== 0 ||
        node.baseData?.mostLikelyDuration !== 0 ||
        node.baseData?.pessimisticDuration !== 0
      ) {
        throw new ValidationError(`Milestone node ${node.id} must have 0 duration.`);
      }
    }
  }

  if (virtualSourceCount !== 1) {
    throw new ValidationError(`Graph must contain exactly one VIRTUAL_SOURCE. Found: ${virtualSourceCount}`);
  }
  if (virtualSinkCount !== 1) {
    throw new ValidationError(`Graph must contain exactly one VIRTUAL_SINK. Found: ${virtualSinkCount}`);
  }

  const edgeSet = new Set<string>();

  for (const edge of graph.edges) {
    if (!edge.sourceId || !edge.targetId) {
      throw new InvalidEdgeError("Edge is missing sourceId or targetId.");
    }
    if (!nodeIds.has(edge.sourceId)) {
      throw new InvalidEdgeError(`Edge sourceId ${edge.sourceId} does not exist in nodes.`);
    }
    if (!nodeIds.has(edge.targetId)) {
      throw new InvalidEdgeError(`Edge targetId ${edge.targetId} does not exist in nodes.`);
    }
    if (edge.sourceId === edge.targetId) {
      throw new ValidationError(`Self-loop detected on node ${edge.sourceId}`);
    }
    const edgeKey = `${edge.sourceId}->${edge.targetId}`;
    if (edgeSet.has(edgeKey)) {
      throw new ValidationError(`Duplicate edge detected: ${edgeKey}`);
    }
    edgeSet.add(edgeKey);
  }

  if (graph.metadata.nodeCount !== graph.nodes.length) {
    throw new ValidationError("Metadata nodeCount does not match actual node count.");
  }
  if (graph.metadata.edgeCount !== graph.edges.length) {
    throw new ValidationError("Metadata edgeCount does not match actual edge count.");
  }

  // Validate disconnected component metadata
  const standardNodes = graph.nodes.filter(n => n.type !== "VIRTUAL_SOURCE" && n.type !== "VIRTUAL_SINK");
  const uf = new UnionFind(standardNodes.map(n => n.id));

  for (const edge of graph.edges) {
    const src = graph.nodes.find(n => n.id === edge.sourceId);
    const tgt = graph.nodes.find(n => n.id === edge.targetId);
    if (src && tgt && src.type !== "VIRTUAL_SOURCE" && src.type !== "VIRTUAL_SINK" && tgt.type !== "VIRTUAL_SOURCE" && tgt.type !== "VIRTUAL_SINK") {
      uf.union(edge.sourceId, edge.targetId);
    }
  }

  const uniqueRoots = new Set<string>();
  for (const node of standardNodes) {
    uniqueRoots.add(uf.find(node.id));
  }
  
  if (standardNodes.length > 0 && graph.metadata.disconnectedComponents !== uniqueRoots.size) {
    throw new ValidationError(`Metadata disconnectedComponents (${graph.metadata.disconnectedComponents}) does not match actual value (${uniqueRoots.size}).`);
  }
}

/**
 * Performs Cycle Detection (DFS) on a validated DAG.
 * Returns a CycleReport. If cycles exist, throws CycleDetectedError.
 */
export function detectCycles(graph: Graph): CycleReport {
  const adjacencyList = new Map<string, string[]>();
  
  for (const node of graph.nodes) {
    adjacencyList.set(node.id, []);
  }

  for (const edge of graph.edges) {
    if (adjacencyList.has(edge.sourceId)) {
      adjacencyList.get(edge.sourceId)!.push(edge.targetId);
    }
  }

  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const parentMap = new Map<string, string>();
  const cyclePaths: string[][] = [];

  function dfs(nodeId: string) {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        parentMap.set(neighbor, nodeId);
        dfs(neighbor);
      } else if (recursionStack.has(neighbor)) {
        // Cycle detected
        const path: string[] = [];
        let curr: string | undefined = nodeId;
        path.push(neighbor); // closing the loop
        
        // Safety guard against infinite loops in path reconstruction
        const pathSet = new Set<string>();
        pathSet.add(neighbor);
        
        while (curr !== neighbor && curr !== undefined) {
          path.push(curr);
          if (pathSet.has(curr)) break;
          pathSet.add(curr);
          curr = parentMap.get(curr);
        }
        path.push(neighbor);
        path.reverse();
        cyclePaths.push(path);
      }
    }

    recursionStack.delete(nodeId);
  }

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  }

  const report: CycleReport = {
    hasCycles: cyclePaths.length > 0,
    cyclePaths
  };

  if (report.hasCycles) {
    throw new CycleDetectedError("Graph contains cycles.", cyclePaths);
  }

  return report;
}
