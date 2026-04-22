import { Router } from "express";
import authRoutes from "./authRoutes";
import itemRoutes from "./itemRoutes";
import claimRoutes from "./claimRoutes";

/**
 * ──────────────────────────────────────────
 *  MAIN ROUTER
 *  Aggregates all route modules under
 *  their respective prefixes.
 *
 *  Mounted at: /api
 * ──────────────────────────────────────────
 */
const router = Router();

// /api/auth/*
router.use("/auth", authRoutes);

// /api/items/*
router.use("/items", itemRoutes);

// /api/claims/*
router.use("/claims", claimRoutes);

export default router;

