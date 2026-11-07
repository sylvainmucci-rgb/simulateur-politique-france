// Brésil — IBGE, Banque centrale, FMI via notes 2025-2026, Estadão sur la coalition.
// Le jeu ne proclame pas le vainqueur de l'élection d'octobre 2026.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.br = {
  id: "br",
  nom: "Brésil",
  fiche: { drapeau: "🇧🇷", resume: "Présidentialisme de coalition, Congrès fragmenté, mesure provisoire. Déficit et Selic élevés." },
  debut: { annee: 2026, trimestre: 4 },
  intro: "Brésil, 2 novembre 2026. L'élection présidentielle d'octobre 2026 a déjà eu lieu : ce scénario n'en nomme pas le vainqueur. Vous dirigez la présidence face à un Congrès fragmenté. Sans la coalition, la mesure provisoire expire.",
  bandeau: "Croissance 2,3 % en 2025, inflation 4,26 %, chômage 5,6 % (IBGE / synthèses). Déficit global autour de 8 % et dette brute IMF vers 93 % du PIB. Selic à 15 % en juin 2025.",
  monnaie: { unite: "Md R$", taux: "NTN-B / taux long", tauxCourt: "taux long", banque: "BCB (Selic)" },
  eco: {
    pibMd: 12000, croissance: 2.3, croissanceT: 0.4, inflation: 4.3, chomage: 5.6,
    detteMd: 11160, dettePct: 93, deficitPct: 8.1, oat10: 13, bund10: 6,
    notation: "BB", popularite: 42, confianceMarches: 40, tensionSociale: 52
  },
  recettes: { IR: 400, TVA: 900, IS: 280, CSG: 500, cotisations: 700, autres: 600 },
  taux: { IR: 100, TVA: 17, IS: 34, CSG: 9 },
  depenses: { retraites: 1000, sante: 400, education: 250, defense: 120, energie: 40, emploi: 350, securite: 150, collectivites: 500, autres: 700, interets: 900 },
  retraites: { ageLegal: 65, ratioCotRet: 2.1, deficitMd: -80, pensionMoy: 2200 },
  smic: { brutMensuel: 1518, label: "Salaire minimum", unite: "R$" },
  regles: {
    seuilVote: 290,
    labelVote: "Négocier un vote de coalition",
    rejet: "Sans le centrão, il n'y a pas de majorité. La mesure provisoire passe d'abord, puis peut tomber.",
    garde: "STF (Suprême Tribunal fédéral)",
    plafonds: { IR: 180, TVA: 30, age: true },
    special: { type: "mp", label: "Mesure provisoire" },
    modeEmploi: "La Chambre a 513 députés. Une chronique d'Estadão décrit la base de Lula tombée à 244 sièges (47 %) après le départ d'União Brasil et du PP. Le Sénat en a 81. Le jeu ne fige pas le résultat d'octobre 2026. La mesure provisoire (mesure provisória) entre en vigueur tout de suite et le Congrès peut la laisser expirer."
  },
  extra: { flex: false, bouclier: false },
  politique: {
    chambreNom: "Chambre des députés (base d'avant octobre 2026)",
    sieges: 513,
    majoriteAbsolue: 257,
    note: "Estadão : après la sortie d'União Brasil (59) et du PP (47), la base gouvernementale serait passée de 350 à 244 députés. Chiffre politique de chronique, pas un appel nominal officiel de novembre 2026.",
    soutienBase: 230,
    assemblee: [
      { p: "Base gouvernementale", s: 244, c: "#c0392b" },
      { p: "PL et alliés", s: 100, c: "#1a5276" },
      { p: "União / PP (sortis)", s: 106, c: "#b7950b" },
      { p: "Autres", s: 63, c: "#7f8c8d" }
    ],
    senat: { nom: "Sénat fédéral", sieges: 81, note: "81 sénateurs. Le modèle ne détaille pas les bancadas : le goulet est la Chambre.", groupes: [{ p: "Appuis fluctuants", s: 45, c: "#b7950b" }, { p: "Opposition", s: 36, c: "#1a5276" }] }
  },
  election: { date: "2030-10-06", label: "Présidentielle 2030 (scénario)", type: "presidentielle", familleFavorisee: "Opposition", finSiDefaite: true },
  candidats: [
    { n: "Lui Ináci Lul", p: "PT", base: 40, c: "#c0392b", joueur: true },
    { n: "Jai Bolsonar", p: "PL", base: 38, c: "#1a5276" },
    { n: "Candidat du centre", p: "Centre", base: 12, c: "#148f77" }
  ],
  noteCandidats: "Noms tronqués. Ce n'est pas le résultat d'octobre 2026, que le jeu ne proclame pas. C'est un champ pédagogique pour 2030.",
  contraintes: {
    change: { indice: 5.7, depart: 5.7, fragile: true, label: "Réais pour 1 dollar" },
    petrole: { prix: 69, hypothese: 69, exportateur: false, label: "Brent ($)" }
  },
  evenements: [
    { p: 0.08, important: true, cause: "Real", titre: "Le réal se déprécie après un doute sur le cadre fiscal.", ton: "neg", immediat: { inflation: 0.3, confianceMarches: -4 } },
    { p: 0.07, important: true, cause: "Selic", titre: "La Banque centrale maintient le Selic très haut. Le crédit aux ménages se grippe.", ton: "neg", immediat: { bce: 0.25, croissance: -0.1 } },
    { p: 0.07, important: true, cause: "Centrão", titre: "Des partis du centre conditionnent leurs voix à des amendements budgétaires.", ton: "neg", immediat: { popularite: -1 }, differe: [{ semaines: 3, depMission: { collectivites: 15 } }] },
    { p: 0.06, important: false, cause: "Emploi", titre: "Le chômage reste bas. La consommation tient, les services de la dette aussi.", ton: "pos", immediat: { popularite: 1 } },
    { p: 0.06, important: true, cause: "STF", titre: "Le Suprême Tribunal encadre une mesure de l'exécutif.", ton: "", immediat: { popularite: -1 } },
    { p: 0.05, important: false, cause: "Agro", titre: "L'agro-export enregistre une bonne campagne.", ton: "pos", immediat: { croissance: 0.08 } },
    { p: 0.05, important: true, cause: "Amazonie", titre: "La déforestation et un sommet climatique ramènent la pression extérieure.", ton: "neg", immediat: { tensionSociale: 3 } },
    { p: 0.04, important: false, cause: "Bolsa Família", titre: "Le débat sur le montant des transferts revient à la Chambre.", ton: "", immediat: { popularite: 0.5 } }
  ],
  sources: [
    ["Croissance 2,3 % en 2025", "Synthèse Crédit Agricole (panorama Brésil) et note CEPR sur le troisième mandat de Lula, qui citent un ralentissement à 2,3 % en 2025. Le FMI, dans le tableau du WEO d'octobre 2025, affiche aussi un ralentissement vers 2 %."],
    ["Inflation 4,26 % en 2025", "Donnée gouvernementale citée par le panorama Crédit Agricole, plus bas annuel depuis 2018."],
    ["Chômage 5,6 % en 2025", "IBGE, cité par le panorama Crédit Agricole. Le CEPR signale ensuite un taux encore bas au deuxième trimestre 2026."],
    ["Déficit global 8,1 % du PIB en 2025", "FMI, cité par le panorama Crédit Agricole. Le déficit primaire des administrations, lui, est beaucoup plus faible (0,43 % selon la Banque centrale, même source) : l'écart vient des intérêts."],
    ["Dette brute vers 93 % du PIB", "FMI, cité par le panorama Crédit Agricole pour 2025. D'autres définitions (dette nette de la Banque centrale) donnent un chiffre plus bas. Le jeu retient le brut FMI et le dit."],
    ["Selic à 15 % en juin 2025", "Panorama Crédit Agricole, d'après la Banque centrale. Le taux a pu rester élevé ensuite."],
    ["Base à 244 députés sur 513", "Estadão, chronique de Carlos Pereira : départ d'União Brasil (59) et du PP (47), base de 350 à 244. C'est une lecture politique, pas un tableau officiel de la Chambre à la date du jeu."],
    ["Salaire minimum", "Ordre de grandeur 2025 en réais. À confirmer sur le décret officiel : le jeu s'en sert comme niveau de départ."]
  ]
};
