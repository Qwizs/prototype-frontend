<template>
  <main class="main-content">
    <h1 class="profile">Modifier mes informations</h1>
    
    <div class="edit-container">
        <input v-model="newAdmin.username" type="text" :placeholder="admin.username" class="input" />
        <input v-model="newAdmin.password" type="password" placeholder="********" class="input" />
        <div class="modal-actions">
          <button @click="closeModal" class="btn-secondary">Annuler</button>
          <button @click="updateAdmin" class="btn-primary">Modifier</button>
          
        </div>
      </div>
  </main>   
</template>

<script lang="ts" setup>

import axios from '@/axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const admin = ref({
  idAdministrator: '',
  username: '',
  password: ''
});

const newAdmin = ref({
  username: '',
  password: ''
});


onMounted(async () => {
  loadAdmin();
})

const loadAdmin = async () => {
  const idAdmin = localStorage.getItem('idAdmin') || "";
  admin.value.idAdministrator = idAdmin;
  admin.value.username = localStorage.getItem('username') || "";
  
  try {
    const response = await axios.get(`/administrators/${idAdmin}`);
    admin.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste de quiz", error);
  }
}

const updateAdmin = async () => {
  if (newAdmin.value.password !== ''){
    try {
      const response = await axios.put(`/administrators/${admin.value.idAdministrator}`, newAdmin.value)
      router.push("/connexion");
      localStorage.removeItem('username');
      localStorage.removeItem('idAdmin');
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'administrateur");
    }
  } else {
    try {
      const response = await axios.put(`/administrators/${admin.value.idAdministrator}`, newAdmin.value)
      localStorage.setItem('username', newAdmin.value.username);
      router.push("/profile");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'administrateur");
    }
  }
  
  newAdmin.value = {
    username: "",
    password: ""
  }
  loadAdmin();
  
}



</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Nerko+One&display=swap');

h1.profile {
  text-align: center;
  margin-bottom: 30px;
}


.main-content {
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 1rem;
  padding: 0;  
}


.edit-container {
  margin-top: 0;
  display: flex;
  width: 100%;
  max-width: 20rem;
  flex-direction: column;

  & .modal-actions {
    display: flex;
    gap: .5rem;
    margin-top: .5rem;

    & .btn-primary,.btn-secondary {
    padding: .75rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    height: 100%;
    font-size: 1rem;
  }

  & .btn-primary {
    background: #C46FC8;
    color: white;
  }

  & .btn-secondary {
    background: #ccc;
    color: black;
  }

  & .btn-primary:hover {
    background: #86218B;
  }

  & .btn-secondary:hover {
    background: #bbb;
  }
  }

  
}

.input {
  width: 100%;
  
  padding: .75rem;
  font-size: 1rem;
  border: .1rem solid #ccc;
  border-radius: .5rem;
  margin-bottom: 1rem;
  color: #000000;
}


h1 {
  margin-bottom: 30px;
  color: #C46FC8;
}


input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.profile {
  display: inline-block;
  margin-top: 2rem;
  text-decoration: none;
  font-size: 3rem;
  color: #C46FC8;
  font-family: 'Nerko One', cursive;
  font-weight: bold;
  transition: color 0.2s;
}
</style>