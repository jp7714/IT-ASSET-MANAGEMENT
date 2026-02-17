<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  error.value = '';
  
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password';
    return;
  }

  isLoading.value = true;
  
  // Simulate network delay for "professional" feel
  await new Promise(resolve => setTimeout(resolve, 800));
  
  isLoading.value = false;
  router.push('/dashboard');
};
</script>

<template>
  <div class="login-container">
    <div class="login-bg-pattern"></div>
    
    <div class="login-card">
      <div class="brand-header">
        <div class="logo-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logo-icon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </div>
        <h1 class="app-title">AssetManager</h1>
        <p class="subtitle">Welcome back! Please enter your details.</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
             <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="admin@company.com"
              class="input-field"
              :class="{ 'has-error': error && !email }"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="••••••••"
              class="input-field"
              :class="{ 'has-error': error && !password }"
            />
          </div>
        </div>

        <div class="form-actions">
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>

        <p v-if="error" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {{ error }}
        </p>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="card-footer">
        <p>Don't have an account? <a href="#">Contact Admin</a></p>
      </div>
    </div>
    
    <div class="footer-links">
      <a href="#">Privacy Policy</a>
      <span class="divider">•</span>
      <a href="#">Terms of Service</a>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-background);
  position: relative;
  overflow: hidden;
  padding: 1rem;
}

/* Subtle background gradient/glow */
.login-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.15) 0%, transparent 50%);
  z-index: 0;
}

.login-card {
  position: relative;
  z-index: 1;
  background-color: rgba(30, 41, 59, 0.7); /* Translucent Slate 800 */
  backdrop-filter: blur(12px);
  padding: 2.5rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1), 
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.05); /* Thin border */
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.brand-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-circle {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  color: white;
}

.app-title {
  color: var(--color-text-main);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  color: var(--color-text-main);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(15, 23, 42, 0.6); /* Darker input bg */
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text-main);
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  background-color: rgba(15, 23, 42, 0.8);
}

.input-field.has-error {
  border-color: var(--color-danger);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.forgot-password {
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 500;
}

.forgot-password:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 46px; /* Fixed height to prevent layout shift with spinner */
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: var(--color-danger);
  font-size: 0.875rem;
  background-color: rgba(239, 68, 68, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.footer-links {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
}

.footer-links a {
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--color-text-main);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .login-card {
    padding: 1.5rem;
  }
  
  .app-title {
    font-size: 1.25rem;
  }
}
</style>
