<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Plus, Search, Filter, X } from 'lucide-vue-next';
import AppTable from '../components/AppTable.vue';
import AppModal from '../components/AppModal.vue';
import AssetForm from '../components/AssetForm.vue';
import EmptyState from '../components/shared/EmptyState.vue';
import { useToast } from '../composables/useToast';
import { getAssets, addAsset, updateAsset, deleteAsset } from '../services/assetService';
import { getCategories } from '../services/categoryService';

// Data from API
const assets = ref([]);
const categories = ref([]);
const toast = useToast();

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

const currentPage = ref(1);
const itemsPerPage = 5;

const totalPages = computed(() => 
  Math.ceil(filteredAssets.value.length / itemsPerPage)
);

const paginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAssets.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

watch([search, selectedCategory, selectedStatus], () => {
  currentPage.value = 1;
});

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal && newTotal > 0) {
    currentPage.value = newTotal;
  }
});

onMounted(async () => {
  try {
    const response = await getAssets();
    assets.value = response.data;
    
    const catResponse = await getCategories();
    categories.value = catResponse.data;
  } catch (error) {
      // error fetching data is managed safely
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
const deletingId = ref(null);
const assetFormRef = ref(null);

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
    
    toast.success('Asset deleted successfully');
    
    // Refresh asset list
    const response = await getAssets();
    assets.value = response.data;
  } catch (err) {
      toast.error('Failed to delete asset. Please try again.');
    } finally {
    deletingId.value = null;
  }
};

const saveAsset = async (data) => {
  error.value = '';
  
  // Basic validation
  if (!data.name) {
    error.value = "Asset name is required";
    assetFormRef.value?.focusField('name');
    return;
  }
  if (!data.tag) {
    error.value = "Asset tag is required";
    assetFormRef.value?.focusField('tag');
    return;
  }
  if (!data.category) {
    error.value = "Category is required";
    assetFormRef.value?.focusField('category');
    return;
  }
  if (!data.purchaseDate) {
    error.value = "Purchase date is required";
    assetFormRef.value?.focusField('purchaseDate');
    return;
  }
  
  if (data.status !== 'Assigned') {
    data.assignedTo = '';
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
      toast.success('Asset updated successfully');
    } catch (err) {
        error.value = "Failed to update asset. Please try again.";
      } finally {
      loading.value = false;
    }
  } else {
    // Add logic
    const exists = assets.value.find((a) => a.tag === data.tag);
    if (exists) {
      error.value = "Asset tag must be unique";
      assetFormRef.value?.focusField('tag');
      return;
    }
    
    try {
      loading.value = true;
      await addAsset(data);
      
      // Refresh asset list
      const response = await getAssets();
      assets.value = response.data;
      
      showModal.value = false;
      toast.success('Asset added successfully');
    } catch (err) {
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
    <EmptyState 
      v-if="filteredAssets.length === 0" 
      title="No assets found" 
      description="Try adjusting your filters or search query to find what you're looking for." 
    />

    <!-- Table -->
    <AppTable 
      v-else
      :columns="columns" 
      :data="paginatedAssets" 
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

    <!-- Pagination -->
    <div v-if="filteredAssets.length > 0" class="pagination">
      <span class="pagination-info">Total Assets: {{ filteredAssets.length }}</span>
      <div class="pagination-controls" v-if="totalPages > 1">
        <button class="btn btn-outline" @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span class="pagination-info" style="margin: 0 0.5rem">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="btn btn-outline" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <!-- Modal -->
    <AppModal 
      :show="showModal" 
      :title="editingAsset && editingAsset.id ? 'Edit Asset' : 'Add New Asset'" 
      @close="showModal = false"
    >
      <AssetForm 
        ref="assetFormRef"
        :initial-data="editingAsset" 
        :loading="loading"
        :error="error"
        @save="saveAsset" 
        @cancel="showModal = false" 
        @clear-error="error = ''"
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
