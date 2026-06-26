import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { logger } from "../../shared/utils/logger";
import { 
  ValidationError, 
  CycleDetectedError, 
  MissingDataError, 
  LLMGenerationError, 
  SystemicAlgorithmicFailure,
  NotImplementedError
} from "../../shared/utils/errors";
import { ErrorDetails, FailureResponse } from "../../shared/types";

export function errorHandler(
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  logger.error(`Error processing request ${req.method} ${req.path}`, err);

  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = "An unexpected error occurred.";
  let details: Record<string, any> | undefined = undefined;

  if (err instanceof z.ZodError) {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = "Request validation failed.";
    details = { issues: err.issues };
  } else if (err instanceof ValidationError) {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = err.message;
    details = err.details;
  } else if (err instanceof CycleDetectedError) {
    statusCode = 422;
    code = "CYCLE_DETECTED";
    message = err.message;
    details = { cyclePaths: err.cyclePaths };
  } else if (err instanceof MissingDataError) {
    statusCode = 400;
    code = "MISSING_DATA_ERROR";
    message = err.message;
  } else if (err instanceof LLMGenerationError) {
    statusCode = 502; // Bad Gateway since it's an upstream failure
    code = "LLM_GENERATION_ERROR";
    message = err.message;
  } else if (err instanceof SystemicAlgorithmicFailure) {
    statusCode = 500;
    code = "SYSTEMIC_ALGORITHMIC_FAILURE";
    message = err.message;
  } else if (err instanceof NotImplementedError) {
    statusCode = 501;
    code = "NOT_IMPLEMENTED";
    message = err.message;
  }

  const response: FailureResponse = {
    status: "error",
    error: {
      code,
      message,
      details,
    },
  };

  res.status(statusCode).json(response);
}
