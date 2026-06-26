import { PlannerProposal } from "../shared/types";

export const samplePlannerProposal: PlannerProposal = {
  tasks: [
    {
      taskId: "d1010101-1111-4111-a111-111111111111",
      title: "Market & Competitor Analysis",
      description: "Analyze competitor feature sets, pricing models, and tech stacks to define PathForge MVP baseline.",
      optimisticDuration: 2,
      mostLikelyDuration: 3,
      pessimisticDuration: 5,
      requiredSkills: ["Product Strategy", "Market Research"],
      resourceAssumptions: ["Dedicated Product Manager"]
    },
    {
      taskId: "d2020202-2222-4222-a222-222222222222",
      title: "Technical Architecture & API Design",
      description: "Draft technical blueprint, database schema design, and define secure, type-safe API contracts.",
      optimisticDuration: 3,
      mostLikelyDuration: 4,
      pessimisticDuration: 6,
      requiredSkills: ["System Architecture", "API Design"],
      resourceAssumptions: ["Lead Systems Architect"]
    },
    {
      taskId: "d3030303-3333-4333-a333-333333333333",
      title: "Database Setup & Schema Provisioning",
      description: "Provision staging database, construct migration scripts, and seed initial lookup table configurations.",
      optimisticDuration: 2,
      mostLikelyDuration: 3,
      pessimisticDuration: 4,
      requiredSkills: ["Database Administration", "PostgreSQL"],
      resourceAssumptions: ["DBA / DevOps Engineer"]
    },
    {
      taskId: "d5050505-5555-4555-a555-555555555555",
      title: "Frontend UI Theme & Layout Coding",
      description: "Code responsive visual layouts, implement dark/light theme systems, and build component libraries.",
      optimisticDuration: 4,
      mostLikelyDuration: 6,
      pessimisticDuration: 9,
      requiredSkills: ["React", "Tailwind CSS", "TypeScript"],
      resourceAssumptions: ["Senior Frontend Developer"]
    },
    {
      taskId: "d4040404-4444-4444-a444-444444444444",
      title: "Backend API Integration",
      description: "Implement API endpoints, secure auth middleware, and integrate external service providers.",
      optimisticDuration: 5,
      mostLikelyDuration: 8,
      pessimisticDuration: 12,
      requiredSkills: ["Node.js", "Express", "TypeScript"],
      resourceAssumptions: ["Senior Backend Developer"]
    },
    {
      taskId: "d6060606-6666-4666-a666-666666666666",
      title: "Frontend & Backend Integration",
      description: "Connect frontend client to backend endpoints, handle async states, and verify unified data flow.",
      optimisticDuration: 3,
      mostLikelyDuration: 5,
      pessimisticDuration: 8,
      requiredSkills: ["React", "State Management", "API Consumption"],
      resourceAssumptions: ["Fullstack Engineer"]
    },
    {
      taskId: "d7070707-7777-4777-a777-777777777777",
      title: "Stripe Gateway Integration & Checkout Testing",
      description: "Integrate Stripe billing, implement webhook listeners, and execute sandbox transaction runs.",
      optimisticDuration: 3,
      mostLikelyDuration: 4,
      pessimisticDuration: 6,
      requiredSkills: ["Payment Gateways", "Stripe API", "Security Auditing"],
      resourceAssumptions: ["Security/Payment Architect"]
    },
    {
      taskId: "d8080808-8888-4888-a888-888888888888",
      title: "Staging Deploy & End-to-End QA",
      description: "Deploy applet to staging, execute automated end-to-end tests, and fix blocking regressions.",
      optimisticDuration: 2,
      mostLikelyDuration: 3,
      pessimisticDuration: 5,
      requiredSkills: ["E2E Testing", "CI/CD Pipelines", "QA Testing"],
      resourceAssumptions: ["QA Automation Engineer"]
    },
    {
      taskId: "d9090909-9999-4999-a999-999999999999",
      title: "Production Launch & CDN Optimization",
      description: "Deploy to production environment, configure CDN caching rules, and run health check verification.",
      optimisticDuration: 0,
      mostLikelyDuration: 0,
      pessimisticDuration: 0,
      requiredSkills: ["DevOps", "Production Release"],
      resourceAssumptions: ["Release Manager"]
    }
  ],
  dependencies: [
    {
      fromTaskId: "d1010101-1111-4111-a111-111111111111",
      toTaskId: "d2020202-2222-4222-a222-222222222222",
      rationale: "Technical architecture requires competitors baseline features list to structure database schemas."
    },
    {
      fromTaskId: "d2020202-2222-4222-a222-222222222222",
      toTaskId: "d3030303-3333-4333-a333-333333333333",
      rationale: "Database schema must be designed before provisioning the tables and writing migration scripts."
    },
    {
      fromTaskId: "d2020202-2222-4222-a222-222222222222",
      toTaskId: "d5050505-5555-4555-a555-555555555555",
      rationale: "Frontend UX layouts must follow architectural layout guidelines and type-safe API interface definitions."
    },
    {
      fromTaskId: "d3030303-3333-4333-a333-333333333333",
      toTaskId: "d4040404-4444-4444-a444-444444444444",
      rationale: "API implementation requires the database and tables to be fully seeded and ready for connections."
    },
    {
      fromTaskId: "d4040404-4444-4444-a444-444444444444",
      toTaskId: "d6060606-6666-4666-a666-666666666666",
      rationale: "Integration requires completed backend endpoints to link with front-end mock UI states."
    },
    {
      fromTaskId: "d5050505-5555-4555-a555-555555555555",
      toTaskId: "d6060606-6666-4666-a666-666666666666",
      rationale: "Integration requires styled and interactive components to be ready for backend API bindings."
    },
    {
      fromTaskId: "d6060606-6666-4666-a666-666666666666",
      toTaskId: "d7070707-7777-4777-a777-777777777777",
      rationale: "Stripe integration relies on a fully interactive checkout flow to test real-world sandbox API requests."
    },
    {
      fromTaskId: "d7070707-7777-4777-a777-777777777777",
      toTaskId: "d8080808-8888-4888-a888-888888888888",
      rationale: "Staging deployment and end-to-end testing can only be performed after payment integrations are complete."
    },
    {
      fromTaskId: "d8080808-8888-4888-a888-888888888888",
      toTaskId: "d9090909-9999-4999-a999-999999999999",
      rationale: "Staging QA certification is a hard prerequisite for authorizing production CDN launch."
    }
  ],
  assumptions: [
    "External developer API keys are valid and unthrottled.",
    "Hardware procurement delays do not disrupt the cloud platform services.",
    "Development resources are available for at least 40 hours per week."
  ],
  plannerConfidence: 0.94,
  aiReasoning: "A fast-paced, sequential and parallelized rollout model for highly reliable ecommerce platforms. Early decoupling of Frontend UI development from Database Provisioning minimizes idle developer resources, and critical milestones are anchored securely to critical path dependencies to prevent execution slippage."
};
