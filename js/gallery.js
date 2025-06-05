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

  // Add secret code detection
  let buffer = '';
  let timeout;

  document.addEventListener('keydown', (e) => {
    buffer += e.key;
    
    // Remove old characters if buffer gets too long
    if (buffer.length > 10) {
      buffer = buffer.slice(-10);
    }
    
    // Check if buffer contains secret code
    if (buffer.includes('AB7215')) {
      // Clear buffer
      buffer = '';
      
      // Show edit buttons
      const editButtons = document.querySelectorAll('.edit-project');
      editButtons.forEach(btn => {
        btn.style.display = 'block';
        
        // Hide after 10 seconds
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          btn.style.display = 'none';
        }, 10000);
      });
    }
  });
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
        <button class="edit-project" style="display: none;">Edit</button>
      </div>
    `;
    
    // Add edit button click handler
    const editButton = projectCard.querySelector('.edit-project');
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      editProject(project.id);
    });
    
    // Add delay for staggered animation
    setTimeout(() => {
      projectCard.classList.add('visible');
    }, index * 100);
    
    // Add click event
    projectCard.addEventListener('click', (e) => {
      if (!e.target.classList.contains('edit-project')) {
        showProjectDetails(project);
      }
    });
    
    projectsGrid.appendChild(projectCard);
  });
  
  // Add animated class to trigger staggered animation
  setTimeout(() => {
    projectsGrid.classList.add('animated');
  }, 100);
}

// Show project details in modal
function showProjectDetails(project) {
  const projectModal = document.getElementById('project-modal');
  const projectDetails = document.querySelector('.project-details');
  
  // Build project details HTML
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
  
  // Show modal
  projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Function to add a new project
export function addProject(project) {
  // Get existing projects
  const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
  
  if (project.id) {
    // If project has an ID, it's an edit - replace the old project
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      projects[index] = project;
    }
  } else {
    // Generate a new ID for new projects
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    project.id = newId;
    projects.unshift(project);
  }
  
  // Save updated projects array
  localStorage.setItem('portfolioProjects', JSON.stringify(projects));
  
  // Re-render the gallery
  const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
  
  if (activeFilter === 'all' || activeFilter === project.category) {
    renderProjects(activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter));
  }
  
  return project;
}