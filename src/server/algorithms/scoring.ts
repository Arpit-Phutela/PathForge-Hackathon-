import { Graph, Schedule, Analysis } from "../../shared/types";
import { NotImplementedError } from "../../shared/utils/errors";

/**
 * Computes deterministic scores (Feasibility, Confidence, Bottlenecks)
 * based on the calculated schedule and graph metrics.
 */
export function computeAnalysisMetrics(graph: Graph, schedule: Schedule): Pick<Analysis, "feasibility" | "confidence" | "bottlenecks"> {
  throw new NotImplementedError("Deterministic scoring algorithms are deferred to Phase 2.");
}
