<template>
  <div class="question-container">
    <h2>Question {{ questionId }}</h2>

    <p class="question-text">{{ question.text }}</p>

    <div class="answers">
      <button
        v-for="(answer, index) in question.answers"
        :key="index"
        :class="[
          'answer-button',
          isAdmin && index === question.correctIndex ? 'correct' : '',
        ]"
        @click="selectAnswer(index)"
        :disabled="!isAdmin && selectedAnswer !== null"
      >
        {{ answer }}
      </button>
    </div>

    <!-- Si admin → bouton pour question suivante -->
    <div v-if="isAdmin" class="admin-controls">
      <p class="admin-info">✅ Réponse correcte : <strong>{{ question.answers[question.correctIndex] }}</strong></p>
      <button class="next-button" @click="goToNextQuestion">➡️ Question suivante</button>
    </div>

    <!-- Si joueur → confirmation de choix -->
    <div v-else-if="selectedAnswer !== null" class="player-feedback">
      <p>Tu as sélectionné : <strong>{{ question.answers[selectedAnswer] }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'

// Simuler une base de questions
const questions = [
  {
    text: 'Quel est le plus grand océan du monde ?',
    answers: ['Atlantique', 'Indien', 'Pacifique', 'Arctique'],
    correctIndex: 2,
  },
  {
    text: 'Combien de continents y a-t-il ?',
    answers: ['5', '6', '7', '8'],
    correctIndex: 2,
  },
]

const route = useRoute()
const router = useRouter()

const roomCode = computed(() => route.query.room || '')
const questionId = computed(() => parseInt(route.params.id as string) || 1)
const currentUser = computed(() => route.query.user || '')
const isAdmin = computed(() => currentUser.value === 'admin')

const selectedAnswer = ref<number | null>(null)

const question = computed(() => {
  return questions[questionId.value - 1] || {
    text: 'Question non trouvée',
    answers: [],
    correctIndex: 0,
  }
})

const selectAnswer = (index: number) => {
  if (!isAdmin.value && selectedAnswer.value === null) {
    selectedAnswer.value = index
  }
}

const goToNextQuestion = () => {
  const next = questionId.value + 1
  router.push(`/quizs/${roomCode.value}/${next}?user=${currentUser.value}`)
}
</script>

<style scoped>
.question-container {
  max-width: 700px;
  margin: 60px auto;
  padding: 30px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.question-text {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.answer-button {
  padding: 10px 16px;
  background-color: #eee;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.answer-button:hover {
  background-color: #ddd;
}

.answer-button.correct {
  background-color: #c6f6d5;
  border: 2px solid #38a169;
  font-weight: bold;
}

.admin-controls,
.player-feedback {
  margin-top: 20px;
}

.next-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #C46FC8;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.admin-info {
  color: #333;
  font-size: 1rem;
}
</style>
