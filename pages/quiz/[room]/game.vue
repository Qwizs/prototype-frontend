<script setup lang="ts">
import { useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const route = useRoute();
const room = computed(() => route.params.room as string);
const user = computed(() => route.query.user as string | undefined);

const socket = io(`http://localhost:4500`);

const question = ref<{ question: string; options: string[]; correctOption: string } | null>(null);
const selectedOption = ref<string | null>(null);
const score = ref(0);
const allUsersResponded = ref(false);
const finalScores = ref<{ [user: string]: number }>({});

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
  });

  socket.on('allUsersResponded', () => {
    allUsersResponded.value = true;
  });

  socket.on('revealAnswer', (data) => {
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
          <button @click="selectOption(option)" :disabled="allUsersResponded">
            {{ option }}
          </button>
        </li>
      </ul>
    </div>

    <div v-if="allUsersResponded">
      <p>Waiting for the next question...</p>
    </div>

    <div v-if="Object.keys(finalScores).length > 0">
      <h3>Final Scores:</h3>
      <ul>
        <li v-for="([user, score], index) in sortedScores" :key="index">
          {{ user }}: {{ score }}
        </li>
      </ul>
    </div>

    <p>Score: {{ score }}</p>
  </UContainer>
</template>