<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import AppTable from '../components/AppTable.vue';
import { getAssets, updateAsset } from "../services/assetService";
import { getAssignments, addAssignment } from "../services/assignmentService";

const assets = ref([]);
const assignments = ref([]);

const form = ref({
  assetId: "",
  employeeName: "",
  assignedDate: new Date().toISOString().split("T")[0]
});

const error = ref('');
const successMessage = ref('');
const isProcessing = ref(false);

const assetRef = ref(null);
const empRef = ref(null);

watch(form, () => {
  error.value = '';
}, { deep: true });

const columns = [
  { key: 'assetName', label: 'Asset Name' },
  { key: 'employeeName', label: 'Employee Name' },
  { key: 'assignedDate', label: 'Assigned Date' },
  { key: 'status', label: 'Status' },
];

const availableAssets = computed(() =>
  assets.value.filter(a => a.status === "Available")
);

const fetchData = async () => {
  try {
    const assetRes = await getAssets();
    const assignRes = await getAssignments();

    assets.value = assetRes.data;
    assignments.value = assignRes.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    error.value = "Failed to load data";
  }
};

onMounted(async () => {
  await fetchData();
});

const handleAssign = async () => {
  error.value = '';
  successMessage.value = '';

  if (!form.value.assetId) {
    error.value = "Asset selection is required";
    assetRef.value?.focus();
    return;
  }
  if (!form.value.employeeName) {
    error.value = "Employee name is required";
    empRef.value?.focus();
    return;
  }

  isProcessing.value = true;

  try {
    const asset = assets.value.find(a => a.id === form.value.assetId);

    if (!asset) {
      error.value = "Invalid asset selected";
      return;
    }

    // Add assignment
    await addAssignment({
      ...form.value,
      assetName: asset.name,
      returnedDate: null
    });

    // Update asset status
    await updateAsset(asset.id, {
      ...asset,
      status: "Assigned",
      assignedTo: form.value.employeeName
    });

    await fetchData();

    // Clear form
    form.value = {
      assetId: "",
      employeeName: "",
      assignedDate: new Date().toISOString().split("T")[0]
    };

    successMessage.value = "Asset assigned successfully";
    setTimeout(() => successMessage.value = '', 3000);
  } catch (err) {
    console.error("Error assigning asset:", err);
    error.value = "Failed to assign asset";
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="assignments-view">
    <div class="header-actions">
      <h2>Asset Assignment</h2>
      <p class="subtitle">Assign available assets to employees</p>
    </div>

    <div class="dashboard-grid">
      <!-- Assign Form Card -->
      <div class="card assign-card">
        <h3 class="card-title">New Assignment</h3>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleAssign" class="assign-form">
          <div class="form-group">
            <label>Select Asset</label>
            <select ref="assetRef" v-model="form.assetId" required class="form-control" :disabled="isProcessing">
              <option value="" disabled>Choose an available asset...</option>
              <option v-for="asset in availableAssets" :key="asset.id" :value="asset.id">
                {{ asset.name }} ({{ asset.tag }})
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Employee Name</label>
            <input ref="empRef" v-model="form.employeeName" required placeholder="e.g. John Doe" class="form-control" :disabled="isProcessing" />
          </div>
          
          <div class="form-row">
            <div class="form-group" style="grid-column: span 2;">
              <label>Assignment Date</label>
              <input type="date" v-model="form.assignedDate" required class="form-control" :disabled="isProcessing" />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="form = { assetId: '', employeeName: '', assignedDate: new Date().toISOString().split('T')[0] }" :disabled="isProcessing">Clear</button>
            <button type="submit" class="btn btn-primary" :disabled="isProcessing">
              {{ isProcessing ? 'Processing...' : 'Assign Asset' }}
            </button>
          </div>
        </form>
      </div>

      <!-- History Table Card -->
      <div class="card history-card">
        <div class="card-header">
          <h3 class="card-title">Assignment History</h3>
        </div>
        <div class="table-container">
          <div v-if="assignments.length === 0" class="no-results">
            <p>No assignment history available</p>
          </div>
          <AppTable v-else :columns="columns" :data="assignments">
            <template #status="{ row }">
              <span class="status-badge" :class="row.returnedDate ? 'returned' : 'active'">
                {{ row.returnedDate ? 'Returned' : 'Assigned' }}
              </span>
            </template>
          </AppTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-results {
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--color-surface);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 1.125rem;
}

.assignments-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

h2 {
  color: var(--color-text-main);
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 350px 1fr;
    align-items: start;
  }
}

.card {
  background-color: var(--color-surface);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0 0 1.25rem 0;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.card-header .card-title {
  margin: 0;
}

.assign-card {
  padding: 1.5rem;
}

.assign-form {
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
  color: var(--color-text-main);
  font-size: 0.875rem;
  font-weight: 500;
}

.form-control {
  padding: 0.625rem 0.875rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text-main);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-control::placeholder {
  color: var(--color-text-muted);
  opacity: 0.7;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem top 50%;
  background-size: 0.65rem auto;
  padding-right: 2.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-primary:hover {
  background-color: var(--color-primary-hover, #4338ca);
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1);
}

.btn-outline {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text-main);
}

.btn-outline:hover {
  background-color: var(--color-surface-hover, #f9fafb);
  border-color: #d1d5db;
}

.table-container {
  padding: 0;
}

.status-badge {
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-flex;
}

.status-badge.active {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-badge.returned {
  background-color: var(--color-background);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.error-message {
  padding: 0.75rem 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.success-message {
  padding: 0.75rem 1rem;
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
  border-radius: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}
</style>
