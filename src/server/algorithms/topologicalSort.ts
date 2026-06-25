import { Graph } from "../../shared/types";
import { CycleDetectedError } from "../../shared/utils/errors";

/**
 * Executes Kahn's Algorithm for Topological Sorting.
 * Produces deterministic ordering of node execution.
 * @param graph - The directed acyclic graph to sort.
 * @returns {string[]} An ordered array of Node IDs.
 * @throws {CycleDetectedError} if a cycle is encountered during Kahn's algorithm.
 * @timeComplexity O(V + E)
 * @spaceComplexity O(V + E) for adjacency list, in-degree map, and queue.
 */
export function topologicalSort(graph: Graph): string[] {
  const inDegree = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();

  for (const node of graph.nodes) {
    inDegree.set(node.id, 0);
    adjacencyList.set(node.id, []);
  }

  for (const edge of graph.edges) {
    if (inDegree.has(edge.targetId)) {
      inDegree.set(edge.targetId, inDegree.get(edge.targetId)! + 1);
    }
    if (adjacencyList.has(edge.sourceId)) {
      adjacencyList.get(edge.sourceId)!.push(edge.targetId);
    }
  }

  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  // To ensure deterministic ordering, we sort the queue lexicographically
  queue.sort();

  const sorted: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    const neighbors = adjacencyList.get(current) || [];
    
    // Sort neighbors to maintain deterministic processing
    neighbors.sort();
    
    for (const neighbor of neighbors) {
      const currentInDegree = inDegree.get(neighbor)! - 1;
      inDegree.set(neighbor, currentInDegree);
      if (currentInDegree === 0) {
        queue.push(neighbor);
      }
    }
    // Re-sort queue to keep it deterministic always
    queue.sort();
  }

  if (sorted.length !== graph.nodes.length) {
    throw new CycleDetectedError("Graph contains cycles, topological sort failed.");
  }

  return sorted;
}
