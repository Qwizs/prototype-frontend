<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const router = useRouter()

const schema = z.object({
  room: z.string().nonempty("Le code du quiz est requis"),
  user: z.string().nonempty("Votre nom est requis"),
})

type Schema = z.output<typeof schema>
const state = ref<Schema>({ room: '', user: '' })

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  event.preventDefault()
  router.push(`/quiz/${state.value.room}/waiting?user=${state.value.user}`)
}
</script>

<template>
  <div class="join-page">
    <div class="card">
      <img src="/assets/panda.png" alt="Mascotte Qwizs" class="mascot" />
      <h1 class="title">Rejoindre un Quiz</h1>

      <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
        <UFormGroup name="user" >
          <UInput v-model="state.user" placeholder="Nom du Joueur" class="custom-input" />
        </UFormGroup>

        <UFormGroup name="room" >
          <UInput v-model="state.room" placeholder="Code du Quiz" class="custom-input" />
        </UFormGroup>

        <div class="form-actions">
          <UButton type="submit" class="form-button confirm">Rejoindre</UButton>
          <UButton type="button" class="form-button cancel" @click="$router.push('/')">Annuler</UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>


<style scoped>
.join-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(145deg, #fdf7ff, #f3e8fb);
  padding: 20px;
  font-family: 'Poppins', sans-serif;
}

.card {
  background: white;
  padding: 40px 30px;
  border-radius: 25px;
  box-shadow: 0 10px 30px rgba(196, 111, 200, 0.15);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.mascot {
  width: 80px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #c46fc8;
  margin-bottom: 30px;
}

.form-label label {
  font-size: 1rem;
  font-weight: 600;
  color: #c46fc8 !important;
  margin-bottom: 6px;
  display: block;
  text-align: left;
}

.custom-input input {
  background: white !important;
  border: 1px solid #ccc !important;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  color: #333 !important;
  width: 100%;
  transition: border-color 0.3s ease;
}

.custom-input input:focus {
  border-color: #c46fc8;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.form-button {
  display: flex;
  justify-content: center;
  align-items: center; 
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  flex: 1;
  text-align: center;
  transition: background-color 0.3s ease;
}


.form-button.confirm {
  background-color: #c46fc8;
  color: white;
}

.form-button.confirm:hover {
  background-color: #a850aa;
}

.form-button.cancel {
  background-color: #f3f3f3;
  color: #444;
}

.form-button.cancel:hover {
  background-color: #e0e0e0;
}

.custom-input :deep(input) {
  background-color: white !important;
  color: #333 !important;
  border-radius: 12px;
  border: 1px solid #ccc;
  padding: 12px 16px;
  font-size: 1rem;
}

.custom-input :deep(input)::placeholder {
  color: #999;
}
.custom-input :deep(input:focus),
.custom-input :deep(input:focus-visible),
.custom-input :deep(input:focus-within) {
  border-color: #c46fc8 !important; /* violet personnalisé */
  box-shadow: none !important;
  outline: none !important;
}

</style>
