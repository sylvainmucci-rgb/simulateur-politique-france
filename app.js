"use strict";
/* Simulateur France — moteur et interface.
   Les données vivent dans COUNTRIES[pays]. Le DOM n'est touché que dans un navigateur,
   pour qu'une partie complète puisse être rejouée sans interface (node test/partie-headless.js). */
const isBrowser = typeof document !== "undefined";
const $ = s => (isBrowser ? document.querySelector(s) : null);
const f1 = x => (Math.round(x * 10) / 10).toLocaleString("fr-FR");
const f0 = x => Math.round(x).toLocaleString("fr-FR");
const f2 = x => Number(x).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const esc = s => String(s ?? "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const KEY = "simfr_save_v3";
const ECHELLE = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-", "BB+"];

function chargerPays() {
  let id = "fr";
  try {
    if (typeof location !== "undefined" && location && location.search) {
      id = new URLSearchParams(location.search).get("pays") || "fr";
    }
  } catch (e) { /* noeud de test sans URL */ }
  const table = typeof COUNTRIES !== "undefined" ? COUNTRIES : window.COUNTRIES;
  return table[id] || table.fr;
}
const D = chargerPays();

let S = null;
let ui = { dec: "budget", cat: "Âge", src: "tous" };
let rngState = 1;

function rnd01() {
  let a = ((S && S.rng) || rngState || 1) | 0;
  a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  rngState = a >>> 0;
  if (S) S.rng = rngState;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rnd = (a, b) => a + rnd01() * (b - a);

function log(t, c, reactions) {
  if (!S.news) S.news = [];
  S.news.unshift({ d: `T${S.tri} ${S.annee}`, t: String(t), c: c || "", reactions: reactions || [] });
  if (S.news.length > 420) S.news.length = 420;
}
function snap() {
  const h = S.hist, e = S.e;
  h.pib.push(e.croissance); h.chomage.push(e.chomage); h.inflation.push(e.inflation);
  h.dette.push(e.dettePct); h.oat.push(e.oat10); h.deficit.push(e.deficitPct);
  h.pop.push(e.popularite); h.gini.push(e.gini); h.pauvrete.push(e.pauvrete);
  h.spread.push(e.oat10 - e.bund10); h.ratio.push(S.ret.ratioCotRet);
}
const totRec = () => Object.values(S.rec).reduce((a, b) => a + b, 0);
const totDep = () => Object.values(S.dep).reduce((a, b) => a + b, 0);
const fage = a => `${Math.floor(a)} ans ${Math.round((a % 1) * 12)} mois`;
const fduree = q => `${Math.floor(q / 4)} ans et ${q % 4} trim. (${q})`;

function groupeData(id) { return (D.groupes && D.groupes[id]) || null; }
function sieges(id) { const g = S.assemblee.find(x => x.id === id); return g ? g.s : 0; }
function siegesCoalition() { return (S.coalition || []).reduce((a, id) => a + sieges(id), 0); }
function dansCoalition(id) {
  if ((S.coalition || []).includes(id)) return true;
  if (S.accords && S.accords[id] != null && S.tour <= S.accords[id]) return true;
  return false;
}
function peutGouverner() {
  if (!S || !S.titulaire) return false;
  if (S.role === "president" && S.cohabitation) return false;
  return true;
}

/* ---------- Départ ---------- */
function draftVierge() {
  const dep = {};
  for (const k in S.dep) if (k !== "interets") dep[k] = 0;
  const mesures = {};
  for (const c of (D.catalogue || [])) mesures[c.cle] = "statuquo";
  return {
    taux: { ...S.taux }, dep, age: S.ret.ageLegal, duree: S.ret.dureeTrimestres,
    indexation: S.ret.indexation, tauxCot: S.ret.tauxCotisation, smic: 0,
    mesures, concessions: {}
  };
}
function assurerDraft() { if (!S.draft) S.draft = draftVierge(); return S.draft; }

function optionMesure(cle, id) {
  const cat = (D.catalogue || []).find(c => c.cle === cle);
  if (!cat) return null;
  return cat.options.find(o => o.id === id) || null;
}
function appliquerPatch(d, p) {
  if (!p) return;
  if (p.mesures) Object.assign(d.mesures, p.mesures);
  if (p.depAdd) for (const k in p.depAdd) d.dep[k] = (d.dep[k] || 0) + p.depAdd[k];
  if (p.tauxDelta) for (const k in p.tauxDelta) d.taux[k] = (d.taux[k] || 0) + p.tauxDelta[k];
  if (p.smic) d.smic = (d.smic || 0) + p.smic;
  if (p.age) d.age = (d.age || S.ret.ageLegal) + p.age;
  if (p.indexation) d.indexation = p.indexation;
  if (p.depMd) { d._depMd = d._depMd || {}; for (const k in p.depMd) d._depMd[k] = (d._depMd[k] || 0) + p.depMd[k]; }
  if (p.set) d._set = Object.assign(d._set || {}, p.set);
  if (p.secteur) d._secteur = fusion(d._secteur || {}, p.secteur);
}

function draftEffectif(opts) {
  const src = assurerDraft();
  const d = {
    taux: { ...src.taux }, dep: { ...src.dep }, age: src.age, duree: src.duree,
    indexation: src.indexation, tauxCot: src.tauxCot, smic: src.smic || 0,
    mesures: { ...src.mesures }, concessions: { ...src.concessions }, _depMd: {}, _secteur: {}, _set: {}, _speciaux: []
  };
  for (const cle in d.mesures) {
    const opt = optionMesure(cle, d.mesures[cle]);
    if (!opt || opt.id === "statuquo") continue;
    if (opt.special === "bouclier_on" && S.bouclier) continue;
    if (opt.special === "bouclier_off" && !S.bouclier) continue;
    appliquerPatch(d, opt);
    if (opt.inflation) d._inflation = (d._inflation || 0) + opt.inflation;
    if (opt.popularite) d._popularite = (d._popularite || 0) + opt.popularite;
    if (opt.greve) d._greve = (d._greve || 0) + opt.greve;
    if (opt.file) d._files = (d._files || []).concat(opt.file);
    if (opt.special) d._speciaux.push(opt.special);
    if (opt.resume) (d._resumes = d._resumes || []).push(opt.resume);
  }
  for (const gid in d.concessions) {
    const cid = d.concessions[gid];
    if (!cid) continue;
    const g = groupeData(gid);
    const c = g && (g.concessions || []).find(x => x.id === cid);
    if (c) appliquerPatch(d, c.patch);
  }
  if (opts && opts.amendement && opts.amendement !== "aucun") {
    const am = (D.senat.amendements || []).find(x => x.id === opts.amendement);
    if (am) appliquerPatch(d, am.patch);
  }
  for (const k in d.dep) d.dep[k] = clamp(d.dep[k], -20, 20);
  d.taux.IR = clamp(d.taux.IR, 60, 180);
  d.taux.TVA = clamp(d.taux.TVA, 10, 30);
  d.taux.IS = clamp(d.taux.IS, 10, 50);
  d.taux.CSG = clamp(d.taux.CSG, 5, 16);
  d.age = clamp(d.age, 58, 70);
  return d;
}
function fusion(a, b) {
  const o = { ...a };
  for (const k in b) {
    if (b[k] && typeof b[k] === "object" && !Array.isArray(b[k])) o[k] = { ...(o[k] || {}), ...b[k] };
    else o[k] = b[k];
  }
  return o;
}

/* ---------- Analyse d'un texte ---------- */
function orientationDe(d) {
  let o = 0;
  o += (d.taux.IR - S.taux.IR) * -0.7;
  o += (d.taux.IS - S.taux.IS) * -1.1;
  o += (d.taux.TVA - S.taux.TVA) * 2.4;
  o += (d.taux.CSG - S.taux.CSG) * 2;
  o += (d.age - S.ret.ageLegal) * 16;
  o -= (d.smic || 0) * 1.4;
  o += ((d.tauxCot || S.ret.tauxCotisation) - S.ret.tauxCotisation) * -1.5;
  for (const k in d.dep) {
    const signe = (k === "defense" || k === "securite") ? 0.55 : -0.65;
    o += (d.dep[k] || 0) * signe;
  }
  const m = d.mesures || {};
  if (m.immigration === "ferme") o += 12;
  if (m.immigration === "regularisation") o -= 14;
  if (m.climat === "accelerer") o -= 8;
  if (m.climat === "pause") o += 6;
  if (m.mercosur === "ratifier") o += 4;
  if (m.agriculture === "normes_bas") o += 6;
  if (m.europe === "federal") o -= 4;
  return clamp(o, -100, 100);
}
function lignesViolees(g, d, a) {
  if (!g) return [];
  const accordees = new Set();
  const cid = d.concessions && d.concessions[g.id || ""];
  /* g ici est le profil données, pas le groupe de sièges : on passe gid à part */
  return _lignes(g, d, a, accordees);
}
function _lignes(profil, d, a, levees) {
  const out = [];
  for (const lr of (profil.lignesRouges || [])) {
    if (levees && levees.has(lr.id)) continue;
    let hit = false;
    if (lr.type === "taux_max") hit = d.taux[lr.taux] > lr.max + 1e-9;
    else if (lr.type === "taux_min") hit = d.taux[lr.taux] < lr.min - 1e-9;
    else if (lr.type === "depense_plancher") hit = (d.dep[lr.poste] || 0) < lr.min;
    else if (lr.type === "age_max") hit = d.age > lr.max + 1e-9;
    else if (lr.type === "age_min") hit = d.age < lr.min - 1e-9;
    else if (lr.type === "mesure_interdite") hit = d.mesures[lr.cle] === lr.valeur;
    else if (lr.type === "indexation_interdite") hit = d.indexation === lr.valeur;
    else if (lr.type === "solde_min") hit = a.solde < lr.min;
    if (hit) out.push(lr);
  }
  return out;
}
function leveesDe(d, gid) {
  const set = new Set();
  const cid = d.concessions && d.concessions[gid];
  if (!cid) return set;
  const g = groupeData(gid);
  const c = g && (g.concessions || []).find(x => x.id === cid);
  for (const id of (c && c.leve) || []) set.add(id);
  return set;
}
function alignement(profil, d, a) {
  const ax = profil.axe || {};
  let s = ((ax.eco || 0) / 100) * a.orientation * 0.55;
  const m = d.mesures || {};
  if (m.immigration === "ferme") s += (ax.immigration || 0) / 100 * 18;
  if (m.immigration === "regularisation") s -= (ax.immigration || 0) / 100 * 22;
  if (m.climat === "accelerer") s += (ax.climat || 0) / 100 * 14;
  if (m.climat === "pause") s -= (ax.climat || 0) / 100 * 10;
  if (m.mercosur === "ratifier") s += (ax.mercosur || 0) / 100 * 16;
  if (m.mercosur === "rejeter") s -= (ax.mercosur || 0) / 100 * 12;
  if (m.europe === "federal") s += (ax.europe || 0) / 100 * 16;
  s += ((ax.retraites || 0) / 100) * (d.age - S.ret.ageLegal) * 28;
  s += ((ax.ordre || 0) / 100) * ((m.securite === "lopmi" ? 8 : 0) + (m.securite === "coupe" ? -8 : 0));
  return clamp(s, -42, 42);
}
function scoreGroupe(id, d, a) {
  const profil = groupeData(id);
  if (!profil) return { s: 0, lr: [], vote: "abstention" };
  const coal = dansCoalition(id);
  let s = coal ? 46 + ((S.relations[id] || 50) - 50) * 0.25 : (profil.base + ((S.relations[id] || 50) - 50) * 0.35);
  if (S.campGouvernement === "gauche" && id === "lfi") s += 14;
  s += alignement(profil, d, a);
  if (d.concessions && d.concessions[id]) s += 36;
  const lr = _lignes(profil, d, a, leveesDe(d, id));
  if (lr.length) s -= 120;
  s = clamp(s, -160, 160);
  let vote = "contre";
  if (lr.length) vote = "contre";
  else if (s >= 22) vote = "pour";
  else if (s >= -8) vote = "abstention";
  return { s, lr, vote };
}
function voixDe(id, siegesN, vote, score) {
  if (id === "vac" || siegesN <= 0) return { pour: 0, contre: 0, abst: 0 };
  if (id === "ni") {
    const p = score >= 10 ? 0.45 : score >= -5 ? 0.25 : 0.15;
    const c = score < -5 ? 0.5 : 0.25;
    const pour = Math.round(siegesN * p);
    const contre = Math.round(siegesN * c);
    return { pour, contre, abst: Math.max(0, siegesN - pour - contre) };
  }
  if (vote === "pour") return { pour: siegesN, contre: 0, abst: 0 };
  if (vote === "contre") return { pour: 0, contre: siegesN, abst: 0 };
  return { pour: 0, contre: 0, abst: siegesN };
}
function decompteVotes(d, a) {
  const detail = [];
  let pour = 0, contre = 0, abst = 0;
  for (const g of S.assemblee) {
    const sc = scoreGroupe(g.id, d, a);
    const v = voixDe(g.id, g.s, sc.vote, sc.s);
    pour += v.pour; contre += v.contre; abst += v.abst;
    detail.push({ id: g.id, p: g.p, s: g.s, vote: sc.vote, score: Math.round(sc.s), lignes: sc.lr.map(x => x.label), ...v });
  }
  return { pour, contre, abst, detail, adopte: pour > contre };
}
function decompteCensure(d, a) {
  const infos = {};
  const wants = [];
  for (const g of S.assemblee) {
    if (g.id === "vac") continue;
    const sc = scoreGroupe(g.id, d, a);
    infos[g.id] = sc;
    const dur = sc.lr.length || sc.s < -32;
    if (dur && !dansCoalition(g.id)) wants.push(g);
  }
  wants.sort((x, y) => y.s - x.s);
  const parrain = wants[0] ? (groupeData(wants[0].id) || {}).famille : null;
  let pour = 0;
  const detail = [];
  for (const g of S.assemblee) {
    if (g.id === "vac" || g.s <= 0) continue;
    const sc = infos[g.id];
    if (!sc) continue;
    let oui = false;
    const dur = (sc.lr.length || sc.s < -32) && !dansCoalition(g.id);
    if (dur) {
      const grave = sc.lr.some(l => l.grave);
      const fam = (groupeData(g.id) || {}).famille;
      if (grave || sc.s < -75) oui = true;
      else if (parrain === "extreme" && (fam === "gauche" || fam === "ecolo" || fam === "centre")) oui = false;
      else if ((parrain === "gauche" || parrain === "ecolo") && fam === "extreme" && !sc.lr.length) oui = false;
      else oui = true;
    }
    if (g.id === "ni") {
      const part = oui ? Math.round(g.s * 0.45) : 0;
      pour += part;
      detail.push({ id: g.id, p: g.p, oui: part > 0, sieges: part, pourquoi: oui ? "une partie des non-inscrits" : "" });
    } else if (oui) {
      pour += g.s;
      detail.push({ id: g.id, p: g.p, oui: true, sieges: g.s, pourquoi: sc.lr.length ? sc.lr.map(x => x.label).join(" ; ") : "opposition résolue au texte" });
    }
  }
  const seuil = D.institutions.majoriteAbsolue;
  return { pour, seuil, adoptee: pour >= seuil, detail, risque: pour >= seuil ? "élevé" : pour >= seuil - 40 ? "modéré" : "faible" };
}
function conseil(d) {
  const cc = [];
  if (d.taux.IR > 150) cc.push("Barème de l'IR relevé de plus de moitié : risque de censure pour rupture de l'égalité devant les charges publiques (article 13 de la Déclaration de 1789).");
  if (d.taux.TVA > 25) cc.push("TVA au-delà de 25 % : le modèle bloque le texte (seuil politique et contrainte européenne du taux normal).");
  if (d.taux.IS > 42 || d.taux.IS < 15) cc.push("Impôt sur les sociétés hors de la plage 15–42 % : censure pour méconnaissance de la capacité contributive ou du droit européen.");
  if (d.taux.CSG < 6 || d.taux.CSG > 14) cc.push("CSG hors de la plage 6–14 % : le texte est tenu pour déséquilibré.");
  if (d.age > 67 || d.age < 60) cc.push("Âge légal hors de 60–67 ans : incompatible avec une loi de financement dans ce modèle (exigence constitutionnelle de solidarité et sécurité juridique).");
  if (Math.abs(d.age - S.ret.ageLegal) > 2) cc.push("Variation de l'âge légal supérieure à 2 ans en une seule loi : atteinte excessive aux situations en cours.");
  if (d.duree < 160 || d.duree > 180) cc.push("Durée d'assurance hors de 160–180 trimestres.");
  if (d.tauxCot < 22 || d.tauxCot > 34) cc.push("Taux de cotisation hors de 22–34 %.");
  if (d.smic > 8) cc.push("Coup de pouce au SMIC supérieur à 8 % d'un coup : le Conseil n'est pas saisi automatiquement, mais le modèle refuse l'ampleur (choc sur l'emploi peu qualifié, non compensé).");
  return cc;
}

function analyse(d) {
  d = d || draftEffectif();
  const el = D.elasticites;
  const r = {
    dRecParts: {}, depMd: {}, cc: [], alertes: [], greve: d._greve || 0, inflation: d._inflation || 0,
    gini: 0, pauv: 0, popularite: d._popularite || 0
  };
  const t = d.taux, st = S.taux;
  r.dRecParts.IR = ((t.IR - st.IR) / 100) * S.rec.IR * el.IR.reponse;
  r.dRecParts.TVA = (t.TVA - st.TVA) * el.TVA.mdParPoint * el.TVA.reponse;
  r.dRecParts.IS = (t.IS - st.IS) * el.IS.mdParPoint * el.IS.reponse;
  r.dRecParts.CSG = (t.CSG - st.CSG) * el.CSG.mdParPoint * el.CSG.reponse;
  r.inflation += (t.TVA - st.TVA) * el.TVA.inflationParPoint;
  r.gini += (t.TVA - st.TVA) * 0.0022 - (t.IR - st.IR) * 0.00032 + (t.CSG - st.CSG) * 0.004;
  r.pauv += (t.TVA - st.TVA) * 0.16 - (t.IR - st.IR) * 0.015;

  for (const k in d.dep) {
    const md = (S.dep[k] || 0) * (d.dep[k] || 0) / 100;
    if (md) r.depMd[k] = (r.depMd[k] || 0) + md;
    if ((d.dep[k] || 0) <= -3 && (k === "sante" || k === "education")) r.greve += 7;
  }
  for (const k in (d._depMd || {})) r.depMd[k] = (r.depMd[k] || 0) + d._depMd[k];
  const da = d.age - S.ret.ageLegal;
  if (da) r.depMd.retraites = (r.depMd.retraites || 0) - da * 4;
  if (da > 0) r.greve += da * 16;
  if (da < 0) r.popularite += Math.min(2, -da * 1.5);
  if (d.smic) {
    r.depMd.emploi = (r.depMd.emploi || 0) + d.smic * 0.55;
    r.inflation += d.smic * 0.035;
    r.pauv -= d.smic * 0.09;
    r.gini -= d.smic * 0.0007;
    r.popularite += d.smic * 0.12;
    if (d.smic >= 3) r.alertes.push("Coup de pouce au SMIC : les branches à bas salaires et les TPE absorbent mal un choc de plus de 3 %.");
  }
  if (S.ret.salaireMoyenAnnuel) {
    const masse = S.ret.demo.cotisantsM * S.ret.salaireMoyenAnnuel / 1000;
    r.dRecParts.cotisations = masse * (d.tauxCot - S.ret.tauxCotisation) / 100;
  }
  if (d.indexation === "gel" && S.ret.indexation !== "gel") { r.greve += 16; r.popularite -= 1.5; }
  if (d.duree - S.ret.dureeTrimestres >= 4) r.greve += 6;
  r.dRec = Object.values(r.dRecParts).reduce((a, b) => a + b, 0);
  r.dDep = Object.values(r.depMd).reduce((a, b) => a + b, 0);
  r.solde = r.dRec - r.dDep;
  if (r.solde < -15) r.alertes.push("Creusement supérieur à 15 Md€ : la procédure de déficit excessif se durcit et le spread s'écarte.");
  if (d.mesures.epr2 === "lancer") r.alertes.push("Un EPR2 supplémentaire ne produit pas d'électricité avant la fin du quinquennat. Le coût, lui, commence tout de suite.");

  const mult = D.multiplicateurs;
  let impulse = 0, nDel = 0, dDel = 0;
  for (const k in r.depMd) {
    const spec = mult[k] || mult.autres;
    const pts = r.depMd[k] / S.e.pibMd * 100 * spec.m;
    impulse += pts; nDel += spec.delai * Math.abs(pts); dDel += Math.abs(pts);
  }
  for (const k of ["IR", "TVA", "IS", "CSG"]) {
    const spec = mult.impot[k];
    const md = r.dRecParts[k] || 0;
    const pts = -md / S.e.pibMd * 100 * spec.m;
    impulse += pts; nDel += spec.delai * Math.abs(pts); dDel += Math.abs(pts);
  }
  if (r.dRecParts.cotisations) {
    const pts = -r.dRecParts.cotisations / S.e.pibMd * 100 * 0.55;
    impulse += pts; nDel += 2 * Math.abs(pts); dDel += Math.abs(pts);
  }
  r.impulse = impulse;
  r.delai = dDel > 0.02 ? clamp(Math.round(nDel / dDel), 1, 8) : 2;
  r.cc = conseil(d);
  r.orientation = orientationDe(d);
  r.votes = decompteVotes(d, r);
  r.censure = decompteCensure(d, r);
  r.finance = Math.abs(r.dRec) + Math.abs(r.dDep) >= 0.4;
  r.resumes = d._resumes || [];
  return r;
}

/* ---------- Votes, Sénat, CMP, application ---------- */
function reactionsLoi(a, d) {
  const out = [];
  if (a.solde >= 8) out.push({ qui: "Commission européenne", texte: `« Un effort d'environ ${f0(a.solde)} Md€ va dans le sens de la trajectoire. C'est l'exécution qui sera jugée. »` });
  else if (a.solde <= -8) out.push({ qui: "Commission européenne", texte: `« Un creusement d'environ ${f0(-a.solde)} Md€ éloigne la sortie de la procédure de déficit excessif. »` });
  if (a.greve >= 12) out.push({ qui: "Intersyndicale (CGT, FO)", texte: "« Le texte sera contesté. Les organisations appellent à la mobilisation. »" });
  if (d.taux.IS < S.taux.IS - 0.4) out.push({ qui: "Medef", texte: "« Le signal sur l'impôt sur les sociétés est reçu. L'investissement dépendra aussi du coût du crédit. »" });
  if (d.taux.IS > S.taux.IS + 0.4) out.push({ qui: "Medef", texte: "« Relever l'impôt sur les sociétés quand les taux sont hauts, c'est renchérir l'investissement deux fois. »" });
  if (d.mesures.immigration === "ferme") out.push({ qui: "Groupe RN", texte: "« Nous jugerons les éloignements exécutés, pas le communiqué. »" });
  if (d.mesures.immigration === "regularisation") out.push({ qui: "Employeurs des métiers en tension", texte: "« L'hôpital et l'agriculture emploient déjà ces salariés. Le droit ne devrait pas rester fictif. »" });
  if (d.mesures.mercosur === "ratifier") out.push({ qui: "FNSEA", texte: "« Pas de ratification sans clauses miroirs opposables. »" });
  if (S.e.inflation > 3.2) out.push({ qui: "BCE", texte: `« À ${f1(S.e.inflation)} % d'inflation, un budget qui relance la demande nominale complique le retour vers 2 %. »` });
  if (a.solde < -10) out.push({ qui: "Comités de notation", texte: "« Un creusement non financé pèse d'abord sur la perspective, ensuite sur la note. »" });
  return out.slice(0, 6);
}
function addSecteur(delta) {
  if (!delta) return;
  for (const dom in delta) {
    if (!S.secteurs[dom]) continue;
    for (const k in delta[dom]) {
      const v = delta[dom][k];
      if (typeof v === "number" && typeof S.secteurs[dom][k] === "number") S.secteurs[dom][k] += v;
      else S.secteurs[dom][k] = v;
    }
  }
}
function materialiser(d) {
  const old = S.draft;
  S.draft = d;
  const eff = draftEffectif();
  S.draft = old;
  return eff;
}
function appliquerLoi(d, meta) {
  const a = analyse(d);
  if (a.cc.length) return { ok: false, cc: a.cc };
  const ancienTaux = S.ret.tauxCotisation;
  for (const k in a.dRecParts) {
    if (S.rec[k] == null) S.rec[k] = 0;
    S.rec[k] = Math.max(0, S.rec[k] + a.dRecParts[k]);
  }
  for (const k in a.depMd) S.dep[k] = Math.max(0, (S.dep[k] || 0) + a.depMd[k]);
  S.taux = { IR: d.taux.IR, TVA: d.taux.TVA, IS: d.taux.IS, CSG: d.taux.CSG };
  S.ret.ageLegal = d.age;
  S.ret.dureeTrimestres = d.duree;
  S.ret.indexation = d.indexation;
  S.ret.tauxCotisation = d.tauxCot;
  if (d.smic) S.smic *= 1 + d.smic / 100;
  const delai = a.delai || 2;
  if (Math.abs(a.impulse) > 0.0005 || Math.abs(a.inflation) > 0.0005) {
    S.file.push({
      reste: delai,
      g: a.impulse / delai,
      inf: a.inflation / delai,
      gini: a.gini / delai,
      pauv: a.pauv / delai,
      chom: ((d.smic || 0) * 0.025 + Math.max(0, d.tauxCot - ancienTaux) * 0.04) / delai
    });
  }
  for (const fl of (d._files || [])) S.file.push({ ...fl });
  addSecteur(d._secteur);
  if (d._set) {
    for (const dom in d._set) if (S.secteurs[dom]) Object.assign(S.secteurs[dom], d._set[dom]);
  }
  for (const sp of (d._speciaux || [])) {
    if (sp === "bouclier_on") S.bouclier = true;
    if (sp === "bouclier_off") S.bouclier = false;
    if (sp === "flex_ue" && !S.flexUE) {
      if (rnd01() < (S.e.deficitPct < 5.2 && S.e.confianceMarches > 35 ? 0.62 : 0.38)) {
        S.flexUE = true;
        S.e.confianceMarches = clamp(S.e.confianceMarches + 3, 0, 100);
        log("La Commission accorde une flexibilité nationale, surtout au titre de la défense. Les marchés le notent. Ce n'est pas un blanc-seing sur le déficit courant.", "pos");
      } else log("Bruxelles refuse la flexibilité : la trajectoire n'est pas jugée assez étayée.", "neg");
    }
  }
  S.greve = clamp(S.greve + a.greve, 0, 100);
  S.e.tensionSociale = clamp(S.e.tensionSociale + a.greve * 0.15, 0, 100);
  const mode = (meta && meta.mode) || "vote";
  S.popPM = clamp(S.popPM + clamp(a.popularite, -3, 3) - (mode === "493" ? 2.4 : 0.2), 5, 74);
  S.popPresident = clamp(S.popPresident + clamp(a.popularite, -3, 3) * 0.45 - (mode === "493" ? 0.7 : 0), 5, 74);
  if (S.titulaire) S.e.popularite = S.role === "president" ? S.popPresident : S.popPM;
  if (a.greve >= 18) log("L'intersyndicale appelle à une journée nationale de grèves et de manifestations.", "neg");
  for (const row of a.votes.detail) {
    if (!S.relations[row.id] && S.relations[row.id] !== 0) continue;
    if (row.vote === "pour") S.relations[row.id] = clamp(S.relations[row.id] + 3, 0, 100);
    if (row.vote === "contre") S.relations[row.id] = clamp(S.relations[row.id] - 3, 0, 100);
    if (row.lignes && row.lignes.length) S.relations[row.id] = clamp(S.relations[row.id] - 7, 0, 100);
  }
  for (const gid in (d.concessions || {})) if (d.concessions[gid] && S.relations[gid] != null) S.relations[gid] = clamp(S.relations[gid] + 6, 0, 100);
  S.derniereOrientation = a.orientation;
  S.derniereCensurePour = a.censure.pour;
  S.lois = S.lois || [];
  S.lois.unshift({ d: `T${S.tri} ${S.annee}`, solde: a.solde, mode, origine: (meta && meta.origine) || "parlement" });
  if (S.lois.length > 40) S.lois.length = 40;
  const qui = a.votes.detail.filter(x => x.vote === "pour" && x.id !== "ni").map(x => x.p).slice(0, 6).join(", ");
  log(`Loi promulguée (${meta && meta.origine ? meta.origine : "parlement"}, ${mode === "493" ? "après 49.3" : "vote"}). Solde ${a.solde >= 0 ? "+" : ""}${f1(a.solde)} Md€/an. Impulsion de croissance estimée ${f1(a.impulse)} point, étalée sur ${a.delai} trimestres. Vote favorable notamment : ${qui || "—"}.`, a.solde >= 0 ? "pos" : "neg", reactionsLoi(a, d));
  if (a.solde < -10) S.e.confianceMarches = clamp(S.e.confianceMarches - 4, 0, 100);
  if (a.solde > 12) S.e.confianceMarches = clamp(S.e.confianceMarches + 3, 0, 100);
  return { ok: true, analyse: a };
}

function ouvrirNegociation() {
  if (!peutGouverner()) return { ok: false, raison: "Vous ne conduisez pas la politique intérieure." };
  assurerDraft();
  const d = draftEffectif();
  const a = analyse(d);
  S.procedure = { etape: a.cc.length ? "bloque" : "negociation", mode: null, amendement: "aucun" };
  return { ok: !a.cc.length, cc: a.cc, analyse: a };
}
function accorder(gid, cid) {
  const d = assurerDraft();
  if (!d.concessions) d.concessions = {};
  d.concessions[gid] = d.concessions[gid] === cid ? null : cid;
  return d.concessions[gid];
}
function scrutin() {
  if (!peutGouverner()) return { ok: false, raison: "opposition" };
  if (!S.procedure || S.procedure.etape === "bloque" || !S.procedure) ouvrirNegociation();
  const d = draftEffectif();
  const a = analyse(d);
  if (a.cc.length) { S.procedure = { etape: "bloque" }; return { ok: false, cc: a.cc }; }
  S.procedure = { etape: a.votes.adopte ? "senat" : "rejete_an", mode: "vote", amendement: "aucun", votes: a.votes };
  if (a.votes.adopte) log(`L'Assemblée adopte le texte en première lecture : ${a.votes.pour} pour, ${a.votes.contre} contre, ${a.votes.abst} abstentions. Majorité relative des exprimés. Le texte part au Sénat.`, "pos");
  else log(`L'Assemblée rejette le texte : ${a.votes.pour} pour, ${a.votes.contre} contre. Il reste le retrait, une concession, ou le 49.3.`, "neg");
  return { ok: true, adopte: a.votes.adopte, rejete: !a.votes.adopte, votes: a.votes };
}
function engager493() {
  if (!peutGouverner()) return { ok: false, raison: "Le 49.3 est l'arme du Gouvernement, pas de l'opposition." };
  const d = draftEffectif();
  const a = analyse(d);
  if (a.cc.length) return { ok: false, cc: a.cc };
  if (!a.finance && (S.quota493 || 0) >= (D.institutions.quota493HorsBudget || 1)) {
    log("49.3 impossible : le quota d'un texte hors lois de finances et de financement de la sécurité sociale est déjà utilisé pour cette session ordinaire.", "neg");
    return { ok: false, raison: "quota" };
  }
  if (S.role === "pm" && S.autoriser493 === false) {
    log("L'Élysée refuse d'engager la responsabilité du Gouvernement sur ce texte.", "neg");
    return { ok: false, raison: "élysée" };
  }
  S.n493 = (S.n493 || 0) + 1;
  if (!a.finance) S.quota493 = (S.quota493 || 0) + 1;
  log(`Le Gouvernement engage sa responsabilité (article 49 alinéa 3, n°${S.n493}${a.finance ? ", loi financière" : ", texte hors budget"}). Une motion de censure est déposée.`, "neg");
  if (a.censure.adoptee) {
    const noms = a.censure.detail.filter(x => x.oui).map(x => `${x.p} (${x.sieges})`).join(", ");
    log(`La motion de censure est adoptée : ${a.censure.pour} voix, seuil ${a.censure.seuil}. Votent la censure : ${noms}.`, "neg");
    chuteGouvernement("49.3");
    return { ok: false, censure: true, pour: a.censure.pour };
  }
  log(`La motion échoue : ${a.censure.pour} voix sur ${a.censure.seuil}. Le texte est acquis à l'Assemblée. Le Sénat l'examine encore.`, "");
  S.procedure = { etape: "senat", mode: "493", amendement: "aucun", votes: a.votes, censure: a.censure };
  S.usure493 = (S.usure493 || 0) + 2;
  return { ok: true, censure: false, pour: a.censure.pour };
}
function scoreSenatGroupe(g, d, a) {
  let s = 0;
  if (g.axe === "droite") s = 8 + a.orientation * 0.55 + clamp(a.solde, -15, 15) * 0.7;
  else if (g.axe === "centre") s = 16 + a.orientation * 0.2 + clamp(a.solde, -15, 15) * 0.45;
  else if (g.axe === "gauche") s = -12 - a.orientation * 0.65;
  else if (g.axe === "ecolo") s = -6 + (d.mesures.climat === "accelerer" ? 22 : 0) - (d.mesures.climat === "pause" ? 18 : 0) - (d.mesures.mercosur === "ratifier" ? 20 : 0);
  else if (g.axe === "extreme") s = -18 + (d.mesures.immigration === "ferme" ? 28 : 0) - (d.mesures.immigration === "regularisation" ? 24 : 0);
  if ((g.axe === "gauche" || g.axe === "ecolo") && d.age > S.ret.ageLegal + 0.2) s -= 16;
  return s;
}
function votesSenat(d) {
  const a = analyse(d);
  let pour = 0, contre = 0, abst = 0;
  const detail = [];
  for (const g of D.senat.groupes) {
    const s = scoreSenatGroupe(g, d, a);
    let vote = s >= 8 ? "pour" : s >= -4 ? "abstention" : "contre";
    if (vote === "pour") pour += g.s;
    else if (vote === "contre") contre += g.s;
    else abst += g.s;
    detail.push({ id: g.id, p: g.p, s: g.s, vote, score: Math.round(s) });
  }
  return { pour, contre, abst, detail, adopte: pour > contre, analyse: a };
}
function examenSenat(amendementId) {
  if (!S.procedure || (S.procedure.etape !== "senat" && S.procedure.etape !== "negociation")) {
    return { ok: false, raison: "Le texte n'est pas devant le Sénat." };
  }
  const amend = amendementId || "aucun";
  S.procedure.amendement = amend;
  const d = draftEffectif({ amendement: amend === "aucun" ? null : amend });
  const v = votesSenat(d);
  S.procedure.votesSenat = v;
  if (v.adopte) {
    const res = appliquerLoi(d, { origine: amend === "aucun" ? "Assemblée et Sénat conformes" : "texte modifié pour le Sénat", mode: S.procedure.mode || "vote" });
    S.procedure = { etape: "terminee", resultat: "adopte" };
    log(`Le Sénat adopte (${v.pour} pour, ${v.contre} contre). ${amend === "aucun" ? "Le texte est conforme." : "La version amendée est promulguée (simplification : le Gouvernement a repris l'amendement)."}`, "pos");
    return { ok: true, adopte: true, applique: res.ok };
  }
  const proba = clamp(0.34 + (amend !== "aucun" ? 0.1 : 0) + clamp(v.analyse.solde, -12, 12) * 0.008 - (S.cohabitation ? 0.08 : 0), 0.08, 0.9);
  S.procedure.etape = "cmp";
  S.procedure.probaCmp = proba;
  log(`Le Sénat ne suit pas (${v.pour} pour, ${v.contre} contre). Commission mixte paritaire. Chance estimée de compromis : ${f0(proba * 100)} %.`, "neg");
  return { ok: true, adopte: false, cmp: true, proba };
}
function conclureCMP() {
  if (!S.procedure || S.procedure.etape !== "cmp") return { ok: false, raison: "Pas de CMP en cours." };
  const amend = S.procedure.amendement || "aucun";
  const dAss = draftEffectif();
  const dCmp = draftEffectif({ amendement: amend === "aucun" ? null : amend });
  const a = analyse(dAss);
  const ok = rnd01() < (S.procedure.probaCmp || 0.4);
  if (ok) {
    appliquerLoi(dCmp, { origine: "compromis de CMP", mode: S.procedure.mode || "vote" });
    log("La CMP aboutit. Les deux chambres sont réputées adopter le compromis.", "pos");
    S.procedure = { etape: "terminee", resultat: "cmp" };
    return { ok: true, cmp: true };
  }
  if (a.finance) {
    appliquerLoi(dAss, { origine: "dernier mot de l'Assemblée (texte financier)", mode: S.procedure.mode || "vote" });
    S.e.tensionSociale = clamp(S.e.tensionSociale + 3, 0, 100);
    log("La CMP échoue. Sur ce texte financier, l'Assemblée a le dernier mot (simplification de la navette budgétaire). Le texte de l'Assemblée est promulgué.", "");
    S.procedure = { etape: "terminee", resultat: "dernier_mot" };
    return { ok: true, dernierMot: true };
  }
  log("La CMP échoue. Ce n'est pas une loi de finances : le texte est abandonné.", "neg");
  S.e.popularite = clamp(S.e.popularite - 1, 5, 75);
  S.procedure = { etape: "terminee", resultat: "echec" };
  return { ok: false, abandon: true };
}
function meilleurAmendement() {
  let best = "aucun", bestScore = -1e9;
  for (const am of D.senat.amendements) {
    const d = draftEffectif({ amendement: am.id === "aucun" ? null : am.id });
    const v = votesSenat(d);
    const marge = v.pour - v.contre;
    if (marge > bestScore) { bestScore = marge; best = am.id; }
  }
  return best;
}
function bouclerTexte() {
  if (!peutGouverner()) return { ok: false, raison: "opposition" };
  const ouv = ouvrirNegociation();
  if (ouv.cc && ouv.cc.length) return { ok: false, cc: ouv.cc };
  for (let n = 0; n < 3; n++) {
    const a = analyse(draftEffectif());
    if (a.votes.pour > a.votes.contre) break;
    const cible = choisirConcession(a);
    if (!cible) break;
    accorder(cible.gid, cible.cid);
  }
  const r = scrutin();
  if (r && r.rejete) {
    const r2 = engager493();
    if (r2 && r2.censure) return { ok: false, censure: true };
    if (r2 && r2.ok === false && r2.raison) return r2;
  }
  if (S.procedure && S.procedure.etape === "senat") examenSenat(meilleurAmendement());
  if (S.procedure && S.procedure.etape === "cmp") conclureCMP();
  return { ok: true };
}
function choisirConcession(a) {
  const essais = [];
  for (const row of a.votes.detail) {
    if (row.vote === "pour" || row.id === "vac" || row.id === "ni") continue;
    const g = groupeData(row.id);
    if (!g || !(g.concessions || []).length) continue;
    if (assurerDraft().concessions[row.id]) continue;
    for (const c of g.concessions) essais.push({ gid: row.id, cid: c.id, sieges: row.s });
  }
  essais.sort((x, y) => y.sieges - x.sieges);
  for (const e of essais) {
    accorder(e.gid, e.cid);
    const a2 = analyse(draftEffectif());
    const cc = a2.cc.length > 0;
    const mieux = a2.votes.pour > a.votes.pour && !cc;
    accorder(e.gid, e.cid); // retire pour laisser l'appelant accorder
    if (mieux) return e;
  }
  return null;
}

/* ---------- Retraites type COR ---------- */
function calibrerSalaire() {
  const r = S.ret;
  const pensionsMd = r.demo.retraitesM * r.pensionMoyMensuelle * 12 / 1000;
  const cotisations = pensionsMd + r.soldeMd;
  const masse = cotisations / (r.tauxCotisation / 100);
  r.salaireMoyenAnnuel = masse * 1000 / r.demo.cotisantsM;
}
function soldeRetraite(st, taux) {
  const pensionsMd = st.ret * st.pension * 12 / 1000;
  const cotisationsMd = st.cot * st.salaire / 1000 * (taux / 100);
  return { pensionsMd, cotisationsMd, solde: cotisationsMd - pensionsMd };
}
function etatRetraite() {
  const r = S.ret;
  return {
    pop: r.demo.populationM, cot: r.demo.cotisantsM, ret: r.demo.retraitesM,
    pension: r.pensionMoyMensuelle, salaire: r.salaireMoyenAnnuel
  };
}
function avancerRetraite(st, inf, params) {
  const index = params.indexation;
  const salGrowth = clamp(inf * 0.55 + 0.65 - Math.max(0, S.e.chomage - 8) * 0.12, -1, 6);
  let pensGrowth = index === "prix" ? inf * 0.95 : index === "salaires" ? salGrowth : index === "gel" ? 0 : (inf * 0.95 + salGrowth) / 2;
  st.pension *= 1 + pensGrowth / 100;
  st.salaire *= 1 + salGrowth / 100;
  const nat = (params.demo.natalitePourMille || 10.6) / 1000;
  const mor = (params.demo.mortalitePourMille || 9.4) / 1000;
  st.pop = Math.max(50, st.pop + st.pop * (nat - mor) + (params.demo.soldeMigratoireMilliers || 0) / 1000);
  const gRet = 0.012 - 0.016 * (params.ageLegal - 62.75) - 0.00085 * (params.dureeTrimestres - 171);
  st.ret = Math.max(8, st.ret * (1 + gRet));
  const gCot = 0.0005 + (params.demo.soldeMigratoireMilliers || 0) / 1000 / st.pop - 0.0022 - Math.max(0, S.e.chomage - 8) * 0.0012;
  st.cot = Math.max(12, st.cot * (1 + gCot));
  return st;
}
function projectionRetraites() {
  const params = S.ret;
  const st = etatRetraite();
  const rows = [];
  let infCible = S.e.inflation;
  for (let i = 0; i < 25; i++) {
    const sld = soldeRetraite(st, params.tauxCotisation);
    rows.push({
      annee: S.annee + i, population: st.pop, cotisants: st.cot, retraites: st.ret,
      ratio: st.cot / st.ret, pension: st.pension, salaire: st.salaire,
      cotisationsMd: sld.cotisationsMd, pensionsMd: sld.pensionsMd, solde: sld.solde,
      age: params.ageLegal, duree: params.dureeTrimestres, indexation: params.indexation, taux: params.tauxCotisation
    });
    infCible = 2 + (infCible - 2) * 0.72;
    avancerRetraite(st, infCible, params);
  }
  return rows;
}
function pasAnnuelRetraites() {
  const avant = soldeRetraite(etatRetraite(), S.ret.tauxCotisation).solde;
  const st = etatRetraite();
  avancerRetraite(st, S.e.inflation, S.ret);
  S.ret.demo.populationM = st.pop;
  S.ret.demo.cotisantsM = st.cot;
  S.ret.demo.retraitesM = st.ret;
  S.ret.pensionMoyMensuelle = st.pension;
  S.ret.salaireMoyenAnnuel = st.salaire;
  const apres = soldeRetraite(st, S.ret.tauxCotisation).solde;
  S.ret.soldeMd = apres;
  S.ret.ratioCotRet = st.cot / st.ret;
  const besoin = Math.max(0, -apres) - Math.max(0, -avant);
  S.dep.retraites = Math.max(0, S.dep.retraites + besoin * 0.35);
  log(`Modèle retraites (pas annuel) : solde ${f1(apres)} Md€, ratio cotisants/retraités ${f2(S.ret.ratioCotRet)}, pension moyenne ${f0(S.ret.pensionMoyMensuelle)} €. ${besoin > 0.4 ? "La subvention d'équilibre pèse un peu plus sur le budget de l'État." : "Le besoin de financement du système évolue peu cette année."}`);
}

/* ---------- Sondages ---------- */
function conjonctureCandidat(c) {
  const e = S.e;
  let s = 0;
  if (c.famille === "gauche" || c.famille === "ecolo") {
    s += (e.chomage - 8) * 0.5;
    s += (e.pauvrete - 14) * 0.32;
    s += (e.gini - 0.29) * 35;
    s += Math.max(0, S.ret.ageLegal - 63) * 2;
  }
  if (c.famille === "ecolo") s += ((S.salience.climat || 40) - 40) * 0.08;
  if (c.famille === "extreme") {
    s += ((S.salience.immigration || 40) - 40) * 0.11;
    s += ((S.salience.securite || 40) - 40) * 0.07;
    s += (e.tensionSociale - 50) * 0.05;
    s += Math.max(0, 45 - e.confianceMarches) * 0.04;
  }
  if (c.famille === "centre") {
    s += (e.croissance - 0.4) * 2;
    s -= Math.max(0, e.deficitPct - 5) * 0.4;
    s -= Math.max(0, e.inflation - 2.5) * 0.3;
    s += (S.popPresident - 32) * 0.1;
  }
  if (c.famille === "droite") {
    s += ((S.salience.securite || 40) - 40) * 0.06;
    s += Math.max(0, 5.2 - e.deficitPct) * 0.3;
  }
  if (c.joueur) {
    const pop = S.titulaire ? (S.role === "president" ? S.popPresident : S.popPM) : (S.popOpposition || 30);
    s += (pop - 30) * 0.16;
  }
  if (S.campPresident === campDeFamille(c.famille) && S.annee > 2027) s += 2.2;
  return s;
}
function campDeFamille(f) {
  if (f === "centre") return "central";
  if (f === "extreme") return "rn";
  if (f === "droite") return "droite";
  if (f === "gauche" || f === "ecolo") return "gauche";
  return "central";
}
function intentionsBrutes(cat) {
  const cs = D.candidats2027.map(c => {
    let s = Math.max(0.35, c.base + conjonctureCandidat(c));
    if (cat) s *= (c.profil && c.profil[cat]) || 1;
    return s;
  });
  const t = cs.reduce((a, b) => a + b, 0) || 1;
  return cs.map(s => s / t * 100);
}
function modeleSondages() {
  const cats = {};
  for (const c of D.categoriesSondage) cats[c.id] = intentionsBrutes(c.id);
  const global = intentionsBrutes(null);
  const noms = D.candidats2027.map(c => c.n);
  const blocs = { central: 0, gauche: 0, rn: 0, droite: 0, ecolo: 0 };
  D.candidats2027.forEach((c, i) => {
    const camp = c.famille === "centre" ? "central" : c.famille === "extreme" ? "rn" : c.famille === "droite" ? "droite" : c.famille === "ecolo" ? "ecolo" : "gauche";
    blocs[camp] += global[i];
  });
  return {
    annee: S.annee, tri: S.tri,
    popularite: { president: S.popPresident, pm: S.popPM, opposition: S.popOpposition || 30 },
    intentions: noms.map((n, i) => ({ n, p: D.candidats2027[i].p, c: D.candidats2027[i].c, v: global[i], joueur: !!D.candidats2027[i].joueur })),
    categories: cats,
    blocs
  };
}
function publierSondage(initial) {
  const m = modeleSondages();
  m.intentions.forEach(x => { x.v = clamp(x.v + (initial ? 0 : rnd(-0.6, 0.6)), 0.2, 70); });
  const t = m.intentions.reduce((a, b) => a + b.v, 0) || 1;
  m.intentions.forEach(x => { x.v = x.v / t * 100; });
  S.sondages = S.sondages || [];
  S.sondages.unshift(m);
  if (S.sondages.length > 40) S.sondages.length = 40;
  if (!initial) {
    const top = [...m.intentions].sort((a, b) => b.v - a.v).slice(0, 3).map(x => `${x.n} ${f0(x.v)} %`).join(", ");
    log(`Sondage trimestriel (modèle, pas un institut) : popularité présidentielle ${f0(m.popularite.president)} %, Matignon ${f0(m.popularite.pm)} %. Intentions : ${top}.`);
  }
  return m;
}

/* ---------- Parlement : dissolution, majorité, rôles ---------- */
function delaiDepuisDissolution() {
  if (!S.dissolution) return 99;
  return (S.annee - S.dissolution.annee) * 4 + (S.tri - S.dissolution.tri);
}
function peutDissoudre() {
  if (!S || S.role !== "president" || !S.titulaire) return { ok: false, raison: "Seul le Président de la République en fonction dissout l'Assemblée (article 12)." };
  const besoin = D.institutions.dissolutionDelaiTrimestres || 4;
  const d = delaiDepuisDissolution();
  if (d < besoin) return { ok: false, raison: `Délai d'un an non écoulé : encore ${besoin - d} trimestre(s).` };
  return { ok: true, raison: "Le délai de l'article 12 est écoulé. La dissolution de 2024 est antérieure de plus d'un an au début de la partie." };
}
function simulerLegislatives(bruit) {
  const bases = { ...D.legislatives.bases };
  const fam = { rn: "extreme", udr: "extreme", lfi: "gauche", ps: "gauche", gdr: "gauche", ecolo: "ecolo", epr: "centre", dem: "centre", hor: "centre", lr: "droite", liot: "local", ni: "local" };
  const adj = {
    extreme: ((S.salience.immigration || 50) - 45) * 0.1 + ((S.salience.securite || 50) - 45) * 0.06 + (50 - S.e.confianceMarches) * 0.04,
    gauche: (S.e.chomage - 8) * 0.55 + (S.e.pauvrete - 14) * 0.3 + Math.max(0, S.ret.ageLegal - 63) * 2,
    centre: (S.e.croissance - 0.4) * 1.6 - Math.max(0, S.e.deficitPct - 5) * 0.35 + (S.popPresident - 32) * 0.08,
    droite: ((S.salience.securite || 50) - 45) * 0.05 + Math.max(0, 5.2 - S.e.deficitPct) * 0.3,
    ecolo: ((S.salience.climat || 40) - 40) * 0.08,
    local: ((S.secteurs.collectivites.tension || 50) - 50) * 0.05
  };
  const raw = {};
  let sum = 0;
  for (const id in bases) {
    let v = bases[id] + (adj[fam[id]] || 0);
    if (dansCoalition(id)) v += (S.e.popularite - 35) * 0.06;
    if (bruit) v += rnd(-0.7, 0.7);
    v = Math.max(0.3, v);
    raw[id] = v; sum += v;
  }
  for (const id in raw) raw[id] = raw[id] / sum * 100;
  const expo = S.proportionnelle ? 1.05 : 1.3;
  const w = {};
  let sw = 0;
  const front = clamp(S.frontRepublicain || 0.5, 0.15, 0.9);
  for (const id in raw) {
    let a = Math.pow(raw[id], expo);
    if (!S.proportionnelle && (id === "rn" || id === "udr")) a *= (1 - 0.34 * front);
    w[id] = a; sw += a;
  }
  const seats = {};
  let assigned = 0;
  const rems = [];
  for (const id in w) {
    const exact = w[id] / sw * D.institutions.siegesAssemblee;
    seats[id] = Math.floor(exact);
    assigned += seats[id];
    rems.push({ id, r: exact - seats[id] });
  }
  rems.sort((a, b) => b.r - a.r);
  let i = 0;
  while (assigned < D.institutions.siegesAssemblee && rems.length) {
    seats[rems[i % rems.length].id]++; assigned++; i++;
    if (i > 800) break;
  }
  const floors = D.legislatives.planchers || {};
  for (const id in floors) {
    if ((seats[id] || 0) >= floors[id]) continue;
    let need = floors[id] - (seats[id] || 0);
    seats[id] = (seats[id] || 0) + need;
    let guard = 0;
    while (need > 0 && guard++ < 40) {
      const donor = Object.keys(seats).filter(k => k !== id && seats[k] > (floors[k] || 1)).sort((a, b) => seats[b] - seats[a])[0];
      if (!donor) break;
      seats[donor]--; need--;
    }
  }
  let s2 = Object.values(seats).reduce((a, b) => a + b, 0);
  if (s2 !== 577) {
    const donor = Object.keys(seats).sort((a, b) => seats[b] - seats[a])[0];
    seats[donor] += 577 - s2;
  }
  for (const id in seats) seats[id] = Math.max(0, seats[id]);
  if (bruit) S.dernierVotesLeg = raw;
  return seats;
}
function appliquerSieges(seats) {
  for (const g of S.assemblee) g.s = g.id === "vac" ? 0 : (seats[g.id] || 0);
  let sum = S.assemblee.reduce((a, g) => a + g.s, 0);
  if (sum !== 577) {
    const g = S.assemblee.find(x => x.id === "epr") || S.assemblee[0];
    g.s += 577 - sum;
  }
}
function groupesCoalition(camp) {
  if (camp === "central") return ["epr", "dem", "hor"];
  if (camp === "gauche") return ["ps", "ecolo", "gdr"];
  if (camp === "rn") return ["rn", "udr"];
  if (camp === "droite") return ["lr"];
  if (camp === "local") return ["liot"];
  return ["epr"];
}
function recomposerMajorite(motif) {
  const sc = id => sieges(id);
  const scores = {
    central: sc("epr") + sc("dem") + sc("hor") + sc("liot") * 0.35 + sc("lr") * 0.25,
    gauche: sc("ps") + sc("ecolo") + sc("gdr") + sc("lfi") * 0.45,
    rn: sc("rn") + sc("udr") + (S.frontRepublicain < 0.4 ? sc("lr") * 0.35 : 0),
    droite: sc("lr") + sc("liot") * 0.2
  };
  let camp = "central", best = -1;
  for (const k in scores) if (scores[k] > best) { best = scores[k]; camp = k; }
  const avant = S.titulaire;
  S.campGouvernement = camp;
  S.coalition = groupesCoalition(camp);
  S.cohabitation = camp !== S.campPresident;
  if (S.role === "pm") {
    const retour = camp === "central";
    if (retour && !S.titulaire) log("Le bloc central retrouve Matignon. Vous êtes rappelé au Gouvernement.", "pos");
    if (!retour && S.titulaire) log("Vous quittez Matignon. La partie continue : vous êtes dans l'opposition, jusqu'en 2032 ou jusqu'à un retour de votre camp.", "neg");
    S.titulaire = retour;
    S.fonction = retour ? "pouvoir" : "opposition";
  }
  log(`Après ${motif}, le Gouvernement s'appuie sur le bloc ${nomCamp(camp)} (${siegesCoalition()} sièges, majorité absolue ${D.institutions.majoriteAbsolue}). ${S.cohabitation ? "C'est une cohabitation." : "Le Président et le Gouvernement sont du même bord."}`, S.cohabitation ? "neg" : "");
  return { camp, retour: S.role === "pm" && S.titulaire && !avant };
}
function nomCamp(c) {
  return { central: "central (EPR, Démocrates, Horizons)", gauche: "de gauche (PS, Écologistes, GDR ; LFI en soutien éventuel)", rn: "RN-UDR", droite: "Droite républicaine", local: "LIOT" }[c] || c;
}
function executerDissolution(motif) {
  if (delaiDepuisDissolution() < (D.institutions.dissolutionDelaiTrimestres || 4)) {
    log("Dissolution impossible : le délai d'un an de l'article 12 n'est pas écoulé.", "neg");
    return { ok: false };
  }
  const seats = simulerLegislatives(true);
  appliquerSieges(seats);
  S.dissolution = { annee: S.annee, tri: S.tri, motif };
  const ligne = [...S.assemblee].filter(g => g.id !== "vac").sort((a, b) => b.s - a.s).map(g => `${g.p} ${g.s}`).join(", ");
  log(`Dissolution (${motif}). Législatives anticipées, modèle à deux tours (prime majoritaire${S.proportionnelle ? " atténuée par la proportionnelle" : ""}, front républicain ${(S.frontRepublicain * 100).toFixed(0)} %). Sièges : ${ligne}.`, "");
  recomposerMajorite("les législatives anticipées");
  S.offreDissolution = false;
  return { ok: true, seats };
}
function dissoudre() {
  const p = peutDissoudre();
  if (!p.ok) { log(p.raison, "neg"); return p; }
  return executerDissolution("décision du Président");
}
function demanderDissolution() {
  if (S.role !== "pm" || !S.titulaire) return { ok: false, raison: "Seul le Premier ministre en fonction peut demander une dissolution, et seul le Président la décide." };
  if (delaiDepuisDissolution() < 4) return { ok: false, raison: "Le délai d'un an court encore. Le Président ne peut pas dissoudre." };
  const sond = modeleSondages();
  const accepte = (sond.blocs.central || 0) > 28 && S.e.tensionSociale > 58 && (S.confiancePresident || 50) > 28 && rnd01() < 0.55;
  if (accepte) {
    log("Le Président accepte de dissoudre, sur votre demande.");
    return executerDissolution("demande du Premier ministre acceptée par le Président");
  }
  S.confiancePresident = clamp((S.confiancePresident || 60) - 6, 0, 100);
  log("Le Président refuse la dissolution : le calendrier ou le risque électoral ne lui convient pas.", "neg");
  return { ok: false, raison: "Refus du Président." };
}
function nommerPM(groupeId) {
  const g = groupeData(groupeId);
  if (!g || g.camp === "aucun") return { ok: false };
  if (S.role !== "president" || !S.titulaire) return { ok: false, raison: "La nomination appartient au Président en fonction." };
  S.campGouvernement = g.camp;
  S.coalition = groupesCoalition(g.camp);
  S.cohabitation = S.campGouvernement !== S.campPresident;
  S.choixPM = false;
  log(`Vous nommez à Matignon une figure du groupe ${S.assemblee.find(x => x.id === groupeId).p}. Bloc ${nomCamp(g.camp)}, ${siegesCoalition()} sièges. ${S.cohabitation ? "Vous entrez en cohabitation : la politique intérieure vous échappe en grande partie." : "Le Gouvernement reste de votre bord."}`, S.cohabitation ? "neg" : "pos");
  return { ok: true };
}
function chuteGouvernement(motif) {
  S.chutes = (S.chutes || 0) + 1;
  S.chuteRecente = 3;
  S.paralysie = 1;
  S.e.confianceMarches = clamp(S.e.confianceMarches - 8, 0, 100);
  S.popPM = clamp(S.popPM - 7, 5, 70);
  S.popPresident = clamp(S.popPresident - 3, 5, 70);
  S.procedure = null;
  log(`Le Gouvernement est renversé (${motif}). Les marchés sanctionnent l'instabilité. Un Premier ministre doit être nommé.`, "neg", [
    { qui: "Présidents de groupe de l'opposition", texte: "« La censure est l'arme de l'article 49, pas un accident. »" },
    { qui: "Agence France Trésor", texte: "« Les adjudications continuent. Le prix, lui, intègre l'incertitude politique. »" }
  ]);
  if (S.role === "president" && S.titulaire) {
    if (isBrowser) { S.choixPM = true; if (isBrowser) render(); }
    else {
      const hors = [...S.assemblee].filter(g => g.id !== "vac" && !dansCoalition(g.id)).sort((a, b) => b.s - a.s)[0];
      nommerPM((hors && hors.id) || "epr");
    }
    return;
  }
  if (S.role === "pm" && S.campPresident === "central" && S.chutes < 3 && rnd01() < 0.65) {
    log("Le Président vous renomme. La majorité reste étroite, la confiance de l'Élysée a baissé.", "neg");
    S.confiancePresident = clamp((S.confiancePresident || 60) - 18, 0, 100);
    S.titulaire = true;
    S.fonction = "pouvoir";
    return;
  }
  recomposerMajorite("la censure");
}
function referendum(id) {
  if (S.role !== "president" || !S.titulaire) return { ok: false, raison: "Le référendum de l'article 11 est une prérogative du Président en fonction." };
  const besoin = D.institutions.referendumDelaiTrimestres || 8;
  const delai = S.dernierReferendum ? (S.annee - S.dernierReferendum.annee) * 4 + (S.tri - S.dernierReferendum.tri) : 99;
  if (delai < besoin) return { ok: false, raison: `Délai de deux ans non écoulé (${besoin - delai} trimestre(s)).` };
  S.dernierReferendum = { annee: S.annee, tri: S.tri };
  if (id === "immigration" && rnd01() < 0.6) {
    log("Le Conseil constitutionnel estime que cette question d'immigration n'entre pas dans le champ de l'article 11. Le référendum n'a pas lieu. Une révision constitutionnelle serait une autre procédure.", "neg");
    return { ok: false, censure: true };
  }
  if (id === "retraites" && rnd01() < 0.28) {
    log("Le décret soumettant la question des retraites est censuré : le Conseil constitutionnel retient une lecture étroite de l'article 11.", "neg");
    return { ok: false, censure: true };
  }
  const bonus = id === "proportionnelle" ? 3 : id === "retraites" ? -3 : -1;
  const oui = clamp(43 + (S.popPresident - 40) * 0.4 + bonus + rnd(-4, 4), 25, 75);
  if (oui >= 50) {
    log(`Le référendum est adopté (${f1(oui)} % de oui).`, "pos");
    if (id === "proportionnelle") { S.proportionnelle = true; S.frontRepublicain = clamp(S.frontRepublicain - 0.1, 0.2, 0.9); }
    if (id === "retraites") S.ret.ageLegal = Math.max(62, S.ret.ageLegal - 0.25);
    if (id === "immigration") S.secteurs.securite.oqtf += 4;
    S.popPresident = clamp(S.popPresident + 3, 5, 75);
  } else {
    log(`Le référendum est rejeté (${f1(oui)} % de oui). L'échec retombe sur le Président.`, "neg");
    S.popPresident = clamp(S.popPresident - 6, 5, 75);
    S.e.tensionSociale = clamp(S.e.tensionSociale + 5, 0, 100);
  }
  if (S.role === "president" && S.titulaire) S.e.popularite = S.popPresident;
  return { ok: true, oui };
}
function actionOpposition(type) {
  if (peutGouverner()) return { ok: false, raison: "Vous êtes aux affaires : passez par une loi, pas par une tribune d'opposition." };
  if (S.oppositionFaite === S.tour) return { ok: false, raison: "Vous avez déjà agi ce trimestre." };
  S.oppositionFaite = S.tour;
  if (type === "tribune") {
    S.popOpposition = clamp((S.popOpposition || 30) + 1.4, 8, 60);
    S.salience.pouvoirAchat = clamp(S.salience.pouvoirAchat + 3, 0, 100);
    S.e.popularite = S.popOpposition;
    log("Tribune d'opposition : vous cadrez le débat sur le pouvoir d'achat et la compétence du Gouvernement. Effet limité, mais il existe.", "");
    return { ok: true };
  }
  if (type === "censure") {
    const base = S.derniereCensurePour || 160;
    const voix = Math.round(base * (S.e.tensionSociale > 78 ? 0.95 : 0.7));
    if (voix >= D.institutions.majoriteAbsolue) {
      log(`Votre motion de censure spontanée recueille ${voix} voix. Elle est adoptée.`, "neg");
      chuteGouvernement("motion spontanée");
      return { ok: true, adoptee: true, voix };
    }
    log(`Motion de censure spontanée rejetée : ${voix} voix, seuil ${D.institutions.majoriteAbsolue}. Hors 49.3, les oppositions hésitent davantage à se mêler.`, "");
    return { ok: true, adoptee: false, voix };
  }
  log("Proposition de loi d'opposition : la conférence des présidents ne l'inscrit pas à un ordre du jour utile. Le geste existe, le texte non.", "");
  S.popOpposition = clamp((S.popOpposition || 30) + 0.4, 8, 60);
  return { ok: true };
}
function politiqueAI() {
  if (peutGouverner()) return;
  if (S.tri !== 4) return;
  const camp = S.campGouvernement;
  const d = draftVierge();
  if (camp === "central") { d.dep.autres = -1.5; d.dep.sante = 0.4; d.age = Math.min(64.5, S.ret.ageLegal + 0.25); }
  else if (camp === "gauche") { d.taux.IR = Math.min(130, S.taux.IR + 6); d.dep.sante = 2; d.dep.education = 1.5; d.smic = 1.5; d.age = Math.max(62, S.ret.ageLegal - 0.25); d.mesures.climat = "accelerer"; }
  else if (camp === "rn") { d.mesures.immigration = "ferme"; d.dep.securite = 3; d.dep.autres = -1; }
  else if (camp === "droite") { d.taux.IS = Math.max(18, S.taux.IS - 1); d.dep.autres = -2; d.age = Math.min(65, S.ret.ageLegal + 0.25); }
  for (const k in d.dep) d.dep[k] *= 0.8;
  let eff = materialiser(d);
  let a = analyse(eff);
  if (a.cc.length || a.censure.adoptee) {
    d.age = S.ret.ageLegal; d.smic = 0; d.taux = { ...S.taux }; d.mesures = draftVierge().mesures;
    eff = materialiser(d);
    a = analyse(eff);
  }
  if (a.cc.length || a.censure.adoptee) {
    log("Le Gouvernement en place renonce à son texte de fin d'année : la censure ou le Conseil constitutionnel le rendrait intenable. Trimestre de paralysie.", "neg");
    S.paralysie = Math.max(S.paralysie || 0, 1);
    return;
  }
  appliquerLoi(eff, { origine: `gouvernement ${nomCamp(camp)} (automatique)`, mode: a.votes.adopte ? "vote" : "493" });
}

/* ---------- Élections ---------- */
function reports(from, to, other) {
  const front = S.frontRepublicain || 0.5;
  const ext = x => x === "extreme";
  if (from === to) return 0.76;
  if (ext(to) && !ext(other)) {
    if (from === "droite") return 0.4;
    if (from === "centre") return 0.12;
    if (from === "gauche" || from === "ecolo") return 0.08;
    if (from === "extreme") return 0.62;
    return 0.14;
  }
  if (ext(other) && !ext(to)) {
    let p = 0.46;
    if (from === "gauche" || from === "ecolo") p = (to === "centre" ? 0.6 : 0.4);
    if (from === "centre") p = 0.68;
    if (from === "droite") p = to === "centre" ? 0.52 : 0.46;
    if (from === "extreme") p = 0.18;
    return clamp(p + 0.1 * (front - 0.5), 0.05, 0.88);
  }
  if ((from === "gauche" || from === "ecolo") && (to === "gauche" || to === "ecolo")) return 0.7;
  if (from === "gauche" && to === "centre") return 0.46;
  if (from === "ecolo" && to === "centre") return 0.5;
  if (from === "centre" && to === "droite") return 0.38;
  if (from === "droite" && to === "centre") return 0.44;
  if (from === "centre" && to === "gauche") return 0.26;
  return 0.2;
}
function electionPresidentielle(annee) {
  const base = D.candidats2027.map((c, i) => ({ ...c, s: Math.max(0.4, c.base + conjonctureCandidat(c) + rnd(-1.6, 1.6)) }));
  const t = base.reduce((a, b) => a + b.s, 0);
  base.forEach(c => { c.s = c.s / t * 100; });
  base.sort((a, b) => b.s - a.s);
  const A = base[0], B = base[1];
  let va = A.s, vb = B.s;
  for (const c of base.slice(2)) {
    va += c.s * reports(c.famille, A.famille, B.famille);
    vb += c.s * reports(c.famille, B.famille, A.famille);
  }
  const tot = va + vb || 1;
  const rA = va / tot * 100, rB = vb / tot * 100;
  const gagnant = rA >= rB ? A : B;
  const scoreG = rA >= rB ? rA : rB;
  S.elections = S.elections || {};
  S.elections["p" + annee] = { t1: base.map(c => ({ n: c.n, p: c.p, c: c.c, s: c.s, joueur: !!c.joueur, famille: c.famille })), finale: [A.n, B.n], r2: [rA, rB], gagnant: gagnant.n, joueur: !!gagnant.joueur, score: scoreG };
  log(`Présidentielle ${annee}, second tour : ${gagnant.n} l'emporte avec ${f1(scoreG)} % des exprimés face à ${(gagnant === A ? B : A).n}.`, gagnant.joueur ? "pos" : "neg");
  if (annee === 2032) {
    S.fini = true;
    S.bilan = {
      gagnant: gagnant.n, joueur: !!gagnant.joueur,
      depart: S.depart,
      fin: { croissance: S.e.croissance, inflation: S.e.inflation, chomage: S.e.chomage, dettePct: S.e.dettePct, deficitPct: S.e.deficitPct, oat10: S.e.oat10, popularite: S.e.popularite, gini: S.e.gini, pauvrete: S.e.pauvrete, soldeRetraites: S.ret.soldeMd, ratio: S.ret.ratioCotRet, notation: S.e.notation }
    };
    log("Fin de partie : l'élection de 2032 clôt le scénario. Le bilan compare la situation de départ (paramètres) et l'état simulé.", gagnant.joueur ? "pos" : "");
    return;
  }
  S.campPresident = campDeFamille(gagnant.famille);
  if (S.role === "president") {
    if (gagnant.joueur) {
      S.titulaire = true; S.fonction = "pouvoir";
      S.popPresident = clamp(S.popPresident * 0.35 + 48, 38, 64);
      S.e.popularite = S.popPresident;
      log("Votre camp garde l'Élysée. Vous engagez le quinquennat suivant, avec l'état de grâce habituel, et les mêmes contraintes de majorité.", "pos");
    } else {
      S.titulaire = false; S.fonction = "opposition"; S.cohabitation = false;
      S.popOpposition = clamp(28 + rnd(-2, 2), 15, 45);
      S.e.popularite = S.popOpposition;
      log("Votre camp perd l'Élysée. Vous n'êtes plus Président. La partie continue jusqu'en 2032 : vous êtes chef de file de l'opposition.", "neg");
    }
  } else if (gagnant.joueur) {
    S.confiancePresident = 72;
    log("Le nouveau Président est de votre camp. Votre maintien à Matignon dépend de l'Assemblée.", "pos");
  } else {
    S.confiancePresident = 35;
    log("Le nouveau Président n'est pas de votre camp. S'il ne dissout pas, une cohabitation est possible tant que l'Assemblée vous porte.", "");
  }
  const hostile = S.campPresident !== S.campGouvernement;
  const delaiOk = delaiDepuisDissolution() >= 4;
  if (hostile && delaiOk) {
    if (S.role === "president" && S.titulaire && isBrowser) {
      S.offreDissolution = true;
      log("L'Assemblée n'est pas de votre bord. Vous pouvez dissoudre (tradition des débuts de quinquennat) ou tenter de gouverner avec elle.");
    } else {
      log("Le Président dissout l'Assemblée : elle est issue d'une autre majorité (pratique des débuts de quinquennat, quand le délai de l'article 12 le permet).");
      executerDissolution("dissolution qui suit la présidentielle");
    }
  } else {
    if (hostile && !delaiOk) log("Le nouveau Président voudrait dissoudre, mais le délai d'un an n'est pas écoulé. La cohabitation, ou le blocage, commence.", "neg");
    recomposerMajorite("l'élection présidentielle");
  }
}

/* ---------- Macro ---------- */
function calculSpread() {
  const e = S.e;
  let pb = 91;
  pb += 3.2 * (e.dettePct - 100);
  pb += 18 * (e.deficitPct - 3);
  pb += (60 - e.confianceMarches) * 1.1;
  pb += Math.max(0, e.tensionSociale - 40) * 0.35;
  if (S.cohabitation) pb += 12;
  if ((S.paralysie || 0) > 0) pb += 12;
  if ((S.chuteRecente || 0) > 0) pb += 16;
  if (S.flexUE) pb -= 8;
  const i = Math.max(0, ECHELLE.indexOf(e.notation));
  pb += Math.max(0, i - 4) * 12;
  return clamp(pb, 20, 480);
}
function pasDomaineReserve() {
  if (S.role !== "president" || !S.titulaire) return;
  const p = S.posture || { defense: 0, europe: 0, climat: 0 };
  S.dep.defense = Math.max(30, S.dep.defense + p.defense * 0.3);
  S.secteurs.environnement.emissions = clamp(S.secteurs.environnement.emissions - p.climat * 0.35, 140, 520);
  S.e.confianceMarches = clamp(S.e.confianceMarches + p.europe * 0.15, 0, 100);
}
function pasEconomie() {
  const e = S.e;
  let g = S.potentiel / 4;
  let infAdd = 0, dGini = 0, dPauv = 0, dChom = 0;
  for (const x of S.file) {
    g += x.g || 0; infAdd += x.inf || 0; dGini += x.gini || 0; dPauv += x.pauv || 0; dChom += x.chom || 0;
    if (x.secteur) addSecteur(x.secteur);
    x.reste--;
  }
  S.file = S.file.filter(x => x.reste > 0);
  const gap = e.croissance - S.potentiel;
  const taylor = clamp(2 + e.inflation + 0.5 * (e.inflation - 2) + 0.5 * gap, 0, 8);
  S.bce = clamp(S.bce + 0.12 * (taylor - S.bce), 0, 6);
  const bundCible = clamp(0.85 + S.bce * 0.5, 0.2, 6.5);
  e.bund10 = clamp(e.bund10 + 0.22 * (bundCible - e.bund10) + rnd(-0.03, 0.03), 0.15, 7);
  g -= (S.bce - 2) * 0.03;
  g -= Math.max(0, e.oat10 - 3.3) * 0.025;
  g -= (S.greve || 0) * 0.0012;
  if ((S.paralysie || 0) > 0) { g -= 0.04; S.paralysie--; }
  g += rnd(-0.1, 0.1);
  g = clamp(g, -2.2, 1.8);
  e.croissanceT = g;
  e.croissance = clamp(e.croissance * 0.7 + (g * 4) * 0.3, -6, 8);
  e.inflation = clamp(e.inflation + (2 - e.inflation) * 0.1 + infAdd + (g - 0.2) * 0.12 + rnd(-0.1, 0.1) - (S.bouclier ? 0.06 : 0), -1, 16);
  const smicRel = S.smic / D.smic.brutMensuel - 1;
  e.chomage = clamp(e.chomage - 0.3 * ((g * 4) - S.potentiel) / 4 + smicRel * 0.2 / 4 + dChom + rnd(-0.04, 0.04), 3, 22);
  const nom = (g + Math.max(-0.4, e.inflation) / 4) / 100;
  e.pibMd = clamp(e.pibMd * (1 + nom), 900, 8000);
  for (const k in S.rec) S.rec[k] = Math.max(0, S.rec[k] * (1 + nom * 1.01));
  for (const k in S.dep) if (k !== "interets") S.dep[k] = Math.max(0, S.dep[k] * (1 + Math.max(0, e.inflation) / 400 * 0.8));
  S.dep.emploi = Math.max(20, S.dep.emploi + (e.chomage - 8.5) * 0.18);
  if (S.tri === 1) {
    const reval = Math.max(0, e.inflation * 0.5 + 0.1);
    S.smic *= 1 + reval / 100;
    log(`Revalorisation du SMIC au 1er janvier, formule simplifiée : ${f2(S.smic)} € brut. Le point de départ de juin 2026 (${f2(D.smic.brutMensuel)} €) reste un paramètre à confirmer.`);
  }
  const spread = calculSpread();
  const oatCible = clamp(e.bund10 + spread / 100, 0.3, 14);
  e.oat10 = clamp(e.oat10 + 0.32 * (oatCible - e.oat10), 0.3, 14);
  const coupon = e.oat10 / 100 * e.detteMd;
  S.dep.interets = Math.max(0, S.dep.interets + (coupon - S.dep.interets) * 0.025);
  e.confianceMarches = clamp(e.confianceMarches + (e.deficitPct < 4.5 ? 0.8 : -0.7) + (e.dettePct > 125 ? -1 : 0.15) + (S.cohabitation ? -0.3 : 0) + rnd(-0.6, 0.6), 5, 95);
  const solde = totRec() - totDep();
  e.deficitPct = clamp(-solde / e.pibMd * 100, -4, 16);
  e.detteMd = clamp(e.detteMd + (-solde) / 4, 0, 20000);
  e.dettePct = e.detteMd / e.pibMd * 100;
  S.greve = clamp((S.greve || 0) * 0.6, 0, 100);
  e.tensionSociale = clamp(e.tensionSociale * 0.9 + S.greve * 0.25 + Math.max(0, e.inflation - 2) * 1.4 + Math.max(0, e.chomage - 7.5) * 1.1, 0, 100);
  e.gini = clamp(e.gini + dGini + (e.chomage - 8.5) * 0.0006 + Math.max(0, e.inflation - 2) * 0.0003, 0.23, 0.42);
  e.pauvrete = clamp(e.pauvrete + dPauv + (e.chomage - 8.5) * 0.07 + Math.max(0, e.inflation - 2.5) * 0.1, 7, 28);
  S.potentiel = clamp(S.potentiel + (S.secteurs.education.pisa - 100) * 0.0004 + (S.secteurs.energie.partENR - 27) * 0.0004 - Math.max(0, e.dettePct - 115) * 0.0005, 0.3, 2.2);
  S.usure493 = Math.max(0, (S.usure493 || 0) - 0.35);
  if (S.chuteRecente) S.chuteRecente--;
}
function pasSecteurs() {
  const s = S.secteurs, e = S.e;
  s.sante.tensionHopital = clamp(s.sante.tensionHopital + (e.inflation > 3 ? 0.3 : 0) + rnd(-0.4, 0.4), 15, 98);
  s.sante.desertsPct = clamp(s.sante.desertsPct + rnd(-0.05, 0.08), 5, 40);
  s.energie.prixMWh = clamp(s.energie.prixMWh + rnd(-2, 2) + (S.bouclier ? -0.8 : 0.3) - s.energie.partENR * 0.02, 25, 280);
  s.energie.nucleaireTWh = clamp(s.energie.nucleaireTWh + rnd(-2, 2), 250, 450);
  s.energie.partENR = clamp(s.energie.partENR + 0.15, 10, 80);
  s.commerce.balanceBiens += rnd(-2, 1.2) - Math.max(0, s.commerce.tarifUS - 10) * 0.12 - e.croissance * 0.8;
  s.commerce.balanceCourante = s.commerce.balanceBiens * 0.35 + rnd(-1, 1);
  s.logement.indicePrix = clamp(s.logement.indicePrix * (1 + e.inflation / 100 * 0.12 + (s.logement.chantiers < 280 ? -0.002 : 0.001)), 60, 180);
  s.logement.tauxEffort = clamp(s.logement.tauxEffort + (e.oat10 - 3) * 0.04, 15, 45);
  s.agriculture.colere = clamp(s.agriculture.colere * 0.96 + (s.commerce.mercosur === "signe" ? 1.5 : 0) + rnd(-1, 1), 0, 100);
  s.agriculture.revenu = clamp(s.agriculture.revenu + rnd(-1, 1), 60, 140);
  s.environnement.emissions = clamp(s.environnement.emissions * (1 - 0.004 - s.energie.partENR * 0.00008) + (e.croissance > 1.2 ? 0.5 : -0.15), 120, 520);
  s.securite.delinquance = clamp(s.securite.delinquance + rnd(-0.4, 0.5) - (s.securite.effectifs - 100) * 0.02, 70, 160);
  s.collectivites.tension = clamp(s.collectivites.tension + (e.inflation > 3 ? 0.3 : -0.1), 10, 95);
  s.education.pisa = clamp(s.education.pisa + (s.education.tensionRecrutement > 70 ? -0.05 : 0.02), 85, 115);
  s.defense.effectifs = clamp(s.defense.effectifs, 80, 130);
}
function pasOpinion() {
  const e = S.e;
  const eco = (e.croissanceT * 4 - 0.3) * 0.9 - Math.max(0, e.inflation - 2.2) * 0.4 - Math.max(0, e.chomage - 8) * 0.45 - (e.tensionSociale - 50) * 0.025;
  S.popPresident = clamp(S.popPresident + eco * 0.28 - (S.usure493 || 0) * 0.15 + rnd(-0.8, 0.8), 6, 72);
  S.popPM = clamp(S.popPM + eco * 0.38 - (S.usure493 || 0) * 0.35 + rnd(-0.8, 0.8), 6, 72);
  S.popOpposition = clamp((S.popOpposition || 30) + rnd(-0.4, 0.4) + (e.chomage > 9 ? 0.2 : 0), 8, 55);
  if (S.titulaire) S.e.popularite = S.role === "president" ? S.popPresident : S.popPM;
  else S.e.popularite = S.popOpposition;
  if (S.role === "pm" && S.titulaire && S.campPresident === "central" && (S.confiancePresident || 60) < 18) {
    log("Le Président met fin à vos fonctions : la confiance de l'Élysée est épuisée.", "neg");
    S.titulaire = false; S.fonction = "opposition";
    recomposerMajorite("le renvoi du Premier ministre");
  }
}
function stressNotation() {
  const e = S.e;
  let s = 0;
  s += Math.max(0, e.deficitPct - 3) * 1.35;
  s += Math.max(0, e.dettePct - 100) * 0.08;
  s += Math.max(0, 50 - e.confianceMarches) * 0.05;
  s += Math.max(0, e.tensionSociale - 50) * 0.015;
  s -= Math.max(0, e.croissance - 1) * 0.3;
  if (S.cohabitation) s += 0.3;
  if ((S.chuteRecente || 0) > 0) s += 1;
  return s;
}
function indexCible(stress) {
  if (stress < 2.2) return 2;
  if (stress < 3.5) return 3;
  if (stress < 6.3) return 4;
  if (stress < 7.6) return 5;
  if (stress < 8.8) return 6;
  if (stress < 10.2) return 7;
  return 8;
}
function revueNotation(agence) {
  const cible = indexCible(stressNotation());
  let i = ECHELLE.indexOf(S.e.notation);
  if (i < 0) i = 4;
  const out = S.e.outlook || "stable";
  const comm = [
    { qui: agence.nom, texte: "« La note sanctionne la trajectoire et la capacité politique à la tenir, pas le débat du jour. »" },
    { qui: "Agence France Trésor", texte: "« Une perspective n'est pas une adjudication ratée. Elle change le prix des prochaines émissions. »" }
  ];
  if (cible > i) {
    if (out !== "negative") {
      S.e.outlook = "negative";
      log(`${agence.nom} place la dette française sous perspective négative. La note ${S.e.notation} est conservée pour cette revue.`, "neg", comm);
    } else {
      i = Math.min(ECHELLE.length - 1, i + 1);
      S.e.notation = ECHELLE[i]; S.e.outlook = "stable";
      S.e.confianceMarches = clamp(S.e.confianceMarches - 5, 0, 100);
      log(`${agence.nom} dégrade la France à ${S.e.notation}.`, "neg", comm);
    }
  } else if (cible < i) {
    if (out !== "positive") {
      S.e.outlook = "positive";
      log(`${agence.nom} passe la perspective à positive, note ${S.e.notation} inchangée.`, "pos", comm);
    } else {
      i = Math.max(0, i - 1);
      S.e.notation = ECHELLE[i]; S.e.outlook = "stable";
      log(`${agence.nom} relève la note souveraine à ${S.e.notation}.`, "pos", comm);
    }
  } else log(`${agence.nom} confirme ${S.e.notation}, perspective ${out}.`);
}
function appliquerEffets(eff) {
  if (!eff) return;
  const e = S.e;
  if (eff.inflation) e.inflation = clamp(e.inflation + eff.inflation, -1, 16);
  if (eff.confiance) e.confianceMarches = clamp(e.confianceMarches + eff.confiance, 0, 100);
  if (eff.popularite) {
    S.popPresident = clamp(S.popPresident + eff.popularite, 5, 74);
    S.popPM = clamp(S.popPM + eff.popularite * 0.85, 5, 74);
    if (S.titulaire) e.popularite = S.role === "president" ? S.popPresident : S.popPM;
  }
  if (eff.tension) e.tensionSociale = clamp(e.tensionSociale + eff.tension, 0, 100);
  if (eff.greve) S.greve = clamp((S.greve || 0) + eff.greve, 0, 100);
  if (eff.chomage) e.chomage = clamp(e.chomage + eff.chomage, 3, 22);
  if (eff.bce) S.bce = clamp(S.bce + eff.bce, 0, 6);
  if (eff.file) S.file.push({ ...eff.file });
  if (eff.depMd) for (const k in eff.depMd) S.dep[k] = Math.max(0, S.dep[k] + eff.depMd[k]);
  if (eff.secteur) addSecteur(eff.secteur);
  if (eff.salience) for (const k in eff.salience) S.salience[k] = clamp((S.salience[k] || 40) + eff.salience[k], 0, 100);
}
function evenementsAleatoires() {
  let n = 0;
  for (const ev of (D.evenements || [])) {
    if (n >= 3) break;
    if (rnd01() < ev.p) {
      appliquerEffets(ev.effets);
      log(ev.titre, ev.ton || "", ev.reactions || []);
      n++;
    }
  }
}
function agenda() {
  for (const it of (D.agenda || [])) {
    if (it.trimestres && !it.trimestres.includes(S.tri)) continue;
    if (it.anneesModulo && (S.annee % it.anneesModulo) !== 0) continue;
    if (it.special === "semestre") {
      if (S.e.deficitPct > 3) log(`Semestre européen : le déficit simulé est de ${f1(S.e.deficitPct)} % du PIB, au-dessus du plafond de 3 %. La procédure de déficit excessif reste le cadre. Ajustement structurel demandé d'environ 0,5 point par an, hors flexibilité accordée.`, "neg", it.reactions);
      else log(`Semestre européen : le déficit simulé (${f1(S.e.deficitPct)} %) repasse sous 3 %. La Commission salue le chiffre et dit qu'elle jugera la durée.`, "pos", it.reactions);
      continue;
    }
    appliquerEffets(it.effets);
    log(it.titre, it.ton || "", it.reactions || []);
  }
}
function commentaireConjoncture() {
  const e = S.e;
  log(`INSEE (simulation) : PIB ${e.croissanceT >= 0 ? "+" : ""}${f1(e.croissanceT)} % ce trimestre, acquis annuel ${f1(e.croissance)} %. Chômage ${f1(e.chomage)} %. IPCH ${f1(e.inflation)} %.`, e.croissanceT < 0 ? "neg" : "");
  log(`Marchés : OAT 10 ans ${f1(e.oat10)} %, Bund ${f1(e.bund10)} %, spread ${f0((e.oat10 - e.bund10) * 100)} pb. Note ${e.notation} (${e.outlook}). BCE, taux de dépôt ${f1(S.bce)} % — vous ne le fixez pas.`);
  if (e.tensionSociale > 68) log("Climat social dégradé : les préavis se multiplient et la concertation devient le préalable de tout texte sensible.", "neg");
}

function tour() {
  if (!S || S.fini) return { fini: true };
  if (S.procedure && S.procedure.etape && S.procedure.etape !== "terminee" && S.procedure.etape !== "bloque") {
    if (isBrowser && typeof confirm === "function" && !confirm("Un texte est encore en navette. Le retirer et passer au trimestre suivant ?")) return { annule: true };
    log("Le projet en navette est retiré : le trimestre avance sans vote.", "neg");
    S.procedure = null;
  }
  if (S.tri === 2 && (S.annee === 2027 || S.annee === 2032) && !(S.elections && S.elections["p" + S.annee])) {
    electionPresidentielle(S.annee);
    if (S.fini) { snap(); sauvegarder(true); if (isBrowser) render(); return { fini: true, election: S.annee }; }
  }
  pasDomaineReserve();
  pasEconomie();
  pasSecteurs();
  if (S.tri === 1) pasAnnuelRetraites();
  pasOpinion();
  for (const ag of (D.agences || [])) if (ag.trimestres.includes(S.tri)) revueNotation(ag);
  agenda();
  evenementsAleatoires();
  politiqueAI();
  publierSondage(false);
  commentaireConjoncture();
  S.tri++;
  if (S.tri > 4) { S.tri = 1; S.annee++; }
  if (S.tri === 4) S.quota493 = 0;
  S.tour++;
  snap();
  sauvegarder(true);
  if (isBrowser) render();
  return { ok: true, annee: S.annee, tri: S.tri };
}

function calerBudget() {
  S.e.pibMd = S.e.detteMd / (S.e.dettePct / 100);
  const cible = S.e.pibMd * S.e.deficitPct / 100;
  const gap = (totDep() - totRec()) - cible;
  S.rec.autres += gap;
}
function nouvelle(role, opts) {
  opts = opts || {};
  const seed = (opts.seed != null ? (opts.seed >>> 0) : ((Date.now() % 1000000000) >>> 0)) || 1;
  const roleOk = role === "president" ? "president" : "pm";
  S = {
    version: 3, rng: seed, role: roleOk, titulaire: true, fonction: "pouvoir",
    annee: D.debut.annee, tri: D.debut.trimestre, tour: 0,
    e: { ...D.eco }, taux: { ...D.taux },
    dep: { ...D.depenses }, rec: { ...D.recettes },
    ret: JSON.parse(JSON.stringify(D.retraites)),
    secteurs: JSON.parse(JSON.stringify(D.secteurs)),
    assemblee: D.politique.assemblee.map(g => ({ ...g })),
    smic: D.smic.brutMensuel, file: [], news: [],
    hist: { pib: [], chomage: [], inflation: [], dette: [], oat: [], deficit: [], pop: [], gini: [], pauvrete: [], spread: [], ratio: [] },
    n493: 0, quota493: 0, greve: 0, bce: 3.4, fini: false,
    draft: null, procedure: null, flexUE: false, bouclier: false,
    dissolution: null, frontRepublicain: 0.55, proportionnelle: false,
    coalition: ["epr", "dem", "hor"], campPresident: "central", campGouvernement: "central", cohabitation: false,
    relations: {}, accords: {}, salience: { immigration: 55, securite: 52, climat: 42, pouvoirAchat: 70 },
    popPresident: D.eco.popularite, popPM: 31, popOpposition: 33, confiancePresident: 68,
    autoriser493: true, posture: { defense: 0, europe: 0, climat: 0 },
    potentiel: 1.15, elections: {}, sondages: [], lois: [], chutes: 0, paralysie: 0,
    confianceInstit: 48, usure493: 0, chuteRecente: 0
  };
  for (const g of S.assemblee) {
    const profil = groupeData(g.id);
    S.relations[g.id] = dansCoalition(g.id) ? 80 : (profil && profil.relation0 != null ? profil.relation0 : 40);
  }
  calibrerSalaire();
  calerBudget();
  S.ret.ratioCotRet = S.ret.demo.cotisantsM / S.ret.demo.retraitesM;
  S.depart = {
    croissance: S.e.croissance, inflation: S.e.inflation, chomage: S.e.chomage, dettePct: S.e.dettePct,
    deficitPct: S.e.deficitPct, oat10: S.e.oat10, detteMd: S.e.detteMd, popularite: S.e.popularite,
    smic: S.smic, age: S.ret.ageLegal, gini: S.e.gini, pauvrete: S.e.pauvrete, soldeRetraites: S.ret.soldeMd
  };
  S.e.popularite = roleOk === "president" ? S.popPresident : S.popPM;
  publierSondage(true);
  log(roleOk === "president"
    ? "Vous êtes Président de la République. Dernière année du mandat en cours : la présidentielle est au printemps 2027, et la partie continue ensuite jusqu'en 2032. Vous nommez le Premier ministre, vous pouvez dissoudre (le délai d'un an est écoulé), engager un référendum, et — tant qu'il n'y a pas cohabitation — faire porter des textes par le Gouvernement."
    : "Vous êtes Premier ministre d'un Gouvernement minoritaire (EPR, Démocrates, Horizons : 162 sièges, majorité absolue 289). Vous négociez groupe par groupe. Le 49.3 engage votre responsabilité. Une censure adoptée vous renverse. La dissolution ne vous appartient pas : vous pouvez seulement la demander au Président.", "");
  log("Les chiffres macro du premier jour sont des paramètres de scénario, pas des données officielles certifiées : croissance 2026 0,4 %, T3 −0,1 %, IPCH 3,8 %, chômage 8,5 %, dette 119 % du PIB (3 600 Md€), déficit 5,4 %, OAT 10 ans 4,76 %. Le SMIC de départ est 1 867,02 € brut, marqué « à confirmer ».", "");
  snap();
  sauvegarder(true);
  if (isBrowser) render();
  return S;
}
function preparer(partial) {
  S.draft = draftVierge();
  S.procedure = null;
  if (!partial) return S.draft;
  if (partial.taux) Object.assign(S.draft.taux, partial.taux);
  if (partial.dep) Object.assign(S.draft.dep, partial.dep);
  if (partial.mesures) Object.assign(S.draft.mesures, partial.mesures);
  ["age", "duree", "indexation", "tauxCot", "smic"].forEach(k => { if (partial[k] != null) S.draft[k] = partial[k]; });
  return S.draft;
}
function sauvegarder(silent) {
  if (typeof localStorage === "undefined" || !S) return;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* quota */ }
  if (!silent && isBrowser) modal("Sauvegarde", "<p>Partie enregistrée dans ce navigateur.</p>");
}

/* ---------- Interface ---------- */
function badge(type) {
  const map = { parametre: ["param", "paramètre"], utilisateur: ["param", "donnée fournie"], estimation: ["est", "estimation"], modele: ["modele", "modèle"] };
  const m = map[type] || ["est", type];
  return `<span class="badge ${m[0]}">${m[1]}</span>`;
}
function kpi(k, v, cls, sub) {
  return `<div class=card><div class=k>${k}</div><div class="v ${cls || ""}">${v}</div>${sub ? `<div class=kpi-sub>${sub}</div>` : ""}</div>`;
}
const nw = n => `<div class="news ${esc(n.c)}"><span class=k>${esc(n.d)}</span> — ${esc(n.t)}${(n.reactions || []).map(r => `<div class=reaction><b>${esc(r.qui)}.</b> ${esc(r.texte)}</div>`).join("")}</div>`;

function render() {
  if (!isBrowser) return;
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.v === (S ? view : "")));
  if (!S) { ecranRole(); return; }
  const qui = S.role === "president" ? "Président" : "Premier ministre";
  const etat = !S.titulaire ? "opposition" : S.cohabitation ? "cohabitation" : "en fonction";
  $("#date").textContent = `${D.nom} — T${S.tri} ${S.annee}`;
  const roleEl = $("#role");
  if (roleEl) roleEl.textContent = `${qui} · ${etat}`;
  const btn = $("#tour");
  if (btn) btn.disabled = !!S.fini;
  const m = $("#main");
  if (view === "dash") renderDash(m);
  else if (view === "dec") renderDec(m);
  else if (view === "parl") renderParl(m);
  else if (view === "sond") renderSond(m);
  else if (view === "ret") renderRet(m);
  else if (view === "news") m.innerHTML = `<h2>Fil d'actualités</h2><p class=note>Les réactions sont écrites pour le scénario. Elles illustrent des positions typiques, elles ne sont pas des citations réelles.</p>${S.news.map(nw).join("")}`;
  else if (view === "elec") renderElec(m);
  else if (view === "src") renderSrc(m);
  drawCharts();
}
let view = "dash";

function ecranRole() {
  const m = $("#main");
  if (!m) return;
  $("#date").textContent = "Novembre 2026";
  const roleEl = $("#role");
  if (roleEl) roleEl.textContent = "France";
  m.innerHTML = `<h2>Statecraft</h2>
  <p class=note>Novembre 2026. Assemblée sans majorité absolue. Les agrégats de départ sont des <b>paramètres de scénario</b>, indiqués comme tels dans l'écran Sources. La partie va jusqu'à la présidentielle de 2032. Choisissez un rôle.</p>
  <div class=choices>
    <div class=card><h2>Président de la République</h2>
      <p>Vous nommez le Premier ministre, vous pouvez dissoudre (article 12, une fois par an), saisir le référendum, et orienter la défense et l'Europe même en cohabitation. Tant que le Gouvernement est de votre bord, vous faites aussi porter les lois. Vous ne tombez pas avec une censure. En 2027, votre camp se représente ; si vous perdez, vous continuez dans l'opposition.</p>
      <button class=primary id=roleP>Être le Président</button></div>
    <div class=card><h2>Premier ministre</h2>
      <p>Vous conduisez la politique, négociez groupe par groupe, engagez le 49.3 et affrontez les motions de censure. Vous ne dissout pas : vous pouvez le demander. Une censure peut vous renvoyer dans l'opposition. La partie, elle, continue.</p>
      <button class=primary id=roleM>Être le Premier ministre</button></div>
  </div>
  <p class=note>Convention du jeu : la dernière lettre des noms de candidats est omise (Le Pe, Mélencho, Macro, Bardell…).</p>`;
  $("#roleP").onclick = () => { view = "dash"; nouvelle("president"); };
  $("#roleM").onclick = () => { view = "dash"; nouvelle("pm"); };
}

function renderDash(m) {
  const e = S.e;
  const s = S.secteurs;
  const partDef = S.dep.defense / e.pibMd * 100;
  const ondam = S.dep.sante * (s.sante.ondamRatio || 0.99);
  m.innerHTML = `<p class=note>Situation <b>simulée</b> au T${S.tri} ${S.annee}. Au premier jour, croissance 0,4 %, T3 −0,1 %, IPCH 3,8 %, chômage 8,5 %, dette 119 % (3 600 Md€), déficit 5,4 %, OAT 4,76 % : ce sont des paramètres fournis, pas des données vérifiées. ${badge("parametre")}</p>
  <div class=grid>
    ${kpi("Croissance (acquis)", f1(e.croissance) + " %", e.croissance < 0.5 ? "bad" : "good", "T " + (e.croissanceT >= 0 ? "+" : "") + f1(e.croissanceT) + " %")}
    ${kpi("IPCH", f1(e.inflation) + " %", e.inflation > 3 ? "bad" : "", "cible BCE 2 %")}
    ${kpi("Chômage BIT", f1(e.chomage) + " %", e.chomage > 8 ? "bad" : "")}
    ${kpi("Dette", f1(e.dettePct) + " %", e.dettePct > 115 ? "bad" : "", f0(e.detteMd) + " Md€")}
    ${kpi("Déficit", f1(e.deficitPct) + " %", e.deficitPct > 3 ? "bad" : "good", "plafond UE 3 %")}
    ${kpi("OAT 10 ans", f1(e.oat10) + " %", e.oat10 > 4 ? "bad" : "", "spread " + f0((e.oat10 - e.bund10) * 100) + " pb")}
    ${kpi("Bund 10 ans", f1(e.bund10) + " %", "", "hypothèse de modèle")}
    ${kpi("BCE dépôt", f1(S.bce) + " %", "", "vous ne le fixez pas")}
    ${kpi("Note", e.notation, "", e.outlook)}
    ${kpi("Popularité", f0(e.popularite) + " %", e.popularite < 30 ? "bad" : "", S.role === "president" ? "Président" : "Matignon")}
    ${kpi("Prés. / PM", f0(S.popPresident) + " / " + f0(S.popPM), "")}
    ${kpi("Tension sociale", f0(e.tensionSociale), e.tensionSociale > 65 ? "bad" : "", "grève " + f0(S.greve))}
    ${kpi("Gini", f2(e.gini), "", badge("estimation"))}
    ${kpi("Pauvreté", f1(e.pauvrete) + " %", e.pauvrete > 15 ? "bad" : "", "seuil 60 %")}
    ${kpi("SMIC brut", f2(S.smic) + " €", "", "à confirmer")}
    ${kpi("Âge légal", fage(S.ret.ageLegal), "", "ratio " + f2(S.ret.ratioCotRet))}
  </div>
  <h2>Secteurs <span class="badge est">estimations et sorties de modèle</span></h2>
  <div class=grid>
    ${kpi("ONDAM (approx.)", f0(ondam) + " Md€", "", "tension hôpital " + f0(s.sante.tensionHopital) + " · déserts " + f1(s.sante.desertsPct) + " %")}
    ${kpi("Éducation", f0(s.education.depParEleve) + " €/élève", "", "décrochage " + f1(s.education.decrochage) + " %")}
    ${kpi("Électricité", f0(s.energie.prixMWh) + " €/MWh", "", "nucléaire " + f0(s.energie.nucleaireTWh) + " TWh · ENR " + f0(s.energie.partENR) + " %")}
    ${kpi("EPR2", s.energie.epr2Lances + " / " + s.energie.epr2Cible, "", "avancement " + f0(s.energie.epr2Avancement) + " · dette EDF " + f0(s.energie.edfDette))}
    ${kpi("Commerce", f0(s.commerce.balanceBiens) + " Md€", s.commerce.balanceBiens < -40 ? "bad" : "", "tarifs US " + f0(s.commerce.tarifUS) + " · Mercosur " + esc(s.commerce.mercosur))}
    ${kpi("Logement", "indice " + f0(s.logement.indicePrix), "", "chantiers " + f0(s.logement.chantiers) + "k · effort " + f1(s.logement.tauxEffort) + " %")}
    ${kpi("Sécurité", "indice " + f0(s.securite.delinquance), "", "OQTF exéc. " + f0(s.securite.oqtf) + " · asile " + f0(s.securite.asile) + "k")}
    ${kpi("Collectivités", "tension " + f0(s.collectivites.tension), "", "dette locale ~" + f0(s.collectivites.dette) + " Md€")}
    ${kpi("Agriculture", "revenu " + f0(s.agriculture.revenu), "", "colère " + f0(s.agriculture.colere))}
    ${kpi("Défense (LPM)", f2(partDef) + " % PIB", partDef < 1.9 ? "warn" : "good", "cible " + f1(s.defense.ciblePIB) + " % · " + f0(S.dep.defense) + " Md€")}
    ${kpi("Émissions", f0(s.environnement.emissions) + " Mt", "", "repère 2030 " + f0(s.environnement.cible2030) + " Mt")}
    ${kpi("Coalition", siegesCoalition() + " sièges", siegesCoalition() < 289 ? "warn" : "good", S.cohabitation ? "cohabitation" : nomCamp(S.campGouvernement))}
  </div>
  <h2>Trajectoires</h2>
  <div class=grid style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
    ${[["pib", "Croissance annuelle (%)"], ["chomage", "Chômage (%)"], ["inflation", "IPCH (%)"], ["dette", "Dette (% PIB)"], ["deficit", "Déficit (% PIB)"], ["oat", "OAT 10 ans (%)"], ["spread", "Spread OAT-Bund (pts)"], ["pop", "Popularité (%)"], ["pauvrete", "Pauvreté (%)"], ["ratio", "Ratio cotisants / retraités"]].map(([k, l]) => `<div class=card><div class=k>${l}</div><canvas data-h="${k}"></canvas></div>`).join("")}
  </div>
  <h2>Budget annuel simulé (Md€)</h2>
  <div class=cols>
    <div class=card><b>Recettes ${f0(totRec())}</b><table>${Object.entries(S.rec).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${f1(v)}</td></tr>`).join("")}</table></div>
    <div class=card><b>Dépenses ${f0(totDep())}</b><table>${Object.entries(S.dep).map(([k, v]) => `<tr><td>${esc(D.missions[k] || k)}</td><td>${f1(v)}</td></tr>`).join("")}</table></div>
  </div>
  <h2>Dernières nouvelles</h2>${S.news.slice(0, 4).map(nw).join("")}`;
}

function slider(lab, path, min, max, step, val, txt) {
  return `<div class=row><label>${lab}</label><input type=range min="${min}" max="${max}" step="${step}" value="${val}" data-p="${path}"><b>${txt}</b></div>`;
}
function htmlEstimation(a) {
  const fin = a.finance ? "texte financier (49.3 ouvert, dernier mot possible)" : "loi ordinaire (un 49.3 hors budget par session, pas de dernier mot)";
  return `<p>Solde public : <b class="${a.solde >= 0 ? "good" : "bad"}">${a.solde >= 0 ? "+" : ""}${f1(a.solde)} Md€/an</b> (${f1(a.solde / S.e.pibMd * 100)} pt de PIB). Impulsion de croissance ${f1(a.impulse)} point sur ${a.delai} trimestres, après multiplicateurs différenciés. ${badge("modele")}</p>
  <p>Assemblée, si on votait maintenant : <b>${a.votes.pour}</b> pour, ${a.votes.contre} contre, ${a.votes.abst} abstentions. ${a.votes.adopte ? "Majorité relative." : "Pas de majorité relative."}</p>
  <p>Censure en cas de 49.3 : <b class="${a.censure.adoptee ? "bad" : ""}">${a.censure.pour}</b> / ${a.censure.seuil} — risque ${a.censure.risque}. Qualification : ${fin}.</p>
  ${a.cc.map(x => `<p class=bad>Conseil constitutionnel — ${esc(x)}</p>`).join("")}
  ${a.alertes.map(x => `<p class=warn>${esc(x)}</p>`).join("")}
  ${a.greve >= 15 ? "<p class=warn>Conflit social probable.</p>" : ""}
  ${a.resumes.length ? `<p class=note>${a.resumes.map(esc).join("<br>")}</p>` : ""}`;
}
function renderDec(m) {
  if (!peutGouverner()) { renderOpposition(m); return; }
  const d = assurerDraft();
  const a = analyse(draftEffectif());
  const slTaux = [
    ["Indice du barème de l'IR (100 = actuel)", "taux.IR", 70, 160, 1, d.taux.IR, String(d.taux.IR)],
    ["TVA, taux normal (%)", "taux.TVA", 15, 27, 0.5, d.taux.TVA, f1(d.taux.TVA) + " %"],
    ["Impôt sur les sociétés (%)", "taux.IS", 15, 40, 0.5, d.taux.IS, f1(d.taux.IS) + " %"],
    ["CSG sur les revenus d'activité (%)", "taux.CSG", 7, 13, 0.1, d.taux.CSG, f1(d.taux.CSG) + " %"]
  ].map(x => slider(...x)).join("");
  const slDep = Object.keys(d.dep).map(k => slider(D.missions[k] || k, "dep." + k, -12, 12, 0.5, d.dep[k], (d.dep[k] > 0 ? "+" : "") + f1(d.dep[k]) + " %")).join("");
  const mesures = (D.catalogue || []).map(c => `<div class=row><label>${esc(c.label)}</label><select data-m="${c.cle}">${c.options.map(o => `<option value="${o.id}" ${d.mesures[c.cle] === o.id ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select></div>`).join("");
  const cap = S.role === "president" ? `<div class=card><b>Domaine réservé</b> <span class="badge modele">simplification</span>
    <p class=note>En cohabitation comme hors cohabitation, le Président garde un levier sur la défense et l'Europe. Ici, ce levier est un réglage trimestriel, distinct de la loi. Il ne remplace pas un vote.</p>
    ${slider("Effort de défense (dérive trimestrielle)", "posture.defense", -1, 1, 1, (S.posture || {}).defense || 0, ((S.posture || {}).defense || 0) > 0 ? "accélérer" : (S.posture || {}).defense < 0 ? "freiner" : "tenir")}
    ${slider("Posture européenne", "posture.europe", -1, 1, 1, (S.posture || {}).europe || 0, ((S.posture || {}).europe || 0) > 0 ? "coopération" : (S.posture || {}).europe < 0 ? "fermeté" : "neutre")}
    ${slider("Diplomatie climatique", "posture.climat", -1, 1, 1, (S.posture || {}).climat || 0, String((S.posture || {}).climat || 0))}
    <div class=row><label>49.3</label><button type=button id=aut493>${S.autoriser493 === false ? "Autoriser le 49.3" : "Interdire le 49.3 au Gouvernement"}</button></div>
    <div class=row><button type=button id=refGo>Référendum…</button></div>
    <div id=refBox></div></div>` : "";
  m.innerHTML = `<h2>${S.role === "president" ? "Instructions au Gouvernement" : "Projet de loi"}</h2>
  <p class=note>Le jeu réunit dans un même véhicule le projet de loi de finances et le projet de loi de financement de la sécurité sociale, pour rester jouable. En droit, ce sont des textes distincts ; le 49.3 leur est ouvert à tous les deux. Un texte dont le solde bouge de moins de 0,4 Md€ est traité comme une loi ordinaire.</p>
  <div class=tabs><button type=button data-tab=budget class="${ui.dec === "budget" ? "on" : ""}">Budget</button><button type=button data-tab=social class="${ui.dec === "social" ? "on" : ""}">Retraites et SMIC</button><button type=button data-tab=sect class="${ui.dec === "sect" ? "on" : ""}">Secteurs</button></div>
  <div class=card style="${ui.dec === "budget" ? "" : "display:none"}"><b>Impôts</b>${slTaux}<b>Missions (variation, %)</b>${slDep}</div>
  <div class=card style="${ui.dec === "social" ? "" : "display:none"}"><b>Paramètres du système</b>
    ${slider("Âge légal", "age", 60, 67, 0.25, d.age, fage(d.age))}
    ${slider("Durée d'assurance (trimestres)", "duree", 164, 176, 1, d.duree, fduree(d.duree))}
    ${slider("Taux de cotisation global (%)", "tauxCot", 24, 32, 0.1, d.tauxCot, f1(d.tauxCot) + " %")}
    <div class=row><label>Indexation des pensions</label><select id=idx><option value=prix ${d.indexation === "prix" ? "selected" : ""}>Prix</option><option value=mixte ${d.indexation === "mixte" ? "selected" : ""}>Mixte prix / salaires</option><option value=salaires ${d.indexation === "salaires" ? "selected" : ""}>Salaires</option><option value=gel ${d.indexation === "gel" ? "selected" : ""}>Gel</option></select></div>
    ${slider("Coup de pouce au SMIC, en plus de la revalorisation légale", "smic", 0, 6, 0.5, d.smic, "+" + f1(d.smic) + " %")}
  </div>
  <div class=card style="${ui.dec === "sect" ? "" : "display:none"}"><b>Mesures sectorielles</b><p class=note>Chaque option décrit son coût et son délai. Les niveaux de départ des secteurs sont des estimations.</p>${mesures}</div>
  ${cap}
  <div class=card id=est><b>Estimation avant négociation</b>${htmlEstimation(a)}
    <div class=row><button class=primary id=goNeg>Ouvrir la négociation</button><button type=button id=raz>Remettre à zéro</button></div>
  </div>`;
  m.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { ui.dec = b.dataset.tab; renderDec(m); });
  m.querySelectorAll("input[type=range]").forEach(i => i.oninput = () => {
    const parts = i.dataset.p.split(".");
    const val = +i.value;
    if (parts[0] === "posture") { S.posture = S.posture || {}; S.posture[parts[1]] = val; }
    else if (parts[1]) assurerDraft()[parts[0]][parts[1]] = val;
    else assurerDraft()[parts[0]] = val;
    const b = i.parentElement.querySelector("b");
    if (parts[0] === "age") b.textContent = fage(val);
    else if (parts[0] === "duree") b.textContent = fduree(val);
    else if (parts[0] === "posture") b.textContent = String(val);
    else if (i.dataset.p.indexOf("dep.") === 0 || parts[0] === "smic") b.textContent = (val > 0 ? "+" : "") + f1(val) + " %";
    else if (parts[0] === "taux" || parts[0] === "tauxCot") b.textContent = (parts[1] === "IR" ? String(val) : f1(val) + " %");
    else b.textContent = String(val);
    const box = $("#est");
    if (box) box.innerHTML = `<b>Estimation avant négociation</b>${htmlEstimation(analyse(draftEffectif()))}<div class=row><button class=primary id=goNeg>Ouvrir la négociation</button><button type=button id=raz>Remettre à zéro</button></div>`;
    lierDec(m);
  });
  m.querySelectorAll("select[data-m]").forEach(sel => sel.onchange = () => { assurerDraft().mesures[sel.dataset.m] = sel.value; const box = $("#est"); if (box) { box.innerHTML = `<b>Estimation avant négociation</b>${htmlEstimation(analyse(draftEffectif()))}<div class=row><button class=primary id=goNeg>Ouvrir la négociation</button><button type=button id=raz>Remettre à zéro</button></div>`; lierDec(m); } });
  const idx = $("#idx");
  if (idx) idx.onchange = () => { assurerDraft().indexation = idx.value; renderDec(m); };
  lierDec(m);
}
function lierDec(m) {
  const go = m.querySelector("#goNeg") || $("#goNeg");
  const raz = m.querySelector("#raz") || $("#raz");
  if (go) go.onclick = () => { ouvrirNegociation(); view = "parl"; render(); };
  if (raz) raz.onclick = () => { S.draft = draftVierge(); renderDec($("#main")); };
  const aut = $("#aut493");
  if (aut) aut.onclick = () => { S.autoriser493 = S.autoriser493 === false; renderDec($("#main")); };
  const ref = $("#refGo");
  if (ref) ref.onclick = () => {
    const box = $("#refBox");
    box.innerHTML = (D.referendums || []).map(r => `<div class=row><button type=button data-ref="${r.id}">${esc(r.label)}</button><span class=note>${esc(r.note)}</span></div>`).join("");
    box.querySelectorAll("[data-ref]").forEach(b => b.onclick = () => {
      const res = referendum(b.dataset.ref);
      if (res && res.raison) modal("Référendum", `<p>${esc(res.raison)}</p>`);
      render();
    });
  };
}
function renderOpposition(m) {
  if (S.role === "president" && S.titulaire && S.cohabitation) {
    m.innerHTML = `<h2>Cohabitation</h2>
    <p>Le Gouvernement n'est pas de votre bord. Il conduit le budget. Vous gardez la nomination — inutile si l'Assemblée vous est hostile —, la dissolution si le délai d'un an est passé, le référendum, et le domaine réservé.</p>
    <div class=card>${slider("Effort de défense", "posture.defense", -1, 1, 1, (S.posture || {}).defense || 0, String((S.posture || {}).defense || 0))}
    ${slider("Posture européenne", "posture.europe", -1, 1, 1, (S.posture || {}).europe || 0, String((S.posture || {}).europe || 0))}
    <div class=row><button type=button id=refGo>Référendum…</button></div><div id=refBox></div>
    <p class=note>${esc(peutDissoudre().raison)}</p>
    <button type=button id=btnDiss ${peutDissoudre().ok ? "" : "disabled"}>Dissoudre l'Assemblée</button></div>`;
    m.querySelectorAll("input[type=range]").forEach(i => i.oninput = () => { const [, k] = i.dataset.p.split("."); S.posture[k] = +i.value; i.parentElement.querySelector("b").textContent = i.value; });
    lierDec(m);
    const bd = $("#btnDiss");
    if (bd) bd.onclick = () => { dissoudre(); render(); };
    return;
  }
  m.innerHTML = `<h2>Opposition</h2>
  <p>Vous n'êtes plus ${S.role === "president" ? "à l'Élysée" : "à Matignon"}. Le Gouvernement en place (${nomCamp(S.campGouvernement)}) conduit la politique. Chaque trimestre, vous pouvez prendre la parole, déposer une motion, ou tenter une proposition de loi. Une censure spontanée rassemble moins qu'une censure collée à un 49.3.</p>
  <div class=card><div class=row>
    <button type=button id=op1>Tribune sur le pouvoir d'achat</button>
    <button type=button id=op2>Motion de censure</button>
    <button type=button id=op3>Proposition de loi</button>
  </div><p class=note>Popularité d'opposition : ${f0(S.popOpposition || 0)} %.</p></div>`;
  $("#op1").onclick = () => { const r = actionOpposition("tribune"); if (r.raison) modal("Opposition", `<p>${esc(r.raison)}</p>`); render(); };
  $("#op2").onclick = () => { const r = actionOpposition("censure"); if (r.raison) modal("Opposition", `<p>${esc(r.raison)}</p>`); render(); };
  $("#op3").onclick = () => { actionOpposition("proposition"); render(); };
}

function barreGroupes(liste, max) {
  return liste.map(p => `<div class=row><label>${esc(p.p)}</label><span class=bar style="width:${Math.max(2, p.s / max * 100)}%;background:${p.c || "#4fa3d1"}"></span><b>${p.s}</b></div>`).join("");
}
function renderParl(m) {
  const P = S.assemblee;
  const maxS = 160;
  let proc = "";
  if (S.choixPM) {
    proc += `<div class=card><b>Nommer un Premier ministre</b><p>La censure a ouvert Matignon. Choisir un groupe, c'est choisir un bloc.</p><div class=row>${P.filter(g => g.id !== "vac" && g.id !== "ni").map(g => `<button type=button data-pm="${g.id}">${esc(g.p)} (${g.s})</button>`).join("")}</div></div>`;
  }
  if (S.offreDissolution && peutGouverner() === false || (S.offreDissolution && S.role === "president")) {
    proc += `<div class=card><b>Dissoudre après la présidentielle ?</b><p>L'Assemblée n'est pas alignée sur le nouveau Président. Le délai de l'article 12 est écoulé.</p><button type=button id=dissOui>Dissoudre</button> <button type=button id=dissNon>Garder cette Assemblée</button></div>`;
  }
  const pr = S.procedure;
  if (pr && peutGouverner() && (pr.etape === "negociation" || pr.etape === "rejete_an" || pr.etape === "bloque")) {
    const d = draftEffectif();
    const a = analyse(d);
    const cartes = a.votes.detail.filter(g => g.id !== "vac").map(g => {
      const profil = groupeData(g.id);
      const cons = (profil && profil.concessions) || [];
      return `<div class=grp><div class=hd><b>${esc(g.p)}</b><span>${g.s} sièges · ${esc(g.vote)} · score ${g.score}</span></div>
        ${g.lignes.length ? `<p class=bad>Ligne rouge : ${g.lignes.map(esc).join(" ; ")}</p>` : `<p class=note>Pas de ligne rouge franchie.</p>`}
        <div class=row>${cons.map(c => `<button type=button class="small ${d.concessions[g.id] === c.id ? "on" : ""}" data-g="${g.id}" data-c="${c.id}">${esc(c.label)}</button>`).join("") || "<span class=note>Pas de concession catalogue.</span>"}</div></div>`;
    }).join("");
    proc += `<h2>Négociation à l'Assemblée</h2><div class=card>${htmlEstimation(a)}</div>${cartes}
      <div class=row><button class=primary id=btnVote>Scrutin</button><button type=button id=btn493>Engager le 49.3</button><button type=button id=btnRet>Retirer le texte</button></div>`;
  } else if (pr && pr.etape === "senat") {
    const v0 = votesSenat(draftEffectif());
    proc += `<h2>Sénat <span class="badge est">composition estimée</span></h2>
    <p class=note>${esc(D.senat.note)}</p>
    <div class=card><p>Sans amendement : ${v0.pour} pour, ${v0.contre} contre. ${v0.adopte ? "Le Sénat suivrait." : "Le Sénat ne suit pas : ce sera la CMP, sauf si un amendement retourne la chambre."}</p>
    ${(D.senat.amendements || []).map(am => `<div class=row><button type=button data-am="${am.id}">${esc(am.label)}</button></div>`).join("")}
    </div>`;
  } else if (pr && pr.etape === "cmp") {
    proc += `<h2>Commission mixte paritaire</h2><div class=card><p>Sept députés, sept sénateurs, dans le modèle : une probabilité, pas la liste des noms. Chance de compromis : <b>${f0((pr.probaCmp || 0) * 100)} %</b>.</p>
    <p class=note>Si la CMP échoue et que le texte est financier, l'Assemblée a le dernier mot. Sinon le texte meurt.</p>
    <button class=primary id=btnCmp>Conclure la CMP</button></div>`;
  } else if (pr && pr.etape === "terminee") {
    proc += `<div class=card><p>Procédure terminée (${esc(pr.resultat || "")}).</p><button type=button id=btnClose>Revenir aux groupes</button></div>`;
  }
  const diss = peutDissoudre();
  m.innerHTML = `<h2>Assemblée nationale — ${D.institutions.siegesAssemblee} sièges, majorité absolue ${D.institutions.majoriteAbsolue}</h2>
  <p class=note>Départ de partie : décompte fourni, dont 3 vacants. Les vacants comptent dans les 577 pour la censure et ne votent pas. GDR n'est pas le PCF. ${badge("utilisateur")}</p>
  <div class=card>${barreGroupes(P, maxS)}</div>
  <div class=card><p>Coalition actuelle : <b>${siegesCoalition()}</b> sièges (${(S.coalition || []).map(id => { const g = P.find(x => x.id === id); return g ? g.p : id; }).join(", ")}). ${S.cohabitation ? "Cohabitation." : "Même bord que le Président."} 49.3 utilisés : ${S.n493 || 0}. Quota hors budget cette session : ${S.quota493 || 0} / 1.</p>
  <p class=note>${esc(diss.raison)}</p>
  ${S.role === "president" ? `<button type=button id=btnDiss ${diss.ok ? "" : "disabled"}>Dissoudre</button>` : `<button type=button id=btnDemDiss>Demander une dissolution au Président</button>`}
  </div>
  ${proc}
  <h2>Sénat — 348 sièges <span class="badge est">estimation</span></h2>
  <div class=card>${(D.senat.groupes || []).map(g => `<div class=row><label>${esc(g.p)}</label><span class=bar style="width:${g.s / 3.6}%;background:#4fa3d1"></span>${g.s}</div>`).join("")}</div>
  <h2>Lois récentes</h2><div class=card>${(S.lois || []).slice(0, 8).map(l => `<p>${esc(l.d)} — ${esc(l.origine)}, solde ${l.solde >= 0 ? "+" : ""}${f1(l.solde)} Md€ (${esc(l.mode)})</p>`).join("") || "<p class=note>Aucune loi promulguée.</p>"}</div>`;
  m.querySelectorAll("[data-g]").forEach(b => b.onclick = () => { accorder(b.dataset.g, b.dataset.c); renderParl(m); });
  const vote = $("#btnVote"), b493 = $("#btn493"), ret = $("#btnRet"), cmp = $("#btnCmp"), close = $("#btnClose");
  if (vote) vote.onclick = () => { scrutin(); render(); };
  if (b493) b493.onclick = () => { engager493(); render(); };
  if (ret) ret.onclick = () => { S.procedure = null; S.draft = draftVierge(); log("Texte retiré avant le vote."); render(); };
  if (cmp) cmp.onclick = () => { conclureCMP(); render(); };
  if (close) close.onclick = () => { S.procedure = null; render(); };
  m.querySelectorAll("[data-am]").forEach(b => b.onclick = () => { examenSenat(b.dataset.am); render(); });
  m.querySelectorAll("[data-pm]").forEach(b => b.onclick = () => { nommerPM(b.dataset.pm); render(); });
  const bd = $("#btnDiss");
  if (bd) bd.onclick = () => { if (peutDissoudre().ok) { dissoudre(); render(); } };
  const dem = $("#btnDemDiss");
  if (dem) dem.onclick = () => { const r = demanderDissolution(); if (r && r.raison) modal("Dissolution", `<p>${esc(r.raison)}</p>`); render(); };
  const oui = $("#dissOui"), non = $("#dissNon");
  if (oui) oui.onclick = () => { executerDissolution("décision du Président après la présidentielle"); render(); };
  if (non) non.onclick = () => { S.offreDissolution = false; recomposerMajorite("le choix de ne pas dissoudre"); render(); };
}

function renderSond(m) {
  const live = modeleSondages();
  const dernier = (S.sondages && S.sondages[0]) || live;
  const groupes = [...new Set(D.categoriesSondage.map(c => c.groupe))];
  const cols = D.categoriesSondage.filter(c => c.groupe === ui.cat);
  const head = cols.map(c => `<th>${esc(c.id)}</th>`).join("");
  const body = D.candidats2027.map((c, i) => `<tr><td>${esc(c.n)}</td><td><b>${f1(live.intentions[i].v)}</b></td>${cols.map(col => `<td>${f0(live.categories[col.id][i])}</td>`).join("")}</tr>`).join("");
  m.innerHTML = `<h2>Sondages</h2>
  <p class=note>Ce ne sont pas des sondages d'institut. Le modèle part de bases de scénario et les déforme avec le chômage, les prix, le déficit, les retraites et la saillance des sujets. ${badge("estimation")} Les colonnes par catégorie sont normalisées à 100 % à l'intérieur de chaque colonne.</p>
  <div class=grid>
    ${kpi("Président", f0(live.popularite.president) + " %")}
    ${kpi("Premier ministre", f0(live.popularite.pm) + " %")}
    ${kpi("Camp du joueur (opposition)", f0(live.popularite.opposition) + " %", "", "si vous n'êtes plus en fonction")}
  </div>
  <h2>Intentions pour la prochaine présidentielle — estimation instantanée</h2>
  <div class=card>${live.intentions.map(c => `<div class=row><label>${esc(c.n)} <span class=k>${esc(c.p)}</span></label><span class=bar style="width:${c.v * 2.2}%;background:${c.c}"></span>${f1(c.v)} %</div>`).join("")}</div>
  <div class=tabs>${groupes.map(g => `<button type=button data-cat="${esc(g)}" class="${ui.cat === g ? "on" : ""}">${esc(g)}</button>`).join("")}</div>
  <div class=tablewrap><table><tr><th>Candidat</th><th>Ensemble</th>${head}</tr>${body}</table></div>
  <h2>Dernière vague trimestrielle publiée (T${dernier.tri} ${dernier.annee})</h2>
  <div class=card>${(dernier.intentions || []).map(c => `<div class=row><label>${esc(c.n)}</label>${f1(c.v)} %</div>`).join("")}</div>
  <p class=note>${(S.sondages || []).length} vague(s) archivée(s) depuis le début de la partie.</p>`;
  m.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => { ui.cat = b.dataset.cat; renderSond(m); });
}

function renderRet(m) {
  const rows = projectionRetraites();
  const r = S.ret;
  m.innerHTML = `<h2>Retraites — modèle de type COR</h2>
  <p class=note>Identité simple : cotisations (masse salariale × taux) moins prestations (retraités × pension × 12). Les retraités croissent plus vite que les cotisants, sauf si l'âge ou la durée ralentit les départs. L'inflation de la projection converge vers 2 %. Ce n'est pas la microsimulation du COR. ${badge("modele")}</p>
  <div class=grid>
    ${kpi("Âge légal", fage(r.ageLegal))}
    ${kpi("Durée", fduree(r.dureeTrimestres))}
    ${kpi("Indexation", r.indexation === "prix" ? "prix" : r.indexation === "gel" ? "gel" : r.indexation === "salaires" ? "salaires" : "mixte")}
    ${kpi("Taux de cotisation", f1(r.tauxCotisation) + " %", "", "ordre de grandeur")}
    ${kpi("Cotisants", f2(r.demo.cotisantsM) + " M")}
    ${kpi("Retraités", f2(r.demo.retraitesM) + " M")}
    ${kpi("Ratio", f2(r.ratioCotRet), r.ratioCotRet < 1.5 ? "bad" : "")}
    ${kpi("Solde du système", f1(r.soldeMd) + " Md€", r.soldeMd < 0 ? "bad" : "good", "départ −6,6 Md€, cadrage")}
    ${kpi("Pension moyenne", f0(r.pensionMoyMensuelle) + " €", "", "par mois")}
    ${kpi("Population", f1(r.demo.populationM) + " M", "", "fécondité " + f2(r.demo.fecondite))}
  </div>
  <p class=note>Espérance de vie ${f1(r.demo.esperanceVie)} ans, solde migratoire ${f0(r.demo.soldeMigratoireMilliers)} milliers par an : hypothèses démographiques stylisées. ${badge("estimation")}</p>
  <h2>Projection à politique inchangée, 25 ans</h2>
  <div class=tablewrap><table><tr><th>Année</th><th>Ratio</th><th>Cotisants</th><th>Retraités</th><th>Pension €</th><th>Cotisations</th><th>Prestations</th><th>Solde</th></tr>
  ${rows.map(x => `<tr><td>${x.annee}</td><td>${f2(x.ratio)}</td><td>${f2(x.cotisants)}</td><td>${f2(x.retraites)}</td><td>${f0(x.pension)}</td><td>${f0(x.cotisationsMd)}</td><td>${f0(x.pensionsMd)}</td><td class="${x.solde < 0 ? "bad" : "good"}">${f1(x.solde)}</td></tr>`).join("")}
  </table></div>
  <p class=note>Pour changer l'âge, la durée, le taux ou l'indexation, passez par Décisions puis par le Parlement. Le gel et un report d'âge franchissent les lignes rouges de la gauche.</p>`;
}

function renderElec(m) {
  const ev = S.elections || {};
  const blocs = htmlBlocs(simulerLegislatives(false));
  let html = `<h2>Élections</h2><p class=note>${esc(D.noteCandidats)}</p>`;
  html += blocElection(2027, ev.p2027) + blocElection(2032, ev.p2032);
  if (S.bilan) {
    const b = S.bilan, d0 = b.depart, f = b.fin;
    html += `<h2>Bilan 2026–2032</h2><div class=card><p>${esc(b.gagnant)} l'emporte en 2032${b.joueur ? ", votre camp est devant" : ""}.</p>
    <table><tr><th></th><th>Départ (paramètres)</th><th>Fin simulée</th></tr>
    ${ligneB("Croissance", f1(d0.croissance) + " %", f1(f.croissance) + " %")}
    ${ligneB("Inflation", f1(d0.inflation) + " %", f1(f.inflation) + " %")}
    ${ligneB("Chômage", f1(d0.chomage) + " %", f1(f.chomage) + " %")}
    ${ligneB("Dette", f1(d0.dettePct) + " %", f1(f.dettePct) + " %")}
    ${ligneB("Déficit", f1(d0.deficitPct) + " %", f1(f.deficitPct) + " %")}
    ${ligneB("OAT", f1(d0.oat10) + " %", f1(f.oat10) + " %")}
    ${ligneB("Gini", f2(d0.gini), f2(f.gini))}
    ${ligneB("Pauvreté", f1(d0.pauvrete) + " %", f1(f.pauvrete) + " %")}
    ${ligneB("Solde retraites", f1(d0.soldeRetraites), f1(f.soldeRetraites))}
    ${ligneB("Note", "A+ (hypothèse)", esc(f.notation))}
    </table></div>`;
  }
  html += `<h2>Législatives anticipées — pronostic sans bruit de campagne</h2>
  <p class=note>${esc(D.legislatives.note)} ${badge("modele")}</p><div class=card>${blocs}</div>`;
  m.innerHTML = html;
}
function ligneB(a, b, c) { return `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`; }
function blocElection(annee, E) {
  if (!E) return `<div class=card><b>Présidentielle ${annee}</b><p class=note>${annee === 2027 ? "Scrutin simulé à l'ouverture du T2 2027." : "Scrutin simulé à l'ouverture du T2 2032, puis fin de partie."}</p></div>`;
  return `<div class=card><b>Présidentielle ${annee} — premier tour</b>${E.t1.map(c => `<div class=row><label>${esc(c.n)}</label><span class=bar style="width:${c.s * 2}%;background:${c.c}"></span>${f1(c.s)} %</div>`).join("")}
  <p>Second tour : ${esc(E.finale[0])} ${f1(E.r2[0])} % — ${esc(E.finale[1])} ${f1(E.r2[1])} %. <b>${esc(E.gagnant)}</b> est élu${E.joueur ? " — votre camp" : ""}.</p></div>`;
}
function htmlBlocs(seats) {
  return S.assemblee.filter(g => g.id !== "vac").map(g => `<div class=row><label>${esc(g.p)}</label><span class=bar style="width:${(seats[g.id] || 0) / 2}%;background:${g.c}"></span>${seats[g.id] || 0}</div>`).join("");
}

function renderSrc(m) {
  const types = [["tous", "Tout"], ["parametre", "Paramètres"], ["utilisateur", "Composition fournie"], ["estimation", "Estimations"], ["modele", "Règles du modèle"]];
  const liste = D.sources.filter(s => ui.src === "tous" || s.type === ui.src);
  m.innerHTML = `<h2>Sources et statut des chiffres</h2>
  <p>Rien, dans cet écran, ne doit être lu comme une prévision. Les paramètres de départ ont été fournis pour la partie. Le reste est une estimation d'ordre de grandeur ou une règle de modèle, et il est étiqueté.</p>
  <div class=tabs>${types.map(([id, lab]) => `<button type=button data-src="${id}" class="${ui.src === id ? "on" : ""}">${lab}</button>`).join("")}</div>
  <div class=card><table>${liste.map(s => `<tr><td style="width:28%">${badge(s.type)} <b>${esc(s.l)}</b></td><td>${esc(s.d)}</td></tr>`).join("")}</table></div>
  <h2>Multiplicateurs utilisés</h2>
  <div class=card><p class=note>${esc(D.multiplicateurs.note)}</p><table><tr><th>Mission</th><th>Multiplicateur</th><th>Délai</th><th>Type</th></tr>
  ${Object.entries(D.multiplicateurs).filter(([k]) => k !== "note" && k !== "impot").map(([k, v]) => `<tr><td>${esc(D.missions[k] || k)}</td><td>${f1(v.m)}</td><td>${v.delai} trim.</td><td>${esc(v.type)}</td></tr>`).join("")}
  ${Object.entries(D.multiplicateurs.impot).map(([k, v]) => `<tr><td>Impôt ${esc(k)} (signe inversé)</td><td>${f1(v.m)}</td><td>${v.delai} trim.</td><td>prélèvement</td></tr>`).join("")}
  </table></div>
  <p class=note>Architecture multi-pays : les données sont dans <code>data/fr.js</code> (<code>COUNTRIES.fr</code>). Un autre fichier <code>data/xx.js</code> peut définir <code>COUNTRIES.xx</code> sur le même schéma, être ajouté à <code>index.html</code>, et se lancer avec <code>?pays=xx</code>.</p>`;
  m.querySelectorAll("[data-src]").forEach(b => b.onclick = () => { ui.src = b.dataset.src; renderSrc(m); });
}
function drawCharts() {
  if (!isBrowser) return;
  document.querySelectorAll("canvas[data-h]").forEach(c => {
    const d = (S.hist && S.hist[c.dataset.h]) || [];
    if (!d.length) return;
    const x = c.getContext("2d");
    c.width = Math.max(300, c.clientWidth * 2); c.height = 280;
    const W = c.width, H = c.height;
    const mn = Math.min(...d), mx = Math.max(...d);
    const span = (mx - mn) || 1;
    x.clearRect(0, 0, W, H);
    x.strokeStyle = "#33476b"; x.beginPath();
    if (mn < 0 && mx > 0) { const y0 = H - (0 - mn) / span * H; x.moveTo(0, y0); x.lineTo(W, y0); }
    x.stroke();
    x.strokeStyle = "#7eb6ff"; x.lineWidth = 3; x.beginPath();
    d.forEach((v, i) => {
      const px = d.length < 2 ? W / 2 : i / (d.length - 1) * (W - 8) + 4;
      const py = H - 8 - (v - mn) / span * (H - 20);
      i ? x.lineTo(px, py) : x.moveTo(px, py);
    });
    x.stroke();
    x.fillStyle = "#e8eef7"; x.font = "22px sans-serif";
    x.fillText(f1(d[d.length - 1]), 8, 28);
  });
}
function modal(t, h) {
  if (!isBrowser) return;
  const d = document.createElement("div");
  d.className = "modal";
  d.innerHTML = `<div><h2>${esc(t)}</h2>${h}<button type=button>OK</button></div>`;
  d.querySelector("button").onclick = () => d.remove();
  document.body.appendChild(d);
}

function boot() {
  if (!isBrowser) return;
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { saved = null; }
  document.querySelectorAll("nav button").forEach(b => b.onclick = () => { view = b.dataset.v; render(); });
  const tourBtn = $("#tour"), saveBtn = $("#save"), resetBtn = $("#reset");
  if (tourBtn) tourBtn.onclick = () => tour();
  if (saveBtn) saveBtn.onclick = () => sauvegarder(false);
  if (resetBtn) resetBtn.onclick = () => {
    if (typeof confirm === "function" && !confirm("Recommencer une partie ?")) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    S = null; view = "dash"; render();
  };
  if (saved && saved.version === 3 && saved.e && saved.ret) {
    S = saved;
    rngState = S.rng || 1;
    render();
  } else render();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
}

const SIM = {
  nouvelle, tour, preparer, analyser: () => analyse(draftEffectif()),
  ouvrirNegociation, accorder, scrutin, engager493, examenSenat, conclureCMP, bouclerTexte,
  dissoudre, demanderDissolution, referendum, nommerPM, actionOpposition,
  projection: projectionRetraites, sondages: modeleSondages,
  peutDissoudre, peutGouverner, executerDissolution,
  sommeSieges: () => S.assemblee.reduce((a, g) => a + g.s, 0),
  etat: () => S
};
if (typeof globalThis !== "undefined") globalThis.SIM = SIM;
boot();
