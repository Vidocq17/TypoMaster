
<template>
  <div class="container">
    <Header />
    <div class="text-display" v-html="coloredText"></div>

    <textarea
      v-model="userInput"
      @input="checkInput"
      placeholder="Commence à taper ici..."
      class="input-area"
      @copy.prevent
      @paste.prevent
      @cut.prevent
    ></textarea>

    <Stats 
      :wpm="wpm"
      :errors="errorCount"
      :elapsedTime="elapsedTime"
    />

    <div class="buttons">
      <button @click="startTest">Démarrer</button>
      <button @click="stopTest">Arrêter</button>
      <button @click="toggleFullScreen">FullScreen</button>
    </div>

    <div class="levels">
      <button @click="changeLevel('easy')">Facile</button>
      <button @click="changeLevel('medium')">Moyen</button>
      <button @click="changeLevel('hard')">Dur</button>
    </div>

    <div v-if="finished" class="result">
      <p>{{ finishedMessage }}</p>
      <button @click="startTest">Recommencer</button>
    </div>

    <History :history="history" />
  </div>
</template>

<script setup>
import '../assets/style/main.css'
import { ref, computed, onMounted } from 'vue'

import Header from './Header.vue'
import Stats from './Stats.vue'
import History from './History.vue'

import easy from '../assets/json/easy.json'
import medium from '../assets/json/medium.json'
import hard from '../assets/json/hard.json'

const level = ref('medium')
const text = ref(getRandomText(level.value))
const userInput = ref('')
const errorCount = ref(0)
const elapsedTime = ref(0)
const stop = ref(false)
const finished = ref(false)
const inactivityTimer = ref(null)

let timer = null

onMounted(() => {
  if (!localStorage.getItem('typomaster-scores')) {
    localStorage.setItem('typomaster-scores', JSON.stringify([]))
    console.log('Aucun score trouvé, initialisation du localStorage.');
  }
  if (localStorage.getItem('typomaster-history')) {
    console.log('Historique trouvé dans le localStorage.', history.value);
  }
  console.log('Composant TypingTest monté, niveau actuel:', level.value);
})

function saveScore(wpm, errors, time) {
  const scores = JSON.parse(localStorage.getItem('typomaster-scores') || '[]')
  scores.push({ wpm, errors, time, date: new Date().toISOString() })
  localStorage.setItem('typomaster-scores', JSON.stringify(scores))
}


const finishedMessage = computed(() => {
  saveScore(wpm.value, errorCount.value, elapsedTime.value);
  return `Bravo ! Vous avez terminé le test en ${elapsedTime.value} secondes avec ${errorCount.value} erreurs.`
})

const coloredText = computed(() => {
    let result = '';
    const normalizedText = normalize(text.value);
    const normalizedInput = normalize(userInput.value);
    
    for (let i = 0; i < normalizedText.length; i++) {
        const correctChat = normalizedText[i];
        const typedChar = normalizedInput[i] || '';

        if (!typedChar) {
            result += `<span>${correctChat}</span>`;
        } else if (typedChar === correctChat) {
            result += `<span class='correct'">${correctChat}</span>`;
        } else {
            result += `<span class='incorrect'">${correctChat}</span>`;
        }
    }
    return result;
})

function normalize(str) {
  return str.replace(/’/g, "'").replace(/`/g, "'").replace(/œ/g, 'oe').replace(/æ/g, 'ae').toLowerCase();
}

function getRandomText(level) {
    let data = [];
    switch (level) {
      case 'easy':
          data = easy.quotes;
          break;
      case 'medium':
          data = medium.quotes;
          break;
      case 'hard':
          data = hard.quotes;
          break;
      default:
      return medium.quotes;
  }
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex].text;
}

function startTest() {
  userInput.value = ''
  errorCount.value = 0
  elapsedTime.value = 0
  clearInterval(timer)
  timer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
  userInput.value = '';
}

function pauseTest() {
  clearInterval(timer);
}

function stopTest() {
    if (timer === 60){
        finished.value = true;
        return;
    }
  clearInterval(timer)
  stop.value = true;

}

function stopTimer() {
  clearInterval(timer);
}

function changeLevel(selectedLevel) {
  level.value = selectedLevel;
  text.value = getRandomText(selectedLevel);
  startTest();
}

function checkInput() {
  const currentIndex = userInput.value.length - 1;

  if (currentIndex >= text.value.length) return;

  const expectedChar = normalize(text.value[currentIndex]);
  const typedChar = normalize(userInput.value[currentIndex]);

  if (typedChar !== expectedChar) {
    errorCount.value++;
  }

  if (normalize(userInput.value) === normalize(text.value)) {
    finished.value = true;
    saveScore(wpm.value, errorCount.value, elapsedTime.value)
    stopTimer();
  }
  resetInactivityTimer();
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
      document.exitFullscreen();
    }
}

function resetInactivityTimer() {
  if (inactivityTimer.value) {
    clearTimeout(inactivityTimer.value);
  }
  inactivityTimer.value = setTimeout(() => {
    pauseTest();
  }, 5000);
}
</script>
