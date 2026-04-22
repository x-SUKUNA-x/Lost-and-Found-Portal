import { Response } from "express";

/**
 * Standardized API response helper.
 * Ensures every success response follows the same shape.
 */
class ApiResponse {
  static success<T>(
    res: Response,
    data: T | null = null,
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(
    res: Response,
    data: T | null = null,
    message: string = "Created successfully"
  ): Response {
    return ApiResponse.success(res, data, message, 201);
  }
}

export default ApiResponse;
