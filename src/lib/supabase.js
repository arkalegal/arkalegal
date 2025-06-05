import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function initSupabase() {
  // Check initial auth state
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      document.getElementById('auth-btn').textContent = 'Sign Out';
      document.getElementById('mobile-auth-btn').textContent = 'Sign Out';
      document.getElementById('upload-btn').classList.remove('hidden');
    } else if (event === 'SIGNED_OUT') {
      document.getElementById('auth-btn').textContent = 'Sign In';
      document.getElementById('mobile-auth-btn').textContent = 'Sign In';
      document.getElementById('upload-btn').classList.add('hidden');
    }
  });
}

export async function uploadImage(file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}