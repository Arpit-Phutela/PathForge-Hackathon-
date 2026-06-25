# 00_PROJECT_MANIFEST (Master Governance Document)

## 1. Project Identity

**PathForge** is an AI-powered Project Execution Intelligence System. 

It exists to solve a fundamental flaw in current generative AI applications: the reliance on probabilistic models for structural planning. While Large Language Models (LLMs) excel at ideation, semantic breakdown, and context gathering, they are mathematically incapable of reliably solving NP-hard scheduling constraints, calculating critical paths, or guaranteeing acyclic dependency graphs.

PathForge bridges this gap. It is fundamentally different from ordinary AI planners because it treats AI-generated output as an untrusted proposition, not a final state. By wrapping a multi-agent AI pipeline in a strict, deterministic operations-research engine, PathForge transforms vague human goals into mathematically verified, bulletproof execution roadmaps.

## 2. Mission Statement

Our mission is to elevate AI from a mere "plan generator" to a **verified execution intelligence system**. 

PathForge will guarantee that every strategy, timeline, and resource allocation presented to a user is not just semantically plausible, but mathematically achievable and structurally sound.

## 3. Vision

PathForge is intended to evolve into a comprehensive enterprise planning suite. Over multiple versions, the system will scale from single-project task decomposition into multi-project portfolio management, real-time resource balancing, and dynamic execution tracking. 

We envision a future where probabilistic reasoning seamlessly integrates with industrial-grade operations research, providing project managers and engineering leaders with an infallible copilot that understands both human nuance and mathematical reality.

## 4. Core Philosophy

The engineering and product philosophy of PathForge is anchored by the following absolutes:

* **AI Proposes, Algorithms Dispose:** The generative AI layer is solely a creative engine. It proposes nodes (tasks) and edges (dependencies). It is the exclusive responsibility of the algorithmic layer to verify, sequence, and schedule them.
* **Deterministic Computation over Probabilistic Generation:** Math does not hallucinate. Any operation that can be calculated via graph theory, linear algebra, or established scheduling formulas (e.g., CPM, PERT) MUST be handled by deterministic code, never by the LLM.
* **Explainability over Blind Automation:** Users must never be asked to blindly trust the AI. Every schedule, bottleneck, and risk factor must be visually traceable to a specific mathematical calculation or specific AI reasoning trace. 
* **Mathematical Correctness Before Visual Presentation:** The UI is merely a reflection of the verified graph state. We prioritize the absolute correctness of the underlying data structures over superficial visual embellishments.

## 5. Knowledge Hierarchy

To maintain architectural integrity across all current and future development, all engineers, contributors, and AI agents MUST adhere to the following mandatory reading order and conflict resolution hierarchy. 

When discrepancies arise, the document highest on this list supersedes all others:

1. **`00_PROJECT_MANIFEST.md`** (This document - The ultimate source of truth)
2. **`ENGINEERING_CONSTITUTION.md`** (Core engineering principles and constraints)
3. **`TECHNICAL_ARCHITECTURE.md`** (System design, data flows, and infrastructure)
4. **`Future Specification Documents`** (Domain-specific architectures and schemas)
5. **`Current User Prompt`** (The immediate task or feature request)

## 6. Permanent Engineering Rules

The following rules are immutable project-wide policies. No feature, optimization, or user request may violate these constraints:

* **Never bypass deterministic validation:** No AI output shall be rendered to the user without first passing through the algorithmic validation layer (Cycle Detection, CPM, etc.).
* **Never expose LLM API Keys:** The frontend application shall never communicate directly with Gemini or any LLM. All AI operations must route through the secure backend.
* **Never trust LLM output:** All AI responses must be validated against strict JSON schemas (e.g., Zod) before being processed by the system.
* **Every algorithm must be testable:** All graph theory and scheduling logic must be implemented as pure, side-effect-free functions to ensure 100% unit test coverage.
* **Every module must have one responsibility:** Enforce strict boundary separation between UI, Backend API, AI prompt orchestration, and Algorithmic math.
* **Every feature must be independently maintainable:** Adopt Feature-Sliced Design. Domain logic should be co-located with its respective feature, preventing a monolithic, tangled codebase.
* **Every architectural decision must remain explainable:** Document the "why" behind technical choices in Architectural Decision Records (ADRs).

## 7. Documentation Policy

Documentation in PathForge is an evolving source of truth. As the system grows, documentation must:
* **Extend:** Add new details for new domains.
* **Refine:** Clarify ambiguities in existing guidelines.
* **Reference:** Link to higher-level hierarchy documents rather than duplicating their contents.

**Rule of Non-Contradiction:** Future documents must NEVER contradict earlier approved documents in the knowledge hierarchy. If a fundamental shift in architecture is required, the change must be proposed, debated, and explicitly updated in the upstream governance documents first.

## 8. Coding Standards

All code within the PathForge repository must adhere to the highest standards of modern software engineering:

* **Strict Typing:** TypeScript is mandatory. `any` is strictly forbidden. All system boundaries (API contracts, AI outputs, internal event buses) must possess rigorous type definitions.
* **Pure Functions:** Business logic and algorithmic math must be isolated into pure functions. Identical inputs must always yield identical outputs.
* **Immutability:** State mutations must be immutable. Never mutate graphs or data structures in place; always return a new, updated instance.
* **Modularity & Feature Slicing:** Code must be organized by domain (e.g., `features/planning`, `features/graph-validation`) rather than purely by technical layer.
* **Readable Naming:** Optimize for readability over brevity. Variables and functions must describe their exact purpose (e.g., `calculateCriticalPath` instead of `calcCP`).
* **Algorithm-First Implementation:** Complex features must have their data structures and algorithmic transformations implemented and tested *before* the React UI is built.

## 9. AI Development Policy

PathForge utilizes a multi-agent AI pipeline. The following principles govern AI integration:

* **AI Generates Possibilities:** The AI is used for semantic decomposition, risk identification, and strategic suggestion.
* **Algorithms Validate Reality:** The AI is explicitly barred from performing time calculations, critical path sorting, or loop detection.
* **AI Never Mutates State Directly:** AI agents generate proposed JSON objects. The Orchestration layer decides whether to apply these proposals to the system state.
* **AI Outputs Structured JSON Only:** We rely exclusively on Structured Output capabilities. Free-text parsing is forbidden for system-critical data.
* **AI Confidence Must Be Measurable:** Where possible, AI agents must output confidence scores or alternative options, allowing the algorithmic layer to assess feasibility.
* **Human Oversight Remains Possible:** The system must always allow the user to manually override AI-proposed dependencies or tasks.

## 10. Future Documentation Roadmap

To fully specify the PathForge ecosystem, the following documentation suite will be systematically constructed. This numerical prefixing will become the standard for our core architectural repository:

* **`01_ENGINEERING_CONSTITUTION.md`** - Engineering principles, folder structures, and system philosophy. *(Exists as `ENGINEERING_CONSTITUTION.md`)*
* **`02_TECHNICAL_ARCHITECTURE.md`** - Request lifecycles, data flow, JSON contracts, and component architecture. *(Exists as `TECHNICAL_ARCHITECTURE.md`)*
* **`03_AI_AGENT_SPECIFICATION.md`** - Detailed prompts, schemas, and orchestration logic for the Planner, Red Team, and Optimization agents.
* **`04_ALGORITHM_SPECIFICATION.md`** - Mathematical definitions of the DAG, Cycle Detection, CPM, and PERT implementations.
* **`05_DATA_MODEL.md`** - Database schemas, relationships, and persistence strategies.
* **`06_API_SPECIFICATION.md`** - RESTful endpoints, request/response formats, and error codes.
* **`07_DESIGN_SYSTEM.md`** - Tailwind token mappings, typography rules, component APIs, and motion guidelines.
* **`08_TESTING_STRATEGY.md`** - Unit, integration, and end-to-end testing requirements.
* **`09_DEPLOYMENT_GUIDE.md`** - Cloud Run configurations, CI/CD pipelines, and environment variable management.
* **`10_SECURITY_MODEL.md`** - API key protection, input sanitization, and data privacy constraints.
* **`11_PRODUCT_ROADMAP.md`** - Future feature epics and release planning.

## 11. Definition of Success

A successful implementation of the PathForge system is defined by the following outcomes:

1. **Mathematically Correct:** The system never produces an invalid or impossible schedule.
2. **Deterministic:** Given the same AI output, the algorithmic scheduling engine will always render the exact same Gantt chart and Critical Path.
3. **Explainable:** A user can hover over any deadline or risk factor and understand exactly how it was calculated or why it was flagged.
4. **Modular:** The UI, AI pipeline, and Graph engines can be swapped, upgraded, or refactored independently.
5. **Scalable & Production-Ready:** The system runs smoothly in a stateless Cloud Run environment with secure secrets management.
6. **Publishable:** The final application can be seamlessly deployed directly via Google AI Studio.
7. **Maintainable:** The codebase and architectural intent are so clearly documented that future engineers can onboard and contribute securely within hours.
