// Israël — chômage FMI octobre 2025 ; croissance sous la note d'incertitude du WEO liée au conflit.
// La Knesset modélisée reprend la coalition de 2022 (64/120) comme base historique, pas comme un décompte de 2026.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.il = {
  id: "il",
  nom: "Israël",
  fiche: { drapeau: "🇮🇱", resume: "Knesset à 120 sièges, coalition à 61. Guerre, budget de sécurité, risque de rupture de coalition." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Israël, 2 novembre 2026. Vous êtes Premier ministre. Sans 61 députés, la coalition tombe. La guerre pèse sur le budget et la tension. Le FMI souligne que ses projections sont incertaines à cause du conflit.",
  bandeau: "FMI, WEO octobre 2025 : chômage 2,9 % en 2025 et 3,2 % en 2026. Croissance de scénario 3,9 %, sous la réserve expresse du FMI sur le conflit. Coalition de départ : 64 sièges, base de 2022.",
  monnaie: { unite: "Md ILS", taux: "Obligation 10 ans", tauxCourt: "taux 10 ans", banque: "Banque d'Israël" },
  eco: {
    pibMd: 2000, croissance: 3.9, croissanceT: 0.6, inflation: 3.1, chomage: 2.9,
    detteMd: 1300, dettePct: 65, deficitPct: 5.5, oat10: 4.6, bund10: 3.5,
    notation: "A", popularite: 38, confianceMarches: 48, tensionSociale: 70
  },
  recettes: { IR: 180, TVA: 160, IS: 50, CSG: 40, cotisations: 80, autres: 70 },
  taux: { IR: 100, TVA: 17, IS: 23, CSG: 0 },
  depenses: { retraites: 80, sante: 70, education: 60, defense: 230, energie: 8, emploi: 40, securite: 30, collectivites: 50, autres: 80, interets: 40 },
  retraites: { ageLegal: 67, ratioCotRet: 3.2, deficitMd: -5, pensionMoy: 4500 },
  smic: { brutMensuel: 6200, label: "Salaire minimum", unite: "ILS" },
  regles: {
    seuilVote: 230,
    labelVote: "Faire voter la coalition",
    rejet: "En dessous du seuil, les partenaires réservent leurs voix.",
    garde: "Cour suprême (Bagatz)",
    plafonds: { IR: 180, TVA: 25, age: true },
    special: { type: "coalition", label: "Accord de coalition", seuil: 210 },
    modeEmploi: "La Knesset compte 120 sièges. La majorité est 61. Le modèle part de la coalition de 2022 (Likoud et partenaires religieux, 64 sièges) et le dit : si la Knesset a été renouvelée, ce n'est pas ce décompte-là. Un texte qui fracture les partenaires religieux ou la sécurité fait tomber le score, puis le gouvernement se fragilise."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Knesset (base historique 2022, 120 sièges)",
    sieges: 120,
    majoriteAbsolue: 61,
    note: "Coalition de scénario calée sur 64 sièges (Likoud, sionisme religieux, Shas, Judaïsme unifié de la Torah). Effectif de 2022, pas une photographie de novembre 2026.",
    soutienBase: 240,
    assemblee: [
      { p: "Likoud", s: 32, c: "#1a5276" },
      { p: "Sionisme religieux", s: 14, c: "#6c3483" },
      { p: "Shas", s: 11, c: "#b9770e" },
      { p: "Judaïsme unifié de la Torah", s: 7, c: "#1c2833" },
      { p: "Opposition (Yesh Atid, Nation, travaillistes, arabes)", s: 56, c: "#117a65" }
    ]
  },
  election: { date: "2027-10-26", label: "Élections à la Knesset (scénario)", type: "legislatives", familleFavorisee: "Opposition", finSiDefaite: false },
  candidats: [
    { n: "Benjami Netanya", p: "Likoud", base: 32, c: "#1a5276", joueur: true },
    { n: "Yai Lapi", p: "Yesh Atid", base: 22, c: "#117a65" },
    { n: "Benn Gant", p: "Camp de l'État", base: 14, c: "#1abc9c" },
    { n: "Liste arabe unie", p: "Partis arabes", base: 10, c: "#196f3d" }
  ],
  noteCandidats: "Noms tronqués. Ce n'est pas un sondage ni la composition actuelle de la Knesset. La date est un scénario de législatives anticipées, pas un calendrier officiel.",
  contraintes: {
    guerre: { niveau: 80, label: "Guerre et sécurité", coutParTrimestre: 8 },
    commerce: { tarifs: 0 }
  },
  evenements: [
    { p: 0.09, important: true, cause: "Front sécuritaire", titre: "Une escalade militaire rallonge le budget de défense et la mobilisation.", ton: "neg", immediat: { tensionSociale: 6, popularite: -1 }, differe: [{ semaines: 2, depMission: { defense: 6 } }] },
    { p: 0.07, important: true, cause: "Coalition", titre: "Un partenaire religieux menace de quitter le gouvernement sur un texte de conscription.", ton: "neg", immediat: { popularite: -2, tensionSociale: 5 } },
    { p: 0.06, important: true, cause: "Cour suprême", titre: "La Cour suprême est saisie d'une loi de la coalition.", ton: "", immediat: { tensionSociale: 4 } },
    { p: 0.06, important: false, cause: "High-tech", titre: "Les exportations de tech tiennent. Le shekel se stabilise.", ton: "pos", immediat: { croissance: 0.1, confianceMarches: 2 } },
    { p: 0.05, important: true, cause: "Otage / cessez-le-feu", titre: "Le débat sur un cessez-le-feu fracture la coalition et la rue.", ton: "neg", immediat: { tensionSociale: 8, popularite: -2 } },
    { p: 0.05, important: false, cause: "Banque d'Israël", titre: "La Banque d'Israël reste prudente sur les taux.", ton: "", immediat: { bce: 0.1 } },
    { p: 0.04, important: true, cause: "Note", titre: "Une agence rappelle le coût budgétaire de la guerre.", ton: "neg", immediat: { confianceMarches: -4 } },
    { p: 0.04, important: false, cause: "Gaz", titre: "Le gaz offshore soutient la balance, pas le climat politique.", ton: "pos", immediat: { croissance: 0.05 } }
  ],
  sources: [
    ["Chômage 2,9 % en 2025 et 3,2 % en 2026", "FMI, WEO octobre 2025, table B1."],
    ["Croissance 3,9 %", "Lecture de la ligne Israël du WEO octobre 2025. Le même document prévient que les projections israéliennes sont soumises à une forte incertitude à cause du conflit et peuvent être révisées. Ce n'est pas un chiffre arrêté de novembre 2026."],
    ["Dette 65 % et déficit 5,5 %", "Estimations de scénario pour ouvrir la partie. Elles ne sont pas un tableau du ministère des Finances israélien à cette date."],
    ["Knesset, 120 sièges, majorité 61", "Loi fondamentale. La coalition à 64 sièges est celle issue des élections de 2022 (Likoud et partenaires). Si la chambre a changé, l'écran Parlement le signale."],
    ["Guerre", "Le WEO d'octobre 2025 mentionne le conflit régional, y compris l'épisode de juin 2025 entre Israël et l'Iran, comme source d'incertitude. Le modèle en fait une contrainte budgétaire, pas un récit opérationnel."]
  ]
};
