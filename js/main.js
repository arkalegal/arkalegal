// Main JavaScript file
import { initGallery } from './gallery.js';
import { initProjectModal } from './project.js';
import { initUploadForm } from './upload.js';
import { initAnimations } from './animations.js';
import { initAuth } from './auth.js';

// DOM elements
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules
  initGallery();
  initProjectModal();
  initUploadForm();
  initAnimations();
  initAuth();
  initCustomCursor();
  initEventListeners();
});

// Initialize event listeners
function initEventListeners() {
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', toggleMobileMenu);

  // Navigation links
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Set active class
      navItems.forEach(link => link.classList.remove('active'));
      item.classList.add('active');
      
      // Close mobile menu
      if (window.innerWidth < 768) {
        toggleMobileMenu();
      }
      
      // Scroll to section
      const sectionId = item.getAttribute('data-section');
      if (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
          const yOffset = -80; // Header height offset
          const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }
    });
  });
}

// Toggle mobile menu function
function toggleMobileMenu() {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.classList.toggle('menu-open');
}

// Initialize custom cursor
function initCustomCursor() {
  if (window.innerWidth > 1023) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      
      // Add a small delay to follower for smoother effect
      setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
      }, 100);
    });
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, input, textarea, .filter-btn');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursorFollower.style.width = '50px';
        cursorFollower.style.height = '50px';
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
      });
    });
  }
}