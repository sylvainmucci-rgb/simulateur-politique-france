// Données pays — ajouter un pays = ajouter data/xx.js qui définit COUNTRIES.xx
// et l'inclure dans index.html. Lancer avec ?pays=xx.
// Les champs marqués parametre / estimation / modele ne doivent pas être présentés
// comme des statistiques officielles vérifiées à la date du scénario.
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.fr = {
  id: "fr",
  nom: "France",
  debut: { annee: 2026, trimestre: 4 },
  // Chiffres macro de départ : PARAMÈTRES fournis pour la partie, non vérifiés.
  eco: {
    pibMd: 3025.2,
    croissance: 0.4,
    croissanceT: -0.1,
    inflation: 3.8,
    chomage: 8.5,
    detteMd: 3600,
    dettePct: 119,
    deficitPct: 5.4,
    oat10: 4.76,
    bund10: 2.55,
    notation: "A+",
    outlook: "stable",
    popularite: 27,
    confianceMarches: 42,
    tensionSociale: 58,
    gini: 0.297,
    pauvrete: 14.4
  },
  // Ordres de grandeur APU, calés au démarrage sur le déficit paramétré.
  recettes: { IR: 95, TVA: 210, IS: 62, CSG: 145, cotisations: 420, autres: 607 },
  taux: { IR: 100, TVA: 20, IS: 25, CSG: 9.2 },
  depenses: {
    retraites: 410, sante: 260, education: 175, defense: 55, energie: 25,
    emploi: 80, securite: 45, collectivites: 250, logement: 40, agriculture: 20,
    environnement: 15, autres: 265, interets: 62
  },
  missions: {
    retraites: "Retraites",
    sante: "Santé (dont hôpital)",
    education: "Éducation",
    defense: "Défense (LPM)",
    energie: "Énergie",
    emploi: "Emploi et solidarité",
    securite: "Sécurité",
    collectivites: "Collectivités",
    logement: "Logement",
    agriculture: "Agriculture",
    environnement: "Environnement",
    autres: "Autres missions",
    interets: "Charge d'intérêts"
  },
  elasticites: {
    note: "Estimations pédagogiques (ordres de grandeur), pas un chiffrage d'administration.",
    IR: { reponse: 0.85 },
    TVA: { mdParPoint: 10.5, reponse: 0.95, inflationParPoint: 0.45 },
    IS: { mdParPoint: 2.3, reponse: 0.8 },
    CSG: { mdParPoint: 15.5, reponse: 1 }
  },
  multiplicateurs: {
    note: "Point estimé dans les fourchettes OFCE / FMI / Banque de France (environ 0,3 à 1,2 selon l'instrument et le cycle). Le délai est en trimestres.",
    retraites: { m: 0.85, delai: 2, type: "transfert" },
    sante: { m: 0.7, delai: 3, type: "consommation publique" },
    education: { m: 0.75, delai: 4, type: "capital humain" },
    defense: { m: 0.6, delai: 3, type: "commande publique" },
    energie: { m: 0.8, delai: 6, type: "investissement" },
    emploi: { m: 0.9, delai: 2, type: "transfert" },
    securite: { m: 0.4, delai: 2, type: "consommation publique" },
    collectivites: { m: 0.65, delai: 2, type: "consommation publique" },
    logement: { m: 0.85, delai: 4, type: "investissement" },
    agriculture: { m: 0.5, delai: 2, type: "transfert" },
    environnement: { m: 0.55, delai: 6, type: "investissement" },
    autres: { m: 0.6, delai: 2, type: "consommation publique" },
    impot: { IR: { m: 0.35, delai: 2 }, TVA: { m: 0.55, delai: 1 }, IS: { m: 0.3, delai: 4 }, CSG: { m: 0.5, delai: 2 } }
  },
  retraites: {
    ageLegal: 62.75,
    dureeTrimestres: 171,
    indexation: "prix",
    tauxCotisation: 28,
    ratioCotRet: 1.7,
    soldeMd: -6.6,
    pensionMoyMensuelle: 1600,
    demo: {
      populationM: 68.6,
      fecondite: 1.62,
      esperanceVie: 82.4,
      soldeMigratoireMilliers: 140,
      cotisantsM: 27.2,
      retraitesM: 16.0,
      natalitePourMille: 10.6,
      mortalitePourMille: 9.4
    }
  },
  smic: { brutMensuel: 1867.02, depuis: "juin 2026", statut: "à confirmer" },
  institutions: {
    siegesAssemblee: 577,
    majoriteAbsolue: 289,
    siegesSenat: 348,
    dissolutionDelaiTrimestres: 4,
    quota493HorsBudget: 1,
    referendumDelaiTrimestres: 8
  },
  politique: {
    soutienBase: 162,
    majoriteAbsolue: 289,
    ue: { plafondDeficit: 3, procedureDeficitExcessif: true, ajustementPt: 0.5 },
    assemblee: [
      { id: "rn", p: "RN", s: 121, c: "#1b2a6b" },
      { id: "epr", p: "EPR", s: 90, c: "#e0a800" },
      { id: "lfi", p: "LFI", s: 70, c: "#c0392b" },
      { id: "ps", p: "PS", s: 68, c: "#e84393" },
      { id: "lr", p: "Droite républicaine", s: 46, c: "#0066cc" },
      { id: "ecolo", p: "Écologistes", s: 38, c: "#27ae60" },
      { id: "dem", p: "Démocrates", s: 37, c: "#f59f00" },
      { id: "hor", p: "Horizons", s: 35, c: "#4dabf7" },
      { id: "liot", p: "LIOT", s: 24, c: "#868e96" },
      { id: "gdr", p: "GDR", s: 17, c: "#9b2335" },
      { id: "udr", p: "UDR", s: 17, c: "#364fc7" },
      { id: "ni", p: "Non-inscrits", s: 11, c: "#495057" },
      { id: "vac", p: "Vacants", s: 3, c: "#2c2c2c" }
    ]
  },
  // Profils politiques stables ; les sièges, eux, bougent après une élection.
  groupes: {
    rn: {
      camp: "rn", famille: "extreme", base: -12, relation0: 28,
      axe: { eco: 15, immigration: 90, climat: -35, europe: -80, ordre: 70, mercosur: -55, retraites: 15 },
      lignesRouges: [
        { id: "regu", type: "mesure_interdite", cle: "immigration", valeur: "regularisation", label: "Refus de toute régularisation", grave: true },
        { id: "tva", type: "taux_max", taux: "TVA", max: 21, label: "Refus d'une TVA au-delà de 21 %", grave: true },
        { id: "csg", type: "taux_max", taux: "CSG", max: 9.8, label: "Refus d'une hausse nette de CSG", grave: true },
        { id: "merco", type: "mesure_interdite", cle: "mercosur", valeur: "ratifier", label: "Refus de ratifier le Mercosur", grave: false },
        { id: "federal", type: "mesure_interdite", cle: "europe", valeur: "federal", label: "Refus d'un saut fédéral européen", grave: true }
      ],
      concessions: [
        { id: "imm", label: "Inscrire un durcissement de l'immigration", patch: { mesures: { immigration: "ferme" } }, leve: ["regu"] },
        { id: "secu", label: "Abonder la mission sécurité (+4 %)", patch: { depAdd: { securite: 4 } } },
        { id: "merco", label: "Écarter la ratification du Mercosur", patch: { mesures: { mercosur: "rejeter" } }, leve: ["merco"] }
      ]
    },
    epr: {
      camp: "central", famille: "centre", base: 10, relation0: 82,
      axe: { eco: 25, immigration: 10, climat: 25, europe: 75, ordre: 20, mercosur: 35, retraites: 40 },
      lignesRouges: [
        { id: "confisc", type: "taux_max", taux: "IR", max: 145, label: "Refus d'un barème confiscatoire", grave: true },
        { id: "age_bas", type: "age_min", min: 62, label: "Refus de ramener l'âge légal sous 62 ans", grave: false }
      ],
      concessions: [
        { id: "flex", label: "Demander la clause nationale de flexibilité (défense)", patch: { mesures: { defense: "lpm" } } }
      ]
    },
    lfi: {
      camp: "gauche", famille: "gauche", base: -20, relation0: 22,
      axe: { eco: -85, immigration: -40, climat: 35, europe: -20, ordre: -40, mercosur: -70, retraites: -95 },
      lignesRouges: [
        { id: "age", type: "age_max", max: 62.75, label: "Aucun report de l'âge légal", grave: true },
        { id: "sante", type: "depense_plancher", poste: "sante", min: 0, label: "Aucune coupe dans la santé", grave: true },
        { id: "gel", type: "indexation_interdite", valeur: "gel", label: "Refus du gel des pensions", grave: true },
        { id: "merco", type: "mesure_interdite", cle: "mercosur", valeur: "ratifier", label: "Refus du Mercosur", grave: false }
      ],
      concessions: [
        { id: "smic", label: "Coup de pouce au SMIC (+2 %)", patch: { smic: 2 } },
        { id: "age", label: "Baisser l'âge légal de 3 mois", patch: { age: -0.25 }, leve: ["age"] },
        { id: "is", label: "Relever l'impôt sur les sociétés (+1,5 pt)", patch: { tauxDelta: { IS: 1.5 } } }
      ]
    },
    ps: {
      camp: "gauche", famille: "gauche", base: -8, relation0: 42,
      axe: { eco: -55, immigration: -15, climat: 45, europe: 55, ordre: -10, mercosur: -40, retraites: -70 },
      lignesRouges: [
        { id: "age", type: "age_max", max: 63.25, label: "Âge légal plafonné à 63 ans et 3 mois", grave: true },
        { id: "sante", type: "depense_plancher", poste: "sante", min: -1, label: "Pas de coupe sanitaire au-delà de 1 %", grave: true },
        { id: "educ", type: "depense_plancher", poste: "education", min: -1, label: "Pas de coupe éducative au-delà de 1 %", grave: true },
        { id: "tva", type: "taux_max", taux: "TVA", max: 20.5, label: "Refus d'une hausse de TVA", grave: true },
        { id: "gel", type: "indexation_interdite", valeur: "gel", label: "Refus du gel des pensions", grave: true }
      ],
      concessions: [
        { id: "ir", label: "Rendre l'IR plus progressif (indice +6)", patch: { tauxDelta: { IR: 6 } } },
        { id: "hopital", label: "Inscrire le plan hôpital", patch: { mesures: { hopital: "plan" } } },
        { id: "index", label: "Indexer les pensions sur les prix", patch: { indexation: "prix" }, leve: ["gel"] }
      ]
    },
    lr: {
      camp: "droite", famille: "droite", base: 2, relation0: 48,
      axe: { eco: 72, immigration: 45, climat: -10, europe: 25, ordre: 55, mercosur: 15, retraites: 75 },
      lignesRouges: [
        { id: "is", type: "taux_max", taux: "IS", max: 26.5, label: "Pas de hausse d'IS au-delà de 26,5 %", grave: false },
        { id: "age", type: "age_min", min: 62.75, label: "Refus de baisser l'âge légal", grave: false },
        { id: "solde", type: "solde_min", min: -12, label: "Refus d'un creusement supérieur à 12 Md€", grave: true },
        { id: "secu", type: "depense_plancher", poste: "securite", min: -2, label: "Pas de désarmement budgétaire de la sécurité", grave: false }
      ],
      concessions: [
        { id: "is", label: "Baisser l'IS d'un point", patch: { tauxDelta: { IS: -1 } }, leve: ["is"] },
        { id: "dep", label: "Couper 2 % les autres missions", patch: { depAdd: { autres: -2 } } },
        { id: "age", label: "Décaler l'âge légal de 3 mois", patch: { age: 0.25 } }
      ]
    },
    ecolo: {
      camp: "gauche", famille: "ecolo", base: -10, relation0: 38,
      axe: { eco: -35, immigration: -10, climat: 90, europe: 60, ordre: -15, mercosur: -75, retraites: -40 },
      lignesRouges: [
        { id: "climat", type: "mesure_interdite", cle: "climat", valeur: "pause", label: "Refus d'une pause climatique", grave: true },
        { id: "merco", type: "mesure_interdite", cle: "mercosur", valeur: "ratifier", label: "Refus du Mercosur", grave: true },
        { id: "pestic", type: "mesure_interdite", cle: "agriculture", valeur: "normes_bas", label: "Refus de relâcher les normes agricoles", grave: false },
        { id: "env", type: "depense_plancher", poste: "environnement", min: -1, label: "Pas de coupe environnementale", grave: false }
      ],
      concessions: [
        { id: "climat", label: "Accélérer le climat (rénovation, ENR)", patch: { mesures: { climat: "accelerer" } }, leve: ["climat"] },
        { id: "merco", label: "Rejeter le Mercosur", patch: { mesures: { mercosur: "rejeter" } }, leve: ["merco"] },
        { id: "enr", label: "Accélérer les renouvelables", patch: { mesures: { enr: "accelerer" } } }
      ]
    },
    dem: {
      camp: "central", famille: "centre", base: 8, relation0: 80,
      axe: { eco: 10, immigration: -5, climat: 30, europe: 70, ordre: 5, mercosur: 20, retraites: 25 },
      lignesRouges: [
        { id: "sante", type: "depense_plancher", poste: "sante", min: -4, label: "Refus d'une coupe sanitaire lourde", grave: true }
      ],
      concessions: [
        { id: "educ", label: "Créer des postes éducatifs (+2 %)", patch: { depAdd: { education: 2 } } }
      ]
    },
    hor: {
      camp: "central", famille: "centre", base: 6, relation0: 78,
      axe: { eco: 40, immigration: 25, climat: 5, europe: 45, ordre: 30, mercosur: 25, retraites: 45 },
      lignesRouges: [
        { id: "is", type: "taux_max", taux: "IS", max: 30, label: "IS plafonné à 30 %", grave: false }
      ],
      concessions: [
        { id: "is", label: "IS −0,5 point", patch: { tauxDelta: { IS: -0.5 } } }
      ]
    },
    liot: {
      camp: "local", famille: "local", base: 6, relation0: 50,
      axe: { eco: 5, immigration: 5, climat: 10, europe: 10, ordre: 10, mercosur: -10, retraites: 0 },
      lignesRouges: [
        { id: "dgf", type: "depense_plancher", poste: "collectivites", min: -1, label: "Refus d'une coupe des dotations", grave: true }
      ],
      concessions: [
        { id: "dgf", label: "Relever les dotations (+3 %)", patch: { depAdd: { collectivites: 3 } }, leve: ["dgf"] },
        { id: "hopital", label: "Plan contre les déserts médicaux", patch: { mesures: { hopital: "plan" } } }
      ]
    },
    gdr: {
      camp: "gauche", famille: "gauche", base: -18, relation0: 30,
      axe: { eco: -70, immigration: -25, climat: 20, europe: -10, ordre: -20, mercosur: -50, retraites: -85 },
      lignesRouges: [
        { id: "age", type: "age_max", max: 62.75, label: "Aucun report de l'âge légal", grave: true },
        { id: "sante", type: "depense_plancher", poste: "sante", min: 0, label: "Aucune coupe dans les services publics de santé", grave: true },
        { id: "gel", type: "indexation_interdite", valeur: "gel", label: "Refus du gel des pensions", grave: true }
      ],
      concessions: [
        { id: "serv", label: "Abonder santé et collectivités", patch: { depAdd: { sante: 2, collectivites: 1 } } }
      ]
    },
    udr: {
      camp: "rn", famille: "extreme", base: -10, relation0: 30,
      axe: { eco: 35, immigration: 80, climat: -25, europe: -60, ordre: 65, mercosur: -20, retraites: 30 },
      lignesRouges: [
        { id: "regu", type: "mesure_interdite", cle: "immigration", valeur: "regularisation", label: "Refus de la régularisation", grave: true },
        { id: "is", type: "taux_max", taux: "IS", max: 27, label: "Refus d'un IS au-delà de 27 %", grave: false }
      ],
      concessions: [
        { id: "imm", label: "Durcir l'immigration", patch: { mesures: { immigration: "ferme" } }, leve: ["regu"] },
        { id: "is", label: "IS −1 point", patch: { tauxDelta: { IS: -1 } }, leve: ["is"] }
      ]
    },
    ni: {
      camp: "aucun", famille: "local", base: 0, relation0: 40,
      axe: { eco: 0, immigration: 0, climat: 0, europe: 0, ordre: 0, mercosur: 0, retraites: 0 },
      lignesRouges: [],
      concessions: []
    }
  },
  // Estimation pédagogique — ce n'est pas l'effectif officiel du Sénat.
  senat: {
    estimation: true,
    note: "Composition estimée pour le jeu (348 sièges). À ne pas lire comme l'effectif officiel du Sénat en novembre 2026.",
    groupes: [
      { id: "slr", p: "Les Républicains", s: 132, axe: "droite" },
      { id: "sso", p: "Socialiste", s: 64, axe: "gauche" },
      { id: "suc", p: "Union centriste", s: 56, axe: "centre" },
      { id: "srd", p: "RDPI", s: 24, axe: "centre" },
      { id: "scr", p: "CRCE-K", s: 18, axe: "gauche" },
      { id: "sec", p: "Écologiste", s: 16, axe: "ecolo" },
      { id: "sre", p: "RDSE", s: 14, axe: "centre" },
      { id: "srn", p: "RN", s: 4, axe: "extreme" },
      { id: "sin", p: "Divers", s: 20, axe: "droite" }
    ],
    amendements: [
      { id: "aucun", label: "Aucun amendement — défendre le texte de l'Assemblée" },
      { id: "coupe", label: "Coupe de 2 % hors socle social (autres missions)", patch: { depAdd: { autres: -2 } } },
      { id: "is", label: "IS −0,5 point pour emporter le centre et la droite", patch: { tauxDelta: { IS: -0.5 } } },
      { id: "ferme", label: "Durcir l'immigration (demande de la droite sénatoriale)", patch: { mesures: { immigration: "ferme" } } },
      { id: "climat_off", label: "Retirer l'accélération climatique", patch: { mesures: { climat: "statuquo" } } }
    ]
  },
  candidats2027: [
    { n: "Jordan Bardell", p: "RN", famille: "extreme", base: 32, c: "#1b2a6b", profil: { "18-24": 1.15, "65+": 1.25, ouvriers: 1.55, employés: 1.3, cadres: 0.55, aisé: 0.7, modeste: 1.35, rural: 1.4, métropoles: 0.75, retraités: 1.2 } },
    { n: "Jean-Luc Mélencho", p: "LFI", famille: "gauche", base: 12, c: "#c0392b", profil: { "18-24": 1.7, "25-34": 1.35, "65+": 0.55, ouvriers: 1.25, cadres: 0.85, métropoles: 1.3, rural: 0.7, retraités: 0.6, aisé: 0.65, modeste: 1.3 } },
    { n: "Édouard Philipp", p: "Horizons", famille: "centre", base: 11, c: "#4fa3d1", profil: { "65+": 1.3, cadres: 1.25, aisé: 1.3, rural: 0.9, retraités: 1.25, "18-24": 0.6 } },
    { n: "Gabriel Atta", p: "Renaissance", famille: "centre", base: 8, c: "#f5b700", joueur: true, profil: { cadres: 1.35, aisé: 1.25, métropoles: 1.3, "18-24": 0.7, ouvriers: 0.6, rural: 0.65, retraités: 0.85 } },
    { n: "Bruno Retaillea", p: "Droite républicaine", famille: "droite", base: 8, c: "#0066cc", profil: { "65+": 1.35, retraités: 1.3, cadres: 1.05, rural: 1.15, aisé: 1.1, "18-24": 0.55 } },
    { n: "Raphaël Glucksman", p: "PS-Place publique", famille: "gauche", base: 11, c: "#e84393", profil: { cadres: 1.2, intermédiaires: 1.25, métropoles: 1.35, "35-49": 1.2, ouvriers: 0.75, rural: 0.7, aisé: 1.15 } },
    { n: "Marine Tondelie", p: "Écologistes", famille: "ecolo", base: 5, c: "#27ae60", profil: { "18-24": 1.6, "25-34": 1.3, cadres: 1.25, métropoles: 1.45, rural: 0.55, ouvriers: 0.6, retraités: 0.5 } },
    { n: "Éric Zemmou", p: "Reconquête", famille: "extreme", base: 4, c: "#5b3a1a", profil: { aisé: 1.3, cadres: 1.1, "65+": 1.2, rural: 1.1, ouvriers: 0.85, "18-24": 0.7 } },
    { n: "Fabien Rousse", p: "PCF", famille: "gauche", base: 3, c: "#8b0000", profil: { ouvriers: 1.5, modeste: 1.3, rural: 1.15, cadres: 0.6, "18-24": 0.8, retraités: 1.15 } }
  ],
  categoriesSondage: [
    { id: "18-24", groupe: "Âge" }, { id: "25-34", groupe: "Âge" }, { id: "35-49", groupe: "Âge" },
    { id: "50-64", groupe: "Âge" }, { id: "65+", groupe: "Âge" },
    { id: "modeste", groupe: "Revenu" }, { id: "médian", groupe: "Revenu" }, { id: "aisé", groupe: "Revenu" },
    { id: "ouvriers", groupe: "CSP" }, { id: "employés", groupe: "CSP" }, { id: "intermédiaires", groupe: "CSP" },
    { id: "cadres", groupe: "CSP" }, { id: "retraités", groupe: "CSP" },
    { id: "rural", groupe: "Territoire" }, { id: "villes", groupe: "Territoire" }, { id: "métropoles", groupe: "Territoire" }
  ],
  noteCandidats: "Scénario pédagogique, pas une liste officielle de candidatures. Marine Le Pe (RN) est traitée comme inéligible dans ce scénario (condamnation de première instance, mars 2025) : le RN présente Jordan Bardell. Emmanuel Macro ne peut pas briguer un troisième mandat consécutif. La dernière lettre des noms est omise, par convention du jeu.",
  legislatives: {
    note: "Bases de scénario pour les législatives, pas un sondage publié. La conversion voix → sièges est un modèle à deux tours simplifié (prime majoritaire et front républicain), pas une projection circonscription par circonscription.",
    bases: { rn: 28, epr: 15, lfi: 11, ps: 11, lr: 8, ecolo: 6, dem: 6, hor: 5, liot: 3.5, gdr: 2.5, udr: 3, ni: 1 },
    planchers: { liot: 8, ni: 5, gdr: 8, ecolo: 6 }
  },
  secteurs: {
    sante: { tensionHopital: 74, desertsPct: 17.5, ondamRatio: 0.99 },
    education: { depParEleve: 8600, decrochage: 8.2, tensionRecrutement: 64, pisa: 100 },
    energie: { prixMWh: 95, nucleaireTWh: 340, partENR: 27, epr2Lances: 0, epr2Cible: 6, epr2Avancement: 8, edfDette: 54 },
    commerce: { balanceBiens: -78, balanceCourante: -9, tarifUS: 15, mercosur: "negociation" },
    logement: { indicePrix: 102, chantiers: 275, tauxEffort: 27.5, passoires: 14 },
    securite: { delinquance: 106, oqtf: 12, asile: 145, effectifs: 100 },
    collectivites: { autonomie: 52, dette: 235, tension: 55 },
    agriculture: { revenu: 94, colere: 62, pesticides: 100 },
    defense: { effectifs: 100, ciblePIB: 2 },
    environnement: { emissions: 385, cible2030: 270, artificialisation: 21000 }
  },
  catalogue: [
    { cle: "hopital", label: "Santé — hôpital et déserts", options: [
      { id: "statuquo", label: "Statu quo ONDAM" },
      { id: "plan", label: "Plan hôpital et installations en zone sous-dense", resume: "Environ +3 % de la mission santé. Baisse de la tension hospitalière et des déserts, coût immédiat.", depAdd: { sante: 3 }, secteur: { sante: { tensionHopital: -8, desertsPct: -0.8 } }, popularite: 1.4, greve: -4 },
      { id: "coupe", label: "Freiner l'ONDAM", resume: "Économie budgétaire, tension et préavis de grève des urgences.", depAdd: { sante: -3 }, secteur: { sante: { tensionHopital: 8 } }, popularite: -2, greve: 14 }
    ]},
    { cle: "education", label: "Éducation", options: [
      { id: "statuquo", label: "Statu quo" },
      { id: "postes", label: "Postes et revalorisation enseignants", resume: "Mission éducation +2 %. Décrochage et tension de recrutement reculent lentement.", depAdd: { education: 2 }, secteur: { education: { decrochage: -0.3, tensionRecrutement: -6, pisa: 0.4 } }, popularite: 0.6 },
      { id: "coupe", label: "Rendre des postes", resume: "Économie de court terme, tension de recrutement et décrochage en hausse.", depAdd: { education: -2 }, secteur: { education: { decrochage: 0.3, tensionRecrutement: 6, pisa: -0.3 } }, popularite: -1, greve: 8 }
    ]},
    { cle: "epr2", label: "Énergie — EPR2 et EDF", options: [
      { id: "statuquo", label: "Poursuivre au rythme actuel" },
      { id: "lancer", label: "Lancer une paire d'EPR2 supplémentaire", resume: "Coût budgétaire étalé, dette d'EDF et avancement du programme en hausse. Effet prix de l'électricité à long terme seulement.", depMd: { energie: 1.8 }, secteur: { energie: { epr2Lances: 1, epr2Avancement: 6, edfDette: 4, prixMWh: -1 } }, file: { reste: 8, inf: -0.02 } },
      { id: "pause", label: "Mettre le programme en pause", resume: "Économie immédiate, retard industriel, moindre visibilité pour la filière.", depMd: { energie: -0.8 }, secteur: { energie: { epr2Avancement: -5, prixMWh: 2 } } }
    ]},
    { cle: "enr", label: "Énergie — renouvelables et facture", options: [
      { id: "statuquo", label: "Trajectoire inchangée" },
      { id: "accelerer", label: "Accélérer solaire et éolien", resume: "Soutien budgétaire, part renouvelable en hausse, prix de gros un peu plus bas après délai.", depMd: { energie: 1.2 }, secteur: { energie: { partENR: 1.4, prixMWh: -2 } } },
      { id: "bouclier", label: "Réactiver un bouclier tarifaire", resume: "Environ 8 Md€/an. Soulage l'inflation et les ménages, creuse le déficit.", depMd: { energie: 8 }, inflation: -0.35, popularite: 2, special: "bouclier_on" },
      { id: "lever", label: "Lever le bouclier tarifaire", resume: "Les factures remontent, le solde public se redresse.", depMd: { energie: -8 }, inflation: 0.25, popularite: -1.5, special: "bouclier_off" }
    ]},
    { cle: "mercosur", label: "Commerce — Mercosur", options: [
      { id: "statuquo", label: "Laisser la négociation ouverte" },
      { id: "ratifier", label: "Ratifier l'accord", resume: "Gain d'exportations industrielles estimé, colère agricole, ligne rouge à gauche et au RN.", set: { commerce: { mercosur: "signe" } }, secteur: { agriculture: { colere: 14, revenu: -3 } }, file: { reste: 4, g: 0.03 }, popularite: -1.5 },
      { id: "rejeter", label: "Refuser la ratification", resume: "Apaisement agricole, signal protectionniste, tension avec une partie des partenaires européens.", set: { commerce: { mercosur: "rejete" } }, secteur: { agriculture: { colere: -10 } }, popularite: 0.8 }
    ]},
    { cle: "commerce", label: "Commerce — droits de douane américains", options: [
      { id: "statuquo", label: "Ne pas répliquer" },
      { id: "negocier", label: "Mandat de négociation ciblée (vins, aéronautique)", resume: "Peut desserrer les tarifs si les marchés jugent l'Europe unie. Effet incertain : le modèle retient un desserrement partiel.", secteur: { commerce: { tarifUS: -4, balanceBiens: 3 } }, popularite: 0.4 },
      { id: "riposte", label: "Riposte tarifaire", resume: "Réduit un peu le déficit commercial vis-à-vis des produits visés, risque d'escalade et d'inflation importée.", secteur: { commerce: { tarifUS: 3, balanceBiens: 1 } }, inflation: 0.15, file: { reste: 3, g: -0.04 } }
    ]},
    { cle: "immigration", label: "Immigration", options: [
      { id: "statuquo", label: "Statu quo législatif" },
      { id: "ferme", label: "Durcir (rétention, exécution des OQTF, quotas)", resume: "Texte surtout normatif. Remonte les OQTF exécutées dans le modèle, tend le débat public.", depMd: { securite: 0.3 }, secteur: { securite: { oqtf: 4, asile: -6 } }, popularite: 0.4 },
      { id: "regularisation", label: "Régularisation ciblée des métiers en tension", resume: "Effet positif estimé sur l'hôpital, l'agriculture et le potentiel, ligne rouge RN et UDR.", secteur: { sante: { desertsPct: -0.4 }, agriculture: { colere: -4 } }, file: { reste: 4, g: 0.02 } }
    ]},
    { cle: "securite", label: "Sécurité", options: [
      { id: "statuquo", label: "Statu quo" },
      { id: "lopmi", label: "Effort LOPMI (effectifs, justice)", resume: "Mission sécurité +4 %. Indice de délinquance en baisse lente, coût immédiat.", depAdd: { securite: 4 }, secteur: { securite: { effectifs: 3, delinquance: -2 } }, popularite: 0.7 },
      { id: "coupe", label: "Réduire les crédits", resume: "Économie budgétaire, indice de délinquance orienté à la hausse.", depAdd: { securite: -3 }, secteur: { securite: { effectifs: -2, delinquance: 2 } }, popularite: -1 }
    ]},
    { cle: "logement", label: "Logement", options: [
      { id: "statuquo", label: "Statu quo" },
      { id: "construire", label: "Relancer la construction et le PTZ", resume: "Mission logement +8 %. Mises en chantier en hausse, prix un peu moins tendus après délai.", depAdd: { logement: 8 }, secteur: { logement: { chantiers: 25, tauxEffort: -0.4, passoires: -0.6 } }, file: { reste: 4, g: 0.02 } },
      { id: "encadrer", label: "Encadrer les loyers", resume: "Soulage le taux d'effort à court terme, freine une partie de l'offre.", secteur: { logement: { tauxEffort: -0.8, chantiers: -8 } }, popularite: 0.5 }
    ]},
    { cle: "agriculture", label: "Agriculture", options: [
      { id: "statuquo", label: "Statu quo" },
      { id: "aides", label: "Plan de trésorerie et prix plancher", resume: "Apaisement des blocages, coût budgétaire, peu d'effet sur le solde extérieur.", depAdd: { agriculture: 8 }, secteur: { agriculture: { colere: -12, revenu: 6 } }, popularite: 0.6 },
      { id: "normes_bas", label: "Relâcher une partie des normes", resume: "Demandé par une partie de la profession, ligne rouge écologiste.", secteur: { agriculture: { colere: -8, pesticides: 8 } }, popularite: 0.2 }
    ]},
    { cle: "defense", label: "Défense — trajectoire LPM", options: [
      { id: "statuquo", label: "Tenir la trajectoire actuelle" },
      { id: "lpm", label: "Accélérer vers 2 % du PIB", resume: "Marche budgétaire supplémentaire. La clause de flexibilité européenne peut être demandée à part.", depAdd: { defense: 6 }, secteur: { defense: { effectifs: 1 } }, popularite: 0.3 },
      { id: "pause", label: "Lisser la montée en charge", resume: "Moindre dépense, écart à l'objectif OTAN plus durable.", depAdd: { defense: -3 }, popularite: -0.4 }
    ]},
    { cle: "collectivites", label: "Collectivités", options: [
      { id: "statuquo", label: "Statu quo des dotations" },
      { id: "dgf", label: "Relever la DGF", resume: "Apaisement des maires, coût pour l'État, peu d'effet sur le déficit public consolidé (transferts internes) — le modèle retient un coût net partiel.", depAdd: { collectivites: 3 }, secteur: { collectivites: { tension: -8, autonomie: 1 } } },
      { id: "contrat", label: "Remettre une contractualisation type Cahors", resume: "Freine la dépense locale dans le modèle, tension avec les associations d'élus.", secteur: { collectivites: { tension: 10, dette: -4 } }, popularite: -0.4 }
    ]},
    { cle: "climat", label: "Environnement et climat", options: [
      { id: "statuquo", label: "Trajectoire SNBC inchangée" },
      { id: "accelerer", label: "Accélérer rénovation et décarbonation", resume: "Dépense et normes. Émissions en baisse plus nette, prix de certains biens en légère hausse.", depAdd: { environnement: 10, logement: 2 }, secteur: { environnement: { emissions: -8, artificialisation: -800 } }, inflation: 0.08 },
      { id: "pause", label: "Pause normative", resume: "Soulagement affiché de certains secteurs, écart à la cible 2030 qui se creuse.", secteur: { environnement: { emissions: 4 } }, popularite: -0.3 }
    ]},
    { cle: "europe", label: "Position européenne", options: [
      { id: "statuquo", label: "Tenir le semestre européen sans demande nouvelle" },
      { id: "souplesse", label: "Demander une flexibilité (défense, clause nationale)", resume: "La Commission arbitre selon la crédibilité de la trajectoire. Succès incertain, résolu au moment du vote.", special: "flex_ue" },
      { id: "federal", label: "Proposer un saut fédéral budgétaire", resume: "Ligne rouge du RN. Effet surtout politique dans ce modèle.", popularite: -0.8 }
    ]}
  ],
  referendums: [
    { id: "proportionnelle", label: "Proportionnelle aux législatives (art. 11, organisation des pouvoirs publics)", note: "Entre dans le champ le plus classique de l'article 11." },
    { id: "retraites", label: "Question sociale sur les retraites", note: "Le recours à l'article 11 sur un régime de retraites est politiquement explosif et juridiquement discuté : le Conseil constitutionnel peut être saisi." },
    { id: "immigration", label: "Question sur l'immigration", note: "Un référendum sur l'immigration soulève un débat constitutionnel (révision de la Constitution plutôt que article 11). Le jeu peut le censurer." }
  ],
  agences: [
    { id: "sp", nom: "S&P Global Ratings", trimestres: [2, 4] },
    { id: "mo", nom: "Moody's", trimestres: [1, 4] },
    { id: "fi", nom: "Fitch Ratings", trimestres: [2, 3] }
  ],
  agenda: [
    { id: "hiver_hopital", trimestres: [1], titre: "Hiver hospitalier : les urgences saturent dans plusieurs CHU. Les soignants rappellent l'écart entre l'ONDAM voté et l'activité réelle.", ton: "", effets: { secteur: { sante: { tensionHopital: 3 } } },
      reactions: [
        { qui: "Collectifs d'urgences", texte: "« On trie déjà. L'ONDAM ne finance pas l'hiver réel. »" },
        { qui: "Fédérations hospitalières", texte: "« Sans recrutement durable, chaque plan d'urgence reste un sparadrap. »" }
      ]},
    { id: "semestre", trimestres: [2], titre: "Semestre européen : la Commission évalue la trajectoire française au regard du plafond de 3 % et de l'ajustement demandé.", ton: "", special: "semestre",
      reactions: [
        { qui: "Commission européenne", texte: "« La procédure de déficit excessif reste ouverte tant que la trajectoire n'est pas crédible. »" },
        { qui: "Eurogroupe", texte: "« La défense peut justifier une flexibilité, pas l'absence de choix. »" }
      ]},
    { id: "rentree", trimestres: [3], titre: "Rentrée scolaire : le ministère publie les taux d'encadrement et les postes non pourvus.", ton: "", effets: { secteur: { education: { tensionRecrutement: 1 } } },
      reactions: [
        { qui: "Syndicats enseignants", texte: "« La rentrée se fait encore avec des contractuels précaires dans trop d'académies. »" },
        { qui: "Associations de parents", texte: "« Le décrochage ne se résume pas à un slogan budgétaire. »" }
      ]},
    { id: "agricole", trimestres: [4], titre: "Congrès agricole et barrages ponctuels : revenus, normes et traités commerciaux reviennent dans la rue.", ton: "neg", effets: { secteur: { agriculture: { colere: 4 } }, tension: 3 },
      reactions: [
        { qui: "FNSEA", texte: "« Sans prix, les discours sur la souveraineté alimentaire sont vides. »" },
        { qui: "Confédération paysanne", texte: "« Le Mercosur et les pesticides ne sont pas un détail technique. »" }
      ]},
    { id: "otan", trimestres: [2], anneesModulo: 2, titre: "Sommet de l'OTAN : la pression pour tenir 2 % du PIB en défense se rappelle à Paris.", ton: "", effets: { salience: { securite: 4 } },
      reactions: [
        { qui: "Alliés", texte: "« La loi de programmation se juge à l'exécution, pas à l'annonce. »" },
        { qui: "Cour des comptes", texte: "« Chaque marche de la LPM doit dire quelle dépense elle remplace. »" }
      ]}
  ],
  evenements: [
    { id: "brent", p: 0.07, titre: "Choc pétrolier : le Brent bondit d'environ 25 % après une escalade au Moyen-Orient. Les carburants suivront avec un à deux trimestres de décalage.", ton: "neg", effets: { inflation: 0.45, confiance: -3, file: { reste: 3, g: -0.06 } },
      reactions: [
        { qui: "Medef", texte: "« Les coûts énergétiques compriment les marges industrielles exposées. »" },
        { qui: "CFDT", texte: "« Le salaire réel ne peut pas être la seule variable d'ajustement. »" },
        { qui: "BCE", texte: "« Un choc d'offre ne se traite pas seulement par les taux, mais il complique la désinflation. »" }
      ]},
    { id: "brent_bas", p: 0.05, titre: "Détente sur le Brent : les prix des carburants reflueront partiellement au trimestre suivant.", ton: "pos", effets: { inflation: -0.25, confiance: 2 },
      reactions: [
        { qui: "Ménages", texte: "« La baisse à la pompe se voit, elle ne compense pas deux ans d'inflation accumulée. »" },
        { qui: "Transporteurs", texte: "« On reconstitue un peu de marge, sans baisser les tarifs tout de suite. »" }
      ]},
    { id: "airbus", p: 0.06, titre: "Carnet aéronautique : Airbus annonce un trimestre de livraisons au-dessus du plan. L'industrie du Sud-Ouest tire l'export.", ton: "pos", effets: { file: { reste: 3, g: 0.05 }, secteur: { commerce: { balanceBiens: 4 } } },
      reactions: [
        { qui: "Direction générale des entreprises", texte: "« La filière tient. Elle reste sensible aux droits de douane et aux chaînes d'approvisionnement. »" },
        { qui: "Syndicats de l'aéronautique", texte: "« Les cadences remontent : la question est de savoir qui embauche en CDI. »" }
      ]},
    { id: "tarif_us", p: 0.07, titre: "Washington relève des droits sur les vins, spiritueux et une partie de l'aéronautique européenne. La balance commerciale encaisse.", ton: "neg", effets: { secteur: { commerce: { tarifUS: 5, balanceBiens: -5 } }, file: { reste: 4, g: -0.04 } },
      reactions: [
        { qui: "FEVS", texte: "« Les caves ne sont pas une variable de négociation abstraite. »" },
        { qui: "Commission européenne", texte: "« La réponse sera européenne, ou elle sera inefficace. »" },
        { qui: "Régions viticoles", texte: "« Les trésoreries sont déjà justes après deux récoltes difficiles. »" }
      ]},
    { id: "mercosur_rue", p: 0.06, titre: "Coordonnés par plusieurs syndicats agricoles, des barrages filtrent les axes contre toute ratification du Mercosur.", ton: "neg", effets: { secteur: { agriculture: { colere: 8 } }, tension: 5, popularite: -1 },
      reactions: [
        { qui: "FNSEA", texte: "« Pas de ratification sans clauses miroirs qui tiennent devant un juge. »" },
        { qui: "Écologistes", texte: "« Importer la déforestation, c'est exporter notre propre norme. »" },
        { qui: "Medef", texte: "« L'industrie a aussi des marchés à ouvrir. Le débat ne peut pas ignorer l'export. »" }
      ]},
    { id: "canicule", p: 0.06, titre: "Canicule et étiage : le parc nucléaire module à la baisse, le prix de gros de l'électricité se tend.", ton: "neg", effets: { inflation: 0.15, secteur: { energie: { prixMWh: 8, nucleaireTWh: -6 } } },
      reactions: [
        { qui: "EDF", texte: "« Les contraintes environnementales de température sont tenues. La disponibilité d'hiver reste le vrai sujet. »" },
        { qui: "RTE", texte: "« Le système passe, avec des marges plus fines qu'annoncé. »" }
      ]},
    { id: "hiver_nucleaire", p: 0.05, titre: "Hiver doux et bonne disponibilité du parc : la production nucléaire dépasse le plan, les prix de gros se détendent.", ton: "pos", effets: { secteur: { energie: { nucleaireTWh: 8, prixMWh: -6 } }, inflation: -0.1 },
      reactions: [
        { qui: "EDF", texte: "« Le programme de réparations se voit enfin dans les mégawattheures. »" },
        { qui: "Consommateurs", texte: "« Le gros baisse. La facture régulée, elle, dépend encore du bouclier et du TURPE. »" }
      ]},
    { id: "hopital_epi", p: 0.06, titre: "Épidémie hivernale sévère : les lits d'aval manquent, l'ONDAM exécuté dérive.", ton: "neg", effets: { depMd: { sante: 1.5 }, secteur: { sante: { tensionHopital: 6 } }, popularite: -1 },
      reactions: [
        { qui: "SAMU-Urgences de France", texte: "« On ouvre des lits de brancard. Ce n'est pas un plan. »" },
        { qui: "Assurance maladie", texte: "« La dérive est conjoncturelle, mais elle révèle un sous-jacent de personnel. »" }
      ]},
    { id: "ehpad", p: 0.04, titre: "Nouveau rapport sur les Ehpad : la qualité de prise en charge revient au centre du débat budgétaire.", ton: "neg", effets: { popularite: -1, tension: 3 },
      reactions: [
        { qui: "Associations de familles", texte: "« Le ratio d'encadrement n'est pas un indicateur parmi d'autres. »" },
        { qui: "Départements", texte: "« L'APA et le reste à charge finissent dans nos budgets. »" }
      ]},
    { id: "deserts", p: 0.05, titre: "Une étude territoriale montre que les délais pour un médecin traitant s'allongent encore hors des métropoles.", ton: "neg", effets: { secteur: { sante: { desertsPct: 0.4 } }, salience: { pouvoirAchat: 2 } },
      reactions: [
        { qui: "Ordre des médecins", texte: "« La coercition à l'installation ne crée pas des médecins formés. »" },
        { qui: "Association des maires ruraux", texte: "« Une maison de santé sans praticien, c'est un bâtiment. »" }
      ]},
    { id: "greve_urgences", p: 0.05, titre: "Préavis dans les urgences de plusieurs CHU après une nuit noire. Les syndicats demandent des lits et des ratios.", ton: "neg", effets: { greve: 8, tension: 4 },
      reactions: [
        { qui: "CGT Santé", texte: "« On ne tiendra pas l'été avec des primes ponctuelles. »" },
        { qui: "Fédération hospitalière", texte: "« Les plans se succèdent, les postes vacants aussi. »" }
      ]},
    { id: "enseignants", p: 0.05, titre: "Concours enseignants : les postes ouverts ne sont pas tous pourvus dans plusieurs disciplines.", ton: "neg", effets: { secteur: { education: { tensionRecrutement: 5 } }, greve: 4 },
      reactions: [
        { qui: "SNES-FSU", texte: "« Le métier ne se revalorise pas par une campagne de communication. »" },
        { qui: "Recteurs", texte: "« On couvre avec des contractuels. La continuité est assurée, pas la même expérience partout. »" }
      ]},
    { id: "lyceens", p: 0.04, titre: "Mobilisation lycéenne après une réforme des programmes et des moyens d'accompagnement.", ton: "neg", effets: { tension: 3, popularite: -0.5 },
      reactions: [
        { qui: "Syndicats lycéens", texte: "« Les groupes de besoin sans postes, ce sont des heures en moins. »" },
        { qui: "Ministère", texte: "« Le cadre national reste tenu. Les rectorats ajustent. »" }
      ]},
    { id: "bce_hawk", p: 0.06, titre: "La BCE durcit le ton : l'inflation de la zone euro ne revient pas assez vite vers 2 %. Les marchés anticipent des taux plus hauts plus longtemps.", ton: "neg", effets: { bce: 0.25, confiance: -2 },
      reactions: [
        { qui: "BCE", texte: "« Nous ne commentons pas la politique budgétaire d'un État membre. Les taux dépendent de l'inflation agrégée. »" },
        { qui: "Banque de France", texte: "« Le canal du crédit immobilier et de l'investissement est le premier touché. »" }
      ]},
    { id: "bce_dove", p: 0.05, titre: "La BCE laisse entendre une détente prudente. Le Bund se détend un peu, l'OAT suit avec retard.", ton: "pos", effets: { bce: -0.15, confiance: 2 },
      reactions: [
        { qui: "BCE", texte: "« Toute baisse sera dépendante des données, pas d'un calendrier. »" },
        { qui: "Assureurs", texte: "« Le répit sur les taux longs est utile. Il ne règle pas la trajectoire française. »" }
      ]},
    { id: "spread", p: 0.05, titre: "Séance tendue sur la dette : le spread OAT-Bund s'écarte sans fait nouveau, sur un doute de liquidité et de politique intérieure.", ton: "neg", effets: { confiance: -5 },
      reactions: [
        { qui: "Agence France Trésor", texte: "« Les adjudications sont couvertes. Le taux, lui, dit le prix de la durée. »" },
        { qui: "Gouverneur", texte: "« Il n'y a pas de crise de financement. Il y a un prix plus élevé de l'incertitude. »" }
      ]},
    { id: "choose", p: 0.05, titre: "Sommet Choose France : des annonces d'investissement étranger cumulées autour de 15 Md€ sur plusieurs années.", ton: "pos", effets: { file: { reste: 6, g: 0.025 }, popularite: 0.8, confiance: 2 },
      reactions: [
        { qui: "Business France", texte: "« Les décisions sont pluriannuelles. L'effet emploi n'est pas celui du communiqué. »" },
        { qui: "Collectivités d'accueil", texte: "« On veut les usines, pas seulement les photos. »" }
      ]},
    { id: "fuite_k", p: 0.04, titre: "Des gérants internationaux réduisent leur exposition à la dette française au profit du Bund et des bons néerlandais.", ton: "neg", effets: { confiance: -4, file: { reste: 2, g: -0.03 } },
      reactions: [
        { qui: "Gérants", texte: "« Ce n'est pas un jugement moral. C'est une limite de risque dans le mandat. »" },
        { qui: "Trésor", texte: "« La base domestique d'investisseurs reste large. Elle n'est pas infinie à n'importe quel prix. »" }
      ]},
    { id: "banque_eu", p: 0.04, titre: "Tension sur une banque régionale européenne : fuite vers la qualité, le Bund s'apprécie, les spreads souverains s'écartent.", ton: "neg", effets: { confiance: -6, file: { reste: 2, g: -0.06 } },
      reactions: [
        { qui: "BCE", texte: "« Les facilités de liquidité sont là. Ce n'est pas 2012, la vigilance reste entière. »" },
        { qui: "ACPR", texte: "« Les banques françaises sont exposées indirectement. Les coussins sont tenus. »" }
      ]},
    { id: "sncf", p: 0.05, titre: "Conflit à la SNCF sur l'organisation du travail et le pouvoir d'achat. Plusieurs jours de grève fragmentent le réseau.", ton: "neg", effets: { greve: 10, tension: 4, file: { reste: 1, g: -0.03 } },
      reactions: [
        { qui: "CGT Cheminots", texte: "« Le service public ne se négocie pas seulement dans un tableur. »" },
        { qui: "Usagers", texte: "« Trois jours de grève, ce sont des salaires perdus pour ceux qui n'ont pas le télétravail. »" }
      ]},
    { id: "raffineries", p: 0.04, titre: "Arrêt dans deux raffineries : les prix des carburants montent localement, les stocks stratégiques sont surveillés.", ton: "neg", effets: { inflation: 0.12, greve: 6 },
      reactions: [
        { qui: "FO Énergie", texte: "« Les marges de raffinage ne se voient pas dans les fiches de paie. »" },
        { qui: "Préfets", texte: "« Les réquisitions restent l'ultime recours, pas un mode de gestion. »" }
      ]},
    { id: "auto", p: 0.05, titre: "Plan social dans l'automobile : une usine d'assemblage annonce des suppressions de postes, sous l'effet de la concurrence et de la transition moteur.", ton: "neg", effets: { chomage: 0.08, tension: 4, popularite: -0.8 },
      reactions: [
        { qui: "Syndicats", texte: "« La transition sans commande publique ni formation, c'est un plan social étalé. »" },
        { qui: "Constructeur", texte: "« Les volumes électriques ne remplacent pas encore le thermique en Europe. »" }
      ]},
    { id: "batteries", p: 0.04, titre: "Une gigafactory confirme un palier de production. L'emploi industriel local se stabilise.", ton: "pos", effets: { file: { reste: 4, g: 0.02, chom: -0.02 } },
      reactions: [
        { qui: "Région", texte: "« Il faut le réseau électrique et le logement, pas seulement le ruban. »" },
        { qui: "Sous-traitants", texte: "« Les cadences sont là. Les marges restent étroites. »" }
      ]},
    { id: "attentat", p: 0.05, titre: "Un attentat est déjoué. Le débat public se reconcentre sur les effectifs, le renseignement et la justice.", ton: "", effets: { salience: { securite: 12, immigration: 6 }, popularite: 0.6 },
      reactions: [
        { qui: "Ministère de l'Intérieur", texte: "« Le renseignement a fonctionné. Ce n'est pas une raison de baisser la garde. »" },
        { qui: "Magistrats", texte: "« La réponse pénale se juge dans la durée, pas dans la conférence de presse. »" }
      ]},
    { id: "emeutes", p: 0.04, titre: "Plusieurs nuits de violences urbaines après un fait divers. Le débat oppose ordre public et politiques de quartier.", ton: "neg", effets: { salience: { securite: 8 }, tension: 6, popularite: -1 },
      reactions: [
        { qui: "Association des maires", texte: "« On nous demande le calme avec des effectifs de police nationale qui tournent. »" },
        { qui: "Associations", texte: "« L'ordre sans présence éducative et sans emploi ne tient pas six mois. »" }
      ]},
    { id: "naufrage", p: 0.05, titre: "Nouveau naufrage en Méditerranée. Le débat sur les voies légales, les OQTF et le droit d'asile se rallume.", ton: "neg", effets: { salience: { immigration: 10 }, tension: 3 },
      reactions: [
        { qui: "Associations de sauvetage", texte: "« La mer n'est pas une politique migratoire. »" },
        { qui: "Ministère de l'Intérieur", texte: "« Les filières se combattent. L'asile se traite dans des délais tenables. »" },
        { qui: "HCR", texte: "« La protection et le contrôle des frontières ne sont pas des synonymes. »" }
      ]},
    { id: "oqtf", p: 0.04, titre: "La Cour des comptes pointe un écart persistant entre obligations de quitter le territoire et exécutions effectives.", ton: "", effets: { salience: { immigration: 5 } },
      reactions: [
        { qui: "Cour des comptes", texte: "« Sans laissez-passer consulaires, l'affichage d'objectifs ne crée pas des éloignements. »" },
        { qui: "Préfets", texte: "« Les places en rétention et les accords de réadmission sont le vrai goulet. »" }
      ]},
    { id: "ministre", p: 0.05, titre: "Un ministre est mis en examen dans une affaire distincte de la politique économique et présente sa démission.", ton: "neg", effets: { popularite: -2.5, confianceInstit: -4 },
      reactions: [
        { qui: "Élysée", texte: "« La présomption d'innocence vaut. La continuité du gouvernement aussi. »" },
        { qui: "Opposition", texte: "« L'éthique publique ne se délègue pas à une citation à comparaître. »" }
      ]},
    { id: "corruption_locale", p: 0.04, titre: "Affaire de marchés publics dans une métropole. La confiance dans les élus locaux se tasse.", ton: "neg", effets: { secteur: { collectivites: { tension: 4 } }, popularite: -0.6 },
      reactions: [
        { qui: "Association des maires de France", texte: "« Une affaire n'est pas le régime. Elle oblige à serrer les contrôles. »" },
        { qui: "Parquet national financier", texte: "« L'enquête suit son cours. Pas de commentaire. »" }
      ]},
    { id: "inondations", p: 0.05, titre: "Inondations sur plusieurs départements : dégâts assurés, infrastructures locales et terres agricoles touchés.", ton: "neg", effets: { depMd: { collectivites: 0.8, agriculture: 0.4 }, secteur: { agriculture: { revenu: -3 }, environnement: { artificialisation: 0 } }, popularite: -0.4 },
      reactions: [
        { qui: "Préfets", texte: "« L'état de catastrophe naturelle sera instruit commune par commune. »" },
        { qui: "Assureurs", texte: "« La sinistralité climatique se voit désormais dans les primes. »" },
        { qui: "Chambres d'agriculture", texte: "« Une récolte perdue ne se rattrape pas par un communiqué. »" }
      ]},
    { id: "recolte", p: 0.05, titre: "Récolte céréalière au-dessus de la moyenne quinquennale. Les trésoreries agricoles respirent un peu.", ton: "pos", effets: { secteur: { agriculture: { revenu: 5, colere: -4 }, commerce: { balanceBiens: 2 } } },
      reactions: [
        { qui: "Intercéréales", texte: "« Les volumes sont là. Les prix mondiaux décideront si c'est une bonne année. »" },
        { qui: "Éleveurs", texte: "« La grande culture ne résume pas le revenu agricole. »" }
      ]},
    { id: "secheresse_agri", p: 0.05, titre: "Sécheresse de printemps : fourrage et irrigation sous contrainte dans le Sud-Ouest et l'Ouest.", ton: "neg", effets: { secteur: { agriculture: { revenu: -4, colere: 5 } }, inflation: 0.08 },
      reactions: [
        { qui: "Chambres d'agriculture", texte: "« Les retenues d'eau sont devenues un conflit politique autant qu'un outil. »" },
        { qui: "Agences de l'eau", texte: "« Le partage de la ressource se règle l'hiver, pas en juillet. »" }
      ]},
    { id: "tourisme", p: 0.05, titre: "Saison touristique record dans plusieurs régions. La consommation des non-résidents soutient les services.", ton: "pos", effets: { file: { reste: 2, g: 0.03 }, secteur: { commerce: { balanceCourante: 2 } } },
      reactions: [
        { qui: "Professionnels", texte: "« La saison est pleine. Le logement des saisonniers, lui, ne l'est pas. »" },
        { qui: "INSEE", texte: "« C'est un soutien réel, concentré, qui ne remplace pas l'industrie. »" }
      ]},
    { id: "cyber", p: 0.04, titre: "Cyberattaque contre un groupement hospitalier : des activités non urgentes sont déprogrammées.", ton: "neg", effets: { secteur: { sante: { tensionHopital: 4 } }, depMd: { securite: 0.2 } },
      reactions: [
        { qui: "ANSSI", texte: "« Le rançongiciel vise les organisations qui ne peuvent pas s'arrêter. La sauvegarde hors ligne décide de la durée de crise. »" },
        { qui: "ARS", texte: "« Les patients sont réorientés. Le retour à la normale prendra des semaines. »" }
      ]},
    { id: "epr_chantier", p: 0.04, titre: "Aléa sur un chantier de réacteur : surcoût et retard annoncés par la filière. EDF provisionne.", ton: "neg", effets: { secteur: { energie: { edfDette: 3, epr2Avancement: -4 } }, confiance: -1 },
      reactions: [
        { qui: "EDF", texte: "« Le premier de série concentre les aléas. Le suivant doit coûter moins, sinon le programme ne tient pas. »" },
        { qui: "Cour des comptes", texte: "« Un programme de cette taille exige un chiffrage qui bouge moins que le discours. »" }
      ]},
    { id: "pollution", p: 0.04, titre: "Pollution industrielle dans un fleuve : arrêté préfectoral, pêche interdite, mise en cause d'un site classé.", ton: "neg", effets: { secteur: { environnement: { emissions: 0 } }, tension: 3, popularite: -0.5 },
      reactions: [
        { qui: "Préfet", texte: "« Les prélèvements sont quotidiens. Les responsabilités seront établies. »" },
        { qui: "Riverains", texte: "« On nous a dit que le site était aux normes. »" }
      ]},
    { id: "cjue", p: 0.04, titre: "Arrêt de la CJUE sur un contentieux environnemental : la France est enjointe d'accélérer sur la qualité de l'air dans deux agglomérations.", ton: "", effets: { secteur: { environnement: { emissions: -2 } } },
      reactions: [
        { qui: "Commission", texte: "« Le droit européen de l'air n'est pas une option budgétaire. »" },
        { qui: "Métropoles", texte: "« Les zones à faibles émissions sans alternative de transport créent un conflit social. »" }
      ]},
    { id: "maire", p: 0.05, titre: "Les associations d'élus menacent de boycotter une conférence territoriale si les dotations ne suivent pas l'inflation.", ton: "neg", effets: { secteur: { collectivites: { tension: 6 } } },
      reactions: [
        { qui: "AMF", texte: "« L'État ne peut pas transférer des normes et geler la compensation. »" },
        { qui: "Cour des comptes", texte: "« La dépense locale est aussi une dépense publique. Le consolidé ne ment pas. »" }
      ]},
    { id: "cfdt_accord", p: 0.04, titre: "La CFDT signe un accord salarial de branche dans plusieurs services, les autres syndicats réservent leur position.", ton: "pos", effets: { greve: -6, tension: -3, inflation: 0.05 },
      reactions: [
        { qui: "CFDT", texte: "« Un accord imparfait vaut mieux qu'un conflit qui use les bas salaires. »" },
        { qui: "CGT", texte: "« Signer en dessous de l'inflation cumulée, c'est acter une perte. »" },
        { qui: "Medef", texte: "« L'accord borne la conflictualité. Il pèse sur les coûts. »" }
      ]},
    { id: "chomage_partiel", p: 0.04, titre: "Montée du chômage partiel dans la chimie et le papier, exposés à l'énergie et à la demande allemande.", ton: "neg", effets: { chomage: 0.06, secteur: { commerce: { balanceBiens: -2 } } },
      reactions: [
        { qui: "DREETS", texte: "« Les dossiers d'activité partielle sont en hausse, pas encore au niveau de 2020. »" },
        { qui: "Industrie", texte: "« Quand l'Allemagne tousse, nos carnets d'approvisionnement se vident. »" }
      ]},
    { id: "logement_taux", p: 0.05, titre: "Le crédit immobilier reste cher : les mises en chantier fléchissent encore, les promoteurs gèlent des opérations.", ton: "neg", effets: { secteur: { logement: { chantiers: -12, indicePrix: -0.4 } }, file: { reste: 2, g: -0.02 } },
      reactions: [
        { qui: "Fédération des promoteurs", texte: "« Sans taux ou sans foncier, le PTZ ne suffit pas. »" },
        { qui: "Banque de France", texte: "« L'assouplissement viendra de l'inflation, pas d'une consigne administrative sur le crédit. »" }
      ]},
    { id: "dpe", p: 0.04, titre: "Le calendrier des passoires énergétiques se rappelle aux bailleurs. Une partie du parc locatif sort du marché.", ton: "", effets: { secteur: { logement: { passoires: -0.5, tauxEffort: 0.2 } }, tension: 2 },
      reactions: [
        { qui: "Associations de locataires", texte: "« Interdire la location sans reloger, c'est déplacer la pénurie. »" },
        { qui: "Bailleurs", texte: "« La rénovation coûte plus que le loyer encadré ne peut financer. »" }
      ]}
  ],
  sources: [
    { type: "parametre", l: "Croissance 2026 de 0,4 % et T3 2026 à −0,1 %", d: "Paramètres fournis pour la partie (novembre 2026). Ils ne sont pas présentés comme une publication vérifiée de l'INSEE. Le modèle les prend comme point de départ, puis fait évoluer une croissance trimestrielle." },
    { type: "parametre", l: "IPCH à 3,8 %", d: "Paramètre fourni pour la partie, pas une estimation officielle certifiée à cette date. L'inflation ensuite suit une règle simplifiée (inertie, écart à 2 %, choc de demande, TVA, énergie)." },
    { type: "parametre", l: "Chômage à 8,5 %", d: "Paramètre fourni (taux BIT de scénario). L'évolution utilise une loi d'Okun simplifiée et un effet du SMIC." },
    { type: "parametre", l: "Dette 119 % du PIB, soit 3 600 Md€", d: "Paramètre fourni. Le PIB de départ du modèle est déduit de ce ratio (3 600 / 1,19). La dette évolue ensuite avec le déficit trimestriel et le PIB nominal." },
    { type: "parametre", l: "Déficit public à 5,4 % du PIB", d: "Paramètre fourni. Les recettes et dépenses de départ, qui sont des ordres de grandeur, sont calées pour que le solde comptable initial tombe sur ce chiffre." },
    { type: "parametre", l: "OAT 10 ans à 4,76 %", d: "Paramètre fourni. Le Bund de départ (2,55 %) est une hypothèse de modèle, pas un paramètre utilisateur. Le spread évolue avec la dette, le déficit, la confiance, la tension politique et la note." },
    { type: "utilisateur", l: "Assemblée nationale : RN 121, EPR 90, LFI 70, PS 68, Droite républicaine 46, Écologistes 38, Démocrates 37, Horizons 35, LIOT 24, GDR 17, UDR 17, non-inscrits 11, 3 vacants", d: "Composition de départ fournie pour la partie (total 577). Le groupe GDR n'est pas le PCF : il réunit des députés communistes et apparentés. Le candidat communiste à la présidentielle est un fait distinct du groupe. Après une dissolution, les sièges viennent du modèle électoral, plus de ce décompte." },
    { type: "parametre", l: "SMIC 1 867,02 € brut mensuel depuis juin 2026", d: "Paramètre fourni, à confirmer. La revalorisation de janvier dans le jeu est une formule simplifiée (une part d'inflation et un gain de pouvoir d'achat), pas le calcul légal exhaustif du code du travail." },
    { type: "estimation", l: "Recettes et dépenses par mission", d: "Ordres de grandeur inspirés des comptes des administrations publiques et des lois de finances. Arrondis. La charge d'intérêts de départ (62 Md€) est très inférieure au taux de marché × stock : la durée de vie moyenne de la dette lisse la remontée des taux. Le modèle fait converger la charge vers le taux de marché × stock d'environ 2,5 % par trimestre." },
    { type: "estimation", l: "Note souveraine de départ A+, perspective stable", d: "Hypothèse de scénario, pas une notation constatée en novembre 2026. Le calendrier des revues (S&P, Moody's, Fitch) est pédagogique, il ne reproduit pas le calendrier réel des comités." },
    { type: "estimation", l: "Gini 0,297 et taux de pauvreté 14,4 %", d: "Ordres de grandeur historiques de l'INSEE (revenu disponible ; seuil à 60 % du niveau de vie médian). Ce ne sont pas des chiffres de novembre 2026. Ils évoluent dans le jeu avec le chômage, l'inflation, le SMIC, la TVA et les transferts." },
    { type: "estimation", l: "Retraites : âge 62 ans et 9 mois, 171 trimestres, ratio 1,7, solde −6,6 Md€, pension moyenne 1 600 €", d: "Cadrage de type COR pour le scénario (la réforme de 2023 est traitée comme suspendue). À confirmer si le droit positif a bougé. Le taux de cotisation de 28 % est un ordre de grandeur employeur + salarié, pas le barème réel par régime." },
    { type: "estimation", l: "Démographie du modèle retraites", d: "Population, fécondité, espérance de vie, solde migratoire, effectifs de cotisants et de retraités : ordres de grandeur, pas le bilan démographique de l'INSEE de l'année en cours." },
    { type: "estimation", l: "Sénat", d: "Répartition indicative calée à 348 sièges pour donner une navette crédible. Ce n'est pas l'effectif officiel à la date du scénario." },
    { type: "estimation", l: "Secteurs (ONDAM, déserts, éducation, EDF, EPR2, commerce, logement, sécurité, collectivités, agriculture, LPM, émissions)", d: "Niveaux de départ indicatifs pour que les curseurs aient un sens. Chaque écran les marque comme estimation ou comme sortie de modèle." },
    { type: "estimation", l: "Intentions de vote et popularité de départ", d: "Bases de scénario pour que la campagne existe. Ce ne sont pas des sondages publiés. Chaque trimestre, le modèle les déforme avec la conjoncture et les catégories (âge, revenu, CSP, territoire)." },
    { type: "modele", l: "Multiplicateurs et délais", d: "Un point d'estimation dans les fourchettes usuelles : transferts proches de 0,8–0,9 à court délai, TVA plus forte sur l'inflation, IS et investissement plus lents, éducation et santé avec un petit effet de potentiel. Ce n'est pas une maquette OFCE." },
    { type: "modele", l: "BCE", d: "Règle de Taylor simplifiée sur l'inflation française prise comme proxy de la zone euro, lissage vers le taux directeur. Le joueur ne fixe pas les taux. Le Bund suit le taux de dépôt." },
    { type: "modele", l: "Spread OAT-Bund", d: "Fonction de la dette au-dessus de 100 % du PIB, du déficit au-dessus de 3 %, de la confiance, de la tension sociale, de la cohabitation et de la note. Lissage trimestriel vers la cible." },
    { type: "modele", l: "Procédure parlementaire", d: "Négociation groupe par groupe (lignes rouges, concessions), majorité relative des suffrages exprimés, Sénat estimé, CMP, dernier mot simplifié de l'Assemblée sur les textes financiers, article 49.3 (illimité sur les lois de finances et de financement de la sécurité sociale, un autre texte par session), motion de censure à la majorité absolue de 289. Les 3 sièges vacants comptent dans les 577 pour le seuil de censure et ne votent pas. Le 49.3 ne saute pas le Sénat dans ce jeu : il emporte la lecture de l'Assemblée." },
    { type: "modele", l: "Dissolution", d: "Article 12 : le Président dissout, pas le Premier ministre (qui peut seulement demander). Délai d'un an après la dissolution précédente. La dissolution de 2024 est assez ancienne, en novembre 2026, pour que le délai soit écoulé au premier jour. Les législatives anticipées convertissent des intentions en sièges par une prime majoritaire et un front républicain : c'est une estimation, pas un découpage réel." },
    { type: "modele", l: "Référendum", d: "Simplification de l'article 11. Le jeu signale les cas juridiquement controversés (retraites, immigration) et peut les faire censurer." },
    { type: "modele", l: "Projection retraites à 25 ans", d: "Identité cotisations − prestations. Les effectifs vieillissent (les retraités croissent plus vite que les cotisants), l'âge et la durée ralentissent cette croissance, l'indexation fait évoluer la pension moyenne. Hypothèse d'inflation convergeant vers 2 %. Ce n'est pas la projection officielle du COR, qui repose sur une microsimulation et plusieurs scénarios de productivité." },
    { type: "modele", l: "Élections 2027 et 2032", d: "Premier tour normalisé à partir des bases et de la conjoncture, second tour par une matrice de reports et un front républicain. Abstention implicite. Suffrages exprimés renormalisés." },
    { type: "modele", l: "Rôle", d: "Le Président dissout, nomme le Premier ministre, peut saisir le référendum et garde un levier défense / Europe, y compris en cohabitation. Le Premier ministre porte les textes, engage le 49.3 et tombe avec la censure. La partie continue après 2027 jusqu'à l'élection de 2032, au pouvoir ou dans l'opposition." }
  ]
};
