import { describe, it, expect, vi, beforeEach } from "vitest";
import { optimizeRouter } from "./optimize";
import * as optimizerAgentModule from "../ai/optimizerAgent";
import { Request, Response } from "express";

vi.mock("../ai/optimizerAgent", () => ({
  executeOptimizationAgent: vi.fn()
}));

describe("POST /api/optimize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    plan: {
      roadmap: {
        graph: { nodes: [], edges: [], metadata: { nodeCount: 0, edgeCount: 0, disconnectedComponents: 0 } },
        schedule: { projectDuration: 10, criticalPathIds: [], cpmResults: [] }
      },
      analysis: {
        feasibility: { score: 0.8, scheduleHealth: "ROBUST" },
        confidence: { score: 80, penaltiesApplied: [] },
        bottlenecks: { bottleneckNodes: [] },
        risks: { overallRisk: "LOW", identifiedRisks: [] }
      }
    },
    proposal: {
      tasks: [],
      dependencies: [],
      assumptions: [],
      plannerConfidence: 0.9,
      aiReasoning: "None"
    }
  };

  it("should successfully execute optimization agent and return report", async () => {
    const mockReport = {
      rankedStrategies: [],
      naturalLanguageExplanation: "All looks good."
    };
    vi.spyOn(optimizerAgentModule, "executeOptimizationAgent").mockResolvedValueOnce(mockReport as any);

    const req = {
      body: validPayload
    } as unknown as Request;

    const res = {
      json: vi.fn()
    } as unknown as Response;

    const next = vi.fn();

    // The router is a middleware. To test it properly without supertest, we just extract the handler.
    // optimizeRouter.stack[0].route.stack[0].handle is the async function
    const routeHandler = optimizeRouter.stack.find(layer => layer.route?.path === "/").route.stack[0].handle;

    await routeHandler(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: mockReport,
      metadata: {
        processingTimeMs: 0,
        schemaVersion: "1.0.0"
      }
    });
  });
});

