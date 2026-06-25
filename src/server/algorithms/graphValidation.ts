import { Graph, CycleReport } from "../../shared/types";
import { NotImplementedError } from "../../shared/utils/errors";

/**
 * Validates the graph structure ensuring no orphans and proper virtual sink/source setup.
 * Throws InvalidEdgeError or MissingDataError on failure.
 */
export function validateGraphStructure(graph: Graph): void {
  throw new NotImplementedError("Graph structural validation is deferred to Phase 2.");
}

/**
 * Performs Cycle Detection (DFS) on a validated DAG.
 * Returns a CycleReport. If cycles exist, does NOT mutate the graph.
 */
export function detectCycles(graph: Graph): CycleReport {
  throw new NotImplementedError("Cycle detection algorithm is deferred to Phase 2.");
}
