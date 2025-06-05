// Upload form functionality
import { addProject } from './gallery.js';

// Secret key for admin access (in a real app, this would be server-side)
const ADMIN_KEY = 'myPortfolio2025';

export function initUploadForm() {
  const uploadBtn = document.getElementById('upload-btn');
  const uploadModal = document.getElementById('upload-modal');
  const closeModalBtn = uploadModal.querySelector('.close-modal');
  const uploadForm = document.getElementById('upload-form');
  const imageInput = document.getElementById('project-image');
  const imagePreviewContainer = document.querySelector('.image-preview-container');
  const contactInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
  
  // Always hide upload button initially
  uploadBtn.style.display = 'none';
  
  // Track input in contact form fields
  contactInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      
      // Check if input contains the secret code
      if (value.includes(ADMIN_KEY)) {
        // Show button temporarily
        uploadBtn.style.display = 'block';
        
        // Hide button after 5 seconds
        setTimeout(() => {
          uploadBtn.style.display = 'none';
        }, 5000);
        
        // Clear the secret code from the input
        e.target.value = value.replace(ADMIN_KEY, '');
      }
    });
  });
  
  // Show upload modal when clicking the upload button
  uploadBtn.addEventListener('click', () => {
    uploadModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Close modal when clicking the close button
  closeModalBtn.addEventListener('click', closeUploadModal);
  
  // Close modal when clicking outside content
  uploadModal.addEventListener('click', (e) => {
    if (e.target === uploadModal) closeUploadModal();
  });
  
  // Close modal with escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && uploadModal.classList.contains('active')) {
      closeUploadModal();
    }
  });
  
  // Image preview functionality
  imageInput.addEventListener('change', handleImagePreview);
  
  // Form submission
  uploadForm.addEventListener('submit', handleFormSubmit);
}

function closeUploadModal() {
  const uploadModal = document.getElementById('upload-modal');
  uploadModal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset form and clear previews
  document.getElementById('upload-form').reset();
  document.querySelector('.image-preview-container').innerHTML = '';
}

function handleImagePreview(e) {
  const files = e.target.files;
  const previewContainer = document.querySelector('.image-preview-container');
  
  Array.from(files).forEach((file) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = document.createElement('div');
      preview.classList.add('image-preview');
      
      preview.innerHTML = `
        <img src="${event.target.result}" alt="Preview">
        <button type="button" class="remove-image" aria-label="Remove image">&times;</button>
      `;
      
      // Add remove functionality
      const removeBtn = preview.querySelector('.remove-image');
      removeBtn.addEventListener('click', () => {
        preview.remove();
        updateFileList();
      });
      
      previewContainer.appendChild(preview);
    };
    
    reader.readAsDataURL(file);
  });
}

function updateFileList() {
  const fileInput = document.getElementById('project-image');
  const dataTransfer = new DataTransfer();
  
  // Get all current preview images
  const previews = document.querySelectorAll('.image-preview img');
  
  // Convert preview images back to files
  previews.forEach((preview, index) => {
    fetch(preview.src)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `image-${index}.jpg`, { type: 'image/jpeg' });
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
      });
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const projectData = {
    title: formData.get('title'),
    category: formData.get('category'),
    description: formData.get('description'),
    caseStudy: formData.get('caseStudy'),
    images: Array.from(document.querySelectorAll('.image-preview img')).map(img => img.src),
    date: new Date().toISOString()
  };
  
  // Validate form data
  if (!projectData.title || !projectData.category || !projectData.description || 
      !projectData.caseStudy || projectData.images.length === 0) {
    alert('Please fill in all fields and upload at least one image.');
    return;
  }
  
  // Save project
  const savedProject = addProject(projectData);
  
  if (savedProject) {
    closeUploadModal();
    showNotification('Project added successfully!');
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  // Remove notification
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Edit existing project
export function editProject(projectId) {
  const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
  const project = projects.find(p => p.id === projectId);
  
  if (!project) return;
  
  // Populate form
  document.getElementById('project-title').value = project.title;
  document.getElementById('project-category').value = project.category;
  document.getElementById('project-description').value = project.description;
  document.getElementById('project-case-study').value = project.caseStudy;
  
  // Show image previews
  const previewContainer = document.querySelector('.image-preview-container');
  previewContainer.innerHTML = '';
  
  project.images.forEach(imageUrl => {
    const preview = document.createElement('div');
    preview.classList.add('image-preview');
    
    preview.innerHTML = `
      <img src="${imageUrl}" alt="Preview">
      <button type="button" class="remove-image" aria-label="Remove image">&times;</button>
    `;
    
    const removeBtn = preview.querySelector('.remove-image');
    removeBtn.addEventListener('click', () => {
      preview.remove();
      updateFileList();
    });
    
    previewContainer.appendChild(preview);
  });
  
  // Show modal
  const uploadModal = document.getElementById('upload-modal');
  uploadModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}