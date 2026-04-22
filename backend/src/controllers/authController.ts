import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import ApiResponse from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

/**
 * ──────────────────────────────────────────
 *  AUTH CONTROLLER
 *  Thin layer between routes and authService.
 *  Extracts request data → calls service → sends response.
 *
 *  Zero business logic lives here.
 * ──────────────────────────────────────────
 */

/**
 * POST /api/auth/register
 * Register a new user.
 *
 * Expects req.body: { name, email, password }
 */
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.registerUser(name, email, password);

    ApiResponse.created(res, result, "Registration successful");
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Log in an existing user.
 *
 * Expects req.body: { email, password }
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    ApiResponse.success(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get the current authenticated user's profile.
 *
 * Requires auth middleware (req.user.id must exist).
 */
export const getProfileController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;

    const profile = await authService.getUserProfile(userId);

    ApiResponse.success(res, profile, "Profile fetched successfully");
  } catch (error) {
    next(error);
  }
};
