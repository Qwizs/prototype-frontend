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
            :key="quiz.idQuiz"
            @click="goToQuiz(quiz.idQuiz)">
          <img src="/assets/quiz-icon.png" alt="Quiz Icon" class="quiz-icon-full" />
          <p class="quiz-title">{{ quiz.name }}</p>
          <!-- <p class="quiz-category">{{ quiz.name }}</p> -->
        </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Choisissez un nom pour votre quiz</h2>
        <input v-model="newQuizName" type="text" placeholder="Nom du quiz" class="quiz-input" />
        <select v-model="selectedCategoryId" class="quiz-select">
          <option disabled value="">Choisissez une catégorie</option>
          <option
            v-for="category in categories"
            :key="category.idCategory"
            :value="category.idCategory"
          >
            {{ category.name }}
          </option>
        </select>
        <div class="modal-actions">
          <button @click="addQuiz" class="btn-primary">Créer</button>
          <button @click="closeModal" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const quizzes = ref([]); // devient un ref pour la mise à jour dynamique
const categories = ref([]);
const selectedCategoryId = ref('');

const showModal = ref(false);
const newQuizName = ref("");

const storedUsername = localStorage.getItem('username');
const storedPassword = localStorage.getItem('password');

// Fonction pour charger les quiz depuis l'API
const loadQuizzes = async () => {
  const { data, error } = await useFetch(`/administrators/findId/${storedUsername}/${storedPassword}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (error.value || !data.value) {
    console.error("Erreur lors de la récupération de l'administrateur");
    return;
  }
  const adminId = data.value;
  console.log("idAdministrateur :", adminId);

  // Maintenant qu'on a l'idAdministrateur, on récupère sa liste de quiz
  const { data: quizData, error : quizError } = await useFetch(`/administrator-quiz/${adminId}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (quizError.value || !quizData.value) {
    console.error("Erreur lors de la récupération de la liste de quiz");
    return;
  }

  console.log("Liste de quiz :", quizData.value);

  const quizList = [];

for (const link of quizData.value) {
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
};


onMounted(() => {
  loadQuizzes();
  loadCategories();
});

const openModal = () => {
  showModal.value = true;
  newQuizName.value = ""; 
};

const closeModal = () => {
  showModal.value = false;
};

const addQuiz = async () => {
  if (newQuizName.value.trim() === "" || selectedCategoryId.value === "") return;

  try {
    const { data: admin, error: errorA } = await useFetch(`/administrators/findId/${storedUsername}/${storedPassword}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
    });

    if (errorA.value || !admin.value) {
      console.error("Erreur lors de la récupération de l'administrateur");
      return;
    }
    const adminId = admin.value;
    console.log("adminId", adminId)

    const { data, error } = await useFetch('/quiz', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: {
        name: newQuizName.value,
        idCategory: selectedCategoryId.value,
      },
    });

    if (error.value) {
      console.error('Erreur lors de la création du quiz :', error.value);
      return;
    }

    // Facultatif : mettre à jour la liste des quiz côté client
    quizzes.value.push({
      idQuiz: data.value.idQuiz,
      name: data.value.name,
      idCategory: selectedCategoryId.value
    });


    const createdQuizId = data.value.idQuiz;
    console.log("createdQuizId", createdQuizId);

    // Association à l’administrateur
    const { data: data2, error: adminError } = await useFetch(`/administrator-quiz`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: {
        idAdministrator: adminId,
        idQuiz: createdQuizId,
      },
    });  

    console.log(data2)
    
    if (adminError.value) {
      console.error('Erreur lors de la création de admin-quiz :', adminError.value);
      return;
    }

    closeModal();
    newQuizName.value = "";
    selectedCategoryId.value = "";
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
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

