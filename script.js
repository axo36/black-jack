// ⤵️ Mets tout ton code JavaScript ici
const joueurs = ['haut', 'bas', 'gauche', 'droite'];
const banque = 'haut'; // la banque : tout le monde joue contre elle, pas entre eux

// Position finale de chaque joueur. La banque est au centre de la table.
const Xpositioncarte = ['44.5', '44.5', '10', '79'];   // haut(banque), bas, gauche, droite
const Ypositioncarte = ['42', '71', '38', '38'];       // haut(banque), bas, gauche, droite

// Orientation de chaque carte : le "haut" de la carte pointe...
// banque -> vers la gauche, bas (moi) -> vers la droite, gauche -> vers le bas, droite -> vers le haut
const tourncartes = ['-90', '90', '180', '0'];         // haut, bas, gauche, droite

const valeurs = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const couleurs = ['♠', '♥', '♦', '♣'];

// Décalage entre les cartes d'un même joueur, bien espacé pour lire le score et toutes les cartes
const xdecalecarte = ['40', '40', '0', '0'];
const ydecalecarte = ['0', '0', '40', '40'];

// Compteur de piochage indépendant pour chaque joueur
const pileCount = { haut: 0, bas: 0, gauche: 0, droite: 0 };

// Main (cartes), nom affiché et éléments DOM des cartes de chaque joueur
const mains = { haut: [], bas: [], gauche: [], droite: [] };
const noms = { haut: '', bas: 'Moi', gauche: '', droite: '' };
const cartesElements = { haut: [], bas: [], gauche: [], droite: [] };

// Les 3 adversaires (dont la banque) jouent chacun pour leur compte
const enJeu = { haut: true, gauche: true, droite: true };

let menuFerme = false;   // menu de démarrage fermé
let partieLancee = false; // la manche en cours a été lancée
let jeuTermine = false;
let enCours = false; // empêche de spammer le paquet pendant une animation

// ---------- Jetons Créo ----------
let solde = 500;
let miseActuelle = 0;

function majAffichageSolde() {
  document.getElementById('solde-permanent-affiche').textContent = solde;
  document.getElementById('recharge-button').style.display = solde < 10 ? 'inline-block' : 'none';
}

function majAffichageMise() {
  document.getElementById('mise-affiche').textContent = miseActuelle;
  document.getElementById('lancer-button').disabled = miseActuelle <= 0;
}

document.querySelectorAll('.jeton[data-valeur]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const val = parseInt(btn.dataset.valeur, 10);
    if (val > solde) return;
    solde -= val;
    miseActuelle += val;
    majAffichageSolde();
    majAffichageMise();
  });
});

document.getElementById('annuler-mise').addEventListener('click', () => {
  solde += miseActuelle;
  miseActuelle = 0;
  majAffichageSolde();
  majAffichageMise();
});

document.getElementById('recharge-button').addEventListener('click', () => {
  solde += 500;
  majAffichageSolde();
});

// ---------- Logique du jeu ----------

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

function annoncerStatut(joueur, texte) {
  const el = document.getElementById(`statut-${joueur}`);
  if (!el) return;
  el.textContent = texte;
  el.classList.add('visible');
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

  // Mes cartes (bas) sont visibles tout de suite ; la banque montre sa toute première carte
  // (comme au vrai jeu) ; le reste reste caché pour le suspense, pour tout le monde y compris l'IA.
  if (joueur === 'bas' || (joueur === banque && mains[joueur].length === 1)) {
    carte.classList.add('revele');
  }

  // Position de départ : au niveau du paquet (sa position actuelle, décalée ou non)
  const deckRect = document.querySelector('.deck-animated').getBoundingClientRect();
  const containerRect = document.querySelector('.container').getBoundingClientRect();
  const startLeft = deckRect.left - containerRect.left + deckRect.width / 2;
  const startTop = deckRect.top - containerRect.top + deckRect.height / 2;

  carte.style.left = `${startLeft}px`;
  carte.style.top = `${startTop}px`;
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

function GenerCarte() {
  enCours = true;
  let dernierDelai = 0;

  joueurs.forEach((joueur, j) => {
    // Décision de chaque joueur : moi je pioche toujours quand je clique, les IA (dont la banque) décident selon leur score
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

    // Règlement de la mise (jetons Créo), uniquement pour moi (bas)
    let messageMise = '';
    if (miseActuelle > 0) {
      const scoreBas = calculerScore(mains.bas);
      if (scoreBas > 21) {
        messageMise = `Tu perds ta mise de ${miseActuelle} Créo.`;
      } else if (banqueBust || scoreBas > scoreBanque) {
        const blackjackNaturel = mains.bas.length === 2 && scoreBas === 21;
        const gain = blackjackNaturel ? Math.round(miseActuelle * 2.5) : miseActuelle * 2;
        solde += gain;
        messageMise = blackjackNaturel ? `Blackjack ! Tu gagnes ${gain} Créo !` : `Tu gagnes ${gain} Créo !`;
      } else if (scoreBas === scoreBanque) {
        solde += miseActuelle;
        messageMise = `Égalité, ta mise de ${miseActuelle} Créo t'est rendue.`;
      } else {
        messageMise = `Tu perds ta mise de ${miseActuelle} Créo.`;
      }
      majAffichageSolde();
    }

    document.getElementById('resultat').innerHTML = [ligneBanque, ...lignes, messageMise].filter(Boolean).join('<br>');
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
  partieLancee = false;
  miseActuelle = 0;
  majAffichageMise();

  document.querySelector('.deck-animated').classList.remove('inactive');
  document.querySelector('.deck-animated').classList.remove('decale');

  const stopBtn = document.getElementById('stop-button');
  stopBtn.style.display = 'none';
  stopBtn.disabled = false;
  stopBtn.classList.remove('desactive');

  document.getElementById('rejouer-button').style.display = 'none';
  document.getElementById('resultat').innerHTML = '';
  document.getElementById('panneau-mise').style.display = 'flex';

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

document.getElementById('lancer-button').addEventListener('click', () => {
  if (miseActuelle <= 0 || partieLancee) return;
  partieLancee = true;

  document.getElementsByClassName('titre')[0].style.display = 'none';
  document.getElementById('panneau-mise').style.display = 'none';
  document.getElementById('stop-button').style.display = 'inline-block';

  // La pioche se décale pour laisser la place à la banque, au centre de la table
  document.querySelector('.deck-animated').classList.add('decale');

  setTimeout(() => {
    GenerCarte();
  }, 500);
});

document.querySelector('.deck-animated').addEventListener('click', () => {
  if (!menuFerme || !partieLancee || jeuTermine || enCours) return;
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
majAffichageSolde();
majAffichageMise();
