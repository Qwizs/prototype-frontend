<script setup>
const { data, error } = await useFetch('/administrators/all', {
  baseURL: useRuntimeConfig().public.apiBase
});
</script>

<template>
  <div>
    <h1>Liste des utilisateurs</h1>
    <div v-if="error">Erreur : {{ error.message }}</div>
    <ul v-else>
      <li v-for="administrator in data" :key="administrator.idAdministrator">{{ administrator.username }}</li>
    </ul>
  </div>
</template>
