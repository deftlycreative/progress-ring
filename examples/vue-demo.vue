<!-- Vue demo for @deftlycreative/progress-ring
     To run: npm run dev:vue (from the project root) -->
<template>
  <div class="demo">
    <h2>Vue demo</h2>

    <!-- Static examples -->
    <div class="row">
      <div class="card">
        <span>Default</span>
        <ProgressRing :value="72" />
      </div>

      <div class="card">
        <span>Custom colors</span>
        <ProgressRing
          :value="45"
          primary-color="#e63946"
          muted-color="#f4a1a7"
          background-color="#fff5f5"
        />
      </div>

      <div class="card">
        <span>Thick ring</span>
        <ProgressRing
          :value="88"
          primary-color="#2a9d8f"
          muted-color="#b2dfdb"
          :thickness="14"
        />
      </div>

      <div class="card">
        <span>No animation</span>
        <ProgressRing :value="60" primary-color="#f4a261" :animated="false" />
      </div>
    </div>

    <!-- Loop example -->
    <div class="row">
      <div v-for="task in tasks" :key="task.id" class="card">
        <span>{{ task.label }}</span>
        <ProgressRing :value="task.value" primary-color="#6c63ff" />
      </div>
    </div>

    <!-- Interactive -->
    <div class="card">
      <span>Interactive: {{ liveValue }}</span>
      <ProgressRing :value="liveValue" primary-color="#6c63ff" :thickness="10" />
      <input type="range" min="0" max="100" v-model.number="liveValue" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProgressRing from '../src/ProgressRing.vue';

const liveValue = ref(50);

const tasks = [
  { id: 1, label: 'Design', value: 100 },
  { id: 2, label: 'Dev',    value: 65  },
  { id: 3, label: 'QA',     value: 30  },
  { id: 4, label: 'Deploy', value: 0   },
];
</script>

<style scoped>
.demo  { font-family: sans-serif; padding: 40px; background: #f5f5f5; }
.row   { display: flex; flex-wrap: wrap; gap: 24px; margin-bottom: 24px; }
.card  { background: #fff; border-radius: 12px; padding: 20px; display: flex;
         flex-direction: column; align-items: center; gap: 10px;
         box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.card span { font-size: 13px; color: #555; }
progress-ring { width: 110px; height: 110px; }
input[type=range] { width: 140px; }
</style>
