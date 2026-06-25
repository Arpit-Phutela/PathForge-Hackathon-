export const CONSTANTS = {
  // Application specifics
  APP_NAME: "PathForge",
  API_PREFIX: "/api",
  
  // Scoring Thresholds
  THRESHOLDS: {
    FEASIBILITY_UNFEASIBLE_MAX: 0.4,
    FEASIBILITY_FRAGILE_MAX: 0.7,
    CONFIDENCE_LOW_WARNING_MAX: 65,
  },
  
  // Durations & Timings (in ms)
  TIMEOUTS: {
    GEMINI_API: 30000,
  }
} as const;
