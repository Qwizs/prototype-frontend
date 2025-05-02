<script setup lang="ts">
import { useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import QRCode from 'qrcode';

const route = useRoute();
const router = useRouter();
const quizCode = computed(() => route.params.room as string);
const user = computed(() => route.query.user as string | undefined);
const socket = io('http://localhost:4500');
const participants = ref<string[]>([]);
const isAdmin = ref(user.value === 'admin');
const qrCodeUrl = ref('');

onMounted(() => {
  socket.emit('joinWaitingRoom', { user: user.value, quizCode: quizCode.value });

  socket.on('currentParticipants', (currentParticipants) => {
    participants.value = currentParticipants;
  });

  socket.on('userJoined', (username) => {
  if (!participants.value.includes(username)) {
    participants.value.push(username);
  }
});

  socket.on('startQuiz', () => {
    // Rediriger vers la page du quiz
    router.push(`/quiz/${quizCode.value}/game?user=${user.value}`);
  });

  // Générer le QR code lorsque le composant est monté
  generateQRCode();
});

onBeforeUnmount(() => {
  socket.disconnect();
});

const startQuiz = () => {
  socket.emit('startQuiz', quizCode.value);
};

const generateQRCode = () => {
  const url = `http://localhost:3000/join?code=${quizCode.value}`;
  QRCode.toDataURL(url, (err:any, url:string) => {
    if (err) throw err;
    qrCodeUrl.value = url;
  });
};
</script>

<template>
  <div>
    <h1>Waiting Room</h1>
    <p>Quiz Code: {{ quizCode }}</p>
    <ul>
      <li v-for="participant in participants" :key="participant">{{ participant }}</li>
    </ul>
    <button @click="startQuiz" v-if="isAdmin && participants.length >= 2">
  Start Quiz
</button>
    <div>
      <h2>Scan to Join</h2>
      <img :src="qrCodeUrl" alt="QR Code" />
    </div>
  </div>
</template>

<style>
img {
  max-width: 150px;
  margin-top: 1rem;
}
</style>
