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

export async function editProject(projectId) {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;

    const uploadModal = document.getElementById('upload-modal');
    const uploadForm = document.getElementById('upload-form');
    const imagePreviewContainer = document.querySelector('.image-preview-container');
    const submitBtn = uploadForm.querySelector('button[type="submit"]');

    // Set form values
    uploadForm.querySelector('#project-id').value = project.id;
    uploadForm.querySelector('#project-title').value = project.title;
    uploadForm.querySelector('#project-category').value = project.category;
    uploadForm.querySelector('#project-description').value = project.description;
    uploadForm.querySelector('#project-case-study').value = project.case_study;

    // Clear and populate image preview container
    imagePreviewContainer.innerHTML = '';
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

      imagePreviewContainer.appendChild(preview);
    });

    // Update submit button text
    submitBtn.textContent = 'Update Project';

    // Show modal
    uploadModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error('Error loading project for editing:', error);
    showNotification('Error loading project. Please try again.');
  }
}

function closeUploadModal() {
  const uploadModal = document.getElementById('upload-modal');
  const uploadForm = document.getElementById('upload-form');
  const submitBtn = uploadForm.querySelector('button[type="submit"]');
  
  uploadModal.classList.remove('active');
  document.body.style.overflow = '';
  
  uploadForm.reset();
  document.querySelector('.image-preview-container').innerHTML = '';
  uploadForm.querySelector('#project-id').value = '';
  submitBtn.textContent = 'Add Project';
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
    const projectId = formData.get('id');
    const files = Array.from(e.target.querySelector('#project-image').files);
    const existingImages = Array.from(document.querySelectorAll('.image-preview img'))
      .map(img => img.src)
      .filter(src => src.startsWith('http')); // Only keep URLs, not data URLs

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Uploading...';
    submitBtn.disabled = true;

    // Upload new images
    const newImageUrls = await Promise.all(
      files.map(file => uploadImage(file))
    );
    
    const projectData = {
      id: projectId || undefined, // Include ID only if editing
      title: formData.get('title'),
      category: formData.get('category'),
      description: formData.get('description'),
      case_study: formData.get('caseStudy'),
      images: [...existingImages, ...newImageUrls],
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('projects')
      .upsert([projectData])
      .select()
      .single();

    if (error) throw error;
    
    closeUploadModal();
    showNotification(projectId ? 'Project updated successfully!' : 'Project added successfully!');
    document.dispatchEvent(new CustomEvent('projectSaved'));
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