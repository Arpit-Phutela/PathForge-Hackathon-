import { describe, it, expect } from "vitest";
import { calculateCPM } from "./cpm";
import { Graph, Node } from "../../shared/types";
import { SchedulingInvariantError } from "../../shared/utils/errors";

function createStandardNode(id: string, opt: number, ml: number, pess: number): Node {
  return {
    id,
    type: "STANDARD",
    baseData: {
      title: `Task ${id}`,
      description: "...",
      optimisticDuration: opt,
      mostLikelyDuration: ml,
      pessimisticDuration: pess,
    }
  };
}

describe("CPM Scheduling Engine", () => {
  it("should compute a simple linear project", () => {
    const graph: Graph = {
      nodes: [
        { id: "V_SRC", type: "VIRTUAL_SOURCE" },
        createStandardNode("A", 1, 2, 3), // TE = 2
        createStandardNode("B", 2, 2, 2), // TE = 2
        { id: "V_SNK", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "V_SRC", targetId: "A", type: "FINISH_TO_START" },
        { sourceId: "A", targetId: "B", type: "FINISH_TO_START" },
        { sourceId: "B", targetId: "V_SNK", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 4, edgeCount: 3, disconnectedComponents: 1 }
    };

    const schedule = calculateCPM(graph);
    
    expect(schedule.projectDuration).toBe(4);
    expect(schedule.criticalPathIds).toContain("A");
    expect(schedule.criticalPathIds).toContain("B");
    expect(schedule.criticalPathIds).toContain("V_SRC");
    expect(schedule.criticalPathIds).toContain("V_SNK");

    const resA = schedule.cpmResults.find(r => r.nodeId === "A")!;
    expect(resA.earlyStart).toBe(0);
    expect(resA.earlyFinish).toBe(2);
    expect(resA.lateStart).toBe(0);
    expect(resA.lateFinish).toBe(2);
    expect(resA.totalFloat).toBe(0);
    expect(resA.freeFloat).toBe(0);
  });

  it("should compute a diamond dependency with float", () => {
    const graph: Graph = {
      nodes: [
        { id: "V_SRC", type: "VIRTUAL_SOURCE" },
        createStandardNode("A", 1, 1, 1), // TE = 1
        createStandardNode("B", 2, 2, 2), // TE = 2
        createStandardNode("C", 4, 4, 4), // TE = 4
        createStandardNode("D", 1, 1, 1), // TE = 1
        { id: "V_SNK", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "V_SRC", targetId: "A", type: "FINISH_TO_START" },
        { sourceId: "A", targetId: "B", type: "FINISH_TO_START" },
        { sourceId: "A", targetId: "C", type: "FINISH_TO_START" },
        { sourceId: "B", targetId: "D", type: "FINISH_TO_START" },
        { sourceId: "C", targetId: "D", type: "FINISH_TO_START" },
        { sourceId: "D", targetId: "V_SNK", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 6, edgeCount: 6, disconnectedComponents: 1 }
    };

    const schedule = calculateCPM(graph);
    
    expect(schedule.projectDuration).toBe(6);
    
    // Path A->C->D is critical (1 + 4 + 1 = 6)
    // Path A->B->D has float (1 + 2 + 1 = 4), float = 2
    expect(schedule.criticalPathIds).toContain("A");
    expect(schedule.criticalPathIds).toContain("C");
    expect(schedule.criticalPathIds).toContain("D");
    expect(schedule.criticalPathIds).not.toContain("B");

    const resB = schedule.cpmResults.find(r => r.nodeId === "B")!;
    expect(resB.earlyStart).toBe(1);
    expect(resB.earlyFinish).toBe(3);
    expect(resB.lateFinish).toBe(5);
    expect(resB.lateStart).toBe(3);
    expect(resB.totalFloat).toBe(2);
    expect(resB.freeFloat).toBe(2); // Can delay B by 2 without delaying D
  });

  it("should support multiple critical paths", () => {
    const graph: Graph = {
      nodes: [
        { id: "V_SRC", type: "VIRTUAL_SOURCE" },
        createStandardNode("A", 3, 3, 3), // TE = 3
        createStandardNode("B", 3, 3, 3), // TE = 3
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

    const schedule = calculateCPM(graph);
    
    expect(schedule.projectDuration).toBe(3);
    expect(schedule.criticalPathIds).toContain("A");
    expect(schedule.criticalPathIds).toContain("B");
  });

  it("should support zero-duration milestones", () => {
    const graph: Graph = {
      nodes: [
        { id: "V_SRC", type: "VIRTUAL_SOURCE" },
        createStandardNode("A", 2, 2, 2),
        { id: "M1", type: "MILESTONE", baseData: { title: "M1", description: "", optimisticDuration: 0, mostLikelyDuration: 0, pessimisticDuration: 0 } },
        createStandardNode("B", 2, 2, 2),
        { id: "V_SNK", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "V_SRC", targetId: "A", type: "FINISH_TO_START" },
        { sourceId: "A", targetId: "M1", type: "FINISH_TO_START" },
        { sourceId: "M1", targetId: "B", type: "FINISH_TO_START" },
        { sourceId: "B", targetId: "V_SNK", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 5, edgeCount: 4, disconnectedComponents: 1 }
    };

    const schedule = calculateCPM(graph);
    
    expect(schedule.projectDuration).toBe(4);
    const resM = schedule.cpmResults.find(r => r.nodeId === "M1")!;
    expect(resM.pertDuration).toBe(0);
    expect(resM.earlyStart).toBe(2);
    expect(resM.earlyFinish).toBe(2);
  });

  it("should reject negative durations", () => {
    const graph: Graph = {
      nodes: [
        { id: "V_SRC", type: "VIRTUAL_SOURCE" },
        { id: "V_SNK", type: "VIRTUAL_SINK" },
        createStandardNode("A", -1, 2, 3), 
      ],
      edges: [
        { sourceId: "V_SRC", targetId: "A", type: "FINISH_TO_START" },
        { sourceId: "A", targetId: "V_SNK", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 3, edgeCount: 2, disconnectedComponents: 1 }
    };

    expect(() => calculateCPM(graph)).toThrow(SchedulingInvariantError);
  });

  it("should reject invalid duration bounds", () => {
    const graph: Graph = {
      nodes: [
        { id: "V_SRC", type: "VIRTUAL_SOURCE" },
        { id: "V_SNK", type: "VIRTUAL_SINK" },
        createStandardNode("A", 5, 2, 3), // Opt > ML
      ],
      edges: [
        { sourceId: "V_SRC", targetId: "A", type: "FINISH_TO_START" },
        { sourceId: "A", targetId: "V_SNK", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 3, edgeCount: 2, disconnectedComponents: 1 }
    };

    expect(() => calculateCPM(graph)).toThrow(SchedulingInvariantError);
  });

  it("should handle floating point stability with PERT durations", () => {
    // 1 + 4*2 + 4 = 13 / 6 = 2.1666666666666665
    const graph: Graph = {
      nodes: [
        { id: "V_SRC", type: "VIRTUAL_SOURCE" },
        createStandardNode("A", 1, 2, 4),
        createStandardNode("B", 1, 2, 4),
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

    // Total Float should theoretically be 0, but FP math can result in 0.000000000000004 or -0.000000000000004
    // Our algorithm should handle this safely and cap float >= 0, and identify them as critical.
    const schedule = calculateCPM(graph);
    
    expect(schedule.criticalPathIds).toContain("A");
    expect(schedule.criticalPathIds).toContain("B");
    
    const resA = schedule.cpmResults.find(r => r.nodeId === "A")!;
    expect(resA.totalFloat).toBeGreaterThanOrEqual(0);
    expect(resA.freeFloat).toBeGreaterThanOrEqual(0);
  });
});
