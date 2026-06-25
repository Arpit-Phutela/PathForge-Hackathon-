import { Graph, Schedule } from "../../shared/types";
import { NotImplementedError } from "../../shared/utils/errors";

/**
 * Executes the Critical Path Method on a validated DAG.
 * Performs forward and backward passes calculating ES, EF, LS, LF, Float.
 */
export function calculateCPM(graph: Graph): Schedule {
  throw new NotImplementedError("CPM calculation algorithm is deferred to Phase 2.");
}
