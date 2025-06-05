import { supabase } from './supabase.js';
import { uploadImage } from './supabase.js';
import { toggleAuthForms } from './auth.js';

export function initUploadForm() {
  const uploadBtn = document.getElementById('upload-btn');
  const uploadModal = document.getElementById('upload-modal');
  const closeModalBtn = uploadModal.querySelector('.close-modal');
  const uploadForm = document.getElementById('upload-form');
  const imageInput = document.getElementById('project-image');
  const imagePreviewContainer = document.querySelector('.image-preview-container');
  
  uploadBtn.addEventListener('click', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toggleAuthForms(true);
    } else {
      uploadModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
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
  previewContainer.innerHTML = '';
  
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Please sign in to upload projects');
    }

    const formData = new FormData(e.target);
    const files = Array.from(e.target.querySelector('#project-image').files);
    
    if (!files.length) {
      throw new Error('Please upload at least one image');
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Uploading...';
    submitBtn.disabled = true;

    const imageUrls = await Promise.all(
      files.map(file => uploadImage(file))
    );
    
    const projectData = {
      title: formData.get('title'),
      category: formData.get('category'),
      description: formData.get('description'),
      case_study: formData.get('case_study'),
      images: imageUrls,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;
    
    closeUploadModal();
    showNotification('Project added successfully!');
    window.location.reload();
  } catch (error) {
    console.error('Error saving project:', error);
    showNotification(error.message || 'Error saving project. Please try again.');
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