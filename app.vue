<script setup lang="ts">
import type { Ref } from 'vue';
// import Chat from './src/chat.vue';
// import Connection from './src/connection.vue';

interface Info{
  user:string
  room:string
}

let infos : Ref<Info | undefined> = ref()
</script>

<template>
   <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!--
  <Connection v-model="infos" v-if="infos == undefined"/>
  <Chat :infos="infos" v-else/>
  -->
</template>

<style scoped>

</style>

