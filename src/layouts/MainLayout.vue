<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';

const route = useRoute();
const isSidebarOpen = ref(true);
const isMobileOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleMobileSidebar = () => {
  isMobileOpen.value = !isMobileOpen.value;
};

const closeMobileSidebar = () => {
  isMobileOpen.value = false;
};

// Mapping route names to page titles
const pageTitle = computed(() => {
  const titles = {
    'dashboard': 'Dashboard',
    'assets': 'Asset Management',
    'categories': 'Categories',
    'assignments': 'Assignments'
  };
  return titles[route.name] || 'Asset Manager';
});
</script>

<template>
  <div class="main-layout">
    <Sidebar 
      :is-collapsed="!isSidebarOpen" 
      :is-mobile-open="isMobileOpen"
      @close-mobile="closeMobileSidebar"
    />
    
    <div 
      class="main-content-wrapper" 
      :class="{ 'collapsed': !isSidebarOpen }"
    >
      <Navbar 
        :title="pageTitle" 
        @toggle-sidebar="toggleSidebar"
        @toggle-mobile="toggleMobileSidebar"
      />
      
      <main class="page-content">
        <RouterView />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div 
      v-if="isMobileOpen" 
      class="mobile-overlay"
      @click="closeMobileSidebar"
    ></div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
  position: relative;
}

.main-content-wrapper {
  flex: 1;
  margin-left: 260px; /* Default sidebar width */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.main-content-wrapper.collapsed {
  margin-left: 80px; /* Collapsed sidebar width */
}

.page-content {
  flex: 1;
  padding: 2rem;
  overflow-x: hidden;
  width: 100%;
}

.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 45;
}

@media (max-width: 768px) {
  .main-content-wrapper {
    margin-left: 0 !important;
  }
  
  .mobile-overlay {
    display: block;
  }
}
</style>
