<template>
  <div>
    <main class="main-content">
      <div class="title-container">
        <img src="/assets/logo-themes.png" alt="Thèmes de Qwizs" class="page-title-image" />
      </div>

      <div class="quiz-container">
        <div
          class="quiz-card"
          v-for="quiz in quizzes"
          :key="quiz.idQuiz"
          @click="goToQuiz(quiz.idQuiz)"
        >
          <img src="/assets/quiz-icon.png" alt="Quiz Icon" class="quiz-icon-full" />
          <p class="quiz-category">Auteur : {{ getAuthorUsername(quiz.idQuiz) }}</p>
          <p class="quiz-category">Catégorie : {{ getCategoryName(quiz.idCategory) }}</p>
          <p class="quiz-title">{{ quiz.name }}</p>
          <div class="button-container">
            <button @click="launchQuiz(quiz.id)" class="btn start-btn">Start</button>     
          </div>
        </div>
      </div>
    </main> <!-- doit être fermé ici -->
  </div> <!-- div racine fermée ici -->
</template>



<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {io} from 'socket.io-client'

const router = useRouter();

const quizzes = ref([]); // devient un ref pour la mise à jour dynamique
const categories = ref([]);
const administratorQuizLinks = ref([]);
const administrators = ref([]);


function getAuthorUsername(idQuiz) {
  const link = administratorQuizLinks.value.find(link => link.idQuiz === idQuiz);
  if (!link) return "inconnu";

  const admin = administrators.value.find(a => a.idAdministrator === link.idAdministrator);
  return admin ? admin.username : "inconnu";
}


const loadAdministratorQuizLinks = async () => {
  const { data, error } = await useFetch(`/administrator-quiz/all`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (!error.value && data.value) {
    administratorQuizLinks.value = data.value;
  } else {
    console.error("Erreur lors du chargement des liens administrator-quiz");
  }
};

const loadAdministrators = async () => {
  const { data, error } = await useFetch(`/administrators/all`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (!error.value && data.value) {
    administrators.value = data.value;
  } else {
    console.error("Erreur lors du chargement des administrateurs");
  }
};


// Fonction pour charger les quiz depuis l'API
const loadQuizzes = async () => {
  const { data, error } = await useFetch(`/quiz/all`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (error.value || !data.value) {
    console.error("Erreur lors de la récupération de l'administrateur");
    return;
  }

  console.log("Liste de quiz :", data.value);

  const quizList = [];

  for (const link of data.value) {
    const { data: quiz, error: quizFetchError } = await useFetch(`/quiz/${link.idQuiz}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'GET',
    });

  if (quizFetchError.value) {
    console.error(`Erreur lors de la récupération du quiz ${link.idQuiz}`);
    continue;
  }

  if (quiz.value) {
    quizList.push(quiz.value);
  }
}

console.log("Quiz complets :", quizList);
// Tu peux maintenant les stocker dans une variable réactive pour le template
quizzes.value = quizList;

};

function getCategoryName(idCategory) {
  for (let i = 0; i < categories.value.length; i++) {
    if (categories.value[i].idCategory === idCategory) {
      return categories.value[i].name;
    }
  }
  return 'inconnue';
}

const loadCategories = async () => {
  const { data, error } = await useFetch(`/categories/all`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (error.value || !data.value) {
    console.error("Erreur lors de la récupération des catégories");
    return;
  }

  categories.value = data.value;
  console.log("Liste de catégories:", data.value);
  console.log("Cat :", categories.value[0].name);
};


onMounted(() => {
  loadQuizzes();
  loadCategories();
  loadAdministratorQuizLinks();
  loadAdministrators();
});

const goToQuiz = (quizId) => {
  router.push(`/display-questions/${quizId}`); 
};

const socket = io('http://localhost:4500/')

const launchQuiz = (quizId) => {
  console.log("here");
  
  socket.emit('generateQuizCode', quizId)
  console.log("here 2");
  
  socket.on('quizCodeGenerated', (code)=> {
    router.push(`/quiz/${code}/waiting?user=admin`);
  })
};


</script>

<style>

.button-container {
  display: flex;
  gap: 1rem; /* espace entre les boutons */
}

.btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.4rem;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  color: white;
  transition: background-color 0.2s ease;
}

.start-btn {
  background-color: #28a745; /* Vert */
}

.start-btn:hover {
  background-color: #218838;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fond sombre et opaque */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Assure que l'overlay soit au-dessus du contenu */
  backdrop-filter: blur(5px); /* Applique un flou sur l'arrière-plan */
}


.modal {
  background: #fff;
  padding: 20px;
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

.main-content {
  padding-top: 100px;
  text-align: center;
  background-color: #ffffff;
}

.quiz-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 3px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #000000;
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

.quiz-category {
  font-size: 0.75rem; /* plus petit que le titre */
  color: #888;
  margin-top: 10px;
  margin-bottom: 2px;
  font-family: 'Poppins', sans-serif;
}


</style>

