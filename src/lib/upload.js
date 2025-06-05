import { supabase, uploadImage } from './supabase';

export function initUpload() {
  const uploadBtn = document.getElementById('upload-btn');
  const uploadModal = document.getElementById('upload-modal');
  const closeUploadBtn = document.getElementById('close-upload');
  const uploadForm = document.getElementById('upload-form');
  const imageInput = document.getElementById('project-images');
  const imagePreview = document.getElementById('image-preview');

  uploadBtn.addEventListener('click', () => {
    uploadModal.classList.remove('hidden');
  });

  closeUploadBtn.addEventListener('click', () => {
    uploadModal.classList.add('hidden');
    uploadForm.reset();
    imagePreview.innerHTML = '';
  });

  imageInput.addEventListener('change', handleImagePreview);
  uploadForm.addEventListener('submit', handleProjectSubmit);

  // Handle drag and drop
  const dropZone = uploadForm.querySelector('.border-dashed');
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
  });

  function highlight(e) {
    dropZone.classList.add('border-zinc-500');
  }

  function unhighlight(e) {
    dropZone.classList.remove('border-zinc-500');
  }

  dropZone.addEventListener('drop', handleDrop, false);
}

function handleImagePreview(e) {
  const files = Array.from(e.target.files);
  displayImagePreviews(files);
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = Array.from(dt.files);
  
  document.getElementById('project-images').files = dt.files;
  displayImagePreviews(files);
}

function displayImagePreviews(files) {
  const imagePreview = document.getElementById('image-preview');
  imagePreview.innerHTML = '';

  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = e => {
      const preview = document.createElement('div');
      preview.className = 'relative aspect-square';
      preview.innerHTML = `
        <img src="${e.target.result}" alt="Preview" class="w-full h-full object-cover rounded-lg">
        <button type="button" class="absolute top-2 right-2 bg-black bg-opacity-50 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-opacity-75">&times;</button>
      `;

      preview.querySelector('button').onclick = () => {
        preview.remove();
        updateFileList();
      };

      imagePreview.appendChild(preview);
    };
    reader.readAsDataURL(file);
  });
}

function updateFileList() {
  const fileInput = document.getElementById('project-images');
  const previews = document.querySelectorAll('#image-preview img');
  const dt = new DataTransfer();

  previews.forEach((preview, index) => {
    if (fileInput.files[index]) {
      dt.items.add(fileInput.files[index]);
    }
  });

  fileInput.files = dt.files;
}

async function handleProjectSubmit(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Uploading...';
  submitBtn.disabled = true;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Please sign in to upload projects');

    const formData = new FormData(e.target);
    const files = Array.from(e.target.querySelector('#project-images').files);

    // Upload images
    const imageUrls = await Promise.all(files.map(file => uploadImage(file)));

    const projectData = {
      title: formData.get('project-title'),
      description: formData.get('project-description'),
      category: formData.get('project-category'),
      images: imageUrls,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;

    showNotification('Project uploaded successfully!');
    e.target.reset();
    document.getElementById('image-preview').innerHTML = '';
    document.getElementById('upload-modal').classList.add('hidden');

    // Refresh the gallery
    const event = new CustomEvent('projectsUpdated');
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Error uploading project:', error);
    showNotification(error.message);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-zinc-800 text-zinc-200 px-6 py-3 rounded-lg shadow-lg transform translate-y-full opacity-0 transition-all duration-300';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  requestAnimationFrame(() => {
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
  });

  setTimeout(() => {
    notification.style.transform = 'translateY(full)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}