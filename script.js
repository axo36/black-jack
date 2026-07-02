// ⤵️ Mets tout ton code JavaScript ici
const joueurs = ['haut', 'bas', 'gauche', 'droite'];
const banque = 'haut'; // la banque : tout le monde joue contre elle, pas entre eux

// Position finale de chaque joueur, alignée avec sa position réelle à l'écran
const Xpositioncarte = ['44.5', '44.5', '10', '79'];   // haut, bas, gauche, droite
const Ypositioncarte = ['8', '71', '38', '38'];        // haut, bas, gauche, droite

// Orientation de chaque carte : le "haut" de la carte pointe...
// haut -> vers la gauche, bas (moi) -> vers la droite, gauche -> vers le bas, droite -> vers le haut
const tourncartes = ['-90', '90', '180', '0'];         // haut, bas, gauche, droite

const valeurs = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const couleurs = ['♠', '♥', '♦', '♣'];

// Décalage entre les cartes d'un même joueur : horizontal pour haut/bas, vertical pour gauche/droite
const xdecalecarte = ['10', '10', '0', '0'];
const ydecalecarte = ['0', '0', '10', '10'];

// Compteur de piochage indépendant pour chaque joueur
const pileCount = { haut: 0, bas: 0, gauche: 0, droite: 0 };

// Main (cartes), nom affiché et éléments DOM des cartes de chaque joueur
const mains = { haut: [], bas: [], gauche: [], droite: [] };
const noms = { haut: '', bas: 'Moi', gauche: '', droite: '' };
const cartesElements = { haut: [], bas: [], gauche: [], droite: [] };

// Les 3 adversaires jouent chacun pour leur compte : true = ils tirent encore, false = ils ont choisi de s'arrêter
const enJeu = { haut: true, gauche: true, droite: true };

let menuFerme = false;
let jeuTermine = false;
let enCours = false; // empêche de spammer le paquet pendant une animation

function calculerScore(cartes) {
  let total = 0;
  let as = 0;
  for (const c of cartes) {
    if (c === 'A') {
      total += 11;
      as++;
    } else if (c === 'J' || c === 'Q' || c === 'K') {
      total += 10;
    } else {
      total += parseInt(c, 10);
    }
  }
  while (total > 21 && as > 0) {
    total -= 10;
    as--;
  }
  return total;
}

function mettreAJourScore(joueur) {
  const score = calculerScore(mains[joueur]);
  const el = document.getElementById(`score-${joueur}`);
  if (el) {
    el.textContent = score;
    el.style.color = score > 21 ? '#ff8080' : '';
  }
}

function creerCarteDOM(joueur, j, numbercarte, signecarte) {
  const contenu = `${numbercarte} ${signecarte}`;

  const carte = document.createElement('div');
  carte.className = 'cart';
  carte.style.display = 'block';
  carte.style.position = 'absolute';

  const inner = document.createElement('div');
  inner.className = 'cart-inner';

  const dos = document.createElement('div');
  dos.className = 'cart-face cart-back';

  const face = document.createElement('div');
  face.className = 'cart-face cart-front';
  face.textContent = contenu;

  inner.appendChild(dos);
  inner.appendChild(face);
  carte.appendChild(inner);

  // Mes cartes (bas) sont visibles tout de suite ; la banque montre sa toute première carte (comme au vrai jeu) ; le reste reste caché (suspense)
  if (joueur === 'bas' || (joueur === banque && mains[joueur].length === 1)) {
    carte.classList.add('revele');
  }

  // Position de départ : au niveau du deck, au centre de la table
  carte.style.left = '50%';
  carte.style.top = '50%';
  carte.style.transform = `translate(-50%, -50%) rotate(${tourncartes[j]}deg)`;
  carte.style.opacity = '0';

  document.querySelector('.container').appendChild(carte);
  cartesElements[joueur].push(carte);

  const compte = pileCount[joueur];
  const xDecal = parseInt(xdecalecarte[j], 10) * compte;
  const yDecal = parseInt(ydecalecarte[j], 10) * compte;
  pileCount[joueur]++;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      carte.style.transition = 'left 0.6s ease, top 0.6s ease, transform 0.6s ease, opacity 0.4s ease';
      carte.style.left = `calc(${Xpositioncarte[j]}vw + ${xDecal}px)`;
      carte.style.top = `calc(${Ypositioncarte[j]}vh + ${yDecal}px)`;
      carte.style.transform = `rotate(${tourncartes[j]}deg)`;
      carte.style.opacity = '1';
    });
  });
}

function annoncerStatut(joueur, texte) {
  const el = document.getElementById(`statut-${joueur}`);
  if (!el) return;
  el.textContent = texte;
  el.classList.add('visible');
}

function GenerCarte() {
  enCours = true;
  let dernierDelai = 0;

  joueurs.forEach((joueur, j) => {
    // Décision de chaque joueur : moi je pioche toujours quand je clique, les IA décident selon leur score
    const doitJouer = joueur === 'bas' || (enJeu[joueur] && calculerScore(mains[joueur]) < 17);
    if (!doitJouer) {
      if (joueur !== 'bas' && enJeu[joueur]) {
        enJeu[joueur] = false;
        annoncerStatut(joueur, 'reste sur sa main ✋');
      }
      return;
    }

    if (joueur !== 'bas') {
      annoncerStatut(joueur, 'pioche une carte...');
    }

    const delai = j * 150;
    dernierDelai = Math.max(dernierDelai, delai);

    setTimeout(() => {
      const numbercarte = valeurs[Math.floor(Math.random() * valeurs.length)];
      const signecarte = couleurs[Math.floor(Math.random() * couleurs.length)];

      mains[joueur].push(numbercarte);
      creerCarteDOM(joueur, j, numbercarte, signecarte);

      if (joueur === 'bas') {
        mettreAJourScore('bas');
        if (calculerScore(mains.bas) > 21) {
          setTimeout(() => arreterPartie(), 500);
        }
      }
    }, delai);
  });

  setTimeout(() => {
    enCours = false;
  }, dernierDelai + 700);
}

function arreterPartie() {
  if (jeuTermine) return;
  jeuTermine = true;

  document.querySelector('.deck-animated').classList.add('inactive');
  const stopBtn = document.getElementById('stop-button');
  stopBtn.disabled = true;
  stopBtn.classList.add('desactive');

  determinerGagnant();
}

function determinerGagnant() {
  // Révélation des cartes cachées, toutes en même temps : le moment suspense !
  joueurs.forEach((j) => {
    if (j !== 'bas') {
      cartesElements[j].forEach((carte) => carte.classList.add('revele'));
    }
  });

  setTimeout(() => {
    joueurs.forEach((j) => mettreAJourScore(j));

    const scoreBanque = calculerScore(mains[banque]);
    const banqueBust = scoreBanque > 21;

    const contreLaBanque = joueurs.filter((j) => j !== banque); // bas, gauche, droite

    const lignes = contreLaBanque.map((j) => {
      const score = calculerScore(mains[j]);
      let issue;
      if (score > 21) {
        issue = 'perdu (plus de 21)';
      } else if (banqueBust) {
        issue = 'gagné (la banque a dépassé 21)';
      } else if (score > scoreBanque) {
        issue = 'gagné';
      } else if (score === scoreBanque) {
        issue = 'égalité';
      } else {
        issue = 'perdu';
      }
      return `${noms[j]} : ${score} — ${issue}`;
    });

    const ligneBanque = banqueBust
      ? `${noms[banque]} (banque) : ${scoreBanque} — a dépassé 21 !`
      : `${noms[banque]} (banque) : ${scoreBanque}`;

    document.getElementById('resultat').innerHTML = [ligneBanque, ...lignes].join('<br>');
    document.getElementById('rejouer-button').style.display = 'inline-block';
  }, 700);
}

function resetPartie() {
  document.querySelectorAll('.cart').forEach((c) => c.remove());

  joueurs.forEach((j) => {
    mains[j] = [];
    cartesElements[j] = [];
    pileCount[j] = 0;
  });
  enJeu.haut = true;
  enJeu.gauche = true;
  enJeu.droite = true;

  jeuTermine = false;
  enCours = false;

  document.querySelector('.deck-animated').classList.remove('inactive');

  const stopBtn = document.getElementById('stop-button');
  stopBtn.style.display = 'none';
  stopBtn.disabled = false;
  stopBtn.classList.remove('desactive');

  document.getElementById('rejouer-button').style.display = 'none';
  document.getElementById('resultat').textContent = '';

  document.getElementById('score-bas').textContent = '0';
  document.getElementById('score-bas').style.color = '';
  ['haut', 'gauche', 'droite'].forEach((j) => {
    const el = document.getElementById(`score-${j}`);
    el.textContent = '?';
    el.style.color = '';
    const statutEl = document.getElementById(`statut-${j}`);
    statutEl.textContent = '';
    statutEl.classList.remove('visible');
  });

  document.getElementsByClassName('titre')[0].style.display = 'block';
  genererTroisPrenomsDansDivs();
}

document.getElementById('jouer-button').addEventListener('click', () => {
  document.getElementById('menu-overlay').classList.add('cache');
  menuFerme = true;
});

document.querySelector('.deck-animated').addEventListener('click', () => {
  if (!menuFerme || jeuTermine || enCours) return;
  document.getElementsByClassName('titre')[0].style.display = 'none';
  document.getElementById('stop-button').style.display = 'inline-block';
  GenerCarte();
});

document.getElementById('stop-button').addEventListener('click', arreterPartie);

document.getElementById('rejouer-button').addEventListener('click', resetPartie);

function genererTroisPrenomsDansDivs() {
  const prenoms = ['Emma', 'Lucas', 'Chloé', 'Léo', 'Manon', 'Noah', 'Lina', 'Hugo', 'Inès', 'Nathan', 'Omar', 'Mohamed', 'Ilan', 'Matt', 'Maily'];
  const prenom1 = prenoms[Math.floor(Math.random() * prenoms.length)];
  const prenom2 = prenoms[Math.floor(Math.random() * prenoms.length)];
  const prenom3 = prenoms[Math.floor(Math.random() * prenoms.length)];

  noms.haut = prenom1;
  noms.gauche = prenom2;
  noms.droite = prenom3;

  document.querySelector('#haut .nom').textContent = prenom1;
  document.querySelector('#gauche .nom').textContent = prenom2;
  document.querySelector('#droite .nom').textContent = prenom3;
}
genererTroisPrenomsDansDivs();
