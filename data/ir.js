// Iran — institutions (Guide, Conseil des gardiens, Majles, présidence limitée).
// Les agrégats sont des ordres de grandeur sous sanctions : les séries FMI sont lacunaires.
// Ils sont marqués estimation. Le jeu ne décrit aucune procédure militaire.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.ir = {
  id: "ir",
  nom: "Iran",
  fiche: { drapeau: "🇮🇷", resume: "Guide suprême et Conseil des gardiens au-dessus du président. Sanctions, pétrole, rial." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Iran, 2 novembre 2026. Vous êtes président, pas Guide. Le Majles vote, le Conseil des gardiens peut filtrer, le Guide fixe les lignes rouges (sécurité, nucléaire, ordre intérieur). Les chiffres macro sont des estimations : les publications sont incomplètes.",
  bandeau: "Estimation de scénario, pas une publication de novembre 2026 : inflation élevée, croissance faible, pétrole bradé par les sanctions. Le FMI lui-même travaille avec des données iraniennes incomplètes.",
  monnaie: { unite: "milliers de milliards IRR", taux: "taux intérieur", tauxCourt: "taux", banque: "Banque centrale" },
  eco: {
    pibMd: 400, croissance: 1.5, croissanceT: 0.1, inflation: 35, chomage: 9,
    detteMd: 140, dettePct: 35, deficitPct: 4.5, oat10: 25, bund10: 20,
    notation: "hors marché", popularite: 28, confianceMarches: 15, tensionSociale: 68
  },
  recettes: { IR: 20, TVA: 40, IS: 15, CSG: 5, cotisations: 10, autres: 45 },
  taux: { IR: 100, TVA: 9, IS: 25, CSG: 0 },
  depenses: { retraites: 20, sante: 15, education: 12, defense: 25, energie: 30, emploi: 10, securite: 18, collectivites: 8, autres: 20, interets: 8 },
  retraites: { ageLegal: 60, ratioCotRet: 2.4, deficitMd: -5, pensionMoy: 0 },
  smic: { brutMensuel: 120, label: "Salaire minimum (indice)", unite: "IRR" },
  regles: {
    seuilVote: 180,
    labelVote: "Soumettre au Majles",
    rejet: "Le Majles peut rejeter. Même adopté, le Conseil des gardiens peut bloquer.",
    garde: "Conseil des gardiens",
    plafonds: { IR: 160, TVA: 20, age: true },
    lignesRouges: [{ dep: "defense", min: -1, label: "Le Guide ne laisse pas réduire le budget de sécurité." }],
    special: { type: "gardiens", label: "Passage sous l'œil des gardiens", probaBloc: 0.45 },
    modeEmploi: "Le Guide suprême fixe le cadre. Le Conseil des gardiens vérifie la conformité des lois et filtre les candidatures. Le président n'a pas le dernier mot. Baisser la sécurité est bloqué. Un texte adopté par le Majles a encore une probabilité d'être arrêté."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Majles (Assemblée consultative islamique)",
    sieges: 290,
    majoriteAbsolue: 146,
    note: "290 sièges. La composition exacte de la législature en novembre 2026 n'est pas figée ici : le modèle retient un Majles à majorité conservatrice, estimation pédagogique.",
    soutienBase: 210,
    assemblee: [
      { p: "Conservateurs", s: 190, c: "#1a5276" },
      { p: "Réformateurs et modérés", s: 70, c: "#148f77" },
      { p: "Indépendants", s: 30, c: "#7f8c8d" }
    ],
    senat: { nom: "Conseil des gardiens", sieges: 12, note: "12 membres : 6 juristes religieux nommés par le Guide, 6 juristes proposés par le chef du judiciaire et élus par le Majles. Ce n'est pas un Sénat. Il peut bloquer une loi.", groupes: [{ p: "Juristes religieux", s: 6, c: "#1a5276" }, { p: "Juristes", s: 6, c: "#5d6d7e" }] }
  },
  election: { date: "2028-06-28", label: "Présidentielle 2028 (candidatures filtrées)", type: "presidentielle", familleFavorisee: "Conservateurs", finSiDefaite: true },
  candidats: [
    { n: "Massou Pezeshkia", p: "Réformateur", base: 35, c: "#148f77", joueur: true },
    { n: "Saïd Jalil", p: "Conservateur", base: 30, c: "#1a5276" },
    { n: "Candidat retenu par les gardiens", p: "Conservateurs", base: 20, c: "#6c3483" }
  ],
  noteCandidats: "Noms tronqués. Pezeshkian a été élu en 2024 ; le jeu le reprend comme titulaire de scénario, pas comme un pronostic pour 2028. Le Conseil des gardiens écarte d'ordinaire une grande partie des candidatures. Le Guide, Ali Khamene dans la graphie tronquée, n'est pas sur ce bulletin : il n'est pas élu ainsi.",
  contraintes: {
    sanctions: { niveau: 90, label: "Sanctions" },
    petrole: { prix: 45, hypothese: 70, exportateur: true, sensibilite: 0.4, label: "Brut iranien décoté ($)" },
    change: { indice: 100, depart: 100, fragile: true, label: "Indice du rial (100 = départ)" }
  },
  evenements: [
    { p: 0.09, important: true, cause: "Sanctions pétrolières", titre: "Les exportations de brut se vendent avec une décote plus large.", ton: "neg", immediat: { confianceMarches: -3, croissance: -0.1 } },
    { p: 0.08, important: true, cause: "Rial", titre: "Le rial décroche sur le marché libre. Les prix importés suivent.", ton: "neg", immediat: { inflation: 2, tensionSociale: 5 } },
    { p: 0.07, important: true, cause: "Gardiens", titre: "Le Conseil des gardiens rappelle qu'une loi votée n'est pas encore une loi.", ton: "neg", immediat: { popularite: -1 } },
    { p: 0.06, important: true, cause: "Rue", titre: "Un mouvement social sur le coût de la vie et les libertés reprend dans plusieurs villes.", ton: "neg", immediat: { tensionSociale: 8, popularite: -2 } },
    { p: 0.05, important: false, cause: "Contournement", titre: "Une cargaison trouve preneur via un intermédiaire. La décote reste le prix du contournement.", ton: "", immediat: { croissance: 0.05 } },
    { p: 0.05, important: true, cause: "Nucléaire", titre: "Le dossier nucléaire resserre les sanctions. Le président ne tranche pas seul.", ton: "neg", immediat: { confianceMarches: -4 } },
    { p: 0.04, important: false, cause: "Subventions", titre: "Le débat sur les subventions à l'énergie revient. Y toucher est explosif.", ton: "neg", immediat: { tensionSociale: 4 } }
  ],
  sources: [
    ["Inflation, croissance, dette, déficit", "Estimations de scénario. Les comptes iraniens sont incomplets dans les bases du FMI. Rien ici ne doit être lu comme un chiffre officiel de novembre 2026. L'inflation de départ (35 %) et la croissance (1,5 %) décrivent un régime de sanctions, pas une prévision."],
    ["Pétrole décoté", "Mécanisme connu sous sanctions : le brut iranien se vend en dessous du Brent. Le niveau de départ est une hypothèse de modèle."],
    ["Guide, Conseil des gardiens, Majles, président", "Constitution de 1979 révisée en 1989. Le Guide fixe les orientations. Le Conseil des gardiens contrôle les lois et les candidatures. Le Majles a 290 sièges. Le président est élu, dans la liste que les gardiens ont laissée passer."],
    ["Pezeshkian, 2024", "Élection présidentielle de 2024. Le nom est tronqué. Le jeu ne dit pas qu'il sera candidat en 2028."],
    ["Sanctions", "Le modèle les traite comme une contrainte macro (croissance, confiance, décote pétrolière), pas comme un mode d'emploi."]
  ]
};
