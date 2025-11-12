const STORAGE_KEY = 'typomaster-scores'

export function saveScore(wpm, errors, time) {
  const scores = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  scores.push({ wpm, errors, time, date: new Date().toISOString() })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

export function loadHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}
