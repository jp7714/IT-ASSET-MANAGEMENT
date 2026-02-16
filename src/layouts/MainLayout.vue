<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';

const route = useRoute();

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
    <Sidebar />
    
    <div class="main-content-wrapper">
      <Navbar :title="pageTitle" />
      
      <main class="page-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
}

.main-content-wrapper {
  flex: 1;
  margin-left: 260px; /* Match sidebar width */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1;
  padding: 2rem;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .main-content-wrapper {
    margin-left: 0;
  }
}
</style>
