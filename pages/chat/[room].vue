// 🛠️ Classe de test temporaire pour expérimenter le socket.
// ⚠️ Ne sert à rien – utilisée uniquement pour tester les connexions socket.io.
// TODO: À supprimer une fois les tests terminés.

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const route = useRoute()
const room = computed(() => route.params.room as string)
const user = computed(() => route.query.user as string | undefined)

if (!user.value) {
  console.error('User is undefined');
}

const socket = io(`chat-api.oracle.aquabx.ovh`)

const messages = ref<{ user: string, message: string }[]>([])
const messageInput = ref('')

onMounted(() => {
  socket.connect()
  if (user.value && room.value) {
    socket.emit('connectionRoom', { user: user.value, room: room.value })
    socket.emit('userJoined', { user: user.value, room: room.value })

  }

  socket.on('events', (data) => {
    messages.value.push(data)
  })

  socket.on('exception', (data) => {
    console.log('Erreur:', data)
  })

  socket.on('disconnect', () => {
    console.log('Déconnecté')
  })
})

onBeforeUnmount(() => {
  socket.disconnect()
})

const sendMessage = () => {
  if (!messageInput.value.trim()) return
  socket.emit('events', { user: user.value, message: messageInput.value, room: room.value })
  messageInput.value = ''
}
</script>

<template>
  <UContainer class="min-h-screen flex flex-col justify-end p-4 gap-4 bg-white text-black">
    <h2 class="text-2xl font-bold mb-4">Chat Room: {{ room }}</h2>

    <UContainer class="flex-1 overflow-y-auto space-y-2">
  <UCard v-for="msg in messages" :key="msg.message" 
         :class="msg.user === 'server' ? 'bg-gray-700 text-white' : 'bg-blue-500 text-white'"
         class="w-full rounded-lg shadow-md p-3">
    
    <template #header>
      <h2 class="text-lg font-semibold">{{ msg.user }}</h2>
    </template>

    <p class="text-md">{{ msg.message }}</p>
  </UCard>
</UContainer>


    <div class="flex gap-2">
      <UInput v-model="messageInput" placeholder="Écrire un message..." class="flex-1 text-black border-gray-400" />
      <UButton @click="sendMessage" class="bg-blue-500 hover:bg-blue-700 text-white">Envoyer</UButton>
    </div>
  </UContainer>
</template>


