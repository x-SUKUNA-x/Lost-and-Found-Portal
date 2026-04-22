import { Response, NextFunction } from "express";
import supabase from "../config/supabase";
import ApiError from "../utils/apiError";
import { AuthenticatedRequest } from "../types";

/**
 * Auth middleware — verifies the Supabase JWT from the Authorization header.
 *
 * Expects:  Authorization: Bearer <supabase_access_token>
 * Injects:  req.user = { id, email }
 *
 * Attach this to any route that requires authentication.
 */
const authMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Missing or invalid Authorization header");
    }

    const token = authHeader.split(" ")[1];

    // Verify the JWT with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new ApiError(401, "Invalid or expired token");
    }

    // Inject user into request
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
