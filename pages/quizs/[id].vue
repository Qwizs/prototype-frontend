<template>
  <div class="quiz-container" v-if="quiz">
    <h1 class="quiz-title">{{ quiz.title }}</h1>

    <div class="question-list">
      <ul>
        <li v-for="(question, index) in quiz.questions" :key="index" class="question-item">
          <strong>Q{{ index + 1 }}:</strong> {{ question.text }} ({{ question.type }})
          <ul v-if="question.type === 'qcm'">
            <li v-for="(option, i) in question.options" :key="i" :class="{ correct: option === question.correctAnswer }">
              {{ option }}
            </li>
          </ul>
          <p v-else-if="question.type === 'vrai-faux'">Réponse : <strong>{{ question.correctAnswer }}</strong></p>
        </li>
      </ul>
    </div>

    <div class="question-form">
      <h2>Ajouter une question</h2>

      <input v-model="newQuestion" placeholder="Tapez votre question ici" class="input-field"/>

      <label for="type">Type :</label>
      <select v-model="questionType" id="type" class="select-field">
        <option value="qcm">QCM</option>
        <option value="vrai-faux">Vrai/Faux</option>
        <option value="texte">Réponse libre</option>
      </select>

      <div v-if="questionType === 'qcm'" class="qcm-options">
        <label>Options :</label>
        <div v-for="(option, index) in options" :key="index" class="option-item">
          <input v-model="options[index]" :placeholder="'Option ' + (index + 1)" class="input-field"/>
        </div>
        <button @click="options.push('')" class="btn-secondary">Ajouter une option</button>
        <br> 
        <label>Bonne réponse :</label>
        <select v-model="correctAnswer" class="select-field">
          <option v-for="(option, i) in options" :key="i" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <div v-if="questionType === 'vrai-faux'" class="true-false">
        <label>Bonne réponse :</label>
        <select v-model="correctAnswer" class="select-field">
          <option value="Vrai">Vrai</option>
          <option value="Faux">Faux</option>
        </select>
      </div>

      <button @click="addQuestion" class="btn-primary">Ajouter la question</button>
    </div>

    <div class="start-quiz-container">
      <button v-if="!quizStarted" @click="startQuiz" class="btn-start">
        Démarrer le Quiz
      </button>
      <p v-if="quizStarted" class="quiz-started-message">Le quiz a commencé ! 🚀</p>
    </div>
  </div>

  <div v-else class="not-found">
    <p>Quiz introuvable</p>
  </div>
</template>


<script setup>
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';


const route = useRoute();
const router = useRouter();
const quizId = computed(() => route.params.id);

const quizzes = ref([
  { id: 1, title: "Premier Qwiz", questions: [] },
  { id: 2, title: "Deuxième Qwiz", questions: [] }
]);

const quiz = computed(() => quizzes.value.find(q => q.id == quizId.value));

const newQuestion = ref("");
const questionType = ref("qcm");
const options = ref(["", ""]);
const correctAnswer = ref("");

const addQuestion = () => {
  if (!newQuestion.value.trim()) return;

  const questionData = {
    text: newQuestion.value,
    type: questionType.value,
    options: questionType.value === "qcm" ? [...options.value] : [],
    correctAnswer: correctAnswer.value
  };

  quiz.value.questions.push(questionData);

  newQuestion.value = "";
  options.value = ["", ""];
  correctAnswer.value = "";
  if (!options.value.includes(correctAnswer.value)) {
    correctAnswer.value = options.value[0] || ""; 
  }
};

const startQuiz = () => {
  const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase(); 
  router.push(`/quizs/lobby/${roomCode}?user=admin`);
  console.log("Quiz started with room code:", roomCode);
};

</script>

<style>

.quiz-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  text-align: center;
}

.quiz-title {
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
