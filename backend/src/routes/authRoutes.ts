import { Router } from "express";
import {
  registerController,
  loginController,
  getProfileController,
} from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

/**
 * ──────────────────────────────────────────
 *  AUTH ROUTES
 *  Maps HTTP endpoints → auth controllers.
 *
 *  Base path: /api/auth
 * ──────────────────────────────────────────
 */
const router = Router();

/* ───────── Public Routes ───────── */

// POST /api/auth/register  → create a new account
router.post("/register", registerController);

// POST /api/auth/login     → sign in and get token
router.post("/login", loginController);

/* ───────── Protected Routes ───────── */

// GET  /api/auth/me         → get current user's profile
router.get("/me", authMiddleware as any, getProfileController as any);

export default router;
