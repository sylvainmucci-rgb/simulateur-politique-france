// Allemagne — FMI WEO octobre 2025 : croissance faible puis dépense d'infrastructure et de défense.
// Le frein à l'endettement a été assoupli en mars 2025 pour une partie de ces dépenses.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.de = {
  id: "de",
  nom: "Allemagne",
  fiche: { drapeau: "🇩🇪", resume: "Coalition au Bundestag, Bundesrat, frein à la dette. Croissance faible en 2025, reprise liée à l'investissement public." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Allemagne, 2 novembre 2026. Vous dirigez une coalition. Le frein à l'endettement, assoupli en mars 2025 pour la défense et les infrastructures, bloque encore un creusement général non financé.",
  bandeau: "FMI, WEO octobre 2025 : la croissance allemande reste faible en 2025 ; le déficit s'élargirait d'environ 0,8 point avec les dépenses d'infrastructure et de défense. La composition du Bundestag est un ordre de grandeur du scrutin du 23 février 2025.",
  monnaie: { unite: "Md€", taux: "Bund 10 ans", tauxCourt: "Bund", banque: "BCE" },
  eco: {
    pibMd: 4300, croissance: 0.2, croissanceT: 0.0, inflation: 2.2, chomage: 3.7,
    detteMd: 2700, dettePct: 63, deficitPct: 2.6, oat10: 2.6, bund10: 2.6,
    notation: "AAA", popularite: 34, confianceMarches: 70, tensionSociale: 40
  },
  recettes: { IR: 450, TVA: 280, IS: 120, CSG: 200, cotisations: 550, autres: 250 },
  taux: { IR: 100, TVA: 19, IS: 30, CSG: 0 },
  depenses: { retraites: 380, sante: 300, education: 180, defense: 90, energie: 40, emploi: 150, securite: 50, collectivites: 280, autres: 250, interets: 50 },
  retraites: { ageLegal: 66.5, ratioCotRet: 1.8, deficitMd: -10, pensionMoy: 1500 },
  smic: { brutMensuel: 2080, label: "Salaire minimum (12 € × 173 h, ordre de grandeur)", unite: "€" },
  regles: {
    seuilVote: 250,
    labelVote: "Vote de la coalition au Bundestag",
    rejet: "Sans les partenaires de coalition, le texte ne passe pas. Un creusement trop large bute sur le frein à la dette.",
    garde: "Cour constitutionnelle de Karlsruhe",
    plafonds: { IR: 160, TVA: 25, age: true },
    soldePlancher: -25,
    texteSolde: "Frein à l'endettement : un creusement général de cette taille n'entre pas dans l'exception défense / infrastructures de mars 2025.",
    special: { type: "coalition", label: "Arbitrage de coalition", seuil: 240 },
    modeEmploi: "Le Bundestag issu du 23 février 2025 est décrit ici en ordres de grandeur (CDU/CSU, AfD, SPD, Verts, Die Linke). À confirmer sur bundestag.de si des sièges ont bougé. Le Bundesrat peut retarder. Le frein à la dette a été réformé en mars 2025 : le modèle laisse passer la défense et bloque un déficit général trop large."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Bundestag (ordres de grandeur, février 2025)",
    sieges: 630,
    majoriteAbsolue: 316,
    note: "Estimation pédagogique du scrutin du 23 février 2025, pas un tableau officiel à la voix près.",
    soutienBase: 280,
    assemblee: [
      { p: "CDU/CSU", s: 208, c: "#1a5276" },
      { p: "AfD", s: 152, c: "#1c2833" },
      { p: "SPD", s: 120, c: "#922b21" },
      { p: "Verts", s: 85, c: "#196f3d" },
      { p: "Die Linke", s: 65, c: "#6c3483" }
    ],
    senat: { nom: "Bundesrat", sieges: 69, note: "Les Länder y votent. Il peut retarder ou, sur certaines lois, bloquer. Le modèle le signale sans simuler chaque Land.", groupes: [{ p: "Länder de la coalition fédérale", s: 36, c: "#1a5276" }, { p: "Autres Länder", s: 33, c: "#7f8c8d" }] }
  },
  election: { date: "2029-09-23", label: "Bundestag 2029 (scénario)", type: "legislatives", familleFavorisee: "AfD", finSiDefaite: false },
  candidats: [
    { n: "Friedric Mer", p: "CDU/CSU", base: 30, c: "#1a5276", joueur: true },
    { n: "Liste Af", p: "AfD", base: 22, c: "#1c2833" },
    { n: "Liste SP", p: "SPD", base: 16, c: "#922b21" },
    { n: "Liste verte", p: "Verts", base: 12, c: "#196f3d" }
  ],
  noteCandidats: "Noms tronqués. Merz est le chancelier issu du scrutin de février 2025 dans le scénario. Les listes de 2029 ne sont pas une prévision.",
  contraintes: {
    petrole: { prix: 69, hypothese: 69, exportateur: false, label: "Brent ($)" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Industrie", titre: "Les commandes industrielles, surtout l'auto et la chimie, restent faibles.", ton: "neg", immediat: { croissance: -0.1, chomage: 0.05 } },
    { p: 0.07, important: false, cause: "Investissement public", titre: "Un tronçon du plan d'infrastructures est engagé. L'effet viendra avec les chantiers.", ton: "pos", differe: [{ semaines: 8, depMission: { collectivites: 8 }, croissance: 0.12 }] },
    { p: 0.06, important: true, cause: "Défense", titre: "L'objectif de dépense militaire se rappelle à la coalition.", ton: "", differe: [{ semaines: 4, depMission: { defense: 6 } }] },
    { p: 0.06, important: true, cause: "Karlsruhe", titre: "La Cour constitutionnelle est saisie d'un montage budgétaire.", ton: "neg", immediat: { confianceMarches: -2 } },
    { p: 0.05, important: false, cause: "Énergie", titre: "Les prix de l'électricité pour l'industrie restent un sujet de compétitivité.", ton: "neg", immediat: { inflation: 0.1 } },
    { p: 0.05, important: true, cause: "Coalition", titre: "Le partenaire junior de la coalition menace de bloquer un texte.", ton: "neg", immediat: { popularite: -2, tensionSociale: 4 } },
    { p: 0.04, important: false, cause: "Export", titre: "Un carnet d'export hors États-Unis compense une partie des tarifs.", ton: "pos", immediat: { croissance: 0.08 } }
  ],
  sources: [
    ["Croissance faible en 2025, reprise ensuite", "FMI, WEO octobre 2025 : le tableau et le texte décrivent une croissance allemande encore faible en 2025, puis un mieux lié à la demande intérieure. Le jeu part de 0,2 %, lecture du tableau, à confirmer dans la table pays du WEO."],
    ["Déficit +0,8 point", "FMI, WEO octobre 2025 : élargissement du déficit allemand d'environ 0,8 point avec les dépenses d'infrastructure et de défense."],
    ["Chômage 3,7 % en 2025", "FMI, WEO octobre 2025, table B1 (3,7 % en 2025, 3,4 % en 2026)."],
    ["Frein à la dette, mars 2025", "Le WEO indique que la réforme de la règle, en mars 2025, dégage une marge surtout utilisée pour la défense et les infrastructures. Le modèle bloque un creusement général au-delà d'un seuil, pas ces deux postes pris isolément."],
    ["Bundestag, février 2025", "Ordres de grandeur du scrutin du 23 février 2025. À vérifier sur bundestag.de : des sièges ont pu changer."],
    ["Salaire minimum", "Ordre de grandeur horaire autour de 12 €, mensualisé. Le montant légal exact est celui du décret en vigueur."]
  ]
};
