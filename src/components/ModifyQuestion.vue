<script>
// const modifyQuestion = async () => {
//   if (!selectedQuestionId.value?.toString().trim()) return;

//   try {

//     const body = {};
//     body.id

//     if (newQuestion.value?.trim()) {
//       body.description = newQuestion.value.trim();
//     }

//     if (selectedType.value?.trim()) {
//       body.type = selectedType.value.trim();
//     }

//     const scoreString = selectedScore.value?.toString().trim();
//     if (scoreString) {
//       body.score = scoreString;
//     }

//     const durationString = selectedDuration.value?.toString().trim();
//     if (durationString) {
//       body.duration = durationString;
//     }

//     const { data, error } = await useFetch(`/questions/${selectedQuestionId.value}`, {
//       baseURL: useRuntimeConfig().public.apiBase,
//       method: 'PATCH',
//       body,
//     });

//     if (error.value) {
//       console.error('Erreur lors de la modification de la question :', error.value);
//       return;
//     }

//     const updatedQuestionId = data.value;
//     console.log("updatedQuestionId", updatedQuestionId);

//     const body2 = {};

//     const orderString = selectedOrder.value?.toString().trim();
//     if (orderString) {
//       body2.order = orderString;
//     }

//     if (Object.keys(body2).length === 0) {
//       console.warn("Aucune donnée à modifier.");
//       selectedQuestionId.value = "";
//       newQuestion.value = "";
//       selectedType.value = "";
//       selectedScore.value = "";
//       selectedDuration.value = "";
//       loadQuestions();
//       loadQuizQuestions()
//       closeModal3();
//     }

//     const { data: data2, error: error2 } = await useFetch(`/quiz-question/${quizId.value}/${selectedQuestionId.value}`, {
//       baseURL: useRuntimeConfig().public.apiBase,
//       method: 'PATCH',
//       body: body2,
//     });

//     if (error2.value) {
//       console.error('Erreur lors de la création de question-quiz :', error2.value);
//       return;
//     }

//     console.log(data2)

//     selectedQuestionId.value = "";
//     newQuestion.value = "";
//     selectedType.value = "";
//     selectedScore.value = "";
//     selectedDuration.value = "";
//     selectedOrder.value = "";
//     loadQuestions();
//     loadQuizQuestions()
//     closeModal3();

//   } catch (err) {
//     console.error("Erreur inattendue :", err);
//   }
// };
</script>