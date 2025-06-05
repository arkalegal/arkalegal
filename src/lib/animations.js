import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  // Initialize text animations
  const texts = document.querySelectorAll('.reveal-text');
  texts.forEach(text => {
    const split = new SplitType(text, { types: 'words' });
    
    gsap.from(split.words, {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.1,
      scrollTrigger: {
        trigger: text,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Project cards animation
  const projectCards = gsap.utils.toArray('.project-card');
  projectCards.forEach(card => {
    gsap.from(card, {
      opacity: 0,
      y: 30,
      duration: 1,
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // About section animation
  gsap.from('#about img', {
    opacity: 0,
    x: 50,
    duration: 1,
    scrollTrigger: {
      trigger: '#about',
      start: 'top 70%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    }
  });

  // Contact form animation
  gsap.from('#contact form', {
    opacity: 0,
    y: 30,
    duration: 1,
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    }
  });
}