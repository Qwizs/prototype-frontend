<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const route = useRoute();
const router = useRouter();

const room = computed(() => route.params.room as string);
const user = computed(() => route.query.user as string | undefined);

const maxPoints = 1000;
const maxDelay = 10000;

let startTime: number;
let answerTime: number | null = null;

const question = ref<{ question: string; options: string[]; correctOption: string } | null>(null);
const selectedOption = ref<string | null>(null);
const score = ref(0);
const currentQuestionScore = ref<number | null>(null); 
const perQuestionScores = ref<number[]>([]);

const allUsersResponded = ref(false);
const finalScores = ref<{ [user: string]: number }>({});
const answerRevealed = ref(false);
const correctOption = ref<string[] | null>(null);
const questionIndex = ref(0);
const progress = ref(100);

let progressInterval: ReturnType<typeof setInterval> | null = null;

const resetProgress = () => {
  progress.value = 100;
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (progress.value > 0) {
      progress.value -= 1;
    } else {
      clearInterval(progressInterval!);
      progressInterval = null;

      socket.emit('submitAnswer', {
        user: user.value,
        room: room.value,
        answer: selectedOption.value ?? null,
      });
    }
  }, 100);
};

const socket = io('http://localhost:4500', {
  transports: ['websocket', 'polling'],
});

const selectOption = (option: string) => {
  const delay = Date.now() - startTime;
  const clampedDelay = Math.min(delay, maxDelay);
  const speedRatio = 1 - clampedDelay / maxDelay;
  const earnedScore = Math.floor(maxPoints * speedRatio);

  if (!selectedOption.value && !answerRevealed.value) {
    selectedOption.value = option;
    socket.emit('submitAnswer', {
      user: user.value,
      room: room.value,
      answer: option,
      score: earnedScore,
    });
  }
};

onMounted(() => {
  socket.connect();

  if (room.value) {
    socket.emit('joinQuizRoom', { user: user.value, room: room.value });
  }

  socket.on('newQuestion', (data) => {
    question.value = data;
    startTime = Date.now();
    answerTime = null;
    selectedOption.value = null;
    allUsersResponded.value = false;
    answerRevealed.value = false;
    correctOption.value = null;
    currentQuestionScore.value = null;
    questionIndex.value += 1;
    resetProgress();
  });

  socket.on('allUsersResponded', () => {
    allUsersResponded.value = true;
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  });

  socket.on('revealAnswer', (data) => {
    answerRevealed.value = true;
    correctOption.value = data.correctOption;
    let earnedScore = 0;

    console.log(data.correctOption.includes(selectedOption.value.trim().toLowerCase()));
    
    if (
      selectedOption.value && data.correctOption.includes(selectedOption.value.trim().toLowerCase())
    ) {
      const delay = (answerTime ?? Date.now()) - startTime;
      const clampedDelay = Math.min(delay, maxDelay);
      const speedRatio = 1 - clampedDelay / maxDelay;
      earnedScore = Math.floor(maxPoints * speedRatio);
      score.value += earnedScore;
    }

    perQuestionScores.value.push(earnedScore);
    currentQuestionScore.value = earnedScore; 
  });

  socket.on('quizEnded', (scores) => {
    finalScores.value = scores;
    console.log(scores);
    
    router.push({
      path: `/quiz/${room.value}/result`,
      query: {
        user: user.value,
        score: score.value.toString(),
        scores: encodeURIComponent(JSON.stringify(scores)),
        history: encodeURIComponent(JSON.stringify(perQuestionScores.value)),
      },
    });
  });

  socket.on('exception', (data) => {
    console.error('Erreur:', data);
  });

  socket.on('disconnect', () => {
    console.log('Déconnecté');
  });
});

onBeforeUnmount(() => {
  socket.disconnect();
  if (progressInterval) clearInterval(progressInterval);
});


</script>

<template>
  <main class="game-wrap">

  
  <UContainer class="flex flex-col justify-start p-4 gap-4 bg-white text-black">
    <transition name="fade-slide" mode="out-in">
      <div v-if="question" :key="questionIndex" class="question-card">
        <div class="progress-bar-wrapper" v-if="!allUsersResponded">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>

        <h3 class="question-text">{{ question.question }}</h3>

        <div class="options-list">
          <div
            v-for="option in question.options"
            :key="option"
            @click="!selectedOption && !answerRevealed && selectOption(option)"
            :class="[
              'option-button',
              { 'selected': selectedOption === option },
              { 'correct': answerRevealed && correctOption?.includes(option) },
              { 'incorrect': answerRevealed && selectedOption === option && !correctOption?.includes(option) },
              { 'disabled-option': selectedOption && selectedOption !== option && !answerRevealed }
            ]"
          >
            {{ option }}
          </div>
        </div>

        <p v-if="answerRevealed && currentQuestionScore !== null" class="mt-4 text-sm text-gray-600">
          Tu as gagné {{ currentQuestionScore }} point{{ currentQuestionScore !== 1 ? 's' : '' }} sur cette question.
        </p>
      </div>
    </transition>
  </UContainer>

  </main>
</template>


<style scoped>

.game-wrap{
  padding-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-card {
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60vw;
}

.question-text {
  font-size: 2rem;
  font-weight: 600;
  color: #7b2e87;
  margin-bottom: 1.25rem;
}

.options-list {
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 12px;
}

.option-button {
  background-color: #fff;
  border: 2px solid #ddd;
  padding: 12px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-button:hover {
  background-color: #f5ecfa;
}

.option-button.selected {
  border-color: #c46fc8;
  background-color: #f0dbf8;
}

.option-button.correct {
  background-color: #c8f7d2;
  border-color: #4caf50;
  color: #2e7d32;
}

.option-button.incorrect {
  background-color: #f8d2d2;
  border-color: #f44336;
  color: #c62828;
}

.disabled-option {
  pointer-events: none;
  opacity: 0.5;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background-color: #f8effa;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-bar {
  height: 100%;
  background-color: #c46fc8;
  transition: width 0.1s linear;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>