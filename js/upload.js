import { addProject } from './gallery.js';
import { supabase } from './supabase.js';
import { uploadImage } from './supabase.js';

// Secret key for admin access
const ADMIN_KEY = 'myPortfolio2025';

export function initUploadForm() {
  const uploadBtn = document.getElementById('upload-btn');
  const uploadModal = document.getElementById('upload-modal');
  const closeModalBtn = uploadModal.querySelector('.close-modal');
  const uploadForm = document.getElementById('upload-form');
  const imageInput = document.getElementById('project-image');
  const imagePreviewContainer = document.querySelector('.image-preview-container');
  const contactInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
  
  uploadBtn.style.display = 'none';
  
  // Check authentication status on init
  checkAuthStatus();
  
  contactInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      
      if (value.includes(ADMIN_KEY)) {
        uploadBtn.style.display = 'block';
        
        setTimeout(() => {
          uploadBtn.style.display = 'none';
        }, 5000);
        
        e.target.value = value.replace(ADMIN_KEY, '');
      }
    });
  });
  
  uploadBtn.addEventListener('click', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showNotification('Please sign in to upload projects');
      return;
    }
    uploadModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  closeModalBtn.addEventListener('click', closeUploadModal);
  
  uploadModal.addEventListener('click', (e) => {
    if (e.target === uploadModal) closeUploadModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && uploadModal.classList.contains('active')) {
      closeUploadModal();
    }
  });
  
  imageInput.addEventListener('change', handleImagePreview);
  
  uploadForm.addEventListener('submit', handleFormSubmit);
}

async function checkAuthStatus() {
  const { data: { user } } = await supabase.auth.getUser();
  const uploadBtn = document.getElementById('upload-btn');
  
  if (user) {
    uploadBtn.style.display = 'block';
  } else {
    uploadBtn.style.display = 'none';
  }
}

function closeUploadModal() {
  const uploadModal = document.getElementById('upload-modal');
  uploadModal.classList.remove('active');
  document.body.style.overflow = '';
  
  document.getElementById('upload-form').reset();
  document.querySelector('.image-preview-container').innerHTML = '';
}

function handleImagePreview(e) {
  const files = e.target.files;
  const previewContainer = document.querySelector('.image-preview-container');
  previewContainer.innerHTML = ''; // Clear existing previews
  
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
  
  const previews = document.querySelectorAll('.image-preview img');
  
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

async function handleFormSubmit(e) {
  e.preventDefault();
  
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Please sign in to upload projects');
    }

    const formData = new FormData(e.target);
    const files = Array.from(e.target.querySelector('#project-image').files);
    
    if (!files.length) {
      throw new Error('Please upload at least one image');
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Uploading...';
    submitBtn.disabled = true;

    // Upload images to Supabase Storage
    const imageUrls = await Promise.all(
      files.map(file => uploadImage(file))
    );
    
    const projectData = {
      title: formData.get('title'),
      category: formData.get('category'),
      description: formData.get('description'),
      caseStudy: formData.get('caseStudy'),
      images: imageUrls,
      user_id: user.id
    };
    
    // Validate all required fields
    if (!projectData.title || !projectData.category || !projectData.description || 
        !projectData.caseStudy || !projectData.images.length) {
      throw new Error('Please fill in all required fields');
    }
    
    const savedProject = await addProject(projectData);
    
    if (savedProject) {
      closeUploadModal();
      showNotification('Project added successfully!');
      
      // Refresh the gallery to show the new project
      window.location.reload();
    }
  } catch (error) {
    console.error('Error saving project:', error);
    showNotification(error.message || 'Error saving project. Please try again.');
  } finally {
    // Reset loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Add Project';
    submitBtn.disabled = false;
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

export async function editProject(projectId) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (error || !project) return;
  
  document.getElementById('project-title').value = project.title;
  document.getElementById('project-category').value = project.category;
  document.getElementById('project-description').value = project.description;
  document.getElementById('project-case-study').value = project.case_study;
  
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
  
  const uploadModal = document.getElementById('upload-modal');
  uploadModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}