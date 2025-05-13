<template>
    <main class="main-content">
        <p>Question OK</p>
    </main> 
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';

const answerList = ref([]);
const currentQuestion = ref({
    idQuestion: null,
    description: '',
    type: '',
    duration: null,
    score: null
});

onMounted(() => {
  //loadQuestion();
  //loadAnswers();
  
});



const loadQuestion = async () => {
  console.log("question.id :", idQuestion.value);

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
const loadAnswers = async () => {
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
</script>

<style>
.main-content {
  margin-top: 80px; 
  padding-top: 100px;
  text-align: center;
  background-color: #ffffff;
}
</style>