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

// Compteur de piochage indépendant pour chaque joueur (évite que les joueurs se décalent entre eux)
const pileCount = { haut: 0, bas: 0, gauche: 0, droite: 0 };

// Main (cartes) et nom affiché de chaque joueur
const mains = { haut: [], bas: [], gauche: [], droite: [] };
const noms = { haut: '', bas: 'Moi', gauche: '', droite: '' };

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
  if (el) el.textContent = score;
  if (score > 21 && el) {
    el.style.color = '#ff8080';
  }
}

function GenerCarte() {
  joueurs.forEach((joueur, j) => {
    setTimeout(() => {
      const numbercarte = valeurs[Math.floor(Math.random() * valeurs.length)];
      const signecarte = couleurs[Math.floor(Math.random() * couleurs.length)];
      const contenu = `${numbercarte} ${signecarte}`;

      mains[joueur].push(numbercarte);

      const carte = document.createElement('div');
      carte.className = 'cart';
      carte.textContent = contenu;
      carte.style.display = 'flex';
      carte.style.position = 'absolute';
      carte.style.lineHeight = '134px';
      carte.style.margin = '0';
      carte.style.gap = '15px';

      // Position de départ : au niveau du deck, au centre de la table (comme si la carte sortait du paquet)
      carte.style.left = '50%';
      carte.style.top = '50%';
      carte.style.transform = `translate(-50%, -50%) rotate(${tourncartes[j]}deg)`;
      carte.style.opacity = '0';

      document.querySelector('.container').appendChild(carte);

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

      mettreAJourScore(joueur);
    }, j * 150); // les cartes partent l'une après l'autre, pas toutes en même temps
  });
}

document.querySelector('.deck-animated').addEventListener('click', () => {
  if (jeuTermine) return;
  document.getElementsByClassName('titre')[0].style.display = 'none';
  document.getElementById('stop-button').style.display = 'inline-block';
  GenerCarte();
});

document.getElementById('stop-button').addEventListener('click', () => {
  if (jeuTermine) return;
  jeuTermine = true;
  document.querySelector('.deck-animated').classList.add('inactive');
  determinerGagnant();
});

function determinerGagnant() {
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
