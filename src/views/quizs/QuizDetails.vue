<template>
  <main class="main-content">
    <h1>Modifier mon Qwiz</h1>
    <section class="infos-quiz">
      <label for="name"
        >Nom<input
          name="name"
          type="text"
          class="input"
          :placeholder="quizName"
      /></label>
      <label for="category"
        >Catégorie<input
          name="category"
          type="text"
          class="input"
          :placeholder="getCategoryName(currentQuiz.idCategory)"
      /></label>
    </section>
    <div class="questions-wrapper">
      <div class="questions-header">
        <h2>Questions</h2>
        <img
          src="/assets/add_question.png"
          alt="Add Quiz"
          class="add-quiz-btn"
          @click="openCreateQuestionModal"
        />
      </div>
      <div class="questions-container">
        <div
          class="question-wrap"
          v-for="(question, index) in questionsList"
          :key="question.idQuestion"
        >
          <div class="question-card">
            <div class="question-left">
              <span class="question-number">{{ question.order }}</span>
              <span class="question-font">{{ question.description }}</span>
            </div>
            <div class="question-right">
              <span class="question-time"
                >{{ question.duration }} seconde(s)</span
              >
              <span class="question-score">{{ question.score }} point(s)</span>
              <div class="question-actions">
                <img
                  src="/assets/edit.png"
                  alt="Modify Quiz"
                  class="button-quiz-image"
                  @click="openEditQuestionModal"
                />
                <img
                  src="/assets/delete.png"
                  alt="Remove Quiz"
                  class="button-quiz-image"
                  @click="openDeleteQuestionModal"
                />
              </div>
            </div>
          </div>
          <div class="question-content">
            <div class="answers-header">
              <h3>Réponses</h3>
              <img
                src="/assets/add_answer.png"
                alt="Add Quiz"
                class="add-quiz-btn"
                @click=""
              />
            </div>
            <div class="answers-container">
              <div
                class="answer-card"
                v-for="(answer, index) in questionsList[index].answers"
                :key="answer.idAnswer"
              >
              <div class="question-left">
              <span class="question-number">{{ index+1 }}</span>
              <span class="question-font">{{ answer.value }}</span>
            </div>
            <div class="question-right">
              <span v-if="answer.order" class="question-time"
                >Bonne réponse ({{ answer.order }})</span
              >
              <span v-if="answer.state" class="question-score">Bonne réponse</span>
              <div class="answer-actions">
                <img
                  src="/assets/edit.png"
                  alt="Modify Quiz"
                  class="edit-answer-image"
                  @click="openEditQuestionModal"
                />
                <img
                  src="/assets/delete.png"
                  alt="Remove Quiz"
                  class="delete-answer-image"
                  @click="openDeleteQuestionModal"
                />
              </div>
            </div>
            
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <CreateQuestion
    :show="showCreateQuestion"
    :quizId="Number(quizId)"
    @close="showCreateQuestion = false"
    :data="{questionNumber: selectedOrder}"
    @refresh="loadQuizQuestions"
  />

  <CreateQuestion
    :show="showEditQuestion"
    :quizId="Number(quizId)"
    @close="showEditQuestion = false"
    @refresh="loadQuizQuestions"
  />

  <CreateQuestion
    :show="showDeleteQuestion"
    :quizId="Number(quizId)"
    @close="showDeleteQuestion = false"
    @refresh="loadQuizQuestions"
  />
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import axios from "@/axios";
import CreateQuestion from "@/components/CreateQuestion.vue";

const route = useRoute();
const router = useRouter();
const quizId = computed(() => route.params.id);
const questionsList = ref([]);
const quizName = ref("");
const newQuestion = ref({
  description: "",
  type: "simpleChoice",
  duration: 0,
  score: 0,
});
const selectedOrder = ref("");
const selectedQuestionId = ref("");
const categories = ref([]);

const currentQuiz = ref({
  idQuiz: null,
  idCategory: null,
  name: "",
});

const showCreateQuestion = ref(false);
const showEditQuestion = ref(false);
const showDeleteQuestion = ref(false);

onMounted(() => {
  loadCategories();
  loadQuiz();
  loadQuestions();
});

const openCreateQuestionModal = () => {
  selectedOrder.value = questionsList.value.length + 1;
  console.log(selectedOrder.value);
  
  showCreateQuestion.value = true;
  newQuestion.value = {
    description: "",
    type: "simpleChoice",
    duration: 0,
    score: 0,
  };
};

const openEditQuestionModal = () => {
  showEditQuestion.value = true;
  selectedQuestionId.value = "";
};

const openDeleteQuestionModal = () => {
  showDeleteQuestion.value = true;
  selectedQuestionId.value = "";
  newQuestion.value = "";
  selectedType.value = "";
  selectedScore.value = "";
  selectedDuration.value = "";
  selectedOrder.value = "";
};

const loadQuestions = async () => {
  try {
    const response = await axios.get(`/quiz-question/${quizId.value}`);
    
    
    const questionL = [];

    for (const link of response.data) {
      let currentQuestion = null;
      try {
        const response = await axios.get(`/questions/${link.idQuestion}`);
        if (response.data) {
          currentQuestion = { ...response.data, order: link.order }
        }

        // REPONSES
        const response2 = await axios.get(
          `/answer-question/${link.idQuestion}`
        );

        const answerL = [];

        for (const link of response2.data) {
          const response = await axios.get(
            `/answers/${link.idAnswer}`
          );

          if (response.data) {
            answerL.push({...response.data, ...link});
          }
        }
        currentQuestion = {
          ...currentQuestion,
          answers: answerL,
        };
      } catch (err) {
        console.error(
          `Erreur lors de la récupération de la question ${link.idQuestion}`, err
        );
      }
      questionL.push(currentQuestion);
    }
    questionsList.value = questionL;
    console.log("questionsList", questionsList.value);
    
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};

const loadQuiz = async () => {
  try {
    const response = await axios.get(`/quiz/${quizId.value}`);
    currentQuiz.value = response.data;
    quizName.value = currentQuiz.value.name;
  } catch (err) {
    console.error("Erreur lors de la récupération du quiz");
  }
};

const loadCategories = async () => {
  try {
    const response = await axios.get("/categories/all");
    const data = response.data;
    categories.value = data;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
};

const goToQuestion = (idQuestion) => {
  router.push(`/question/${idQuestion}`);
};

const getCategoryName = (idCategory) => {
  for (let i = 0; i < categories.value.length; i++) {
    if (categories.value[i].idCategory === idCategory) {
      return categories.value[i].name;
    }
  }
  return "inconnue";
};
</script>

<style>
.main-content {
  padding: 7rem 0 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
  background-color: #ffffff;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #c46fc8;
  font-family: "Nerko One", cursive;
}

.infos-quiz {
  display: flex;
  gap: 1rem;
  margin: 0 auto;
}

label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  color: #000000;
  outline: none;
  font-family: "Gabarito";

  &:hover,
  &:active,
  &:focus {
    border-color: #c46fc8;
  }
}

.questions-wrapper {
  position: relative;
  width: 50vw;
}

.questions-header {
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  align-items: center;
  margin-bottom: 20px;

  & h2 {
    font-size: 2rem;
  }

  & .add-quiz-btn {
      width: 15rem;
      height: 3rem;
      cursor: pointer;
      object-fit: contain;
      transition: transform 0.2s ease, filter 0.2s ease;
      filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.2));

    &:hover {
    transform: scale(1.1);
    filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.2));
    }
  }
}

.questions-header h2 {
  font-size: 2.5rem;
  font-family: 'Nerko One', cursive;
  color: #c46fc8;
  margin: 0;
  letter-spacing: 1px;
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.questions-header .add-quiz-btn {
  margin-left: 6rem; /* ou plus si besoin */
}

.question-card {
  background: #f9f9fb;
  padding: 1.25rem 1.5rem;
  border-radius: 10px;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); */

  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.question-left {
  display: flex;
  align-items: center;
  gap: 8px;

  & .question-number {
    background-color: #c46fc8;
    color: white;
    border-radius: 12px;
    padding: 4px 10px;
    font-weight: bold;
    font-size: 14px;
    line-height: 1;
    text-align: center;
  }

  & .question-font {
    color: #c46fc8;
    font-weight: bold;
    font-size: 16px;
    line-height: 1.2;
    margin: 0; /* important si tu gardes un <p> */
    display: inline-block;
  }
}

.question-right {
  display: flex;
  align-items: center;
  gap: 1rem;

  & .question-time {
    font-size: 14px;
    color: #666;
  }
  & .question-score {
    font-size: 14px;
    font-weight: bold;
    color: #28a745;
  }
}

.question-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;

  & img {
    height: 3rem;
    aspect-ratio: 1/1;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.3s ease;
    &:hover {
      transform: scale(1.1);
    }
  }
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

.question-wrap {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.question-content {
  padding: 1rem;
}
.answers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  & h2 {
    font-size: 2rem;
  }

  & .add-quiz-btn {
    width: 2rem;
    aspect-ratio: 1/1;
    cursor: pointer;
    margin: 1%;
    transition: transform 0.2s ease;
    z-index: 1;
    position: relative;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.answers-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  flex-direction: column;
  gap: 1.5rem;
}
.answer-card {
  background: #fef5ff;
  padding: 1.25rem 1.5rem;
  border-radius: 10px;

  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.answer-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;

  & img {
    height: 2.5rem;
    aspect-ratio: 1/1;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.3s ease;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
