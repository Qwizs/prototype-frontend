<template>
    <div class="login-container">
      <div class="login-card">
        <h1 class="title">Se connecter</h1>
        
        <!-- Champs liés aux variables -->
        <input v-model="username" type="text" placeholder="Pseudo" class="input-field" />
        <input v-model="password" type="password" placeholder="Mot de passe" class="input-field" />
        
        <!-- Bouton avec gestionnaire -->
        <button class="submit-button" @click="onSubmit">Valider</button>
        <button class="inscription" @click="router.push('/inscription')"> 
          Pas encore de compte ? Inscris-toi ici !
        </button>
        <!-- <div class="google-login">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google Login"
            class="google-logo"
          />
        </div> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  // Déclaration des variables liées aux inputs
  const username = ref('')
  const password = ref('')
  const router = useRouter()
  
    // Soumission du formulaire
    const onSubmit = async () => {
    const { data, error } = await useFetch(`/administrators/${username.value}/${password.value}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'GET',
      params: {
        username: username.value,
        password: password.value,
      },
    })

    if (error.value) {
      console.error('Erreur lors de la vérification :', error.value)
    } else {
      if (data.value === "true") {
        console.log('Utilisateur trouvé :', data.value)
        console.log('Username :', username.value)
        console.log('Password :', password.value)
        console.log('Data :', data.value)
        localStorage.setItem('username', username.value) // ou sessionStorage
        router.push('/') // redirige vers la page d'accueil
      } else {
        console.log('Username :', username.value)
        console.log('Password :', password.value)
        console.warn('Aucun utilisateur trouvé.')
      }
    }
  }


  </script>
  
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #fff;
  }
  
  .login-card {
    background-color: #fdf4fb;
    padding: 3rem 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    max-width: 400px;
  }
  
  .title {
    font-family: 'Comic Sans MS', cursive, sans-serif;
    font-size: 1.8rem;
    font-weight: bold;
    color: #b55fc0;
    margin-bottom: 2rem;
  }
  
  .input-field {
    width: 100%;
    background-color: #f1dff3;
    border: none;
    padding: 1rem;
    border-radius: 1rem;
    margin-bottom: 1.2rem;
    font-size: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .inscription {
  font-size: 0.85rem;
  color: gray;
  text-decoration: underline;
  margin-top: 1rem;
  cursor: pointer;
}

  
  .submit-button {
    background-color: #d67fd6;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 9999px;
    padding: 0.7rem 2rem;
    font-size: 1rem;
    margin-top: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .submit-button:hover {
    background-color: #be6abe;
  }
  
  /* .google-login {
    margin-top: 2rem;
  }
  
  .google-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    cursor: pointer;
  } */
  </style>
  