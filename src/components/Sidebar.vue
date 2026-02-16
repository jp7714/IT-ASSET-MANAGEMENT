<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { 
  LayoutDashboard, 
  Box, 
  Tags, 
  ClipboardList, 
  LogOut 
} from 'lucide-vue-next';

const route = useRoute();

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Assets', path: '/assets', icon: Box },
  { name: 'Categories', path: '/categories', icon: Tags },
  { name: 'Assignments', path: '/assignments', icon: ClipboardList },
];
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <Box class="logo-icon" />
        <span class="logo-text">AssetManager</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <li v-for="link in links" :key="link.path">
          <RouterLink :to="link.path" class="nav-link" :class="{ active: route.path.startsWith(link.path) }">
            <component :is="link.icon" class="nav-icon" />
            <span class="nav-text">{{ link.name }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <RouterLink to="/login" class="nav-link logout-link">
        <LogOut class="nav-icon" />
        <span class="nav-text">Logout</span>
      </RouterLink>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  transition: transform 0.3s ease;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-primary);
}

.logo-icon {
  width: 24px;
  height: 24px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-main);
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-text-muted);
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--color-primary);
}

.nav-link.router-link-active,
.nav-link.active {
  background-color: var(--color-primary);
  color: white;
}

.nav-link.router-link-active:hover,
.nav-link.active:hover {
  background-color: var(--color-primary-hover);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.logout-link {
  color: var(--color-danger);
}

.logout-link:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
