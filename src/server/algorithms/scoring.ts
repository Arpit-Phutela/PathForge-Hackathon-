import { Graph, Schedule, Analysis, FeasibilityReport, ConfidenceReport, BottleneckReport, PlannerProposal } from "../../shared/types";
import { computeGraphMetrics, detectBottlenecks } from "./analysis";
import { calculateFeasibility, calculateConfidence } from "./heuristics";

/**
 * Computes deterministic scores (Feasibility, Confidence, Bottlenecks)
 * based on the calculated schedule and graph metrics.
 */
export function computeDeterministicAnalysis(
  graph: Graph, 
  schedule: Schedule,
  proposal: PlannerProposal
): { feasibility: FeasibilityReport, confidence: ConfidenceReport, bottlenecks: BottleneckReport } {
  const metrics = computeGraphMetrics(graph, schedule);
  
  const feasibility = calculateFeasibility(metrics);
  const confidence = calculateConfidence(proposal, metrics);
  const bottlenecks = detectBottlenecks(graph, metrics, schedule);

  return {
    feasibility,
    confidence,
    bottlenecks
  };
}

