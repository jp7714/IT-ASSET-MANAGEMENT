<script setup>
import { FolderSearch } from 'lucide-vue-next';

defineProps({
  title: {
    type: String,
    default: 'No items found'
  },
  description: {
    type: String,
    default: 'There are currently no items to display.'
  },
  icon: {
    type: Object,
    default: () => FolderSearch
  }
});
</script>

<template>
  <div class="empty-state">
    <div class="icon-container">
      <component :is="icon" class="empty-icon" />
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-description">{{ description }}</p>
    <div class="empty-action" v-if="$slots.action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background-color: var(--color-surface);
  border-radius: 1rem;
  border: 1px dashed var(--color-border);
}

.icon-container {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(148, 163, 184, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.empty-icon {
  width: 32px;
  height: 32px;
  color: var(--color-text-muted);
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin-bottom: 0.5rem;
}

.empty-description {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  max-width: 300px;
  margin-bottom: 1.5rem;
}

.empty-action {
  margin-top: 1rem;
}
</style>
