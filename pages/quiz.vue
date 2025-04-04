<script setup>
const { data, error } = await useFetch('/quiz/all', {
  baseURL: useRuntimeConfig().public.apiBase
});
</script>

<template>
  <div>
    <h1>Liste des quiz</h1>
    <div v-if="error">Erreur : {{ error.message }}</div>
    <ul v-else>
      <li v-for="quiz in data" :key="quiz.idQuiz">{{ quiz.name }}</li>
    </ul>
  </div>
</template>
