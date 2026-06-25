import { UserRequest, PlannerProposal, Graph, ExecutionPlan, RiskReport, OptimizationRecommendation, Roadmap } from "../../shared/types";

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
  calculateCPM(graph: Graph): any; // Will return Schedule later
  computeScoring(graph: Graph, schedule: any): any;
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
