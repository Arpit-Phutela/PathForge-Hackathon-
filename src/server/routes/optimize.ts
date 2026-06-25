import { Router, Request, Response, NextFunction } from "express";
import { NotImplementedError } from "../../shared/utils/errors";

export const optimizeRouter = Router();

optimizeRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new NotImplementedError("The /api/optimize endpoint is deferred to Phase 2.");
  } catch (error) {
    next(error);
  }
});
