/*
  # Create projects table and security policies

  1. New Tables
    - `projects`
      - `id` (uuid, primary key) - Unique identifier for each project
      - `title` (text) - Project title
      - `category` (text) - Project category
      - `description` (text) - Project description
      - `case_study` (text) - Project case study
      - `images` (text[]) - Array of image URLs
      - `created_at` (timestamptz) - Creation timestamp
      - `user_id` (uuid) - Reference to auth.users table

  2. Security
    - Enable RLS on projects table
    - Add policies for:
      - Select: Allow anyone to read all projects
      - Insert: Allow authenticated users to create their own projects
      - Update: Allow users to update their own projects
      - Delete: Allow users to delete their own projects
*/

-- Create the projects table
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