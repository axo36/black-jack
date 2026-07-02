@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: brown;
  padding: 12px;
  font-family: Nunito;
}

.container {
  background-color: green;
  min-height: 90vh;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  text-align: center;
}

/* ---------- Menu de démarrage ---------- */

.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 15, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.menu-overlay.cache {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.menu-box {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 32px 30px;
  max-width: 380px;
  text-align: center;
  color: #17311f;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
}

.menu-box h1 {
  color: #1b5e20;
  font-size: 2em;
  margin: 4px 0 8px;
}

.menu-box p {
  line-height: 1.5;
  opacity: 0.85;
  font-size: 0.95em;
}

.menu-cartes {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.mini-carte {
  width: 44px;
  height: 60px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95em;
  animation: flotte 2.4s ease-in-out infinite;
}

.mini-carte.c1 { color: #222; animation-delay: 0s; }
.mini-carte.c2 { color: #d1264f; animation-delay: 0.2s; }
.mini-carte.c3 { color: #2f6fed; animation-delay: 0.4s; }

@keyframes flotte {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-8px) rotate(4deg); }
}

#jouer-button {
  margin-top: 14px;
  padding: 12px 32px;
  font-size: 1.05em;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd76b, #ff9f43);
  color: #1a1a1a;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

#jouer-button:hover {
  transform: scale(1.05);
}

/* ---------- Deck ---------- */

.deck-animated {
  width: 170px;
  height: 234px;
  background: #07192E;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.253);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  transition: all 0.6s ease;
  cursor: pointer;
}

.deck-animated h2 {
  z-index: 1;
  color: antiquewhite;
  font-size: 2em;
  font-family: Nunito;
}

.deck-animated::after {
  content: '';
  position: absolute;
  background-color: #020025;
  inset: 5px;
  border-radius: 15px;
}

.deck-animated::before {
  content: '';
  position: absolute;
  width: 110px;
  height: 130%;
  background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255));
  animation: rotBGimg 3s linear infinite;
  display: flex;
}

@keyframes rotBGimg {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.deck-animated.inactive {
  filter: grayscale(0.8);
  pointer-events: none;
  cursor: not-allowed;
}

/* ---------- Joueurs ---------- */

.player {
  position: absolute;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-family: Nunito;
  font-weight: 800;
  align-items: center;
  color: white;
}

.player .nom {
  font-size: 1.1em;
}

.player .score {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 0.9em;
}

.player .statut {
  font-size: 0.75em;
  font-weight: 600;
  font-style: italic;
  opacity: 0;
  color: #ffd76b;
  width: 100%;
  transition: opacity 0.4s ease;
}

.player .statut.visible {
  opacity: 1;
}

.badge-banque {
  background: linear-gradient(135deg, #ffd76b, #ff9f43);
  color: #1a1a1a;
  font-size: 0.65em;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
  width: fit-content;
}

.haut   { top: 10px; left: 50%; transform: translateX(-50%); }
.bas    { bottom: 10px; left: 50%; transform: translateX(-50%); }
.gauche { top: 50%; left: 10px; transform: translateY(-50%); flex-direction: column; }
.droite { top: 50%; right: 10px; transform: translateY(-50%); flex-direction: column; }

/* ---------- Boutons / résultat ---------- */

.actions {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 20;
}

#stop-button, #rejouer-button {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

#stop-button {
  background: #222;
  color: white;
}

#stop-button.desactive {
  opacity: 0.5;
  cursor: not-allowed;
}

#rejouer-button {
  background: linear-gradient(135deg, #ffd76b, #ff9f43);
  color: #1a1a1a;
  font-weight: 800;
}

#stop-button:hover, #rejouer-button:hover {
  transform: scale(1.05);
}

#resultat {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  font-size: 1.1em;
  line-height: 1.6;
  color: white;
  font-weight: bold;
}

h1 {
  font-family: Nunito;
}

.titre {
  display: block;
}

/* ---------- Cartes ---------- */

.cart {
  width: 100px;
  height: 134px;
  display: none;
  position: absolute;
  z-index: 10;
  perspective: 800px;
}

.cart-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}

.cart.revele .cart-inner {
  transform: rotateY(180deg);
}

.cart-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  backface-visibility: hidden;
  font-family: Nunito;
  font-size: 2em;
  font-weight: 800;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.788);
}

.cart-back {
  background: repeating-linear-gradient(45deg, #0b2a52, #0b2a52 8px, #123a6b 8px, #123a6b 16px);
  border: 3px solid rgba(255, 182, 255, 0.4);
}

.cart-front {
  transform: rotateY(180deg);
  color: white;
  border: 3px solid transparent;
  background: linear-gradient(#020025) padding-box,
              linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255)) border-box;
}
