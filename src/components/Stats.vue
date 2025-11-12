<template>
  <div class="stats">
    <p>⏱ Temps écoulé : {{ elapsedTime }}s</p>
    <p>❌ Erreurs : {{ errorCount }}</p>
    <p>⚡ WPM : {{ wpm }}</p>
  </div>
</template>

<script setup>
defineProps({
  elapsedTime: Number,
  errorCount: Number,
  wpm: Number
})
</script>

<style scoped>
.stats {
  margin: 1rem 0;
  font-weight: bold;
}
</style>
