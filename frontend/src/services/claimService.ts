import api from "./api";
import type { ApiResponse, Claim } from "../types";

/**
 * Claim service — submit and manage claims on items.
 */

export const createClaim = async (itemId: string, message: string) => {
  const { data } = await api.post<ApiResponse<Claim>>("/claims", {
    item_id: itemId,
    message,
  });
  return data;
};

export const getClaimsByItem = async (itemId: string) => {
  const { data } = await api.get<ApiResponse<Claim[]>>(
    `/claims/item/${itemId}`
  );
  return data;
};

export const getMyClaims = async () => {
  const { data } = await api.get<ApiResponse<Claim[]>>("/claims/user");
  return data;
};

export const updateClaimStatus = async (
  claimId: string,
  status: "approved" | "rejected"
) => {
  const { data } = await api.patch<ApiResponse<Claim>>(
    `/claims/${claimId}/status`,
    { status }
  );
  return data;
};
