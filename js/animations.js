// Animations and scroll effects

export function initAnimations() {
  // Elements to animate on scroll
  const sections = document.querySelectorAll('.section');
  const projectCards = document.querySelectorAll('.project-card');
  
  // Initialize Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Observe sections
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Add page transition effect
  setupPageTransitions();
  
  // Add parallax effect to hero section
  setupParallaxEffect();
  
  // Add scroll animations
  window.addEventListener('scroll', debounce(handleScrollAnimations, 10));
  
  // Initialize first animations
  setTimeout(() => {
    handleScrollAnimations();
  }, 100);
}

// Set up page transitions
function setupPageTransitions() {
  const transitionElement = document.createElement('div');
  transitionElement.classList.add('page-transition');
  document.body.appendChild(transitionElement);
  
  // Links that trigger page transitions
  const transitionLinks = document.querySelectorAll('a[href^="http"], a[href^="/"]');
  
  transitionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Skip if it's an internal anchor link
      if (link.getAttribute('href').startsWith('#')) return;
      
      // Skip if ctrl or cmd is pressed (opening in new tab)
      if (e.ctrlKey || e.metaKey) return;
      
      e.preventDefault();
      
      const href = link.getAttribute('href');
      
      // Activate transition
      transitionElement.classList.add('active');
      
      // Navigate after animation completes
      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });
}

// Set up parallax effect for hero section
function setupParallaxEffect() {
  const hero = document.querySelector('.hero');
  
  if (!hero) return;
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    if (scrollPosition <= window.innerHeight) {
      const translateY = scrollPosition * 0.3;
      hero.style.transform = `translateY(${translateY}px)`;
      hero.style.opacity = 1 - (scrollPosition / (window.innerHeight * 0.6));
    }
  });
}

// Handle scroll animations
function handleScrollAnimations() {
  const scrollPosition = window.scrollY + window.innerHeight * 0.8;
  
  // Animate sections
  document.querySelectorAll('.section').forEach(section => {
    if (section.offsetTop < scrollPosition) {
      section.classList.add('visible');
    }
  });
  
  // Animate project cards with staggered delay
  document.querySelectorAll('.project-card').forEach((card, index) => {
    if (card.offsetTop < scrollPosition) {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 100);
    }
  });
}

// Debounce function to limit function calls
function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}