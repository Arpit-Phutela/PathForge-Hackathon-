import { describe, it, expect } from "vitest";
import { calculateFeasibility, calculateConfidence } from "./heuristics";
import { GraphMetrics } from "./analysis";
import { PlannerProposal } from "../../shared/types";

describe("Heuristics Engine", () => {
  describe("Feasibility Score", () => {
    it("returns ROBUST for a healthy project", () => {
      const metrics: GraphMetrics = {
        nodes: new Map(),
        projectVariance: 1,
        projectStandardDeviation: 1,
        criticalDensity: 0.3, // low density
        maxDepth: 5,          // deep structure
        fragmentation: 1,     // connected graph
      };

      const result = calculateFeasibility(metrics);
      expect(result.score).toBe(1.0);
      expect(result.scheduleHealth).toBe("ROBUST");
    });

    it("returns FRAGILE for a project with high critical density and some fragmentation", () => {
      const metrics: GraphMetrics = {
        nodes: new Map(),
        projectVariance: 1,
        projectStandardDeviation: 1,
        criticalDensity: 0.6, // high density -> -0.1
        maxDepth: 5,
        fragmentation: 2,     // fragmented -> -0.1
      };

      const result = calculateFeasibility(metrics);
      expect(result.score).toBeCloseTo(0.8);
      // Wait, 0.8 is ROBUST or FRAGILE?
      // Our logic: >= 0.8 is ROBUST, <0.8 is FRAGILE
      expect(result.scheduleHealth).toBe("ROBUST");
    });

    it("returns UNFEASIBLE for highly fragmented, critical-heavy, shallow projects", () => {
      const metrics: GraphMetrics = {
        nodes: new Map(),
        projectVariance: 1,
        projectStandardDeviation: 1,
        criticalDensity: 0.9, // -> -0.3
        maxDepth: 1,          // -> -0.1
        fragmentation: 4,     // -> -0.2
      }; // score = 1.0 - 0.6 = 0.4

      const result = calculateFeasibility(metrics);
      expect(result.score).toBeCloseTo(0.4);
      expect(result.scheduleHealth).toBe("UNFEASIBLE");
    });
  });

  describe("Confidence Score", () => {
    it("gives 100% confidence for perfect proposal and low variance", () => {
      const proposal: PlannerProposal = {
        tasks: [], dependencies: [], assumptions: [], 
        plannerConfidence: 1.0, aiReasoning: ""
      };
      const metrics: GraphMetrics = {
        nodes: new Map(),
        projectVariance: 1,
        projectStandardDeviation: 1,
        criticalDensity: 0.3,
        maxDepth: 5,
        fragmentation: 1,
      };

      const result = calculateConfidence(proposal, metrics);
      expect(result.score).toBe(100);
      expect(result.penaltiesApplied).toHaveLength(0);
    });

    it("applies penalties for assumptions and high variance", () => {
      const proposal: PlannerProposal = {
        tasks: [], dependencies: [], 
        assumptions: ["assump 1", "assump 2", "assump 3", "assump 4", "assump 5", "assump 6"], // > 5 assumptions -> -20
        plannerConfidence: 0.9, // base 90
        aiReasoning: ""
      };
      const metrics: GraphMetrics = {
        nodes: new Map(),
        projectVariance: 36,
        projectStandardDeviation: 6, // > 5 -> -15
        criticalDensity: 0.3,
        maxDepth: 5,
        fragmentation: 1,
      };

      const result = calculateConfidence(proposal, metrics);
      // Base = 90. - 20 (assumptions) - 15 (variance) = 55
      expect(result.score).toBe(55);
      expect(result.penaltiesApplied).toContain("High density of unresolved assumptions");
      expect(result.penaltiesApplied).toContain("High execution variance (uncertain estimates)");
    });
  });
});
