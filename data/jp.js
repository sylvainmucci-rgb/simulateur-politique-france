// Japon — Diète. Sièges : site de la Chambre des représentants, 24 septembre 2026.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.jp = {
  id: "jp",
  nom: "Japon",
  fiche: { drapeau: "🇯🇵", resume: "Régime parlementaire. La Chambre des représentants investit le Premier ministre et peut renverser le Cabinet. Les Conseillers peuvent retarder." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Japon, 2 novembre 2026. La Chambre des représentants issue du 8 février 2026 donne au PLD une majorité très large. Vous pouvez la diriger, ou construire autre chose.",
  bandeau: "Les sièges viennent de la Chambre (shugiin.go.jp, 24 septembre 2026). Les agrégats macroéconomiques de départ sont des estimations de scénario, pas un arrêté de la Banque du Japon.",
  monnaie: { unite: "Md¥", taux: "JGB 10 ans", tauxCourt: "JGB", banque: "Banque du Japon" },
  eco: {
    pibMd: 600000, croissance: 1.0, croissanceT: 0.2, inflation: 2.2, chomage: 2.5,
    detteMd: 1440000, dettePct: 240, deficitPct: 3.2, oat10: 1.6, bund10: 1.2,
    notation: "A", popularite: 48, confianceMarches: 64, tensionSociale: 28
  },
  recettes: { IR: 22000, TVA: 24000, IS: 16000, CSG: 5000, cotisations: 18000, autres: 14000 },
  taux: { IR: 100, TVA: 10, IS: 23.2, CSG: 15 },
  depenses: { retraites: 36000, sante: 18000, education: 8000, defense: 9000, energie: 2000, emploi: 4000, securite: 3000, collectivites: 16000, autres: 14000, interets: 10000 },
  retraites: { ageLegal: 65, ratioCotRet: 2.2, deficitMd: -2000, pensionMoy: 180000 },
  smic: { brutMensuel: 180000, label: "Salaire minimum (mensualisé, varie par préfecture)", unite: "¥", note: "Il n'y a pas un seul taux national. Le montant du modèle est un ordre de grandeur." },
  regles: {
    seuilVote: 200,
    labelVote: "Vote de la Chambre des représentants",
    rejet: "Même avec une large majorité, une révolte de groupe ou les Conseillers peuvent ralentir.",
    garde: "Cour suprême / article 41 de la Constitution (la Diète, seul organe législatif)",
    plafonds: { IR: 160, TVA: 15, age: true },
    texteTVA: "La taxe sur la consommation est à 10 % (8 % sur les aliments). Le modèle plafonne un saut brutal.",
    special: { type: "coalition", label: "Outrepasser les Conseillers (deux tiers)", seuil: 280 },
    modeEmploi: "465 sièges, majorité 233. Au 24 septembre 2026, le PLD en avait 315 et le Nippon Ishin 36. Deux tiers à la Chambre permettent de revoter un texte rejeté par les Conseillers. Le modèle sépare le vote ordinaire et ce passage en force."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Chambre des représentants (24 septembre 2026)",
    sieges: 465,
    majoriteAbsolue: 233,
    note: "shugiin.go.jp, Strength of the In-House Groups, 24 septembre 2026 : PLD 315, Centristes 47, Ishin 36, DPP 28, Sanseitō 15, Team Mirai 11, PCJ 4, indépendants 8, 1 vacant. L'élection du 8 février 2026 avait donné 316 sièges au PLD (Nippon.com).",
    soutienBase: 340,
    assemblee: [
      { p: "PLD", s: 315, c: "#1a5276" },
      { p: "Réformistes centristes", s: 47, c: "#922b21" },
      { p: "Nippon Ishin", s: 36, c: "#148f77" },
      { p: "Parti démocrate du peuple", s: 28, c: "#f4d03f" },
      { p: "Sanseitō", s: 15, c: "#6c3483" },
      { p: "Autres", s: 24, c: "#7f8c8d" }
    ],
    senat: { nom: "Chambre des conseillers", sieges: 248, note: "Peut rejeter. La Chambre des représentants peut repasser le texte à la majorité des deux tiers.", groupes: [{ p: "Conseillers", s: 248, c: "#7f8c8d" }] }
  },
  election: { date: "2028-07-20", label: "Conseillers (échéance du modèle)", type: "legislatives", familleFavorisee: "Réformistes centristes", finSiDefaite: false },
  candidats: [
    { n: "Sanae Takaich", p: "PLD", base: 40, c: "#1a5276", joueur: true },
    { n: "Yoshihiko Nod", p: "Réformistes centristes", base: 16, c: "#922b21" },
    { n: "Yuichiro Tamak", p: "Parti démocrate du peuple", base: 10, c: "#f4d03f" }
  ],
  noteCandidats: "Noms tronqués. Takaich est la Première ministre du scénario après l'élection du 8 février 2026.",
  contraintes: {
    change: { indice: 100, depart: 100, fragile: false, label: "Indice du yen (100 = départ)" },
    petrole: { prix: 69, hypothese: 69, exportateur: false, label: "Brent ($), le Japon importe presque tout" }
  },
  evenements: [
    { p: 0.07, important: true, cause: "Yen", titre: "Le yen bouge fort. La Banque du Japon est attendue sur les taux.", ton: "neg", immediat: { confianceMarches: -2, inflation: 0.1 } },
    { p: 0.06, important: true, cause: "Conseillers", titre: "La Chambre des conseillers rejette un texte. Il faut les deux tiers en bas pour passer outre.", ton: "neg", immediat: { popularite: -1 } },
    { p: 0.06, important: false, cause: "Taxe sur les aliments", titre: "Le débat sur la taxe réduite sur les aliments revient.", ton: "", immediat: { popularite: 1, confianceMarches: -1 } },
    { p: 0.05, important: true, cause: "Dette", titre: "Un commentaire de marché rappelle le stock de JGB détenu par la Banque du Japon.", ton: "neg", immediat: { confianceMarches: -3 } },
    { p: 0.05, important: false, cause: "Exportations", titre: "Les exportations d'équipement tiennent la croissance.", ton: "pos", immediat: { croissance: 0.08 } }
  ],
  sources: [
    ["Sièges au 24 septembre 2026", "Chambre des représentants, shugiin.go.jp, Strength of the In-House Groups."],
    ["Élection du 8 février 2026", "Nippon.com : le PLD obtient 316 sièges sur 465, avec le Nippon Ishin (36) la coalition dépasse les deux tiers. La fiche de septembre montre 315 sièges PLD : un siège a bougé, le modèle retient la page officielle."],
    ["Deux tiers", "La Chambre des représentants peut revoter un texte rejeté par les Conseillers à la majorité des deux tiers des membres présents. Simplifié en un seuil de score."],
    ["Macroéconomie", "Croissance, inflation, chômage, dette et déficit de départ sont des estimations de scénario. La dette publique japonaise est parmi les plus élevées du monde ; 240 % est un ordre de grandeur, pas le dernier ratio du ministère des Finances."]
  ]
};
