// Italie — FMI, article IV juillet 2025. Chambre des députés : 400 sièges, bicamérisme parfait.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.it = {
  id: "it",
  nom: "Italie",
  fiche: { drapeau: "🇮🇹", resume: "Régime parlementaire, bicamérisme : un texte doit passer à la Chambre et au Sénat. Coalition Melon depuis 2022." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Italie, 2 novembre 2026. Vous pouvez être à la présidence du Conseil, ou partir de l'opposition. La Chambre et le Sénat ont le même poids. La croissance est faible, la dette est élevée.",
  bandeau: "FMI, article IV juillet 2025 : croissance projetée 0,5 % en 2025 et 0,8 % en 2026. Le déficit proche de 3 % est une lecture de cette trajectoire, pas un arrêté de novembre 2026.",
  monnaie: { unite: "Md€", taux: "BTP 10 ans", tauxCourt: "BTP", banque: "BCE" },
  eco: {
    pibMd: 2200, croissance: 0.5, croissanceT: 0.1, inflation: 1.8, chomage: 6.5,
    detteMd: 2970, dettePct: 135, deficitPct: 3.0, oat10: 3.6, bund10: 2.6,
    notation: "BBB", popularite: 40, confianceMarches: 58, tensionSociale: 40
  },
  recettes: { IR: 280, TVA: 180, IS: 55, CSG: 40, cotisations: 280, autres: 185 },
  taux: { IR: 100, TVA: 22, IS: 24, CSG: 9 },
  depenses: { retraites: 330, sante: 160, education: 90, defense: 35, energie: 25, emploi: 45, securite: 35, collectivites: 70, autres: 180, interets: 90 },
  retraites: { ageLegal: 67, ratioCotRet: 1.6, deficitMd: -20, pensionMoy: 1400 },
  smic: { brutMensuel: 0, label: "Pas de salaire minimum légal national unique", unite: "€", note: "L'Italie n'a pas de SMIC légal unique. Les minima sont dans les conventions collectives." },
  regles: {
    seuilVote: 200,
    labelVote: "Vote conforme des deux chambres",
    rejet: "Sans les deux chambres, le texte tombe. Une confiance peut le lier au gouvernement.",
    garde: "Cour constitutionnelle",
    plafonds: { IR: 160, TVA: 25, age: true },
    special: { type: "coalition", label: "Question de confiance", seuil: 210 },
    modeEmploi: "La Chambre compte 400 députés, le Sénat 200 élus plus des sénateurs à vie. Depuis 2022 la coalition de centre-droit a la majorité des deux côtés. Le modèle exige un score suffisant : c'est le bicamérisme, pas un 49.3."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Chambre des députés (composition 2025, ordre de grandeur)",
    sieges: 400,
    majoriteAbsolue: 201,
    note: "Fin 2025, Fratelli d'Italia restait le premier groupe (environ 116 sièges), devant le PD (70), la Ligue (environ 62) et Forza Italia (environ 52). Source : Political Data Yearbook 2025 et Robert Schuman, composition fin 2024. La majorité de coalition est réelle ; les effectifs bougent avec les changements de groupe.",
    soutienBase: 230,
    assemblee: [
      { p: "Fratelli d'Italia", s: 116, c: "#1a5276" },
      { p: "Parti démocrate", s: 70, c: "#922b21" },
      { p: "Ligue", s: 62, c: "#1a7a3a" },
      { p: "Forza Italia", s: 52, c: "#2980b9" },
      { p: "Mouvement 5 étoiles", s: 48, c: "#f4d03f" },
      { p: "Autres", s: 52, c: "#7f8c8d" }
    ],
    senat: { nom: "Sénat", sieges: 206, note: "Même poids que la Chambre. Un texte divergent fait la navette. Les sénateurs à vie s'ajoutent aux 200 élus.", groupes: [{ p: "Coalition et opposition", s: 206, c: "#7f8c8d" }] }
  },
  election: { date: "2027-09-30", label: "Législatives (échéance du modèle)", type: "legislatives", familleFavorisee: "Parti démocrate", finSiDefaite: false, suite: { date: "2032-09-30", label: "Législatives suivantes", type: "legislatives", familleFavorisee: "Parti démocrate" } },
  candidats: [
    { n: "Giorgia Melon", p: "Fratelli d'Italia", base: 28, c: "#1a5276", joueur: true },
    { n: "Elly Schlei", p: "Parti démocrate", base: 22, c: "#922b21" },
    { n: "Giuseppe Cont", p: "Mouvement 5 étoiles", base: 12, c: "#f4d03f" },
    { n: "Matteo Salvin", p: "Ligue", base: 14, c: "#1a7a3a" }
  ],
  noteCandidats: "Noms tronqués. Ce n'est pas un scrutin convoqué. Melon est la présidente du Conseil du scénario.",
  contraintes: {
    petrole: { prix: 69, hypothese: 69, exportateur: false, label: "Brent ($)" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Écart BTP-Bund", titre: "L'écart entre les BTP et le Bund se tend. La dette rappelle le spread.", ton: "neg", immediat: { confianceMarches: -4 } },
    { p: 0.06, important: true, cause: "Navette", titre: "Le Sénat réécrit un texte déjà voté par la Chambre. La navette repart.", ton: "neg", immediat: { popularite: -1 } },
    { p: 0.06, important: false, cause: "Plan de relance", titre: "Une tranche du plan européen de relance finance des chantiers.", ton: "pos", differe: [{ semaines: 8, croissance: 0.1 }] },
    { p: 0.05, important: true, cause: "Mezzogiorno", titre: "L'écart Nord-Sud revient dans le débat budgétaire.", ton: "neg", immediat: { tensionSociale: 4 } },
    { p: 0.05, important: false, cause: "Exportations", titre: "Les exportations manufacturières tiennent mieux que prévu.", ton: "pos", immediat: { croissance: 0.08 } }
  ],
  sources: [
    ["Croissance 0,5 % en 2025 et 0,8 % en 2026", "FMI, article IV Italie, juillet 2025 (country report 2025/201). Projection, pas un arrêté ISTAT de novembre 2026."],
    ["Déficit ramené vers 3 %", "Lecture de la trajectoire FMI citée dans la presse économique de 2025. Le niveau de départ du modèle est 3,0 %, à ne pas prendre pour le solde Eurostat du jour."],
    ["Dette ~135 % du PIB", "Ordre de grandeur de long terme, pas le ratio Maastricht publié pour le trimestre en cours."],
    ["Chambre, 400 sièges", "Réforme de 2020. Composition : Robert Schuman, fin 2024 ; Political Data Yearbook, Italie 2025 (FdI autour de 116 sièges en fin d'année)."],
    ["Sénat", "200 élus plus des sénateurs à vie. Bicamérisme parfait : les deux chambres peuvent renverser le gouvernement."],
    ["Pas de SMIC légal unique", "Les planchers sont conventionnels. Le modèle n'invente pas un salaire minimum national."]
  ]
};
