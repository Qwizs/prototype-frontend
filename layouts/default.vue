<template>
  <div>
    <header class="navbar">
      <nav class="navbar-container">
        <NuxtLink class="brand" to="/">
          <img src="/assets/logo-qwizs.png" alt="QWIZS Logo" class="brand-logo" />
        </NuxtLink>

        <ul class="nav-links">
          <li><NuxtLink to="/" class="nav-link">Home</NuxtLink></li>
          <li><NuxtLink to="/quizs" class="nav-link active">Mes QWIZS</NuxtLink></li>
          <li><NuxtLink to="/" class="nav-link">Thèmes de quiz</NuxtLink></li>
        </ul>

        <div class="user-info" @click="toggleMenu">
          <img src="/assets/user-avatar.png" alt="Avatar" class="avatar" />
          <span class="user-name">John Doe</span>

          <div class="user-menu" v-show="isMenuVisible">
            <NuxtLink to="/profile" class="menu-item">Voir le profil</NuxtLink>
            <NuxtLink to="/profile" class="menu-item" @click="editProfile">Modifier le profil</NuxtLink>
            <NuxtLink to="/profile" class="menu-item" @click="changePassword">Changer le mot de passe</NuxtLink>
            <NuxtLink to="/profile" class="menu-item" @click="logout">Se déconnecter</NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMenuVisible = ref(false);

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

const editProfile = () => {
  console.log('Modifier le profil');
};

const changePassword = () => {
  console.log('Changer le mot de passe');
};

const logout = () => {
  console.log('Déconnexion');
};
</script>

<style>

body {
  background-color: #ffffff; 
  margin: 0;
  font-family: Arial, sans-serif;
}

.main-content {
  padding: 40px;
  text-align: center;
  background-color: #ffffff; 
  min-height: calc(100vh - 80px); 
  box-sizing: border-box;
}

.navbar {
  background-color: #ffffff;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  flex-wrap: wrap; 
}

.brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.brand-logo {
  height: 50px;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}

.nav-links .nav-link {
  text-decoration: none;
  color: #000;
  font-size: 1.2rem;
  font-weight: bold;
}

.nav-links .nav-link.active {
  color: #C46FC8; 
}

.nav-links .nav-link:hover {
  color: #C46FC8;
}

.user-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  flex-shrink: 0;
}
.user-info .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info .user-name {
  font-size: 1rem;
  font-weight: bold;
  color: #C46FC8;
}

.user-menu {
  position: absolute;
  top: 50px; 
  right: 0;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
  min-width: 220px;
  z-index: 1000;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.menu-item {
  display: block;
  padding: 12px 18px;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
  color: #4A4A4A;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(134, 33, 139, 0.1);
  color: #C46FC8;
}

main {
  background-color: #ffffff; 
  padding: 40px;
  min-height: 100vh; 
  box-sizing: border-box;
}

@media (max-width: 1024px) {
  .navbar-container {
    flex-direction: column;
    align-items: center;
    padding: 10px 15px;
  }

  .nav-links {
    gap: 15px;
  }

  .user-info {
    margin-top: 10px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 10px 15px;
  }

  .navbar-container {
    flex-direction: column;
    align-items: center;
  }

  .nav-links {
    gap: 10px;
  }

  .user-info {
    margin-top: 10px;
  }

  .user-info .user-name {
    display: none; 
  }
}
</style>
