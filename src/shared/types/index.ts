import { z } from "zod";

// ---------------------------------------------------------
// User Request Models
// ---------------------------------------------------------
export const ProjectGoalSchema = z.object({
  description: z.string().min(1),
  context: z.string().optional(),
});

export const ProjectConstraintsSchema = z.object({
  deadline: z.string().datetime().optional(),
  budget: z.number().min(0).optional(),
  availableHoursPerWeek: z.number().min(0).optional(),
  requiredMilestones: z.array(z.string()).optional(),
});

export const UserPreferencesSchema = z.object({
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]).optional(),
  technologyPreferences: z.array(z.string()).optional(),
  riskTolerance: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export const UserRequestSchema = z.object({
  goal: ProjectGoalSchema,
  constraints: ProjectConstraintsSchema.optional(),
  preferences: UserPreferencesSchema.optional(),
});

// ---------------------------------------------------------
// Planner Agent Output
// ---------------------------------------------------------
export const ProposedTaskSchema = z.object({
  taskId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  optimisticDuration: z.number().min(0),
  mostLikelyDuration: z.number().min(0),
  pessimisticDuration: z.number().min(0),
  requiredSkills: z.array(z.string()).optional(),
  resourceAssumptions: z.array(z.string()).optional(),
});

export const ProposedDependencySchema = z.object({
  fromTaskId: z.string().uuid(),
  toTaskId: z.string().uuid(),
  rationale: z.string().min(1),
});

export const PlannerProposalSchema = z.object({
  tasks: z.array(ProposedTaskSchema),
  dependencies: z.array(ProposedDependencySchema),
  assumptions: z.array(z.string()),
  plannerConfidence: z.number().min(0).max(1),
  aiReasoning: z.string().min(1),
});

// ---------------------------------------------------------
// Graph Model
// ---------------------------------------------------------
export const NodeTypeSchema = z.enum(["STANDARD", "MILESTONE", "VIRTUAL_SOURCE", "VIRTUAL_SINK"]);

export const TaskNodeDataSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  optimisticDuration: z.number().min(0),
  mostLikelyDuration: z.number().min(0),
  pessimisticDuration: z.number().min(0),
  requiredSkills: z.array(z.string()).optional(),
  resourceAssumptions: z.array(z.string()).optional(),
});

export const NodeSchema = z.object({
  id: z.string().uuid(),
  type: NodeTypeSchema,
  baseData: TaskNodeDataSchema.optional(),
});

export const EdgeTypeSchema = z.enum(["FINISH_TO_START"]);

export const DirectedEdgeSchema = z.object({
  sourceId: z.string().uuid(),
  targetId: z.string().uuid(),
  type: EdgeTypeSchema,
});

export const GraphMetadataSchema = z.object({
  nodeCount: z.number().int().min(0),
  edgeCount: z.number().int().min(0),
  disconnectedComponents: z.number().int().min(0),
});

export const GraphSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(DirectedEdgeSchema),
  metadata: GraphMetadataSchema,
});

export const GraphValidationReportSchema = z.object({
  isValid: z.boolean(),
  unresolvedOrphans: z.array(z.string().uuid()),
});

export const CycleReportSchema = z.object({
  hasCycles: z.boolean(),
  cyclePaths: z.array(z.array(z.string().uuid())),
});

// ---------------------------------------------------------
// Scheduling Model
// ---------------------------------------------------------
export const CPMResultSchema = z.object({
  nodeId: z.string().uuid(),
  pertDuration: z.number().min(0),
  earlyStart: z.number().min(0),
  earlyFinish: z.number().min(0),
  lateStart: z.number().min(0),
  lateFinish: z.number().min(0),
  totalFloat: z.number().min(0),
  freeFloat: z.number().min(0),
  isCritical: z.boolean(),
});

export const ScheduleSchema = z.object({
  cpmResults: z.array(CPMResultSchema),
  criticalPathIds: z.array(z.string().uuid()),
  projectDuration: z.number().min(0),
});

// ---------------------------------------------------------
// Analysis Model
// ---------------------------------------------------------
export const FeasibilityReportSchema = z.object({
  score: z.number().min(0).max(1),
  scheduleHealth: z.enum(["ROBUST", "FRAGILE", "UNFEASIBLE"]),
});

export const ConfidenceReportSchema = z.object({
  score: z.number().min(0).max(100),
  penaltiesApplied: z.array(z.string()),
});

export const RiskSeveritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "FATAL"]);
export const RiskCategorySchema = z.enum(["STRUCTURAL", "TEMPORAL", "SEMANTIC", "ASSUMPTION"]);

export const RiskItemSchema = z.object({
  id: z.string().uuid(),
  severity: RiskSeveritySchema,
  category: RiskCategorySchema,
  description: z.string().min(1),
  impactedNodeIds: z.array(z.string().uuid()),
  mitigation: z.string().min(1),
});

export const RiskReportSchema = z.object({
  overallRisk: RiskSeveritySchema,
  identifiedRisks: z.array(RiskItemSchema),
});

export const BottleneckNodeSchema = z.object({
  nodeId: z.string().uuid(),
  fanIn: z.number().int().min(0),
  fanOut: z.number().int().min(0),
  downstreamImpactCount: z.number().int().min(0),
});

export const BottleneckReportSchema = z.object({
  bottleneckNodes: z.array(BottleneckNodeSchema),
});

export const ScenarioMutationSchema = z.union([
  z.object({ type: z.literal("DELAY_TASK"), taskId: z.string().uuid(), delayDays: z.number().min(0) }),
  z.object({ type: z.literal("SHORTEN_TASK"), taskId: z.string().uuid(), shortenDays: z.number().min(0) }),
  z.object({ type: z.literal("REMOVE_DEPENDENCY"), fromTaskId: z.string().uuid(), toTaskId: z.string().uuid() }),
  z.object({ type: z.literal("ADD_DEPENDENCY"), fromTaskId: z.string().uuid(), toTaskId: z.string().uuid() }),
  z.object({ type: z.literal("MARK_BLOCKED"), taskId: z.string().uuid() }),
  z.object({ type: z.literal("MARK_COMPLETED"), taskId: z.string().uuid() })
]);

export const OptimizationStrategySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  mutations: z.array(ScenarioMutationSchema),
  deterministicEvidence: z.object({
    durationImprovementDays: z.number(),
    feasibilityImprovement: z.number(),
    confidenceImpact: z.number(),
    bottlenecksReduced: z.number(),
    criticalPathChanged: z.boolean()
  }),
  tradeOffs: z.array(z.string())
});

export const OptimizationReportSchema = z.object({
  rankedStrategies: z.array(OptimizationStrategySchema),
  naturalLanguageExplanation: z.string()
});

// Update AnalysisSchema to use OptimizationReportSchema instead of OptimizationRecommendationSchema (or keep both and just add OptimizationReportSchema to the exports)
export const AnalysisSchema = z.object({
  feasibility: FeasibilityReportSchema,
  confidence: ConfidenceReportSchema,
  risks: RiskReportSchema,
  bottlenecks: BottleneckReportSchema,
  optimizations: OptimizationReportSchema.optional(),
});

// ---------------------------------------------------------
// Execution Plan
// ---------------------------------------------------------
export const RoadmapSchema = z.object({
  graph: GraphSchema,
  schedule: ScheduleSchema,
});

export const ExecutionPlanSchema = z.object({
  roadmap: RoadmapSchema,
  analysis: AnalysisSchema,
});

// ---------------------------------------------------------
// Scenario Simulation Model
// ---------------------------------------------------------
export const ScenarioResultSchema = z.object({
  simulatedPlan: ExecutionPlanSchema,
  delta: z.object({
    durationDelta: z.number(),
    feasibilityDelta: z.number(),
    newRisks: z.array(RiskItemSchema),
    criticalPathChanged: z.boolean(),
  }),
});

// ---------------------------------------------------------
// API Responses
// ---------------------------------------------------------
export const ErrorDetailsSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.any()).optional(),
});

export const FailureResponseSchema = z.object({
  status: z.literal("error"),
  error: ErrorDetailsSchema,
});

export const SuccessResponseSchema = z.object({
  status: z.literal("success"),
  data: z.record(z.string(), z.any()), // Or specify depending on endpoint
  metadata: z.object({
    processingTimeMs: z.number().min(0),
    schemaVersion: z.string(),
  }),
});

// Export inferred types
export type ProjectGoal = z.infer<typeof ProjectGoalSchema>;
export type ProjectConstraints = z.infer<typeof ProjectConstraintsSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UserRequest = z.infer<typeof UserRequestSchema>;

export type ProposedTask = z.infer<typeof ProposedTaskSchema>;
export type ProposedDependency = z.infer<typeof ProposedDependencySchema>;
export type PlannerProposal = z.infer<typeof PlannerProposalSchema>;

export type NodeType = z.infer<typeof NodeTypeSchema>;
export type TaskNodeData = z.infer<typeof TaskNodeDataSchema>;
export type Node = z.infer<typeof NodeSchema>;
export type EdgeType = z.infer<typeof EdgeTypeSchema>;
export type DirectedEdge = z.infer<typeof DirectedEdgeSchema>;
export type GraphMetadata = z.infer<typeof GraphMetadataSchema>;
export type Graph = z.infer<typeof GraphSchema>;
export type GraphValidationReport = z.infer<typeof GraphValidationReportSchema>;
export type CycleReport = z.infer<typeof CycleReportSchema>;

export type CPMResult = z.infer<typeof CPMResultSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;

export type FeasibilityReport = z.infer<typeof FeasibilityReportSchema>;
export type ConfidenceReport = z.infer<typeof ConfidenceReportSchema>;
export type RiskSeverity = z.infer<typeof RiskSeveritySchema>;
export type RiskCategory = z.infer<typeof RiskCategorySchema>;
export type RiskItem = z.infer<typeof RiskItemSchema>;
export type RiskReport = z.infer<typeof RiskReportSchema>;
export type BottleneckNode = z.infer<typeof BottleneckNodeSchema>;
export type BottleneckReport = z.infer<typeof BottleneckReportSchema>;
export type OptimizationStrategy = z.infer<typeof OptimizationStrategySchema>;
export type OptimizationReport = z.infer<typeof OptimizationReportSchema>;
export type Analysis = z.infer<typeof AnalysisSchema>;

export type Roadmap = z.infer<typeof RoadmapSchema>;
export type ExecutionPlan = z.infer<typeof ExecutionPlanSchema>;

export type ScenarioMutation = z.infer<typeof ScenarioMutationSchema>;
export type ScenarioResult = z.infer<typeof ScenarioResultSchema>;

export type ErrorDetails = z.infer<typeof ErrorDetailsSchema>;
export type FailureResponse = z.infer<typeof FailureResponseSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
