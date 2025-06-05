/*
  # Portfolio Projects Schema

  1. New Tables
    - projects
      - id (uuid, primary key)
      - title (text)
      - category (text)
      - description (text)
      - case_study (text)
      - images (text[])
      - created_at (timestamptz)
      - user_id (uuid, foreign key)

  2. Security
    - Enable RLS on projects table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  case_study text NOT NULL,
  images text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all projects"
  ON projects
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert their own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);