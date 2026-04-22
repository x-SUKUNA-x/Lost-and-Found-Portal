import supabase from "../config/supabase";
import ApiError from "../utils/apiError";
import { ITEM_STATUS } from "../utils/constants";
import { Item, CreateItemPayload, ItemFilters } from "../types";

/**
 * ──────────────────────────────────────────
 *  ITEM SERVICE
 *  Handles all business logic related to
 *  lost / found items.
 *
 *  Table: "items"
 * ──────────────────────────────────────────
 */

/**
 * Create a new lost or found item.
 *
 * @param data - Item payload with all required fields
 * @returns The newly created item row
 */
export const createItem = async (data: CreateItemPayload): Promise<Item> => {
  const { title, description, category, status, location, image_url, user_id } = data;

  // ── Validation ──────────────────────────
  if (!title || !description || !category || !status || !location || !user_id) {
    throw new ApiError(400, "Missing required fields: title, description, category, status, location, user_id");
  }

  const validStatuses: string[] = [ITEM_STATUS.LOST, ITEM_STATUS.FOUND];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  // ── Insert into Supabase ────────────────
  const { data: newItem, error } = await supabase
    .from("items")
    .insert([
      {
        title,
        description,
        category,
        status,
        location,
        image_url: image_url || null,
        user_id,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new ApiError(500, "Failed to create item", error.message);
  }

  return newItem as Item;
};

/**
 * Retrieve all items, ordered by most recently created.
 * Supports optional filters: status, category, search.
 *
 * @param filters - Optional query filters
 * @returns Array of item rows
 */
export const getAllItems = async (filters: ItemFilters = {}): Promise<Item[]> => {
  let query = supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  // ── Apply optional filters ──────────────
  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  const { data: items, error } = await query;

  if (error) {
    throw new ApiError(500, "Failed to fetch items", error.message);
  }

  return items as Item[];
};

/**
 * Retrieve a single item by its UUID.
 *
 * @param id - The item's UUID
 * @returns The matching item row
 */
export const getItemById = async (id: string): Promise<Item> => {
  if (!id) {
    throw new ApiError(400, "Item ID is required");
  }

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !item) {
    throw new ApiError(404, "Item not found");
  }

  return item as Item;
};

/**
 * Update an existing item.
 *
 * @param id      - The item's UUID
 * @param updates - Fields to update
 * @param userId  - ID of the requesting user (ownership check)
 * @returns The updated item row
 */
export const updateItem = async (
  id: string,
  updates: Partial<Item>,
  userId: string
): Promise<Item> => {
  // ── Verify ownership ───────────────────
  const existing = await getItemById(id);

  if (existing.user_id !== userId) {
    throw new ApiError(403, "You are not authorized to update this item");
  }

  // ── Perform update ─────────────────────
  const { data: updatedItem, error } = await supabase
    .from("items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new ApiError(500, "Failed to update item", error.message);
  }

  return updatedItem as Item;
};

/**
 * Delete an item by its UUID.
 *
 * @param id     - The item's UUID
 * @param userId - ID of the requesting user (ownership check)
 * @returns The deleted item row (for confirmation)
 */
export const deleteItem = async (id: string, userId: string): Promise<Item> => {
  // ── Verify ownership ───────────────────
  const existing = await getItemById(id);

  if (existing.user_id !== userId) {
    throw new ApiError(403, "You are not authorized to delete this item");
  }

  // ── Delete from Supabase ────────────────
  const { data: deletedItem, error } = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new ApiError(500, "Failed to delete item", error.message);
  }

  return deletedItem as Item;
};
