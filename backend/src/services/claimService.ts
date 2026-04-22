import supabase from "../config/supabase";
import ApiError from "../utils/apiError";
import { ITEM_STATUS } from "../utils/constants";
import { Claim, CreateClaimPayload } from "../types";

/**
 * ──────────────────────────────────────────
 *  CLAIM SERVICE
 *  Handles all business logic related to
 *  claiming lost / found items.
 *
 *  Table: "claims"
 * ──────────────────────────────────────────
 */

/**
 * Allowed claim statuses.
 * pending  → user submitted a claim
 * approved → item owner confirmed the claim
 * rejected → item owner denied the claim
 */
export const CLAIM_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type ClaimStatusType = (typeof CLAIM_STATUS)[keyof typeof CLAIM_STATUS];

/**
 * Submit a new claim on an item.
 *
 * Business rules:
 *  1. The target item must exist.
 *  2. The item must still be in "lost" or "found" status.
 *  3. A user cannot claim their own item.
 *  4. A user cannot submit duplicate claims on the same item.
 *
 * @param data - Claim payload
 * @returns The newly created claim row
 */
export const createClaim = async (data: CreateClaimPayload): Promise<Claim> => {
  const { item_id, user_id, message } = data;

  // ── Validation ──────────────────────────
  if (!item_id || !user_id || !message) {
    throw new ApiError(400, "Missing required fields: item_id, user_id, message");
  }

  // ── 1. Check item exists ────────────────
  const { data: item, error: itemError } = await supabase
    .from("items")
    .select("id, status, user_id")
    .eq("id", item_id)
    .single();

  if (itemError || !item) {
    throw new ApiError(404, "Item not found");
  }

  // ── 2. Item must be claimable ───────────
  const claimable: string[] = [ITEM_STATUS.LOST, ITEM_STATUS.FOUND];
  if (!claimable.includes(item.status)) {
    throw new ApiError(
      400,
      `Item cannot be claimed — current status is "${item.status}"`
    );
  }

  // ── 3. Cannot claim your own item ───────
  if (item.user_id === user_id) {
    throw new ApiError(400, "You cannot claim your own item");
  }

  // ── 4. Prevent duplicate claims ─────────
  const { data: existingClaim } = await supabase
    .from("claims")
    .select("id")
    .eq("item_id", item_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (existingClaim) {
    throw new ApiError(409, "You have already submitted a claim for this item");
  }

  // ── Insert claim ───────────────────────
  const { data: newClaim, error } = await supabase
    .from("claims")
    .insert([
      {
        item_id,
        user_id,
        message,
        status: CLAIM_STATUS.PENDING,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new ApiError(500, "Failed to create claim", error.message);
  }

  return newClaim as Claim;
};

/**
 * Get all claims for a specific item.
 *
 * @param itemId - UUID of the target item
 * @returns Array of claim rows, newest first
 */
export const getClaimsByItemId = async (itemId: string): Promise<Claim[]> => {
  if (!itemId) {
    throw new ApiError(400, "Item ID is required");
  }

  const { data: claims, error } = await supabase
    .from("claims")
    .select("*")
    .eq("item_id", itemId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new ApiError(500, "Failed to fetch claims", error.message);
  }

  return claims as Claim[];
};

/**
 * Get all claims submitted by a specific user.
 *
 * @param userId - UUID of the user
 * @returns Array of claim rows with item details
 */
export const getClaimsByUserId = async (userId: string): Promise<Claim[]> => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const { data: claims, error } = await supabase
    .from("claims")
    .select("*, items(title, status, location)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new ApiError(500, "Failed to fetch user claims", error.message);
  }

  return claims as Claim[];
};

/**
 * Update a claim's status (approve / reject).
 *
 * Business rules:
 *  1. Only the ITEM OWNER can approve or reject claims.
 *  2. When a claim is approved, the item status changes to "claimed".
 *
 * @param claimId  - UUID of the claim
 * @param status   - "approved" | "rejected"
 * @param ownerId  - UUID of the item owner (for authorization)
 * @returns The updated claim row
 */
export const updateClaimStatus = async (
  claimId: string,
  status: string,
  ownerId: string
): Promise<Claim> => {
  // ── Validation ──────────────────────────
  const validStatuses: string[] = [CLAIM_STATUS.APPROVED, CLAIM_STATUS.REJECTED];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  // ── Fetch the claim + parent item ───────
  const { data: claim, error: claimError } = await supabase
    .from("claims")
    .select("*, items(user_id)")
    .eq("id", claimId)
    .single();

  if (claimError || !claim) {
    throw new ApiError(404, "Claim not found");
  }

  // ── Authorization: only item owner ──────
  if (claim.items.user_id !== ownerId) {
    throw new ApiError(403, "Only the item owner can approve or reject claims");
  }

  // ── Update claim status ─────────────────
  const { data: updatedClaim, error } = await supabase
    .from("claims")
    .update({ status })
    .eq("id", claimId)
    .select()
    .single();

  if (error) {
    throw new ApiError(500, "Failed to update claim", error.message);
  }

  // ── If approved → mark item as "claimed" ─
  if (status === CLAIM_STATUS.APPROVED) {
    const { error: itemUpdateError } = await supabase
      .from("items")
      .update({ status: ITEM_STATUS.CLAIMED })
      .eq("id", claim.item_id);

    if (itemUpdateError) {
      throw new ApiError(500, "Claim approved but failed to update item status", itemUpdateError.message);
    }
  }

  return updatedClaim as Claim;
};
