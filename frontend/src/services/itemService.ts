import api from "./api";
import type { ApiResponse, Item } from "../types";

/**
 * Item service — CRUD operations for lost/found items.
 */

export const getAllItems = async (params?: {
  status?: string;
  category?: string;
  search?: string;
}) => {
  const { data } = await api.get<ApiResponse<Item[]>>("/items", { params });
  return data;
};

export const getItemById = async (id: string) => {
  const { data } = await api.get<ApiResponse<Item>>(`/items/${id}`);
  return data;
};

export const createItem = async (
  payload: Omit<Item, "id" | "user_id" | "created_at" | "updated_at">
) => {
  const { data } = await api.post<ApiResponse<Item>>("/items", payload);
  return data;
};

export const updateItem = async (id: string, payload: Partial<Item>) => {
  const { data } = await api.put<ApiResponse<Item>>(`/items/${id}`, payload);
  return data;
};

export const deleteItem = async (id: string) => {
  const { data } = await api.delete<ApiResponse<Item>>(`/items/${id}`);
  return data;
};
