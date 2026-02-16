<script setup>
import { User } from 'lucide-vue-next';

defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  }
});
</script>

<template>
  <header class="navbar">
    <div class="navbar-left">
      <h2 class="page-title">{{ title }}</h2>
    </div>
    
    <div class="navbar-right">
      <div class="user-profile">
        <div class="avatar">
          <User class="avatar-icon" />
        </div>
        <span class="user-name">Admin User</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  height: 64px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 40;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.navbar-right {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: var(--color-background);
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.avatar-icon {
  width: 18px;
  height: 18px;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-main);
}
</style>
