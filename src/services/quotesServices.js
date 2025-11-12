import easy from '../assets/json/easy.json'
import medium from '../assets/json/medium.json'
import hard from '../assets/json/hard.json'

export function getRandomText(level) {
  let data = []
  switch (level) {
    case 'easy': data = easy.quotes; break
    case 'medium': data = medium.quotes; break
    case 'hard': data = hard.quotes; break
    default: data = medium.quotes
  }
  const randomIndex = Math.floor(Math.random() * data.length)
  return data[randomIndex].text
}
