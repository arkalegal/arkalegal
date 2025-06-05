// Gallery JavaScript
import { editProject } from './upload.js';

// Initialize the gallery
export function initGallery() {
  const projectsGrid = document.querySelector('.projects-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Load projects from local storage
  const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
  
  // Render all projects initially
  renderProjects(projects);
  
  // Add filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active class
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      // Filter projects
      if (filter === 'all') {
        renderProjects(projects);
      } else {
        const filteredProjects = projects.filter(project => project.category === filter);
        renderProjects(filteredProjects);
      }
    });
  });
}

// Add new project
export function addProject(projectData) {
  // Get existing projects
  const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
  
  // Create new project with unique ID
  const newProject = {
    ...projectData,
    id: crypto.randomUUID()
  };
  
  // Add to projects array
  projects.push(newProject);
  
  // Save to localStorage
  localStorage.setItem('portfolioProjects', JSON.stringify(projects));
  
  // Re-render the gallery
  renderProjects(projects);
  
  return newProject;
}

// Render projects to the grid
function renderProjects(projectsToRender) {
  const projectsGrid = document.querySelector('.projects-grid');
  
  // Clear grid
  projectsGrid.innerHTML = '';
  
  // Add projects
  projectsToRender.forEach((project, index) => {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
    projectCard.setAttribute('data-id', project.id);
    projectCard.setAttribute('data-category', project.category);
    
    projectCard.innerHTML = `
      <img src="${project.images[0]}" alt="${project.title}" class="project-image">
      <div class="project-overlay">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-category">${project.category}</p>
        <input type="text" class="secret-input" placeholder="Project description..." style="width: 100%; margin-bottom: 10px; padding: 5px;">
        <button class="edit-project" style="display: none;">Edit</button>
      </div>
    `;
    
    // Add secret code check
    const secretInput = projectCard.querySelector('.secret-input');
    const editButton = projectCard.querySelector('.edit-project');
    
    secretInput.addEventListener('input', (e) => {
      if (e.target.value.includes('AB5694')) {
        editButton.style.display = 'block';
        // Remove the code from input
        e.target.value = e.target.value.replace('AB5694', '');
      }
    });
    
    // Add edit button click handler
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      showSecurityDialog(project.id);
    });
    
    // Add click event for project details
    projectCard.addEventListener('click', (e) => {
      if (!e.target.classList.contains('edit-project') && !e.target.classList.contains('secret-input')) {
        showProjectDetails(project);
      }
    });
    
    // Add delay for staggered animation
    setTimeout(() => {
      projectCard.classList.add('visible');
    }, index * 100);
    
    projectsGrid.appendChild(projectCard);
  });
  
  // Add animated class to trigger staggered animation
  setTimeout(() => {
    projectsGrid.classList.add('animated');
  }, 100);
}

// Show security dialog
function showSecurityDialog(projectId) {
  // Create security dialog
  const dialog = document.createElement('div');
  dialog.classList.add('security-dialog');
  
  dialog.innerHTML = `
    <div class="security-dialog-content">
      <h3>Security Check</h3>
      <p>Please enter the security code to edit:</p>
      <input type="password" id="security-code" class="security-input">
      <div class="security-buttons">
        <button class="btn cancel-btn">Cancel</button>
        <button class="btn confirm-btn">Confirm</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // Show dialog with animation
  requestAnimationFrame(() => {
    dialog.classList.add('active');
    dialog.querySelector('#security-code').focus();
  });
  
  // Handle input submission
  const handleSubmit = () => {
    const code = dialog.querySelector('#security-code').value;
    if (code === '589426') {
      dialog.remove();
      editProject(projectId);
    } else {
      alert('Invalid security code');
    }
  };
  
  // Add event listeners
  dialog.querySelector('.confirm-btn').addEventListener('click', handleSubmit);
  dialog.querySelector('.cancel-btn').addEventListener('click', () => dialog.remove());
  dialog.querySelector('#security-code').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });
  
  // Close when clicking outside
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.remove();
  });
}

// Show project details in modal
function showProjectDetails(project) {
  const projectModal = document.getElementById('project-modal');
  const projectDetails = document.querySelector('.project-details');
  
  projectDetails.innerHTML = `
    <div class="project-details-header">
      <h2 class="project-details-title">${project.title}</h2>
      <p class="project-details-category">${project.category}</p>
    </div>
    
    <div class="project-details-gallery">
      ${project.images.map(image => `
        <img src="${image}" alt="${project.title}">
      `).join('')}
    </div>
    
    <div class="project-details-info">
      <div class="project-details-description">
        <h3>Project Overview</h3>
        <p>${project.description}</p>
      </div>
      
      <div class="project-details-case-study">
        <h3>Case Study</h3>
        <p>${project.caseStudy}</p>
      </div>
    </div>
  `;
  
  projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}