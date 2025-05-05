<script setup lang="ts">
import { ref, nextTick } from 'vue'
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
  await nextTick()
  router.push(`/quiz/${infos.value.room}/waiting?user=${infos.value.user}`)
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

      <section class="cta-section">
        <button class="cta-button" @click="showModal = true">Rejoindre un Quiz</button>
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

      <div v-if="showModal" class="modal-overlay" role="dialog" aria-modal="true">
        <div class="modal">
          <h2 class="modal-title">Rejoindre un Quiz</h2>
          <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
            <UFormGroup name="user" class="modal-label">
              <UInput v-model="state.user" placeholder="Nom du Joueur" class="modal-input" />
            </UFormGroup>

            <UFormGroup name="room" class="modal-label">
              <UInput v-model="state.room" placeholder="Code du Quiz" class="modal-input" />
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
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #86218B;
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

.qr-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.qr-subtext {
  font-size: 1rem;
  color: #777;
}

.qr-image {
  max-width: 160px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.footer {
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px 25px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #C46FC8;
  margin-bottom: 20px;
}

.modal input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 1rem;
  color: #333 !important;
  background-color: transparent !important;
  transition: border-color 0.3s ease;
}

.modal-input:focus {
  border-color: #C46FC8;
  outline: none;
}

.modal-input::placeholder {
  color: #999;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.modal-button {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}


.modal-button.confirm {
  background-color: #C46FC8;
  color: white;
}


.modal-button.confirm:hover {
  background-color: #86218B;
}

.modal-button.cancel {
  background-color: #f2f2f2;
  color: #555;
}

.modal-button.cancel:hover {
  background-color: #e0e0e0;
}

.modal-label label {
  color: #333 !important ;
  font-weight: 600;
  font-size: 0.95rem;
}
</style>