import { Graph, Schedule, FeasibilityReport, ConfidenceReport, PlannerProposal } from "../../shared/types";
import { GraphMetrics } from "./analysis";
import { AnalysisThresholds, HeuristicsConstants } from "./constants";

/**
 * Calculates a feasibility score based on graph connectivity, depth, and critical density.
 * @param metrics - Pre-computed metrics for the graph.
 * @returns {FeasibilityReport} Contains a normalized score [0-1] and descriptive label.
 * @timeComplexity O(1) relies entirely on precomputed metrics.
 * @spaceComplexity O(1) for generating report.
 */
export function calculateFeasibility(metrics: GraphMetrics): FeasibilityReport {
  // Inputs:
  // - Prerequisite Completeness: Evaluates if terminal nodes have a logically deep prerequisite chain.
  // - Blocker Density: The ratio of critical tasks to total tasks (criticalDensity).
  // - Graph Fragmentation: The number of independent disconnected components.

  let score = 1.0;

  // Penalize high critical density (Blocker Density)
  if (metrics.criticalDensity > AnalysisThresholds.CRITICAL_DENSITY_HIGH) {
    score -= 0.3;
  } else if (metrics.criticalDensity > AnalysisThresholds.CRITICAL_DENSITY_MODERATE) {
    score -= 0.1;
  }

  // Penalize excessive fragmentation
  if (metrics.fragmentation > AnalysisThresholds.FRAGMENTATION_HIGH) {
    score -= 0.2;
  } else if (metrics.fragmentation > AnalysisThresholds.FRAGMENTATION_MODERATE) {
    score -= 0.1;
  }

  // Prerequisite Completeness: max depth should ideally be >= MINIMUM_HEALTHY_DEPTH for a healthy project
  if (metrics.maxDepth < AnalysisThresholds.MINIMUM_HEALTHY_DEPTH) {
    score -= 0.1;
  }

  score = Math.max(0, Math.min(1, score));

  let scheduleHealth: "ROBUST" | "FRAGILE" | "UNFEASIBLE";
  if (score >= 0.8) {
    scheduleHealth = "ROBUST";
  } else if (score >= 0.5) {
    scheduleHealth = "FRAGILE";
  } else {
    scheduleHealth = "UNFEASIBLE";
  }

  return {
    score,
    scheduleHealth,
  };
}

/**
 * Calculates an overall confidence score adjusting planner confidence with heuristic penalties.
 * @param proposal - The AI Planner proposal output.
 * @param metrics - The pre-calculated metrics for the graph.
 * @returns {ConfidenceReport} containing adjusted confidence score [0-100] and list of penalty reasons.
 * @timeComplexity O(1) relies entirely on precomputed metrics and fixed proposal array length.
 * @spaceComplexity O(1) beyond the returned array.
 */
export function calculateConfidence(
  proposal: PlannerProposal, 
  metrics: GraphMetrics
): ConfidenceReport {
  // Inputs:
  // - Planner Adherence: 100 for now.
  // - AI Planner Confidence: (from PlannerProposal, 0 to 1).
  // - Unresolved Assumptions: Density of explicit assumptions.
  
  let baseScore = proposal.plannerConfidence * HeuristicsConstants.BASE_SCORE_MULTIPLIER;
  const penaltiesApplied: string[] = [];

  const assumptionCount = proposal.assumptions.length;
  if (assumptionCount > HeuristicsConstants.MAX_ASSUMPTIONS) {
    baseScore -= HeuristicsConstants.ASSUMPTIONS_HEAVY_PENALTY;
    penaltiesApplied.push("High density of unresolved assumptions");
  } else if (assumptionCount > 0) {
    baseScore -= (assumptionCount * HeuristicsConstants.ASSUMPTION_UNIT_PENALTY);
    penaltiesApplied.push(`Assumptions require verification (${assumptionCount})`);
  }

  // High project variance means temporal uncertainty
  if (metrics.projectStandardDeviation > HeuristicsConstants.HIGH_VARIANCE_THRESHOLD) {
    baseScore -= HeuristicsConstants.HIGH_VARIANCE_PENALTY;
    penaltiesApplied.push("High execution variance (uncertain estimates)");
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(baseScore)));

  return {
    score: finalScore,
    penaltiesApplied,
  };
}
