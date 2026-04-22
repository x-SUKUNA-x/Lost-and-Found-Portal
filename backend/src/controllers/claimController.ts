import { Response, NextFunction } from "express";
import * as claimService from "../services/claimService";
import ApiResponse from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

/**
 * ──────────────────────────────────────────
 *  CLAIM CONTROLLER
 *  Thin layer between routes and services.
 *  Extracts request data → calls service → sends response.
 *
 *  Zero business logic lives here.
 * ──────────────────────────────────────────
 */

/**
 * POST /api/v1/claims
 * Submit a claim on an item.
 *
 * Expects req.body:
 *   { item_id, message }
 * Expects req.user.id from auth middleware.
 */
export const createClaimController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = {
      item_id: req.body.item_id as string,
      message: req.body.message as string,
      user_id: req.user.id,
    };

    const newClaim = await claimService.createClaim(data);

    ApiResponse.created(res, newClaim, "Claim submitted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/claims/item/:itemId
 * Get all claims for a specific item.
 *
 * Expects req.params.itemId
 */
export const getClaimsByItemController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const itemId = req.params.itemId as string;

    const claims = await claimService.getClaimsByItemId(itemId);

    ApiResponse.success(res, claims, "Claims fetched successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/claims/user
 * Get all claims submitted by the authenticated user.
 *
 * Expects req.user.id from auth middleware.
 */
export const getClaimsByUserController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;

    const claims = await claimService.getClaimsByUserId(userId);

    ApiResponse.success(res, claims, "User claims fetched successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/claims/:claimId/status
 * Approve or reject a claim (item owner only).
 *
 * Expects req.params.claimId
 * Expects req.body.status → "approved" | "rejected"
 * Expects req.user.id from auth middleware (owner verification in service).
 */
export const updateClaimStatusController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const claimId = req.params.claimId as string;
    const { status } = req.body;
    const ownerId = req.user.id;

    const updatedClaim = await claimService.updateClaimStatus(
      claimId,
      status,
      ownerId
    );

    ApiResponse.success(res, updatedClaim, `Claim ${status} successfully`);
  } catch (error) {
    next(error);
  }
};
