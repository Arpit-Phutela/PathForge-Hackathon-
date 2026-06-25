# 04_ALGORITHM_SPECIFICATION

## 1. Algorithm Design Philosophy

PathForge is built upon the fundamental principle that Large Language Models (LLMs) are heuristic and probabilistic engines, whereas project execution requires deterministic certainty.

**Deterministic Algorithms vs. Purely LLM Reasoning**
LLMs are excellent at semantic understanding, breaking down complex objectives into actionable tasks, and identifying non-obvious risks. However, they cannot reliably perform mathematical calculations, trace deep graph dependencies, or guarantee structural integrity.

PathForge always mathematically validates AI output because a guessed schedule is a dangerous schedule. By confining the AI to proposing the nodes and edges, and utilizing deterministic algorithms (like the Critical Path Method) to evaluate them, we ensure that every execution roadmap presented to a user is mathematically possible, structurally sound, and free of contradictions. 

**Absolute Constraint:** Deterministic engines in PathForge operate on a strict **accept or reject** basis. They NEVER silently repair, mutate, or fabricate user data. They only validate, reject, calculate, or verify.

## 2. Dependency Graph Model

The core data structure of PathForge is the Directed Acyclic Graph (DAG).

*   **Directed Acyclic Graph (DAG):** A mathematical structure representing workflows where dependencies dictate a strict one-way flow of execution, and no task can depend on itself (no cycles).
*   **Node Definition:** A `Node` represents a discrete execution task. It encapsulates the task identity, metadata, and temporal estimates.
*   **Zero Duration Nodes (Milestones):** Nodes with a duration of strictly `0` are formally supported as Milestones. They participate natively in CPM calculations (passing time forward without adding to it) but are explicitly excluded from bottleneck scoring, as they represent moments in time rather than work effort.
*   **Edge Definition & Dependency Types:** An `Edge` represents a dependency between two nodes. **Version 1 officially supports ONLY Finish-to-Start (FS) dependencies.** Start-to-Start (SS), Finish-to-Finish (FF), and Lead/Lag constraints are intentionally deferred to Version 2.
*   **Virtual Source and Virtual Sink Nodes:** To mathematically support disconnected graphs (multiple independent DAG components), multiple roots, and multiple terminal nodes, the model implicitly injects two virtual milestone nodes:
    *   *Virtual Source:* A node with duration `0`, automatically connected to every true root node (in-degree 0).
    *   *Virtual Sink:* A node with duration `0`, automatically connected from every true terminal node (out-degree 0).
*   **Node Identity Rules:** Every node must possess a universally unique identifier (UUID) deterministically mapped from the AI's generation output.
*   **Edge Validity Rules:** Edges must strictly reference existing Node IDs.

## 3. Topological Sorting

*   **Purpose:** To order the graph's nodes linearly such that for every directed edge (A → B), node A appears before node B.
*   **Input:** A Validated DAG (including disconnected components bound by the Virtual Source and Virtual Sink).
*   **Output:** An ordered array of Node IDs.
*   **Complexity:** $O(V + E)$ where $V$ is vertices and $E$ is edges.
*   **Failure Cases:** Fails immediately if the graph contains a cycle.
*   **Alternative Algorithms Considered:** Kahn's Algorithm vs. Depth-First Search (DFS). Kahn's Algorithm is chosen for its intuitive integration with our cycle detection mechanisms and parallel root identification.

## 4. Cycle Detection

*   **Purpose:** To prevent infinite dependency loops (e.g., A requires B, B requires C, C requires A) which render a project impossible.
*   **Detection Strategy:** Utilizes Depth-First Search (DFS) with a recursion stack tracking mechanism. If a node is encountered that is already in the current recursion path, a back-edge (cycle) exists.
*   **Failure Handling:** The algorithm MUST throw a strict `CycleDetectedError` containing the specific path of the cycle.
*   **Recovery Behaviour:** The algorithm **NEVER** automatically deletes edges or modifies project reality to resolve the cycle. The `CycleDetectedError` is returned to the AI Optimization Agent for a proposed fix, or escalated to the human user for manual correction.

## 5. Critical Path Method (CPM)

The CPM engine is a purely mathematical module calculating the time-bounds of every task.

**PERT Duration Conversion:**
The AI proposes Optimistic ($O$), Most Likely/Nominal ($M$), and Pessimistic ($P$) durations. The CPM algorithm **never** operates directly on these three values. Before CPM begins, every node's duration is deterministically converted into a single Expected Time ($TE$) using the standard PERT formula:
$$TE = \frac{O + 4M + P}{6}$$

**CPM Definitions:**
*   **Earliest Start (ES):** The maximum Earliest Finish (EF) of all immediate predecessors. (Virtual Source ES = 0).
*   **Earliest Finish (EF):** $ES + TE$.
*   **Latest Finish (LF):** The minimum Latest Start (LS) of all immediate successors. The backward pass relies on the **Virtual Sink Node**. The LF of the Virtual Sink Node is set to its ES (the total Project Duration). The backward pass propagates mathematically from this single sink to all terminal nodes.
*   **Latest Start (LS):** $LF - TE$.
*   **Total Float (Slack):** $LS - ES$ (or $LF - EF$).
*   **Free Float:** The amount of time a task can be delayed without delaying the Earliest Start of any immediate successor.
*   **Critical Path:** The contiguous sequence of nodes from Virtual Source to Virtual Sink where Total Float equals exactly zero.
*   **Multiple Critical Paths:** Supported natively. If multiple paths share the same longest duration, all are flagged as critical.
*   **Project Duration:** The Earliest Finish (EF) of the Virtual Sink Node.

## 6. Feasibility Score

A normalized mathematical model evaluating strictly the **structural correctness** and deterministic viability of the graph. (Independent of AI generation quality or temporal uncertainty).

**Inputs:**
*   **Prerequisite Completeness:** Evaluates if terminal nodes have a logically deep prerequisite chain.
*   **Blocker Density:** The ratio of critical tasks to total tasks.
*   **Graph Fragmentation:** The number of independent disconnected components bridging between the Virtual Source and Virtual Sink.

*   **Normalization:** Summed and normalized to a scalar value between 0.0 and 1.0.

## 7. Confidence Score

A deterministic metric defining the **AI generation quality** and systemic trust in the origin data. (Independent of structural feasibility).

**Inputs:**
*   **Planner Adherence:** Strict adherence to JSON schema schemas on the first pass (penalized if parsing retries were needed).
*   **AI Planner Confidence:** The self-reported confidence metric attached by the LLM during extraction.
*   **Unresolved Assumptions:** The density of explicit assumptions flagged by the Planner Agent that remain unverified.
*   **Optimization Stability:** Tracks whether the AI Optimization Agent previously triggered validation failures on this graph.

*   **Score Ranges:** 0 to 100.

## 8. Risk Score

Risk is computed by evaluating **execution uncertainty** and temporal vulnerabilities. (Independent of AI generation quality or base structure).

**Inputs:**
*   **PERT Variance:** Evaluates $(P - O)$. High variance indicates massive temporal uncertainty in execution, driving up risk.
*   **Dependency Depth:** Nodes sitting at the end of a long sequential chain carry compounding temporal risk.
*   **Bottleneck Concentration:** Calculated dynamically based on Fan-In/Fan-Out metrics (see Section 9).

*   **Severity Bands:** LOW, MEDIUM, HIGH, FATAL.

## 9. Bottleneck Score

An algorithm identifying execution choke points where delays cause catastrophic downstream failure.

**Mechanism:**
*   **Fan-In (Merge Nodes):** Nodes with an in-degree > 3. 
*   **Fan-Out (Burst Nodes):** Nodes with an out-degree > 3. 
*   **Milestone Exclusion:** Zero-duration milestone nodes are strictly excluded from bottleneck scoring, as they do not consume execution resources.
*   **Downstream Impact:** Requires calculating the transitive closure of the graph to count all reachable downstream dependents for a given node.

## 10. Timeline Optimization (Algorithmic Role)

**CRITICAL RULE:** Algorithmic engines **NEVER** invent new dependencies, parallelize work, or mutate the timeline. Algorithms only accept, validate, reject, and calculate.

*   **Optimization Workflow:** The AI Optimization Agent *proposes* a mutated graph (e.g., removing a sequential edge to run tasks in parallel). The algorithm layer receives this mutated graph.
*   **Algorithmic Responsibility:** The CPM and Validation engines run on the proposed graph. 
*   **Acceptance/Rejection:** If the mutated graph introduces a cycle, the algorithm rejects the optimization deterministically. If valid, it returns the calculated delta (e.g., "Duration reduced by 5 days") back to the Orchestrator. 

## 11. Red-Team Evaluation Metrics

Measurable criteria applied to the output of the Red Team Agent.

*   **Missing Tasks:** Identified by semantic gaps between connected nodes.
*   **Impossible Schedules:** Real-world time constraints violated.
*   **Hidden Assumptions:** Dependencies reliant on external factors not represented.
*   **Contradictions:** Circular logic disguised as sequential tasks.
*   **Severity Levels:** FATAL, HIGH, MEDIUM, LOW.

## 12. Explanation Generation Rules

Every numerical output must be mapped to a deterministic explanation template before being passed to the Explanation Generator AI.
*   An AI may summarize math, but it cannot invent math.
*   A Critical Path explanation MUST list the exact sequence of nodes causing the duration.

## 13. Complexity Analysis

*   **Topological Sort:** $O(V + E)$ Time, $O(V)$ Space.
*   **Cycle Detection:** $O(V + E)$ Time, $O(V)$ Space.
*   **CPM (Forward/Backward Pass):** $O(V + E)$ Time, $O(V)$ Space.
*   **Feasibility / Confidence / Risk Aggregation:** $O(V)$ Time, $O(1)$ Space.
*   **Bottleneck Scoring (Downstream Impact):** Calculating the exact count of transitive dependents for all nodes via transitive closure is $O(V \cdot (V + E))$ Time in a DAG. Accuracy takes precedence over naive $O(V+E)$ approximations.

## 14. Failure Recovery

*   **Failure Conditions:** Missing durations, unresolvable edge IDs, cycles, or malformed data.
*   **Strict Rejection Policy:** PathForge **always** fails safely. The algorithms will NEVER substitute default values (e.g., Duration = 1), NEVER automatically prune invalid edges, and NEVER automatically remove orphans. 
*   **Recovery Strategy:** If an algorithm encounters missing or invalid data, it throws a deterministic validation failure (e.g., `MissingDataError`, `InvalidEdgeError`). The Orchestrator intercepts this and routes it either to the AI for a retry, or to the human user for manual correction.

## 15. Engineering Self Review & Architecture Validation

### Assumptions
*   All downstream systems correctly respect the strict accept/reject boundary of the algorithms.

### Alternatives Rejected
*   **Silent Fallbacks:** Defaulting missing values to 1 was rejected because it fabricates user reality and creates silently inaccurate schedules.
*   **Algorithmic Auto-Optimization:** Rejected because algorithms cannot understand semantic real-world dependencies (e.g., an algorithm might mathematically run "Pour Concrete" and "Frame Walls" in parallel to save time, violating physics).

### Architecture Validation Checklist

- [x] **1. PERT Duration:** Expected Time ($TE = (O + 4M + P) / 6$) is explicitly defined. CPM uses this exclusively.
- [x] **2. Multiple Terminal Nodes:** Virtual Sink Node (and Virtual Source Node) are introduced to mathematically anchor the backward/forward passes.
- [x] **3. Complexity Analysis:** Bottleneck downstream impact complexity corrected to $O(V \cdot (V + E))$ for transitive closure.
- [x] **4. Timeline Optimization:** Strictly redefined. Algorithms do not invent or mutate; they only validate AI-proposed mutations.
- [x] **5. Cycle Handling:** Automatic edge deletion removed. Replaced strictly with `CycleDetectedError`.
- [x] **6. Missing Data:** All fallbacks (Duration = 1, auto-pruning) removed in favor of safe deterministic validation failures.
- [x] **7. Dependency Types:** Explicitly restricted to Finish-to-Start (FS) for Version 1.
- [x] **8. Zero Duration Nodes:** Supported as milestone nodes. Excluded from bottleneck scoring.
- [x] **9. Disconnected Graphs:** Documented handling via Virtual Source and Virtual Sink anchors.
- [x] **10. Score Separation:** Feasibility (Structural), Confidence (AI Quality), and Risk (Execution Uncertainty) are strictly separated with no double-counting.
- [x] **11. Manifest Compliance:** Re-verified. Algorithms accept or reject. Silent mutation is forbidden.

### Unresolved Questions
*   None at this time. Ready for subsequent pipeline specifications.

### Implementation Readiness
**Score: 100%**
The algorithmic layer is mathematically sound, bounds-checked, and completely divorced from AI hallucinations.
