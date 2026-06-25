import { describe, it, expect } from "vitest";
import { topologicalSort } from "./topologicalSort";
import { Graph } from "../../shared/types";
import { CycleDetectedError } from "../../shared/utils/errors";

describe("Topological Sort Engine", () => {
  it("should sort a simple linear graph", () => {
    const graph: Graph = {
      nodes: [
        { id: "2", type: "STANDARD" },
        { id: "1", type: "STANDARD" },
        { id: "3", type: "STANDARD" },
      ],
      edges: [
        { sourceId: "1", targetId: "2", type: "FINISH_TO_START" },
        { sourceId: "2", targetId: "3", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 3, edgeCount: 2, disconnectedComponents: 1 }
    };

    const sorted = topologicalSort(graph);
    expect(sorted).toEqual(["1", "2", "3"]);
  });

  it("should sort a complex DAG deterministically", () => {
    const graph: Graph = {
      nodes: [
        { id: "A", type: "STANDARD" },
        { id: "B", type: "STANDARD" },
        { id: "C", type: "STANDARD" },
        { id: "D", type: "STANDARD" },
        { id: "E", type: "STANDARD" },
      ],
      edges: [
        { sourceId: "A", targetId: "B", type: "FINISH_TO_START" },
        { sourceId: "A", targetId: "C", type: "FINISH_TO_START" },
        { sourceId: "B", targetId: "D", type: "FINISH_TO_START" },
        { sourceId: "C", targetId: "D", type: "FINISH_TO_START" },
        { sourceId: "D", targetId: "E", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 5, edgeCount: 5, disconnectedComponents: 1 }
    };

    const sorted = topologicalSort(graph);
    // Node A has in-degree 0 -> queue = ['A'].
    // After A, queue has 'B', 'C'. Since we sort queue, queue = ['B', 'C'].
    // Shift 'B', neighbors 'D'. D in-degree becomes 1. queue = ['C'].
    // Shift 'C', neighbors 'D'. D in-degree becomes 0. queue = ['D'].
    // Shift 'D', neighbors 'E'. E in-degree becomes 0. queue = ['E'].
    // Shift 'E'.
    // Expected: A, B, C, D, E
    expect(sorted).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("should fail with CycleDetectedError if a cycle exists", () => {
    const graph: Graph = {
      nodes: [
        { id: "A", type: "STANDARD" },
        { id: "B", type: "STANDARD" },
        { id: "C", type: "STANDARD" },
      ],
      edges: [
        { sourceId: "A", targetId: "B", type: "FINISH_TO_START" },
        { sourceId: "B", targetId: "C", type: "FINISH_TO_START" },
        { sourceId: "C", targetId: "A", type: "FINISH_TO_START" }, // cycle
      ],
      metadata: { nodeCount: 3, edgeCount: 3, disconnectedComponents: 1 }
    };

    expect(() => topologicalSort(graph)).toThrow(CycleDetectedError);
  });

  it("should handle large DAGs efficiently (1000 nodes stress test)", () => {
    const nodes = [];
    const edges = [];
    for (let i = 0; i < 1000; i++) {
      nodes.push({ id: `node-${i}`, type: "STANDARD" as any });
      if (i > 0) {
        edges.push({ sourceId: `node-${i - 1}`, targetId: `node-${i}`, type: "FINISH_TO_START" as any });
      }
    }
    const graph: Graph = {
      nodes,
      edges,
      metadata: { nodeCount: 1000, edgeCount: 999, disconnectedComponents: 1 }
    };

    const start = performance.now();
    const sorted = topologicalSort(graph);
    const end = performance.now();
    
    expect(sorted.length).toBe(1000);
    expect(sorted[0]).toBe("node-0");
    expect(sorted[999]).toBe("node-999");
    expect(end - start).toBeLessThan(1000); // Should be very fast
  });

  it("should support multiple roots and sinks and virtual nodes", () => {
    const graph: Graph = {
      nodes: [
        { id: "V_SRC", type: "VIRTUAL_SOURCE" },
        { id: "A", type: "STANDARD" },
        { id: "B", type: "STANDARD" },
        { id: "V_SNK", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "V_SRC", targetId: "A", type: "FINISH_TO_START" },
        { sourceId: "V_SRC", targetId: "B", type: "FINISH_TO_START" },
        { sourceId: "A", targetId: "V_SNK", type: "FINISH_TO_START" },
        { sourceId: "B", targetId: "V_SNK", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 4, edgeCount: 4, disconnectedComponents: 2 }
    };

    const sorted = topologicalSort(graph);
    expect(sorted[0]).toBe("V_SRC");
    expect(sorted[3]).toBe("V_SNK");
    expect(sorted).toContain("A");
    expect(sorted).toContain("B");
  });
});
