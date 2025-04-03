<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const router = useRouter()
const showModal = ref(false) 

const infos = ref<{ room?: string, user?: string }>({})

const schema = z.object({
  room: z.string().nonempty("Le code du quiz est requis"),
  user: z.string().nonempty("Votre nom est requis"),
})

type Schema = z.output<typeof schema>

const state = ref<Schema>({ room: '', user: '' })

async function onSubmit(event: FormSubmitEvent<Schema>) { 
    event.preventDefault()
    infos.value = { ...state.value }
    showModal.value = false 
    // router.push(`/quizs/${infos.value.room}?user=${infos.value.user}`)
    router.push(`/quizs/lobby/${infos.value.room}?user=${infos.value.user}`);
    console.log("quiz room",infos.value.room, infos.value.user)
}
</script>

<template>
  <div>
    <main class="main-content">
      <section class="hero">
        <div class="hero-content">
          <img src="/assets/panda.png" alt="Panda" class="hero-image" />
          <div class="hero-text">
            <h1>
              Du <span class="highlight">fun</span>, des <span class="highlight">questions</span>, et un max de <span class="highlight">challenges</span> !
            </h1>
            <p>Apprenez en vous amusant avec nos quiz interactifs.</p>
          </div>
        </div>
      </section>

      <section class="challenge-section">
        <div class="challenge-content">
          <img src="/assets/ranking.jpeg" alt="Classement" class="challenge-image" />
          <p class="challenge-text">Challengez-vous et grimpez au sommet du classement !</p>
        </div>
      </section>

      <section class="qr-section">
        <div class="qr-content">
          <p class="qr-text">Rejoignez ou organisez un QWIZS !</p>
          <p class="qr-subtext">Il suffit de scanner un QR code pour rejoindre une session.</p>
        </div>
        <div class="qr-wrapper">
          <img src="/assets/result.png" alt="QR Code" class="qr-image" />
        </div>
      </section>

      <section class="cta-section">
        <button class="cta-button">Créez votre premier Qwizs !</button>
      </section>

      <section class="cta-section">
        <button class="cta-button" @click="showModal = true">Rejoindre un Quiz</button>
      </section>
    
   <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2 class="modal-title"></h2>

        <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
          <UFormGroup label="Nom d'utilisateur" name="user">
            <UInput v-model="state.user" placeholder="Votre nom..." class="modal-input"/>
          </UFormGroup>

          <UFormGroup label="Code du Quiz" name="room">
            <UInput v-model="state.room" placeholder="Code du quiz..." class="modal-input"/>
          </UFormGroup>

          <div class="modal-actions">
            <UButton type="submit" class="modal-button confirm">Rejoindre</UButton>
            <UButton type="button" class="modal-button cancel" @click="showModal = false">Annuler</UButton>
          </div>
        </UForm>
      </div>
    </div>

    </main>

    <footer class="footer">
      <p class="footer-text">QWIZS &copy; 2025</p>
    </footer>
  </div>


</template>

<style>

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #F9F9FB;
  color: #333;
  line-height: 1.5;
}

.main-content {
  text-align: center;
  padding: 0 20px;
}

.hero {
  background-color: #F2EAFE;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-image {
  width: 100px;
  margin-bottom: 20px;
}

.hero-text {
  max-width: 700px;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #C46FC8;
  margin-bottom: 15px;
}

.hero h1 .highlight {
  color: #86218B;
}

.hero p {
  font-size: 1.2rem;
  color: #666;
}

.challenge-section {
  margin: 50px 0;
}

.challenge-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.challenge-image {
  width: 90%;
  max-width: 600px;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.challenge-text {
  font-size: 1.5rem;
  color: #444;
}

.qr-section {
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-content {
  margin-bottom: 20px;
}

.qr-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.qr-subtext {
  font-size: 1rem;
  color: #777;
}

.qr-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.qr-image {
  width: auto; 
  height: auto;
 }

.cta-section {
  margin: 40px 0;
}

.cta-button {
  background-color: #C46FC8;
  color: #fff;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cta-button:hover {
  background-color: #86218B;
  transform: translateY(-3px);
}

.footer {
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
}

.footer-text {
  margin: 0;
  font-size: 1rem;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}


.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-button {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.confirm {
  background: #C46FC8;
  color: white;
}

.cancel {
  background: #ccc;
}
</style>