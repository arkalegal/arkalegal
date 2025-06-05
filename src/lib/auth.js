import { supabase } from './supabase';

export function initAuth() {
  const authModal = document.getElementById('auth-modal');
  const authForm = document.getElementById('auth-form');
  const toggleAuthBtn = document.getElementById('toggle-auth');
  const authBtns = document.querySelectorAll('#auth-btn, #mobile-auth-btn');
  const closeAuthBtn = document.getElementById('close-auth');

  let isSignUp = false;

  authBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        if (confirm('Are you sure you want to sign out?')) {
          await supabase.auth.signOut();
          showNotification('Signed out successfully');
        }
      } else {
        authModal.classList.remove('hidden');
      }
    });
  });

  closeAuthBtn.addEventListener('click', () => {
    authModal.classList.add('hidden');
  });

  toggleAuthBtn.addEventListener('click', () => {
    isSignUp = !isSignUp;
    toggleAuthBtn.textContent = isSignUp ? 'Sign In Instead' : 'Create Account';
    authForm.querySelector('h3').textContent = isSignUp ? 'Create Account' : 'Sign In';
    authForm.querySelector('button[type="submit"]').textContent = isSignUp ? 'Sign Up' : 'Sign In';
  });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

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
      authModal.classList.add('hidden');
      authForm.reset();
    } catch (error) {
      showNotification(error.message);
    }
  });
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