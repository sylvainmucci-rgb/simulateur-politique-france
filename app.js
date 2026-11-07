"use strict";
/* Statecraft — pas de temps hebdomadaire, journal des conséquences.
   Le DOM n'est branché que dans le navigateur : node test/journal-headless.js rejoue le moteur. */
const isBrowser = typeof document !== "undefined";
const $ = s => (isBrowser ? document.querySelector(s) : null);
const f1 = x => (Math.round(x * 10) / 10).toLocaleString("fr-FR");
const f0 = x => Math.round(x).toLocaleString("fr-FR");
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const rnd = (a, b) => a + Math.random() * (b - a);
const esc = s => String(s ?? "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const KEY_FR = "simfr_save_v2";
const DEBUT = "2026-11-02";
const MISSIONS = { retraites: "Retraites", sante: "Santé", education: "Éducation", defense: "Défense", energie: "Énergie", emploi: "Emploi", securite: "Sécurité", collectivites: "Collectivités", autres: "Autres missions" };
const PHOTO_KEYS = ["inflation", "popularite", "chomage", "croissance", "deficitPct", "dettePct", "oat10", "tensionSociale", "confianceMarches"];
const NOMS = { inflation: "inflation", popularite: "popularité", chomage: "chômage", croissance: "croissance", deficitPct: "déficit", dettePct: "dette", oat10: "OAT", tensionSociale: "tension", confianceMarches: "confiance des marchés" };

function tablePays() { return typeof COUNTRIES !== "undefined" ? COUNTRIES : window.COUNTRIES; }
function idDemande() {
  try {
    const q = new URLSearchParams(location.search).get("pays");
    if (q) return q;
  } catch (e) {}
  return isBrowser ? null : "fr";
}
let D = tablePays()[idDemande() || "fr"] || tablePays().fr;
function cleSauvegarde() { return !D || D.id === "fr" || !D.id ? KEY_FR : "statecraft_" + D.id + "_v1"; }
function regles() { return (D && D.regles) || { seuilVote: 200, seuilCensure: 170, special: { type: "493", label: "Engager le 49.3" }, garde: "Conseil constitutionnel", rejet: "Le 49.3 reste possible." }; }
function monnaie() { return (D && D.monnaie) || { unite: "Md€", taux: "OAT 10 ans", tauxCourt: "OAT", banque: "BCE" }; }
function candidatsActifs() { return (D && (D.candidats || D.candidats2027)) || []; }
function dateElection() { return (D && D.election && D.election.date) || "2027-04-12"; }
function nomIndic(k) { if (k === "oat10") return monnaie().tauxCourt || monnaie().taux; return NOMS[k] || k; }

let S = null, view = "dash", timer = null;

function parseDate(iso) { const [y, m, d] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); }
function isoDate(d) { return d.toISOString().slice(0, 10); }
function addDays(iso, n) { const d = parseDate(iso); d.setUTCDate(d.getUTCDate() + n); return isoDate(d); }
function addMonths(iso, n) {
  const d = parseDate(iso); const jour = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + n);
  if (d.getUTCDate() < jour) d.setUTCDate(0);
  return isoDate(d);
}
function joursEntre(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000); }
function fmtDate(iso) { return parseDate(iso).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }); }
function fmtCourt(iso) { return parseDate(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }); }
const fage = a => `${Math.floor(a)} ans ${Math.round((a % 1) * 12)} mois`;
const totRec = () => Object.values(S.rec).reduce((a, b) => a + b, 0);
const totDep = () => Object.values(S.dep).reduce((a, b) => a + b, 0);

function photo() {
  const o = {};
  for (const k of PHOTO_KEYS) o[k] = S.e[k];
  return o;
}
function fmtDelta(k, v) {
  if (Math.abs(v) < 0.05) return "";
  const nom = nomIndic(k);
  return `${nom} ${v > 0 ? "+" : ""}${f1(v)} pt`;
}
function formaterLigne(cause, deltas, decisionDate) {
  const parts = [];
  for (const k of PHOTO_KEYS) if (deltas && deltas[k]) { const t = fmtDelta(k, deltas[k]); if (t) parts.push(t); }
  if (!parts.length) return "";
  const quand = decisionDate && decisionDate !== S.date ? ` — décision du ${fmtCourt(decisionDate)}` : "";
  return `${cause}${quand} → ${parts.join(", ")}`;
}
function ajouterDans(cible, src) {
  for (const k of Object.keys(src || {})) cible[k] = (cible[k] || 0) + src[k];
}
function majSolde() {
  const solde = totRec() - totDep();
  S.e.deficitPct = clamp(-solde / S.e.pibMd * 100, -4, 18);
}
function log(t, c, reactions) {
  S.news.unshift({ d: fmtCourt(S.date), t: String(t), c: c || "", reactions: reactions || [] });
  if (S.news.length > 200) S.news.length = 200;
}
function snap() {
  const h = S.hist, e = S.e;
  h.pib.push(e.croissance); h.chomage.push(e.chomage); h.inflation.push(e.inflation);
  h.dette.push(e.dettePct); h.oat.push(e.oat10); h.deficit.push(e.deficitPct); h.pop.push(e.popularite);
  for (const k of Object.keys(h)) if (h[k].length > 400) h[k] = h[k].slice(-400);
}
function syncCalendrier() {
  S.annee = +S.date.slice(0, 4);
  S.tri = Math.floor((+S.date.slice(5, 7) - 1) / 3) + 1;
}

function nouvelle() {
  S = {
    date: DEBUT, annee: D.debut.annee, tri: D.debut.trimestre, tour: 0,
    e: { ...D.eco }, taux: { ...D.taux }, dep: { ...D.depenses }, rec: { ...D.recettes },
    ret: { ...(D.retraites || { ageLegal: 64, ratioCotRet: 1.5, deficitMd: 0, pensionMoy: 0 }) }, smic: (D.smic && D.smic.brutMensuel) || 0,
    contraintes: D.contraintes ? JSON.parse(JSON.stringify(D.contraintes)) : null, texteHostile: null, paysId: D.id || "fr",
    effets: [], journal: [], news: [], recap: null,
    hist: { pib: [], chomage: [], inflation: [], dette: [], oat: [], deficit: [], pop: [] },
    n493: 0, greve: 0, soutien: D.politique.soutienBase, bce: 2.0,
    fini: false, elu: null, draft: null, flexUE: 0, bouclier: false,
    vitesse: 2, lecture: false, numDecision: 0
  };
  log(D.intro || "Vous prenez vos fonctions. Chaque décision laissera une ligne au journal, et chaque pas de temps un récapitulatif.", "neg");
  snap();
  if (isBrowser) { sauver(true); render(); }
  return S;
}

/* ---------- Décisions : effets immédiats et différés, rattachés à une cause ---------- */
function draftInit() {
  S.draft = {
    taux: { ...S.taux },
    dep: Object.fromEntries(Object.keys(S.dep).filter(k => k !== "interets").map(k => [k, 0])),
    age: S.ret.ageLegal, smic: 0, mode: "vote"
  };
}
function analyse(d) {
  const r = { dRec: 0, dDep: 0, soutienG: 0, soutienD: 0, cc: [], alertes: [], greve: 0, inflation: 0 };
  const t = d.taux;
  r.dRec += (t.IR - S.taux.IR) / 100 * S.rec.IR * 0.85;
  r.dRec += (t.TVA - S.taux.TVA) * 10.5 * 0.95;
  r.dRec += (t.IS - S.taux.IS) * 2.3 * 0.8;
  r.dRec += (t.CSG - S.taux.CSG) * 15.5;
  r.inflation += (t.TVA - S.taux.TVA) * 0.4 + d.smic * 0.05;
  r.soutienG += (t.IR - S.taux.IR) * 0.6 + (t.IS - S.taux.IS) * 3 - (t.TVA - S.taux.TVA) * 8 - (t.CSG - S.taux.CSG) * 5;
  r.soutienD -= (t.IR - S.taux.IR) * 0.8 + (t.IS - S.taux.IS) * 4 + (t.TVA - S.taux.TVA) * 6 + (t.CSG - S.taux.CSG) * 4;
  for (const k in d.dep) {
    const v = S.dep[k] * d.dep[k] / 100;
    r.dDep += v;
    r.soutienG += d.dep[k] * (k === "defense" || k === "securite" ? -0.3 : 1.2);
    r.soutienD += d.dep[k] * (k === "defense" || k === "securite" ? 1.2 : -0.4);
    if (d.dep[k] < -3 && (k === "sante" || k === "education")) r.greve += 8;
  }
  const da = d.age - S.ret.ageLegal;
  if (da) { r.dDep -= da * 32; r.soutienG -= da * 50; r.soutienD += da * 8; r.greve += Math.max(0, da) * 25; }
  r.dDep += d.smic * 0.9;
  r.soutienG += d.smic * 4; r.soutienD -= d.smic * 2;
  const pl = regles().plafonds || { IR: 150, TVA: 25, age: true };
  if (pl.IR && t.IR > pl.IR) r.cc.push(regles().texteIR || "Hausse du barème trop forte pour le contrôle constitutionnel du pays.");
  if (pl.TVA && t.TVA > pl.TVA) r.cc.push(regles().texteTVA || "Taux de taxe sur la consommation au-delà du plafond du modèle.");
  if (pl.age !== false && (d.age > 67 || d.age < 60)) r.cc.push("Âge légal hors de 60–67 ans : irréaliste dans ce modèle.");
  if (pl.age !== false && Math.abs(da) > 2) r.cc.push("Variation de l'âge supérieure à 2 ans d'un coup.");
  if (d.smic > 10) r.alertes.push("Coup de pouce salarial supérieur à 10 % : choc sur l'emploi peu qualifié.");
  for (const lr of regles().lignesRouges || []) {
    if (lr.dep && d.dep[lr.dep] < lr.min) r.cc.push(lr.label);
    if (lr.taux && (d.taux[lr.taux] - S.taux[lr.taux]) > lr.maxHausse) r.cc.push(lr.label);
  }
  const g = clamp(r.soutienG, -60, 60), dr = clamp(r.soutienD, -60, 60);
  r.voix = Math.round(clamp(S.soutien + (g > 0 ? g * 1.2 : g * 0.3) + (dr > 0 ? dr : dr * 0.5), 120, 420));
  r.solde = r.dRec - r.dDep;
  r.populariteTVA = -(t.TVA - S.taux.TVA) * 3;
  return r;
}
function appliquerEffet(e, deltas) {
  if (!e) return;
  const def0 = S.e.deficitPct;
  let budget = false;
  if (e.dRec) {
    budget = true;
    if (e.recKey && S.rec[e.recKey] != null) S.rec[e.recKey] += e.dRec;
    else { const t = totRec() || 1; for (const k in S.rec) S.rec[k] += e.dRec * S.rec[k] / t; }
  }
  if (e.depMission) {
    budget = true;
    for (const k in e.depMission) if (S.dep[k] != null) S.dep[k] += e.depMission[k];
  }
  if (budget) {
    majSolde();
    deltas.deficitPct = (deltas.deficitPct || 0) + (S.e.deficitPct - def0);
  }
  const map = { inflation: "inflation", popularite: "popularite", chomage: "chomage", croissance: "croissance", tensionSociale: "tensionSociale", confianceMarches: "confianceMarches" };
  for (const champ of Object.keys(map)) {
    if (!e[champ]) continue;
    const k = map[champ];
    if (k === "inflation") S.e.inflation = clamp(S.e.inflation + e[champ], -1, 15);
    else if (k === "popularite") S.e.popularite = clamp(S.e.popularite + e[champ], 5, 75);
    else if (k === "chomage") S.e.chomage = clamp(S.e.chomage + e[champ], 3, 20);
    else if (k === "croissance") S.e.croissance = clamp(S.e.croissance + e[champ], -6, 8);
    else if (k === "tensionSociale") S.e.tensionSociale = clamp(S.e.tensionSociale + e[champ], 0, 100);
    else if (k === "confianceMarches") S.e.confianceMarches = clamp(S.e.confianceMarches + e[champ], 0, 100);
    deltas[k] = (deltas[k] || 0) + e[champ];
  }
  if (e.greve) S.greve = clamp(S.greve + e.greve, 0, 100);
  if (e.bce) S.bce = clamp(S.bce + e.bce, 0, 5);
  if (e.soutien) S.soutien = Math.round(clamp(S.soutien + e.soutien, 80, 400));
}
function apercuDiffere(e) {
  const b = [];
  for (const k of ["inflation", "popularite", "chomage", "croissance", "tensionSociale", "confianceMarches"]) if (e[k]) { const t = fmtDelta(k, e[k]); if (t) b.push(t); }
  if (e.dRec) b.push(`recettes ${e.dRec > 0 ? "+" : ""}${f1(e.dRec)} Md€/an`);
  if (e.depMission) {
    const s = Object.entries(e.depMission).map(([k, v]) => `${MISSIONS[k] || k} ${v > 0 ? "+" : ""}${f1(v)} Md€`).join(", ");
    if (s) b.push(s);
  }
  return b.join(", ") || "effet budgétaire";
}
function appliquerClause(c) {
  S.numDecision = (S.numDecision || 0) + 1;
  const deltas = {};
  appliquerEffet(c.immediat, deltas);
  const prevus = [];
  for (const df of c.differe || []) {
    const echeance = addDays(S.date, df.semaines * 7);
    S.effets.push({ ...df, echeance, cause: c.cause, decisionDate: S.date, fait: false, important: !!c.importantDiffere, num: S.numDecision });
    prevus.push(`${fmtCourt(echeance)} → ${apercuDiffere(df)}`);
  }
  const texte = formaterLigne(c.cause, deltas) || `${c.cause} → pas d'effet immédiat sur les indicateurs`;
  S.journal.unshift({ date: S.date, texte, statut: "immédiat", prevus, decisionDate: S.date, num: S.numDecision });
  if (S.journal.length > 300) S.journal.length = 300;
  log(texte, (deltas.popularite || 0) < -0.05 ? "neg" : (deltas.popularite || 0) > 0.05 ? "pos" : "", c.reactions || []);
  if (prevus.length) log(`Effet différé programmé. ${c.cause} : ${prevus.join(" ; ")}.`, "");
  return { texte, prevus, deltas };
}
function clausesDuTexte(d) {
  const cs = [];
  const tva = d.taux.TVA - S.taux.TVA;
  if (Math.abs(tva) >= 0.05) {
    const mot = tva > 0 ? "Hausse de la TVA" : "Baisse de la TVA";
    cs.push({
      cause: `${mot} (${f1(S.taux.TVA)} % → ${f1(d.taux.TVA)} %)`,
      immediat: { popularite: -tva * 3, tensionSociale: tva * 2 },
      differe: [
        { semaines: 4, inflation: tva * 0.2, dRec: tva * 10.5 * 0.95 * 0.5, recKey: "TVA" },
        { semaines: 8, inflation: tva * 0.2, dRec: tva * 10.5 * 0.95 * 0.5, recKey: "TVA" }
      ],
      reactions: tva > 0 ? [
        { qui: "UFC-Que choisir", texte: "« Un point de TVA se voit dans le panier avant d'apparaître dans les salaires. »" },
        { qui: "Medef", texte: "« La TVA élargit l'assiette. Elle freine aussi la consommation, avec quelques semaines de décalage. »" }
      ] : [
        { qui: "Associations de consommateurs", texte: "« La baisse mettra un à deux mois à arriver sur les étiquettes. »" }
      ]
    });
  }
  const ir = d.taux.IR - S.taux.IR;
  if (Math.abs(ir) >= 1) {
    const dRec = ir / 100 * S.rec.IR * 0.85;
    cs.push({
      cause: `${ir > 0 ? "Barème de l'IR relevé" : "Barème de l'IR allégé"} (${S.taux.IR} → ${d.taux.IR})`,
      immediat: { popularite: -ir * 0.05, tensionSociale: ir * 0.03 },
      differe: [{ semaines: 8, dRec, recKey: "IR", croissance: -dRec / S.e.pibMd * 100 * 0.35 }],
      reactions: [{ qui: ir > 0 ? "Syndicats de cadres" : "Médian des contribuables", texte: ir > 0 ? "« Le prélèvement à la source bougera au prochain taux, pas demain matin. »" : "« L'allègement se verra sur la fiche de paie, pas sur le déficit du mois. »" }]
    });
  }
  const is = d.taux.IS - S.taux.IS;
  if (Math.abs(is) >= 0.05) {
    const dRec = is * 2.3 * 0.8;
    cs.push({
      cause: `${is > 0 ? "Hausse de l'impôt sur les sociétés" : "Baisse de l'impôt sur les sociétés"} (${f1(S.taux.IS)} % → ${f1(d.taux.IS)} %)`,
      immediat: { confianceMarches: -is * 0.4 },
      differe: [{ semaines: 12, dRec, recKey: "IS", croissance: -dRec / S.e.pibMd * 100 * 0.3 }],
      reactions: [{ qui: "Medef", texte: is > 0 ? "« L'investissement réagit avec un ou deux trimestres de retard. »" : "« Le signal est reçu. Les projets ne démarrent pas le jour du vote. »" }]
    });
  }
  const csg = d.taux.CSG - S.taux.CSG;
  if (Math.abs(csg) >= 0.05) {
    const dRec = csg * 15.5;
    cs.push({
      cause: `${csg > 0 ? "Hausse de la CSG" : "Baisse de la CSG"} (${f1(S.taux.CSG)} % → ${f1(d.taux.CSG)} %)`,
      immediat: { popularite: -csg * 2.5, tensionSociale: csg * 1.5 },
      differe: [{ semaines: 4, dRec, recKey: "CSG" }],
      reactions: [{ qui: "CFDT", texte: "« La CSG touche les salaires dès le bulletin suivant. Le pouvoir d'achat, lui, ne se reconstitue pas tout seul. »" }]
    });
  }
  for (const k in d.dep) {
    if (Math.abs(d.dep[k]) < 1) continue;
    const md = S.dep[k] * d.dep[k] / 100;
    const social = k === "sante" || k === "education";
    cs.push({
      cause: `${MISSIONS[k] || k} ${d.dep[k] > 0 ? "+" : ""}${d.dep[k]} %`,
      immediat: {
        popularite: d.dep[k] * (k === "defense" || k === "securite" ? 0.04 : 0.06),
        tensionSociale: d.dep[k] < -3 && social ? 4 : 0,
        greve: d.dep[k] < -3 && social ? 8 : 0
      },
      differe: [{ semaines: 6, depMission: { [k]: md }, croissance: md / S.e.pibMd * 100 * 0.5 }],
      reactions: [{ qui: social && d.dep[k] < 0 ? "Fédérations du secteur" : "Administration", texte: social && d.dep[k] < 0 ? "« La coupe se voit dans les services avant de se voir dans le déficit. »" : "« L'exécution budgétaire suit le vote de quelques semaines. »" }]
    });
  }
  const da = d.age - S.ret.ageLegal;
  if (Math.abs(da) >= 0.2) {
    cs.push({
      cause: `${da > 0 ? "Report de l'âge légal" : "Abaissement de l'âge légal"} (${fage(S.ret.ageLegal)} → ${fage(d.age)})`,
      immediat: { popularite: -da * 8, tensionSociale: Math.abs(da) * 6, greve: Math.max(0, da) * 20 },
      differe: [{ semaines: 13, depMission: { retraites: -da * 32 } }],
      importantDiffere: da >= 0.5,
      reactions: [
        { qui: "Intersyndicale", texte: da > 0 ? "« L'effet sur les départs est différé. La mobilisation, elle, commence tout de suite. »" : "« Revenir sur l'âge soulage l'opinion et pèse sur le solde, avec un temps de montée en charge. »" },
        { qui: "COR (lecture du modèle)", texte: "« Le stock de retraités ne change pas le jour du vote. Le flux de départs, si. »" }
      ]
    });
  }
  if (d.smic >= 0.5) {
    cs.push({
      cause: `Coup de pouce au SMIC +${f1(d.smic)} %`,
      immediat: { popularite: d.smic * 0.5 },
      differe: [{ semaines: 4, inflation: d.smic * 0.05, chomage: d.smic * 0.06 }],
      reactions: [
        { qui: "Salariés au SMIC", texte: "« La fiche de paie bouge tout de suite. L'emploi peu qualifié, on le verra au trimestre. »" },
        { qui: "U2P", texte: "« Les TPE ne répercutent pas un coup de pouce sans délai, ni sans prix. »" }
      ]
    });
  }
  return cs;
}
function poserRecapDecision(titre, resultats) {
  const lignes = resultats.filter(r => r.texte).map(r => ({ cause: r.texte, deltas: {}, dejaFormate: true, prevus: r.prevus }));
  S.recap = { du: S.date, au: S.date, pas: "décision", pause: null, titre, lignes, residual: {}, avant: photo(), apres: photo(), decision: true };
}
function voter() {
  if (!S.draft) draftInit();
  const d = S.draft, a = analyse(d);
  if (a.cc.length) {
    if (isBrowser) modal(regles().garde || "Contrôle", `<p>Le texte serait bloqué :</p><ul>${a.cc.map(x => `<li>${esc(x)}</li>`).join("")}</ul><p class=note>Modifiez les mesures. Rien n'est appliqué.</p>`);
    return { ok: false, cc: a.cc };
  }
  const R = regles();
  if (d.mode === "vote") {
    const seuil = R.seuilVote || 200;
    const ok = a.voix >= seuil;
    log(ok ? `Le texte est adopté (${a.voix} voix, seuil ${seuil}).` : `Rejet : ${a.voix} voix, seuil ${seuil}. ${R.rejet || "Aucun effet."}`, ok ? "pos" : "neg");
    if (!ok) { if (isBrowser) render(); return { ok: false }; }
  } else if (!resoudreSpecial(R.special || { type: "493" }, a)) return { ok: false };
  const cs = clausesDuTexte(d);
  const resultats = cs.map(appliquerClause);
  S.taux = { ...d.taux };
  S.ret.ageLegal = d.age;
  if (d.smic) S.smic *= 1 + d.smic / 100;
  if (!cs.length) {
    log("Texte adopté sans mesure chiffrée nouvelle. Le journal ne enregistre pas d'effet.", "");
    S.journal.unshift({ date: S.date, texte: "Texte sans mesure nouvelle → aucun effet sur les indicateurs", statut: "immédiat", prevus: [], decisionDate: S.date });
  }
  draftInit();
  poserRecapDecision(cs.length ? "Effets immédiats de la décision" : "Décision sans effet chiffré", resultats);
  if (isBrowser) render();
  return { ok: true, clauses: cs.length };
}
function resoudreSpecial(sp, a) {
  const type = sp.type || "493";
  if (type === "493") {
    S.n493++;
    const censure = a.voix < (regles().seuilCensure || 170) || (S.n493 > 3 && Math.random() < 0.3);
    log(`49.3 n°${S.n493}. Motion de censure déposée.`, "neg");
    if (censure) {
      const deltas = {};
      appliquerEffet({ popularite: -6, confianceMarches: -8, soutien: -10, tensionSociale: 6 }, deltas);
      const texte = formaterLigne("Motion de censure adoptée après le 49.3", deltas);
      S.journal.unshift({ date: S.date, texte, statut: "immédiat", prevus: [], decisionDate: S.date });
      log(texte, "neg", [{ qui: "Présidents de groupe", texte: "« La censure efface le texte. Elle n'efface pas la séquence politique. »" }]);
      S.recap = { du: S.date, au: S.date, pas: "censure", pause: "Le gouvernement est renversé", titre: "Censure", lignes: [{ dejaFormate: true, cause: texte, prevus: [] }], residual: {}, avant: photo(), apres: photo(), decision: true };
      if (isBrowser) render();
      return false;
    }
    appliquerClause({ cause: `49.3 n°${S.n493} (censure rejetée, le texte passe)`, immediat: { popularite: -3, tensionSociale: 5 }, reactions: [{ qui: "Opinion", texte: "« L'adoption sans vote se paie tout de suite en popularité. Les effets du texte, eux, suivent leur calendrier. »" }] });
    return true;
  }
  if (type === "reconciliation") {
    const ok = a.voix >= (sp.seuil || 210);
    log(ok ? `Réconciliation budgétaire adoptée (${a.voix} voix, majorité simple des deux chambres dans le modèle).` : `La réconciliation échoue (${a.voix} voix, seuil ${sp.seuil || 210}) : majorité trop étroite ou texte trop clivant.`, ok ? "pos" : "neg", [{ qui: "Sénat", texte: "« La clôture à 60 voix ne s'applique pas à ce véhicule budgétaire. Le veto présidentiel n'est pas en cause : c'est votre texte. »" }]);
    if (!ok) { if (isBrowser) render(); return false; }
    return true;
  }
  if (type === "veto") {
    if (!S.texteHostile) { log("Aucun texte du Congrès en attente. Le veto ne fait pas passer votre propre projet : il bloque celui des chambres.", "neg"); if (isBrowser) render(); return false; }
    const override = a.voix < (sp.overrideVoixBasses || 140);
    if (override) {
      appliquerEffet(S.texteHostile.effet || { popularite: -2 }, {});
      log(`Veto retoqué : les deux tiers outrepassent (${S.texteHostile.titre}).`, "neg");
      S.texteHostile = null;
      if (isBrowser) render();
      return false;
    }
    log(`Veto maintenu. ${S.texteHostile.titre} ne s'applique pas.`, "pos", [{ qui: "Présidence", texte: "« Le Congrès n'a pas les deux tiers. Le texte tombe. »" }]);
    S.texteHostile = null;
    if (isBrowser) render();
    return false;
  }
  if (type === "decret") {
    appliquerClause({ cause: sp.cause || "Décret présidentiel (la chambre enregistre)", immediat: { popularite: -1, confianceMarches: -3 }, reactions: [{ qui: "Observateurs", texte: "« Le décret passe. Le coût est extérieur : sanctions, change, confiance. »" }] });
    if (S.contraintes && S.contraintes.sanctions) S.contraintes.sanctions.niveau = clamp(S.contraintes.sanctions.niveau + 3, 0, 100);
    return true;
  }
  if (type === "mp") {
    log("Mesure provisoire en vigueur. Le Congrès peut la laisser expirer.", "neg", [{ qui: "Centrão", texte: "« Sans appointements à la coalition, la mesure ne vivra pas huit semaines. »" }]);
    S.effets.push({ echeance: addDays(S.date, 56), cause: "Échéance de la mesure provisoire", fait: false, important: true, mpVoix: a.voix, evenement: true });
    return true;
  }
  if (type === "gardiens") {
    const seuil = regles().seuilVote || 180;
    if (a.voix < seuil) { log(`Le Majles rejette le texte (${a.voix} voix, seuil ${seuil}).`, "neg"); if (isBrowser) render(); return false; }
    if (a.cc.length) { log("Le Conseil des gardiens filtre le texte.", "neg"); if (isBrowser) render(); return false; }
    const bloc = Math.random() < (sp.probaBloc || 0.35);
    if (bloc) {
      appliquerEffet({ popularite: -2, confianceMarches: -2 }, {});
      log("Le Conseil des gardiens ou le Guide bloque le texte après le vote du Majles.", "neg", [{ qui: "Conseil des gardiens", texte: "« Le texte contrevient au cadre fixé. »" }]);
      if (isBrowser) render();
      return false;
    }
    log("Le Majles a voté et le Conseil des gardiens laisse passer.", "pos");
    return true;
  }
  if (type === "parti") {
    log(sp.texte || "La direction du Parti tranche. L'assemblée plénière enregistre.", "");
    appliquerClause({ cause: "Décision du centre du Parti", immediat: { popularite: -0.5 }, reactions: [{ qui: "Assemblée nationale populaire", texte: "« Le vote est un enregistrement, pas un veto. »" }] });
    return true;
  }
  return false;
}
function deciderBouclier() {
  const on = !S.bouclier;
  S.bouclier = on;
  const r = appliquerClause({
    cause: on ? "Activation du bouclier tarifaire" : "Levée du bouclier tarifaire",
    immediat: { popularite: on ? 2 : -2, depMission: { energie: on ? 8 : -8 } },
    differe: [{ semaines: 4, inflation: on ? -0.4 : 0.25 }],
    reactions: [{ qui: on ? "Ménages" : "Cour des comptes", texte: on ? "« La facture baisse dans le mois. Le coût budgétaire est déjà là. »" : "« Lever le bouclier rend du déficit et rend aussi de l'inflation. »" }]
  });
  poserRecapDecision("Effets immédiats de la décision", [r]);
  if (isBrowser) render();
}
function deciderFlex() {
  if (S.flexUE) return { ok: false };
  S.flexUE = 1;
  const ok = Math.random() < 0.6;
  const r = appliquerClause({
    cause: ok ? "Flexibilité européenne accordée (défense)" : "Flexibilité européenne refusée",
    immediat: ok ? { confianceMarches: 3 } : { confianceMarches: -2, popularite: -1 },
    reactions: [{ qui: "Commission européenne", texte: ok ? "« La clause est ouverte. Elle ne couvre pas le déficit courant. »" : "« La trajectoire n'est pas jugée assez étayée. »" }]
  });
  log(ok ? "Bruxelles accorde la clause." : "Bruxelles refuse.", ok ? "pos" : "neg");
  poserRecapDecision("Effets immédiats de la décision", [r]);
  if (isBrowser) render();
  return { ok };
}

/* ---------- Temps : pas interne au plus d'une semaine ---------- */
const EVENTS = [
  { p: 0.10, important: true, cause: "Choc pétrolier", titre: "Choc pétrolier : le Brent bondit après une escalade au Moyen-Orient.", ton: "neg", immediat: { inflation: 0.45 }, differe: [{ semaines: 4, croissance: -0.15 }] },
  { p: 0.08, important: true, cause: "Perspective d'agence", titre: "Une agence place la dette française sous perspective négative.", ton: "neg", immediat: { confianceMarches: -6 } },
  { p: 0.08, important: true, cause: "Mouvement agricole", titre: "Blocages d'agriculteurs contre le Mercosur.", ton: "neg", immediat: { tensionSociale: 6, popularite: -2 } },
  { p: 0.07, important: false, cause: "Canicule et nucléaire", titre: "Canicule : le nucléaire module, l'électricité se tend.", ton: "neg", immediat: { inflation: 0.15 }, differe: [{ semaines: 2, depMission: { energie: 1.5 } }] },
  { p: 0.07, important: true, cause: "Droits de douane américains", titre: "Washington relève des droits sur les vins, spiritueux et une partie de l'aéronautique.", ton: "neg", differe: [{ semaines: 6, croissance: -0.12 }] },
  { p: 0.08, important: false, cause: "Exportations Airbus", titre: "Airbus livre au-dessus du plan. L'export soutient l'activité.", ton: "pos", differe: [{ semaines: 4, croissance: 0.12 }] },
  { p: 0.06, important: true, cause: "Hôpital saturé", titre: "Épidémie : les urgences saturent, l'ONDAM dérape.", ton: "neg", immediat: { popularite: -1 }, differe: [{ semaines: 2, depMission: { sante: 2 } }] },
  { p: 0.06, important: false, cause: "Ton de la BCE", titre: "La BCE durcit le ton face à l'inflation de la zone euro.", ton: "neg", immediat: { bce: 0.15 } },
  { p: 0.07, important: true, cause: "Menace sécuritaire", titre: "Un attentat est déjoué. La sécurité redevient centrale.", ton: "", immediat: { popularite: 1, tensionSociale: 3 } },
  { p: 0.05, important: true, cause: "Démission d'un ministre", titre: "Un ministre mis en examen démissionne.", ton: "neg", immediat: { popularite: -3 } },
  { p: 0.06, important: false, cause: "Choose France", titre: "Annonces d'investissements étrangers (Choose France).", ton: "pos", immediat: { popularite: 1 }, differe: [{ semaines: 8, croissance: 0.08 }] },
  { p: 0.05, important: true, cause: "Tension bancaire européenne", titre: "Tension sur une banque régionale européenne : fuite vers le Bund.", ton: "neg", immediat: { confianceMarches: -5 }, differe: [{ semaines: 4, croissance: -0.1 }] }
];
function programmerSuite(ev) {
  for (const df of ev.differe || []) {
    S.effets.push({ ...df, echeance: addDays(S.date, df.semaines * 7), cause: ev.cause, decisionDate: S.date, fait: false, important: false, evenement: true });
  }
}
function pasMacro(q) {
  const e = S.e;
  let g = 0.15 * q;
  S.bce = clamp(S.bce + (e.inflation - 2.5) * 0.08 * q, 0, 5);
  g -= (S.bce - 2) * 0.05 * q;
  g -= (e.oat10 - 3.5) * 0.04 * q;
  g -= S.greve * 0.002 * q;
  g += rnd(-0.15, 0.15) * q;
  e.croissanceT = g / Math.max(q, 0.01);
  e.croissance = clamp(e.croissance * (1 - 0.25 * q) + (g / Math.max(q, 0.01) * 4) * (0.25 * q), -6, 8);
  e.inflation = clamp(e.inflation + ((2 - e.inflation) * 0.06 + (g / Math.max(q, 0.01) - 0.25) * 0.12) * q + rnd(-0.08, 0.08) * q - (S.bouclier ? 0.08 * q : 0), -1, 15);
  const smicRef = (D.smic && D.smic.brutMensuel) || S.smic || 1;
  e.chomage = clamp(e.chomage + (-0.35 * ((g / Math.max(q, 0.01) * 4) - 1) / 4 + (S.smic / smicRef - 1) * 0.5 / 4) * q + rnd(-0.05, 0.05) * q, 3, 25);
  const gTrim = g / Math.max(q, 0.01);
  const nom = (gTrim * q + Math.max(-0.4, e.inflation) / 4 * q) / 100;
  e.pibMd = clamp(e.pibMd * (1 + nom), 1500, 8000);
  for (const k in S.rec) S.rec[k] = Math.max(0, S.rec[k] * (1 + nom * 1.05));
  for (const k in S.dep) if (k !== "interets") S.dep[k] = Math.max(0, S.dep[k] * (1 + Math.max(0, e.inflation) / 400 * 0.9 * q));
  if (S.ret.ageLegal < 62.75) S.dep.retraites += 0.5 * q;
  S.dep.emploi = Math.max(20, S.dep.emploi + (e.chomage - 8.5) * 0.3 * q);
  const spread = clamp(0.15 + 0.035 * (e.dettePct - 100) + 0.18 * (e.deficitPct - 3) + (60 - e.confianceMarches) * 0.015 + S.greve * 0.004, 0.2, 6);
  const oatCible = clamp(D.eco.bund10 + (S.bce - 2) * 0.6 + spread, 0.5, 12);
  e.oat10 = clamp(e.oat10 + (oatCible - e.oat10) * 0.35 * q, 0.3, 14);
  S.dep.interets = Math.max(0, S.dep.interets + (e.oat10 / 100 * e.detteMd - S.dep.interets) * 0.03 * q);
  majSolde();
  e.detteMd = clamp(e.detteMd + (-(totRec() - totDep())) / 4 * q, 0, 20000);
  e.dettePct = e.detteMd / e.pibMd * 100;
  e.confianceMarches = clamp(e.confianceMarches + ((e.deficitPct < 5 ? 1.5 : -1) + (e.dettePct > 125 ? -2 : 0)) * q, 0, 100);
  S.greve = clamp(S.greve * (1 - 0.4 * q), 0, 100);
  e.tensionSociale = clamp(e.tensionSociale * (1 - 0.1 * q) + (S.greve * 0.3 + Math.max(0, e.inflation - 2) * 2 + Math.max(0, e.chomage - 7) * 1.5) * q, 0, 100);
  e.popularite = clamp(e.popularite + ((1.2 * (gTrim - 0.2)) - (e.inflation - 2.5) * 0.5 - (e.chomage - 8.5) * 0.8 - (e.tensionSociale - 50) * 0.04) * q + rnd(-1.2, 1.2) * q, 5, 75);
  pasContraintes(q);
  const notes = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB"];
  let i = notes.indexOf(e.notation); if (i < 0) i = 4;
  if (e.dettePct > 124 && e.deficitPct > 5 && Math.random() < 0.35 * q && i < notes.length - 1) {
    i++; e.notation = notes[i]; e.confianceMarches = clamp(e.confianceMarches - 5, 0, 100);
    return { important: true, cause: "Dégradation de la note", titre: `Dégradation : la France passe à ${notes[i]}.`, ton: "neg", deltas: { confianceMarches: -5 } };
  }
  if (e.deficitPct < 3.5 && Math.random() < 0.2 * q && i > 0) {
    i--; e.notation = notes[i];
    return { important: true, cause: "Relèvement de la note", titre: `Relèvement de la note souveraine à ${notes[i]}.`, ton: "pos", deltas: {} };
  }
  return null;
}
function pasJours(n, sac) {
  const q = n / 91;
  const horizon = addDays(S.date, n);
  for (const e of S.effets) {
    if (e.fait || e.echeance > horizon) continue;
    e.fait = true;
    const deltas = {};
    if (e.mpVoix != null) {
      const tient = S.soutien >= ((regles().seuilVote || 200) - 30);
      if (!tient) appliquerEffet({ popularite: -2, croissance: -0.2 }, deltas);
      sac.push({ cause: tient ? "Le Congrès confirme la mesure provisoire" : "La mesure provisoire expire faute de coalition", decisionDate: e.decisionDate, statut: "échéance", deltas, important: true, texte: tient ? "La mesure provisoire est confirmée." : "La mesure provisoire tombe : la coalition ne tient pas." });
      continue;
    }
    appliquerEffet(e, deltas);
    sac.push({ cause: e.cause, decisionDate: e.decisionDate, statut: e.evenement ? "événement différé" : "différé", deltas, important: !!e.important, texte: e.cause });
  }
  if (S.texteHostile && S.texteHostile.echeance <= horizon) {
    const deltas = {};
    appliquerEffet(S.texteHostile.effet || {}, deltas);
    sac.push({ cause: S.texteHostile.titre, statut: "texte imposé", deltas, important: true, texte: `${S.texteHostile.titre} entre en vigueur : le veto n'a pas été opposé à temps.` });
    log(`${S.texteHostile.titre} entre en vigueur.`, "neg");
    S.texteHostile = null;
  }
  for (const ev of (D.evenements || EVENTS)) {
    if (S.silenceEvenements) break;
    if (Math.random() >= ev.p * (n / 7) / 13) continue;
    if (ev.poseHostile) {
      S.texteHostile = { titre: ev.titre, effet: ev.poseHostile.effet || ev.immediat || { popularite: -2 }, echeance: addDays(S.date, (ev.poseHostile.semaines || 2) * 7) };
      sac.push({ cause: ev.cause, statut: "événement", deltas: {}, important: true, texte: ev.titre + " Vous pouvez opposer le veto avant l'échéance, depuis Décisions." });
      log(ev.titre, "neg");
      continue;
    }
    const deltas = {};
    appliquerEffet(ev.immediat, deltas);
    programmerSuite(ev);
    sac.push({ cause: ev.cause, statut: "événement", deltas, important: !!ev.important, texte: ev.titre, ton: ev.ton });
    log(ev.titre, ev.ton || "");
  }
  const note = pasMacro(q);
  if (note) {
    sac.push({ cause: note.cause, statut: "événement", deltas: note.deltas || {}, important: true, texte: note.titre, ton: note.ton });
    log(note.titre, note.ton || "");
  }
  const moisAvant = S.date.slice(0, 7);
  S.date = horizon;
  syncCalendrier();
  if (moisAvant.slice(5) !== "04" && S.date.slice(5, 7) === "04" && S.e.deficitPct > 3) {
    const titre = `Semestre européen : déficit ${f1(S.e.deficitPct)} % , au-dessus du plafond de 3 %.`;
    sac.push({ cause: "Semestre européen", statut: "échéance", deltas: {}, important: true, texte: titre });
    log(titre, "neg");
  }
  if (!S.elu && S.date >= dateElection()) {
    election();
    sac.push({ cause: "Présidentielle 2027", statut: "échéance", deltas: {}, important: true, texte: `Présidentielle : ${S.elu.gagnant} est élu(e).` });
  }
  S.tour++;
  snap();
}
function libellePas(pas) {
  return { semaine: "1 semaine", mois: "1 mois", trimestre: "1 trimestre", an: "1 an" }[pas] || pas;
}
function cibleDe(pas) {
  if (pas === "semaine") return addDays(S.date, 7);
  if (pas === "mois") return addMonths(S.date, 1);
  if (pas === "trimestre") return addMonths(S.date, 3);
  return addMonths(S.date, 12);
}
function avancer(pas) {
  if (!S || S.fini) return { fini: true };
  const du = S.date;
  const but = cibleDe(pas);
  const avant = photo();
  const groupes = [];
  let pause = null;
  let guard = 0;
  while (S.date < but && !S.fini && guard++ < 400) {
    const n = Math.min(7, joursEntre(S.date, but));
    if (n <= 0) break;
    const sac = [];
    pasJours(n, sac);
    for (const L of sac) {
      let g = groupes.find(x => x.cause === L.cause && x.statut === L.statut);
      if (!g) { g = { cause: L.cause, statut: L.statut, deltas: {}, decisionDate: L.decisionDate, texte: L.texte, important: false }; groupes.push(g); }
      ajouterDans(g.deltas, L.deltas);
      if (L.texte) g.texte = L.texte;
      if (L.important) { g.important = true; pause = L.texte || L.cause; }
    }
    if (pause) break;
  }
  const apres = photo();
  const residual = {};
  for (const k of PHOTO_KEYS) {
    let somme = 0;
    for (const g of groupes) somme += g.deltas[k] || 0;
    residual[k] = (apres[k] - avant[k]) - somme;
  }
  const lignesJournal = [];
  for (const g of groupes) {
    const texte = formaterLigne(g.cause, g.deltas, g.decisionDate);
    if (texte) {
      S.journal.unshift({ date: S.date, texte, statut: g.statut, decisionDate: g.decisionDate });
      lignesJournal.push(texte);
    } else if (g.texte && g.important) {
      S.journal.unshift({ date: S.date, texte: g.texte, statut: g.statut, decisionDate: g.decisionDate });
      lignesJournal.push(g.texte);
    }
  }
  const resTxt = formaterLigne("Conjoncture (inertie, BCE, aléas)", residual);
  if (resTxt) { S.journal.unshift({ date: S.date, texte: resTxt, statut: "pas de temps" }); lignesJournal.push(resTxt); }
  if (S.journal.length > 300) S.journal.length = 300;
  S.recap = { du, au: S.date, pas: libellePas(pas), pause, titre: "Récapitulatif du pas de temps", groupes, residual, avant, apres, lignesJournal, decision: false };
  const entete = `Du ${fmtCourt(du)} au ${fmtCourt(S.date)} (${libellePas(pas)})${pause ? " — pause automatique" : ""}.`;
  log(`${entete} ${lignesJournal.slice(0, 4).join(" · ") || "Indicateurs presque stables."}`, pause ? "neg" : "");
  sauver(true);
  if (isBrowser) render();
  return S.recap;
}
function pasContraintes(q) {
  const c = S.contraintes;
  if (!c) return;
  if (c.sanctions) {
    S.e.croissance = clamp(S.e.croissance - c.sanctions.niveau * 0.004 * q, -6, 8);
    S.e.confianceMarches = clamp(S.e.confianceMarches - c.sanctions.niveau * 0.01 * q, 0, 100);
  }
  if (c.petrole) {
    c.petrole.prix = clamp(c.petrole.prix + rnd(-2, 2) * q * 8, 25, 140);
    const ecart = c.petrole.prix - c.petrole.hypothese;
    if (c.petrole.exportateur) {
      S.rec.autres += ecart * (c.petrole.sensibilite || 0.2) * q;
      S.e.croissance = clamp(S.e.croissance + ecart * 0.01 * q, -6, 8);
    } else S.e.inflation = clamp(S.e.inflation + Math.max(0, ecart) * 0.015 * q, -1, 80);
  }
  if (c.change) {
    c.change.indice = clamp(c.change.indice * (1 + rnd(-0.015, 0.02) * q * 4), 10, 500);
    if (c.change.fragile) {
      const dep = (c.change.indice - c.change.depart) / c.change.depart;
      if (dep > 0) S.e.inflation = clamp(S.e.inflation + dep * 0.4 * q, -1, 80);
    }
  }
  if (c.guerre && c.guerre.niveau > 30) {
    S.dep.defense += (c.guerre.coutParTrimestre || 1) * q;
    S.e.tensionSociale = clamp(S.e.tensionSociale + c.guerre.niveau * 0.01 * q, 0, 100);
  }
  if (c.commerce && c.commerce.tarifs) S.e.croissance = clamp(S.e.croissance - c.commerce.tarifs * 0.01 * q, -6, 8);
}
function election() {
  const c = candidatsActifs().map(x => ({ ...x }));
  const pj = c.find(x => x.joueur);
  if (pj) pj.base = clamp((pj.base || 20) * 0.5 + (S.e.popularite - 20) * 0.45 + (S.e.croissance > 1 ? 3 : 0) - Math.max(0, S.e.chomage - 6) * 0.8, 2, 70);
  c.forEach(x => { x.s = Math.max(0.5, x.base + rnd(-2.5, 2.5)); });
  const t = c.reduce((a, b) => a + b.s, 0);
  c.forEach(x => { x.s = x.s / t * 100; });
  c.sort((a, b) => b.s - a.s);
  const [a, b] = c;
  const famille = (D.election && D.election.familleFavorisee) || "RN";
  const r2a = a.p === famille ? clamp(48 + (S.e.tensionSociale - 50) * 0.1 - (b.joueur ? (S.e.popularite - 30) * 0.15 : 0) + rnd(-3, 3), 35, 68) : (a.joueur ? clamp(47 + (S.e.popularite - 40) * 0.25, 42, 64) : 54);
  const gagnant = r2a > 50 ? a : b;
  const type = (D.election && D.election.type) || "presidentielle";
  S.elu = { t1: c, finale: [a, b], r2: [r2a, 100 - r2a], gagnant: gagnant.n, type };
  if (type === "legislatives") {
    S.fini = false;
    S.soutien = Math.round(clamp(S.soutien + (gagnant.joueur ? 15 : -35), 80, 450));
  } else S.fini = D.election && D.election.finSiDefaite === false ? false : !gagnant.joueur;
  const texte = `${(D.election && D.election.label) || "Présidentielle"} : ${gagnant.n} arrive en tête avec ${f1(Math.max(r2a, 100 - r2a))} % au second tour du modèle.`;
  S.journal.unshift({ date: S.date, texte, statut: "échéance", decisionDate: null });
  log(texte, gagnant.joueur ? "pos" : "neg");
  view = "elec";
  arreterLecture();
}

/* ---------- Lecture ---------- */
function arreterLecture() {
  if (S) S.lecture = false;
  if (timer) clearInterval(timer);
  timer = null;
  if (isBrowser) majLecture();
}
function basculerLecture() {
  if (!S || S.fini) return;
  if (S.lecture) { arreterLecture(); if (isBrowser) render(); return; }
  S.lecture = true;
  const vit = S.vitesse || 2;
  const ms = vit >= 4 ? 420 : vit === 1 ? 1200 : 650;
  if (isBrowser) majLecture();
  timer = setInterval(() => {
    if (!S || !S.lecture || S.fini) { arreterLecture(); return; }
    const rec = avancer(S.vitesse >= 4 ? "mois" : "semaine");
    if (!rec || rec.pause || rec.fini || S.fini) arreterLecture();
  }, ms);
}
function majLecture() {
  const b = $("#lecture");
  if (!b) return;
  b.textContent = S && S.lecture ? "⏸ Pause" : "▶ Lecture";
  b.classList.toggle("on", !!(S && S.lecture));
}

/* ---------- Interface ---------- */
function kpi(k, v, cls) { return `<div class=card><div class=k>${k}</div><div class="v ${cls || ""}">${v}</div></div>`; }
function htmlMouvements(avant, apres) {
  const bits = [];
  for (const k of PHOTO_KEYS) {
    const d = apres[k] - avant[k];
    if (Math.abs(d) < 0.05) continue;
    bits.push(`<span class="${d < 0 && (k === "popularite" || k === "croissance" || k === "confianceMarches") || d > 0 && (k === "inflation" || k === "chomage" || k === "deficitPct" || k === "dettePct" || k === "tensionSociale") ? "bad" : "good"}">${esc(NOMS[k])} ${d > 0 ? "+" : ""}${f1(d)} pt</span> (${f1(avant[k])} → ${f1(apres[k])})`);
  }
  return bits.length ? bits.join(" · ") : "Indicateurs stables à 0,05 pt près.";
}
function htmlRecap() {
  const r = S.recap;
  if (!r) return `<div class=card id=recap><b>Aucun pas de temps pour l'instant.</b><p class=note>La barre fixe en bas avance d'une semaine, d'un mois, d'un trimestre ou d'un an. La lecture enchaîne les pas et s'arrête sur un événement important.</p></div>`;
  const lignes = r.decision ? (r.lignes || []).map(L => `<li><span class=cause>${esc(L.cause)}</span>${(L.prevus || []).length ? `<div class=note>Différé : ${L.prevus.map(esc).join(" · ")}</div>` : ""}</li>`).join("")
    : (r.lignesJournal || []).map(t => `<li>${esc(t)}</li>`).join("");
  const pause = r.pause ? `<p class=bad>Pause automatique : ${esc(r.pause)}. Le reste du saut n'a pas été joué. Relancez le temps pour continuer.</p>` : "";
  const tete = r.decision ? esc(r.titre) : `Récapitulatif — ${esc(fmtCourt(r.du))} → ${esc(fmtCourt(r.au))} (${esc(r.pas)})`;
  const mouv = r.decision ? "" : `<p>${htmlMouvements(r.avant, r.apres)}</p>`;
  return `<div class="card recap" id=recap><h2>${tete}</h2>${pause}${mouv}${lignes ? `<ul class=propre>${lignes}</ul>` : ""}</div>`;
}
function htmlAVenir() {
  const p = (S.effets || []).filter(e => !e.fait).sort((a, b) => a.echeance < b.echeance ? -1 : 1).slice(0, 6);
  if (!p.length) return "";
  return `<div class=card><b>Effets différés encore devant vous</b><ul class=propre>${p.map(e => `<li>${esc(fmtCourt(e.echeance))} — <span class=cause>${esc(e.cause)}</span> → ${esc(apercuDiffere(e))}${e.decisionDate ? ` <span class=quand>décision du ${esc(fmtCourt(e.decisionDate))}</span>` : ""}</li>`).join("")}</ul></div>`;
}
const nw = n => `<div class="news ${esc(n.c)}"><span class=k>${esc(n.d)}</span> — ${esc(n.t)}${(n.reactions || []).map(r => `<div class=reaction><b>${esc(r.qui)}.</b> ${esc(r.texte)}</div>`).join("")}</div>`;
function page(html) { $("#main").innerHTML = htmlRecap() + htmlAVenir() + html; }
function render() {
  if (!isBrowser) return;
  if (!S) { renderChoix(); return; }
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.v === view));
  const quand = fmtDate(S.date);
  const dateEl = $("#date"), horloge = $("#horloge");
  if (dateEl) dateEl.textContent = quand;
  if (horloge) horloge.textContent = quand;
  document.querySelectorAll("[data-pas]").forEach(b => { b.disabled = !!S.fini; });
  const lec = $("#lecture");
  if (lec) lec.disabled = !!S.fini;
  majLecture();
  const vit = $("#vitesse");
  if (vit && document.activeElement !== vit) vit.value = String(S.vitesse || 2);
  const e = S.e;
  if (view === "dash") page(`<p class=note>Statecraft — ${esc(D.nom)}. Situation simulée au ${esc(quand)}. ${esc(D.bandeau || "Les chiffres de départ sont documentés dans Sources.")}</p>
    <div class=grid>${kpi("Croissance", f1(e.croissance) + " %", e.croissance < 0.5 ? "bad" : "good")}${kpi("Inflation", f1(e.inflation) + " %", e.inflation > 3 ? "bad" : "")}
    ${kpi("Chômage", f1(e.chomage) + " %", e.chomage > 8 ? "bad" : "")}${kpi("Dette", f1(e.dettePct) + " %", e.dettePct > 100 ? "bad" : "")}${kpi("Déficit", f1(e.deficitPct) + " %", e.deficitPct > 3 ? "bad" : "good")}
    ${kpi(monnaie().taux, f1(e.oat10) + " %", e.oat10 > 4 ? "bad" : "")}${kpi("Popularité", f0(e.popularite) + " %", e.popularite < 30 ? "bad" : "")}
    ${kpi("Tension", f0(e.tensionSociale), e.tensionSociale > 60 ? "bad" : "")}${kpi(monnaie().banque, f1(S.bce) + " %")}${kpi("Note", e.notation)}${S.smic ? kpi(D.smic.label || "Salaire minimum", f0(S.smic) + " " + (D.smic.unite || "€")) : ""}
    ${S.contraintes && S.contraintes.petrole ? kpi(S.contraintes.petrole.label, f0(S.contraintes.petrole.prix) + " $") : ""}
    ${S.contraintes && S.contraintes.sanctions ? kpi("Sanctions", f0(S.contraintes.sanctions.niveau) + "/100", S.contraintes.sanctions.niveau > 50 ? "bad" : "") : ""}
    ${S.contraintes && S.contraintes.change ? kpi(S.contraintes.change.label, f0(S.contraintes.change.indice)) : ""}
    ${S.texteHostile ? kpi("Texte à veto", "en attente", "bad") : ""}</div>
    <h2>Évolution</h2><div class=grid style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">${[["pib", "Croissance (%)"], ["chomage", "Chômage (%)"], ["inflation", "Inflation (%)"], ["dette", "Dette (% PIB)"], ["deficit", "Déficit (%)"], ["pop", "Popularité (%)"]].map(([k, l]) => `<div class=card><div class=k>${l}</div><canvas data-h="${k}"></canvas></div>`).join("")}</div>
    <h2>Dernières nouvelles</h2>${S.news.slice(0, 4).map(nw).join("")}`);
  if (view === "dec") renderDec();
  if (view === "parl") {
    const P = D.politique.assemblee;
    const maxS = Math.max(...P.map(p => p.s), 1);
    const senat = D.politique.senat;
    page(`<h2>${esc(D.politique.chambreNom || "Assemblée")} — ${D.politique.sieges || ""} sièges</h2><div class=card>${P.map(p => `<div class=row><label>${esc(p.p)}</label><span class=bar style="width:${p.s / maxS * 70}%;background:${p.c}"></span>${p.s}</div>`).join("")}</div>
      ${senat ? `<h2>${esc(senat.nom)}</h2><div class=card>${senat.groupes.map(p => `<div class=row><label>${esc(p.p)}</label><span class=bar style="width:${p.s / senat.sieges * 70}%;background:${p.c || "#4fa3d1"}"></span>${p.s}</div>`).join("")}<p class=note>${esc(senat.note || "")}</p></div>` : ""}
      <div class=card><p>Soutien estimé du camp au pouvoir : <b>${S.soutien}</b>. ${esc(D.politique.note || "")}</p>
      <p class=note>${esc((D.regles && D.regles.modeEmploi) || "Le temps se règle dans la barre du bas.")}</p></div>`);
  }
  if (view === "journal") page(`<h2>Journal des conséquences</h2><p class=note>Chaque ligne rattache un effet à sa cause : décision, événement, ou conjoncture. Les effets différés reviennent à leur date, avec la date de la décision d'origine.</p>
    ${(S.journal || []).map(j => `<div class=news><span class=k>${esc(fmtCourt(j.date))}</span> <span class=quand>${esc(j.statut)}</span> — ${esc(j.texte)}${(j.prevus || []).map(p => `<div class=note>Prévu ${esc(p)}</div>`).join("")}</div>`).join("") || "<p>Le journal est vide.</p>"}`);
  if (view === "news") page(`<h2>Fil d'actualités</h2>${S.news.map(nw).join("")}`);
  if (view === "elec") renderElec();
  if (view === "src") page(`<h2>Sources</h2><div class=card><table>${D.sources.map(s => `<tr><td><b>${esc(s[0])}</b></td><td>${esc(s[1])}</td></tr>`).join("")}</table></div>
    <p class=note>Le pas interne est d'au plus une semaine (une fraction de semaine en fin de mois pour tomber sur la date civile). Un trimestre de l'ancien modèle est réparti sur treize semaines. Les effets chiffrés d'une décision sont des règles pédagogiques : +1 point de TVA = +0,4 point d'inflation différée et −3 points de popularité immédiate. Ce n'est pas une prévision.</p>`);
  drawCharts();
}
function renderDec() {
  if (!S.draft) draftInit();
  const d = S.draft, a = analyse(d);
  const sl = (lab, path, min, max, step, val, txt) => `<div class=row><label>${lab}</label><input type=range min=${min} max=${max} step=${step} value=${val} data-p="${path}"><b>${txt}</b></div>`;
  page(`<h2>Décisions</h2><p class=note>Adopter un texte écrit tout de suite les effets immédiats dans les indicateurs, le journal et les actualités. Le reste est daté : il tombe quand le temps avance, et le récapitulatif le rattache à cette décision.</p>
    <div class=card><b>Fiscalité</b>${sl("Barème IR (100 = actuel)", "taux.IR", 70, 170, 5, d.taux.IR, String(d.taux.IR))}${sl("TVA (%)", "taux.TVA", 15, 28, 0.5, d.taux.TVA, f1(d.taux.TVA) + " %")}
    ${sl("Impôt sur les sociétés (%)", "taux.IS", 15, 40, 0.5, d.taux.IS, f1(d.taux.IS) + " %")}${sl("CSG (%)", "taux.CSG", 7, 13, 0.1, d.taux.CSG, f1(d.taux.CSG) + " %")}</div>
    <div class=card><b>Dépenses (%)</b>${Object.keys(d.dep).map(k => sl(MISSIONS[k] || k, "dep." + k, -15, 15, 1, d.dep[k], (d.dep[k] > 0 ? "+" : "") + d.dep[k] + " %")).join("")}</div>
    <div class=card><b>Social</b>${sl("Âge légal", "age", 59, 68, 0.25, d.age, fage(d.age))}${sl("Coup de pouce SMIC", "smic", 0, 15, 0.5, d.smic, "+" + f1(d.smic) + " %")}</div>
    ${(D.extra && D.extra.flex === false) ? "" : `<div class=card><div class=row><button type=button id=flex ${S.flexUE ? "disabled" : ""}>Flexibilité européenne (défense)</button><button type=button id=boucl>${S.bouclier ? "Lever" : "Activer"} le bouclier tarifaire</button></div></div>`}
    <div class=card id=est><b>Estimation, avant le vote</b>
      <p>Solde <b class=${a.solde >= 0 ? "good" : "bad"}>${a.solde >= 0 ? "+" : ""}${f1(a.solde)} ${esc(monnaie().unite)}/an</b>. Inflation différée liée à la taxe sur la consommation : ${f1(a.inflation)} pt. Score politique : ${a.voix} (vote dès ${regles().seuilVote || 200}). ${a.cc.map(x => `<span class=bad>${esc(x)}</span>`).join(" ")}</p>
      <p class=note>Pour +1 point de taxe sur la consommation : popularité −3 pt tout de suite, inflation +0,4 pt à 4 et 8 semaines.</p>
      <div class=row><button class=primary type=button id=vote>${esc((D.regles && D.regles.labelVote) || "Soumettre au vote")}</button><button type=button id=v493>${esc((regles().special && regles().special.label) || "Engager le 49.3")}</button>${regles().veto ? `<button type=button id=veto>${esc(regles().veto.label || "Veto")}</button>` : ""}<button type=button id=raz>Annuler</button></div>
    </div>`);
  $("#main").querySelectorAll("input[type=range]").forEach(i => i.oninput = () => {
    const [p, q] = i.dataset.p.split(".");
    const val = +i.value;
    if (q) d[p][q] = val; else d[p] = val;
    const b = i.parentElement.querySelector("b");
    if (p === "age") b.textContent = fage(val);
    else if (p === "smic") b.textContent = "+" + f1(val) + " %";
    else if (p === "dep") b.textContent = (val > 0 ? "+" : "") + val + " %";
    else if (p === "taux" && q !== "IR") b.textContent = f1(val) + " %";
    else b.textContent = String(val);
    const est = $("#est");
    if (!est) return;
    const a2 = analyse(d);
    est.querySelector("p").innerHTML = `Solde <b class=${a2.solde >= 0 ? "good" : "bad"}>${a2.solde >= 0 ? "+" : ""}${f1(a2.solde)} ${esc(monnaie().unite)}/an</b>. Inflation différée liée à la taxe sur la consommation : ${f1(a2.inflation)} pt. Score politique : ${a2.voix} (vote dès ${regles().seuilVote || 200}). ${a2.cc.map(x => `<span class=bad>${esc(x)}</span>`).join(" ")}`;
  });
  $("#vote").onclick = () => { d.mode = "vote"; voter(); };
  $("#v493").onclick = () => { d.mode = "special"; voter(); };
  const veto = $("#veto");
  if (veto) veto.onclick = () => { resoudreSpecial({ type: "veto", ...(regles().veto || {}) }, analyse(d)); };
  $("#raz").onclick = () => { draftInit(); render(); };
  const flex = $("#flex"), boucl = $("#boucl");
  if (flex) flex.onclick = () => deciderFlex();
  if (boucl) boucl.onclick = () => deciderBouclier();
}
function renderChoix() {
  const table = tablePays();
  const cartes = Object.keys(table).map(id => {
    const c = table[id];
    const f = c.fiche || {};
    return `<a class="card choix" href="?pays=${esc(id)}"><h2>${esc(f.drapeau || "")} ${esc(c.nom)}</h2><p>${esc(f.resume || "")}</p></a>`;
  }).join("");
  $("#main").innerHTML = `<h2>Statecraft</h2><p>Choisissez un pays. La France garde ses paramètres de scénario. Les autres pays affichent la source de chaque chiffre, et signalent les estimations. La dernière lettre des noms de candidats est omise.</p><div class="choices">${cartes}</div>`;
  const dateEl = $("#date"), horloge = $("#horloge");
  if (dateEl) dateEl.textContent = "Choisir un pays";
  if (horloge) horloge.textContent = "En attente d'un pays";
}
function renderElec() {
  const label = (D.election && D.election.label) || "Présidentielle 2027";
  const liste = candidatsActifs();
  if (!S.elu) {
    page(`<h2>${esc(label)}</h2><p class=note>Le scrutin tombe le ${esc(fmtCourt(dateElection()))}. Avancer le temps y mène ; la lecture s'y arrête. ${esc(D.noteCandidats || "")}</p>
      <div class=card>${liste.map(c => { const v = c.joueur ? clamp((c.base || 20) * 0.6 + (S.e.popularite - 20) * 0.3, 2, 60) : c.base; return `<div class=row><label>${esc(c.n)} (${esc(c.p)})</label><span class=bar style="width:${Math.min(70, v)}%;background:${c.c}"></span>${f0(v)} %</div>`; }).join("")}</div>`);
    return;
  }
  const E = S.elu;
  page(`<h2>${esc(label)}</h2><div class=card>${E.t1.map(c => `<div class=row><label>${esc(c.n)}</label><span class=bar style="width:${c.s * 1.4}%;background:${c.c}"></span>${f1(c.s)} %</div>`).join("")}
    <p>Second tour : ${esc(E.finale[0].n)} ${f1(E.r2[0])} % — ${esc(E.finale[1].n)} ${f1(E.r2[1])} %. <b>${esc(E.gagnant)}</b> est élu(e).</p>
    ${S.fini ? "<p class=bad>Votre camp perd. Le temps s'arrête : le bouton du bas est désactivé. Une nouvelle partie le réactive.</p>" : "<p class=good>Votre camp garde l'Élysée. Le temps continue.</p>"}</div>`);
}
function drawCharts() {
  if (!isBrowser) return;
  document.querySelectorAll("canvas[data-h]").forEach(c => {
    const d = (S.hist && S.hist[c.dataset.h]) || [];
    if (!d.length) return;
    const x = c.getContext("2d");
    c.width = Math.max(280, c.clientWidth * 2); c.height = 280;
    const W = c.width, H = c.height, mn = Math.min(...d), mx = Math.max(...d), span = (mx - mn) || 1;
    x.clearRect(0, 0, W, H); x.strokeStyle = "#7eb6ff"; x.lineWidth = 3; x.beginPath();
    d.forEach((v, i) => { const px = d.length < 2 ? W / 2 : i / (d.length - 1) * (W - 8) + 4; const py = H - 8 - (v - mn) / span * (H - 16); i ? x.lineTo(px, py) : x.moveTo(px, py); });
    x.stroke();
  });
}
function modal(titre, html) {
  if (!isBrowser) return;
  const d = document.createElement("div");
  d.className = "modal";
  d.innerHTML = `<div><h2>${esc(titre)}</h2>${html}<button type=button>OK</button></div>`;
  d.querySelector("button").onclick = () => d.remove();
  document.body.appendChild(d);
}
function sauver(silent) {
  if (typeof localStorage === "undefined" || !S) return;
  const copie = { ...S, lecture: false };
  try { localStorage.setItem(cleSauvegarde(), JSON.stringify(copie)); } catch (e) {}
  if (!silent) modal("Sauvegarde", "<p>Partie enregistrée dans ce navigateur.</p>");
}
function boot() {
  if (!isBrowser) return;
  let saved = null;
  if (!idDemande()) { renderChoix(); lier(); return; }
  try { saved = JSON.parse(localStorage.getItem(cleSauvegarde()) || "null"); } catch (e) { saved = null; }
  if (saved && saved.e && saved.date && saved.journal && saved.effets && saved.paysId === D.id) { S = saved; S.lecture = false; }
  else nouvelle();
  lier();
}
function lier() {
  document.querySelectorAll("nav button").forEach(b => b.onclick = () => {
    if (b.dataset.v === "choix") { location.href = "./index.html"; return; }
    if (!S) return;
    view = b.dataset.v; render();
  });
  document.querySelectorAll("[data-pas]").forEach(b => b.onclick = () => { if (!S) return; if (S.lecture) arreterLecture(); avancer(b.dataset.pas); });
  $("#lecture").onclick = () => basculerLecture();
  $("#vitesse").onchange = () => { S.vitesse = +$("#vitesse").value; if (S.lecture) { arreterLecture(); basculerLecture(); } };
  $("#save").onclick = () => sauver(false);
  $("#reset").onclick = () => { if (!S) return; if (typeof confirm === "function" && !confirm("Recommencer ?")) return; arreterLecture(); try { localStorage.removeItem(cleSauvegarde()); } catch (e) {} nouvelle(); view = "dash"; };
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  render();
}
const SIM = { nouvelle, avancer, voter, draftInit, deciderBouclier, resoudreSpecial, photo, fmtDate, addDays, addMonths, etat: () => S };
if (typeof globalThis !== "undefined") globalThis.SIM = SIM;
boot();
