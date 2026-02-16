<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: Object,
  trend: Number,
  color: {
    type: String,
    default: 'primary' // primary, success, warning, danger
  }
});

const colorClass = computed(() => `text-${props.color}`);
const bgClass = computed(() => `bg-${props.color}-soft`);
</script>

<template>
  <div class="stats-card">
    <div class="stats-content">
      <div class="stats-info">
        <p class="stats-title">{{ title }}</p>
        <h3 class="stats-value">{{ value }}</h3>
      </div>
      <div class="stats-icon-wrapper" :class="color">
        <component :is="icon" class="stats-icon" />
      </div>
    </div>
    <div class="stats-footer" v-if="trend !== undefined">
      <span :class="trend >= 0 ? 'text-success' : 'text-danger'">
        {{ trend > 0 ? '+' : '' }}{{ trend }}%
      </span>
      <span class="stats-subtext"> since last month</span>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  background-color: var(--color-surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stats-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.stats-title {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.stats-value {
  color: var(--color-text-main);
  font-size: 1.75rem;
  font-weight: 700;
}

.stats-icon-wrapper {
  padding: 0.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-icon {
  width: 24px;
  height: 24px;
}

/* Color variants */
.primary { background-color: rgba(79, 70, 229, 0.1); color: var(--color-primary); }
.success { background-color: rgba(16, 185, 129, 0.1); color: var(--color-success); }
.warning { background-color: rgba(245, 158, 11, 0.1); color: var(--color-warning); }
.danger { background-color: rgba(239, 68, 68, 0.1); color: var(--color-danger); }

.stats-footer {
  font-size: 0.875rem;
  margin-top: 1rem;
}

.text-success { color: var(--color-success); font-weight: 500; }
.text-danger { color: var(--color-danger); font-weight: 500; }
.stats-subtext { color: var(--color-text-muted); }
</style>
