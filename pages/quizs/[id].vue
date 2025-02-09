<template>
  <div>
    <p>Quizs details for {{ id }}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, voluptates.</p>
  </div>
</template>

<script lang="ts" setup>
    const { id } = useRoute().params
</script>

<style>

</style>