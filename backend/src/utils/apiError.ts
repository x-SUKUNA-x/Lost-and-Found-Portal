/**
 * Custom API error class.
 * Throw this in services/controllers to trigger the error handler.
 */
class ApiError extends Error {
  public statusCode: number;
  public details: string | null;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, details: string | null = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // distinguish from programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
