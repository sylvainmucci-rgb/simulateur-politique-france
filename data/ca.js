// Canada — Westminster, minorité. Résultats certifiés du 28 avril 2025.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.ca = {
  id: "ca",
  nom: "Canada",
  fiche: { drapeau: "🇨🇦", resume: "Régime parlementaire. Les Communes peuvent renverser le Cabinet. Minorité libérale issue du 28 avril 2025 : 169 sièges, majorité à 172." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Canada, 2 novembre 2026. Minorité à la Chambre des communes. Un budget qui perd les Communes fait tomber le gouvernement. Vous pouvez être à Rideau, dans l'opposition, ou fonder autre chose.",
  bandeau: "Sièges : Élections Canada, résultats officiels publiés le 23 mai 2025, repris par la bibliothèque de la Chambre des communes britannique. Les agrégats macro sont des estimations de scénario.",
  monnaie: { unite: "Md CAD", taux: "Obligation 10 ans", tauxCourt: "obligation", banque: "Banque du Canada" },
  eco: {
    pibMd: 3100, croissance: 1.4, croissanceT: 0.3, inflation: 2.2, chomage: 6.6,
    detteMd: 1550, dettePct: 50, deficitPct: 1.6, oat10: 3.3, bund10: 3.0,
    notation: "AAA", popularite: 42, confianceMarches: 66, tensionSociale: 36
  },
  recettes: { IR: 240, TVA: 70, IS: 80, CSG: 40, cotisations: 90, autres: 80 },
  taux: { IR: 100, TVA: 5, IS: 15, CSG: 10 },
  depenses: { retraites: 80, sante: 60, education: 15, defense: 40, energie: 12, emploi: 40, securite: 20, collectivites: 90, autres: 70, interets: 50 },
  retraites: { ageLegal: 65, ratioCotRet: 3.2, deficitMd: -5, pensionMoy: 1400 },
  smic: { brutMensuel: 2800, label: "Salaire minimum fédéral (mensualisé, ordre de grandeur)", unite: "CAD", note: "La plupart des salariés relèvent du minimum provincial, pas du fédéral." },
  regles: {
    seuilVote: 155,
    labelVote: "Confiance des Communes",
    rejet: "En minorité, un rejet sur un texte de confiance fait tomber le Cabinet.",
    garde: "Charte canadienne / Cour suprême",
    plafonds: { IR: 170, TVA: 15, age: true },
    texteTVA: "La TPS fédérale est à 5 %. Les provinces ajoutent leur propre taxe. Le modèle ne porte que le fédéral.",
    special: { type: "coalition", label: "Texte qui exige un autre parti", seuil: 190 },
    modeEmploi: "343 sièges, majorité 172. Libéraux 169, Conservateurs 144, Bloc 22, NPD 7, Vert 1 au certificat du 23 mai 2025. Le score de base suffit pour un texte modeste. Un texte dur exige un appoint, sinon la confiance casse."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Chambre des communes (résultats officiels, 23 mai 2025)",
    sieges: 343,
    majoriteAbsolue: 172,
    note: "Élections Canada, scrutin du 28 avril 2025, résultats officiels du 23 mai 2025. Des partielles ont pu bouger des sièges avant novembre 2026 : le modèle garde le certificat, pas une chronique ultérieure.",
    soutienBase: 175,
    assemblee: [
      { p: "Libéraux", s: 169, c: "#c0392b" },
      { p: "Conservateurs", s: 144, c: "#1a5276" },
      { p: "Bloc québécois", s: 22, c: "#5dade2" },
      { p: "NPD", s: 7, c: "#f39c12" },
      { p: "Vert", s: 1, c: "#27ae60" }
    ],
    senat: { nom: "Sénat", sieges: 105, note: "Chambre nommée. Elle amende et retarde. Elle ne renverse pas le gouvernement.", groupes: [{ p: "Sénateurs", s: 105, c: "#7f8c8d" }] }
  },
  election: { date: "2029-10-15", label: "Communes (échéance du modèle)", type: "legislatives", familleFavorisee: "Conservateurs", finSiDefaite: false },
  candidats: [
    { n: "Mark Carne", p: "Libéraux", base: 36, c: "#c0392b", joueur: true },
    { n: "Pierre Poilievr", p: "Conservateurs", base: 34, c: "#1a5276" },
    { n: "Yves-François Blanche", p: "Bloc québécois", base: 8, c: "#5dade2" }
  ],
  noteCandidats: "Noms tronqués. Carne est le Premier ministre issu du 28 avril 2025. Poilievr a perdu sa circonscription ce soir-là ; le modèle le garde comme chef, sans trancher les partielles d'après.",
  contraintes: {
    commerce: { tarifs: 8, label: "Droits américains visant le Canada (scénario)" },
    petrole: { prix: 69, hypothese: 69, exportateur: true, label: "Pétrole, le Canada exporte" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Confiance", titre: "Un partenaire menace de voter contre le budget. En minorité, c'est une crise.", ton: "neg", immediat: { popularite: -2, confianceMarches: -2 } },
    { p: 0.07, important: true, cause: "Tarifs américains", titre: "Washington resserre des droits visant l'acier, l'auto ou le bois.", ton: "neg", immediat: { croissance: -0.1, tensionSociale: 3 } },
    { p: 0.06, important: false, cause: "Banque du Canada", titre: "La Banque du Canada reste dépendante des données.", ton: "", immediat: { bce: -0.05 } },
    { p: 0.05, important: true, cause: "Provinces", titre: "Une province conteste un champ fédéral. Le conflit est constitutionnel.", ton: "neg", immediat: { tensionSociale: 3 } },
    { p: 0.05, important: false, cause: "Immigration", titre: "Les cibles d'immigration permanente reviennent au centre du débat.", ton: "", immediat: { popularite: -1 } }
  ],
  sources: [
    ["169 libéraux, 144 conservateurs, 22 bloquistes, 7 NPD, 1 vert", "Élections Canada, résultats officiels du scrutin du 28 avril 2025, publiés le 23 mai 2025. Bibliothèque de la Chambre des communes (Royaume-Uni), briefing du 3 juillet 2025. Majorité : 172 sièges sur 343."],
    ["Minorité", "Trois sièges manquent. Le gouvernement tombe si les Communes retirent la confiance."],
    ["Sénat nommé", "Il ne décide pas de la confiance."],
    ["Macroéconomie et dette fédérale ~50 %", "Estimations de scénario. Le ratio de dette du modèle vise la dette fédérale nette, pas l'ensemble des administrations. À ne pas citer comme un chiffre de Finances Canada de novembre 2026."],
    ["Salaire minimum", "Le fédéral ne couvre qu'une partie des salariés. Le montant mensualisé est un ordre de grandeur."]
  ]
};
