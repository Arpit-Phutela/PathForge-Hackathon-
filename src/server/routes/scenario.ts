import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ExecutionPlanSchema, ScenarioMutationSchema, PlannerProposalSchema } from "../../shared/types";
import { executeScenario } from "../algorithms/scenario";

export const scenarioRouter = Router();

const ScenarioRequestSchema = z.object({
  plan: ExecutionPlanSchema,
  mutations: z.array(ScenarioMutationSchema),
  proposal: PlannerProposalSchema
});

scenarioRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { plan, mutations, proposal } = ScenarioRequestSchema.parse(req.body);

    const result = executeScenario(plan, mutations, proposal);

    res.json({
      status: "success",
      data: result,
      metadata: {
        processingTimeMs: 0,
        schemaVersion: "1.0.0"
      }
    });
  } catch (error) {
    next(error);
  }
});
