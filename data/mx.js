// Mexique — régime présidentiel. Chambre : INE / Reuters, 23 août 2024.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.mx = {
  id: "mx",
  nom: "Mexique",
  fiche: { drapeau: "🇲🇽", resume: "Régime présidentiel. La Chambre (500) a donné à Morena et à ses alliés une majorité des deux tiers en 2024. Le Sénat est resté juste en dessous." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Mexique, 2 novembre 2026. La présidence conduit l'exécutif. Réformer la Constitution exige les deux tiers au Congrès. Vous pouvez tenir ce pouvoir, ou le conquérir.",
  bandeau: "Majorité qualifiée à la Chambre : INE, confirmé par Reuters le 23 août 2024 (364 sièges). Les agrégats macro sont des estimations de scénario.",
  monnaie: { unite: "Md MXN", taux: "Bonos 10 ans", tauxCourt: "bono", banque: "Banxico" },
  eco: {
    pibMd: 35000, croissance: 1.3, croissanceT: 0.2, inflation: 4.0, chomage: 2.8,
    detteMd: 17500, dettePct: 50, deficitPct: 4.0, oat10: 9.5, bund10: 8.5,
    notation: "BBB", popularite: 50, confianceMarches: 52, tensionSociale: 48
  },
  recettes: { IR: 2500, TVA: 1400, IS: 900, CSG: 400, cotisations: 700, autres: 900 },
  taux: { IR: 100, TVA: 16, IS: 30, CSG: 10 },
  depenses: { retraites: 1800, sante: 800, education: 900, defense: 250, energie: 400, emploi: 500, securite: 350, collectivites: 1200, autres: 900, interets: 1100 },
  retraites: { ageLegal: 65, ratioCotRet: 4, deficitMd: -100, pensionMoy: 8000 },
  smic: { brutMensuel: 8000, label: "Salaire minimum (mensualisé, ordre de grandeur)", unite: "MXN", note: "Le minimum est fixé par zone. Le montant du modèle est un ordre de grandeur, pas le décret en vigueur." },
  regles: {
    seuilVote: 180,
    labelVote: "Loi ordinaire",
    rejet: "La majorité simple suffit pour une loi. La Constitution, non.",
    garde: "Cour suprême de justice",
    plafonds: { IR: 170, TVA: 20, age: true },
    special: { type: "coalition", label: "Réforme constitutionnelle (deux tiers)", seuil: 300 },
    modeEmploi: "Chambre : 500 sièges, deux tiers à 334. INE, août 2024 : Morena et alliés, 364 députés. Le Sénat est resté juste sous les deux tiers. Le modèle fait passer une loi ordinaire plus facilement qu'une révision."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Chambre des députés (INE, août 2024)",
    sieges: 500,
    majoriteAbsolue: 251,
    note: "Reuters, 23 août 2024 : l'INE confirme 364 sièges pour Morena et ses alliés, au-dessus des 334 requis pour réviser la Constitution à la Chambre. Le Sénat n'a pas la même marge. Des changements de groupe ont pu avoir lieu depuis : le modèle garde ce certificat.",
    soutienBase: 330,
    assemblee: [
      { p: "Morena et alliés", s: 364, c: "#922b21" },
      { p: "Opposition", s: 136, c: "#1a5276" }
    ],
    senat: { nom: "Sénat", sieges: 128, note: "Majorité qualifiée non acquise en août 2024 selon Reuters. Une révision peut s'y bloquer.", groupes: [{ p: "Sénateurs", s: 128, c: "#7f8c8d" }] }
  },
  election: { date: "2027-06-06", label: "Mi-mandat législatif (échéance du modèle)", type: "legislatives", familleFavorisee: "Opposition", finSiDefaite: false, suite: { date: "2030-06-02", label: "Présidentielle du modèle", type: "presidentielle", familleFavorisee: "Opposition" } },
  candidats: [
    { n: "Claudia Sheinbau", p: "Morena", base: 45, c: "#922b21", joueur: true },
    { n: "Opposition", p: "Opposition", base: 32, c: "#1a5276" }
  ],
  noteCandidats: "Sheinbau est la présidente du scénario, élue en 2024. Le nom est tronqué. Le bulletin d'opposition est un camp, pas une personne inventée.",
  contraintes: {
    petrole: { prix: 69, hypothese: 69, exportateur: true, label: "Pemex et le pétrole" },
    commerce: { tarifs: 6, label: "Aléa commercial avec les États-Unis" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Pemex", titre: "Pemex pèse sur le budget. Les marchés demandent une trajectoire.", ton: "neg", immediat: { confianceMarches: -3 }, differe: [{ semaines: 6, depMission: { energie: 40 } }] },
    { p: 0.07, important: true, cause: "Sécurité", titre: "Une semaine de violence remet la sécurité au centre.", ton: "neg", immediat: { popularite: -2, tensionSociale: 5 } },
    { p: 0.06, important: true, cause: "Cour suprême", titre: "La Cour suprême est saisie d'une réforme. Le conflit est institutionnel.", ton: "neg", immediat: { popularite: -1, confianceMarches: -2 } },
    { p: 0.05, important: false, cause: "Nearshoring", titre: "Des annonces d'investissement près de la frontière nord soutiennent l'industrie.", ton: "pos", immediat: { croissance: 0.1 } },
    { p: 0.05, important: false, cause: "Banxico", titre: "Banxico reste au-dessus de l'inflation cible.", ton: "", immediat: { bce: 0.1 } }
  ],
  sources: [
    ["364 sièges Morena et alliés", "INE, ratification rapportée par Reuters le 23 août 2024. Deux tiers de la Chambre : 334 sur 500."],
    ["Sénat sous les deux tiers", "Même dépêche Reuters : la majorité qualifiée manque de peu au Sénat."],
    ["Régime présidentiel", "La présidence dirige l'exécutif. Le Congrès vote la loi et, aux deux tiers des deux chambres, la Constitution."],
    ["Macroéconomie", "Croissance, inflation, chômage, dette et déficit sont des estimations de scénario. Ce ne sont pas des chiffres INEGI de novembre 2026."]
  ]
};
