import { UserRequest, ExecutionPlan } from "../../shared/types";
import { NotImplementedError } from "../../shared/utils/errors";
import { PipelineContext } from "./interfaces";

/**
 * The master pipeline controller. Coordinates AI proposals and Deterministic validations.
 * Dependencies are injected via the PipelineContext to decouple implementations.
 */
export async function createExecutionPlan(request: UserRequest, context: PipelineContext): Promise<ExecutionPlan> {
  throw new NotImplementedError("Orchestrator pipeline execution is deferred to Phase 2.");
}
