import { describe, it, expect } from "vitest";
import { computeGraphMetrics, detectBottlenecks } from "./analysis";
import { Graph, Schedule, NodeType, EdgeType, CPMResult } from "../../shared/types";
import { v4 as uuidv4 } from "uuid";

describe("Analysis Engine - Deterministic Metrics", () => {
  it("computes accurate structural metrics for a linear project", () => {
    const graph: Graph = {
      nodes: [
        { id: "s", type: "VIRTUAL_SOURCE" },
        { id: "1", type: "STANDARD", baseData: { title: "A", description: "A", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 } },
        { id: "2", type: "STANDARD", baseData: { title: "B", description: "B", optimisticDuration: 2, mostLikelyDuration: 2, pessimisticDuration: 2 } },
        { id: "e", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "s", targetId: "1", type: "FINISH_TO_START" },
        { sourceId: "1", targetId: "2", type: "FINISH_TO_START" },
        { sourceId: "2", targetId: "e", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 4, edgeCount: 3, disconnectedComponents: 1 }
    };
    
    const schedule: Schedule = {
      cpmResults: [
        { nodeId: "s", earlyStart: 0, earlyFinish: 0, lateStart: 0, lateFinish: 0, freeFloat: 0, totalFloat: 0, pertDuration: 0, isCritical: true },
        { nodeId: "1", earlyStart: 0, earlyFinish: 1, lateStart: 0, lateFinish: 1, freeFloat: 0, totalFloat: 0, pertDuration: 1, isCritical: true },
        { nodeId: "2", earlyStart: 1, earlyFinish: 3, lateStart: 1, lateFinish: 3, freeFloat: 0, totalFloat: 0, pertDuration: 2, isCritical: true },
        { nodeId: "e", earlyStart: 3, earlyFinish: 3, lateStart: 3, lateFinish: 3, freeFloat: 0, totalFloat: 0, pertDuration: 0, isCritical: true },
      ],
      criticalPathIds: ["s", "1", "2", "e"],
      projectDuration: 3
    };

    const metrics = computeGraphMetrics(graph, schedule);
    
    expect(metrics.nodes.get("s")!.fanIn).toBe(0);
    expect(metrics.nodes.get("s")!.fanOut).toBe(1);
    expect(metrics.nodes.get("s")!.successorCount).toBe(3); // 1, 2, e
    
    expect(metrics.nodes.get("1")!.fanIn).toBe(1);
    expect(metrics.nodes.get("1")!.fanOut).toBe(1);
    expect(metrics.nodes.get("1")!.ancestorCount).toBe(1); // s
    expect(metrics.nodes.get("1")!.successorCount).toBe(2); // 2, e

    expect(metrics.criticalDensity).toBe(1); // 2/2 standard tasks are critical
    expect(metrics.projectVariance).toBe(0); // All duration ests are tight (1,1,1 and 2,2,2)
  });

  it("handles high variance correctly (floating-point precision)", () => {
    // stdDev = (P - O) / 6
    // var = stdDev^2
    // If P = 7, O = 1 => stdDev = 1 => Var = 1
    const graph: Graph = {
      nodes: [
        { id: "s", type: "VIRTUAL_SOURCE" },
        { id: "1", type: "STANDARD", baseData: { title: "A", description: "A", optimisticDuration: 1, mostLikelyDuration: 4, pessimisticDuration: 7 } },
        { id: "e", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "s", targetId: "1", type: "FINISH_TO_START" },
        { sourceId: "1", targetId: "e", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 3, edgeCount: 2, disconnectedComponents: 1 }
    };
    
    const schedule: Schedule = {
      cpmResults: [
        { nodeId: "s", earlyStart: 0, earlyFinish: 0, lateStart: 0, lateFinish: 0, freeFloat: 0, totalFloat: 0, pertDuration: 0, isCritical: true },
        { nodeId: "1", earlyStart: 0, earlyFinish: 4, lateStart: 0, lateFinish: 4, freeFloat: 0, totalFloat: 0, pertDuration: 4, isCritical: true },
        { nodeId: "e", earlyStart: 4, earlyFinish: 4, lateStart: 4, lateFinish: 4, freeFloat: 0, totalFloat: 0, pertDuration: 0, isCritical: true },
      ],
      criticalPathIds: ["s", "1", "e"],
      projectDuration: 4
    };

    const metrics = computeGraphMetrics(graph, schedule);
    expect(metrics.nodes.get("1")!.standardDeviation).toBeCloseTo(1.0);
    expect(metrics.nodes.get("1")!.variance).toBeCloseTo(1.0);
    expect(metrics.projectVariance).toBeCloseTo(1.0);
    expect(metrics.projectStandardDeviation).toBeCloseTo(1.0);
  });

  it("detects bottlenecks in a diamond graph with heavy fan-out/fan-in", () => {
    const graph: Graph = {
      nodes: [
        { id: "start", type: "VIRTUAL_SOURCE" },
        { id: "root", type: "STANDARD", baseData: { title: "R", description: "R", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 } },
        { id: "p1", type: "STANDARD", baseData: { title: "P1", description: "", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 } },
        { id: "p2", type: "STANDARD", baseData: { title: "P2", description: "", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 } },
        { id: "p3", type: "STANDARD", baseData: { title: "P3", description: "", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 } },
        { id: "p4", type: "STANDARD", baseData: { title: "P4", description: "", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 } },
        { id: "merge", type: "STANDARD", baseData: { title: "M", description: "M", optimisticDuration: 1, mostLikelyDuration: 1, pessimisticDuration: 1 } },
        { id: "end", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "start", targetId: "root", type: "FINISH_TO_START" },
        { sourceId: "root", targetId: "p1", type: "FINISH_TO_START" },
        { sourceId: "root", targetId: "p2", type: "FINISH_TO_START" },
        { sourceId: "root", targetId: "p3", type: "FINISH_TO_START" },
        { sourceId: "root", targetId: "p4", type: "FINISH_TO_START" },
        { sourceId: "p1", targetId: "merge", type: "FINISH_TO_START" },
        { sourceId: "p2", targetId: "merge", type: "FINISH_TO_START" },
        { sourceId: "p3", targetId: "merge", type: "FINISH_TO_START" },
        { sourceId: "p4", targetId: "merge", type: "FINISH_TO_START" },
        { sourceId: "merge", targetId: "end", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 8, edgeCount: 10, disconnectedComponents: 1 }
    };

    const schedule: Schedule = {
      cpmResults: [],
      criticalPathIds: [],
      projectDuration: 3
    };

    const metrics = computeGraphMetrics(graph, schedule);
    const report = detectBottlenecks(graph, metrics, schedule);

    // root has fan-out 4 (> 3) -> bottleneck
    // merge has fan-in 4 (> 3) -> bottleneck
    const bottleneckIds = report.bottleneckNodes.map(n => n.nodeId);
    expect(bottleneckIds).toContain("root");
    expect(bottleneckIds).toContain("merge");
  });

  it("handles milestones correctly (excluded from bottlenecks, 0 variance)", () => {
    const graph: Graph = {
      nodes: [
        { id: "s", type: "VIRTUAL_SOURCE" },
        { id: "1", type: "MILESTONE", baseData: { title: "M1", description: "M1", optimisticDuration: 0, mostLikelyDuration: 0, pessimisticDuration: 0 } },
        { id: "e", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "s", targetId: "1", type: "FINISH_TO_START" },
        { sourceId: "1", targetId: "e", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 3, edgeCount: 2, disconnectedComponents: 1 }
    };
    
    const schedule: Schedule = { cpmResults: [], criticalPathIds: ["s", "1", "e"], projectDuration: 0 };
    const metrics = computeGraphMetrics(graph, schedule);
    const bottlenecks = detectBottlenecks(graph, metrics, schedule);
    
    expect(metrics.projectVariance).toBe(0);
    expect(metrics.nodes.get("1")!.variance).toBe(0);
    expect(bottlenecks.bottleneckNodes.length).toBe(0);
  });

  it("handles multiple critical paths (takes max variance along critical path)", () => {
    const graph: Graph = {
      nodes: [
        { id: "s", type: "VIRTUAL_SOURCE" },
        { id: "A", type: "STANDARD", baseData: { title: "A", description: "", optimisticDuration: 2, mostLikelyDuration: 2, pessimisticDuration: 2 } }, // var = 0
        { id: "B", type: "STANDARD", baseData: { title: "B", description: "", optimisticDuration: 1, mostLikelyDuration: 2, pessimisticDuration: 3 } }, // stdDev = 2/6 = 0.33, var = 0.11
        { id: "C", type: "STANDARD", baseData: { title: "C", description: "", optimisticDuration: 0, mostLikelyDuration: 2, pessimisticDuration: 4 } }, // stdDev = 4/6 = 0.66, var = 0.44
        { id: "e", type: "VIRTUAL_SINK" },
      ],
      edges: [
        { sourceId: "s", targetId: "A", type: "FINISH_TO_START" },
        { sourceId: "s", targetId: "B", type: "FINISH_TO_START" },
        { sourceId: "s", targetId: "C", type: "FINISH_TO_START" },
        { sourceId: "A", targetId: "e", type: "FINISH_TO_START" },
        { sourceId: "B", targetId: "e", type: "FINISH_TO_START" },
        { sourceId: "C", targetId: "e", type: "FINISH_TO_START" },
      ],
      metadata: { nodeCount: 5, edgeCount: 6, disconnectedComponents: 1 }
    };
    const schedule: Schedule = { cpmResults: [], criticalPathIds: ["s", "A", "B", "C", "e"], projectDuration: 2 };
    
    const metrics = computeGraphMetrics(graph, schedule);
    // Project variance should be the max variance path among critical paths (all of A, B, C are critical)
    const varC = (4 - 0)/6 * (4 - 0)/6;
    expect(metrics.projectVariance).toBeCloseTo(varC);
  });

  it("generates and evaluates deterministic random DAGs properties safely", () => {
    const nodes = [];
    nodes.push({ id: "s", type: "VIRTUAL_SOURCE" as const });
    for (let i = 1; i <= 50; i++) {
      nodes.push({ 
        id: `n${i}`, type: "STANDARD" as const, 
        baseData: { title: `N${i}`, description: "", optimisticDuration: 1, mostLikelyDuration: 2, pessimisticDuration: 3 } 
      });
    }
    nodes.push({ id: "e", type: "VIRTUAL_SINK" as const });
    
    const edges = [];
    for (let i = 1; i <= 50; i++) {
      edges.push({ sourceId: "s", targetId: `n${i}`, type: "FINISH_TO_START" as const });
      edges.push({ sourceId: `n${i}`, targetId: "e", type: "FINISH_TO_START" as const });
    }
    
    // Create an intentional bottleneck at n25 (high fanOut)
    for (let i = 26; i <= 35; i++) {
       edges.push({ sourceId: "n25", targetId: `n${i}`, type: "FINISH_TO_START" as const });
    }

    const graph: Graph = { nodes, edges, metadata: { nodeCount: 52, edgeCount: 110, disconnectedComponents: 1 } };
    const schedule: Schedule = { cpmResults: [], criticalPathIds: ["s", "n25", "e"], projectDuration: 10 };
    
    const metrics = computeGraphMetrics(graph, schedule);
    expect(metrics.maxDepth).toBeGreaterThan(0);
    expect(metrics.nodes.size).toBe(52);
    
    const bottlenecks = detectBottlenecks(graph, metrics, schedule);
    // n25 should be a bottleneck due to fanOut = 11 (1 to 'e' + 10 additional)
    const bottleneckIds = bottlenecks.bottleneckNodes.map(n => n.nodeId);
    expect(bottleneckIds).toContain("n25");
  });

});

