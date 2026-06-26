import { Router, Request, Response, NextFunction } from "express";
import { UserRequestSchema } from "../../shared/types";
import { createExecutionPlan } from "../orchestrator/pipeline";
import { executePlannerAgent } from "../ai/plannerAgent";
import { buildGraphFromProposal } from "../orchestrator/graphBuilder";
import { validateGraphStructure, detectCycles } from "../algorithms/graphValidation";
import { topologicalSort } from "../algorithms/topologicalSort";
import { calculateCPM } from "../algorithms/cpm";
import { computeDeterministicAnalysis } from "../algorithms/scoring";

export const planRouter = Router();

planRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRequest = UserRequestSchema.parse(req.body);

    const context = {
      planner: { execute: executePlannerAgent },
      redTeam: { execute: async () => ({ overallRisk: "LOW" as const, identifiedRisks: [] }) },
      optimizer: { execute: async () => ({ rankedStrategies: [], naturalLanguageExplanation: "Not optimized" }) },
      graphBuilder: { build: (proposal: any) => buildGraphFromProposal(proposal) },
      algorithms: {
        validateGraph: (graph: any) => {
          validateGraphStructure(graph);
        },
        detectCycles: (graph: any) => {
          const report = detectCycles(graph);
          if (report.hasCycles) throw new Error("Cycles detected in graph");
        },
        topologicalSort: (graph: any) => topologicalSort(graph),
        calculateCPM: (graph: any) => calculateCPM(graph),
        computeDeterministicAnalysis: (graph: any, schedule: any, proposal: any) => {
          return computeDeterministicAnalysis(graph, schedule, proposal);
        }
      }
    };

    const plan = await createExecutionPlan(userRequest, context);

    res.json({
      status: "success",
      data: plan,
      metadata: {
        processingTimeMs: 0,
        schemaVersion: "1.0.0"
      }
    });
  } catch (error) {
    next(error);
  }
});
