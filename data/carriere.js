// Personnalités jouables. La dernière lettre du nom de famille est enlevée.
// Un personnage créé par le joueur garde le nom saisi.
window.CARRIERE = {
  ordre: ["us", "gb", "ru", "br", "il", "ir", "de", "cn", "in", "fr", "it", "jp", "ca", "mx", "es", "tr"],
  figures: {
    fr: [
      { nom: "Gabriel Atta", parti: "Renaissance", ideologie: "centre", role: "premier", traits: ["negociateur"], popularite: 24, defaut: true },
      { nom: "Jean-Luc Mélencho", parti: "LFI", ideologie: "gauche", role: "chef", traits: ["orateur", "tribune"], popularite: 34 },
      { nom: "Jordan Bardell", parti: "RN", ideologie: "souverainiste", role: "chef", traits: ["orateur", "negociateur"], popularite: 38 },
      { nom: "Marine Le Pe", parti: "RN", ideologie: "souverainiste", role: "chef", traits: ["orateur"], popularite: 36 },
      { nom: "Édouard Philipp", parti: "Horizons", ideologie: "liberal", role: "chef", traits: ["gestionnaire"], popularite: 33 },
      { nom: "Bruno Retaillea", parti: "LR", ideologie: "droite", role: "chef", traits: ["rigoriste"], popularite: 28 },
      { nom: "Raphaël Glucksman", parti: "PS", ideologie: "gauche", role: "chef", traits: ["orateur"], popularite: 30 },
      { nom: "Bruno Le Mair", parti: "Pour une autre France", ideologie: "liberal", role: "chef", traits: ["gestionnaire", "rigoriste"], popularite: 18 },
      { nom: "Éric Zemmou", parti: "Reconquête", ideologie: "souverainiste", role: "chef", traits: ["orateur", "tribune"], popularite: 12 }
    ],
    us: [
      { nom: "Donal Trum", parti: "Républicains", ideologie: "souverainiste", role: "president", traits: ["orateur", "tribune"], popularite: 43, defaut: true },
      { nom: "Kamala Harri", parti: "Démocrates", ideologie: "centre", role: "chef", traits: ["orateur"], popularite: 40 },
      { nom: "Hakeem Jeffrie", parti: "Démocrates", ideologie: "centre", role: "depute", traits: ["negociateur"], popularite: 32 }
    ],
    gb: [
      { nom: "Keir Starm", parti: "Travaillistes", ideologie: "centre", role: "premier", traits: ["gestionnaire"], popularite: 30, defaut: true },
      { nom: "Kemi Badeno", parti: "Conservateurs", ideologie: "droite", role: "chef", traits: ["rigoriste"], popularite: 28 },
      { nom: "Nige Farag", parti: "Reform", ideologie: "souverainiste", role: "chef", traits: ["orateur", "tribune"], popularite: 32 },
      { nom: "Ed Dave", parti: "Libéraux-démocrates", ideologie: "liberal", role: "depute", traits: ["negociateur"], popularite: 26 }
    ],
    ru: [
      { nom: "Vladimi Puti", parti: "Pouvoir", ideologie: "souverainiste", role: "president", traits: ["gestionnaire"], popularite: 70, defaut: true }
    ],
    br: [
      { nom: "Lui Ináci Lul", parti: "PT", ideologie: "gauche", role: "president", traits: ["negociateur", "orateur"], popularite: 42, defaut: true },
      { nom: "Jai Bolsonar", parti: "PL", ideologie: "droite", role: "chef", traits: ["tribune"], popularite: 36 }
    ],
    il: [
      { nom: "Benjami Netanya", parti: "Likoud", ideologie: "droite", role: "premier", traits: ["negociateur"], popularite: 38, defaut: true },
      { nom: "Yai Lapi", parti: "Yesh Atid", ideologie: "centre", role: "chef", traits: ["orateur"], popularite: 30 }
    ],
    ir: [
      { nom: "Massou Pezeshkia", parti: "Réformateur", ideologie: "centre", role: "president", traits: ["negociateur"], popularite: 35, defaut: true }
    ],
    de: [
      { nom: "Friedric Mer", parti: "CDU/CSU", ideologie: "droite", role: "premier", traits: ["gestionnaire", "rigoriste"], popularite: 34, defaut: true }
    ],
    cn: [
      { nom: "Xi Jinpin", parti: "Parti", ideologie: "souverainiste", role: "president", traits: ["gestionnaire"], popularite: 60, defaut: true }
    ],
    in: [
      { nom: "Narend Mod", parti: "BJP", ideologie: "souverainiste", role: "premier", traits: ["orateur"], popularite: 48, defaut: true }
    ],
    it: [
      { nom: "Giorgia Melon", parti: "Fratelli d'Italia", ideologie: "droite", role: "premier", traits: ["orateur", "negociateur"], popularite: 40, defaut: true },
      { nom: "Elly Schlei", parti: "Parti démocrate", ideologie: "gauche", role: "chef", traits: ["orateur"], popularite: 28 },
      { nom: "Matteo Salvin", parti: "Ligue", ideologie: "souverainiste", role: "chef", traits: ["tribune"], popularite: 30 }
    ],
    jp: [
      { nom: "Sanae Takaich", parti: "PLD", ideologie: "droite", role: "premier", traits: ["orateur"], popularite: 48, defaut: true },
      { nom: "Yoshihiko Nod", parti: "Réformistes centristes", ideologie: "centre", role: "chef", traits: ["gestionnaire"], popularite: 24 }
    ],
    ca: [
      { nom: "Mark Carne", parti: "Libéraux", ideologie: "centre", role: "premier", traits: ["gestionnaire"], popularite: 42, defaut: true },
      { nom: "Pierre Poilievr", parti: "Conservateurs", ideologie: "droite", role: "chef", traits: ["orateur", "rigoriste"], popularite: 40 },
      { nom: "Yves-François Blanche", parti: "Bloc québécois", ideologie: "souverainiste", role: "depute", traits: ["negociateur"], popularite: 22 }
    ],
    mx: [
      { nom: "Claudia Sheinbau", parti: "Morena", ideologie: "gauche", role: "president", traits: ["gestionnaire"], popularite: 50, defaut: true }
    ],
    es: [
      { nom: "Pedro Sánche", parti: "PSOE", ideologie: "gauche", role: "premier", traits: ["negociateur"], popularite: 32, defaut: true },
      { nom: "Alberto Núñez Feijó", parti: "PP", ideologie: "droite", role: "chef", traits: ["gestionnaire"], popularite: 34 }
    ],
    tr: [
      { nom: "Recep Tayyip Erdoğa", parti: "AKP", ideologie: "souverainiste", role: "president", traits: ["orateur", "tribune"], popularite: 45, defaut: true }
    ]
  }
};
