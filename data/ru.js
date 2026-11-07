// Russie — ancres FMI octobre 2025, ministère des Finances / KSE janvier 2026, DG Trésor.
// La Douma modélisée est celle élue en 2021 : le jeu ne proclame pas le résultat d'un scrutin de 2026.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.ru = {
  id: "ru",
  nom: "Russie",
  fiche: { drapeau: "🇷🇺", resume: "Douma et décret présidentiel. Sanctions, guerre, pétrole et rouble. Croissance 2025 : FMI 0,6 %." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Russie, 2 novembre 2026. Le pouvoir exécutif l'emporte sur la Douma. Les contraintes qui comptent sont les sanctions, la dépense de guerre, le prix du brut russe et le change. Les chiffres sont des publications 2025-début 2026, pas un arrêté du 2 novembre.",
  bandeau: "FMI octobre 2025 : croissance 2025 ramenée à 0,6 %. KSE (janvier 2026) : déficit fédéral 2025 de 5 600 Md RUB, inflation 5,6 % en décembre, rouble autour de 80 pour un dollar.",
  monnaie: { unite: "Md RUB", taux: "OFZ 10 ans", tauxCourt: "OFZ", banque: "Banque de Russie" },
  eco: {
    pibMd: 200000, croissance: 0.6, croissanceT: 0.0, inflation: 5.6, chomage: 2.2,
    detteMd: 40000, dettePct: 20, deficitPct: 2.6, oat10: 14, bund10: 12,
    notation: "sans marché", popularite: 55, confianceMarches: 30, tensionSociale: 48
  },
  recettes: { IR: 3500, TVA: 14000, IS: 4000, CSG: 2000, cotisations: 8000, autres: 9000 },
  taux: { IR: 100, TVA: 22, IS: 25, CSG: 0 },
  depenses: { retraites: 5000, sante: 2500, education: 2500, defense: 14000, energie: 800, emploi: 3000, securite: 4000, collectivites: 4000, autres: 6000, interets: 3500 },
  retraites: { ageLegal: 60, ratioCotRet: 1.6, deficitMd: -500, pensionMoy: 23000 },
  smic: { brutMensuel: 22440, label: "Salaire minimum (SMIC russe, ordre de grandeur)", unite: "RUB" },
  regles: {
    seuilVote: 160,
    labelVote: "Faire enregistrer par la Douma",
    rejet: "Même la Douma peut freiner un texte trop coûteux politiquement. Le décret passe, au prix extérieur.",
    garde: "Contrôle politique du centre",
    plafonds: { IR: 200, TVA: 30, age: true },
    special: { type: "decret", label: "Décret présidentiel", cause: "Décret présidentiel (la Douma enregistre)" },
    modeEmploi: "La Douma de 2021 est dominée par Russie unie (environ 324 sièges sur 450). Le jeu ne proclame pas un renouvellement de 2026. Le décret passe presque toujours ; il resserre les sanctions dans le modèle et pèse sur la confiance extérieure."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Douma d'État (VIIIe législature, élection de 2021)",
    sieges: 450,
    majoriteAbsolue: 226,
    note: "Effectifs de 2021, ordre de grandeur : Russie unie ~324, KPRF ~57, Russie juste ~27, LDPR ~23, Nouvelles gens ~15. Source usuelle : Commission électorale, scrutin du 19 septembre 2021. Ce n'est pas un décompte de novembre 2026.",
    soutienBase: 360,
    assemblee: [
      { p: "Russie unie", s: 324, c: "#1a5276" },
      { p: "KPRF", s: 57, c: "#922b21" },
      { p: "Russie juste", s: 27, c: "#b9770e" },
      { p: "LDPR", s: 23, c: "#f4d03f" },
      { p: "Nouvelles gens", s: 15, c: "#148f77" }
    ],
    senat: { nom: "Conseil de la Fédération", sieges: 178, note: "Chambre haute nommée et désignée. Elle ne joue pas le rôle d'un Sénat qui renverse le Kremlin. Le modèle ne lui donne pas de veto autonome.", groupes: [{ p: "Majorité alignée", s: 160, c: "#1a5276" }, { p: "Autres", s: 18, c: "#7f8c8d" }] }
  },
  election: { date: "2030-03-17", label: "Présidentielle 2030 (scrutin encadré)", type: "presidentielle", familleFavorisee: "Pouvoir", finSiDefaite: true },
  candidats: [
    { n: "Vladimi Puti", p: "Pouvoir", base: 75, c: "#1a5276", joueur: true },
    { n: "Nikolaï Kharitono", p: "KPRF", base: 8, c: "#922b21" },
    { n: "Leonid Slutsk", p: "LDPR", base: 5, c: "#f4d03f" },
    { n: "Vladisla Davanko", p: "Nouvelles gens", base: 6, c: "#148f77" }
  ],
  noteCandidats: "Les noms perdent leur dernière lettre. La liste reprend le schéma du scrutin encadré de mars 2024 (Poutine, Kharitonov, Sloutski, Davankov), comme illustration, pas comme pronostic pour 2030.",
  contraintes: {
    sanctions: { niveau: 78, label: "Sanctions" },
    guerre: { niveau: 85, label: "Économie de guerre", coutParTrimestre: 400 },
    petrole: { prix: 41, hypothese: 70, exportateur: true, sensibilite: 80, label: "Brut russe ($/b)" },
    change: { indice: 80, depart: 80, fragile: true, label: "Roubles pour 1 dollar" }
  },
  evenements: [
    { p: 0.09, important: true, cause: "Décote du brut", titre: "La décote du brut russe sur le Brent s'élargit. Les recettes pétro-gazières fléchissent.", ton: "neg", immediat: { confianceMarches: -4 } },
    { p: 0.08, important: true, cause: "Sanctions", titre: "Un nouveau paquet de sanctions vise des exportateurs et la flotte.", ton: "neg", immediat: { confianceMarches: -3, croissance: -0.1 } },
    { p: 0.07, important: true, cause: "Banque de Russie", titre: "La Banque de Russie maintient des taux élevés pour contenir les prix.", ton: "neg", immediat: { bce: 0.5, croissance: -0.08 } },
    { p: 0.06, important: false, cause: "OFZ", titre: "Les banques domestiques absorbent une émission d'OFZ. Le budget passe, le circuit est fermé.", ton: "", immediat: { confianceMarches: 1 } },
    { p: 0.06, important: true, cause: "Dépenses militaires", titre: "Une rallonge militaire est demandée en cours d'année.", ton: "neg", differe: [{ semaines: 3, depMission: { defense: 500 } }] },
    { p: 0.05, important: true, cause: "Main-d'œuvre", titre: "Les pénuries de main-d'œuvre se voient dans l'industrie civile.", ton: "neg", immediat: { tensionSociale: 4 } },
    { p: 0.05, important: false, cause: "Récolte", titre: "La récolte céréalière soutient l'export agricole.", ton: "pos", immediat: { croissance: 0.05 } },
    { p: 0.04, important: true, cause: "Change", titre: "Le rouble décroche après une chute des recettes en devises.", ton: "neg", immediat: { inflation: 0.4, confianceMarches: -4 } },
    { p: 0.04, important: false, cause: "Contournement", titre: "Une partie du commerce passe par des pays tiers. Le contournement a un coût.", ton: "", immediat: { croissance: 0.04 } }
  ],
  sources: [
    ["Croissance 2025 à 0,6 %", "FMI, World Economic Outlook, octobre 2025, repris par Reuters le 14 octobre 2025 (révision de 0,9 % à 0,6 %). La DG Trésor évoque environ 1 % en 2025 selon les sources russes : les deux chiffres sont cités, le jeu part du FMI."],
    ["Croissance 2026 autour de 1 %", "Reprises de presse du FMI (Kyiv Independent / Kyiv Post, octobre 2025). Projection, pas un réalisé."],
    ["Déficit fédéral 2025 : 5 600 Md RUB, environ 2,6 % du PIB", "KSE Institute, Russia Chartbook, janvier 2026, d'après le ministère des Finances ; DG Trésor, situation 2025 (déficit rehaussé à 2,6 %)."],
    ["Inflation 5,6 % en glissement en décembre 2025", "KSE Institute, janvier 2026, d'après la Banque de Russie."],
    ["Taux directeur 17 % en octobre 2025", "Reuters, 14 octobre 2025. Le jeu s'en sert comme point de départ monétaire ; il a pu bouger ensuite."],
    ["Chômage moyen 2025 : 2,2 %", "DG Trésor, note de situation économique de la Russie (2025)."],
    ["Roubles pour un dollar ~80 en décembre 2025", "KSE Institute, janvier 2026."],
    ["Brut russe ~41 $ en décembre 2025, Urals sous 38 $", "KSE Institute, janvier 2026. L'hypothèse budgétaire historique était plus haute (souvent au-dessus de 70 $) : l'écart nourrit le déficit dans le modèle."],
    ["Dette ~20 % du PIB", "Ordre de grandeur de la dette publique russe, surtout intérieure. Estimation de scénario, pas un tableau du ministère à la date du jeu."],
    ["TVA à 22 %", "DG Trésor : relèvement de 2 points de la TVA dans la réforme fiscale engagée en 2024-2025. Le taux exact d'entrée en vigueur doit être lu dans la loi ; le jeu part de 22 %."],
    ["Douma 2021", "Scrutin du 19 septembre 2021. Russie unie environ 324 sièges sur 450. Le jeu ne fabrique pas un résultat de 2026."],
    ["Présidentielle encadrée de 2024", "Les quatre noms tronqués reprennent les candidats de mars 2024. Ce n'est pas une liste pour 2030."]
  ]
};
