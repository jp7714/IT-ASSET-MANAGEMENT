<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Plus, Search, Filter, X } from 'lucide-vue-next';
import AppTable from '../components/AppTable.vue';
import AppModal from '../components/AppModal.vue';
import AssetForm from '../components/AssetForm.vue';
import { getAssets, addAsset, updateAsset, deleteAsset } from '../services/assetService';
import { getCategories } from '../services/categoryService';

// Data from API
const assets = ref([]);
const categories = ref([]);

const searchQuery = ref("");
const search = ref("");
const selectedCategory = ref("");
const selectedStatus = ref("");

let searchTimeout = null;
watch(searchQuery, (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    search.value = newVal;
  }, 300);
});

const resetFilters = () => {
  searchQuery.value = "";
  search.value = "";
  selectedCategory.value = "";
  selectedStatus.value = "";
};

const filteredAssets = computed(() => {
  return assets.value.filter(a => {
    const s = search.value.toLowerCase();
    const matchesSearch = s ? (
      (a.name && a.name.toLowerCase().includes(s)) || 
      (a.tag && a.tag.toLowerCase().includes(s))
    ) : true;
      
    const matchesCategory = selectedCategory.value ? a.category === selectedCategory.value : true;
    const matchesStatus = selectedStatus.value ? a.status === selectedStatus.value : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
});

onMounted(async () => {
  try {
    const response = await getAssets();
    assets.value = response.data;
    
    const catResponse = await getCategories();
    categories.value = catResponse.data;
  } catch (error) {
    console.error("Error fetching data:", error);
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
const deletingId = ref(null);

const openAddModal = () => {
  editingAsset.value = null;
  error.value = '';
  showModal.value = true;
};

const openEditModal = (row) => {
  editingAsset.value = { ...row, notes: '' }; // Mock notes
  showModal.value = true;
};

const handleDelete = async (row) => {
  if (row.status === 'Assigned') {
    alert("Cannot delete assigned asset");
    return;
  }

  const confirmDelete = confirm(`Are you sure you want to delete ${row.name}?`);
  if (!confirmDelete) return;

  try {
    deletingId.value = row.id;
    await deleteAsset(row.id);
    
    successMessage.value = "Asset deleted successfully";
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
    
    // Refresh asset list
    const response = await getAssets();
    assets.value = response.data;
  } catch (err) {
    console.error("Error deleting asset:", err);
    error.value = "Failed to delete asset. Please try again.";
  } finally {
    deletingId.value = null;
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
      <div class="filters-group">
        <div class="search-bar">
          <Search class="search-icon" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            class="search-input" 
            v-model="searchQuery" 
          />
        </div>
        
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>

        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Repair">Under Repair</option>
        </select>
        
        <button v-if="searchQuery || selectedCategory || selectedStatus" @click="resetFilters" class="btn btn-outline reset-btn">
          <X class="btn-icon" style="width: 14px; height: 14px;" /> Reset
        </button>
      </div>

      <div class="actions">
        <button class="btn btn-primary" @click="openAddModal">
          <Plus class="btn-icon" /> Add Asset
        </button>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-if="filteredAssets.length === 0" class="no-results">
      <p>No assets found</p>
    </div>

    <!-- Table -->
    <AppTable 
      v-else
      :columns="columns" 
      :data="filteredAssets" 
      actions 
      :selected-row-id="editingAsset?.id"
      :deleting-id="deletingId"
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
  flex-wrap: wrap;
  gap: 1rem;
}

.filters-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text-main);
  outline: none;
  font-size: 0.875rem;
  cursor: pointer;
}

.reset-btn {
  padding: 0.5rem;
  font-size: 0.875rem;
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--color-surface);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 1.125rem;
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
