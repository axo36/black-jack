// ⤵️ Mets tout ton code JavaScript ici
    const joueurs = ['haut', 'bas', 'gauche', 'droite'];
    const Xpositioncarte = ['44.5', '10', '44.5', '79'];
    const Ypositioncarte = ['71', '38', '6', '37'];
    const tourncartes = ['0', '90', '-180', '-90'];
    const valeurs = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const couleurs = ['♠', '♥', '♦', '♣'];
    const xdecalecarte = ['10', '0', '10', '0'];
    const ydecalecarte = ['0', '10', '0', '10'];
    let nombreDePiochesx = 0;
    let nombreDePiochesy = 0;
    let i = 0;

    function GenerCarte() {
      for (let j = 0; j < joueurs.length; j++) {
        setTimeout(() => {
          const numbercarte = valeurs[Math.floor(Math.random() * valeurs.length)];
          const signecarte = couleurs[Math.floor(Math.random() * couleurs.length)];
          const contenu = `${numbercarte} ${signecarte}`;

          const carte = document.createElement('div');
          carte.className = 'cart';
          carte.textContent = contenu;
          carte.style.display = 'flex';
          carte.style.position = 'absolute';

          let xDecal = parseInt(xdecalecarte[j]) * nombreDePiochesx;
          let yDecal = parseInt(ydecalecarte[j]) * nombreDePiochesy;

          carte.style.left = `calc(${Xpositioncarte[j]}vw + ${xDecal}px)`;
          carte.style.top = `calc(${Ypositioncarte[j]}vh + ${yDecal}px)`;
          carte.style.transform = `rotate(${tourncartes[j]}deg)`;
          carte.style.lineHeight = '134px';
          carte.style.margin = '5px';
          carte.style.gap = '15px';

          document.querySelector('.container').appendChild(carte); // <-- la carte n'était jamais ajoutée à la page !

          if (xdecalecarte[j] !== '0') {
            nombreDePiochesx++;
          }
          if (ydecalecarte[j] !== '0') {
            nombreDePiochesy++;
          }
        }, 0);
      }
    }

    function distribuerCartes() {
      i = (i + 1) % 4;
    }

    document.querySelector('.deck-animated').addEventListener('click', () => {
      document.getElementsByClassName("titre")[0].style.display = "none";
      distribuerCartes();
      GenerCarte();
    });

    function genererTroisPrenomsDansDivs() {
      const prenoms = ["Emma", "Lucas", "Chloé", "Léo", "Manon", "Noah", "Lina", "Hugo", "Inès", "Nathan", "Omare", "Moamed", "Ilan", "Matt", "maily"];
      const prenom1 = prenoms[Math.floor(Math.random() * prenoms.length)];
      const prenom2 = prenoms[Math.floor(Math.random() * prenoms.length)];
      const prenom3 = prenoms[Math.floor(Math.random() * prenoms.length)];
      document.getElementById("haut").innerHTML = prenom1;
      document.getElementById("gauche").innerHTML = prenom2;
      document.getElementById("droite").innerHTML = prenom3;
    }
    genererTroisPrenomsDansDivs();
