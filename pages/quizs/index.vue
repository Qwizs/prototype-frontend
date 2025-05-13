<template>
  <div>
    <main class="main-content">
      <div class="title-container">
        <img src="/assets/titre.png" alt="Mes Qwizs" class="page-title-image" />
      </div>

      <div class="quiz-wrapper">
      <div class="quiz-header">
        <img
          src="/assets/add_quiz.png"
          alt="Add Question"
          class="button-quiz-image"
          @click="openModal"
        />
        <img
          src="/assets/modify.png"
          alt="Modify Question"
          class="button-quiz-image"
          @click="openModal5"
        />
        <img
          src="/assets/rm_quiz.png"
          alt="Remove Question"
          class="button-quiz-image"
          @click="openModal2"
        />
        <img
          src="/assets/remove_all.png"
          alt="Remove All Question"
          class="remove-quiz-image"
          @click="openModal3"
        />
        <img
          src="/assets/add_category.png"
          alt="Add Category"
          class="add-catgory-image"
          @click="openModal4"
        />
      </div>

      <div class="quiz-container">
        <div
          class="quiz-card"
          v-for="quiz in quizzes"
          :key="quiz.idQuiz"
          
        >
          <img src="/assets/quiz-icon.png" alt="Quiz Icon" class="quiz-icon-full" />
          <p class="quiz-category">Catégorie : {{ getCategoryName(quiz.idCategory) }}</p> <!-- Ajouté -->
          <p class="quiz-title">{{ quiz.name }}</p>
          <div class="button-container">
            <button @click="launchQuiz(quiz.id)" class="btn start-btn">Start</button>
            <button @click="goToQuiz(quiz.idQuiz)" class="btn edit-btn">Modifier</button>          
          </div>
          
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

    <div v-if="showModal2" class="modal-overlay">
      <div class="modal">
        <select v-model="selectedQuizId" class="quiz-select">
          <option disabled value="">Choisissez un quiz</option>
          <option
            v-for="quiz in quizzes"
            :key="quiz.idQuiz"
            :value="quiz.idQuiz"
          >
            {{ quiz.name }}
          </option>
        </select>
        <div class="modal-actions">
          <button @click="removeQuiz" class="btn-primary">Supprimer</button>
          <button @click="closeModal2" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div>    
  

  <div v-if="showModal3" class="modal-overlay">
      <div class="modal">
        <h2>Êtes-vous sûr(e) de supprimer tous vos quiz ?</h2>
        <div class="modal-actions">
          <button @click="removeAll" class="btn-primary">Oui</button>
          <button @click="closeModal3" class="btn-secondary">Non</button>
        </div>
      </div>
  </div>  

  <div v-if="showModal4" class="modal-overlay">
      <div class="modal">
        <h2>Choisissez un nom de catégorie</h2>
        <input v-model="newCategoryName" type="text" placeholder="Nom de la catégorie" class="quiz-input" />
        <div class="modal-actions">
          <button @click="addCategory" class="btn-primary">Créer</button>
          <button @click="closeModal4" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div>  

    <div v-if="showModal5" class="modal-overlay">
      <div class="modal">
        <h2>Choisissez un quiz à modifier</h2>
        <select v-model="selectedQuizId" class="quiz-select">
          <option disabled value="">Choisissez un quiz</option>
          <option
            v-for="quiz in quizzes"
            :key="quiz.idQuiz"
            :value="quiz.idQuiz"
          >
            {{ quiz.name }}
          </option>
        </select>
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
        <input v-model="newQuizName" type="text" placeholder="Nouveau nom du quiz" class="quiz-input" />
        <div class="modal-actions">
          <button @click="modifyQuiz" class="btn-primary">Modifier</button>
          <button @click="closeModal5" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div> 
  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {io} from 'socket.io-client'

const router = useRouter();

const quizzes = ref([]); // devient un ref pour la mise à jour dynamique
const categories = ref([]);
const selectedCategoryId = ref('');
const selectedQuizId = ref('');

const showModal = ref(false);
const showModal2 = ref(false);
const showModal3 = ref(false);
const showModal4 = ref(false);
const showModal5 = ref(false);
const newQuizName = ref("");
const newCategoryName = ref("");

const storedUsername = localStorage.getItem('username') || "";
const storedPassword = localStorage.getItem('password') || "";

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
});

const openModal = () => {
  showModal.value = true;
  newQuizName.value = ""; 
};

const openModal2 = () => {
  showModal2.value = true;
};

const openModal3 = () => {
  showModal3.value = true;
};

const openModal4 = () => {
  showModal4.value = true;
  newCategoryName.value = ""; 
};

const openModal5 = () => {
  showModal5.value = true;
  newQuizName.value = ""; 
};

const closeModal = () => {
  showModal.value = false;
  newQuizName.value = ""; 
};

const closeModal2 = () => {
  showModal2.value = false;
};

const closeModal3 = () => {
  showModal3.value = false;
};

const closeModal4 = () => {
  showModal4.value = false;
  newCategoryName.value = ""; 
};

const closeModal5 = () => {
  showModal5.value = false;
  newQuizName.value = ""; 
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

    newQuizName.value = "";
    selectedCategoryId.value = "";
    closeModal();
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};

const removeQuiz = async () => {

  if (selectedQuizId.value === "") return;

  try {
    console.log("ID du quiz à supprimer:", selectedQuizId.value); // Vérification
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

    const { error: deleteErr } = await useFetch(`/quiz/${selectedQuizId.value}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'DELETE'
    });

    if (deleteErr.value) {
      console.error('Erreur lors de la suppression du quiz :', deleteErr.value);
      return;
    }

    const { data: data2, error: adminError } = await useFetch(`/administrator-quiz/${adminId}/${selectedQuizId.value}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'DELETE'
    });  

    console.log(data2)
    
    if (adminError.value) {
      console.error('Erreur lors de la suppression du quiz :', error.value);
      console.error('Détails de l\'erreur:', error.value.response || error.value);
      return;
    }

    quizzes.value = quizzes.value.filter(quiz => quiz.idQuiz !== selectedQuizId.value);

    selectedQuizId.value = "";
    closeModal2();
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};

const removeAll = async () => {

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

    const { error: deleteErr } = await useFetch(`/administrator-quiz/1/1/${adminId}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'DELETE'
    });

    if (deleteErr.value) {
      console.error('Erreur lors de la suppression des quiz :', deleteErr.value);
      return;
    }

    quizzes.value = [];
    closeModal3();
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};

const addCategory = async () => {
  if (newCategoryName.value.trim() === "") return;

  try {
    const { data: cat, error: errorCat } = await useFetch(`/categories`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'POST',
    body: {
        name: newCategoryName.value
      },
    });

    if (errorCat.value) {
      console.error('Erreur lors de la création de la catégorie :', errorCat.value);
      return;
    }

    console.log("cat :", cat)
    

    loadCategories();
    newCategoryName.value = "";
    closeModal4();
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};

const modifyQuiz = async () => {
  if (!selectedQuizId.value?.toString().trim()) return;

  try {
    console.log("selectedQuizId", selectedQuizId.value);

    const body = {};
    body.id

    if (selectedCategoryId.value) {
      body.idCategory = selectedCategoryId.value;
    }

    if (newQuizName.value?.trim()) {
      body.name = newQuizName.value.trim();
    }

    if (Object.keys(body).length === 0) {
      console.warn("Aucune donnée à modifier.");
      return;
    }

    const { data, error } = await useFetch(`/quiz/${selectedQuizId.value}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'PUT',
      body,
    });

    if (error.value) {
      console.error('Erreur lors de la modification du quiz :', error.value);
      return;
    }

    const updatedQuizId = data.value;
    console.log("updatedQuizId", updatedQuizId); 

    newQuizName.value = "";
    selectedCategoryId.value = "";
    loadQuizzes();
    loadCategories();
    closeModal5();
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};

const goToQuiz = (quizId) => {
  router.push(`/quizs/${quizId}`); 
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

.edit-btn {
  background-color: #C46FC8; /* Orange */
}

.edit-btn:hover {
  background-color: #86218B;
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

.quiz-wrapper {
  position: relative; 
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  background: #ffffff; 
  margin: 0 auto;
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
  overflow: hidden;
}

.quiz-icon-full {
  width: 100%;
  height: 150px;
  object-fit: contain;
}

.quiz-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #C46FC8;
  text-align: center;
  margin: 10px 0;
}

.quiz-header {
  display: flex;
  justify-content: center;
}

.button-quiz-image {
  width: 60px;
  height: 60px;
  cursor: pointer;
  margin: 1%;
  transition: transform 0.2s ease;
  z-index: 1;
  position: relative; /* plus "absolute" */
}

.button-quiz-image:hover {
  transform: scale(1.1);
}

.remove-quiz-image {
  width: auto;
  height: 60px;
  cursor: pointer;
  margin: 1%;
  transition: transform 0.2s ease;
  z-index: 1;
  position: relative; /* plus "absolute" */
}

.remove-quiz-image:hover {
  transform: scale(1.1);
}

.add-catgory-image:hover {
  transform: scale(1.1);
}

.add-catgory-image {
  width: auto;
  height: 60px;
  cursor: pointer;
  margin: 1%;
  transition: transform 0.2s ease;
  z-index: 1;
  position: relative; /* plus "absolute" */
}

.add-catgory-image:hover {
  transform: scale(1.1);
}

.quiz-category {
  font-size: 0.75rem; /* plus petit que le titre */
  color: #888;
  margin-top: 10px;
  margin-bottom: 2px;
  font-family: 'Poppins', sans-serif;
}

.quiz-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid #ccc;
  font-size: 1rem;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%236c63ff' d='M5 8l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}
.quiz-select option {
  background-color: white;
  color: #333;
}



</style>

