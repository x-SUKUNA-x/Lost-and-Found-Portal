import supabase from "../config/supabase";
import ApiError from "../utils/apiError";

/**
 * ──────────────────────────────────────────
 *  AUTH SERVICE
 *  Handles all authentication logic using
 *  Supabase Auth — no custom password hashing.
 *
 *  Methods: signUp, signIn, getUserProfile
 * ──────────────────────────────────────────
 */

/** Shape returned to the controller on successful auth */
export interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

/**
 * Register a new user.
 *
 * 1. Creates a Supabase Auth user via signUp().
 * 2. The DB trigger `on_auth_user_created` auto-inserts into public.users.
 * 3. Updates the public.users row with the provided name.
 *
 * @param name     - Display name
 * @param email    - Email address
 * @param password - Plain password (Supabase handles hashing)
 * @returns AuthResult with user info and access token
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResult> => {
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  // ── 1. Create auth user ─────────────────
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, // stored in raw_user_meta_data, used by the trigger
    },
  });

  if (authError) {
    // Supabase returns a specific message for duplicate emails
    if (authError.message.includes("already registered")) {
      throw new ApiError(409, "A user with this email already exists");
    }
    throw new ApiError(400, authError.message);
  }

  if (!authData.user || !authData.session) {
    throw new ApiError(
      400,
      "Signup succeeded but no session returned. Check if email confirmation is enabled."
    );
  }

  // ── 2. Update name in public.users ──────
  //    (trigger may have set it from meta, but let's ensure)
  const { error: updateError } = await supabase
    .from("users")
    .update({ name })
    .eq("id", authData.user.id);

  if (updateError) {
    console.error("Warning: failed to update user name:", updateError.message);
    // Non-fatal — auth still succeeded
  }

  return {
    user: {
      id: authData.user.id,
      name,
      email: authData.user.email!,
    },
    token: authData.session.access_token,
  };
};

/**
 * Log in an existing user.
 *
 * @param email    - Email address
 * @param password - Plain password
 * @returns AuthResult with user info and access token
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!authData.user || !authData.session) {
    throw new ApiError(401, "Authentication failed");
  }

  // ── Fetch profile from public.users ─────
  const { data: profile } = await supabase
    .from("users")
    .select("name")
    .eq("id", authData.user.id)
    .single();

  return {
    user: {
      id: authData.user.id,
      name: profile?.name || "",
      email: authData.user.email!,
    },
    token: authData.session.access_token,
  };
};

/**
 * Get the full profile of an authenticated user.
 *
 * @param userId - UUID of the authenticated user
 * @returns The user's public profile row
 */
export const getUserProfile = async (userId: string) => {
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    throw new ApiError(404, "User profile not found");
  }

  return profile;
};
