import { UserRequest, PlannerProposal, Graph, ExecutionPlan, RiskReport, OptimizationRecommendation, Roadmap, Schedule, FeasibilityReport, ConfidenceReport, BottleneckReport } from "../../shared/types";

export interface IPlannerAgent {
  execute(request: UserRequest): Promise<PlannerProposal>;
}

export interface IRedTeamAgent {
  execute(roadmap: Roadmap, request: UserRequest): Promise<RiskReport>;
}

export interface ITimelineOptimizer {
  execute(roadmap: Roadmap, risks: RiskReport): Promise<OptimizationRecommendation>;
}

export interface IGraphBuilder {
  build(proposal: PlannerProposal): Graph;
}

export interface IAlgorithmEngine {
  validateGraph(graph: Graph): void;
  detectCycles(graph: Graph): void;
  topologicalSort(graph: Graph): string[];
  calculateCPM(graph: Graph): Schedule;
  computeDeterministicAnalysis(
    graph: Graph, 
    schedule: Schedule, 
    proposal: PlannerProposal
  ): { feasibility: FeasibilityReport, confidence: ConfidenceReport, bottlenecks: BottleneckReport };
}

/**
 * Dependency Injection Context for the Orchestrator Pipeline.
 * Future phases will bind real implementations to these interfaces.
 */
export interface PipelineContext {
  planner: IPlannerAgent;
  redTeam: IRedTeamAgent;
  optimizer: ITimelineOptimizer;
  graphBuilder: IGraphBuilder;
  algorithms: IAlgorithmEngine;
}
