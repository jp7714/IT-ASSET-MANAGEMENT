<script setup>
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';
import AppTable from '../components/AppTable.vue';
import AppModal from '../components/AppModal.vue';

const assignments = ref([
  { id: 1, asset: 'MacBook Pro 16"', tag: 'AST-001', employee: 'Sarah Jenkins', dept: 'Engineering', date: '2023-01-20', status: 'Active' },
  { id: 2, asset: 'Dell UltraSharp 27"', tag: 'AST-004', employee: 'Mike Ross', dept: 'Design', date: '2023-02-15', status: 'Active' },
  { id: 3, asset: 'iPhone 13', tag: 'AST-003', employee: 'John Doe', dept: 'Sales', date: '2022-12-01', status: 'Returned' },
]);

const columns = [
  { key: 'asset', label: 'Asset Name' },
  { key: 'tag', label: 'Tag' },
  { key: 'employee', label: 'Employee' },
  { key: 'dept', label: 'Department' },
  { key: 'date', label: 'Assigned Date' },
  { key: 'status', label: 'Status' },
];

const showModal = ref(false);
const formData = ref({
  assetId: '',
  employee: '',
  dept: '',
  date: new Date().toISOString().split('T')[0],
  notes: ''
});

// Mock Asset List for dropdown
const availableAssets = [
  { id: 101, name: 'Dell XPS 15 (AST-002)' },
  { id: 102, name: 'Logitech MX Master 3 (AST-005)' },
];

const handleAssign = () => {
  // Mock assignment
  const asset = availableAssets.find(a => a.id == formData.value.assetId);
  const newAssignment = {
    id: Date.now(),
    asset: asset ? asset.name.split(' (')[0] : 'Unknown Asset',
    tag: asset ? asset.name.split('(')[1].replace(')', '') : 'N/A',
    employee: formData.value.employee,
    dept: formData.value.dept,
    date: formData.value.date,
    status: 'Active'
  };
  assignments.value.unshift(newAssignment);
  showModal.value = false;
};
</script>

<template>
  <div class="assignments-view">
    <div class="header-actions">
      <h2>Assignments</h2>
      <button class="btn btn-primary" @click="showModal = true">
        <Plus class="btn-icon" /> New Assignment
      </button>
    </div>

    <!-- Assignments Table -->
    <AppTable :columns="columns" :data="assignments">
      <template #status="{ row }">
        <span class="status-badge" :class="row.status === 'Active' ? 'active' : 'returned'">
          {{ row.status }}
        </span>
      </template>
    </AppTable>

    <!-- Assignment Modal -->
    <AppModal 
      :show="showModal" 
      title="Assign Asset" 
      @close="showModal = false"
    >
      <form @submit.prevent="handleAssign" class="assign-form">
        <div class="form-group">
          <label>Select Asset</label>
          <select v-model="formData.assetId" required>
            <option value="" disabled>Select an available asset</option>
            <option v-for="asset in availableAssets" :key="asset.id" :value="asset.id">
              {{ asset.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Employee Name</label>
          <input v-model="formData.employee" required placeholder="John Doe" />
        </div>
        <div class="form-group">
          <label>Department</label>
          <input v-model="formData.dept" placeholder="e.g. Engineering" />
        </div>
        <div class="form-group">
          <label>Assignment Date</label>
          <input type="date" v-model="formData.date" required />
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea v-model="formData.notes" rows="2"></textarea>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-outline" @click="showModal = false">Cancel</button>
        <button class="btn btn-primary" @click="handleAssign">Assign</button>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.assignments-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  color: var(--color-text-main);
  font-size: 1.5rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

.btn:hover {
  opacity: 0.9;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-main);
}

.assign-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.625rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text-main);
}

.status-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.status-badge.returned {
  background-color: var(--color-surface);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}
</style>
