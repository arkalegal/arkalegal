import { supabase } from './supabase.js';
import { uploadImage } from './supabase.js';

export function initUploadForm() {
  const uploadBtn = document.getElementById('upload-btn');
  const uploadModal = document.getElementById('upload-modal');
  const closeModalBtn = uploadModal.querySelector('.close-modal');
  const uploadForm = document.getElementById('upload-form');
  const imageInput = document.getElementById('project-image');
  const imagePreviewContainer = document.querySelector('.image-preview-container');
  
  uploadBtn.addEventListener('click', () => {
    showSignInModal();
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

function showSignInModal() {
  const signInModal = document.createElement('div');
  signInModal.className = 'sign-in-modal';
  signInModal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <h2>Upload Project</h2>
      <p class="sign-in-text">Please sign in to upload your project</p>
      <button class="sign-in-btn">Sign In</button>
    </div>
  `;
  
  document.body.appendChild(signInModal);
  
  // Add active class after a small delay to trigger animation
  requestAnimationFrame(() => {
    signInModal.classList.add('active');
  });

  // Handle sign in button click
  const signInBtn = signInModal.querySelector('.sign-in-btn');
  signInBtn.addEventListener('click', () => {
    signInModal.classList.remove('active');
    setTimeout(() => {
      signInModal.remove();
      showAuthModal();
    }, 300);
  });

  // Handle close button
  const closeBtn = signInModal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    signInModal.classList.remove('active');
    setTimeout(() => signInModal.remove(), 300);
  });

  // Close on outside click
  signInModal.addEventListener('click', (e) => {
    if (e.target === signInModal) {
      signInModal.classList.remove('active');
      setTimeout(() => signInModal.remove(), 300);
    }
  });
}

function showAuthModal() {
  const authModal = document.createElement('div');
  authModal.className = 'auth-modal';
  authModal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <h2>Sign In</h2>
      <form class="auth-form">
        <div class="form-group">
          <label for="auth-email">Email</label>
          <input type="email" id="auth-email" required>
        </div>
        <div class="form-group">
          <label for="auth-password">Password</label>
          <input type="password" id="auth-password" required>
        </div>
        <div class="auth-buttons">
          <button type="submit" class="sign-in-submit">Sign In</button>
          <button type="button" class="sign-up-toggle">Create Account</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(authModal);
  
  requestAnimationFrame(() => {
    authModal.classList.add('active');
  });

  // Handle form submission
  const form = authModal.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      authModal.classList.remove('active');
      setTimeout(() => {
        authModal.remove();
        showNotification('Signed in successfully!');
        const uploadModal = document.getElementById('upload-modal');
        uploadModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }, 300);
    } catch (error) {
      showNotification(error.message);
    }
  });

  // Handle close button
  const closeBtn = authModal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    authModal.classList.remove('active');
    setTimeout(() => authModal.remove(), 300);
  });

  // Close on outside click
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.classList.remove('active');
      setTimeout(() => authModal.remove(), 300);
    }
  });

  // Handle sign up toggle
  const signUpToggle = authModal.querySelector('.sign-up-toggle');
  signUpToggle.addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      showNotification('Account created! You can now sign in.');
    } catch (error) {
      showNotification(error.message);
    }
  });
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
      caseStudy: formData.get('caseStudy'),
      images: imageUrls,
      user_id: user.id
    };
    
    if (!projectData.title || !projectData.category || !projectData.description || 
        !projectData.caseStudy || !projectData.images.length) {
      throw new Error('Please fill in all required fields');
    }
    
    const savedProject = await addProject(projectData);
    
    if (savedProject) {
      closeUploadModal();
      showNotification('Project added successfully!');
      window.location.reload();
    }
  } catch (error) {
    console.error('Error saving project:', error);
    showNotification(error.message || 'Error saving project. Please try again.');
  } finally {
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