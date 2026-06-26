import { describe, it, expect, vi, beforeEach } from "vitest";
import { executeOptimizationAgent } from "./optimizerAgent";
import { ExecutionPlan, PlannerProposal } from "../../shared/types";
import { GoogleGenAI } from "@google/genai";
import * as scenarioModule from "../algorithms/scenario";

const { mockGenerateContent } = vi.hoisted(() => {
  return { mockGenerateContent: vi.fn() };
});

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent
      };
    },
    Type: { OBJECT: "OBJECT", STRING: "STRING", NUMBER: "NUMBER", ARRAY: "ARRAY", ANY: "ANY" }
  };
});

describe("Optimization Agent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const dummyPlan = {
    roadmap: {
      graph: { nodes: [], edges: [] },
      schedule: { projectDuration: 10, criticalPathIds: [] }
    },
    analysis: {
      feasibility: { score: 0.8 },
      confidence: { score: 80 },
      bottlenecks: { bottleneckNodes: [] },
      risks: { overallRisk: "LOW", identifiedRisks: [] }
    }
  } as unknown as ExecutionPlan;

  const dummyProposal = {} as PlannerProposal;

  it("should generate optimization recommendations backed by deterministic simulation", async () => {
    const uuid1 = "d9428888-122b-11e1-b85c-61d8ce80ebf1";
    const uuid2 = "e9428888-122b-11e1-b85c-61d8ce80ebf2";

    const aiResponse = {
      text: JSON.stringify({
        candidates: [
          {
            title: "Fast Track",
            description: "Shorten task.",
            tradeOffs: ["Cost"],
            mutations: [{ type: "SHORTEN_TASK", taskId: uuid1, shortenDays: 2 }]
          },
          {
            title: "Invalid Strategy",
            description: "Produces cycle.",
            tradeOffs: [],
            mutations: [{ type: "ADD_DEPENDENCY", fromTaskId: uuid2, toTaskId: uuid1 }]
          }
        ],
        naturalLanguageExplanation: "Analyzed."
      })
    };

    mockGenerateContent.mockResolvedValueOnce(aiResponse);

    // Mock scenario execution
    vi.spyOn(scenarioModule, "executeScenario").mockImplementation((plan, mutations) => {
      if (mutations[0].type === "ADD_DEPENDENCY") {
        throw new Error("Cycle detected");
      }
      return {
        simulatedPlan: {
          roadmap: { schedule: { projectDuration: 8, criticalPathIds: [] } },
          analysis: { feasibility: { score: 0.9 }, confidence: { score: 85 }, bottlenecks: { bottleneckNodes: [] } }
        } as any,
        delta: {
          durationDelta: -2,
          feasibilityDelta: 0.1,
          newRisks: [],
          criticalPathChanged: false
        }
      };
    });

    const report = await executeOptimizationAgent(dummyPlan, dummyProposal);

    expect(report.rankedStrategies.length).toBe(1); // One was invalid and should be dropped
    expect(report.rankedStrategies[0].title).toBe("Fast Track");
    expect(report.rankedStrategies[0].deterministicEvidence.durationImprovementDays).toBe(2); // positive is good
    expect(report.naturalLanguageExplanation).toBe("Analyzed.");
  });

  it("should handle empty AI candidates safely", async () => {
    const aiResponse = {
      text: JSON.stringify({
        candidates: [],
        naturalLanguageExplanation: "Nothing to optimize."
      })
    };

    mockGenerateContent.mockResolvedValueOnce(aiResponse);

    const report = await executeOptimizationAgent(dummyPlan, dummyProposal);
    expect(report.rankedStrategies.length).toBe(0);
  });
});
