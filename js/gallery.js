// Gallery JavaScript

// Sample projects data (in a real application, this would come from a database)
const projects = [
  {
    id: 1,
    title: 'Eco Brand Identity',
    category: 'branding',
    description: 'Complete brand identity design for an eco-friendly product line.',
    caseStudy: 'The concept for this eco-friendly brand identity was inspired by natural patterns found in leaf structures. I wanted to create something that felt organic yet modern, using a color palette derived from natural elements. The challenge was to balance the environmental aspects with a premium market position. Research into sustainable packaging solutions led to innovative material choices that became a key part of the visual identity.',
    images: [
      'https://images.pexels.com/photos/4035587/pexels-photo-4035587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5709664/pexels-photo-5709664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 2,
    title: 'Fashion Magazine Layout',
    category: 'print',
    description: 'Editorial design for a high-end fashion magazine.',
    caseStudy: 'This editorial project presented the unique challenge of balancing striking imagery with readable text. I drew inspiration from classic fashion magazines like Vogue while incorporating more contemporary layout techniques. The typography selection process involved testing various pairings to find the perfect combination that conveyed luxury while maintaining readability. One key innovation was the development of a modular grid system that could adapt to different content types while maintaining visual cohesion throughout the publication.',
    images: [
      'https://images.pexels.com/photos/5709667/pexels-photo-5709667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 3,
    title: 'Mobile App Interface',
    category: 'digital',
    description: 'UI/UX design for a financial planning application.',
    caseStudy: 'This financial app interface was born from extensive user research that revealed significant pain points in existing solutions. The design process began with wireframing numerous user flows to optimize the journey. I was particularly inspired by minimalist dashboard designs that present complex information clearly. The color psychology behind the interface was carefully considered - using blue tones to convey trust and security while introducing accent colors to highlight actions. User testing revealed interesting insights about how people interact with financial data, leading to several iterations that progressively simplified the experience.',
    images: [
      'https://images.pexels.com/photos/93599/pexels-photo-93599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/907489/pexels-photo-907489.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 4,
    title: 'Character Design Series',
    category: 'illustration',
    description: 'Series of illustrated characters for a children\'s book.',
    caseStudy: 'This character design project was a creative journey that began with dozens of rough sketches exploring different personalities and visual styles. I found inspiration in classic children\'s book illustrations from the 1960s, but wanted to bring a contemporary sensibility to the characters. The breakthrough moment came when I decided to focus on exaggerated facial expressions and posture to convey emotion rather than relying on complex details. Creating a consistent world for these characters to inhabit was essential, so I developed a complete visual language including environmental elements that complemented the character designs.',
    images: [
      'https://images.pexels.com/photos/6956903/pexels-photo-6956903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5708064/pexels-photo-5708064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 5,
    title: 'Luxury Product Packaging',
    category: 'branding',
    description: 'Premium packaging design for a luxury skincare line.',
    caseStudy: 'This luxury packaging project began with extensive research into premium materials and production techniques. The conceptual breakthrough came when I discovered a method to incorporate sustainable materials without compromising the luxury feel. The design drew inspiration from Art Deco patterns, reimagined with a modern sensibility. The most challenging aspect was creating a cohesive system that worked across various product sizes while maintaining the premium aesthetic. The embossing technique used was custom-developed with the manufacturer to achieve a specific tactile quality that became central to the brand experience.',
    images: [
      'https://images.pexels.com/photos/5706273/pexels-photo-5706273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5433990/pexels-photo-5433990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 6,
    title: 'Event Poster Series',
    category: 'print',
    description: 'Collection of promotional posters for a music festival.',
    caseStudy: 'This poster series presented the creative challenge of establishing a visual system that could be varied for different events while maintaining recognizability. I drew inspiration from vintage concert posters but wanted to introduce contemporary typography and composition techniques. The breakthrough came when experimenting with duotone color treatments - creating a signature look that could be easily adapted to different themes. Each poster was designed to work both as a standalone piece and as part of the collection, requiring careful consideration of how visual elements carried across the series. The typography system was particularly challenging to develop, needing to accommodate varying lengths of information while maintaining visual hierarchy.',
    images: [
      'https://images.pexels.com/photos/7245308/pexels-photo-7245308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6744288/pexels-photo-6744288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  }
];

// Initialize the gallery
export function initGallery() {
  const projectsGrid = document.querySelector('.projects-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
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
      </div>
    `;
    
    // Add delay for staggered animation
    setTimeout(() => {
      projectCard.classList.add('visible');
    }, index * 100);
    
    // Add click event
    projectCard.addEventListener('click', () => {
      showProjectDetails(project);
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

// Function to add a new project (will be used by the upload form)
export function addProject(project) {
  // Generate a new ID
  const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
  
  // Create new project object
  const newProject = {
    id: newId,
    ...project
  };
  
  // Add to projects array
  projects.unshift(newProject);
  
  // Re-render the gallery
  const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
  
  if (activeFilter === 'all' || activeFilter === newProject.category) {
    renderProjects(activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter));
  }
  
  return newProject;
}