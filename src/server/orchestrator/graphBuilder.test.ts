import { describe, it, expect } from "vitest";
import { buildGraphFromProposal } from "./graphBuilder";
import { PlannerProposal } from "../../shared/types";
import { MissingDataError, GraphValidationError, InvalidEdgeError } from "../../shared/utils/errors";

describe("buildGraphFromProposal", () => {
  it("should reject an empty graph", () => {
    const proposal: PlannerProposal = {
      tasks: [],
      dependencies: [],
      assumptions: [],
      plannerConfidence: 1,
      aiReasoning: "",
    };

    expect(() => buildGraphFromProposal(proposal)).toThrow(MissingDataError);
  });

  it("should handle a single task correctly", () => {
    const proposal: PlannerProposal = {
      tasks: [
        {
          taskId: "task-1",
          title: "T1",
          description: "D1",
          optimisticDuration: 1,
          mostLikelyDuration: 2,
          pessimisticDuration: 3,
        },
      ],
      dependencies: [],
      assumptions: [],
      plannerConfidence: 1,
      aiReasoning: "",
    };

    const graph = buildGraphFromProposal(proposal);
    // 1 standard + virtual source + virtual sink
    expect(graph.nodes.length).toBe(3);
    
    const virtualSource = graph.nodes.find(n => n.type === "VIRTUAL_SOURCE");
    const virtualSink = graph.nodes.find(n => n.type === "VIRTUAL_SINK");
    expect(virtualSource).toBeDefined();
    expect(virtualSink).toBeDefined();

    // virtual source -> task-1 -> virtual sink
    expect(graph.edges.length).toBe(2);
    expect(graph.metadata.disconnectedComponents).toBe(1);
    expect(graph.metadata.nodeCount).toBe(3);
  });

  it("should reject duplicate task IDs", () => {
    const proposal: PlannerProposal = {
      tasks: [
        { taskId: "task-1", title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
        { taskId: "task-1", title: "T1-dup", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
      ],
      dependencies: [],
      assumptions: [],
      plannerConfidence: 1,
      aiReasoning: "",
    };

    expect(() => buildGraphFromProposal(proposal)).toThrow(GraphValidationError);
  });

  it("should reject missing dependency references", () => {
    const proposal: PlannerProposal = {
      tasks: [
        { taskId: "task-1", title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
      ],
      dependencies: [
        { fromTaskId: "task-1", toTaskId: "task-2", rationale: "missing to" }
      ],
      assumptions: [],
      plannerConfidence: 1,
      aiReasoning: "",
    };

    expect(() => buildGraphFromProposal(proposal)).toThrow(InvalidEdgeError);
  });

  it("should reject self-loop edges", () => {
    const proposal: PlannerProposal = {
      tasks: [
        { taskId: "task-1", title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
      ],
      dependencies: [
        { fromTaskId: "task-1", toTaskId: "task-1", rationale: "self loop" }
      ],
      assumptions: [],
      plannerConfidence: 1,
      aiReasoning: "",
    };

    expect(() => buildGraphFromProposal(proposal)).toThrow(GraphValidationError);
  });

  it("should reject duplicate edges", () => {
    const proposal: PlannerProposal = {
      tasks: [
        { taskId: "task-1", title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
        { taskId: "task-2", title: "T2", description: "D2", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
      ],
      dependencies: [
        { fromTaskId: "task-1", toTaskId: "task-2", rationale: "1" },
        { fromTaskId: "task-1", toTaskId: "task-2", rationale: "dup" }
      ],
      assumptions: [],
      plannerConfidence: 1,
      aiReasoning: "",
    };

    expect(() => buildGraphFromProposal(proposal)).toThrow(GraphValidationError);
  });

  it("should handle multiple independent tasks (disconnected components)", () => {
    const proposal: PlannerProposal = {
      tasks: [
        { taskId: "task-1", title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
        { taskId: "task-2", title: "T2", description: "D2", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
      ],
      dependencies: [],
      assumptions: [],
      plannerConfidence: 1,
      aiReasoning: "",
    };

    const graph = buildGraphFromProposal(proposal);
    // 2 tasks + 2 virtual nodes
    expect(graph.nodes.length).toBe(4);
    // V_S -> task-1, V_S -> task-2, task-1 -> V_SK, task-2 -> V_SK
    expect(graph.edges.length).toBe(4);
    expect(graph.metadata.disconnectedComponents).toBe(2);
  });

  it("should handle multiple root nodes", () => {
    const proposal: PlannerProposal = {
      tasks: [
        { taskId: "task-1", title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
        { taskId: "task-2", title: "T2", description: "D2", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
        { taskId: "task-3", title: "T3", description: "D3", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
      ],
      dependencies: [
        { fromTaskId: "task-1", toTaskId: "task-3", rationale: "dep1" },
        { fromTaskId: "task-2", toTaskId: "task-3", rationale: "dep2" },
      ],
      assumptions: [],
      plannerConfidence: 1,
      aiReasoning: "",
    };

    const graph = buildGraphFromProposal(proposal);
    // 3 tasks + 2 virtual
    expect(graph.nodes.length).toBe(5);
    // task-1 and task-2 are roots
    const virtualSourceId = graph.nodes.find(n => n.type === "VIRTUAL_SOURCE")!.id;
    const sourceEdges = graph.edges.filter(e => e.sourceId === virtualSourceId);
    expect(sourceEdges.length).toBe(2);
    expect(sourceEdges.map(e => e.targetId).sort()).toEqual(["task-1", "task-2"].sort());
  });

  it("should handle multiple terminal nodes", () => {
    const proposal: PlannerProposal = {
      tasks: [
        { taskId: "task-1", title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
        { taskId: "task-2", title: "T2", description: "D2", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
        { taskId: "task-3", title: "T3", description: "D3", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
      ],
      dependencies: [
        { fromTaskId: "task-1", toTaskId: "task-2", rationale: "dep1" },
        { fromTaskId: "task-1", toTaskId: "task-3", rationale: "dep2" },
      ],
      assumptions: [],
      plannerConfidence: 1,
      aiReasoning: "",
    };

    const graph = buildGraphFromProposal(proposal);
    const virtualSinkId = graph.nodes.find(n => n.type === "VIRTUAL_SINK")!.id;
    const sinkEdges = graph.edges.filter(e => e.targetId === virtualSinkId);
    expect(sinkEdges.length).toBe(2);
    expect(sinkEdges.map(e => e.sourceId).sort()).toEqual(["task-2", "task-3"].sort());
  });

  it("should correctly identify milestone nodes", () => {
    const proposal: PlannerProposal = {
      tasks: [
        { taskId: "task-1", title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 },
        { taskId: "task-2", title: "Milestone", description: "D2", optimisticDuration: 0, mostLikelyDuration: 0, pessimisticDuration: 0 },
      ],
      dependencies: [
        { fromTaskId: "task-1", toTaskId: "task-2", rationale: "dep1" },
      ],
      assumptions: [],
      plannerConfidence: 1,
      aiReasoning: "",
    };

    const graph = buildGraphFromProposal(proposal);
    const standardNode = graph.nodes.find(n => n.id === "task-1");
    const milestoneNode = graph.nodes.find(n => n.id === "task-2");

    expect(standardNode?.type).toBe("STANDARD");
    expect(milestoneNode?.type).toBe("MILESTONE");
  });
});
