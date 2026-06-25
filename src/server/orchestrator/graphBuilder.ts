import { PlannerProposal, Graph } from "../../shared/types";
import { NotImplementedError } from "../../shared/utils/errors";

/**
 * Transforms an AI-generated PlannerProposal into a strict, deterministic Graph model.
 * Does not implement graph algorithms directly. 
 * Provides the boundary between the AI output and the mathematical engine.
 */
export function buildGraphFromProposal(proposal: PlannerProposal): Graph {
  throw new NotImplementedError("Graph Builder transformation is deferred to Phase 2.");
}
