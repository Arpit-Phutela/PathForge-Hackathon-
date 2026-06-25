import { UserRequest, PlannerProposal } from "../../shared/types";
import { NotImplementedError } from "../../shared/utils/errors";

/**
 * Prompts Gemini to break down a project goal into a structured list of tasks
 * and proposed dependencies. 
 */
export async function executePlannerAgent(request: UserRequest): Promise<PlannerProposal> {
  throw new NotImplementedError("Planner Agent execution is deferred to Phase 2.");
}
