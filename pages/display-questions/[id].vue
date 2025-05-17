<template>
    <main class="main-content">
      <!-- <p>OK</p> -->
      <h1 class="question-title">{{ quizName }}</h1>
      <div class="question-wrapper">
        <div class="question-container">
          <div
            class="question-card"
            v-for="(question, index) in questionsList"
            :key="question.idQuestion"
            @click="goToQuestion(question.idQuestion)"
          >
            <div class="question-line">
              <div class="question-left">
                <span class="question-number">{{ getQuestionOrder(quizId, question.idQuestion) }}</span>
                <span class="question-font">{{ question.description }}</span>
              </div>
              <div class="question-right">
                <span class="question-time">{{ question.duration }} seconde(s)</span>
                <span class="question-score">{{ question.score }} point(s)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </template>
  
  
  <script setup>
  import { useRoute } from 'vue-router';
  import { ref, computed, onMounted } from 'vue';
  
  const route = useRoute();
  const router = useRouter();
  const quizId = computed(() => route.params.id);
  const questionsList = ref([]);
  const quizName = ref("");
  const quizQuestionList = ref([]);
  
  const currentQuiz = ref({
    idQuiz: null,
    idCategory: null,
    name: ''
  });
  
  
  onMounted(() => {
    loadQuiz();
    loadQuestions();
    loadQuizQuestions();    
  });

function getQuestionOrder(idQuiz, idQuestion) {
  console.log("idQuiz :", idQuiz);
  console.log("idQuestion :", idQuestion);
  for (let i = 0; i < quizQuestionList.value.length; i++) {
    console.log("quizQuestionList.value[i].idQuiz :", quizQuestionList.value[i].idQuiz);
    console.log("quizQuestionList.value[i].idQuestion :", quizQuestionList.value[i].idQuestion);
    console.log("quizQuestionList.value[i].order :", quizQuestionList.value[i].order);
    if ( String(quizQuestionList.value[i].idQuiz) === String(idQuiz) && String(quizQuestionList.value[i].idQuestion) === String(idQuestion)){
      return quizQuestionList.value[i].order;
    }
  }
  return 'Not order';
}

const loadQuizQuestions = async () => {

try {
  const { data, error } = await useFetch(`/quiz-question/all`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (error.value || !data.value) {
    console.error("Erreur lors de la récupération de order");
    return;
  }

  quizQuestionList.value = data.value;
  console.log("quizQuestionList :", quizQuestionList.value);

} catch (err) {
  console.error("Erreur inattendue :", err);
}
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

  const goToQuestion = (idQuestion) => {
    router.push(`/display-answers/${idQuestion}`); 
  };
  
  </script>
  
  <style>

.question-time {
  font-size: 14px;
  color: #666;
}

.question-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.question-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-right {
  display: flex;
  align-items: center;
  gap: 12px; /* espace entre secondes et score */
}

.question-number {
  background-color: #C46FC8;
  color: white;
  border-radius: 12px;
  padding: 4px 10px;
  font-weight: bold;
  font-size: 14px;
  line-height: 1;
  text-align: center;
}

.question-score {
  font-size: 14px;
  font-weight: bold;
  color: #28a745;
}

  .question-font {
    color: #C46FC8;
    font-weight: bold;
    font-size: 16px;
    line-height: 1.2;
    margin: 0; /* important si tu gardes un <p> */
    display: inline-block;
  }
  
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
  