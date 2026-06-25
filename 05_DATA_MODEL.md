# 05_DATA_MODEL

## 1. Core Design Philosophy

The PathForge data model is the deterministic bedrock of the system. To ensure absolute correctness between probabilistic AI generation and deterministic algorithmic validation, all data structures must adhere to the following principles:

*   **Immutable State:** Objects are never mutated in place. Transformations generate entirely new instances of the data structure.
*   **Deterministic Validation:** Every object passing across a system boundary must conform exactly to a strict schema.
*   **Strict JSON Contracts:** Data exchanges between the UI, API Gateway, Orchestrator, AI Agents, and Algorithm Engines occur exclusively via strictly typed JSON payloads.
*   **No Implicit Fields:** Every property has a stated presence. Defaults are never assumed; they must be explicitly declared.
*   **No Nullable Ambiguity:** Fields are either present and valid, or structurally omitted. `null` is forbidden as a placeholder for "unknown."
*   **No Magic Values:** Status codes, severity levels, and edge types use strict string enumerations rather than arbitrary numbers or unstructured text.
*   **Versionable Schemas:** Every top-level payload carries a schema version identifier.
*   **Forward Compatibility:** Changes to the data model must be strictly additive. Removing or altering existing properties requires a major schema version bump.

---

## 2. Global Object Hierarchy

The PathForge data ecosystem cascades from the initial user request down to the final verified execution plan.

```text
Project
 └── ProjectGoal
 └── ProjectConstraints
 └── ExecutionPlan (The Final Verified Payload)
      ├── Roadmap
      │    ├── Graph
      │    │    ├── Nodes (Tasks & Milestones)
      │    │    └── Edges (Dependencies)
      │    └── Schedule (CPM/PERT Timeline)
      │         ├── ScheduleMetadata
      │         └── CPMResults
      └── Analysis
           ├── FeasibilityReport
           ├── ConfidenceReport
           ├── RiskReport
           └── BottleneckReport
```

**Relationship Explanation:**
*   **Project:** The aggregate container holding the user's intent and the system's finalized output.
*   **Roadmap:** The structural and temporal representation of the work (Graph + Schedule).
*   **Graph:** The pure mathematical Directed Acyclic Graph.
*   **Schedule:** The temporal mappings applied to the Graph via algorithms.
*   **Analysis:** The aggregated metrics, AI critiques, and systemic scoring applied to the Roadmap.
*   **Execution Plan:** The finalized, fully verified output presented to the user.

---

## 3. User Request Models

The initial payload submitted by the UI to the backend to begin the planning process.

### `UserRequest`
*   **goal (ProjectGoal):** Required. The core objective.
*   **constraints (ProjectConstraints):** Optional. User-defined limits on execution.
*   **preferences (UserPreferences):** Optional. Heuristics for the Planner Agent.

### `ProjectGoal`
*   **description:** String. Required. The raw text goal from the user.
*   **context:** String. Optional. Surrounding business or technical context.

### `ProjectConstraints`
*   **deadline:** ISO8601 Date String. Optional.
*   **budget:** Number. Optional. Total allocated funds.
*   **availableHoursPerWeek:** Number. Optional.
*   **requiredMilestones:** Array of Strings. Optional.

### `UserPreferences`
*   **skillLevel:** Enum (`BEGINNER`, `INTERMEDIATE`, `EXPERT`). Optional.
*   **technologyPreferences:** Array of Strings. Optional.
*   **riskTolerance:** Enum (`LOW`, `MEDIUM`, `HIGH`). Optional.

**Validation Rules:** `description` must not be empty. Numeric constraints must be >= 0.

---

## 4. Planner Agent Output

The direct, unverified JSON output proposed by the LLM Planner Agent.

### `PlannerProposal`
*   **tasks:** Array of `ProposedTask`. Required.
*   **dependencies:** Array of `ProposedDependency`. Required.
*   **assumptions:** Array of Strings. Required.
*   **plannerConfidence:** Number (0.0 to 1.0). Required.
*   **aiReasoning:** String. Required.

### `ProposedTask`
*   **taskId:** UUID String. Required.
*   **title:** String. Required.
*   **description:** String. Required.
*   **optimisticDuration:** Number (Days). Required.
*   **mostLikelyDuration:** Number (Days). Required.
*   **pessimisticDuration:** Number (Days). Required.
*   **requiredSkills:** Array of Strings. Optional.
*   **resourceAssumptions:** Array of Strings. Optional.

### `ProposedDependency`
*   **fromTaskId:** UUID String. Required. (The prerequisite)
*   **toTaskId:** UUID String. Required. (The dependent)
*   **rationale:** String. Required. Why this dependency exists.

---

## 5. Graph Model

The pure mathematical structure constructed by the Algorithm Layer.

### `Graph`
*   **nodes:** Array of `Node`. Required.
*   **edges:** Array of `DirectedEdge`. Required.
*   **metadata:** `GraphMetadata`. Required.

### `Node`
*   **id:** UUID String. Required.
*   **type:** Enum (`STANDARD`, `MILESTONE`, `VIRTUAL_SOURCE`, `VIRTUAL_SINK`). Required.
*   **baseData:** `ProposedTask`. Required for `STANDARD` nodes, omitted for `VIRTUAL`.

### `DirectedEdge`
*   **sourceId:** UUID String. Required.
*   **targetId:** UUID String. Required.
*   **type:** Enum (`FINISH_TO_START`). Required.

### `GraphMetadata`
*   **nodeCount:** Number. Required.
*   **edgeCount:** Number. Required.
*   **disconnectedComponents:** Number. Required.

### Validation Reports
*   **GraphValidationReport:** Contains `isValid` (Boolean), `unresolvedOrphans` (Array of IDs).
*   **CycleReport:** Contains `hasCycles` (Boolean), `cyclePaths` (Array of Arrays of IDs).

---

## 6. Scheduling Model

The deterministic temporal overlay computed via PERT and CPM.

### `Schedule`
*   **cpmResults:** Array of `CPMResult`. Required.
*   **criticalPathIds:** Array of UUID Strings. Required.
*   **projectDuration:** Number. Required.

### `CPMResult`
*   **nodeId:** UUID String. Required.
*   **pertDuration:** Number. Required. The single calculated Expected Time.
*   **earlyStart:** Number. Required.
*   **earlyFinish:** Number. Required.
*   **lateStart:** Number. Required.
*   **lateFinish:** Number. Required.
*   **totalFloat:** Number. Required.
*   **freeFloat:** Number. Required.
*   **isCritical:** Boolean. Required.

---

## 7. Analysis Model

The analytical reports generated by Deterministic Engines and AI Agents.

### `Analysis`
*   **feasibility:** `FeasibilityReport`. Required.
*   **confidence:** `ConfidenceReport`. Required.
*   **risks:** `RiskReport`. Required.
*   **bottlenecks:** `BottleneckReport`. Required.
*   **optimizations:** `OptimizationRecommendation`. Optional.

### `FeasibilityReport`
*   **score:** Number (0.0 to 1.0). Required. Deterministic structural correctness.
*   **scheduleHealth:** Enum (`ROBUST`, `FRAGILE`, `UNFEASIBLE`). Required.

### `ConfidenceReport`
*   **score:** Number (0 to 100). Required. AI generation quality and systemic trust.
*   **penaltiesApplied:** Array of Strings. Required. (e.g., "Planner validation retry required").

### `RiskReport`
*   **overallRisk:** Enum (`LOW`, `MEDIUM`, `HIGH`, `FATAL`). Required.
*   **identifiedRisks:** Array of `RiskItem`. Required.

### `RiskItem`
*   **id:** UUID String. Required.
*   **severity:** Enum (`LOW`, `MEDIUM`, `HIGH`, `FATAL`). Required.
*   **category:** Enum (`STRUCTURAL`, `TEMPORAL`, `SEMANTIC`, `ASSUMPTION`). Required.
*   **description:** String. Required.
*   **impactedNodeIds:** Array of UUID Strings. Required.
*   **mitigation:** String. Required.

### `BottleneckReport`
*   **bottleneckNodes:** Array of `BottleneckNode`. Required.

### `BottleneckNode`
*   **nodeId:** UUID String. Required.
*   **fanIn:** Number. Required.
*   **fanOut:** Number. Required.
*   **downstreamImpactCount:** Number. Required.

### `OptimizationRecommendation`
*   **proposedMutations:** Array of Strings. Required.
*   **estimatedDurationSavings:** Number. Required.

---

## 8. AI Agent Communication Contracts

Rules governing payloads exchanged sequentially through the pipeline.

*   **Planner Output ➔ Graph Builder:** The Graph Builder accepts only the strict `PlannerProposal`. No temporal or algorithmic metadata is permitted at this stage.
*   **Graph Builder ➔ Red Team Agent:** The Red Team receives the `Graph`, `Schedule`, and the original `ProjectGoal`. It is strictly forbidden from receiving previous AI reasoning traces to prevent confirmation bias.
*   **Optimization Agent ➔ Verification Agent:** The Optimizer outputs a `ProposedMutation` (list of edge additions/deletions). The Verification Agent responds with a `GraphValidationReport` and `CycleReport`.

---

## 9. API Response Objects

Standard envelopes for all HTTP transactions.

### `SuccessResponse`
*   **status:** String ("success"). Required.
*   **data:** Object (The payload, e.g., `ExecutionPlan`). Required.
*   **metadata:** Object (Processing time, schema version). Required.

### `FailureResponse`
*   **status:** String ("error"). Required.
*   **error:** `ErrorDetails`. Required.

### `ErrorDetails`
*   **code:** String (e.g., `VALIDATION_ERROR`, `CYCLE_DETECTED`, `LLM_TIMEOUT`). Required.
*   **message:** String. Required. Human-readable explanation.
*   **details:** Object. Optional. Payload-specific debug information (e.g., specific missing fields or cyclic paths).

---

## 10. Versioning Strategy

*   **Schema Versioning:** Every JSON contract includes a `$schemaVersion` property (e.g., `"1.0.0"`).
*   **Backward Compatibility:** Future additions (e.g., Start-to-Start dependencies in V2) will be added as new optional fields or new enum values. Existing fields will not be renamed or repurposed.
*   **Deprecation:** Removed fields will remain in the schema marked as deprecated for one major version cycle before actual removal.

---

## 11. Naming Conventions

*   **Keys and Properties:** `camelCase` (e.g., `optimisticDuration`, `earlyStart`).
*   **Types and Models:** `PascalCase` (e.g., `FeasibilityReport`, `ProjectGoal`).
*   **Enums:** `UPPER_SNAKE_CASE` (e.g., `FINISH_TO_START`, `VIRTUAL_SINK`).
*   **Identifiers (IDs):** Standard UUIDv4 format.
*   **Dates and Timestamps:** ISO8601 Strings in UTC (e.g., `2026-06-25T09:30:00Z`).
*   **Durations:** Numeric values representing strict days.
*   **Scores:**
    *   Confidence: `0` to `100` (Integer).
    *   Feasibility: `0.0` to `1.0` (Float).

---

## 12. Validation Rules (Invariants)

Every data payload must mathematically satisfy these invariants before continuing through the pipeline:

1.  **Unique Task IDs:** No two tasks in a `PlannerProposal` or `Graph` may share an ID.
2.  **No Self Loops:** No `DirectedEdge` may have `sourceId` == `targetId`.
3.  **Valid Edge References:** Every `sourceId` and `targetId` in an edge must exist in the `nodes` array.
4.  **Duration Bounds:** Optimistic $\le$ Most Likely $\le$ Pessimistic.
5.  **Positive Durations:** All durations must be $\ge 0$. (Only milestones may be exactly `0`).
6.  **No Duplicate Edges:** Between any two nodes A and B, only one directional edge A $\to$ B may exist.
7.  **Score Bounds:** Confidence must be between $0$ and $100$. Feasibility must be between $0.0$ and $1.0$.
8.  **Complete CPM Maps:** The `cpmResults` array must contain an entry for every node in the `nodes` array.
9.  **Connected Graph (Virtual Anchors):** Post-validation, every true node must be reachable from the `VIRTUAL_SOURCE` and must be able to reach the `VIRTUAL_SINK`. No absolute orphans may exist.

---

## Data Model Completeness Checklist

- [x] Core Design Philosophy documented (Immutable, Deterministic, Strict).
- [x] Global Object Hierarchy defined conceptually.
- [x] User Request Models mapped (Goals, Constraints, Preferences).
- [x] Planner Agent Output strict structure defined.
- [x] Graph Model mathematically mapped.
- [x] Scheduling Model (CPM/PERT outputs) mapped.
- [x] Analysis Model (Feasibility, Confidence, Risk, Bottlenecks) defined.
- [x] AI Agent Communication Contracts clarified.
- [x] API Response Objects standardized for Success and Failure.
- [x] Versioning Strategy strictly established.
- [x] Naming Conventions (camelCase, PascalCase, Enums) enforced.
- [x] Validation Rules and Mathematical Invariants bounded.
- [x] Confirm no implementation code (TS, Zod, DB schemas) was written.
