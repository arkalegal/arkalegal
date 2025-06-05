import { supabase } from './supabase.js';
import { editProject } from './upload.js';

// Initialize the gallery
export async function initGallery() {
  const projectsGrid = document.querySelector('.projects-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Load projects from Supabase
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading projects:', error);
    return;
  }
  
  // Render all projects initially
  renderProjects(projects);
  
  // Add filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', async () => {
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

  // Add secret code detection for admin features
  let buffer = '';
  let timeout;

  document.addEventListener('keydown', (e) => {
    buffer += e.key;
    
    if (buffer.length > 10) {
      buffer = buffer.slice(-10);
    }
    
    if (buffer.includes('AB7215')) {
      buffer = '';
      
      const projectActions = document.querySelectorAll('.project-actions');
      projectActions.forEach(actions => {
        const editButton = actions.querySelector('.edit-project');
        const deleteButton = actions.querySelector('.delete-project');
        
        editButton.style.display = 'block';
        deleteButton.style.display = 'block';
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          editButton.style.display = 'none';
          deleteButton.style.display = 'none';
        }, 10000);
      });
    }
  });

  // Listen for project saved event
  document.addEventListener('projectSaved', () => {
    initGallery();
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
        <div class="project-actions" style="display: flex; gap: 8px;">
          <button class="edit-project" style="display: none;">Edit</button>
          <button class="delete-project" style="display: none; background-color: #ff4444;">Delete</button>
        </div>
      </div>
    `;
    
    // Add edit button click handler
    const editButton = projectCard.querySelector('.edit-project');
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      editProject(project.id);
    });

    // Add delete button click handler
    const deleteButton = projectCard.querySelector('.delete-project');
    deleteButton.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        await deleteProject(project.id);
      }
    });
    
    // Add delay for staggered animation
    setTimeout(() => {
      projectCard.classList.add('visible');
    }, index * 100);
    
    // Add click event
    projectCard.addEventListener('click', (e) => {
      if (!e.target.classList.contains('edit-project') && !e.target.classList.contains('delete-project')) {
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
        <p>${project.case_study}</p>
      </div>
    </div>
  `;
  
  projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Function to delete a project
async function deleteProject(projectId) {
  try {
    // Get project images first
    const { data: project } = await supabase
      .from('projects')
      .select('images')
      .eq('id', projectId)
      .single();

    // Delete images from storage
    for (const imageUrl of project.images) {
      await deleteImage(imageUrl);
    }

    // Delete project from database
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;

    // Re-fetch and render projects
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    renderProjects(activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter));

    showNotification('Project deleted successfully!');
  } catch (error) {
    console.error('Error deleting project:', error);
    showNotification('Error deleting project. Please try again.');
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