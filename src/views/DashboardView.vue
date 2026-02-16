<script setup>
import { 
  Box, 
  CheckCircle, 
  RotateCcw, 
  Wrench 
} from 'lucide-vue-next';
import StatsCard from '../components/StatsCard.vue';

// Mock Data for Charts (Placeholder)
const recentActivity = [
  { id: 1, action: 'Asset Assigned', item: 'MacBook Pro 16"', user: 'Sarah Jenkins', time: '2 mins ago' },
  { id: 2, action: 'New Asset Added', item: 'Dell XPS 15', user: 'Admin', time: '1 hour ago' },
  { id: 3, action: 'Asset Returned', item: 'iPhone 13', user: 'Mike Ross', time: '3 hours ago' },
  { id: 4, action: 'Maintenance', item: 'HP Printer', user: 'Tech Support', time: '1 day ago' },
];
</script>

<template>
  <div class="dashboard-container">
    <!-- Stats Grid -->
    <div class="stats-grid">
      <StatsCard 
        title="Total Assets" 
        value="1,248" 
        :icon="Box" 
        color="primary" 
        :trend="12" 
      />
      <StatsCard 
        title="Assigned Assets" 
        value="856" 
        :icon="CheckCircle" 
        color="success" 
        :trend="5" 
      />
      <StatsCard 
        title="Available Assets" 
        value="342" 
        :icon="RotateCcw" 
        color="warning" 
        :trend="-2" 
      />
      <StatsCard 
        title="Under Repair" 
        value="50" 
        :icon="Wrench" 
        color="danger" 
        :trend="0" 
      />
    </div>

    <!-- Charts & Activity Section -->
    <div class="content-grid">
      <!-- Chart Placeholder -->
      <div class="card chart-card">
        <div class="card-header">
          <h3>Assets by Category</h3>
        </div>
        <div class="card-body chart-placeholder">
          <!-- Create visible bars for visual effect without a library -->
          <div class="bar-chart">
             <div class="bar-group">
               <div class="bar" style="height: 80%"></div>
               <span class="label">Laptops</span>
             </div>
             <div class="bar-group">
               <div class="bar" style="height: 45%"></div>
               <span class="label">Phones</span>
             </div>
             <div class="bar-group">
               <div class="bar" style="height: 60%"></div>
               <span class="label">Monitors</span>
             </div>
             <div class="bar-group">
               <div class="bar" style="height: 30%"></div>
               <span class="label">Peripherals</span>
             </div>
          </div>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="card activity-card">
        <div class="card-header">
          <h3>Recent Activity</h3>
        </div>
        <div class="card-body">
          <ul class="activity-list">
            <li v-for="item in recentActivity" :key="item.id" class="activity-item">
              <div class="activity-dot"></div>
              <div class="activity-content">
                <p class="activity-main">
                  <span class="font-medium">{{ item.action }}</span> - {{ item.item }}
                </p>
                <p class="activity-sub">{{ item.user }} • {{ item.time }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.card {
  background-color: var(--color-surface);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.card-body {
  padding: 1.5rem;
}

/* Mock Chart Styles */
.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  height: 100%;
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  gap: 0.5rem;
}

.bar {
  width: 40px;
  background: linear-gradient(to top, var(--color-primary), #818cf8);
  border-radius: 4px 4px 0 0;
  transition: height 1s ease-out;
  opacity: 0.8;
}

.bar:hover {
  opacity: 1;
}

.label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* Activity List */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-left: 2px solid var(--color-border);
  padding-left: 1.5rem;
  position: relative;
}

.activity-item:last-child {
  padding-bottom: 0;
}

.activity-dot {
  position: absolute;
  left: -5px;
  top: 6px;
  width: 8px;
  height: 8px;
  background-color: var(--color-primary);
  border-radius: 50%;
  box-shadow: 0 0 0 4px var(--color-background);
}

.activity-main {
  color: var(--color-text-main);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.font-medium {
  font-weight: 600;
}

.activity-sub {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
