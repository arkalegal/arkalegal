import './style.css';
import { initSupabase } from './lib/supabase';
import { initAuth } from './lib/auth';
import { initGallery } from './lib/gallery';
import { initUpload } from './lib/upload';
import { initAnimations } from './lib/animations';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  initAuth();
  initGallery();
  initUpload();
  initAnimations();
  initMobileMenu();
});

// Mobile menu functionality
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  });
}