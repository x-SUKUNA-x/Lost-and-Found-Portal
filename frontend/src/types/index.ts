/* ───────── Database Row Types ───────── */

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "lost" | "found" | "claimed" | "returned";
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
  status: "pending" | "approved" | "rejected";
  created_at: string;
  items?: Partial<Item>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

/* ───────── API Response Shape ───────── */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ───────── Auth ───────── */

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/* ───────── Component Props ───────── */

export interface ItemCardProps {
  item: Item;
  onDetailsClick?: (id: string) => void;
}

export interface ItemListProps {
  items: Item[];
  isLoading?: boolean;
  onDetailsClick?: (id: string) => void;
}
