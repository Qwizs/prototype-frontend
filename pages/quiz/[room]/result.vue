<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import confetti from 'canvas-confetti'

const route = useRoute()

const score = computed(() => Number(route.query.score))
const user = computed(() => route.query.user as string)

type ScoreMap = { [username: string]: number }

const rawScores = computed<ScoreMap>(() =>
  JSON.parse(decodeURIComponent(route.query.scores as string)) as ScoreMap
)

const sortedScores = computed(() =>
  Object.entries(rawScores.value).sort((a, b) => b[1] - a[1])
)

const winner = computed(() => sortedScores.value[0]?.[0] === user.value)

const rawHistory = computed(() =>
  JSON.parse(decodeURIComponent(route.query.history as string)) as number[]
)

const confettiCanvas = ref<HTMLCanvasElement | null>(null)
const loaded = ref(false)

const audio = new Audio('/sounds/victory.mp3')

onMounted(() => {
  setTimeout(() => {
    loaded.value = true

    const top3 = sortedScores.value.slice(0, 3).map(([name]) => name)
    if (top3.includes(user.value)) {
      audio.play().catch(() => {
        console.warn('Audio autoplay bloqué')
      })
    }
  }, 300)

  if (confettiCanvas.value) {
    const myConfetti = confetti.create(confettiCanvas.value, {
      resize: true,
      useWorker: true,
    })

    myConfetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } })

    const interval = setInterval(() => {
      myConfetti({
        particleCount: 40,
        angle: 60 + Math.random() * 60,
        spread: 60,
        origin: { y: 0.3 },
      })
    }, 1000)

    setTimeout(() => clearInterval(interval), 6000)
  }
})
</script>

<template>
  <UContainer class="min-h-screen flex flex-col items-center justify-center bg-[#fdf7ff] text-black p-8">
    <transition name="fade-pop" appear>
      <div class="text-center w-full max-w-3xl" v-if="loaded">
        <h1 class="text-4xl font-extrabold text-[#7b2e87] mb-4 animate-bounce">🎉 Quiz terminé !</h1>

        <p class="text-lg">
          <template v-if="winner">
            🥳 <strong>{{ user }}</strong>, tu es le grand gagnant ! Bravo !
          </template>
          <template v-else>
            Bien joué <strong>{{ user }}</strong> ! Tu peux faire encore mieux la prochaine fois.
          </template>
        </p>

        <p class="text-2xl font-bold mt-2 text-[#7b2e87]">
          Ton score : <span class="text-[#c46fc8]">{{ score }} point{{ score !== 1 ? 's' : '' }}</span>
        </p>

        <h2 class="text-xl font-semibold mt-10 mb-6 text-[#7b2e87]">🏆 Podium</h2>
        <div class="flex justify-center items-end gap-10 mb-20">

          <div class="flex flex-col items-center">
          <div class="w-28 h-28 border-4 border-gray-300 rounded-full flex items-center justify-center shadow-md">
            <span class="text-5xl">🥈</span>
          </div>
          <p class="mt-3 font-semibold text-[#7b2e87]">{{ sortedScores[1]?.[0] }}</p>
          <p class="text-sm text-gray-600">{{ sortedScores[1]?.[1] }} pts</p>
        </div>

        <div class="flex flex-col items-center -mb-6 scale-110">
          <div class="w-32 h-32 border-4 border-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <span class="text-6xl">🥇</span>
          </div>
          <p class="mt-3 font-semibold text-[#7b2e87]">{{ sortedScores[0]?.[0] }}</p>
          <p class="text-sm text-gray-600">{{ sortedScores[0]?.[1] }} pts</p>
        </div>

        <div class="flex flex-col items-center">
          <div class="w-24 h-24 border-4 border-amber-600 rounded-full flex items-center justify-center shadow-md">
            <span class="text-4xl">🥉</span>
          </div>
          <p class="mt-3 font-semibold text-[#7b2e87]">{{ sortedScores[2]?.[0] }}</p>
          <p class="text-sm text-gray-600">{{ sortedScores[2]?.[1] }} pts</p>
        </div>

        </div>

        <div v-if="sortedScores.length > 3" class="w-full max-w-md mx-auto mt-12">
          <h3 class="text-lg font-semibold mb-2 text-[#7b2e87]">Autres participants</h3>
          <ul class="bg-white rounded-xl shadow divide-y divide-gray-200">
            <li
              v-for="([username, scoreVal], index) in sortedScores.slice(3)"
              :key="username"
              class="flex items-center justify-between px-6 py-3 text-sm font-medium text-gray-700"
            >
              <div class="flex items-center gap-2">
                <span class="text-[#c46fc8] font-bold">{{ index + 4 }}.</span>
                <span class="font-semibold text-gray-800">{{ username }}</span>
              </div>
              <span class="text-[#c46fc8] font-semibold">{{ scoreVal }} pts</span>
            </li>

          </ul>
        </div>

        <router-link
          to="/"
          class="mt-8 inline-block bg-[#c46fc8] hover:bg-[#b255b8] text-white font-bold py-2 px-6 rounded-xl transition shadow-md"
        >
          Retour à l'accueil
        </router-link>
      </div>
    </transition>

    <canvas ref="confettiCanvas" class="fixed inset-0 pointer-events-none z-50"></canvas>
  </UContainer>
</template>


<style scoped>

.scale-110 {
  transform: scale(1.2);
}

.fade-pop-enter-active {
  animation: fadePop 0.8s ease-out;
}
@keyframes fadePop {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-bounce {
  animation: bounce 1s infinite alternate;
}
@keyframes bounce {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-10px);
  }
}
</style>
