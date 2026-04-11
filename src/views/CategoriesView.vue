<script setup>
import { ref, onMounted, watch } from 'vue';
import { Plus } from 'lucide-vue-next';
import AppTable from '../components/AppTable.vue';
import AppModal from '../components/AppModal.vue';
import EmptyState from '../components/shared/EmptyState.vue';
import { useToast } from '../composables/useToast';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/categoryService';
import { getAssets } from '../services/assetService';

const categories = ref([]);
const assets = ref([]);
const toast = useToast();

const columns = [
  { key: 'name', label: 'Category Name' },
  { key: 'description', label: 'Description' },
];

const showModal = ref(false);
const editingCategory = ref(null);
const formData = ref({ name: '', description: '' });
const error = ref('');
const loading = ref(false);
const nameRef = ref(null);

watch(formData, () => {
  error.value = '';
}, { deep: true });

const fetchCategories = async () => {
  try {
    const res = await getCategories();
    categories.value = res.data;
  } catch (err) {
      toast.error('Failed to fetch categories');
    }
  };

const fetchAssets = async () => {
  try {
    const res = await getAssets();
    assets.value = res.data;
  } catch (err) {
      // Handled silently to avoid ui disruption
    }
  };
  
  onMounted(async () => {
  await fetchCategories();
  await fetchAssets();
});

const openAddModal = () => {
  editingCategory.value = null;
  formData.value = { name: '', description: '' };
  error.value = '';
  showModal.value = true;
};

const openEditModal = (row) => {
  editingCategory.value = row;
  formData.value = { ...row };
  error.value = '';
  showModal.value = true;
};

const handleDelete = async (row) => {
  const isUsed = assets.value.some((a) => a.category === row.name);
  if (isUsed) {
    toast.warning("Category is used in assets");
    return;
  }

  const confirmDelete = confirm(`Delete category ${row.name}?`);
  if (!confirmDelete) return;

  try {
    await deleteCategory(row.id);
    toast.success("Category deleted successfully");
    await fetchCategories();
  } catch (err) {
      toast.error('Failed to delete category');
    }
  };

const saveCategory = async () => {
  error.value = '';
  
  if (!formData.value.name) {
    error.value = 'Category name is required';
    nameRef.value?.focus();
    return;
  }

  const isDuplicate = categories.value.some(
    (c) => c.name.toLowerCase() === formData.value.name.toLowerCase() && c.id !== editingCategory.value?.id
  );

  if (isDuplicate) {
    error.value = "Category already exists";
    nameRef.value?.focus();
    return;
  }

  try {
    loading.value = true;
    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id, formData.value);
      toast.success("Category updated successfully");
    } else {
      await addCategory(formData.value);
      toast.success("Category added successfully");
    }
    
      showModal.value = false;
      formData.value = { name: '', description: '' };
      await fetchCategories();
    } catch (err) {
      error.value = 'Something went wrong';
    } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="categories-view">
    <div class="header-actions">
      <h2>Categories</h2>
      <button class="btn btn-primary" @click="openAddModal">
        <Plus class="btn-icon" /> Add Category
      </button>
    </div>

    <EmptyState 
      v-if="categories.length === 0" 
      title="No categories" 
      description="Add a new category to get started." 
    />

    <AppTable 
      v-else
      :columns="columns" 
      :data="categories" 
      actions 
      @edit="openEditModal" 
      @delete="handleDelete" 
    />

    <AppModal 
      :show="showModal" 
      :title="editingCategory ? 'Edit Category' : 'New Category'" 
      @close="showModal = false"
    >
      <div v-if="error" class="alert error">{{ error }}</div>

      <form @submit.prevent="saveCategory" class="category-form">
        <div class="form-group">
          <label>Category Name</label>
          <input ref="nameRef" v-model="formData.name" required :disabled="loading" />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="formData.description" rows="3" :disabled="loading"></textarea>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-outline" @click="showModal = false" :disabled="loading">Cancel</button>
        <button class="btn btn-primary" :disabled="loading" @click="saveCategory">
          {{ loading ? "Processing..." : (editingCategory ? "Update Category" : "Add Category") }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.categories-view {
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
  transition: opacity 0.2s;
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

.btn-outline:hover {
  background-color: var(--color-background);
}

.category-form {
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
.form-group textarea {
  padding: 0.625rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text-main);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: 1px solid var(--color-primary);
    border-color: var(--color-primary);
}
</style>
