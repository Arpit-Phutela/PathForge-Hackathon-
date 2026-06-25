import { Router, Request, Response, NextFunction } from "express";
import { NotImplementedError } from "../../shared/utils/errors";

export const planRouter = Router();

planRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new NotImplementedError("The /api/plan endpoint is deferred to Phase 2.");
  } catch (error) {
    next(error);
  }
});
