export class NotImplementedError extends Error {
  constructor(message: string = "This feature is intentionally deferred and not yet implemented.") {
    super(message);
    this.name = "NotImplementedError";
  }
}

// ---------------------------------------------------------
// General Errors
// ---------------------------------------------------------

export class ValidationError extends Error {
  public details: Record<string, unknown>;
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

// ---------------------------------------------------------
// Deterministic Algorithm Failures (Graph & Math)
// ---------------------------------------------------------

export class GraphValidationError extends ValidationError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message, details);
    this.name = "GraphValidationError";
  }
}

export class SchedulingInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchedulingInvariantError";
  }
}

export class AnalysisFailureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalysisFailureError";
  }
}

export class HeuristicsCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HeuristicsCalculationError";
  }
}

export class SimulationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SimulationError";
  }
}

export class PlannerOutputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlannerOutputError";
  }
}

export class CycleDetectedError extends Error {
  public cyclePaths: string[][];
  constructor(message: string, cyclePaths: string[][] = []) {
    super(message);
    this.name = "CycleDetectedError";
    this.cyclePaths = cyclePaths;
  }
}

export class MissingDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingDataError";
  }
}

export class InvalidEdgeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEdgeError";
  }
}

export class SystemicAlgorithmicFailure extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SystemicAlgorithmicFailure";
  }
}

// ---------------------------------------------------------
// AI Agent Failures (Probabilistic Generation)
// ---------------------------------------------------------

export class LLMGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMGenerationError";
  }
}

export class LLMTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMTimeoutError";
  }
}
