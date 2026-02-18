<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  User, 
  Menu, 
  LogOut, 
  Settings, 
  ChevronDown,
  PanelLeft
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    default: 'Dashboard'
  }
});

const emit = defineEmits(['toggle-sidebar', 'toggle-mobile']);

const router = useRouter();
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
};

const handleLogout = () => {
  // Add logout logic here (clear tokens, etc.)
  router.push('/login');
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<template>
  <header class="navbar">
    <div class="navbar-left">
      <button class="icon-btn mobile-toggle" @click="$emit('toggle-mobile')">
        <Menu class="icon" />
      </button>
      
      <button class="icon-btn desktop-toggle" @click="$emit('toggle-sidebar')">
        <PanelLeft class="icon" />
      </button>

      <h2 class="page-title">{{ title }}</h2>
    </div>
    
    <div class="navbar-right">
      <div 
        class="user-profile" 
        ref="dropdownRef"
        @click.stop="toggleDropdown"
      >
        <div class="avatar">
          <User class="avatar-icon" />
        </div>
        <div class="user-info">
          <span class="user-name">Admin User</span>
          <span class="user-role">Administrator</span>
        </div>
        <ChevronDown 
          class="chevron-icon" 
          :class="{ 'rotate': isDropdownOpen }" 
        />
        
        <!-- Dropdown Menu -->
        <div v-show="isDropdownOpen" class="dropdown-menu">
          <div class="dropdown-header">
            <span class="dropdown-name">Admin User</span>
            <span class="dropdown-email">admin@example.com</span>
          </div>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item">
            <User class="item-icon" />
            Profile
          </button>
          <button class="dropdown-item">
            <Settings class="item-icon" />
            Settings
          </button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item logout-item" @click="handleLogout">
            <LogOut class="item-icon" />
            Logout
          </button>
        </div>
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

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--color-primary);
}

.icon {
  width: 20px;
  height: 20px;
}

.mobile-toggle {
  display: none;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0;
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
  position: relative;
}

.user-profile:hover {
  background-color: var(--color-background);
}

.avatar {
  width: 36px;
  height: 36px;
  background-color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.avatar-icon {
  width: 20px;
  height: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.user-role {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.chevron-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
  transition: transform 0.2s;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

/* Dropdown Styles */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  width: 220px;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 0.5rem 0;
  z-index: 50;
  transform-origin: top right;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dropdown-header {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
}

.dropdown-name {
  font-weight: 600;
  color: var(--color-text-main);
  font-size: 0.875rem;
}

.dropdown-email {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0.5rem 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-text-main);
  font-size: 0.875rem;
  transition: background-color 0.2s;
  text-align: left;
}

.dropdown-item:hover {
  background-color: var(--color-background);
  color: var(--color-primary);
}

.item-icon {
  width: 16px;
  height: 16px;
}

.logout-item {
  color: var(--color-danger);
}

.logout-item:hover {
  background-color: rgba(239, 68, 68, 0.05);
  color: var(--color-danger);
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 1rem;
  }

  .mobile-toggle {
    display: flex;
  }

  .desktop-toggle {
    display: none;
  }

  .user-info,
  .chevron-icon {
    display: none;
  }
}
</style>
