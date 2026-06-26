import { UserRequest, PlannerProposal, Graph, ExecutionPlan, RiskReport, OptimizationReport, Roadmap, Schedule, FeasibilityReport, ConfidenceReport, BottleneckReport } from "../../shared/types";

export interface IPlannerAgent {
  execute(request: UserRequest): Promise<PlannerProposal>;
}

export interface IRedTeamAgent {
  execute(roadmap: Roadmap, request: UserRequest): Promise<RiskReport>;
}

export interface ITimelineOptimizer {
  execute(plan: ExecutionPlan, proposal: PlannerProposal): Promise<OptimizationReport>;
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
