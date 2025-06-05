// Upload form functionality
import { addProject } from './gallery.js';

export function initUploadForm() {
  const uploadBtn = document.getElementById('upload-btn');
  const uploadModal = document.getElementById('upload-modal');
  const closeModalBtn = uploadModal.querySelector('.close-modal');
  const uploadForm = document.getElementById('upload-form');
  const imageInput = document.getElementById('project-image');
  const imagePreviewContainer = document.querySelector('.image-preview-container');
  
  // Show upload modal when clicking the upload button
  uploadBtn.addEventListener('click', () => {
    uploadModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Close modal when clicking the close button
  closeModalBtn.addEventListener('click', () => {
    closeUploadModal();
  });
  
  // Close modal when clicking outside content
  uploadModal.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
      closeUploadModal();
    }
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

// Function to close the upload modal
function closeUploadModal() {
  const uploadModal = document.getElementById('upload-modal');
  uploadModal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset form
  document.getElementById('upload-form').reset();
  document.querySelector('.image-preview-container').innerHTML = '';
}

// Function to handle image preview
function handleImagePreview(e) {
  const files = e.target.files;
  const previewContainer = document.querySelector('.image-preview-container');
  
  // Clear previous previews
  previewContainer.innerHTML = '';
  
  // Create previews for each file
  Array.from(files).forEach((file) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const preview = document.createElement('div');
      preview.classList.add('image-preview');
      
      preview.innerHTML = `
        <img src="${event.target.result}" alt="Preview">
        <span class="remove-image">&times;</span>
      `;
      
      // Remove image functionality
      preview.querySelector('.remove-image').addEventListener('click', () => {
        preview.remove();
        // Note: In a real application, you would also need to update the file input
      });
      
      previewContainer.appendChild(preview);
    };
    
    reader.readAsDataURL(file);
  });
}

// Function to handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(e.target);
  const title = formData.get('title');
  const category = formData.get('category');
  const description = formData.get('description');
  const caseStudy = formData.get('caseStudy');
  const fileInput = document.getElementById('project-image');
  
  // Validate form data
  if (!title || !category || !description || !caseStudy || fileInput.files.length === 0) {
    alert('Please fill in all fields and upload at least one image.');
    return;
  }
  
  // In a real application, you would upload the images to a server
  // Here we're creating URLs for demonstration purposes
  const imageFiles = Array.from(fileInput.files);
  const imageUrls = [];
  
  // For demo purposes, we'll use the preview images as URLs
  const previewImages = document.querySelectorAll('.image-preview img');
  previewImages.forEach(img => {
    imageUrls.push(img.src);
  });
  
  // Create project object
  const newProject = {
    title,
    category,
    description,
    caseStudy,
    images: imageUrls
  };
  
  // Add project to gallery
  addProject(newProject);
  
  // Close modal and reset form
  closeUploadModal();
  
  // Show success message
  showNotification('Project added successfully!');
}

// Function to show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Hide and remove notification
  setTimeout(() => {
    notification.classList.remove('show');
    
    // Remove from DOM after fade out
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}