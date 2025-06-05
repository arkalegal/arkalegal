import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file) {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    // Upload the file
    const { data, error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error.message);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

export async function deleteImage(imageUrl) {
  try {
    const fileName = imageUrl.split('/').pop();
    const filePath = `projects/${fileName}`;
    
    const { error } = await supabase.storage
      .from('project-images')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error.message);
    throw error;
  }
}