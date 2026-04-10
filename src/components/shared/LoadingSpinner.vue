<script setup>
defineProps({
  text: {
    type: String,
    default: 'Loading...'
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg
  }
});
</script>

<template>
  <div class="loading-spinner-container">
    <div class="spinner" :class="size"></div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<style scoped>
.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner.sm {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.spinner.md {
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
}

.spinner.lg {
  width: 64px;
  height: 64px;
  margin-bottom: 1.5rem;
  border-width: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
