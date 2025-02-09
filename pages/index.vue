<template>
  <div>
    <main class="main-content">
      <h1 class="page-title">Mes Qwizs</h1>
      <div class="quiz-container">
        <div class="quiz-card">
          <div class="quiz-icon">
            <img src="../assets/quiz-icon.png" alt="Quiz Icon" />
          </div>
          <p>Premier_Qwiz</p>
          <button class="play-button">▶</button>
        </div>
        <button class="add-quiz-button">+</button>
      </div>
    </main>
  </div>
</template>

<script setup>
</script>

<style>

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
}

.navbar .brand {
  font-size: 1.5rem;
  color: #C46FC8;
  font-weight: bold;
  text-decoration: none;
}

.navbar ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar li {
  margin: 0 10px;
}

.navbar a {
  color: #000;
  text-decoration: none;
  font-size: 1rem;
}

.navbar a:hover {
  color: #C46FC8;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.main-content {
  padding: 20px;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  color: #C46FC8;
  margin-bottom: 20px;
}

.quiz-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
}

.quiz-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 200px;
  height: 150px;
}

.quiz-icon img {
  width: 50px;
  height: 50px;
}

.play-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.play-button:hover {
  background: #45a049;
}

.add-quiz-button {
  position: absolute;
  right: -10px;
  top: -10px;
  background: #C46FC8;
  color: white;
  border: none;
  font-size: 1.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.add-quiz-button:hover {
  background: #C46FC8;
}
</style>
