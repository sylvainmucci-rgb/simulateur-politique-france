// Türkiye — régime présidentiel depuis 2017. Grande Assemblée nationale : 600 sièges.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.tr = {
  id: "tr",
  nom: "Türkiye",
  fiche: { drapeau: "🇹🇷", resume: "Régime présidentiel depuis la révision de 2017. L'Assemblée (600) vote la loi. Le président dirige l'exécutif et peut renvoyer un texte." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Türkiye, 2 novembre 2026. L'exécutif est présidentiel. L'Assemblée issue de 2023 donne une majorité à l'alliance au pouvoir. L'inflation reste le sujet économique, et son niveau de départ est une estimation.",
  bandeau: "Assemblée : élection du 14 mai 2023, 600 sièges. L'UIP comptait 592 membres en décembre 2025. Les macros sont des estimations de scénario.",
  monnaie: { unite: "Md₺", taux: "Obligation 10 ans", tauxCourt: "taux", banque: "Banque centrale" },
  eco: {
    pibMd: 45000, croissance: 3.0, croissanceT: 0.6, inflation: 32, chomage: 8.5,
    detteMd: 13500, dettePct: 30, deficitPct: 5.0, oat10: 28, bund10: 25,
    notation: "B", popularite: 45, confianceMarches: 40, tensionSociale: 46
  },
  recettes: { IR: 4000, TVA: 4500, IS: 1500, CSG: 800, cotisations: 2500, autres: 2200 },
  taux: { IR: 100, TVA: 20, IS: 25, CSG: 15 },
  depenses: { retraites: 3500, sante: 1800, education: 2000, defense: 1500, energie: 800, emploi: 900, securite: 1200, collectivites: 1500, autres: 2000, interets: 2500 },
  retraites: { ageLegal: 65, ratioCotRet: 2, deficitMd: -200, pensionMoy: 15000 },
  smic: { brutMensuel: 26000, label: "Salaire minimum net (ordre de grandeur)", unite: "₺", note: "Révisé souvent à cause de l'inflation. Le montant du modèle n'est pas le dernier décret." },
  regles: {
    seuilVote: 200,
    labelVote: "Loi de l'Assemblée",
    rejet: "La majorité présidentielle peut se fissurer. Un renvoi présidentiel se retourne si l'Assemblée insiste.",
    garde: "Cour constitutionnelle",
    plafonds: { IR: 180, TVA: 25, age: true },
    special: { type: "decret", label: "Décret présidentiel", seuil: 200 },
    modeEmploi: "600 sièges, majorité 301. En 2023, l'AKP a obtenu 268 sièges et le MHP 50 : l'alliance au pouvoir dépasse 301. Le CHP en a obtenu 169. L'UIP relevait 592 membres en décembre 2025, donc des sièges vacants. Le décret du modèle passe, avec un coût de confiance."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Grande Assemblée nationale (14 mai 2023)",
    sieges: 600,
    majoriteAbsolue: 301,
    note: "Élection du 14 mai 2023 : AKP 268, CHP 169, MHP 50, İYİ 43, et de plus petits groupes. Majorité de l'alliance au pouvoir. L'UIP : 592 membres en décembre 2025. Le modèle garde les sièges de 2023 et signale les vacances.",
    soutienBase: 310,
    assemblee: [
      { p: "AKP", s: 268, c: "#e67e22" },
      { p: "CHP", s: 169, c: "#922b21" },
      { p: "MHP", s: 50, c: "#7b241c" },
      { p: "İYİ", s: 43, c: "#5dade2" },
      { p: "Autres", s: 70, c: "#7f8c8d" }
    ],
    senat: null
  },
  election: { date: "2028-05-14", label: "Présidentielle et législatives (échéance du modèle)", type: "presidentielle", familleFavorisee: "CHP", finSiDefaite: false },
  candidats: [
    { n: "Recep Tayyip Erdoğa", p: "AKP", base: 44, c: "#e67e22", joueur: true },
    { n: "Opposition", p: "CHP", base: 38, c: "#922b21" }
  ],
  noteCandidats: "Le nom du président est tronqué. Le second bulletin est un camp, pas un candidat inventé pour 2028.",
  contraintes: {
    change: { indice: 100, depart: 100, fragile: true, label: "Indice de la lire (100 = départ)" },
    petrole: { prix: 69, hypothese: 69, exportateur: false, label: "Brent ($), énergie importée" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Inflation", titre: "L'inflation du mois surprend. La banque centrale est sous pression.", ton: "neg", immediat: { inflation: 0.8, popularite: -1, confianceMarches: -3 } },
    { p: 0.07, important: true, cause: "Lire", titre: "La lire décroche. Les importations d'énergie renchérissent.", ton: "neg", immediat: { inflation: 0.5, confianceMarches: -3 } },
    { p: 0.06, important: true, cause: "Cour constitutionnelle", titre: "La Cour constitutionnelle est saisie d'un décret ou d'une loi.", ton: "neg", immediat: { popularite: -1 } },
    { p: 0.05, important: false, cause: "Tourisme", titre: "Les recettes touristiques soutiennent les devises.", ton: "pos", immediat: { croissance: 0.1, confianceMarches: 1 } },
    { p: 0.05, important: true, cause: "Séisme et reconstruction", titre: "Un chantier de reconstruction rappelle la dépense publique.", ton: "neg", differe: [{ semaines: 4, depMission: { autres: 80 } }] }
  ],
  sources: [
    ["600 sièges, élection du 14 mai 2023", "Grande Assemblée. AKP 268, CHP 169, MHP 50, İYİ 43. Majorité : 301."],
    ["592 membres en décembre 2025", "UIP, fiche Türkiye, historique des effectifs. Des sièges étaient vacants. Le modèle n'invente pas qui les a repris."],
    ["Régime présidentiel, 2017", "La révision de 2017 concentre l'exécutif dans la présidence. L'Assemblée vote la loi. Le président peut renvoyer un texte."],
    ["Inflation, change, déficit", "Estimations de scénario. L'inflation turque a beaucoup varié : le niveau de départ n'est pas un chiffre TÜİK de novembre 2026."],
    ["Salaire minimum", "Révisé souvent. Le montant du modèle est un ordre de grandeur."]
  ]
};
