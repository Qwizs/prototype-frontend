<template>
  <div>
    <main class="main-content">
      <div class="title-container">
        <img src="/assets/titre.png" alt="Mes Qwizs" class="page-title-image" />
      </div>
      
      <div class="quiz-wrapper">
        <img
          src="/assets/add_quiz.png"
          alt="Add Quiz"
          class="add-quiz-image"
          @click="addQuiz"
        />

        <div class="quiz-container">
          <div class="quiz-card" v-for="quiz in quizzes" :key="quiz.id" @click="launchQuiz(quiz.id)">
            <img :src="quiz.icon" alt="Quiz Icon" class="quiz-icon-full" />
            <p class="quiz-title">{{ quiz.title }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';

const router = useRouter();
const socket = io('http://localhost:4500');

const quizzes = reactive([
  { id: 1, title: "Premier Qwiz", icon: "/assets/quiz-icon.png" },
  { id: 2, title: "Deuxième Qwiz", icon: "/assets/quiz-icon.png" },
]);

const addQuiz = () => {
  const newId = quizzes.length + 1;
  quizzes.push({
    id: newId,
    title: `Nouveau Qwiz ${newId}`,
    icon: "/assets/quiz-icon.png",
  });
};

const launchQuiz = (quizId: number) => {
  socket.emit('generateQuizCode', quizId);

  socket.on('quizCodeGenerated', (code) => {
    router.push(`/quiz/${code}/waiting/?user=admin`);
  });
};
</script>

<style>
.main-content {
  padding: 40px;
  text-align: center;
  background-color: #ffffff;
}

.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.page-title-image {
  width: 300px;
  height: auto;
}

.quiz-wrapper {
  position: relative; 
  border: 2px solid #f7f7f7; 
  border-radius: 15px; 
  padding: 20px;
  background: #ffffff; 
  margin: 0 auto;
  max-width: 800px; 
}


.add-quiz-image {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: transform 0.2s ease;
  z-index: 10;
}
.add-quiz-image:hover {
  transform: scale(1.1);
}

.quiz-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 0 20px;
  background: #ffffff; 
}

.quiz-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: #ffffff !important;
  border-radius: 15px;
  box-shadow: none; 
  width: 220px;
  height: 220px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.quiz-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.quiz-icon-full {
  width: 100%;
  height: 150px;
  object-fit: contain;
}

.quiz-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #6c546c;
  text-align: center;
  margin: 10px 0;
}

.add-quiz-image {
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.add-quiz-image:hover {
  transform: scale(1.1);
}

</style>