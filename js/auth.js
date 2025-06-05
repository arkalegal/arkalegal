import { supabase } from './supabase.js';

export function initAuth() {
  const authButton = document.createElement('button');
  authButton.classList.add('auth-btn');
  
  // Add auth button to nav
  const nav = document.querySelector('.nav-links');
  nav.appendChild(authButton);
  
  updateAuthButtonState();
  
  // Handle auth button clicks
  authButton.addEventListener('click', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.auth.signOut();
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: prompt('Enter your email:'),
        password: prompt('Enter your password:')
      });
      
      if (error) {
        showNotification(error.message);
      }
    }
    
    updateAuthButtonState();
  });
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    updateAuthButtonState();
  });
}

async function updateAuthButtonState() {
  const authButton = document.querySelector('.auth-btn');
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    authButton.textContent = 'Sign Out';
    authButton.classList.add('signed-in');
  } else {
    authButton.textContent = 'Sign In';
    authButton.classList.remove('signed-in');
  }
}