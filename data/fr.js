// Données pays — ajouter un pays = ajouter un fichier data/xx.js qui définit COUNTRIES.xx
window.COUNTRIES = window.COUNTRIES || {};
COUNTRIES.fr = {
  nom: "France", debut: { annee: 2026, trimestre: 4 },
  eco: { pibMd: 3030, croissance: 0.4, croissanceT: -0.1, inflation: 3.8, chomage: 8.5, detteMd: 3600, dettePct: 119,
         deficitPct: 5.4, oat10: 4.76, bund10: 2.7, notation: "A+", popularite: 24, confianceMarches: 45, tensionSociale: 55 },
  // Recettes et dépenses (Md€/an, APU, ordres de grandeur PLF/INSEE)
  recettes: { IR: 95, TVA: 210, IS: 62, CSG: 145, cotisations: 420, autres: 606 },
  taux: { IR: 100, TVA: 20, IS: 25, CSG: 9.2 }, // IR = indice barème (100 = actuel)
  depenses: { retraites: 410, sante: 260, education: 175, defense: 55, energie: 25, emploi: 80, securite: 45, collectivites: 250, autres: 340, interets: 62 },
  retraites: { ageLegal: 62.75, ratioCotRet: 1.7, deficitMd: -6.6, pensionMoy: 1600 },
  smic: { brutMensuel: 1823 },
  politique: { assemblee: [ {p:"RN + alliés",s:140,c:"#1b2a6b"},{p:"Ensemble",s:160,c:"#f5b700"},{p:"LR",s:47,c:"#0066cc"},{p:"LFI",s:71,c:"#c0392b"},{p:"PS",s:66,c:"#e84393"},{p:"Écologistes",s:38,c:"#27ae60"},{p:"PCF/GDR",s:17,c:"#8b0000"},{p:"LIOT/divers",s:38,c:"#888"} ],
     soutienBase: 207, majoriteAbsolue: 289, ue: { plafondDeficit: 3, procedureDeficitExcessif: true } },
  candidats2027: [
    {n:"Jordan Bardell",p:"RN",base:33,c:"#1b2a6b"},{n:"Jean-Luc Mélencho",p:"LFI",base:13,c:"#c0392b"},
    {n:"Édouard Philipp",p:"Horizons",base:16,c:"#4fa3d1"},{n:"Gabriel Atta",p:"Renaissance",base:0,c:"#f5b700",joueur:true},
    {n:"Bruno Retaillea",p:"LR",base:9,c:"#0066cc"},{n:"Raphaël Glucksman",p:"PS-Place publique",base:12,c:"#e84393"},
    {n:"Marine Tondelie",p:"Écologistes",base:5,c:"#27ae60"},{n:"Éric Zemmou",p:"Reconquête",base:5,c:"#5b3a1a"},{n:"Fabien Rousse",p:"PCF",base:3,c:"#8b0000"}],
  noteCandidats: "Marine Le Pe (RN) est inéligible en 1re instance (mars 2025) ; le RN présente Jordan Bardell. Emmanuel Macro ne peut pas se représenter.",
  sources: [
   ["Croissance 2026 ~0,4 %, T3 2026 -0,1 %","INSEE, comptes trimestriels (premières estimations, oct. 2026) — chiffres fournis par l'utilisateur, nov. 2026"],
   ["Inflation IPCH 3,8 % (oct. 2026)","INSEE / Eurostat, estimation provisoire oct. 2026 (donnée utilisateur)"],
   ["Chômage 8,5 %","INSEE, taux de chômage BIT (donnée utilisateur, nov. 2026)"],
   ["Dette ~3 600 Md€ / ~119 % PIB","INSEE, dette de Maastricht (donnée utilisateur) ; réf. : 3 416 Md€ / 115,6 % fin T2 2025 (INSEE, sept. 2025)"],
   ["Déficit cible 5,4 % PIB","PLF / trajectoire gouvernementale (donnée utilisateur) ; 5,8 % en 2024 (INSEE, mars 2025)"],
   ["OAT 10 ans ~4,76 %","Banque de France / marchés (donnée utilisateur, nov. 2026)"],
   ["Recettes/dépenses par poste","Ordres de grandeur PLF 2026 & INSEE comptes des APU 2024 (dépenses publiques ~57 % PIB) — arrondis"],
   ["Retraites : âge 62 ans 9 mois, ratio 1,7, déficit ~6,6 Md€","COR, rapport annuel juin 2025 ; suspension de la réforme 2023 (LFSS 2026)"],
   ["SMIC 1 823 € brut","Décret de revalorisation au 1er janv. 2026 (ordre de grandeur, à vérifier)"],
   ["Assemblée nationale","Répartition approximative des groupes après législatives 2024 (assemblee-nationale.fr)"],
   ["Règle UE 3 %","Pacte de stabilité réformé (2024), procédure de déficit excessif ouverte contre la France (juil. 2024)"],
   ["Multiplicateurs budgétaires","Littérature OFCE / FMI / Banque de France : 0,5–1,2 selon instrument et cycle"]]
};
