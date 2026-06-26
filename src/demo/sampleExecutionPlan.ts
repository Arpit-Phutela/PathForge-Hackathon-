import { ExecutionPlan } from "../shared/types";

export const sampleExecutionPlan: ExecutionPlan = {
  roadmap: {
    graph: {
      nodes: [
        {
          id: "00000000-0000-4000-a000-000000000000",
          type: "VIRTUAL_SOURCE"
        },
        {
          id: "d1010101-1111-4111-a111-111111111111",
          type: "STANDARD",
          baseData: {
            title: "Market & Competitor Analysis",
            description: "Analyze competitor feature sets, pricing models, and tech stacks to define PathForge MVP baseline.",
            optimisticDuration: 2,
            mostLikelyDuration: 3,
            pessimisticDuration: 5,
            requiredSkills: ["Product Strategy", "Market Research"],
            resourceAssumptions: ["Dedicated Product Manager"]
          }
        },
        {
          id: "d2020202-2222-4222-a222-222222222222",
          type: "STANDARD",
          baseData: {
            title: "Technical Architecture & API Design",
            description: "Draft technical blueprint, database schema design, and define secure, type-safe API contracts.",
            optimisticDuration: 3,
            mostLikelyDuration: 4,
            pessimisticDuration: 6,
            requiredSkills: ["System Architecture", "API Design"],
            resourceAssumptions: ["Lead Systems Architect"]
          }
        },
        {
          id: "d3030303-3333-4333-a333-333333333333",
          type: "STANDARD",
          baseData: {
            title: "Database Setup & Schema Provisioning",
            description: "Provision staging database, construct migration scripts, and seed initial lookup table configurations.",
            optimisticDuration: 2,
            mostLikelyDuration: 3,
            pessimisticDuration: 4,
            requiredSkills: ["Database Administration", "PostgreSQL"],
            resourceAssumptions: ["DBA / DevOps Engineer"]
          }
        },
        {
          id: "d5050505-5555-4555-a555-555555555555",
          type: "STANDARD",
          baseData: {
            title: "Frontend UI Theme & Layout Coding",
            description: "Code responsive visual layouts, implement dark/light theme systems, and build component libraries.",
            optimisticDuration: 4,
            mostLikelyDuration: 6,
            pessimisticDuration: 9,
            requiredSkills: ["React", "Tailwind CSS", "TypeScript"],
            resourceAssumptions: ["Senior Frontend Developer"]
          }
        },
        {
          id: "d4040404-4444-4444-a444-444444444444",
          type: "STANDARD",
          baseData: {
            title: "Backend API Integration",
            description: "Implement API endpoints, secure auth middleware, and integrate external service providers.",
            optimisticDuration: 5,
            mostLikelyDuration: 8,
            pessimisticDuration: 12,
            requiredSkills: ["Node.js", "Express", "TypeScript"],
            resourceAssumptions: ["Senior Backend Developer"]
          }
        },
        {
          id: "d6060606-6666-4666-a666-666666666666",
          type: "STANDARD",
          baseData: {
            title: "Frontend & Backend Integration",
            description: "Connect frontend client to backend endpoints, handle async states, and verify unified data flow.",
            optimisticDuration: 3,
            mostLikelyDuration: 5,
            pessimisticDuration: 8,
            requiredSkills: ["React", "State Management", "API Consumption"],
            resourceAssumptions: ["Fullstack Engineer"]
          }
        },
        {
          id: "d7070707-7777-4777-a777-777777777777",
          type: "STANDARD",
          baseData: {
            title: "Stripe Gateway Integration & Checkout Testing",
            description: "Integrate Stripe billing, implement webhook listeners, and execute sandbox transaction runs.",
            optimisticDuration: 3,
            mostLikelyDuration: 4,
            pessimisticDuration: 6,
            requiredSkills: ["Payment Gateways", "Stripe API", "Security Auditing"],
            resourceAssumptions: ["Security/Payment Architect"]
          }
        },
        {
          id: "d8080808-8888-4888-a888-888888888888",
          type: "STANDARD",
          baseData: {
            title: "Staging Deploy & End-to-End QA",
            description: "Deploy applet to staging, execute automated end-to-end tests, and fix blocking regressions.",
            optimisticDuration: 2,
            mostLikelyDuration: 3,
            pessimisticDuration: 5,
            requiredSkills: ["E2E Testing", "CI/CD Pipelines", "QA Testing"],
            resourceAssumptions: ["QA Automation Engineer"]
          }
        },
        {
          id: "d9090909-9999-4999-a999-999999999999",
          type: "MILESTONE",
          baseData: {
            title: "Production Launch & CDN Optimization",
            description: "Deploy to production environment, configure CDN caching rules, and run health check verification.",
            optimisticDuration: 0,
            mostLikelyDuration: 0,
            pessimisticDuration: 0,
            requiredSkills: ["DevOps", "Production Release"],
            resourceAssumptions: ["Release Manager"]
          }
        },
        {
          id: "ffffffff-ffff-4fff-afff-ffffffffffff",
          type: "VIRTUAL_SINK"
        }
      ],
      edges: [
        {
          sourceId: "00000000-0000-4000-a000-000000000000",
          targetId: "d1010101-1111-4111-a111-111111111111",
          type: "FINISH_TO_START"
        },
        {
          sourceId: "d1010101-1111-4111-a111-111111111111",
          targetId: "d2020202-2222-4222-a222-222222222222",
          type: "FINISH_TO_START"
        },
        {
          sourceId: "d2020202-2222-4222-a222-222222222222",
          targetId: "d3030303-3333-4333-a333-333333333333",
          type: "FINISH_TO_START"
        },
        {
          sourceId: "d2020202-2222-4222-a222-222222222222",
          targetId: "d5050505-5555-4555-a555-555555555555",
          type: "FINISH_TO_START"
        },
        {
          sourceId: "d3030303-3333-4333-a333-333333333333",
          targetId: "d4040404-4444-4444-a444-444444444444",
          type: "FINISH_TO_START"
        },
        {
          sourceId: "d4040404-4444-4444-a444-444444444444",
          targetId: "d6060606-6666-4666-a666-666666666666",
          type: "FINISH_TO_START"
        },
        {
          sourceId: "d5050505-5555-4555-a555-555555555555",
          targetId: "d6060606-6666-4666-a666-666666666666",
          type: "FINISH_TO_START"
        },
        {
          sourceId: "d6060606-6666-4666-a666-666666666666",
          targetId: "d7070707-7777-4777-a777-777777777777",
          type: "FINISH_TO_START"
        },
        {
          sourceId: "d7070707-7777-4777-a777-777777777777",
          targetId: "d8080808-8888-4888-a888-888888888888",
          type: "FINISH_TO_START"
        },
        {
          sourceId: "d8080808-8888-4888-a888-888888888888",
          targetId: "d9090909-9999-4999-a999-999999999999",
          type: "FINISH_TO_START"
        },
        {
          sourceId: "d9090909-9999-4999-a999-999999999999",
          targetId: "ffffffff-ffff-4fff-afff-ffffffffffff",
          type: "FINISH_TO_START"
        }
      ],
      metadata: {
        nodeCount: 11,
        edgeCount: 11,
        disconnectedComponents: 1
      }
    },
    schedule: {
      cpmResults: [
        {
          nodeId: "00000000-0000-4000-a000-000000000000",
          pertDuration: 0,
          earlyStart: 0,
          earlyFinish: 0,
          lateStart: 0,
          lateFinish: 0,
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true
        },
        {
          nodeId: "d1010101-1111-4111-a111-111111111111",
          pertDuration: 3,
          earlyStart: 0,
          earlyFinish: 3,
          lateStart: 0,
          lateFinish: 3,
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true
        },
        {
          nodeId: "d2020202-2222-4222-a222-222222222222",
          pertDuration: 4,
          earlyStart: 3,
          earlyFinish: 7,
          lateStart: 3,
          lateFinish: 7,
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true
        },
        {
          nodeId: "d3030303-3333-4333-a333-333333333333",
          pertDuration: 3,
          earlyStart: 7,
          earlyFinish: 10,
          lateStart: 7,
          lateFinish: 10,
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true
        },
        {
          nodeId: "d5050505-5555-4555-a555-555555555555",
          pertDuration: 6,
          earlyStart: 7,
          earlyFinish: 13,
          lateStart: 12,
          lateFinish: 18,
          totalFloat: 5,
          freeFloat: 5,
          isCritical: false
        },
        {
          nodeId: "d4040404-4444-4444-a444-444444444444",
          pertDuration: 8,
          earlyStart: 10,
          earlyFinish: 18,
          lateStart: 10,
          lateFinish: 18,
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true
        },
        {
          nodeId: "d6060606-6666-4666-a666-666666666666",
          pertDuration: 5,
          earlyStart: 18,
          earlyFinish: 23,
          lateStart: 18,
          lateFinish: 23,
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true
        },
        {
          nodeId: "d7070707-7777-4777-a777-777777777777",
          pertDuration: 4,
          earlyStart: 23,
          earlyFinish: 27,
          lateStart: 23,
          lateFinish: 27,
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true
        },
        {
          nodeId: "d8080808-8888-4888-a888-888888888888",
          pertDuration: 3,
          earlyStart: 27,
          earlyFinish: 30,
          lateStart: 27,
          lateFinish: 30,
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true
        },
        {
          nodeId: "d9090909-9999-4999-a999-999999999999",
          pertDuration: 0,
          earlyStart: 30,
          earlyFinish: 30,
          lateStart: 30,
          lateFinish: 30,
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true
        },
        {
          nodeId: "ffffffff-ffff-4fff-afff-ffffffffffff",
          pertDuration: 0,
          earlyStart: 30,
          earlyFinish: 30,
          lateStart: 30,
          lateFinish: 30,
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true
        }
      ],
      criticalPathIds: [
        "00000000-0000-4000-a000-000000000000",
        "d1010101-1111-4111-a111-111111111111",
        "d2020202-2222-4222-a222-222222222222",
        "d3030303-3333-4333-a333-333333333333",
        "d4040404-4444-4444-a444-444444444444",
        "d6060606-6666-4666-a666-666666666666",
        "d7070707-7777-4777-a777-777777777777",
        "d8080808-8888-4888-a888-888888888888",
        "d9090909-9999-4999-a999-999999999999",
        "ffffffff-ffff-4fff-afff-ffffffffffff"
      ],
      projectDuration: 30
    }
  },
  analysis: {
    feasibility: {
      score: 0.92,
      scheduleHealth: "ROBUST"
    },
    confidence: {
      score: 94,
      penaltiesApplied: []
    },
    bottlenecks: {
      bottleneckNodes: [
        {
          nodeId: "d6060606-6666-4666-a666-666666666666",
          fanIn: 2,
          fanOut: 1,
          downstreamImpactCount: 3
        },
        {
          nodeId: "d2020202-2222-4222-a222-222222222222",
          fanIn: 1,
          fanOut: 2,
          downstreamImpactCount: 7
        }
      ]
    },
    risks: {
      overallRisk: "MEDIUM",
      identifiedRisks: [
        {
          id: "r1010101-1111-4111-a111-111111111111",
          severity: "MEDIUM",
          category: "STRUCTURAL",
          description: "Integration choke point at Frontend & Backend Integration controls downstream path.",
          impactedNodeIds: ["d6060606-6666-4666-a666-666666666666"],
          mitigation: "Assign an extra senior fullstack engineer to pre-validate API contracts with automated mock servers."
        },
        {
          id: "r2020202-2222-4222-a222-222222222222",
          severity: "LOW",
          category: "TEMPORAL",
          description: "Frontend UI layout coding has a buffer of only 5 days before impacting the main integration timeline.",
          impactedNodeIds: ["d5050505-5555-4555-a555-555555555555"],
          mitigation: "Utilize Tailwind CSS utility library to speed up layout coding."
        }
      ]
    }
  }
};
