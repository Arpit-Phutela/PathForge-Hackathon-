import { describe, it, expect } from "vitest";
import { executeScenario } from "./scenario";
import { ExecutionPlan, ScenarioMutation, PlannerProposal, Graph, Schedule } from "../../shared/types";

describe("Scenario Simulation Service", () => {
  const dummyProposal: PlannerProposal = {
    tasks: [],
    dependencies: [],
    assumptions: [],
    plannerConfidence: 0.9,
    aiReasoning: "Test"
  };

  const createDummyPlan = (): ExecutionPlan => {
    return {
      roadmap: {
        graph: {
          nodes: [
            { id: "v-source", type: "VIRTUAL_SOURCE" },
            { id: "task-1", type: "STANDARD", baseData: { title: "T1", description: "D1", optimisticDuration: 1, mostLikelyDuration: 2, pessimisticDuration: 3 } },
            { id: "task-2", type: "STANDARD", baseData: { title: "T2", description: "D2", optimisticDuration: 2, mostLikelyDuration: 3, pessimisticDuration: 4 } },
            { id: "v-sink", type: "VIRTUAL_SINK" }
          ],
          edges: [
            { sourceId: "v-source", targetId: "task-1", type: "FINISH_TO_START" },
            { sourceId: "task-1", targetId: "task-2", type: "FINISH_TO_START" },
            { sourceId: "task-2", targetId: "v-sink", type: "FINISH_TO_START" }
          ],
          metadata: { nodeCount: 4, edgeCount: 3, disconnectedComponents: 1 }
        },
        schedule: {
          projectDuration: 5, // mostLikely 2 + 3 = 5
          criticalPathIds: ["task-1", "task-2"],
          cpmResults: [
            { nodeId: "task-1", pertDuration: 2, earlyStart: 0, earlyFinish: 2, lateStart: 0, lateFinish: 2, totalFloat: 0, freeFloat: 0, isCritical: true },
            { nodeId: "task-2", pertDuration: 3, earlyStart: 2, earlyFinish: 5, lateStart: 2, lateFinish: 5, totalFloat: 0, freeFloat: 0, isCritical: true }
          ]
        }
      },
      analysis: {
        feasibility: { score: 0.9, scheduleHealth: "ROBUST" },
        confidence: { score: 90, penaltiesApplied: [] },
        bottlenecks: { bottleneckNodes: [] },
        risks: { overallRisk: "LOW", identifiedRisks: [] }
      }
    };
  };

  it("should delay a task correctly", () => {
    const originalPlan = createDummyPlan();
    const mutations: ScenarioMutation[] = [
      { type: "DELAY_TASK", taskId: "task-1", delayDays: 2 }
    ];

    const result = executeScenario(originalPlan, mutations, dummyProposal);
    expect(result.simulatedPlan.roadmap.schedule.projectDuration).toBeGreaterThan(5);
    expect(result.delta.durationDelta).toBeGreaterThan(0);
    
    // original graph should remain unchanged
    expect(originalPlan.roadmap.graph.nodes.find(n => n.id === "task-1")?.baseData?.mostLikelyDuration).toBe(2);
  });

  it("should shorten a task correctly", () => {
    const originalPlan = createDummyPlan();
    const mutations: ScenarioMutation[] = [
      { type: "SHORTEN_TASK", taskId: "task-2", shortenDays: 1 }
    ];

    const result = executeScenario(originalPlan, mutations, dummyProposal);
    expect(result.simulatedPlan.roadmap.schedule.projectDuration).toBeLessThan(5);
    expect(result.delta.durationDelta).toBeLessThan(0);
  });

  it("should add a dependency and recalculate properly", () => {
    const originalPlan = createDummyPlan();
    // remove dependency task-1 -> task-2, make them parallel
    originalPlan.roadmap.graph.edges = originalPlan.roadmap.graph.edges.filter(e => !(e.sourceId === "task-1" && e.targetId === "task-2"));
    // fix metadata
    originalPlan.roadmap.graph.edges.push({ sourceId: "v-source", targetId: "task-2", type: "FINISH_TO_START" });
    originalPlan.roadmap.graph.edges.push({ sourceId: "task-1", targetId: "v-sink", type: "FINISH_TO_START" });
    originalPlan.roadmap.schedule.projectDuration = 3; // Max(2, 3) = 3

    const mutations: ScenarioMutation[] = [
      { type: "ADD_DEPENDENCY", fromTaskId: "task-1", toTaskId: "task-2" }
    ];

    const result = executeScenario(originalPlan, mutations, dummyProposal);
    expect(result.simulatedPlan.roadmap.schedule.projectDuration).toBe(5);
    expect(result.delta.durationDelta).toBeGreaterThan(0);
  });

  it("should detect cycle introduced by mutation", () => {
    const originalPlan = createDummyPlan();
    const mutations: ScenarioMutation[] = [
      { type: "ADD_DEPENDENCY", fromTaskId: "task-2", toTaskId: "task-1" }
    ];

    expect(() => executeScenario(originalPlan, mutations, dummyProposal)).toThrow("Graph contains cycles");
  });

  it("should mark task as completed", () => {
    const originalPlan = createDummyPlan();
    const mutations: ScenarioMutation[] = [
      { type: "MARK_COMPLETED", taskId: "task-1" }
    ];

    const result = executeScenario(originalPlan, mutations, dummyProposal);
    expect(result.simulatedPlan.roadmap.schedule.projectDuration).toBe(3); // only task-2 remains
  });

  it("should mark task as blocked", () => {
    const originalPlan = createDummyPlan();
    const mutations: ScenarioMutation[] = [
      { type: "MARK_BLOCKED", taskId: "task-1" }
    ];

    const result = executeScenario(originalPlan, mutations, dummyProposal);
    expect(result.simulatedPlan.roadmap.schedule.projectDuration).toBeGreaterThan(100);
  });
});
