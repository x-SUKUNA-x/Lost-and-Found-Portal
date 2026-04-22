-- ═══════════════════════════════════════════════════════════════
--  SEED DATA — for local testing only
--  Run AFTER schema.sql and AFTER creating test users via
--  Supabase Auth (sign up 2 test accounts first).
--
--  Replace the UUIDs below with real auth.users IDs from
--  your Supabase dashboard → Authentication → Users.
-- ═══════════════════════════════════════════════════════════════

-- ⚠️  Replace these with your actual test user IDs
-- DO NOT run this in production

/*
INSERT INTO public.items (title, description, status, category, location, user_id)
VALUES
  ('Blue Backpack',    'Navy blue JanSport, has a keychain attached',  'lost',  'Bag',         'Library 2nd Floor',     '<USER_1_UUID>'),
  ('iPhone 15 Pro',    'Space black, cracked screen protector',        'found', 'Electronics', 'Cafeteria Table 5',     '<USER_2_UUID>'),
  ('Car Keys',         'Toyota key with red lanyard',                  'lost',  'Keys',        'Parking Lot B',         '<USER_1_UUID>'),
  ('Leather Wallet',   'Brown leather, contains student ID',           'found', 'Wallet',      'Main Auditorium Row 3', '<USER_2_UUID>'),
  ('Gold Ring',        'Small gold band with engraving inside',        'lost',  'Jewellery',   'Gym Locker Room',       '<USER_1_UUID>');

INSERT INTO public.claims (item_id, user_id, message, status)
VALUES
  ((SELECT id FROM public.items WHERE title = 'iPhone 15 Pro'), '<USER_1_UUID>', 'This is my phone, I can show the IMEI to verify.', 'pending'),
  ((SELECT id FROM public.items WHERE title = 'Leather Wallet'), '<USER_1_UUID>', 'My student ID number is 20230456, its inside.', 'pending');
*/
