<template>
  <div class="history">
    <h2>Historique</h2>
    <ul>
      <li v-for="(item, index) in history" :key="index">
        {{ item.date }} ➔ WPM: {{ item.wpm }} | Erreurs: {{ item.errors }} | Temps: {{ item.time }}s
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loadHistory } from '../services/storageService'

const history = ref([])

onMounted(() => {
  history.value = loadHistory()
})
</script>

<style scoped>
.history {
  margin-top: 2rem;
}
</style>
