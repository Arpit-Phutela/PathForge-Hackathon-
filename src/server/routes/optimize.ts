import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ExecutionPlanSchema, PlannerProposalSchema } from "../../shared/types";
import { executeOptimizationAgent } from "../ai/optimizerAgent";

export const optimizeRouter = Router();

const OptimizeRequestSchema = z.object({
  plan: ExecutionPlanSchema,
  proposal: PlannerProposalSchema
});

optimizeRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { plan, proposal } = OptimizeRequestSchema.parse(req.body);

    const report = await executeOptimizationAgent(plan, proposal);

    res.json({
      status: "success",
      data: report,
      metadata: {
        processingTimeMs: 0,
        schemaVersion: "1.0.0"
      }
    });
  } catch (error) {
    next(error);
  }
});
