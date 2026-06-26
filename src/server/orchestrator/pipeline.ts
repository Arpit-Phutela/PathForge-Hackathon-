import { UserRequest, ExecutionPlan } from "../../shared/types";
import { PipelineContext } from "./interfaces";

/**
 * The master pipeline controller. Coordinates AI proposals and Deterministic validations.
 * Dependencies are injected via the PipelineContext to decouple implementations.
 */
export async function createExecutionPlan(request: UserRequest, context: PipelineContext): Promise<ExecutionPlan> {
  // 1. Planner Agent
  const proposal = await context.planner.execute(request);

  // 2. Graph Builder
  const graph = context.graphBuilder.build(proposal);

  // 3. Validation
  context.algorithms.validateGraph(graph);

  // 4. Cycle Detection
  context.algorithms.detectCycles(graph);

  // 5. Topological Sort
  context.algorithms.topologicalSort(graph);

  // 6. CPM
  const schedule = context.algorithms.calculateCPM(graph);

  // 7. Analysis & Heuristics
  const analysisOutput = context.algorithms.computeDeterministicAnalysis(graph, schedule, proposal);

  // 8. Construct Execution Plan
  // No Scenario Simulation / Optimization / Red Team for now, just deterministic + planner
  return {
    roadmap: {
      graph,
      schedule,
    },
    analysis: {
      feasibility: analysisOutput.feasibility,
      confidence: analysisOutput.confidence,
      bottlenecks: analysisOutput.bottlenecks,
      risks: {
        overallRisk: "LOW",
        identifiedRisks: [] // Deferred
      }
    }
  };
}
