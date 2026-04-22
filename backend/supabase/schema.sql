-- ═══════════════════════════════════════════════════════════════
--  LOST & FOUND PORTAL — COMPLETE SUPABASE DATABASE SCHEMA
--  
--  Paste this entire script into the Supabase SQL Editor
--  and click "Run" to set up the full database.
--
--  Tables: users (profiles), items, claims
--  Includes: FK constraints, CHECK constraints, indexes,
--            RLS policies, auto-profile trigger
-- ═══════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────
--  1. USERS TABLE (public profiles linked to auth.users)
-- ───────────────────────────────────────────────────────────────
--  Supabase manages auth.users internally.
--  This public.users table stores app-specific profile data
--  and is auto-populated via a trigger on sign-up.
-- ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT,
  email      TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index: look up users by email
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

COMMENT ON TABLE public.users IS 'Public user profiles, linked 1:1 to auth.users';


-- ───────────────────────────────────────────────────────────────
--  2. ITEMS TABLE
-- ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'lost'
                CHECK (status IN ('lost', 'found', 'claimed', 'returned')),
  category    TEXT
                CHECK (category IN (
                  'Electronics', 'Documents', 'Keys', 'Wallet',
                  'Clothing', 'Bag', 'Jewellery', 'Other'
                )),
  location    TEXT NOT NULL,
  image_url   TEXT,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes: common query patterns
CREATE INDEX IF NOT EXISTS idx_items_user_id    ON public.items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_status     ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_category   ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);

COMMENT ON TABLE public.items IS 'Lost and found item listings';


-- ───────────────────────────────────────────────────────────────
--  3. CLAIMS TABLE
-- ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.claims (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id    UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Prevent duplicate claims: one claim per user per item
  UNIQUE (item_id, user_id)
);

-- Indexes: common query patterns
CREATE INDEX IF NOT EXISTS idx_claims_item_id    ON public.claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_user_id    ON public.claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status     ON public.claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON public.claims(created_at DESC);

COMMENT ON TABLE public.claims IS 'Claims submitted by users on lost/found items';


-- ═══════════════════════════════════════════════════════════════
--  4. AUTO-UPDATE updated_at TRIGGER (for items table)
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();


-- ═══════════════════════════════════════════════════════════════
--  5. AUTO-CREATE PROFILE ON SIGN-UP TRIGGER
-- ═══════════════════════════════════════════════════════════════
--  When a new user signs up via Supabase Auth, this trigger
--  automatically creates a row in public.users.
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ═══════════════════════════════════════════════════════════════
--  6. ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE public.users  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;


-- ───────────────────────────────────────────────────────────────
--  6A. USERS POLICIES
-- ───────────────────────────────────────────────────────────────

-- Anyone can read profiles (public listing)
CREATE POLICY "Users: public read"
  ON public.users FOR SELECT
  USING (true);

-- Users can update only their own profile
CREATE POLICY "Users: self update"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ───────────────────────────────────────────────────────────────
--  6B. ITEMS POLICIES
-- ───────────────────────────────────────────────────────────────

-- Anyone can view all items (public feed)
CREATE POLICY "Items: public read"
  ON public.items FOR SELECT
  USING (true);

-- Authenticated users can insert items (user_id must match)
CREATE POLICY "Items: owner insert"
  ON public.items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only the item owner can update their items
CREATE POLICY "Items: owner update"
  ON public.items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only the item owner can delete their items
CREATE POLICY "Items: owner delete"
  ON public.items FOR DELETE
  USING (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────────
--  6C. CLAIMS POLICIES
-- ───────────────────────────────────────────────────────────────

-- Users can read claims on their own items OR their own claims
CREATE POLICY "Claims: owner or claimer read"
  ON public.claims FOR SELECT
  USING (
    auth.uid() = user_id                          -- claimer can see their own claims
    OR
    auth.uid() IN (                                -- item owner can see claims on their items
      SELECT i.user_id FROM public.items i
      WHERE i.id = item_id
    )
  );

-- Authenticated users can create claims (cannot claim own item)
CREATE POLICY "Claims: authenticated insert"
  ON public.claims FOR INSERT
  WITH CHECK (
    auth.uid() = user_id                           -- must be your own claim
    AND
    auth.uid() NOT IN (                            -- cannot claim your own item
      SELECT i.user_id FROM public.items i
      WHERE i.id = item_id
    )
  );

-- Only the ITEM OWNER can update claim status (approve/reject)
CREATE POLICY "Claims: item owner update"
  ON public.claims FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT i.user_id FROM public.items i
      WHERE i.id = item_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT i.user_id FROM public.items i
      WHERE i.id = item_id
    )
  );

-- Claimers can delete (withdraw) their own pending claims
CREATE POLICY "Claims: claimer delete"
  ON public.claims FOR DELETE
  USING (
    auth.uid() = user_id
    AND status = 'pending'
  );


-- ═══════════════════════════════════════════════════════════════
--  7. GRANT ACCESS TO PUBLIC SCHEMA
-- ═══════════════════════════════════════════════════════════════
--  Supabase roles: anon (unauthenticated), authenticated
-- ═══════════════════════════════════════════════════════════════

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.users TO anon, authenticated;
GRANT SELECT ON public.items TO anon, authenticated;

GRANT INSERT, UPDATE ON public.users TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.claims TO authenticated;


-- ═══════════════════════════════════════════════════════════════
--  ✅  SETUP COMPLETE
--  
--  Tables created:  users, items, claims
--  Triggers:        auto-profile on sign-up, auto-updated_at
--  RLS:             enabled on all tables with granular policies
--  Indexes:         on all foreign keys + common query columns
-- ═══════════════════════════════════════════════════════════════
