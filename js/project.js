// Project details modal functionality

export function initProjectModal() {
  const projectModal = document.getElementById('project-modal');
  const closeModalBtn = projectModal.querySelector('.close-modal');
  
  // Close modal when clicking the close button
  closeModalBtn.addEventListener('click', () => {
    closeProjectModal();
  });
  
  // Close modal when clicking outside content
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });
  
  // Close modal with escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

// Function to close the project modal
export function closeProjectModal() {
  const projectModal = document.getElementById('project-modal');
  projectModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Function to handle project image navigation
export function setupImageGallery(projectImages) {
  if (!projectImages || projectImages.length <= 1) return;
  
  const galleryContainer = document.querySelector('.project-details-gallery');
  
  if (!galleryContainer) return;
  
  // Add navigation controls
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('gallery-nav', 'prev');
  prevBtn.innerHTML = '&larr;';
  
  const nextBtn = document.createElement('button');
  nextBtn.classList.add('gallery-nav', 'next');
  nextBtn.innerHTML = '&rarr;';
  
  galleryContainer.appendChild(prevBtn);
  galleryContainer.appendChild(nextBtn);
  
  // Set up image navigation
  let currentImageIndex = 0;
  
  prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
    updateActiveImage();
  });
  
  nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % projectImages.length;
    updateActiveImage();
  });
  
  // Function to update the active image
  function updateActiveImage() {
    const images = galleryContainer.querySelectorAll('img');
    
    images.forEach((img, index) => {
      if (index === currentImageIndex) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });
  }
  
  // Initialize
  updateActiveImage();
}