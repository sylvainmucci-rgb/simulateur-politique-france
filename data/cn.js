// Chine — FMI WEO octobre 2025 pour la croissance. L'Assemblée nationale populaire n'est pas un veto.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.cn = {
  id: "cn",
  nom: "Chine",
  fiche: { drapeau: "🇨🇳", resume: "Le Parti décide, l'Assemblée enregistre. Immobilier, dette locale, tarifs américains. Croissance FMI : 4,8 % puis 4,2 %." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Chine, 2 novembre 2026. Vous décidez au centre du Parti. L'Assemblée nationale populaire n'est pas une opposition. Les contraintes sont l'immobilier, la dette des collectivités et les tarifs.",
  bandeau: "FMI, WEO octobre 2025 : croissance 4,8 % en 2025 et 4,2 % en 2026. Le même texte dit que l'immobilier n'est toujours pas stabilisé, plus de quatre ans après l'éclatement de la bulle, et que la dette continuera de monter si le solde primaire ne se resserre pas.",
  monnaie: { unite: "Md CNY", taux: "emprunt d'État 10 ans", tauxCourt: "taux 10 ans", banque: "PBOC" },
  eco: {
    pibMd: 135000, croissance: 4.8, croissanceT: 1.0, inflation: 0.5, chomage: 5.2,
    detteMd: 120000, dettePct: 88, deficitPct: 7, oat10: 2.1, bund10: 1.8,
    notation: "A+", popularite: 50, confianceMarches: 55, tensionSociale: 42
  },
  recettes: { IR: 4000, TVA: 8000, IS: 4500, CSG: 2000, cotisations: 6000, autres: 5000 },
  taux: { IR: 100, TVA: 13, IS: 25, CSG: 0 },
  depenses: { retraites: 5000, sante: 4000, education: 4500, defense: 1800, energie: 1500, emploi: 2500, securite: 2000, collectivites: 8000, autres: 6000, interets: 2500 },
  retraites: { ageLegal: 63, ratioCotRet: 2.2, deficitMd: -400, pensionMoy: 3200 },
  smic: { brutMensuel: 2500, label: "Salaire minimum (ordre de grandeur, varie selon les villes)", unite: "CNY" },
  regles: {
    seuilVote: 120,
    labelVote: "Faire enregistrer par l'Assemblée",
    rejet: "L'Assemblée suit. Le vrai frein est économique, pas parlementaire.",
    garde: "Direction du Parti",
    plafonds: { IR: 160, TVA: 20, age: true },
    special: { type: "parti", label: "Décision du Comité central", texte: "Le centre du Parti a tranché. L'Assemblée enregistrera." },
    modeEmploi: "L'Assemblée nationale populaire (près de 3 000 sièges) vote des textes déjà arbitrés. Il n'y a pas d'alternance électorale compétitive dans ce modèle. Le congrès du Parti, pas une présidentielle, est l'échéance politique."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Assemblée nationale populaire",
    sieges: 2977,
    majoriteAbsolue: 1489,
    note: "Environ 3 000 députés. Le vote est un enregistrement. Le chiffre de sièges est un ordre de grandeur de la législature, pas un décompte nominatif.",
    soutienBase: 420,
    assemblee: [
      { p: "Parti communiste et satellites", s: 2800, c: "#922b21" },
      { p: "Autres étiquettes", s: 177, c: "#7f8c8d" }
    ]
  },
  election: { date: "2027-10-18", label: "Congrès du Parti (scénario)", type: "legislatives", familleFavorisee: "Centre", finSiDefaite: false },
  candidats: [
    { n: "Xi Jinpin", p: "Centre", base: 80, c: "#922b21", joueur: true },
    { n: "Ligne plus prudente sur la dette", p: "Courant", base: 12, c: "#7f8c8d" }
  ],
  noteCandidats: "Le nom est tronqué. Ce n'est pas une élection compétitive : le congrès du Parti reconduit une direction. Le second « candidat » est un courant, pas une personne réelle.",
  contraintes: {
    commerce: { tarifs: 15, label: "Tarifs américains" },
    petrole: { prix: 69, hypothese: 69, exportateur: false, label: "Brent ($)" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Immobilier", titre: "Les ventes de logements neufs rechutent. Les collectivités qui vivaient du foncier se tendent.", ton: "neg", immediat: { croissance: -0.15, confianceMarches: -3 } },
    { p: 0.07, important: true, cause: "Tarifs", titre: "Les droits américains réorientent des exportations vers l'Asie et l'Europe, avec une marge plus faible.", ton: "neg", differe: [{ semaines: 6, croissance: -0.12 }] },
    { p: 0.06, important: false, cause: "Relance", titre: "Une émission spéciale de dette locale finance des infrastructures.", ton: "pos", differe: [{ semaines: 4, depMission: { collectivites: 200 }, croissance: 0.1 }] },
    { p: 0.06, important: true, cause: "Jeunesse", titre: "Le chômage des jeunes diplômés reste un sujet politique, au-delà du taux urbain.", ton: "neg", immediat: { tensionSociale: 4 } },
    { p: 0.05, important: false, cause: "Industrie", titre: "L'excédent manufacturier continue. Les partenaires parlent de surcapacités.", ton: "", immediat: { croissance: 0.08, confianceMarches: -1 } },
    { p: 0.05, important: true, cause: "Change", titre: "Le yuan est stable face au dollar et plus faible face à d'autres monnaies. Les exportations en profitent, les importateurs râlent.", ton: "", immediat: { croissance: 0.05 } },
    { p: 0.04, important: false, cause: "PBOC", titre: "La banque centrale assouplit les réserves obligatoires.", ton: "pos", immediat: { bce: -0.1, croissance: 0.05 } }
  ],
  sources: [
    ["Croissance 4,8 % en 2025 et 4,2 % en 2026", "FMI, World Economic Outlook, octobre 2025. Le texte explique le rebond de la prévision 2025 par l'anticipation des échanges et une consommation tenue par le soutien budgétaire, puis le ralentissement de 2026."],
    ["Immobilier", "Même WEO : plus de quatre ans après l'éclatement de la bulle, l'investissement immobilier n'est pas stabilisé."],
    ["Dette", "Le WEO note que stabiliser la dette au niveau de 2024 demanderait un serrage du solde primaire, et cite la Chine parmi les pays où la dette monterait. Le ratio de départ (88 %) est une estimation de scénario (dette augmentée des collectivités), pas un chiffre unique du FMI."],
    ["Chômage 5,2 %", "Ordre de grandeur du taux urbain enquêté. Le chômage des jeunes est plus haut et n'est pas dans ce chiffre. Estimation."],
    ["Inflation 0,5 % et taux 10 ans 2,1 %", "Estimations de scénario (pression déflationniste connue en 2024-2025). Pas un imprimé de novembre 2026."],
    ["Assemblée nationale populaire", "Environ 3 000 députés, vote d'enregistrement. Le pouvoir est au centre du Parti. Le nom du secrétaire général est tronqué."]
  ]
};
