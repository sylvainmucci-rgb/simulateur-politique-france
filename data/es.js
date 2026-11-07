// Espagne — régime parlementaire. Congrès des députés, élection du 23 juillet 2023.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.es = {
  id: "es",
  nom: "Espagne",
  fiche: { drapeau: "🇪🇸", resume: "Régime parlementaire. Le Congrès investit le président du gouvernement. Aucune majorité absolue en 2023 : l'investiture s'est jouée avec des partenaires." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Espagne, 2 novembre 2026. Le gouvernement tient par une investiture composite. Perdre un partenaire peut bloquer un budget. Une échéance électorale est attendue dans le modèle à la fin novembre 2026.",
  bandeau: "Congrès : élection du 23 juillet 2023 (UIP). L'UIP indiquait une prochaine échéance attendue au 29 novembre 2026 : c'est une date légale possible, pas un résultat. Les agrégats macro sont des estimations de scénario.",
  monnaie: { unite: "Md€", taux: "Bonos 10 ans", tauxCourt: "bono", banque: "BCE" },
  eco: {
    pibMd: 1600, croissance: 2.3, croissanceT: 0.5, inflation: 2.4, chomage: 11.0,
    detteMd: 1630, dettePct: 102, deficitPct: 3.0, oat10: 3.2, bund10: 2.6,
    notation: "A", popularite: 32, confianceMarches: 60, tensionSociale: 42
  },
  recettes: { IR: 130, TVA: 95, IS: 35, CSG: 20, cotisations: 160, autres: 70 },
  taux: { IR: 100, TVA: 21, IS: 25, CSG: 6.5 },
  depenses: { retraites: 190, sante: 90, education: 55, defense: 20, energie: 15, emploi: 30, securite: 20, collectivites: 40, autres: 50, interets: 40 },
  retraites: { ageLegal: 66.5, ratioCotRet: 2.2, deficitMd: -8, pensionMoy: 1400 },
  smic: { brutMensuel: 1184, label: "SMI (ordre de grandeur mensuel)", unite: "€", note: "Le salaire minimum interprofessionnel est révisé par décret. Le montant du modèle est un ordre de grandeur, à confirmer." },
  regles: {
    seuilVote: 170,
    labelVote: "Majorité simple du Congrès",
    rejet: "Sans les partenaires d'investiture, le texte ou le budget tombe.",
    garde: "Tribunal constitutionnel",
    plafonds: { IR: 170, TVA: 25, age: true },
    special: { type: "coalition", label: "Texte qui tient toute l'investiture", seuil: 200 },
    modeEmploi: "350 députés, majorité absolue 176. En 2023 le PP a 136 sièges, le PSOE 121, Vox 33, Sumar 31. L'investiture de novembre 2023 a réuni 179 voix avec des partis régionaux. Le modèle sépare un texte ordinaire et un texte qui exige tout le bloc."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Congrès des députés (23 juillet 2023)",
    sieges: 350,
    majoriteAbsolue: 176,
    note: "UIP, élection du 23 juillet 2023 : PP 136, PSOE 121 à la Chambre dans le récit de l'investiture (la fiche détaillée UIP dit 122 pour le PSOE au second rang). Vox 33 (Guardian, 24 juillet 2023). Sumar autour de 31. Investiture Sánchez le 16 novembre 2023 avec 179 voix. Les effectifs de groupe ont pu bouger : le modèle garde le soir de 2023.",
    soutienBase: 190,
    assemblee: [
      { p: "PP", s: 136, c: "#1a5276" },
      { p: "PSOE", s: 121, c: "#922b21" },
      { p: "Vox", s: 33, c: "#1c2833" },
      { p: "Sumar", s: 31, c: "#8e44ad" },
      { p: "Partenaires d'investiture", s: 29, c: "#148f77" }
    ],
    senat: { nom: "Sénat", sieges: 266, note: "Le Sénat peut retarder. Le Congrès a le dernier mot. L'investiture se joue au Congrès.", groupes: [{ p: "Sénateurs", s: 266, c: "#7f8c8d" }] }
  },
  election: { date: "2026-11-29", label: "Congrès (échéance attendue, UIP)", type: "legislatives", familleFavorisee: "PP", finSiDefaite: false, suite: { date: "2030-11-29", label: "Congrès suivant", type: "legislatives", familleFavorisee: "PP" } },
  candidats: [
    { n: "Pedro Sánche", p: "PSOE", base: 30, c: "#922b21", joueur: true },
    { n: "Alberto Núñez Feijó", p: "PP", base: 32, c: "#1a5276" },
    { n: "Santiago Abasca", p: "Vox", base: 12, c: "#1c2833" },
    { n: "Yolanda Dí", p: "Sumar", base: 8, c: "#8e44ad" }
  ],
  noteCandidats: "Noms tronqués. Sánche est le président du gouvernement du scénario. L'échéance du 29 novembre 2026 est celle qu'indiquait l'UIP comme date attendue, pas un scrutin déjà tenu.",
  contraintes: {
    petrole: { prix: 69, hypothese: 69, exportateur: false, label: "Brent ($)" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Partenaire", titre: "Un partenaire d'investiture conditionne son vote à une compétence régionale.", ton: "neg", immediat: { popularite: -1, tensionSociale: 4 } },
    { p: 0.06, important: true, cause: "Catalogne", titre: "La question catalane revient dans la semaine parlementaire.", ton: "neg", immediat: { tensionSociale: 5 } },
    { p: 0.06, important: false, cause: "Tourisme", titre: "La saison touristique soutient l'emploi et crispe le logement.", ton: "", immediat: { croissance: 0.08, tensionSociale: 2 } },
    { p: 0.05, important: true, cause: "Tribunal constitutionnel", titre: "Le Tribunal constitutionnel est saisi d'une loi récente.", ton: "neg", immediat: { popularite: -1 } },
    { p: 0.05, important: false, cause: "Fonds européens", titre: "Une tranche de fonds européens finance des investissements.", ton: "pos", differe: [{ semaines: 8, croissance: 0.1 }] }
  ],
  sources: [
    ["Congrès, 23 juillet 2023", "UIP : pas de majorité absolue. PP premier groupe (136), PSOE second. Investiture de Pedro Sánchez le 16 novembre 2023."],
    ["179 voix d'investiture", "UIP : la coalition d'investiture réunit 179 sièges, avec des partis régionalistes."],
    ["Vox 33", "The Guardian, 24 juillet 2023."],
    ["Échéance attendue le 29 novembre 2026", "UIP, fiche de l'élection de 2023, champ expected date of next elections. Ce n'est pas un résultat."],
    ["Macroéconomie", "Croissance, chômage, dette et déficit de départ sont des estimations de scénario, pas une notification Eurostat de novembre 2026."],
    ["SMI", "Décret. Le montant du modèle est un ordre de grandeur."]
  ]
};
