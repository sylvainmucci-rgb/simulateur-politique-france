// Royaume-Uni — FMI WEO octobre 2025 : croissance 1,3 % en 2025 et en 2026.
// Communes : majorité issue du 4 juillet 2024, effectifs susceptibles d'avoir bougé.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.gb = {
  id: "gb",
  nom: "Royaume-Uni",
  fiche: { drapeau: "🇬🇧", resume: "Communes, Lords qui retardent sans veto durable, Premier ministre. Croissance FMI : 1,3 %." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Royaume-Uni, 2 novembre 2026. Vous êtes à Downing Street. Les Communes ont une majorité large issue de 2024. Les Lords peuvent retarder. La contrainte est la livre, les taux et des services publics usés.",
  bandeau: "FMI, WEO octobre 2025 : croissance 1,3 % en 2025 et 1,3 % en 2026. Chômage projeté 4,7 % en 2025 (table B1).",
  monnaie: { unite: "Md£", taux: "Gilt 10 ans", tauxCourt: "gilt", banque: "Banque d'Angleterre" },
  eco: {
    pibMd: 2800, croissance: 1.3, croissanceT: 0.3, inflation: 2.6, chomage: 4.7,
    detteMd: 2800, dettePct: 100, deficitPct: 4.4, oat10: 4.4, bund10: 3.8,
    notation: "AA", popularite: 30, confianceMarches: 58, tensionSociale: 46
  },
  recettes: { IR: 300, TVA: 180, IS: 80, CSG: 180, cotisations: 200, autres: 150 },
  taux: { IR: 100, TVA: 20, IS: 25, CSG: 8 },
  depenses: { retraites: 180, sante: 220, education: 110, defense: 60, energie: 25, emploi: 80, securite: 40, collectivites: 120, autres: 160, interets: 110 },
  retraites: { ageLegal: 66, ratioCotRet: 2.0, deficitMd: -15, pensionMoy: 900 },
  smic: { brutMensuel: 2000, label: "National Living Wage (mensualisé, ordre de grandeur)", unite: "£" },
  regles: {
    seuilVote: 200,
    labelVote: "Vote des Communes",
    rejet: "Avec cette majorité, le rejet veut dire que votre propre groupe lâche le texte.",
    garde: "Cour suprême / convention de Salisbury",
    plafonds: { IR: 170, TVA: 25, age: true },
    special: { type: "coalition", label: "Discipline de parti", seuil: 190 },
    modeEmploi: "Les Communes comptent 650 sièges. La majorité travailliste de juillet 2024 était très large (ordre de grandeur : plus de 400 sièges). Elle a pu s'éroder. Les Lords amendent et retardent ; ils ne bloquent pas durablement une mesure claire du manifeste. Le modèle traduit cela par un seuil bas, pas par une seconde chambre qui renverse."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Chambre des communes (base juillet 2024)",
    sieges: 650,
    majoriteAbsolue: 326,
    note: "Ordre de grandeur du 4 juillet 2024. À confirmer : des élections partielles ont pu changer des sièges.",
    soutienBase: 340,
    assemblee: [
      { p: "Travaillistes", s: 400, c: "#922b21" },
      { p: "Conservateurs", s: 120, c: "#1a5276" },
      { p: "Libéraux-démocrates", s: 70, c: "#f4d03f" },
      { p: "Autres (SNP, etc.)", s: 60, c: "#7f8c8d" }
    ],
    senat: { nom: "Chambre des Lords", sieges: 800, note: "Chambre non élue. Elle retarde et amende. Le modèle ne lui donne pas le dernier mot.", groupes: [{ p: "Lords divers", s: 800, c: "#7f8c8d" }] }
  },
  election: { date: "2029-05-02", label: "Communes 2029 (scénario)", type: "legislatives", familleFavorisee: "Conservateurs", finSiDefaite: false },
  candidats: [
    { n: "Keir Starm", p: "Travaillistes", base: 34, c: "#922b21", joueur: true },
    { n: "Kemi Badeno", p: "Conservateurs", base: 24, c: "#1a5276" },
    { n: "Nige Farag", p: "Reform", base: 16, c: "#1c2833" },
    { n: "Ed Dave", p: "Libéraux-démocrates", base: 12, c: "#f4d03f" }
  ],
  noteCandidats: "Noms tronqués. Ce n'est pas le champ officiel de 2029. Starm est le Premier ministre issu de 2024 dans le scénario.",
  contraintes: {
    change: { indice: 100, depart: 100, fragile: false, label: "Indice de la livre (100 = départ)" },
    petrole: { prix: 69, hypothese: 69, exportateur: false, label: "Brent ($)" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Gilt", titre: "Les gilts se tendent. Le souvenir de 2022 revient dans les commentaires, sans en être la répétition.", ton: "neg", immediat: { confianceMarches: -4, popularite: -1 } },
    { p: 0.07, important: true, cause: "NHS", titre: "Les listes d'attente du NHS reviennent au centre du débat.", ton: "neg", immediat: { popularite: -2 }, differe: [{ semaines: 4, depMission: { sante: 4 } }] },
    { p: 0.06, important: false, cause: "Banque d'Angleterre", titre: "La Banque d'Angleterre reste dépendante des données.", ton: "", immediat: { bce: 0.1 } },
    { p: 0.06, important: true, cause: "Immigration", titre: "Les chiffres nets de migration dominent la semaine politique.", ton: "neg", immediat: { tensionSociale: 5, popularite: -1 } },
    { p: 0.05, important: false, cause: "Services", titre: "Les services exportés (finance, droit, création) soutiennent la croissance.", ton: "pos", immediat: { croissance: 0.08 } },
    { p: 0.05, important: true, cause: "Groupe parlementaire", titre: "Une révolte de députés de la majorité sur un texte social.", ton: "neg", immediat: { popularite: -2, tensionSociale: 3 } },
    { p: 0.04, important: false, cause: "Écosse", titre: "Holyrood conteste une compétence réservée. Le conflit est juridique, pas budgétaire tout de suite.", ton: "", immediat: { tensionSociale: 2 } }
  ],
  sources: [
    ["Croissance 1,3 % en 2025 et en 2026", "FMI, WEO octobre 2025. Le texte note une légère révision à la hausse par rapport à avril, après un premier semestre 2025 plus solide."],
    ["Chômage 4,7 % en 2025", "FMI, WEO octobre 2025, table B1 (4,7 % en 2025 et en 2026)."],
    ["Dette autour de 100 % et déficit 4,4 %", "Estimations de scénario, ordre de grandeur des administrations publiques britanniques. Pas un chiffre de l'ONS arrêté en novembre 2026."],
    ["Communes, 4 juillet 2024", "Majorité travailliste large. Les effectifs du modèle (environ 400 sièges) sont un ordre de grandeur : des partielles ont pu les faire bouger."],
    ["Lords", "Chambre de révision. Elle ne tient pas face à une majorité des Communes sur la durée. Simplifié."],
    ["Salaire minimum", "National Living Wage mensualisé, ordre de grandeur. Le taux horaire légal est celui du gouvernement en vigueur."]
  ]
};
