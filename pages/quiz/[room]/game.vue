<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const route = useRoute();
const router = useRouter();

const room = computed(() => route.params.room as string);
const user = computed(() => route.query.user as string | undefined);

const socket = io('http://localhost:4500', {
  transports: ['websocket', 'polling'],
});

const question = ref<{ question: string; options: string[]; correctOption: string } | null>(null);
const selectedOption = ref<string | null>(null);
const score = ref(0);
const allUsersResponded = ref(false);
const finalScores = ref<{ [user: string]: number }>({});
const answerRevealed = ref(false);
const correctOption = ref<string | null>(null);

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

onMounted(() => {
  socket.connect();

  if (room.value) {
    socket.emit('joinQuizRoom', { user: user.value, room: room.value });
  }

  socket.on('newQuestion', (data) => {
    question.value = data;
    selectedOption.value = null;
    allUsersResponded.value = false;
    answerRevealed.value = false;
    correctOption.value = null;
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

    if (
      selectedOption.value?.trim().toLowerCase() ===
      data.correctOption.trim().toLowerCase()
    ) {
      score.value += 1;
    }
  });

  socket.on('quizEnded', (scores) => {
    finalScores.value = scores;
    router.push({
      path: `/quiz/${room.value}/result`,
      query: {
        user: user.value,
        score: score.value.toString(),
        scores: encodeURIComponent(JSON.stringify(scores)),
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

const selectOption = (option: string) => {
  if (!selectedOption.value && !answerRevealed.value) {
    selectedOption.value = option;
    socket.emit('submitAnswer', { user: user.value, room: room.value, answer: option });
  }
};
</script>

<template>
  <UContainer class="min-h-screen flex flex-col justify-start p-4 gap-4 bg-white text-black">

    <transition name="fade-slide" mode="out-in">
      <div v-if="question" :key="questionIndex" class="question-card">
        <div class="progress-bar-wrapper" v-if="!allUsersResponded">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>

        <h3 class="question-text">{{ question.question }}</h3>

        <ul class="options-list">
          <li
            v-for="option in question.options"
            :key="option"
            @click="!selectedOption && !answerRevealed && selectOption(option)"
            :class="[ 
              'option-button',
              { 'selected': selectedOption === option },
              { 'correct': answerRevealed && option === correctOption },
              { 'incorrect': answerRevealed && selectedOption === option && option !== correctOption },
              { 'disabled-option': selectedOption && selectedOption !== option && !answerRevealed }
            ]"
          >
            {{ option }}
          </li>
        </ul>
      </div>
    </transition>

  </UContainer>
</template>

<style scoped>
.question-card {
  background: #fdf7ff;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 4px 15px rgba(196, 111, 200, 0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.question-text {
  font-size: 1.4rem;
  font-weight: 600;
  color: #7b2e87;
  margin-bottom: 20px;
}

.options-list {
  display: grid;
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
  background-color: #eee;
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
