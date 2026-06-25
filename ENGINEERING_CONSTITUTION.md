# PathForge Engineering Constitution

## Mission
PathForge is an AI-powered Project Execution Intelligence System. It transforms vague project goals into mathematically validated execution roadmaps by combining Gemini reasoning with deterministic graph algorithms.

## Core Philosophy
**AI generates possibilities. Algorithms verify them. Only verified plans reach users.**

---

### 1. Engineering Principles
* **Why this decision is chosen:** To build a reliable system on top of non-deterministic LLMs, we must enforce strict deterministic boundaries. Correctness and verifiability take absolute precedence over speed of execution.
* **What alternatives exist:** "Move fast and break things," or purely heuristic engineering relying solely on LLM outputs.
* **Why those alternatives were rejected:** Relying solely on AI for complex planning results in hallucinations, circular dependencies, and impossible timelines. Unverifiable outputs destroy user trust in an enterprise tool.
* **Rules to follow:**
  - All AI outputs must be treated as untrusted data.
  - Every AI-generated plan must pass through a deterministic validation layer before state mutation.
  - Code must be verifiable by pure functions wherever possible.

### 2. Project Philosophy
* **Why this decision is chosen:** "AI proposes, algorithms dispose." This cleanly separates creative generation (LLMs) from structural integrity (Graph Theory).
* **What alternatives exist:** End-to-end AI pipelines where the model outputs the final user-facing JSON schedule directly.
* **Why those alternatives were rejected:** LLMs cannot reliably traverse deep dependency graphs or solve NP-hard scheduling constraints consistently.
* **Rules to follow:**
  - The AI layer must only output raw, unlinked nodes and proposed edges.
  - The algorithm layer must compute the critical path, detect cycles, and assign timelines.

### 3. Folder Structure Philosophy
* **Why this decision is chosen:** Feature-Sliced Domain Architecture (e.g., separating by domains like `/features/planning`, `/core/algorithms`). This groups related UI, logic, and state, scaling seamlessly as complexity grows.
* **What alternatives exist:** Flat structures, or pure technical layer slicing (e.g., all components in `/components`, all hooks in `/hooks`).
* **Why those alternatives were rejected:** Pure technical slicing leads to massive, unnavigable directories where domain context is lost.
* **Rules to follow:**
  - Domain-specific logic must live inside its feature directory.
  - Shared, domain-agnostic utilities belong in `/core` or `/shared`.
  - Modules must export a clean public API (e.g., via `index.ts`).

### 4. Frontend Architecture Philosophy
* **Why this decision is chosen:** React SPA with Vite, enforcing a strict separation of presentation (UI) and business logic (Hooks/Services). Ensures the UI is a pure reflection of state.
* **What alternatives exist:** Monolithic UI components containing API calls, data transformation, and rendering in a single file.
* **Why those alternatives were rejected:** Mixing logic and rendering makes testing algorithms impossible and creates brittle, unreadable components.
* **Rules to follow:**
  - Components must only handle rendering and user interactions.
  - All data fetching, graph manipulation, and complex state mutations must be abstracted into custom hooks or utility functions.

### 5. Backend Architecture Philosophy
* **Why this decision is chosen:** Node.js/Express Backend-for-Frontend (BFF) strictly proxying and validating AI calls. Ensures API keys remain secure and allows heavy graph computations to occur server-side if needed.
* **What alternatives exist:** Direct client-to-API communication or massive monolithic backends (e.g., Java/Spring).
* **Why those alternatives were rejected:** Client-side AI calls expose secrets. Monolithic backends introduce unnecessary boilerplate for a predominantly AI/Graph-driven application.
* **Rules to follow:**
  - All external AI requests MUST route through the server.
  - The backend must validate all incoming client payloads and outgoing AI payloads using strict schemas.

### 6. AI Architecture Philosophy
* **Why this decision is chosen:** Server-side Gemini API execution using strict Structured Output (JSON Schema) generation. Ensures the LLM adheres to a parsable data contract.
* **What alternatives exist:** Prompting the LLM to output free-text and attempting to parse it with Regex, or client-side AI execution.
* **Why those alternatives were rejected:** Regex parsing of LLM text is highly brittle. Client-side execution is a severe security risk.
* **Rules to follow:**
  - Provide strict JSON schemas to the Gemini API.
  - Never parse free-text for system-critical variables.
  - Always handle rate-limit and hallucination errors gracefully via retries or fallback logic.

### 7. Algorithm Architecture Philosophy
* **Why this decision is chosen:** Directed Acyclic Graphs (DAGs) and deterministic scheduling algorithms (e.g., Critical Path Method) implemented as pure functions. Guarantees mathematical correctness.
* **What alternatives exist:** Heuristic guessing, iterative looping over arrays to "fix" schedules, or asking the AI to resolve scheduling conflicts.
* **Why those alternatives were rejected:** Heuristics fail at scale. AI cannot do math or graph traversal reliably.
* **Rules to follow:**
  - Algorithm functions must be pure: identical inputs yield identical outputs.
  - The system must explicitly check for and reject cyclic dependencies (e.g., A -> B -> A).

### 8. State Management Strategy
* **Why this decision is chosen:** React Context combined with local state for UI, and a dedicated store (or robust custom hooks) for complex graph state. Keeps data flows unidirectional and predictable.
* **What alternatives exist:** Heavy global stores like Redux, or prop-drilling through 10 levels of components.
* **Why those alternatives were rejected:** Redux introduces massive boilerplate for simple operations. Prop-drilling creates tightly coupled, fragile component trees.
* **Rules to follow:**
  - Keep state as close to where it is used as possible.
  - Only elevate state to global context if multiple independent sub-trees require access.
  - Never mutate state directly; always use immutable updates.

### 9. Component Organization
* **Why this decision is chosen:** Atomic-inspired design. Components are split into Primitives (buttons, inputs), Composites (cards, forms), and Layouts (grids, pages). Promotes extreme reusability.
* **What alternatives exist:** Creating bespoke, one-off components for every single page or feature.
* **Why those alternatives were rejected:** Leads to massive code duplication, inconsistent UI, and exponentially higher maintenance costs.
* **Rules to follow:**
  - UI Primitives must have zero domain knowledge (e.g., a `Button` should not know about "Projects").
  - Feature components orchestrate Primitives and inject domain data.

### 10. Naming Conventions
* **Why this decision is chosen:** Explicit, descriptive naming. `PascalCase` for components/classes, `camelCase` for variables/functions. Readability is prioritized over brevity.
* **What alternatives exist:** Cryptic abbreviations (e.g., `calcCPM`), Hungarian notation, or inconsistent casing.
* **Why those alternatives were rejected:** Abbreviations require tribal knowledge to understand. Inconsistent casing breaks tooling and readability.
* **Rules to follow:**
  - Boolean variables must be prefixed with `is`, `has`, or `should` (e.g., `isGraphValid`).
  - Event handlers must use `handle` prefixes (e.g., `handleNodeClick`).
  - Do not use single-letter variables except in standard loops (e.g., `i`, `j`).

### 11. Error Handling Standards
* **Why this decision is chosen:** Fail-fast mechanisms with centralized error boundaries and typed error responses. Ensures the system never operates on corrupted data.
* **What alternatives exist:** Silent catch blocks (`catch (e) {}`), returning `null` everywhere, or crashing the entire app on a minor UI fault.
* **Why those alternatives were rejected:** Swallowing errors hides critical bugs. Uncaught exceptions ruin the UX.
* **Rules to follow:**
  - API routes must return standardized error objects (e.g., `{ error: string, code: number }`).
  - The frontend must wrap distinct functional areas in React Error Boundaries.
  - Never swallow errors without at least logging them structurally.

### 12. Logging Strategy
* **Why this decision is chosen:** Structured JSON logging on the server. Allows logs to be easily parsed and queried by modern observability tools.
* **What alternatives exist:** Scattered `console.log("Here 1")` statements, or entirely omitting logs.
* **Why those alternatives were rejected:** String-based console logs are impossible to search systematically in production.
* **Rules to follow:**
  - Include context in logs (e.g., `userId`, `projectId`, `action`).
  - Strip all personally identifiable information (PII) and raw AI prompts before logging.
  - Categorize strictly by level: `INFO`, `WARN`, `ERROR`.

### 13. Security Standards
* **Why this decision is chosen:** Zero-trust architecture. All inputs are validated on the server using strict validation schemas (e.g., Zod) regardless of client-side checks.
* **What alternatives exist:** Trusting client-side validation alone, or bypassing validation for "internal" API calls.
* **Why those alternatives were rejected:** Client-side checks are easily bypassed. Invalid data injected into the graph algorithms will crash the system.
* **Rules to follow:**
  - Never trust client input.
  - Never expose backend environment variables to the frontend.
  - Prevent injection attacks by strictly escaping and sanitizing AI outputs before rendering them as HTML.

### 14. API Design Standards
* **Why this decision is chosen:** RESTful principles utilizing strictly typed JSON payloads. Predictable, stateless, and easily consumable.
* **What alternatives exist:** GraphQL, or ad-hoc URL structures with inconsistent verbs.
* **Why those alternatives were rejected:** GraphQL introduces unnecessary complexity and overhead for this specific architecture. Ad-hoc structures cause integration nightmares.
* **Rules to follow:**
  - Use standard HTTP methods correctly (`GET` for reads, `POST` for creations, `PUT/PATCH` for updates).
  - Always return standard HTTP status codes (200, 400, 401, 404, 500).
  - Define strict TypeScript interfaces for all Request and Response payloads.

### 15. Performance Guidelines
* **Why this decision is chosen:** Optimize critical paths (graph rendering and graph traversal). Use memoization (`useMemo`, `useCallback`) strategically to prevent expensive re-renders.
* **What alternatives exist:** Prematurely optimizing every single line of code, or completely ignoring performance until the app grinds to a halt.
* **Why those alternatives were rejected:** Premature optimization wastes time on unnoticeable gains. Ignoring performance makes heavy graph calculations lock the browser thread.
* **Rules to follow:**
  - Offload heavy graph traversal to Web Workers or the Backend if the node count exceeds UI thread limits.
  - Memoize complex React sub-trees that do not rely on rapidly changing state.
  - Lazy load routes and heavy visualization libraries (e.g., D3/Recharts).

### 16. Accessibility Guidelines
* **Why this decision is chosen:** WCAG AA compliance. Software must be usable by everyone, regardless of physical or cognitive ability.
* **What alternatives exist:** Building purely visual interfaces with "div soup" and ignoring screen readers or keyboard navigation.
* **Why those alternatives were rejected:** Excludes users, violates professional standards, and often indicates poorly structured HTML.
* **Rules to follow:**
  - All interactive elements must be keyboard navigable.
  - Ensure sufficient color contrast for all text and graph nodes.
  - Use semantic HTML (`<nav>`, `<main>`, `<article>`) and appropriate ARIA roles.

### 17. Responsive Design Philosophy
* **Why this decision is chosen:** Desktop-first precision for complex graph interfaces, while maintaining a functional Mobile-first CSS foundation.
* **What alternatives exist:** Building a completely separate mobile site, or forcing a complex DAG visualization onto a tiny screen without adaptation.
* **Why those alternatives were rejected:** Separate sites double maintenance. Squishing complex graphs onto mobile makes them illegible.
* **Rules to follow:**
  - Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`).
  - Core execution dashboards (graphs, Gantt charts) must degrade gracefully on mobile (e.g., switching from a canvas view to a list/timeline view).

### 18. Design System Philosophy
* **Why this decision is chosen:** Tailwind CSS utility classes with a strict set of design tokens (colors, spacing, radii). Ensures a cohesive, premium, and modern aesthetic without bloat.
* **What alternatives exist:** Writing bespoke CSS files, using CSS-in-JS libraries with heavy runtime costs, or mixing multiple UI frameworks.
* **Why those alternatives were rejected:** Custom CSS files lead to specificity wars and dead code. Mixing frameworks creates Frankenstein UIs.
* **Rules to follow:**
  - Never use raw hex codes in components; always reference Tailwind theme tokens.
  - Maintain a clean, minimalist visual language (avoid generic gradients and heavy drop shadows).
  - The UI must look like a premium enterprise startup product.

### 19. Typography Philosophy
* **Why this decision is chosen:** Inter for general UI (maximum legibility) and JetBrains Mono for data/metrics (tabular alignment). Typography is the foundation of structural hierarchy.
* **What alternatives exist:** Generic system fonts or highly decorative, distracting display fonts.
* **Why those alternatives were rejected:** System fonts vary wildly across OSes, breaking precise layouts. Decorative fonts reduce parsing speed for complex data.
* **Rules to follow:**
  - Use font weights to establish hierarchy, not just size.
  - Monospace fonts MUST be used for node IDs, timestamps, and mathematical scores.

### 20. Animation Philosophy
* **Why this decision is chosen:** Purposeful, subtle motion using `motion/react`. Animations should guide the user's eye to state changes, not distract them.
* **What alternatives exist:** Flashy, bouncy, gratuitous animations, or entirely static interfaces.
* **Why those alternatives were rejected:** Over-animation feels cheap and slows down the professional user. Static interfaces make state changes jarring and hard to track.
* **Rules to follow:**
  - Keep animations fast (150ms - 300ms).
  - Only animate opacities and transforms to maintain 60fps.
  - Provide a fade-in transition when the AI completes a generation cycle.

### 21. Testing Philosophy
* **Why this decision is chosen:** High coverage on business logic (algorithms), integration tests for API routes. Assures that the core mathematical value proposition never breaks.
* **What alternatives exist:** Dogmatic 100% test coverage on every UI component, or zero testing.
* **Why those alternatives were rejected:** Testing UI pixels is brittle and slows down iteration. Zero testing guarantees catastrophic failure in production.
* **Rules to follow:**
  - All graph traversal and validation algorithms MUST have unit tests covering edge cases and cyclic dependencies.
  - UI components should be tested for critical interactive paths, not styling.

### 22. Deployment Philosophy
* **Why this decision is chosen:** Immutable, containerized builds deployed to serverless infrastructure (Cloud Run). Guarantees the environment matches development perfectly.
* **What alternatives exist:** Manual FTP uploads, mutable stateful servers, or monolithic VMs.
* **Why those alternatives were rejected:** Manual deployments cause "it works on my machine" errors and are impossible to scale.
* **Rules to follow:**
  - Production builds must be self-contained within the `/dist` output.
  - Environment variables must be strictly managed and verified at startup.

### 23. Git Workflow
* **Why this decision is chosen:** Trunk-based development. Encourages small, frequent, and easily reviewable integrations.
* **What alternatives exist:** GitFlow (long-lived feature branches).
* **Why those alternatives were rejected:** Long-lived branches lead to massive merge conflicts and delayed integration of critical algorithmic updates.
* **Rules to follow:**
  - Keep pull requests small and focused on a single architectural or feature goal.
  - Never commit directly to `main` without passing continuous integration checks.

### 24. Code Review Rules
* **Why this decision is chosen:** Automated linting for style, manual review for architectural integrity. Humans review logic; machines review syntax.
* **What alternatives exist:** Manual stylistic nitpicking, or rubber-stamping PRs without looking.
* **Why those alternatives were rejected:** Nitpicking wastes expensive engineering time. Rubber-stamping allows architectural drift and tech debt to accumulate.
* **Rules to follow:**
  - Code reviews must focus on verifying that the implementation adheres to this constitution.
  - If a feature bypasses algorithmic validation to display AI data directly, the PR MUST be rejected.

### 25. Scalability Strategy
* **Why this decision is chosen:** Stateless backend, cacheable static assets, and isolated AI processing queues. Ensures the app can handle horizontal scaling without bottlenecks.
* **What alternatives exist:** Stateful sticky sessions or keeping heavy AI processing on the main event loop.
* **Why those alternatives were rejected:** Stateful servers cannot auto-scale efficiently. Blocking the event loop takes down the entire application for all users.
* **Rules to follow:**
  - The backend must remain completely stateless.
  - Any long-running AI generation or heavy graph processing must not block subsequent incoming HTTP requests.
