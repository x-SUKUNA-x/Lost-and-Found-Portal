import { Router } from "express";
import {
  createClaimController,
  getClaimsByItemController,
  getClaimsByUserController,
  updateClaimStatusController,
} from "../controllers/claimController";
import authMiddleware from "../middlewares/authMiddleware";

/**
 * ──────────────────────────────────────────
 *  CLAIM ROUTES
 *  Maps HTTP endpoints → claim controllers.
 *
 *  Base path: /api/claims
 * ──────────────────────────────────────────
 */
const router = Router();

/* ───────── Protected Routes (all claim ops require auth) ───────── */

// POST  /api/claims                   → submit a new claim
router.post("/", authMiddleware as any, createClaimController as any);

// GET   /api/claims/item/:itemId      → get all claims for an item
router.get("/item/:itemId", authMiddleware as any, getClaimsByItemController as any);

// GET   /api/claims/user              → get all claims by the logged-in user
router.get("/user", authMiddleware as any, getClaimsByUserController as any);

// PATCH /api/claims/:claimId/status   → approve or reject a claim (owner only)
router.patch("/:claimId/status", authMiddleware as any, updateClaimStatusController as any);

export default router;
