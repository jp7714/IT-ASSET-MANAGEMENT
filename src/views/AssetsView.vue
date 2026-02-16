<script setup>
import { ref } from 'vue';
import { Plus, Search, Filter } from 'lucide-vue-next';
import AppTable from '../components/AppTable.vue';
import AppModal from '../components/AppModal.vue';

// Mock Data
const assets = ref([
  { id: 1, name: 'MacBook Pro 16"', tag: 'AST-001', category: 'Laptop', brand: 'Apple', status: 'Assigned', purchaseDate: '2023-01-15', assignedTo: 'Sarah Jenkins' },
  { id: 2, name: 'Dell XPS 15', tag: 'AST-002', category: 'Laptop', brand: 'Dell', status: 'Available', purchaseDate: '2023-02-10', assignedTo: '-' },
  { id: 3, name: 'iPhone 13', tag: 'AST-003', category: 'Phone', brand: 'Apple', status: 'Repair', purchaseDate: '2022-11-20', assignedTo: '-' },
  { id: 4, name: 'Dell UltraSharp 27"', tag: 'AST-004', category: 'Monitor', brand: 'Dell', status: 'Assigned', purchaseDate: '2023-01-10', assignedTo: 'Mike Ross' },
  { id: 5, name: 'Logitech MX Master 3', tag: 'AST-005', category: 'Peripheral', brand: 'Logitech', status: 'Available', purchaseDate: '2023-03-05', assignedTo: '-' },
]);

const columns = [
  { key: 'name', label: 'Asset Name' },
  { key: 'tag', label: 'Asset Tag' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'assignedTo', label: 'Assigned To' },
];

const showModal = ref(false);
const editingAsset = ref(null);
const formData = ref({
  name: '',
  tag: '',
  category: '',
  brand: '',
  status: 'Available',
  assignedTo: '',
  notes: ''
});

const openAddModal = () => {
  editingAsset.value = null;
  formData.value = {
    name: '',
    tag: '',
    category: '',
    brand: '',
    status: 'Available',
    assignedTo: '',
    notes: ''
  };
  showModal.value = true;
};

const openEditModal = (row) => {
  editingAsset.value = row;
  formData.value = { ...row, notes: '' }; // Mock notes
  showModal.value = true;
};

const handleDelete = (row) => {
  if (confirm(`Are you sure you want to delete ${row.name}?`)) {
    assets.value = assets.value.filter(a => a.id !== row.id);
  }
};

const saveAsset = () => {
  if (editingAsset.value) {
    // Update
    const index = assets.value.findIndex(a => a.id === editingAsset.value.id);
    if (index !== -1) {
      assets.value[index] = { ...formData.value, id: editingAsset.value.id };
    }
  } else {
    // Add
    const newId = Math.max(...assets.value.map(a => a.id)) + 1;
    assets.value.push({ ...formData.value, id: newId });
  }
  showModal.value = false;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Available': return 'text-success bg-success-soft';
    case 'Assigned': return 'text-primary bg-primary-soft';
    case 'Repair': return 'text-danger bg-danger-soft';
    default: return 'text-muted';
  }
};
</script>

<template>
  <div class="assets-view">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-bar">
        <Search class="search-icon" />
        <input type="text" placeholder="Search assets..." class="search-input" />
      </div>
      <div class="actions">
        <button class="btn btn-outline">
          <Filter class="btn-icon" /> Filter
        </button>
        <button class="btn btn-primary" @click="openAddModal">
          <Plus class="btn-icon" /> Add Asset
        </button>
      </div>
    </div>

    <!-- Table -->
    <AppTable 
      :columns="columns" 
      :data="assets" 
      actions 
      @edit="openEditModal" 
      @delete="handleDelete"
    >
      <template #status="{ row }">
        <span class="status-badge" :class="getStatusColor(row.status)">
          {{ row.status }}
        </span>
      </template>
    </AppTable>

    <!-- Modal -->
    <AppModal 
      :show="showModal" 
      :title="editingAsset ? 'Edit Asset' : 'Add New Asset'" 
      @close="showModal = false"
    >
      <form @submit.prevent="saveAsset" class="asset-form">
        <div class="form-group">
          <label>Asset Name</label>
          <input v-model="formData.name" required placeholder="e.g. MacBook Pro" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Asset Tag</label>
            <input v-model="formData.tag" required placeholder="e.g. AST-001" />
          </div>
          <div class="form-group">
            <label>Category</label>
             <select v-model="formData.category" required>
              <option value="" disabled>Select Category</option>
              <option>Laptop</option>
              <option>Desktop</option>
              <option>Phone</option>
              <option>Monitor</option>
              <option>Peripheral</option>
            </select>
          </div>
        </div>
        <div class="form-row">
           <div class="form-group">
            <label>Brand / Model</label>
            <input v-model="formData.brand" placeholder="e.g. Apple" />
          </div>
          <div class="form-group">
            <label>Purchase Date</label>
            <input type="date" v-model="formData.purchaseDate" />
          </div>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="formData.status" required>
            <option>Available</option>
            <option>Assigned</option>
            <option>Repair</option>
            <option>Retired</option>
          </select>
        </div>
        <div class="form-group" v-if="formData.status === 'Assigned'">
          <label>Assigned To</label>
          <input v-model="formData.assignedTo" placeholder="Employee Name" />
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea v-model="formData.notes" rows="3"></textarea>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-outline" @click="showModal = false">Cancel</button>
        <button class="btn btn-primary" @click="saveAsset">Save Asset</button>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.assets-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-background);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  width: 300px;
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
}

.search-input {
  border: none;
  background: transparent;
  width: 100%;
  color: var(--color-text-main);
  outline: none;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
}

.btn-outline {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text-main);
}

.btn-outline:hover {
  background-color: var(--color-background);
  border-color: var(--color-text-muted);
}

.status-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.bg-success-soft { background-color: rgba(16, 185, 129, 0.15); }
.bg-primary-soft { background-color: rgba(79, 70, 229, 0.15); }
.bg-danger-soft { background-color: rgba(239, 68, 68, 0.15); }

/* Form Styles */
.asset-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.625rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text-main);
  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--color-primary);
}
</style>
