// Inde — FMI WEO octobre 2025 : 6,6 % en 2025 et 6,2 % en 2026, année fiscale.
// Lok Sabha : résultat de 2024 (NDA majoritaire, BJP en dessous de la majorité à lui seul).
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.in = {
  id: "in",
  nom: "Inde",
  fiche: { drapeau: "🇮🇳", resume: "Lok Sabha, coalition NDA, fédéralisme. Croissance FMI : 6,6 % puis 6,2 %. Le BJP a besoin de ses alliés." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Inde, 2 novembre 2026. Vous dirigez le gouvernement de New Delhi. Le BJP n'a pas la majorité seul à la Lok Sabha issue de 2024 : la NDA tient si les alliés restent. Les États ont leur propre politique.",
  bandeau: "FMI, WEO octobre 2025 : croissance 6,6 % en 2025 et 6,2 % en 2026, sur l'année fiscale indienne. Le texte note des tarifs américains plus élevés depuis juillet 2025.",
  monnaie: { unite: "Md INR", taux: "G-Sec 10 ans", tauxCourt: "G-Sec", banque: "RBI" },
  eco: {
    pibMd: 330000, croissance: 6.6, croissanceT: 1.4, inflation: 4.5, chomage: 7.5,
    detteMd: 270000, dettePct: 82, deficitPct: 4.8, oat10: 6.8, bund10: 6.2,
    notation: "BBB-", popularite: 48, confianceMarches: 60, tensionSociale: 44
  },
  recettes: { IR: 12000, TVA: 18000, IS: 10000, CSG: 4000, cotisations: 8000, autres: 14000 },
  taux: { IR: 100, TVA: 18, IS: 25, CSG: 0 },
  depenses: { retraites: 8000, sante: 6000, education: 8000, defense: 7000, energie: 4000, emploi: 10000, securite: 3000, collectivites: 14000, autres: 12000, interets: 11000 },
  retraites: { ageLegal: 60, ratioCotRet: 4.5, deficitMd: -500, pensionMoy: 0 },
  smic: { brutMensuel: 18000, label: "Salaire minimum (ordre de grandeur, varie selon les États)", unite: "INR" },
  regles: {
    seuilVote: 240,
    labelVote: "Vote NDA à la Lok Sabha",
    rejet: "Si les alliés régionaux décrochent, la majorité disparaît.",
    garde: "Cour suprême",
    plafonds: { IR: 170, TVA: 28, age: true },
    special: { type: "coalition", label: "Tenir les alliés de la NDA", seuil: 230 },
    modeEmploi: "La Lok Sabha a 543 sièges. En 2024, la NDA a gardé la majorité, le BJP seul est passé sous 272. Le Rajya Sabha (250 membres) peut ralentir. Les États exécutent une grande part de la dépense sociale : une coupe à Delhi ne se traduit pas telle quelle sur le terrain."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Lok Sabha (élections de 2024)",
    sieges: 543,
    majoriteAbsolue: 272,
    note: "Ordre de grandeur : BJP autour de 240, alliés NDA pour dépasser 272, opposition INDIA le reste. À confirmer : des partielles ont pu changer des sièges.",
    soutienBase: 260,
    assemblee: [
      { p: "BJP", s: 240, c: "#e67e22" },
      { p: "Alliés NDA", s: 53, c: "#d35400" },
      { p: "INDIA (opposition)", s: 234, c: "#1a5276" },
      { p: "Autres", s: 16, c: "#7f8c8d" }
    ],
    senat: { nom: "Rajya Sabha", sieges: 245, note: "Chambre des États, renouvellement par tiers. Elle ralentit. Le modèle ne détaille pas chaque État.", groupes: [{ p: "NDA", s: 120, c: "#e67e22" }, { p: "Opposition", s: 125, c: "#1a5276" }] }
  },
  election: { date: "2029-04-15", label: "Lok Sabha 2029 (scénario)", type: "legislatives", familleFavorisee: "INDIA", finSiDefaite: false },
  candidats: [
    { n: "Narend Mod", p: "BJP", base: 42, c: "#e67e22", joueur: true },
    { n: "Coalition INDI", p: "Opposition", base: 38, c: "#1a5276" },
    { n: "Partis régionaux", p: "États", base: 14, c: "#148f77" }
  ],
  noteCandidats: "Nom tronqué. Scénario pour 2029, pas un sondage. Les partis régionaux ne sont pas une personne.",
  contraintes: {
    commerce: { tarifs: 8, label: "Tarifs américains sur des exportations indiennes" },
    petrole: { prix: 69, hypothese: 69, exportateur: false, label: "Brent ($), l'Inde importe" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Mousson", titre: "Une mousson irrégulière touche les récoltes et les prix alimentaires.", ton: "neg", immediat: { inflation: 0.4, popularite: -1 } },
    { p: 0.07, important: true, cause: "Alliés", titre: "Un allié régional de la NDA demande un paquet pour son État.", ton: "neg", immediat: { popularite: -1 }, differe: [{ semaines: 3, depMission: { collectivites: 200 } }] },
    { p: 0.06, important: false, cause: "Investissement", titre: "Des annonces d'usines (électronique, énergie) soutiennent l'investissement.", ton: "pos", differe: [{ semaines: 8, croissance: 0.12 }] },
    { p: 0.06, important: true, cause: "Tarifs", titre: "Des droits américains touchent des exportations de biens et de services.", ton: "neg", differe: [{ semaines: 5, croissance: -0.1 }] },
    { p: 0.05, important: false, cause: "RBI", titre: "La Reserve Bank reste focalisée sur l'inflation alimentaire.", ton: "", immediat: { bce: 0.1 } },
    { p: 0.05, important: true, cause: "Emploi", titre: "Le débat sur l'emploi des jeunes et le secteur informel revient.", ton: "neg", immediat: { tensionSociale: 4 } },
    { p: 0.04, important: false, cause: "États", titre: "Un grand État conteste une dotation fédérale.", ton: "", immediat: { tensionSociale: 3 } },
    { p: 0.04, important: true, cause: "Rupie", titre: "La roupie glisse. La facture pétrolière en dollars augmente.", ton: "neg", immediat: { inflation: 0.2, confianceMarches: -2 } }
  ],
  sources: [
    ["Croissance 6,6 % en 2025 et 6,2 % en 2026", "FMI, WEO octobre 2025. Année fiscale indienne. Le texte note une révision 2025 à la hausse grâce à un bon premier trimestre, et des tarifs américains plus élevés depuis juillet."],
    ["Lok Sabha 2024", "543 sièges, majorité 272. Le BJP est resté le premier parti mais sous la majorité absolue à lui seul ; la NDA a gardé la majorité avec des alliés. Les effectifs du modèle (240 + 53) sont un ordre de grandeur, à confirmer après les partielles."],
    ["Rajya Sabha", "Chambre des États, environ 245 membres siégeant. Elle peut ralentir un texte."],
    ["Dette 82 %, déficit 4,8 %, chômage 7,5 %, inflation 4,5 %", "Estimations de scénario compatibles avec les ordres de grandeur des administrations indiennes. Pas un imprimé du ministère des Finances de novembre 2026."],
    ["Salaire minimum", "Il n'y a pas un seul salaire fédéral uniforme. Le montant du jeu est un ordre de grandeur urbain."]
  ]
};
