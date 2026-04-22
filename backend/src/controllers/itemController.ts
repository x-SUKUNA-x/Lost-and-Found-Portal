import { Response, NextFunction } from "express";
import * as itemService from "../services/itemService";
import ApiResponse from "../utils/apiResponse";
import { AuthenticatedRequest } from "../types";

/**
 * ──────────────────────────────────────────
 *  ITEM CONTROLLER
 *  Thin layer between routes and services.
 *  Extracts request data → calls service → sends response.
 *
 *  Zero business logic lives here.
 * ──────────────────────────────────────────
 */

/**
 * POST /api/v1/items
 * Create a new lost or found item.
 *
 * Expects req.body:
 *   { title, description, category, status, location, image_url? }
 * Expects req.user.id from auth middleware.
 */
export const createItemController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = {
      ...req.body,
      user_id: req.user.id,
    };

    const newItem = await itemService.createItem(data);

    ApiResponse.created(res, newItem, "Item reported successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/items
 * Retrieve all items with optional filters.
 *
 * Accepts query params: ?status=lost&category=Electronics&search=wallet
 */
export const getAllItemsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      category: req.query.category as string | undefined,
      search: req.query.search as string | undefined,
    };

    const items = await itemService.getAllItems(filters);

    ApiResponse.success(res, items, "Items fetched successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/items/:id
 * Retrieve a single item by its UUID.
 *
 * Expects req.params.id
 */
export const getItemByIdController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const item = await itemService.getItemById(id);

    ApiResponse.success(res, item, "Item fetched successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/items/:id
 * Update an existing item.
 *
 * Expects req.params.id for the target item.
 * Expects req.body with the fields to update.
 * Expects req.user.id from auth middleware (ownership check in service).
 */
export const updateItemController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updates = req.body;
    const userId = req.user.id;

    const updatedItem = await itemService.updateItem(id, updates, userId);

    ApiResponse.success(res, updatedItem, "Item updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/items/:id
 * Delete an item by its UUID.
 *
 * Expects req.params.id for the target item.
 * Expects req.user.id from auth middleware (ownership check in service).
 */
export const deleteItemController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user.id;

    const deletedItem = await itemService.deleteItem(id, userId);

    ApiResponse.success(res, deletedItem, "Item deleted successfully");
  } catch (error) {
    next(error);
  }
};
