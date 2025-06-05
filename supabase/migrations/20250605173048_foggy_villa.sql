/*
  # Create projects table and policies

  1. New Tables
    - `projects` table for storing portfolio projects
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text)
      - `description` (text)
      - `case_study` (text)
      - `images` (text array)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- Create the projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  case_study text NOT NULL,
  images text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can read all projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
END $$;

-- Create policies
CREATE POLICY "Users can read all projects"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert their own projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);