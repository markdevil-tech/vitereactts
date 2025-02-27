/*
  # Initial Schema Setup

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text)
      - `price` (decimal, required)
      - `quantity` (integer, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `admins`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated admins
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admins table (extending Supabase auth.users)
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Admins can read all products" 
  ON products FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.id = auth.uid()
  ));

CREATE POLICY "Admins can insert products" 
  ON products FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.id = auth.uid()
  ));

CREATE POLICY "Admins can update products" 
  ON products FOR UPDATE
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.id = auth.uid()
  ));

CREATE POLICY "Admins can delete products" 
  ON products FOR DELETE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.id = auth.uid()
  ));

-- Create policies for admins
CREATE POLICY "Admins can read all admin profiles" 
  ON admins FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.id = auth.uid()
  ));

CREATE POLICY "Admins can update their own profile" 
  ON admins FOR UPDATE 
  TO authenticated 
  USING (id = auth.uid());

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();