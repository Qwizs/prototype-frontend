<template>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
const removeQuestion = async () => {
  if (selectedQuestionId.value === "") return;

  try {
    const { error: error2 } = await useFetch(
      `/quiz-question/${quizId.value}/${selectedQuestionId.value}`,
      {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "DELETE",
      }
    );

    if (error2.value) {
      console.error(
        "Erreur lors de la suppression de la question :",
        error2.value
      );
      console.error(
        "Détails de l'erreur:",
        error2.value.response || error2.value
      );
      return;
    }

    const { error: deleteErr } = await useFetch(
      `/questions/${selectedQuestionId.value}`,
      {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "DELETE",
      }
    );

    if (deleteErr.value) {
      console.error(
        "Erreur lors de la suppression de la question :",
        deleteErr.value
      );
      return;
    }

    const { error: deleteErr2 } = await useFetch(
      `/answer-question/1/1/${selectedQuestionId.value}`,
      {
        baseURL: useRuntimeConfig().public.apiBase,
        method: "DELETE",
      }
    );

    if (deleteErr2.value) {
      console.error(
        "Erreur lors de la suppression des réponses :",
        deleteErr.value
      );
      return;
    }

    questionsList.value = questionsList.value.filter(
      (question) => question.idQuestion !== selectedQuestionId.value
    );

    selectedQuestionId.value = "";
    closeModal2();
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};
</script>

<style scoped>

</style>
