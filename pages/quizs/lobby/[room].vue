<template>
  <div class="lobby-container">
    <h1>Bienvenue dans la salle d'attente</h1>
    <p>Code du quiz : <strong>{{ roomCode }}</strong></p>
    <p>En attente des participants...</p>

    <div class="participants" v-if="isAdmin && participants.length">
      <h3>Participants :</h3>
      <ul>
        <li v-for="(user, index) in participants" :key="index">
          ✅ {{ user }}
        </li>
      </ul>
    </div>

    <div v-if="isAdmin" class="start-button-container">
      <button class="start-button" @click="startQuiz">
        🚀 Commencer le quiz
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { io } from 'socket.io-client'

const router = useRouter()
const route = useRoute()
const roomCode = computed(() => route.params.room || '')
const currentUser = computed(() => route.query.user || '')
const isAdmin = computed(() => currentUser.value === 'admin')

const participants = ref<string[]>([])
const socket = io(`chat-api.oracle.aquabx.ovh`)

onMounted(() => {
  socket.connect()

  if (currentUser.value && roomCode.value) {
    socket.emit('connectionRoom', { user: currentUser.value, room: roomCode.value })
    socket.emit('userJoined', { user: currentUser.value, room: roomCode.value })
    socket.emit('events', {
      user: 'server',
      message: `${currentUser.value} joined`,
      room: roomCode.value
    })
    socket.emit('whoIsHere', { room: roomCode.value, user: currentUser.value })
  }

  socket.on('userJoined', ({ user }) => {
    if (user && !participants.value.includes(user) && user !== 'admin') {
      participants.value.push(user)
    }
  })

  socket.on('whoIsHere', ({ user }) => {
    socket.emit('hereIs', {
      to: user,
      users: participants.value,
      room: roomCode.value
    })
  })

  socket.on('hereIs', ({ users }) => {
    if (Array.isArray(users)) {
      users.forEach(user => {
        if (user && !participants.value.includes(user) && user !== 'admin') {
          participants.value.push(user)
        }
      })
    }
  })

  socket.on('events', ({ user, message }) => {
    if (user === 'server' && message.includes('joined')) {
      const joinedUser = message.split(' ')[0]
      if (
        joinedUser &&
        !participants.value.includes(joinedUser) &&
        joinedUser !== 'admin'
      ) {
        participants.value.push(joinedUser)
      }
    }
  })

  // les clients écoutent : redirection vers la 1 ere question
  socket.on('startQuiz', async () => {
  const target = `/quizs/lobby/start/1?room=${roomCode.value}&user=${currentUser.value}`
  router.push(target)
})


  socket.on('disconnect', () => {
    console.log('Déconnecté')
  })
})

onBeforeUnmount(() => {
  socket.disconnect()
})

const startQuiz = () => {
  console.log('➡️ Admin clique sur "Commencer le quiz"')
  socket.emit('startQuiz', { room: roomCode.value })
}
</script>

<style scoped>
.lobby-container {
  max-width: 600px;
  margin: 80px auto;
  padding: 30px;
  background: #fff;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #C46FC8;
  font-size: 2rem;
  margin-bottom: 10px;
}

strong {
  font-size: 1.4rem;
  color: #333;
}

.participants {
  margin-top: 20px;
  text-align: left;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
}

.participants h3 {
  margin-bottom: 10px;
  color: #C46FC8;
}

.start-button-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.start-button {
  padding: 12px 24px;
  background-color: #C46FC8;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button:hover {
  background-color: #a850aa;
}
</style>
