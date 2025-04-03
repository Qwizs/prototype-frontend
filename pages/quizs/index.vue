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
          @click="openModal"
        />

        <div class="quiz-container">
          <div class="quiz-card" 
            v-for="quiz in quizzes" 
            :key="quiz.id"
            @click="goToQuiz(quiz.id)">
          <img :src="quiz.icon" alt="Quiz Icon" class="quiz-icon-full" />
          <p class="quiz-title">{{ quiz.title }}</p>
        </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Choisissez un nom pour votre quiz</h2>
        <input v-model="newQuizName" type="text" placeholder="Nom du quiz" class="quiz-input" />
        <div class="modal-actions">
          <button @click="addQuiz" class="btn-primary">Créer</button>
          <button @click="closeModal" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter(); 

const quizzes = reactive([
  { id: 1, title: "Premier Qwiz", icon: "/assets/quiz-icon.png" },
  { id: 2, title: "Deuxième Qwiz", icon: "/assets/quiz-icon.png" },
]);

const showModal = ref(false);
const newQuizName = ref("");

const openModal = () => {
  showModal.value = true;
  newQuizName.value = ""; 
};


const closeModal = () => {
  showModal.value = false;
};

const addQuiz = () => {
  if (newQuizName.value.trim() === "") return; 

  const newId = quizzes.length + 1;
  quizzes.push({
    id: newId,
    title: newQuizName.value,
    icon: "/assets/quiz-icon.png",
  });

  closeModal(); 
};

const goToQuiz = (quizId) => {
  router.push(`/quizs/${quizId}`); 
};

</script>

<style>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  width: 400px;
}

.modal h2 {
  font-size: 1rem;
  font-weight: bold; 
  color: #6C546C; 
  margin-bottom: 15px; 
  font-family: 'Poppins', sans-serif;
}

.quiz-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 3px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #ffffff;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.btn-primary {
  background: #C46FC8;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-secondary {
  background: #ccc;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #86218B;
}

.btn-secondary:hover {
  background: #bbb;
}

.main-content {
  margin-top: 80px; 
  padding-top: 100px;
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
