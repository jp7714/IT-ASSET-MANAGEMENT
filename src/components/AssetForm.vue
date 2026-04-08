<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['save', 'cancel', 'clear-error']);

const nameRef = ref(null);
const tagRef = ref(null);
const categoryRef = ref(null);
const dateRef = ref(null);
const formData = ref({
  name: '',
  tag: '',
  category: '',
  brand: '',
  purchaseDate: '',
  status: 'Available',
  assignedTo: '',
  notes: ''
});

watch(() => formData.value, () => {
  emit('clear-error');
}, { deep: true });

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal, notes: newVal.notes || '' };
  } else {
    formData.value = {
      name: '',
      tag: '',
      category: '',
      brand: '',
      purchaseDate: '',
      status: 'Available',
      assignedTo: '',
      notes: ''
    };
  }
}, { immediate: true, deep: true });

const isEditMode = computed(() => !!props.initialData && !!props.initialData.id);

const handleSubmit = () => {
  emit('save', { ...formData.value });
};

const focusField = (fieldName) => {
  if (fieldName === 'name' && nameRef.value) nameRef.value.focus();
  if (fieldName === 'tag' && tagRef.value) tagRef.value.focus();
  if (fieldName === 'category' && categoryRef.value) categoryRef.value.focus();
  if (fieldName === 'purchaseDate' && dateRef.value) dateRef.value.focus();
};

defineExpose({
  focusField
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="asset-form">
    <div class="form-group">
      <label>Asset Name</label>
      <input ref="nameRef" v-model="formData.name" required placeholder="e.g. MacBook Pro 16&quot;" class="input-field" />
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label>Asset Tag</label>
        <input ref="tagRef" v-model="formData.tag" required placeholder="e.g. AST-001" class="input-field" :disabled="isEditMode" />
      </div>
      <div class="form-group">
        <label>Category</label>
        <select ref="categoryRef" v-model="formData.category" required class="input-field">
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
        <input v-model="formData.brand" placeholder="e.g. Apple" class="input-field" />
      </div>
      <div class="form-group">
        <label>Purchase Date</label>
        <input ref="dateRef" type="date" v-model="formData.purchaseDate" required class="input-field" />
      </div>
    </div>
    
    <div class="form-group">
      <label>Status</label>
      <select v-model="formData.status" required class="input-field">
        <option>Available</option>
        <option>Assigned</option>
        <option>Repair</option>
        <option>Retired</option>
      </select>
    </div>
    
    <div class="form-group" v-if="formData.status === 'Assigned'">
      <label>Assigned To</label>
      <input v-model="formData.assignedTo" placeholder="Employee Name" class="input-field" />
    </div>
    
    <div class="form-group">
      <label>Notes</label>
      <textarea v-model="formData.notes" rows="3" placeholder="Add any additional notes here..." class="input-field"></textarea>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="btn btn-outline" @click="$emit('cancel')" :disabled="loading">Cancel</button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Saving...' : (isEditMode ? 'Update Asset' : 'Add Asset') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.asset-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-main);
}

.input-field {
  padding: 0.625rem 0.875rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text-main);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  outline: none;
}

.input-field:hover {
  border-color: #888;
}

.input-field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.input-field:disabled {
  background-color: var(--color-surface, #f8f9fa);
  color: var(--color-text-muted);
  cursor: not-allowed;
  opacity: 0.7;
}

.input-field::placeholder {
  color: var(--color-text-muted);
  opacity: 0.7;
}

/* Error Message */
.error-message {
  color: var(--color-danger, #ef4444);
  font-size: 0.875rem;
  padding: 0.75rem;
  background-color: var(--color-danger-soft, rgba(239, 68, 68, 0.1));
  border-radius: 0.5rem;
  border-left: 3px solid var(--color-danger, #ef4444);
  margin-top: 0.5rem;
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
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

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
