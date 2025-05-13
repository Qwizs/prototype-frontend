<template>
  <main class="main-content">
    <h1 class="profile">Bienvenue, {{ admin.username }} !</h1>
      <div class="profil-container">
        
        <div class="image-title">
        <img src="/assets/modify.png"
          alt="Modify Quiz"
          class="button-quiz-image"
          @click="openModal"
        />
        <h1 class="profile">Mon Profil</h1>
        </div>
        

        <p><strong>Nom d'utilisateur :</strong></p>
        <p>{{ admin.username }}</p>
        <p><strong>Mot de passe :</strong></p>
        <p>****</p>        
      </div>


    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Modification du compte</h2>
        <input v-model="newName" type="text" :placeholder="storedUsername" class="input" />
        <input v-model="newPassword" type="text" placeholder="********" class="input" />
        <div class="modal-actions">
          <button @click="updateAdmin" class="btn-primary">Modifier</button>
          <button @click="closeModal" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div>  
  </main>   
</template>

<script lang="ts" setup>

// import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const admin = ref({
  idAdministrator: null,
  username: '',
  password: ''
});

const showModal = ref(false);


const storedUsername = localStorage.getItem('username');
const storedPassword = localStorage.getItem('password');
const newName = ref("");
const newPassword = ref("");
const adminId = ref("");

onMounted(async () => {
  loadAdmin();
})

const openModal = () => {
  showModal.value = true;
  newName.value = "";
  newPassword.value = "";
};

const closeModal = () => {
  showModal.value = false;
  newName.value = "";
  newPassword.value = "";
};

const loadAdmin = async () => {
  console.log("username:", localStorage.getItem('username'));
  console.log("password:", localStorage.getItem('password'));

  const { data, error } = await useFetch(`/administrators/findId/${localStorage.getItem('username')}/${localStorage.getItem('password')}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (error.value || !data.value) {
    console.error("Erreur lors de la récupération de l'administrateur");
    return;
  }
  adminId.value = data.value;
  console.log("idAdministrateur :", adminId);

  const { data: data2, error: error2 } = await useFetch(`/administrators/${adminId.value}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (error2.value || !data2.value) {
    console.error("Erreur lors de la récupération de l'administrateur");
    return;
  }

  console.log("data2", data2.value.idAdministrator);
  admin.value = data2.value;
  console.log("admin", admin.value)

}


const updateAdmin = async () => {

  const body = {};
  
  if (newName.value?.trim()) {
      body.username = newName.value.trim();
      localStorage.setItem('username', newName.value)
  }

  if (newPassword.value?.trim()) {
      body.password = newPassword.value.trim();
      localStorage.setItem('password', newPassword.value)
  }

  const { data, error } = await useFetch(`/administrators/${adminId.value}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'PUT',
    body,
  });

  if (error.value || !data.value) {
    console.error("Erreur lors de la récupération de l'administrateur");
    return;
  }

  console.log("username:", storedUsername);
  console.log("password:", storedPassword);

  console.log("data : ", data.value);
  newName.value = "";
  newPassword.value = "";
  loadAdmin();
  closeModal();
}



</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Nerko+One&display=swap');

h1.profile {
  text-align: center;  /* Centre le texte horizontalement */
  margin-bottom: 30px; /* Un peu d'espace en bas pour espacer le reste du contenu */
}


.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;   /* Centre les éléments horizontalement */
  justify-content: center; /* Centre les éléments verticalement */
  min-height: 100vh;      /* Assure que tout est centré même si le contenu est peu élevé */
  padding: 20px;
}


.profil-container {
  margin-top: 0; /* annule tout écart inutile s'il y en a */
}


.image-title {
  display: flex;
  align-items: center;       /* centre verticalement l'image et le texte */
  justify-content: center;   /* centre horizontalement le bloc image + titre */
  gap: 10px;                 /* espace entre l’image et le texte */
  margin-bottom: 20px;       /* un petit espace sous le titre */
}


.button-quiz-image {
  width: 40px; /* ou autre taille selon ton design */
  height: auto;
  cursor: pointer;
}


.input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 3px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #000000;
}


/* .button-quiz-image {
  width: 60px;
  height: 60px;
  cursor: pointer;
  margin: 1%;
  transition: transform 0.2s ease;
  z-index: 1;
  position: relative;
} 
*/

.button-quiz-image:hover {
  transform: scale(1.1);
}

.profil-container {
  justify-content: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

h1 {
  margin-bottom: 30px;
  color: #C46FC8;
}

.profil-info p {
  margin: 10px 0;
  font-size: 1.1rem;
}

.profil-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.profile {
  display: inline-block;
  margin-top: 30px;
  text-decoration: none;
  font-size: 3rem;
  color: #C46FC8;
  font-family: 'Nerko One', cursive;
  font-weight: bold;
  transition: color 0.2s;
}
</style>