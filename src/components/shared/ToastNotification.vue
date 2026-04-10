<script setup>
import { useToast } from '../../composables/useToast';
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  AlertTriangle,
  X
} from 'lucide-vue-next';

const { toasts, removeToast } = useToast();

const getIcon = (type) => {
  switch (type) {
    case 'success': return CheckCircle;
    case 'error': return XCircle;
    case 'warning': return AlertTriangle;
    case 'info': return Info;
    default: return Info;
  }
};
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast-list">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
      >
        <div class="toast-icon-wrapper">
          <component :is="getIcon(toast.type)" class="toast-icon" />
        </div>
        <p class="toast-message">{{ toast.message }}</p>
        <button class="toast-close" @click="removeToast(toast.id)">
          <X class="close-icon" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background-color: var(--color-surface);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  min-width: 300px;
  max-width: 450px;
}

.toast-message {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-main);
  margin: 0;
}

.toast-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-icon {
  width: 20px;
  height: 20px;
}

.toast-success .toast-icon { color: var(--color-success); }
.toast-error .toast-icon { color: var(--color-danger); }
.toast-warning .toast-icon { color: var(--color-warning); }
.toast-info .toast-icon { color: var(--color-primary); }

.toast-close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.toast-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text-main);
}

.close-icon {
  width: 16px;
  height: 16px;
}

/* Transitions */
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
