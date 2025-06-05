import { supabase } from './supabase.js';

// Show/hide auth forms
export function toggleAuthForms(show) {
  const authModal = document.getElementById('auth-modal');
  if (show) {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Handle sign in
async function handleSignIn(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    toggleAuthForms(false);
    showNotification('Signed in successfully!');
    window.location.reload();
  } catch (error) {
    showNotification(error.message);
  }
}

// Handle sign up
async function handleSignUp(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    
    toggleAuthForms(false);
    showNotification('Account created successfully! You can now sign in.');
  } catch (error) {
    showNotification(error.message);
  }
}

// Show notification
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

export function initAuth() {
  // Create the auth modal if it doesn't exist
  if (!document.getElementById('auth-modal')) {
    const authModal = document.createElement('div');
    authModal.id = 'auth-modal';
    authModal.className = 'auth-modal';
    
    authModal.innerHTML = `
      <div class="modal-content auth-modal-content">
        <button class="close-modal">&times;</button>
        <h2 class="auth-title">Sign In / Sign Up</h2>
        <form id="auth-form" class="auth-form">
          <div class="form-group">
            <label for="auth-email">Email</label>
            <input type="email" id="auth-email" required>
          </div>
          <div class="form-group">
            <label for="auth-password">Password</label>
            <input type="password" id="auth-password" required>
          </div>
          <div class="auth-buttons">
            <button type="button" id="sign-in-btn" class="btn">Sign In</button>
            <button type="button" id="sign-up-btn" class="btn">Sign Up</button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(authModal);
    
    // Add event listeners
    const closeBtn = authModal.querySelector('.close-modal');
    const signInBtn = document.getElementById('sign-in-btn');
    const signUpBtn = document.getElementById('sign-up-btn');
    
    closeBtn.addEventListener('click', () => toggleAuthForms(false));
    signInBtn.addEventListener('click', handleSignIn);
    signUpBtn.addEventListener('click', handleSignUp);
    
    // Close on outside click
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        toggleAuthForms(false);
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && authModal.classList.contains('active')) {
        toggleAuthForms(false);
      }
    });
  }
  
  return {
    showNotification
  };
}