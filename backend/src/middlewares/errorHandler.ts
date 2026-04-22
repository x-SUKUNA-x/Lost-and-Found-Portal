import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

/**
 * Global error-handling middleware.
 * Must be registered LAST (after all routes).
 */
const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // Log the error for debugging
  console.error("❌  Error:", err.message);
  if (!(err instanceof ApiError) || !err.isOperational) {
    console.error(err.stack);
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorHandler;
