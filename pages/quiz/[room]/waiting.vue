<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import QRCode from 'qrcode';

const route = useRoute();
const router = useRouter();

const quizCode = computed(() => route.params.room as string);
const user = computed(() => route.query.user as string | undefined);
const socket = io('http://localhost:4500');

const participants = ref<string[]>([]);
const isAdmin = computed(() => user.value === 'admin');
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
    router.push(`/quiz/${quizCode.value}/game?user=${user.value}`);
  });

  generateQRCode();
});

onBeforeUnmount(() => {
  socket.disconnect();
});

const startQuiz = () => {
  console.log("here");
  
  socket.emit('startQuiz', quizCode.value);
};

const generateQRCode = () => {
  const url = `http://localhost:3000/join?code=${quizCode.value}`;
  QRCode.toDataURL(url, (err: any, url: string) => {
    if (err) throw err;
    qrCodeUrl.value = url;
  });
};
</script>

<template>
  <div class="waiting-room">
    <h1>Bienvenue dans la salle d’attente</h1>
    <p class="quiz-code">Code du quiz : <strong>{{ quizCode }}</strong></p>
    <p class="status">👥 {{ participants.length }} participant(s) connecté(s)</p>

    <div class="qr-section">
      <h2>Scannez pour rejoindre</h2>
      <img :src="qrCodeUrl" alt="QR Code pour rejoindre" class="qr-img" />
    </div>

    <div class="participants-section" v-if="participants.length">
      <h3>Participants :</h3>
      <div class="participants-grid">
        <div class="participant-card" v-for="participant in participants" :key="participant">
          👤 {{ participant }}
        </div>
      </div>
    </div>

    <div class="admin-actions" v-if="isAdmin && participants.length >= 2">
      <button @click="startQuiz" class="start-btn">🚀 Démarrer le quiz</button>
    </div>
  </div>
</template>

<style scoped>
.waiting-room {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px 25px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  font-size: 2rem;
  color: #C46FC8;
  margin-bottom: 10px;
}

.quiz-code {
  font-size: 1.2rem;
  color: #444;
  margin-bottom: 6px;
}

.status {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 16px;
}

.qr-section {
  margin: 20px 0;
}

.qr-section h2 {
  font-size: 1rem;
  margin-bottom: 10px;
  color: #444;
}

.qr-img {
  max-width: 150px;
  margin: 0 auto;
  border: 4px solid #eee;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.participants-section {
  margin: 20px 0;
}

.participants-section h3 {
  color: #C46FC8;
  margin-bottom: 14px;
  font-size: 1rem;
}

.participants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  padding: 0 10px;
}

.participant-card {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 12px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.participant-card:hover {
  transform: scale(1.05);
}

.admin-actions {
  margin-top: 24px;
}

.start-btn {
  background-color: #C46FC8;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-btn:hover {
  background-color: #a850aa;
}
</style>