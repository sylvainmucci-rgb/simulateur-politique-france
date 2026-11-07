// États-Unis — cadrage FMI WEO octobre 2025 et 119e Congrès (sources dans le tableau).
// Scénario au 2 novembre 2026 : les niveaux sont les derniers chiffres publiés ou des projections,
// pas des comptes arrêtés à cette date. Les noms de candidats perdent leur dernière lettre.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.us = {
  id: "us",
  nom: "États-Unis",
  fiche: { drapeau: "🇺🇸", resume: "Congrès, clôture au Sénat, réconciliation budgétaire et veto. Croissance et chômage : FMI, octobre 2025." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "États-Unis, 2 novembre 2026. Vous êtes à la Maison-Blanche. Le Congrès du 119e mandat est à majorité républicaine étroite. Les midterms tombent le 3 novembre 2026 dans ce scénario. Les chiffres sont des ancres publiées (FMI WEO octobre 2025, CRS), pas un arrêté de novembre 2026.",
  bandeau: "Ancres publiées : croissance 2,0 % en 2025 et 2,1 % en 2026 (FMI), chômage 4,2 % en 2025 (FMI), dette publique 122 % du PIB en 2024 (FMI). Le déficit de départ est une estimation de scénario.",
  monnaie: { unite: "Md$", taux: "Treasury 10 ans", tauxCourt: "T-note", banque: "Fed" },
  eco: {
    pibMd: 29000, croissance: 2.0, croissanceT: 0.4, inflation: 2.8, chomage: 4.2,
    detteMd: 35380, dettePct: 122, deficitPct: 6.4, oat10: 4.2, bund10: 3.6,
    notation: "AA+", popularite: 43, confianceMarches: 62, tensionSociale: 48
  },
  recettes: { IR: 2400, TVA: 400, IS: 530, CSG: 1600, cotisations: 1700, autres: 254 },
  taux: { IR: 100, TVA: 0, IS: 21, CSG: 15.3 },
  depenses: { retraites: 1500, sante: 1800, education: 220, defense: 900, energie: 40, emploi: 700, securite: 180, collectivites: 900, autres: 1400, interets: 1100 },
  retraites: { ageLegal: 67, ratioCotRet: 2.7, deficitMd: -200, pensionMoy: 1900 },
  smic: { brutMensuel: 1256, label: "Salaire minimum fédéral (horaire × 173)", unite: "$", note: "7,25 $ de l'heure, inchangé depuis 2009. Mensualisé ici pour le modèle." },
  regles: {
    seuilVote: 300,
    seuilCensure: 120,
    labelVote: "Loi ordinaire (clôture au Sénat)",
    rejet: "Sans 60 voix au Sénat dans le modèle, passez par la réconciliation.",
    garde: "Cour suprême / Constitution",
    plafonds: { IR: 180, TVA: 15, age: true },
    texteIR: "Le barème devient confiscatoire au sens du modèle (pas un arrêt de la Cour).",
    texteTVA: "Les États-Unis n'ont pas de TVA fédérale : le proxy de taxe sur la consommation est plafonné.",
    special: { type: "reconciliation", label: "Réconciliation budgétaire", seuil: 220 },
    veto: { label: "Opposer le veto", overrideVoixBasses: 150 },
    modeEmploi: "La loi ordinaire échoue si le score politique est bas (clôture). La réconciliation passe à la majorité simple. Le veto bloque un texte du Congrès en attente, pas votre propre projet. Les deux tiers outrepassent le veto si votre assise est très faible."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Chambre des représentants (août 2025, CRS)",
    sieges: 435,
    majoriteAbsolue: 218,
    note: "CRS, Membership of the 119th Congress, au 4 août 2025 : 219 républicains, 212 démocrates, 4 sièges vacants. Sénat : 53 républicains, 45 démocrates, 2 indépendants qui siègent avec les démocrates (Senate.gov, 119e Congrès). Le score du modèle n'est pas un whip count.",
    soutienBase: 235,
    assemblee: [
      { p: "Républicains", s: 219, c: "#c0392b" },
      { p: "Démocrates", s: 212, c: "#2471a3" },
      { p: "Vacants", s: 4, c: "#7f8c8d" }
    ],
    senat: {
      nom: "Sénat (119e Congrès)",
      sieges: 100,
      note: "Majorité simple 51. Clôture des débats : 60 voix pour la plupart des lois. La réconciliation budgétaire y échappe.",
      groupes: [
        { p: "Républicains", s: 53, c: "#c0392b" },
        { p: "Démocrates", s: 45, c: "#2471a3" },
        { p: "Indépendants (caucus démocrate)", s: 2, c: "#5d6d7e" }
      ]
    }
  },
  election: { date: "2026-11-03", label: "Midterms 2026", type: "legislatives", familleFavorisee: "Démocrates", finSiDefaite: false },
  candidats: [
    { n: "Camp de Donal Trum", p: "Républicains", base: 49, c: "#c0392b", joueur: true },
    { n: "Camp démocrate", p: "Démocrates", base: 48, c: "#2471a3" }
  ],
  noteCandidats: "Scénario pédagogique, pas un sondage. Les midterms du 3 novembre 2026 renouvellent la Chambre et une classe du Sénat. Le nom du président en exercice est tronqué (Trum). La présidentielle suivante est en 2028 ; ce module s'arrête au test des chambres. Aucun résultat réel de novembre 2026 n'est affirmé.",
  contraintes: {
    commerce: { tarifs: 12, label: "Droits de douane moyens élevés (scénario WEO 2025)" },
    petrole: { prix: 69, hypothese: 69, exportateur: false, label: "Brent (hypothèse FMI ~69 $ en 2025)" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Shutdown évité de justesse", titre: "Le plafond de dépense et un shutdown fédéral reviennent dans l'actualité.", ton: "neg", immediat: { confianceMarches: -3, popularite: -1 } },
    { p: 0.07, important: true, cause: "Tarifs", titre: "Un nouveau tour de droits de douane renchérit des biens de consommation.", ton: "neg", immediat: { inflation: 0.25 }, differe: [{ semaines: 6, croissance: -0.12 }] },
    { p: 0.06, important: true, cause: "Cour suprême", titre: "La Cour suprême encadre une action de l'exécutif.", ton: "", immediat: { popularite: -1 } },
    { p: 0.07, important: false, cause: "Investissement IA", titre: "Les dépenses d'équipement liées à l'IA soutiennent l'investissement privé.", ton: "pos", differe: [{ semaines: 8, croissance: 0.15 }] },
    { p: 0.06, important: true, cause: "Emploi", titre: "Le rapport sur l'emploi est plus faible que prévu.", ton: "neg", immediat: { chomage: 0.1, popularite: -1 } },
    { p: 0.05, important: true, cause: "Texte du Congrès", titre: "Le Congrès adopte un texte budgétaire que vous n'avez pas porté.", ton: "neg", poseHostile: { semaines: 2, effet: { popularite: -2, dRec: -80, recKey: "IR" } } },
    { p: 0.05, important: false, cause: "Fed", titre: "La Fed signale que les taux directeurs resteront dépendants des données.", ton: "", immediat: { bce: -0.1 } },
    { p: 0.05, important: true, cause: "Ouragan", titre: "Un ouragan majeur frappe le Golfe. L'aide fédérale est demandée.", ton: "neg", differe: [{ semaines: 2, depMission: { autres: 30 } }] },
    { p: 0.04, important: false, cause: "Trésor", titre: "Une adjudication de Treasuries est bien couverte, le taux se détend un peu.", ton: "pos", immediat: { confianceMarches: 2 } },
    { p: 0.05, important: true, cause: "Frontière", titre: "Le débat sur l'immigration et la frontière reprend le dessus.", ton: "neg", immediat: { tensionSociale: 5 } }
  ],
  sources: [
    ["Croissance 2,0 % en 2025 et 2,1 % en 2026", "FMI, World Economic Outlook, octobre 2025, repris par AP le 14 octobre 2025. Projection, pas un chiffre de novembre 2026."],
    ["Chômage 4,2 % en 2025 et 4,1 % en 2026", "FMI, WEO octobre 2025, table B1. Le texte du WEO note 4,3 % en août 2025."],
    ["Dette publique 122 % du PIB en 2024, 143 % projetés en 2030", "FMI, WEO octobre 2025. Le jeu part de 122 %. Le glissement ultérieur est celui du modèle."],
    ["Solde budgétaire 2026", "Le WEO indique une dégradation de 0,5 point en 2026 (OBBBA, en partie compensée par des recettes tarifaires). Le niveau de départ 6,4 % est une estimation de scénario, pas un chiffre FMI isolé."],
    ["Inflation 2,8 % et Treasury 10 ans 4,2 %", "Estimations de scénario pour donner un point de départ au modèle. Elles ne sont pas un imprimés BLS ou Trésor de novembre 2026."],
    ["PIB nominal ~29 000 Md$", "Ordre de grandeur, pas le dernier chiffre BEA."],
    ["Chambre : 219 républicains, 212 démocrates, 4 vacants", "Congressional Research Service, Membership of the 119th Congress, situation au 4 août 2025."],
    ["Sénat : 53 républicains, 45 démocrates, 2 indépendants", "Senate.gov, division du 119e Congrès (2025-2027)."],
    ["Clôture et réconciliation", "Règle du Sénat : 60 voix pour clore la plupart des débats ; la réconciliation budgétaire se fait à la majorité simple. Le modèle le simplifie en deux seuils de score."],
    ["Veto", "Article I, section 7 de la Constitution : veto présidentiel, outrepassement aux deux tiers des deux chambres. Simplifié ici."],
    ["Salaire minimum fédéral 7,25 $", "Fair Labor Standards Act, inchangé depuis 2009. Le montant mensuel du modèle est 7,25 × 173 heures, arrondi."],
    ["Brent ~69 $ en 2025", "FMI, WEO octobre 2025 : le pétrole autour de 68,90 $ le baril en moyenne 2025. Le jeu s'en sert comme hypothèse, puis le prix bouge."]
  ]
};
