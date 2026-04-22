import { Router } from "express";
import {
  createItemController,
  getAllItemsController,
  getItemByIdController,
  updateItemController,
  deleteItemController,
} from "../controllers/itemController";
import authMiddleware from "../middlewares/authMiddleware";

/**
 * ──────────────────────────────────────────
 *  ITEM ROUTES
 *  Maps HTTP endpoints → item controllers.
 *
 *  Base path: /api/items
 * ──────────────────────────────────────────
 */
const router = Router();

/* ───────── Public Routes ───────── */

// GET /api/items          → fetch all items (with optional filters)
router.get("/", getAllItemsController as any);

// GET /api/items/:id      → fetch a single item by UUID
router.get("/:id", getItemByIdController as any);

/* ───────── Protected Routes (require auth) ───────── */

// POST /api/items         → report a new lost/found item
router.post("/", authMiddleware as any, createItemController as any);

// PUT /api/items/:id      → update an existing item (owner only)
router.put("/:id", authMiddleware as any, updateItemController as any);

// DELETE /api/items/:id   → delete an item (owner only)
router.delete("/:id", authMiddleware as any, deleteItemController as any);

export default router;
