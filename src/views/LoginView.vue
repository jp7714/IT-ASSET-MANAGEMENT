<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password';
    return;
  }
  // Mock login
  router.push('/dashboard');
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="app-title">AssetManager</h1>
      <p class="subtitle">Sign in to your account</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="admin@example.com"
            class="input-field"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••"
            class="input-field"
          />
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <button type="submit" class="btn-primary">Sign In</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-background);
}

.login-card {
  background-color: var(--color-surface);
  padding: 2.5rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
}

.app-title {
  color: var(--color-primary);
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  color: var(--color-text-main);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text-main);
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
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
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.error-message {
  color: var(--color-danger);
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
