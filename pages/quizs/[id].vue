<template>
  <main class="main-content">
    <!-- <p>OK</p> -->
    <h1 class="question-title">{{ quizName }}</h1>
    <div class="question-wrapper">
      <div class="quiz-header">
        <img
          src="/assets/add_quiz.png"
          alt="Add Quiz"
          class="button-quiz-image"
          @click="openModal"
        />
        <img
          src="/assets/modify.png"
          alt="Modify Quiz"
          class="button-quiz-image"
          @click="openModal3"
        />
        <img
          src="/assets/rm_quiz.png"
          alt="Remove Quiz"
          class="button-quiz-image"
          @click="openModal2"
        />
        <img
          src="/assets/remove_all.png"
          alt="Remove All Quiz"
          class="remove-quiz-image"
          @click="openModal3"
        />
      </div>
        <div class="question-container">
          <div
            class="question-card"
            v-for="question in questionsList"
            :key="question.idQuestion"
            @click="goToQuestion(question.idQuestion)"
          >
            <p class="question-font">{{ question.description }}</p>
          </div>

        </div>
    </div>
  </main>

  <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Écrivez une question</h2>
        <input v-model="newQuestion" type="text" placeholder="Quelle est la capitale de la France?" class="question-input" />
        <select v-model="selectedType" class="type-select">
          <option disabled value="">Choisissez un type de question</option>
          <option value="simpleChoice">Choix unique</option>
          <option value="multipleChoice">Choix multiples</option>
          <option value="input">Réponse libre</option>
          <option value="order">Réponse ordonnée</option>
        </select>
        <h2>Choisissez une durée</h2>
        <input type="number" v-model="selectedDuration" min="1" placeholder="1"/>
        <h2>Choisissez un score</h2>
        <input type="number" v-model="selectedScore" min="1" placeholder="1"/>     
        <h2>Choisissez la position de la question</h2>
        <input type="number" v-model="selectedOrder" min="1" placeholder="1"/>   
        <div class="modal-actions">
          <button @click="addQuestion" class="btn-primary">Créer</button>
          <button @click="closeModal" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div>

    <div v-if="showModal2" class="modal-overlay">
      <div class="modal">
        <h2>Choisissez la question à supprimer</h2>
        <select v-model="selectedQuestionId" class="question-select">
          <option disabled value="">Choisissez une question</option>
          <option
          v-for="question in questionsList"
            :key="question.idQuestion"
            :value="question.idQuestion"
          >
          {{ question.description }}
          </option>
        </select>
        <div class="modal-actions">
          <button @click="removeQuestion" class="btn-primary">Supprimer</button>
          <button @click="closeModal2" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div> 
    
    <div v-if="showModal3" class="modal-overlay">
      <div class="modal">
        <h2>Choisissez la question à modifier</h2>
        <select v-model="selectedQuestionId" class="question-select">
          <option disabled value="">Choisissez une question</option>
          <option
          v-for="question in questionsList"
            :key="question.idQuestion"
            :value="question.idQuestion"
          >
          {{ question.description }}
          </option>
        </select>
        <h2>Écrivez une question</h2>
        <input v-model="newQuestion" type="text" placeholder="Quelle est la capitale de la France?" class="question-input" />
        <select v-model="selectedType" class="type-select">
          <option disabled value="">Choisissez un type de question</option>
          <option value="simpleChoice">Choix unique</option>
          <option value="multipleChoice">Choix multiples</option>
          <option value="input">Réponse libre</option>
          <option value="order">Réponse ordonnée</option>
        </select>
        <h2>Choisissez une durée</h2>
        <input type="number" v-model="selectedDuration" min="1" placeholder="1"/>
        <h2>Choisissez un score</h2>
        <input type="number" v-model="selectedScore" min="1" placeholder="1"/>     
        <h2>Choisissez la position de la question</h2>
        <input type="number" v-model="selectedOrder" min="1" placeholder="1"/>   
        <div class="modal-actions">
          <button @click="modifyQuestion" class="btn-primary">Modifier</button>
          <button @click="closeModal3" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div>    
</template>


<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const quizId = computed(() => route.params.id);
const questionsList = ref([]);
const quizName = ref("");
const newQuestion = ref("");
const selectedType = ref("");
const selectedScore = ref('');
const selectedDuration = ref('');
const selectedOrder = ref('');
const selectedQuestionId = ref('');

const currentQuiz = ref({
  idQuiz: null,
  idCategory: null,
  name: ''
});

const showModal = ref(false);
const showModal2 = ref(false);
const showModal3 = ref(false);
const showModal4 = ref(false);


onMounted(() => {
  loadQuiz();
  loadQuestions();
  
});

const openModal = () => {
  showModal.value = true;
  newQuestion.value = "";
  selectedType.value = "";
  selectedScore.value = "";
  selectedDuration.value = "";
  selectedOrder.value = ""; 
};

const openModal2 = () => {
  showModal2.value = true;
  selectedQuestionId.value = "";
};

const openModal3 = () => {
  showModal3.value = true;
  selectedQuestionId.value = "";
  newQuestion.value = "";
  selectedType.value = "";
  selectedScore.value = "";
  selectedDuration.value = "";
  selectedOrder.value = ""; 
};

const closeModal = () => {
  showModal.value = false;
  newQuestion.value = "";
  selectedType.value = "";
  selectedScore.value = "";
  selectedDuration.value = "";
  selectedOrder.value = ""; 
};

const closeModal2 = () => {
  showModal2.value = false;
  selectedQuestionId.value = "";
};

const closeModal3 = () => {
  showModal3.value = false;
  selectedQuestionId.value = "";
  newQuestion.value = "";
  selectedType.value = "";
  selectedScore.value = "";
  selectedDuration.value = "";
  selectedOrder.value = ""; 
};

const loadQuestions = async () => {
  console.log("quiz.id :", quizId.value);

  const { data, error } = await useFetch(`/quiz-question/${quizId.value}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (error.value || !data.value) {
    console.error("Erreur lors de la récupération des quizs");
    return;
  }

  console.log("questions :", data.value);

  const questionL = [];

  for (const link of data.value) {
  const { data: question, error: questionFetchError } = await useFetch(`/questions/${link.idQuestion}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (questionFetchError.value) {
    console.error(`Erreur lors de la récupération de la question ${link.idQuestion}`);
    continue;
  }

  if (question.value) {
    questionL.push(question.value);
  }

  console.log("Questions complètes :", questionL);
}
  questionsList.value = questionL;
  console.log("questionsList :", questionsList.value);
}

// Fonction pour charger les quiz depuis l'API
const loadQuiz = async () => {
  // Maintenant qu'on a l'idAdministrateur, on récupère sa liste de quiz
  const { data: quizData, error : quizError } = await useFetch(`/quiz/${quizId.value}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (quizError.value || !quizData.value) {
    console.error("Erreur lors de la récupération du quiz");
    return;
  }

  console.log("Current Quiz :", quizData.value);

  currentQuiz.value = quizData.value;
  quizName.value = currentQuiz.value.name;

  console.log("currentQuiz :", currentQuiz.value);
  console.log("quizName :", quizName.value);

};

const addQuestion = async () => {
  if (newQuestion.value.trim() === "") return;

  try {
    const { data, error } = await useFetch('/questions', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: {
        description: newQuestion.value,
        type: selectedType.value,
        duration: selectedDuration.value,
        score: selectedScore.value,
      },
    });

    if (error.value) {
      console.error('Erreur lors de la création de la question :', error.value);
      return;
    }  

    questionsList.value.push({
      idQuestion: data.value.idQuestion,
      description: data.value.description,
      type: data.value.type,
      duration: data.value.duration,
      score: data.value.score,
    });

    const createdQuestion = data.value;
    console.log("createdQuestion :", createdQuestion);    
    
    const { data: data2, error: error2 } = await useFetch(`/quiz-question`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: {
        idQuiz: quizId.value,
        idQuestion: data.value.idQuestion,
        order: selectedOrder.value
      },
    });  

    console.log(data2)
    
    if (error2.value) {
      console.error('Erreur lors de la création de question-quiz :', error2.value);
      return;
    }

    newQuestion.value = "";
    selectedType.value = "";
    selectedScore.value = "";
    selectedDuration.value = "";
    selectedOrder.value = "";   
    closeModal();  
    
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};

const removeQuestion = async () => {

if (selectedQuestionId.value === "") return;

try {

  const { error: error2 } = await useFetch(`/quiz-question/${quizId.value}/${selectedQuestionId.value}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'DELETE'
  });  
  
  if (error2.value) {
    console.error('Erreur lors de la suppression de la question :', error.value);
    console.error('Détails de l\'erreur:', error.value.response || error.value);
    return;
  }  

  const { error: deleteErr } = await useFetch(`/questions/${selectedQuestionId.value}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'DELETE'
  });

  if (deleteErr.value) {
    console.error('Erreur lors de la suppression de la question :', deleteErr.value);
    return;
  }

  questionsList.value = questionsList.value.filter(question => question.idQuestion !== selectedQuestionId.value);

  selectedQuestionId.value = "";
  closeModal2();
} catch (err) {
  console.error("Erreur inattendue :", err);
}
};

const modifyQuestion = async () => {
  if (!selectedQuestionId.value?.toString().trim()) return;

  try {

    const body = {};
    body.id

    if (newQuestion.value?.trim()) {
      body.description = newQuestion.value.trim();
    }

    if (selectedType.value?.trim()) {
      body.type = selectedType.value.trim();
    }

    const scoreString = selectedScore.value?.toString().trim();
    if (scoreString) {
      body.score = scoreString;
    }

    const durationString = selectedDuration.value?.toString().trim();
    if (durationString) {
      body.duration = durationString;
    }


    const { data, error } = await useFetch(`/questions/${selectedQuestionId.value}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'PATCH',
      body,
    });

    if (error.value) {
      console.error('Erreur lors de la modification de la question :', error.value);
      return;
    }  

    const updatedQuestionId = data.value;
    console.log("updatedQuestionId", updatedQuestionId);
    
    const body2 = {};

    const orderString = selectedOrder.value?.toString().trim();
    if (orderString) {
      body2.order = orderString;
    }  
    
    if (Object.keys(body2).length === 0) {
      console.warn("Aucune donnée à modifier.");
      selectedQuestionId.value = "";
      newQuestion.value = "";
      selectedType.value = "";
      selectedScore.value = "";
      selectedDuration.value = "";
      loadQuestions();
      closeModal3();  
    }

    const { data: data2, error: error2 } = await useFetch(`/quiz-question/${quizId.value}/${selectedQuestionId.value}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'PATCH',
      body: body2,
    });  
    
    if (error2.value) {
      console.error('Erreur lors de la création de question-quiz :', error2.value);
      return;
    }

    console.log(data2)

    selectedQuestionId.value = "";
    newQuestion.value = "";
    selectedType.value = "";
    selectedScore.value = "";
    selectedDuration.value = "";
    selectedOrder.value = "";   
    loadQuestions();
    closeModal3();  
    
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};



const goToQuestion = (idQuestion) => {
  router.push(`/question/${idQuestion}`); 
};

</script>

<style>

.main-content {
  margin-top: 80px; 
  padding-top: 100px;
  text-align: center;
  background-color: #ffffff;
}

.type-select {
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

.quiz-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
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

.question-container {
  display: flex;
  flex-direction: column; /* ✅ Vertical */
  gap: 20px; /* ✅ Espacement entre les questions */
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}


.question-wrapper {
  position: relative;
  border: 2px solid #f7f7f7;
  border-radius: 15px;
  padding: 20px;
  background: #ffffff;
  margin: 40px auto; /* Augmentez la marge supérieure ici */
  max-width: 800px;
}

.question-font {
  font-size: 1.2rem;
  font-weight: bold;
  color: #C46FC8;
  margin-bottom: 15px;
}

.question-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #C46FC8;
  margin-bottom: 15px;
}

.question-list {
  margin-top: 20px;
  text-align: left;
}

.question-item {
  background: #f7f7f7;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.question-card {
  background: #F9F9FB;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
  text-align: left;
}

.question-card:hover {
  transform: translateY(-3px);
  background-color: #f0e9f1;
}

.correct {
  color: #4CAF50;
  font-weight: bold;
}

.question-form {
  margin-top: 20px;
  padding: 20px;
  background: #F9F9FB;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.question-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 3px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #000000;
}

.start-quiz-container {
  margin-top: 20px;
  text-align: center;
}

.btn-start {
  background: #28a745;
  color: white;
  padding: 12px 25px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-start:hover {
  background: #218838;
}

.quiz-started-message {
  font-size: 1.5rem;
  font-weight: bold;
  color: #28a745;
  margin-top: 15px;
}

.input-field, .select-field {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.input-field:focus, .select-field:focus {
  border-color: #C46FC8;
  outline: none;
}

.btn-primary {
  background: #C46FC8;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: #86218B;
}

.btn-secondary {
  background: #ddd;
  color: black;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 5px;
}

.btn-secondary:hover {
  background: #bbb;
}

.qcm-options {
  margin-top: 10px;
  text-align: left;
}

.option-item {
  display: flex;
  gap: 5px;
  align-items: center;
}

.true-false {
  margin-top: 10px;
}

.not-found {
  text-align: center;
  font-size: 1.2rem;
  color: red;
}
.input-field, .select-field {
  background-color: #fff !important;
  color: #333 !important;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  padding: 10px;
}

.input-field::placeholder {
  color: #999;
}

.select-field {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

</style>
