import { supabase } from './supabase.js';

export function initAuth() {
  const authButton = document.getElementById('auth-button');
  const authModal = document.getElementById('auth-modal');
  const authForm = document.getElementById('auth-form');
  const toggleBtn = document.querySelector('.toggle-btn');
  const closeBtn = authModal.querySelector('.close-modal');
  
  let isSignUp = false;

  // Check initial auth state
  checkAuthState();

  authButton.addEventListener('click', () => {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  toggleBtn.addEventListener('click', () => {
    isSignUp = !isSignUp;
    updateFormUI();
  });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = authForm.email.value;
    const password = authForm.password.value;
    
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        showNotification('Account created successfully! You can now sign in.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        showNotification('Signed in successfully!');
      }
      
      authModal.classList.remove('active');
      document.body.style.overflow = '';
      checkAuthState();
    } catch (error) {
      showNotification(error.message);
    }
  });

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    checkAuthState();
  });
}

function updateFormUI() {
  const form = document.getElementById('auth-form');
  const submitBtn = form.querySelector('button[type="submit"]');
  const toggleBtn = form.querySelector('.toggle-btn');
  const title = document.querySelector('#auth-modal h2');
  
  if (isSignUp) {
    title.textContent = 'Sign Up';
    submitBtn.textContent = 'Sign Up';
    toggleBtn.textContent = 'Sign In';
    toggleBtn.previousSibling.textContent = 'Already have an account? ';
  } else {
    title.textContent = 'Sign In';
    submitBtn.textContent = 'Sign In';
    toggleBtn.textContent = 'Sign Up';
    toggleBtn.previousSibling.textContent = "Don't have an account? ";
  }
}

async function checkAuthState() {
  const { data: { user } } = await supabase.auth.getUser();
  const authButton = document.getElementById('auth-button');
  const uploadBtn = document.getElementById('upload-btn');
  
  if (user) {
    authButton.textContent = 'Sign Out';
    authButton.onclick = async () => {
      await supabase.auth.signOut();
      showNotification('Signed out successfully!');
    };
    uploadBtn.style.display = 'block';
  } else {
    authButton.textContent = 'Sign In';
    authButton.onclick = () => {
      document.getElementById('auth-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    uploadBtn.style.display = 'none';
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