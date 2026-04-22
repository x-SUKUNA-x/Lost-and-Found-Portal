import { Request } from "express";

/* ───────── Database Row Types ───────── */

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  image_url: string | null;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface Claim {
  id: string;
  item_id: string;
  user_id: string;
  message: string;
  status: string;
  created_at: string;
  items?: Partial<Item>; // joined via Supabase select
}

/* ───────── Request Payloads ───────── */

export interface CreateItemPayload {
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  image_url?: string;
  user_id: string;
}

export interface CreateClaimPayload {
  item_id: string;
  user_id: string;
  message: string;
}

export interface ItemFilters {
  status?: string;
  category?: string;
  search?: string;
}

/* ───────── Auth-Extended Request ───────── */

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
  };
}
