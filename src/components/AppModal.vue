<script setup>
import { X } from 'lucide-vue-next';

defineProps({
  show: Boolean,
  title: String
});

defineEmits(['close']);
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>{{ title }}</h3>
            <button class="close-btn" @click="$emit('close')">
              <X class="close-icon" />
            </button>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>

          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  padding: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

.modal-container {
  width: 100%;
  max-width: 500px;
  background-color: var(--color-surface);
  border-radius: 1rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  padding: 0.25rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: var(--color-background);
  color: var(--color-text-main);
}

.close-icon {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Transitions */
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
  opacity: 0;
}
</style>
