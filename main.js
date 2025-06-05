import { createClient } from '@supabase/supabase-js';
import './style.css';
import './css/reset.css';
import './css/main.css';
import './css/components.css';
import './css/animations.css';
import './css/responsive.css';

// Initialize modules
import { initGallery } from './js/gallery.js';
import { initProjectModal } from './js/project.js';
import { initUploadForm } from './js/upload.js';
import { initAnimations } from './js/animations.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules
  initGallery();
  initProjectModal();
  initUploadForm();
  initAnimations();
});