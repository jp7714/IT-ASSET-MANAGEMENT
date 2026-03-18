<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Search, Filter } from 'lucide-vue-next';
import AppTable from '../components/AppTable.vue';
import AppModal from '../components/AppModal.vue';
import AssetForm from '../components/AssetForm.vue';
import { getAssets, addAsset, updateAsset } from '../services/assetService';

// Data from API
const assets = ref([]);

onMounted(async () => {
  try {
    const response = await getAssets();
    assets.value = response.data;
  } catch (error) {
    console.error("Error fetching assets:", error);
  }
});

const columns = [
  { key: 'name', label: 'Asset Name' },
  { key: 'tag', label: 'Asset Tag' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'assignedTo', label: 'Assigned To' },
];

const showModal = ref(false);
const editingAsset = ref(null);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const openAddModal = () => {
  editingAsset.value = null;
  error.value = '';
  showModal.value = true;
};

const openEditModal = (row) => {
  editingAsset.value = { ...row, notes: '' }; // Mock notes
  showModal.value = true;
};

const handleDelete = (row) => {
  if (confirm(`Are you sure you want to delete ${row.name}?`)) {
    assets.value = assets.value.filter(a => a.id !== row.id);
  }
};

const saveAsset = async (data) => {
  error.value = '';
  
  // Basic validation
  if (!data.name || !data.tag || !data.category) {
    error.value = "Please fill all required fields";
    return;
  }
  
  if (editingAsset.value && editingAsset.value.id) {
    // Update logic
    try {
      loading.value = true;
      await updateAsset(editingAsset.value.id, data);
      
      // Refresh asset list
      const response = await getAssets();
      assets.value = response.data;
      
      showModal.value = false;
      successMessage.value = "Asset updated successfully";
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } catch (err) {
      console.error("Error updating asset:", err);
      error.value = "Failed to update asset. Please try again.";
    } finally {
      loading.value = false;
    }
  } else {
    // Add logic
    const exists = assets.value.find((a) => a.tag === data.tag);
    if (exists) {
      error.value = "Asset tag must be unique";
      return;
    }
    
    try {
      loading.value = true;
      await addAsset(data);
      
      // Refresh asset list
      const response = await getAssets();
      assets.value = response.data;
      
      showModal.value = false;
      successMessage.value = "Asset added successfully";
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    } catch (err) {
      console.error("Error saving asset:", err);
      error.value = "Failed to save asset. Please try again.";
    } finally {
      loading.value = false;
    }
  }
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
    <!-- Success Message -->
    <div v-if="successMessage" class="success-banner">
      {{ successMessage }}
    </div>

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
      :selected-row-id="editingAsset?.id"
      @edit="openEditModal" 
      @delete="handleDelete"
    >
      <template #status="{ row }">
        <span class="status-badge" :class="getStatusColor(row.status)">
          {{ row.status }}
        </span>
      </template>
    </AppTable>

    <!-- Pagination (UI Only) -->
    <div class="pagination">
      <span class="pagination-info">Showing 1 to 5 of 50 entries</span>
      <div class="pagination-controls">
        <button class="btn btn-outline" disabled>Previous</button>
        <button class="btn btn-primary">1</button>
        <button class="btn btn-outline">2</button>
        <button class="btn btn-outline">3</button>
        <span class="pagination-ellipsis">...</span>
        <button class="btn btn-outline">10</button>
        <button class="btn btn-outline">Next</button>
      </div>
    </div>

    <!-- Modal -->
    <AppModal 
      :show="showModal" 
      :title="editingAsset && editingAsset.id ? 'Edit Asset' : 'Add New Asset'" 
      @close="showModal = false"
    >
      <AssetForm 
        :initial-data="editingAsset" 
        :loading="loading"
        :error="error"
        @save="saveAsset" 
        @cancel="showModal = false" 
      />
    </AppModal>
  </div>
</template>

<style scoped>
.assets-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.success-banner {
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--color-success, #10b981);
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid var(--color-success, #10b981);
  font-weight: 500;
  display: flex;
  align-items: center;
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

/* Pagination Styles */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.pagination-controls {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.pagination-controls .btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid var(--color-border);
}

.pagination-controls .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  color: var(--color-text-muted);
  padding: 0 0.5rem;
}

</style>
