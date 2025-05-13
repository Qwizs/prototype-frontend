
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import confetti from 'canvas-confetti';

const route = useRoute();
const score = computed(() => Number(route.query.score));
const user = computed(() => route.query.user as string);
type ScoreMap = { [username: string]: number };

const rawScores = computed<ScoreMap>(() =>
  JSON.parse(decodeURIComponent(route.query.scores as string)) as ScoreMap
);
const sortedScores = computed(() =>
  Object.entries(rawScores.value).sort((a, b) => b[1] - a[1])
);

const confettiCanvas = ref<HTMLCanvasElement | null>(null);
const loaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    loaded.value = true;
  }, 300);

  if (confettiCanvas.value) {
    const myConfetti = confetti.create(confettiCanvas.value, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
    });

    let interval = setInterval(() => {
      myConfetti({
        particleCount: 40,
        angle: 60 + Math.random() * 60,
        spread: 60,
        origin: { y: 0.3 },
      });
    }, 1000);

    setTimeout(() => clearInterval(interval), 4000);
  }
});
</script>

<template>
  <UContainer class="min-h-screen flex flex-col items-center justify-center bg-[#fdf7ff] text-black p-8">
    <transition name="fade-pop" appear>
      <div class="text-center" v-if="loaded">
        <h1 class="text-4xl font-extrabold text-[#7b2e87] mb-4 animate-bounce">🎉 Quiz terminé !</h1>
        <p class="text-lg">Bravo <strong>{{ user }}</strong> !</p>
        <p class="text-2xl font-bold mt-2 text-[#7b2e87]">
          Ton score : <span class="text-[#c46fc8]">{{ score }} point{{ score !== 1 ? 's' : '' }}</span>
        </p>

        <h2 class="text-xl font-semibold mt-8 mb-2 text-[#7b2e87]">🏆 Classement</h2>
        <ul class="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden divide-y divide-gray-200">
          <li
            v-for="([username, scoreVal], index) in sortedScores"
            :key="index"
            class="flex justify-between items-center px-6 py-4 hover:bg-[#f5ecfa] transition"
          >
            <span class="font-medium text-gray-800">
              {{ index + 1 }}. {{ username }}
            </span>
            <span class="text-[#c46fc8] font-semibold">{{ scoreVal }} pts</span>
          </li>
        </ul>

        <div class="mt-10 flex gap-4 justify-center">
          <router-link
            to="/"
            class="bg-[#c46fc8] hover:bg-[#b255b8] text-white font-bold py-2 px-6 rounded-xl transition shadow-md"
          >
            Retour à l'accueil
          </router-link>
        </div>
      </div>
    </transition>

    <canvas ref="confettiCanvas" class="fixed inset-0 pointer-events-none z-50"></canvas>
  </UContainer>
</template>

<style scoped>
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