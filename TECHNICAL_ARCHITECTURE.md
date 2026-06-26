# PathForge: Technical Architecture Document

## 1. System Overview

### Overall Architecture
PathForge is an AI-powered Project Execution Intelligence System. It utilizes a Backend-for-Frontend (BFF) architecture. A React-based Single Page Application (SPA) serves as the client, communicating with a Node.js/Express backend. The backend orchestrates the workflow: securely prompting the Gemini API to generate project structures (tasks and dependencies), and subsequently passing this probabilistic output through a strict, deterministic algorithmic pipeline (Graph Theory, Critical Path Method) before returning a verified roadmap to the client.

### System Goals
- **Correctness:** Guarantee that all presented execution roadmaps are mathematically valid, schedulable, and free of impossible cyclic dependencies.
- **Explainability:** Clearly visualize the critical path, bottlenecks, and the rationale behind AI-driven risk assessments.
- **Modularity:** Enforce strict boundaries between AI generation, algorithmic verification, and user interface rendering.
- **Scalability:** Maintain a stateless backend to ensure horizontal scalability and smooth transitions to persistent data models.
- **Maintainability:** Utilize rigid JSON contracts between all system boundaries to allow independent iteration of AI models and algorithmic implementations.

### Design Philosophy
**"AI proposes, algorithms dispose."** The system treats all Large Language Model (LLM) outputs as untrusted, probabilistic data. A plan only becomes a valid execution roadmap after successfully passing through the deterministic validation and scheduling engines.

---

## 2. High-Level Architecture Diagram

```text
[ User Interface (React / Vite) ]
       |                  ^
       v (User Goal)      | (Verified Dashboard Data)
+---------------------------------------------------+
|               API Gateway / BFF (Express)         |
+---------------------------------------------------+
       |                  ^
       v (Strict JSON)    | (Validated Graph)
+---------------------------------------------------+
|               Orchestration Engine                |
+---------------------------------------------------+
       |                  |                  |
   [ AI Layer ]     [ Algorithm Layer ]   [ Data Layer ]
       |                  |                  |
   +-------+          +-------+          +-------+
   | Gemini|          | Graph |          | State /|
   | API   |          | Math  |          | Memory |
   +-------+          +-------+          +-------+
```

### Component Interaction & Layer Separation
- **UI Layer:** Dispatches user intents and renders the final verified state. Contains no business logic.
- **API Gateway:** Validates incoming requests and routes them to the Orchestrator.
- **Orchestrator:** Coordinates the pipeline. Calls the AI layer for generation, then immediately passes the output to the Algorithm layer for verification.
- **AI Layer:** Responsible solely for interacting with the Gemini API using structured output schemas.
- **Algorithm Layer:** Pure functions that execute DAG validation, Topo-sort, CPM, and PERT calculations.

---

## 3. Domain Layers

### Presentation Layer
- **Responsibilities:** Renders the interactive dashboard, captures user input, displays graph visualizations, and handles client-side routing.
- **Tech Stack:** React, Tailwind CSS, Motion (Animations), D3/Recharts (Visualizations).

### Application Layer (Orchestration)
- **Responsibilities:** Manages the request lifecycle. It receives the user goal, triggers the AI agents in sequence, pipes data through the algorithmic engines, and formats the final response.

### AI Layer
- **Responsibilities:** Encapsulates all Gemini API interactions. Formats prompts, enforces JSON schema outputs, handles retries, and parses the raw AI responses into system-readable objects.

### Algorithm Layer
- **Responsibilities:** Houses all deterministic math and graph logic. It is entirely unaware of the AI or UI. It takes nodes and edges as inputs and returns calculated schedules, critical paths, and feasibility scores.

### Infrastructure Layer
- **Responsibilities:** Manages network requests, environment variable injection, logging, and error boundary containment.

### Data Layer
- **Responsibilities:** Currently manages in-memory state for the active session. Designed to be swapped with a persistent database (e.g., Cloud SQL or Firestore) in future iterations.

---

## 4. Complete Request Lifecycle

1. **User Input:** User submits a project goal via the UI.
2. **API Request:** UI sends a POST request to the `/api/plan` endpoint.
3. **Planner Agent Generation:** The Orchestrator prompts the Gemini Planner Agent to break the goal into a structured list of tasks and dependencies.
4. **Graph Construction:** The raw AI output is converted into a mathematical Directed Acyclic Graph (DAG).
5. **Validation & Cycle Detection:** The Graph Engine checks for cyclic dependencies (e.g., A -> B -> A). If found, the graph is rejected or sent back to AI for correction.
6. **Topological Sort:** Nodes are sorted linearly based on dependencies to ensure correct processing order.
7. **CPM & PERT Calculation:** The Algorithm layer calculates the earliest/latest start/finish times, slack times, and the Critical Path. PERT computes expected durations based on optimistic/pessimistic bounds.
8. **Feasibility & Confidence Scoring:** The Algorithm Engine assigns mathematical scores based on graph complexity, slack distribution, and path convergence.
9. **Red Team Analysis:** A secondary AI agent reviews the calculated schedule to identify non-obvious semantic risks (e.g., "Task A requires external approval which usually takes longer").
10. **Optimization Agent:** A tertiary AI agent suggests schedule compressions or resource reallocations based on the algorithmic bottlenecks and Red Team risks.
11. **Final Assembly:** The Orchestrator combines the validated schedule, metrics, and AI recommendations into a single Dashboard Object.
12. **Client Render:** The UI receives the Dashboard Object and renders the Gantt chart, DAG, and insights.

---

## 5. AI Architecture

### Planner Agent
- **Responsibilities:** Deconstruct user goals into discrete tasks and logical dependencies.
- **Inputs:** User Goal (String), Context.
- **Outputs:** `Task[]`, `Dependency[]` (Strict JSON).

### Optimization Agent
- **Responsibilities:** Analyze the algorithmically calculated schedule to suggest structural improvements or parallelization opportunities.
- **Inputs:** Validated Graph, Critical Path, Slack Times.
- **Outputs:** `OptimizationRule[]` (e.g., "Run Task C parallel to Task D").

### Red Team Agent
- **Responsibilities:** Identify semantic and real-world risks that pure math cannot detect.
- **Inputs:** Project context, Validated Schedule.
- **Outputs:** `Risk[]` (Probability, Impact, Mitigation).

### Recommendation Agent
- **Responsibilities:** Synthesize all data into actionable next steps for the user.
- **Inputs:** Full system state (Graph, Algorithms, Risks).
- **Outputs:** Executive Summary, Action Items.

### Failure Conditions & Recovery
- **Malformed JSON:** The AI Layer automatically retries the prompt enforcing the schema.
- **Hallucinated Dependencies:** If the AI invents dependencies for non-existent tasks, the Orchestrator strips the invalid edges.
- **Unresolvable Cycles:** If the AI repeatedly generates cyclic graphs, the system falls back to a linear sequential fallback plan and alerts the user.

---

## 6. Algorithm Architecture

- **Dependency Graph:** The foundational data structure mapping all tasks (nodes) and dependencies (directed edges).
- **Cycle Detection:** Uses Depth-First Search (DFS) to ensure the graph is a valid DAG. *Why:* A cycle means the project can never be completed.
- **Topological Sort:** Orders tasks so that every task appears after its prerequisites. *Why:* Required for calculating schedule times linearly.
- **Critical Path Method (CPM):** Identifies the longest sequence of dependent tasks. *Why:* Determines the absolute minimum project duration.
- **Slack Analysis:** Calculates float time for non-critical tasks. *Why:* Identifies where delays are acceptable without impacting the final deadline.
- **PERT (Program Evaluation and Review Technique):** Uses weighted averages of optimistic, nominal, and pessimistic durations. *Why:* Accounts for uncertainty in AI-generated time estimates.
- **Confidence Score:** A calculated metric based on variance in PERT estimates and graph density.
- **Feasibility Score:** Evaluates the ratio of critical tasks to total tasks. High ratios indicate brittle projects.
- **Bottleneck Detection:** Identifies nodes where multiple concurrent paths converge (Merge nodes) or diverge (Burst nodes).

---

## 7. Data Flow

`Goal (String)` 
-> [Planner Agent] -> `RawTasks`, `RawDependencies` 
-> [Graph Builder] -> `AdjacencyList` 
-> [Cycle Detector] -> `ValidatedDAG` 
-> [Topo Sorter] -> `SortedNodes` 
-> [CPM/PERT Engine] -> `ScheduleMetrics (EST, LST, Slack)` 
-> [Scoring Engine] -> `Feasibility`, `Confidence` 
-> [Red Team Agent] -> `Risks` 
-> [Optimization Agent] -> `Optimizations` 
-> [Orchestrator] -> `DashboardState`

---

## 8. JSON Contracts (Schemas)

*Note: These represent the structural contracts, defining required fields and types.*

- **Goal:** `{ id: string, description: string, constraints: object }`
- **Task (Node):** `{ id: string, title: string, description: string, duration: { optimistic: number, nominal: number, pessimistic: number } }`
- **Dependency (Edge):** `{ fromId: string, toId: string, type: 'FinishToStart' }`
- **Graph:** `{ nodes: Task[], edges: Dependency[] }`
- **ScheduleNode:** `{ taskId: string, earlyStart: number, earlyFinish: number, lateStart: number, lateFinish: number, slack: number, isCritical: boolean, expectedDuration: number }`
- **Schedule:** `{ criticalPath: string[], totalDuration: number, nodes: ScheduleNode[] }`
- **Risk:** `{ id: string, severity: 'High'|'Medium'|'Low', description: string, mitigation: string, relatedTaskIds: string[] }`
- **Recommendation:** `{ summary: string, immediateActions: string[] }`
- **Metrics:** `{ confidenceScore: number, feasibilityScore: number, bottleneckIds: string[] }`
- **Dashboard:** `{ graph: Graph, schedule: Schedule, risks: Risk[], recommendations: Recommendation, metrics: Metrics }`

---

## 9. Folder Mapping

- `/src/ui/components` -> Reusable atomic UI elements (Buttons, Cards). Strictly domain-agnostic.
- `/src/ui/features` -> Domain-specific UI grouped by feature (e.g., `planning`, `dashboard`, `graph`).
- `/src/ui/hooks` -> Client-side state and data fetching.
- `/src/ui/store` -> Global client state (Zustand).
- `/src/ui/routes` -> Routing configuration.
- `/src/server/index.ts` -> Express application entry point.

---

## 10. Frontend Architecture & State Management

### Routing Strategy
- **Library:** `react-router-dom` (To be implemented).
- **Structure:** 
  - `/` (Landing/Goal Input)
  - `/plan/:id` (Execution Dashboard)

### State Management Separation
- **Server State:** Managed EXCLUSIVELY by `@tanstack/react-query`. The results of API calls (e.g., the Execution Plan, Risks, Metrics) must remain in the React Query cache.
- **Client State:** Managed by `zustand`. Strictly reserved for transient UI state (e.g., sidebars open/closed, current active node, theme selection, filter settings).
- **Anti-Pattern Prevention:** Server data must NEVER be duplicated into the Zustand store. Components must read server state via React Query hooks, and UI state via Zustand hooks.

### Component Boundaries
- **Presentational Components:** Receive data via props. No knowledge of React Query or Zustand.
- **Container Components:** Fetch data via React Query, read UI state via Zustand, and pass data to presentational components.

### React Flow Integration
- **Purpose:** Used for rendering the DAG (Directed Acyclic Graph).
- **Architecture:** The Graph UI feature will consume the mathematical `Graph` output from the Algorithm layer and translate it into `ReactFlow` nodes and edges inside a selector or projection function, ensuring the domain model is decoupled from the rendering library.

### Framer Motion
- **Usage:** Route transitions, layout animations (e.g., lists reordering), and micro-interactions.
- **Rules:** Respect `prefers-reduced-motion`. Keep durations under 300ms.

### Styling & Design Tokens
- **Framework:** Tailwind CSS v4.
- **Tokens:** Define a strict set of design tokens for colors, spacing, and typography in CSS variables, consumed via Tailwind classes.

---

## 11. API Contracts

### `POST /api/plan`
- **Request:** `{ goal: string, context?: string }`
- **Response:** `Dashboard` (Full assembly of Graph, Schedule, Risks, Metrics).

### `POST /api/validate` (Internal/Granular)
- **Request:** `Graph`
- **Response:** `{ isValid: boolean, cycles: string[][], schedule?: Schedule }`

### `POST /api/analyze`
- **Request:** `{ graph: Graph, schedule: Schedule }`
- **Response:** `{ risks: Risk[], metrics: Metrics }`

---

## 11. State Management

- **Server State (API):** Entirely stateless. Every request carries the necessary context to compute the response. Ensures horizontal scalability.
- **Client State (React):** Uses React Context to hold the `Dashboard` object returned by the API.
- **Graph State:** Visual layout coordinates are managed transiently by the graph rendering library (e.g., D3/React Flow).
- **Derived State:** Client-side filtering (e.g., "Show only critical path") is computed on the fly from the main Context rather than stored separately.

---

## 12. Error Flow

- **Gemini Fails (Network/Timeout):** API returns 503 Service Unavailable. UI displays a retry prompt.
- **Cycle Detected:** Algorithm Layer throws a `GraphCycleError`. Orchestrator intercepts, attempts one AI retry to fix it. If it fails again, returns 422 Unprocessable Entity with details of the cycle. UI highlights the cyclic nodes.
- **Invalid Graph (Orphan nodes):** Algorithm flags them. Orchestrator can auto-connect them to a virtual "Start" or "End" node, logging a warning.
- **Malformed AI Output:** AI Layer fails Zod/JSON schema validation. Triggers immediate internal retry. Max retries (3) -> returns 500 Internal Server Error.

---

## 13. Scalability

- **Statelessness:** The current BFF is stateless, allowing Cloud Run to scale instances horizontally based on traffic.
- **Future Database:** Ready for integration with Cloud SQL/PostgreSQL. The JSON contracts map cleanly to relational tables (Projects, Tasks, Dependencies, Risks).
- **Authentication:** Middleware layers are reserved in the Express router for future JWT/Firebase Auth integration.
- **Collaboration:** The rigid State/Action definitions allow for future migration to WebSockets for real-time multiplayer editing (CRDTs).

---

## 14. Deployment Architecture

- **Host:** Google Cloud Run via Google AI Studio Publish.
- **Environment:** Containerized Node.js environment.
- **Secrets:** `GEMINI_API_KEY` injected securely at runtime via Cloud Secret Manager / AI Studio config. Never exposed to the client.
- **Build Process:** Vite compiles the React SPA into static assets in `/dist`. The Express backend serves these static files and handles `/api/*` routes.
- **Entry Point:** A bundled `server.cjs` executed via Node.

---

## 15. Architectural Decision Records (ADRs)

### ADR 1: Backend-For-Frontend (BFF) over Client-Side AI
- **Decision:** All Gemini API calls happen on the Node.js backend.
- **Why:** Exposing the Gemini API key in the React client is a catastrophic security vulnerability. Furthermore, heavy graph algorithms perform better in V8's server environment than on constrained mobile browsers.
- **Rejected Alternative:** Direct client-to-Gemini requests.

### ADR 2: Deterministic Graph Theory over AI Scheduling
- **Decision:** CPM, PERT, and Topo-sort are written as pure math functions. The AI only proposes nodes and edges.
- **Why:** LLMs are linguistic engines, not calculators. They cannot reliably traverse deep graphs or sum parallel durations.
- **Rejected Alternative:** Prompting the LLM to output the start/end dates directly.

### ADR 3: Strict JSON Schema Enforcement
- **Decision:** The AI layer uses Gemini's Structured Output capabilities to guarantee JSON shapes.
- **Why:** Regex parsing of markdown code blocks is brittle and breaks when the model alters its conversational prefix/suffix.
- **Rejected Alternative:** Markdown parsing heuristics.

### ADR 4: Multi-Agent Pipeline over Single Prompt
- **Decision:** Splitting responsibilities (Planner, Red Team, Optimizer) across distinct API calls or distinct prompt stages.
- **Why:** A single prompt attempting to extract tasks, build a graph, find risks, and optimize it exceeds the model's effective reasoning window and dilutes instruction adherence.
- **Rejected Alternative:** "Do everything" mega-prompts.
