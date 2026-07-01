// ⤵️ Mets tout ton code JavaScript ici
const joueurs = ['haut', 'bas', 'gauche', 'droite'];

// Position finale de chaque joueur, alignée avec sa position réelle à l'écran
const Xpositioncarte = ['44.5', '44.5', '10', '79'];   // haut, bas, gauche, droite
const Ypositioncarte = ['8', '71', '38', '38'];        // haut, bas, gauche, droite

// Rotation de la carte selon le point de vue de chaque joueur
// (0 = pour nous, "bas" ; les autres sont tournées pour être lisibles depuis leur place autour de la table)
const tourncartes = ['180', '0', '-90', '90'];         // haut, bas, gauche, droite

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

let menuFerme = false;
let jeuTermine = false;

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

function GenerCarte() {
  joueurs.forEach((joueur, j) => {
    setTimeout(() => {
      const numbercarte = valeurs[Math.floor(Math.random() * valeurs.length)];
      const signecarte = couleurs[Math.floor(Math.random() * couleurs.length)];
      const contenu = `${numbercarte} ${signecarte}`;

      mains[joueur].push(numbercarte);

      // Structure carte : une face "dos" (visible par défaut pour les autres joueurs) et une face "valeur"
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

      // Nos propres cartes (bas) sont visibles tout de suite, les autres restent cachées (suspense)
      if (joueur === 'bas') {
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

      // On force le navigateur à peindre la position de départ avant de lancer l'animation vers la position finale
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          carte.style.transition = 'left 0.6s ease, top 0.6s ease, transform 0.6s ease, opacity 0.4s ease';
          carte.style.left = `calc(${Xpositioncarte[j]}vw + ${xDecal}px)`;
          carte.style.top = `calc(${Ypositioncarte[j]}vh + ${yDecal}px)`;
          carte.style.transform = `rotate(${tourncartes[j]}deg)`;
          carte.style.opacity = '1';
        });
      });

      if (joueur === 'bas') {
        mettreAJourScore('bas');
      }
    }, j * 150); // les cartes partent l'une après l'autre, pas toutes en même temps
  });
}

document.getElementById('jouer-button').addEventListener('click', () => {
  document.getElementById('menu-overlay').classList.add('cache');
  menuFerme = true;
});

document.querySelector('.deck-animated').addEventListener('click', () => {
  if (!menuFerme || jeuTermine) return;
  document.getElementsByClassName('titre')[0].style.display = 'none';
  document.getElementById('stop-button').style.display = 'inline-block';
  GenerCarte();
});

document.getElementById('stop-button').addEventListener('click', () => {
  if (jeuTermine) return;
  jeuTermine = true;

  document.querySelector('.deck-animated').classList.add('inactive');
  const stopBtn = document.getElementById('stop-button');
  stopBtn.disabled = true;
  stopBtn.classList.add('desactive');

  determinerGagnant();
});

function determinerGagnant() {
  // Révélation des cartes cachées, tous en même temps : le moment suspense !
  joueurs.forEach((j) => {
    if (j !== 'bas') {
      cartesElements[j].forEach((carte) => carte.classList.add('revele'));
    }
  });

  // On laisse le temps à l'animation de retournement de se jouer avant d'annoncer le résultat
  setTimeout(() => {
    joueurs.forEach((j) => mettreAJourScore(j));

    const resultats = joueurs.map((j) => ({ joueur: j, score: calculerScore(mains[j]) }));
    const valides = resultats.filter((r) => r.score <= 21);
    const resultatDiv = document.getElementById('resultat');

    if (valides.length === 0) {
      resultatDiv.textContent = 'Tout le monde a dépassé 21, personne ne gagne !';
      return;
    }

    const meilleur = Math.max(...valides.map((r) => r.score));
    const gagnants = valides.filter((r) => r.score === meilleur).map((r) => noms[r.joueur]);

    resultatDiv.textContent =
      gagnants.length > 1
        ? `Égalité entre ${gagnants.join(' et ')} avec ${meilleur} points !`
        : `${gagnants[0]} gagne avec ${meilleur} points !`;
  }, 700);
}

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
