import { Router } from "express";
import { planRouter } from "./plan";
import { validateRouter } from "./validate";
import { analyzeRouter } from "./analyze";
import { optimizeRouter } from "./optimize";

export const apiRouter = Router();

// /api/plan - The main entry point for planning
apiRouter.use("/plan", planRouter);

// /api/validate - Internal/Granular graph validation
apiRouter.use("/validate", validateRouter);

// /api/analyze - Feasibility, Risks, Bottlenecks
apiRouter.use("/analyze", analyzeRouter);

// /api/optimize - AI timeline optimization
apiRouter.use("/optimize", optimizeRouter);

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
