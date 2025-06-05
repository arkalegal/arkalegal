import { supabase } from './supabase';

export function initGallery() {
  loadProjects();
  initProjectModal();
}

async function loadProjects() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';

    projects.forEach(project => {
      const card = createProjectCard(project);
      projectsGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    showNotification('Error loading projects');
  }
}

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `
    <img src="${project.images[0]}" alt="${project.title}">
    <div class="overlay">
      <h3 class="project-title">${project.title}</h3>
      <p class="project-category">${project.category}</p>
    </div>
  `;

  card.addEventListener('click', () => showProjectDetails(project));
  return card;
}

function showProjectDetails(project) {
  const modal = document.getElementById('project-modal');
  const details = document.getElementById('project-details');

  details.innerHTML = `
    <h2 class="text-3xl font-bold mb-4">${project.title}</h2>
    <p class="text-zinc-400 mb-8">${project.description}</p>
    <div class="grid grid-cols-2 gap-4">
      ${project.images.map(image => `
        <img src="${image}" alt="${project.title}" class="rounded-lg">
      `).join('')}
    </div>
  `;

  modal.classList.remove('hidden');

  const closeBtn = document.getElementById('close-project');
  closeBtn.onclick = () => modal.classList.add('hidden');
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