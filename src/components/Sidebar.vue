<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { 
  LayoutDashboard, 
  Box, 
  Tags, 
  ClipboardList, 
  LogOut,
  ChevronLeft
} from 'lucide-vue-next';

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  },
  isMobileOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close-mobile']);

const route = useRoute();

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Assets', path: '/assets', icon: Box },
  { name: 'Categories', path: '/categories', icon: Tags },
  { name: 'Assignments', path: '/assignments', icon: ClipboardList },
];
</script>

<template>
  <aside 
    class="sidebar" 
    :class="{ 'collapsed': isCollapsed, 'mobile-open': isMobileOpen }"
  >
    <div class="sidebar-header">
      <div class="logo">
        <Box class="logo-icon" />
        <span class="logo-text" v-if="!isCollapsed">AssetManager</span>
      </div>
      <button 
        v-if="isMobileOpen" 
        class="close-mobile-btn"
        @click="$emit('close-mobile')"
      >
        <ChevronLeft class="close-icon" />
      </button>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <li v-for="link in links" :key="link.path">
          <RouterLink 
            :to="link.path" 
            class="nav-link" 
            :class="{ active: route.path.startsWith(link.path) }"
            @click="$emit('close-mobile')"
          >
            <component :is="link.icon" class="nav-icon" :title="isCollapsed ? link.name : ''" />
            <span class="nav-text" v-if="!isCollapsed">{{ link.name }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <RouterLink to="/login" class="nav-link logout-link">
        <LogOut class="nav-icon" :title="isCollapsed ? 'Logout' : ''" />
        <span class="nav-text" v-if="!isCollapsed">Logout</span>
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
  transition: width 0.3s ease, transform 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
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
  min-width: 24px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-main);
  opacity: 1;
  transition: opacity 0.2s;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
  overflow-x: hidden;
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
  white-space: nowrap;
}

.sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 0.75rem;
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
  min-width: 20px;
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

.close-mobile-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    width: 260px !important;
    transform: translateX(-100%);
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .close-mobile-btn {
    display: block;
  }
}
</style>
