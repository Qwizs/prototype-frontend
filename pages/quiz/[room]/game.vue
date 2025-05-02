<script setup lang="ts">
import { useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const route = useRoute();
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

const sortedScores = computed(() => {
  return Object.entries(finalScores.value).sort((a, b) => b[1] - a[1]);
});

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
  });

  socket.on('allUsersResponded', () => {
    allUsersResponded.value = true;
  });

  socket.on('revealAnswer', (data) => {
    answerRevealed.value = true;
    correctOption.value = data.correctOption;
    if (selectedOption.value === data.correctOption) {
      score.value += 1;
    }
  });

  socket.on('quizEnded', (scores) => {
    finalScores.value = scores;
  });

  socket.on('exception', (data) => {
    console.log('Erreur:', data);
  });

  socket.on('disconnect', () => {
    console.log('Déconnecté');
  });
});

onBeforeUnmount(() => {
  socket.disconnect();
});

const selectOption = (option: string) => {
  selectedOption.value = option;
  socket.emit('submitAnswer', { user: user.value, room: room.value, answer: option });
};
</script>

<template>
  <UContainer class="min-h-screen flex flex-col justify-start p-4 gap-4 bg-white text-black">
    <h2 class="text-2xl font-bold mb-4">Let's play quiz</h2>

    <div v-if="question">
      <h3>{{ question.question }}</h3>
      <ul>
        <li v-for="option in question.options" :key="option">
          <button
            @click="selectOption(option)"
            :disabled="!!selectedOption || allUsersResponded"
            :class="{
              'bg-green-200': answerRevealed && option === correctOption,
              'bg-red-200': answerRevealed && selectedOption === option && option !== correctOption,
              'bg-gray-200': selectedOption !== option && !answerRevealed,
            }"
            class="p-2 rounded my-1"
          >
            {{ option }}
          </button>
        </li>
      </ul>
    </div>

    <div v-if="allUsersResponded && !finalScores">
      <p>Waiting for next question...</p>
    </div>

    <div v-if="Object.keys(finalScores).length > 0">
      <h3 class="mt-4 font-bold">Final Scores:</h3>
      <ul>
        <li v-for="([username, scoreVal], index) in sortedScores" :key="index">
          {{ username }}: {{ scoreVal }}
        </li>
      </ul>
    </div>

    <p class="mt-4">Your score: {{ score }}</p>
  </UContainer>
</template>
