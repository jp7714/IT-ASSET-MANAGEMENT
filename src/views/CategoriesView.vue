<script setup>
import { ref } from 'vue';
import { Plus, Search } from 'lucide-vue-next';
import AppTable from '../components/AppTable.vue';
import AppModal from '../components/AppModal.vue';

const categories = ref([
  { id: 1, name: 'Laptop', description: 'Portable computers', count: 145 },
  { id: 2, name: 'Desktop', description: 'Workstations and towers', count: 50 },
  { id: 3, name: 'Monitor', description: 'External displays', count: 88 },
  { id: 4, name: 'Phone', description: 'Mobile devices', count: 42 },
  { id: 5, name: 'Peripheral', description: 'Keyboards, mice, headsets', count: 200 },
]);

const columns = [
  { key: 'name', label: 'Category Name' },
  { key: 'description', label: 'Description' },
  { key: 'count', label: 'Asset Count', align: 'center' },
];

const showModal = ref(false);
const editingCategory = ref(null);
const formData = ref({ name: '', description: '' });

const openAddModal = () => {
  editingCategory.value = null;
  formData.value = { name: '', description: '' };
  showModal.value = true;
};

const openEditModal = (row) => {
  editingCategory.value = row;
  formData.value = { ...row };
  showModal.value = true;
};

const handleDelete = (row) => {
  if (confirm(`Delete category ${row.name}?`)) {
    categories.value = categories.value.filter(c => c.id !== row.id);
  }
};

const saveCategory = () => {
  if (editingCategory.value) {
    const index = categories.value.findIndex(c => c.id === editingCategory.value.id);
    if (index !== -1) {
      categories.value[index] = { ...formData.value, id: editingCategory.value.id, count: editingCategory.value.count };
    }
  } else {
    const newId = Math.max(...categories.value.map(c => c.id)) + 1;
    categories.value.push({ ...formData.value, id: newId, count: 0 });
  }
  showModal.value = false;
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

    <AppTable 
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
      <form @submit.prevent="saveCategory" class="category-form">
        <div class="form-group">
          <label>Category Name</label>
          <input v-model="formData.name" required />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="formData.description" rows="3"></textarea>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-outline" @click="showModal = false">Cancel</button>
        <button class="btn btn-primary" @click="saveCategory">Save</button>
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
