import api from "./api";
import type { ApiResponse, User } from "../types";

/**
 * Auth service — login, register, and session management.
 */

export const login = async (email: string, password: string) => {
  const { data } = await api.post<ApiResponse<{ user: User; token: string }>>(
    "/auth/login",
    { email, password }
  );
  return data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const { data } = await api.post<ApiResponse<{ user: User; token: string }>>(
    "/auth/register",
    { name, email, password }
  );
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get<ApiResponse<User>>("/auth/profile");
  return data;
};
