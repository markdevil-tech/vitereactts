/*
  # Add admin insert policy

  1. Security Changes
    - Add policy to allow new admin registration
    - Policy allows insertion only when the user's ID matches the row being inserted
*/

CREATE POLICY "Allow users to insert their own admin profile"
  ON admins FOR INSERT
  WITH CHECK (
    auth.uid() = id
  );