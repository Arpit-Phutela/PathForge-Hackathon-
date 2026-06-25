# 03_AI_AGENT_SPECIFICATION

## 1. Agent Philosophy

PathForge is NOT a chatbot. It is NOT an open-ended AI assistant. It is a strict, AI-assisted deterministic execution intelligence system. 

Within this architecture, Large Language Models (LLMs) operate exclusively as proposal generators. They are treated as highly capable but inherently fallible heuristic engines. 

**Core Axioms:**
*   **AI proposes. Algorithms dispose.**
*   AI never makes final decisions regarding scheduling, timelines, or structural validity.
*   Algorithms and deterministic mathematical engines make all final decisions.
*   AI is strictly forbidden from directly mutating application state. 
*   Only verified deterministic computation is allowed to mutate the master project state.

## 2. Overall Agent Pipeline

The PathForge execution intelligence lifecycle follows a rigid, unidirectional pipeline. A request must pass every sequential gate before a plan is presented to the user.

```text
User Goal
   ↓
[ Planner Agent ] (AI)
   ↓
[ JSON Validation ] (Deterministic)
   ↓
[ Graph Builder ] (Deterministic)
   ↓
[ Dependency Validator ] (Deterministic)
   ↓
[ Cycle Detection ] (Deterministic)
   ↓
[ CPM Engine ] (Deterministic)
   ↓
[ Critical Path Analyzer ] (Deterministic)
   ↓
[ Feasibility Engine ] (Deterministic)
   ↓
[ Confidence Engine ] (Deterministic)
   ↓
[ Risk Detection Agent ] (AI)
   ↓
[ Bottleneck Detection Engine ] (Deterministic)
   ↓
[ Timeline Optimization Agent ] (AI)
   ↓
[ Red Team Agent ] (AI)
   ↓
[ Final Verification Agent ] (Deterministic Gatekeeper)
   ↓
[ Explanation Generator ] (AI)
   ↓
Verified Execution Plan
```

---

## 3. Agent & Engine Definitions

This section defines every intelligent subsystem and deterministic engine within the pipeline. 

### 3.1 Planner Agent (AI)
*   **Purpose:** Deconstruct ambiguous human goals into structured, granular work items and logical prerequisites.
*   **Responsibilities:** Reduce ambiguity, extract assumptions, propose task durations (optimistic, nominal, pessimistic), and define proposed dependencies.
*   **Input:** User Goal (String), Constraints (String/Object).
*   **Output:** Proposed Tasks, Proposed Dependencies, Stated Assumptions, AI Confidence Level.
*   **Allowed Operations:** Semantic decomposition, time estimation mapping.
*   **Forbidden Operations:** Calculating schedules, identifying critical paths, determining mathematical feasibility.
*   **Failure Conditions:** Returning malformed JSON, refusing to break down the goal, outputting empty task lists.
*   **Success Conditions:** Valid JSON array of connected tasks satisfying the input prompt.
*   **Expected Runtime Behaviour:** ~3-5 seconds. Handled via background asynchronous queuing.
*   **Error Recovery Strategy:** Retry with strict schema enforcement (max 3 times).
*   **Confidence Expectations:** Must attach a 0.0 to 1.0 confidence score based on the perceived clarity of the user's initial goal.

### 3.2 Graph Builder (Algorithmic)
*   **Purpose:** Translate raw AI JSON proposals into a deterministic mathematical structure (Adjacency List/Matrix).
*   **Responsibilities:** Node creation, edge creation, ID generation/normalization, duplicate merging.
*   **Input:** Planner Agent JSON Output.
*   **Output:** Unverified Directed Graph Object.
*   **Allowed Operations:** ID hashing, array-to-map transformations, duplicate deduplication.
*   **Forbidden Operations:** Edge removal, cyclic validation (handled downstream).
*   **Failure Conditions:** Unmappable node IDs (edge references a node that does not exist).
*   **Success Conditions:** 1:1 mapping of JSON nodes to a valid programmatic Graph data structure.

### 3.3 Dependency Validator (Algorithmic)
*   **Purpose:** Ensure the structural integrity of the generated graph before scheduling mathematics are applied.
*   **Responsibilities:** Missing node detection, self-edge rejection, disconnected sub-graph detection (orphans), and basic invalid dependency repair (e.g., culling edges to non-existent nodes).
*   **Input:** Unverified Directed Graph Object.
*   **Output:** Structurally Validated Graph (or Error).
*   **Allowed Operations:** Deleting self-referencing edges, pruning orphaned paths.
*   **Forbidden Operations:** Adding new dependencies.
*   **Failure Conditions:** Graph remains fundamentally disjointed without a single clear objective node.

### 3.4 Cycle Detection Engine (Algorithmic)
*   **Purpose:** Prove the graph is a Directed Acyclic Graph (DAG).
*   **Responsibilities:** Execute Depth-First Search (DFS) to identify back-edges.
*   **Input:** Structurally Validated Graph.
*   **Output:** DAG Confirmation (Boolean) + Cycle Paths (if any).
*   **Failure Conditions:** Detection of any cycle (e.g., A -> B -> C -> A). 
*   **Error Recovery Strategy:** If cycles are detected, pass cycle data back to the Planner Agent for a correction prompt. If correction fails, halt pipeline and request human intervention.

### 3.5 CPM Engine (Algorithmic)
*   **Purpose:** Execute the Critical Path Method.
*   **Responsibilities:** Calculate Earliest Start Time (EST), Earliest Finish Time (EFT), Latest Start Time (LST), Latest Finish Time (LFT), Total Float, and Free Slack for every node.
*   **Input:** Validated DAG.
*   **Output:** Scheduled Graph with temporal metadata attached to all nodes.
*   **Forbidden Operations:** Modifying graph structure or edge weights.
*   **Expected Runtime Behaviour:** O(V + E) time complexity. Must execute in < 50ms.

### 3.6 Critical Path Analyzer (Algorithmic)
*   **Purpose:** Isolate the sequence(s) of tasks dictating the total project duration.
*   **Responsibilities:** Traverse the Scheduled Graph to extract all paths where Total Slack == 0. Accommodate multiple concurrent critical paths.
*   **Input:** Scheduled Graph.
*   **Output:** Array of Critical Path Node IDs, Total Project Duration.

### 3.7 Feasibility Engine (Algorithmic)
*   **Purpose:** Calculate a deterministic normalized score (0.0 to 1.0) representing the mathematical likelihood of success.
*   **Responsibilities:** Analyze schedule density, ratio of critical to non-critical tasks, available slack distribution, and structural bottlenecks.
*   **Input:** Scheduled Graph, Critical Path Data.
*   **Output:** Normalized Feasibility Score, Array of Feasibility Constraints.
*   **Success Conditions:** Produces a deterministic score identical across identical graphs.

### 3.8 Confidence Scoring Engine (Algorithmic)
*   **Purpose:** Aggregate systemic uncertainty into a single Confidence Score.
*   **Responsibilities:** Blend Planner AI confidence, variance between optimistic and pessimistic times (PERT analysis), graph completeness, and missing assumptions into a weighted metric.
*   **Weighting Philosophy:** Mathematical variance (PERT delta) carries 60% weight. AI-stated confidence carries 20%. Structural density (graph completeness) carries 20%. 
*   **Input:** Planner Confidence, Scheduled Graph (with PERT durations).
*   **Output:** System Confidence Score (0.0 - 100.0).

### 3.9 Risk Detection Agent (AI)
*   **Purpose:** Identify semantic and real-world vulnerabilities that pure mathematics cannot detect.
*   **Responsibilities:** Detect single points of failure, overloaded milestones, high uncertainty tasks, hidden external dependencies (e.g., "requires vendor approval"), and evaluate assumption fragility.
*   **Input:** User Goal, Scheduled Graph, Critical Path.
*   **Output:** Array of Risk Objects.
*   **Forbidden Operations:** Altering the graph or modifying the schedule.

### 3.10 Bottleneck Detection Engine (Algorithmic)
*   **Purpose:** Mathematically identify architectural choke points.
*   **Responsibilities:** Flag Merge Nodes (tasks with >3 incoming dependencies) and Burst Nodes (tasks with >3 outgoing dependencies).
*   **Input:** Validated DAG.
*   **Output:** Array of Bottleneck Node IDs and choke metrics.

### 3.11 Timeline Optimization Agent (AI)
*   **Purpose:** Suggest structural changes to reduce total project duration without violating logical constraints.
*   **Responsibilities:** Propose parallelization of sequential tasks, identify tasks that can be started earlier with partial data, and suggest resource reallocations.
*   **Goals:** Reduce total duration, increase parallel execution, maintain correctness.
*   **Forbidden Operations:** Never violate hard logical dependencies (e.g., cannot test code before writing it). Never reduce correctness to improve speed.

### 3.12 Red Team Agent (AI)
*   **Purpose:** Adversarially attack the generated roadmap to find flaws before the user does.
*   **Responsibilities:** Search for missing prerequisite tasks, impossible assumptions, weak reasoning, circular logic disguised as sequential tasks, unrealistic time durations, and contradictions.
*   **Input:** The Complete Draft Execution Plan (Graph + Schedule + Risks).
*   **Output:** Array of Detected Flaws. Every flaw must include: Severity, Reason, Recommendation, and Confidence in the finding.
*   **Success Conditions:** Successfully acts as a harsh, critical senior engineer reviewing a junior's proposal.

### 3.13 Final Verification Agent (Algorithmic Gatekeeper)
*   **Purpose:** The ultimate safeguard ensuring only trusted plans reach the user.
*   **Responsibilities:** Audit the pipeline metadata. Verify that Cycle Detection passed, CPM was computed, Feasibility is > 0, and Red Team severity does not contain "FATAL" blockers.
*   **Input:** Entire Pipeline State.
*   **Output:** Authorized Execution Plan OR Pipeline Rejection.

### 3.14 Explanation Generator (AI)
*   **Purpose:** Translate mathematical outputs and systemic reasoning into human-readable, professional summaries.
*   **Responsibilities:** Explain *why* the critical path is what it is, *why* the confidence score adjusted, *why* specific risks exist, and *why* optimization occurred.
*   **Forbidden Operations:** Never simply output raw numbers. Never invent explanations for data that does not exist in the algorithmic output.

---

## 4. JSON Contracts (Schemas)

*Note: These are structural definitions for strict adherence, uncoupled from any specific language implementation.*

**TaskProposal (Planner Output)**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "durations": {
    "optimistic_days": "number",
    "nominal_days": "number",
    "pessimistic_days": "number"
  }
}
```

**DependencyProposal (Planner Output)**
```json
{
  "dependent_task_id": "string",
  "prerequisite_task_id": "string",
  "rationale": "string"
}
```

**ScheduledNode (CPM Output)**
```json
{
  "task_id": "string",
  "est": "number",
  "eft": "number",
  "lst": "number",
  "lft": "number",
  "total_float": "number",
  "is_critical": "boolean"
}
```

**RiskAnalysis (Red Team / Risk Agent Output)**
```json
{
  "risk_id": "string",
  "severity": "LOW | MEDIUM | HIGH | FATAL",
  "category": "STRUCTURAL | SEMANTIC | ASSUMPTION | TEMPORAL",
  "description": "string",
  "impacted_nodes": ["string"],
  "mitigation_recommendation": "string",
  "detection_confidence": "number"
}
```

**SystemMetrics (Feasibility/Confidence Output)**
```json
{
  "feasibility_score": "number",
  "confidence_score": "number",
  "total_duration_days": "number",
  "critical_path_node_ids": ["string"],
  "bottleneck_node_ids": ["string"]
}
```

---

## 5. Failure Recovery

PathForge implements a resilient state-machine architecture for recovery:

*   **Planner Failure / Gemini Timeout:** Orchestrator retries up to 3 times with exponential backoff. If failure persists, alert user of "Upstream AI Unavailability".
*   **Malformed JSON:** Intercepted immediately by the Zod/Validation layer. A targeted correction prompt containing the specific parser error is sent back to the LLM (max 2 retries).
*   **Impossible Graphs (Unresolvable Cycles):** The Cycle Detection Engine throws an exception. The graph and cycle data are passed back to the Planner Agent with strict instructions to break the specific cycle. If it fails again, the system falls back to a linear (purely sequential) graph and flags it as "Degraded Mode".
*   **Missing Tasks (Red Team Detection):** If the Red Team Agent identifies a severe missing prerequisite, the pipeline halts and loops back to the Planner Agent, appending the Red Team's critique to the initial prompt.
*   **Risk Overflow (Too Many Fatal Risks):** If the Red Team identifies >3 FATAL risks, the system halts optimization, compiles the risks, and returns the plan to the user immediately labeled as "High-Risk / Unfeasible", demanding manual intervention.
*   **Optimization Failure:** If the Timeline Optimizer proposes a parallelization that violates graph integrity, the Dependency Validator rejects it, discards the optimization, and proceeds with the nominal schedule. Optimization is treated as an optional enhancement, never a hard dependency.

---

## 6. Engineering Constraints

This specification is strictly bound by:
1.  `00_PROJECT_MANIFEST.md`
2.  `ENGINEERING_CONSTITUTION.md`
3.  `TECHNICAL_ARCHITECTURE.md`

**Conflict Resolution:** If any instruction in this document is found to contradict the deterministic axioms established in the Manifest (e.g., if a future developer attempts to allow the Timeline Optimizer AI to bypass the CPM engine), the Project Manifest takes absolute precedence and the implementation PR must be rejected.
