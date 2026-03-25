<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  actions: {
    type: Boolean,
    default: false
  },
  selectedRowId: {
    type: [String, Number],
    default: null
  },
  deletingId: {
    type: [String, Number],
    default: null
  }
});

defineEmits(['edit', 'delete']);
</script>

<template>
  <div class="table-container">
    <table class="app-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :class="col.align || 'left'">
            {{ col.label }}
          </th>
          <th v-if="actions" class="right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length + (actions ? 1 : 0)" class="empty-state">
            No data available
          </td>
        </tr>
        <tr v-for="(row, index) in data" :key="row.id || index" :class="{ 'highlighted-row': selectedRowId === row.id }">
          <td v-for="col in columns" :key="col.key" :class="col.align || 'left'">
            <slot :name="col.key" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
          <td v-if="actions" class="actions-cell right">
            <button class="action-btn edit" @click="$emit('edit', row)">
              Edit
            </button>
            <button class="action-btn delete" @click="$emit('delete', row)" :disabled="deletingId === row.id">
              {{ deletingId === row.id ? 'Deleting...' : 'Delete' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.app-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

th {
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--color-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 1rem 1.5rem;
  letter-spacing: 0.05em;
  text-align: left;
}

td {
  padding: 1rem 1.5rem;
  color: var(--color-text-main);
  border-top: 1px solid var(--color-border);
}

tr:hover td {
  background-color: rgba(255, 255, 255, 0.02);
}

tr.highlighted-row td {
  background-color: rgba(79, 70, 229, 0.1);
  border-top-color: var(--color-primary);
  border-bottom: 1px solid var(--color-primary);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
}

/* Alignment */
.left { text-align: left; }
.right { text-align: right; }
.center { text-align: center; }

/* Actions */
.actions-cell {
  white-space: nowrap;
}

.action-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  background: transparent;
  transition: all 0.2s;
}

.action-btn.edit {
  color: var(--color-primary);
  background-color: rgba(79, 70, 229, 0.1);
  margin-right: 0.5rem;
}

.action-btn.edit:hover {
  background-color: var(--color-primary);
  color: white;
}

.action-btn.delete {
  color: var(--color-danger);
  background-color: rgba(239, 68, 68, 0.1);
}

.action-btn.delete:hover:not(:disabled) {
  background-color: var(--color-danger);
  color: white;
}

.action-btn.delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
