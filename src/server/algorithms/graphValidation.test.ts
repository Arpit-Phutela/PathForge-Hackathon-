import { describe, it, expect } from "vitest";
import { validateGraphStructure, detectCycles } from "./graphValidation";
import { Graph } from "../../shared/types";
import { MissingDataError, GraphValidationError, InvalidEdgeError, CycleDetectedError } from "../../shared/utils/errors";

describe("Graph Validation Engine", () => {
  it("should accept a valid graph", () => {
    const graph: Graph = {
      nodes: [
        { id: "v-source", type: "VIRTUAL_SOURCE" },
        { id: "v-sink", type: "VIRTUAL_SINK" },
        { id: "task-1", type: "STANDARD", baseData: { title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 } },
      ],
      edges: [
        { sourceId: "v-source", targetId: "task-1", type: "FINISH_TO_START" },
        { sourceId: "task-1", targetId: "v-sink", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 3, edgeCount: 2, disconnectedComponents: 1 }
    };
    expect(() => validateGraphStructure(graph)).not.toThrow();
  });

  it("should reject an empty graph", () => {
    const graph = {} as Graph;
    expect(() => validateGraphStructure(graph)).toThrow(MissingDataError);
  });

  it("should reject a graph with missing virtual source", () => {
    const graph: Graph = {
      nodes: [
        { id: "v-sink", type: "VIRTUAL_SINK" },
        { id: "task-1", type: "STANDARD", baseData: { title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 } },
      ],
      edges: [],
      metadata: { nodeCount: 2, edgeCount: 0, disconnectedComponents: 1 }
    };
    expect(() => validateGraphStructure(graph)).toThrow(GraphValidationError);
  });

  it("should reject a graph with multiple virtual sources", () => {
    const graph: Graph = {
      nodes: [
        { id: "v-source-1", type: "VIRTUAL_SOURCE" },
        { id: "v-source-2", type: "VIRTUAL_SOURCE" },
        { id: "v-sink", type: "VIRTUAL_SINK" },
      ],
      edges: [],
      metadata: { nodeCount: 3, edgeCount: 0, disconnectedComponents: 0 }
    };
    expect(() => validateGraphStructure(graph)).toThrow(GraphValidationError);
  });

  it("should reject duplicate node IDs", () => {
    const graph: Graph = {
      nodes: [
        { id: "task-1", type: "STANDARD" },
        { id: "task-1", type: "STANDARD" },
      ],
      edges: [],
      metadata: { nodeCount: 2, edgeCount: 0, disconnectedComponents: 1 }
    };
    expect(() => validateGraphStructure(graph)).toThrow(GraphValidationError);
  });

  it("should reject missing edge references", () => {
    const graph: Graph = {
      nodes: [
        { id: "v-source", type: "VIRTUAL_SOURCE" },
        { id: "v-sink", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "v-source", targetId: "missing-task", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 2, edgeCount: 1, disconnectedComponents: 0 }
    };
    expect(() => validateGraphStructure(graph)).toThrow(InvalidEdgeError);
  });

  it("should reject duplicate edges", () => {
    const graph: Graph = {
      nodes: [
        { id: "v-source", type: "VIRTUAL_SOURCE" },
        { id: "v-sink", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "v-source", targetId: "v-sink", type: "FINISH_TO_START" },
        { sourceId: "v-source", targetId: "v-sink", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 2, edgeCount: 2, disconnectedComponents: 0 }
    };
    expect(() => validateGraphStructure(graph)).toThrow(GraphValidationError);
  });

  it("should reject self-loops", () => {
    const graph: Graph = {
      nodes: [
        { id: "v-source", type: "VIRTUAL_SOURCE" },
        { id: "v-sink", type: "VIRTUAL_SINK" },
        { id: "task-1", type: "STANDARD" },
      ],
      edges: [
        { sourceId: "task-1", targetId: "task-1", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 3, edgeCount: 1, disconnectedComponents: 1 }
    };
    expect(() => validateGraphStructure(graph)).toThrow(GraphValidationError);
  });

  it("should reject invalid milestones with duration > 0", () => {
    const graph: Graph = {
      nodes: [
        { id: "v-source", type: "VIRTUAL_SOURCE" },
        { id: "v-sink", type: "VIRTUAL_SINK" },
        { id: "task-1", type: "MILESTONE", baseData: { title: "M1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 0, pessimisticDuration: 0 } },
      ],
      edges: [],
      metadata: { nodeCount: 3, edgeCount: 0, disconnectedComponents: 1 }
    };
    expect(() => validateGraphStructure(graph)).toThrow(GraphValidationError);
  });
});

describe("Cycle Detection Engine", () => {
  it("should return false for acyclic graphs", () => {
    const graph: Graph = {
      nodes: [
        { id: "1", type: "STANDARD" },
        { id: "2", type: "STANDARD" },
        { id: "3", type: "STANDARD" },
      ],
      edges: [
        { sourceId: "1", targetId: "2", type: "FINISH_TO_START" },
        { sourceId: "2", targetId: "3", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 3, edgeCount: 2, disconnectedComponents: 1 }
    };
    const report = detectCycles(graph);
    expect(report.hasCycles).toBe(false);
  });

  it("should throw CycleDetectedError and report cycle paths for simple cycles", () => {
    const graph: Graph = {
      nodes: [
        { id: "1", type: "STANDARD" },
        { id: "2", type: "STANDARD" },
      ],
      edges: [
        { sourceId: "1", targetId: "2", type: "FINISH_TO_START" },
        { sourceId: "2", targetId: "1", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 2, edgeCount: 2, disconnectedComponents: 1 }
    };
    
    expect(() => detectCycles(graph)).toThrow(CycleDetectedError);
    try {
      detectCycles(graph);
    } catch (error: any) {
      expect(error.cyclePaths.length).toBeGreaterThan(0);
      expect(error.cyclePaths[0]).toEqual(["1", "2", "1"]);
    }
  });

  it("should detect larger cycles in disconnected components", () => {
    const graph: Graph = {
      nodes: [
        { id: "1", type: "STANDARD" },
        { id: "2", type: "STANDARD" },
        { id: "3", type: "STANDARD" },
        { id: "4", type: "STANDARD" }, // standalone
      ],
      edges: [
        { sourceId: "1", targetId: "2", type: "FINISH_TO_START" },
        { sourceId: "2", targetId: "3", type: "FINISH_TO_START" },
        { sourceId: "3", targetId: "1", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 4, edgeCount: 3, disconnectedComponents: 2 }
    };
    
    expect(() => detectCycles(graph)).toThrow(CycleDetectedError);
  });
});
