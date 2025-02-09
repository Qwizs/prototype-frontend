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
</style>
