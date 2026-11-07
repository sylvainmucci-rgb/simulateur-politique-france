"use strict";
/* Partie complète, sans navigateur. Usage : node test/partie-headless.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function load() {
  const sandbox = {
    console, Math, Date, JSON, Object, Array, Number, String, Boolean, Error,
    parseInt, parseFloat, isNaN, isFinite, Promise, Set, Map, RegExp,
    URLSearchParams, NaN, Infinity,
    location: { search: "" },
    navigator: {},
    localStorage: {
      _s: {},
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._s, k) ? this._s[k] : null; },
      setItem(k, v) { this._s[k] = String(v); },
      removeItem(k) { delete this._s[k]; }
    }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const root = path.join(__dirname, "..");
  vm.runInContext(fs.readFileSync(path.join(root, "data/fr.js"), "utf8"), sandbox, { filename: "data/fr.js" });
  vm.runInContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), sandbox, { filename: "app.js" });
  return sandbox;
}

let echecs = 0;
function assert(cond, msg) {
  if (!cond) {
    echecs++;
    console.error("ÉCHEC : " + msg);
    throw new Error(msg);
  }
}
function finis(o, chemin, vu) {
  if (o == null || typeof o !== "object") {
    if (typeof o === "number") assert(Number.isFinite(o), "nombre non fini " + chemin + " = " + o);
    return;
  }
  if (vu.has(o)) return;
  vu.add(o);
  if (Array.isArray(o)) {
    if (chemin.endsWith(".news") || chemin.endsWith(".reactions")) return;
    o.forEach((v, i) => finis(v, chemin + "[" + i + "]", vu));
    return;
  }
  for (const k of Object.keys(o)) {
    if (k === "news") continue;
    finis(o[k], chemin + "." + k, vu);
  }
}

const sb = load();
const SIM = sb.SIM;
const D = sb.COUNTRIES.fr;
assert(SIM && D, "chargement du moteur");
assert(D.evenements.length >= 30, "au moins 30 événements (" + D.evenements.length + ")");
const somme = D.politique.assemblee.reduce((a, g) => a + g.s, 0);
assert(somme === 577, "577 sièges au départ (" + somme + ")");
assert(D.smic.brutMensuel === 1867.02 && D.smic.statut === "à confirmer", "SMIC");
assert(D.eco.croissance === 0.4 && D.eco.croissanceT === -0.1 && D.eco.inflation === 3.8, "macro croissance et prix");
assert(D.eco.chomage === 8.5 && D.eco.dettePct === 119 && D.eco.detteMd === 3600, "chômage et dette");
assert(D.eco.deficitPct === 5.4 && D.eco.oat10 === 4.76, "déficit et OAT");
const txt = JSON.stringify(D);
assert(txt.includes("Bardell") && txt.includes("Mélencho") && txt.includes("Le Pe") && txt.includes("Macro"), "noms tronqués");
assert(txt.includes("n'est pas le PCF") || txt.includes("n'est pas le parti PCF") || D.sources.some(s => s.d.includes("n'est pas le PCF")), "GDR distinct du PCF");
assert(D.sources.some(s => s.type === "parametre") && D.sources.some(s => s.type === "estimation"), "sources étiquetées");
assert(D.groupes.gdr && D.groupes.rn.s === undefined, "profils séparés des sièges");
assert(D.politique.assemblee.find(g => g.id === "gdr").s === 17, "GDR 17");
assert(D.politique.assemblee.find(g => g.id === "rn").s === 121, "RN 121");
assert(D.categoriesSondage.length >= 12, "catégories de sondage");

function verifier(et, tour) {
  finis(et.e, "e", new Set());
  finis(et.secteurs, "secteurs", new Set());
  finis(et.ret, "ret", new Set());
  finis(et.dep, "dep", new Set());
  finis(et.rec, "rec", new Set());
  assert(et.assemblee.reduce((a, g) => a + g.s, 0) === 577, "sièges " + tour);
  assert(et.e.chomage >= 2 && et.e.chomage <= 25, "chômage hors borne " + et.e.chomage);
  assert(et.e.inflation >= -2 && et.e.inflation <= 20, "inflation hors borne " + et.e.inflation);
  assert(et.e.dettePct >= 40 && et.e.dettePct <= 220, "dette hors borne " + et.e.dettePct);
  assert(et.e.deficitPct >= -6 && et.e.deficitPct <= 20, "déficit hors borne " + et.e.deficitPct);
  assert(et.e.oat10 >= 0 && et.e.oat10 <= 16, "OAT hors borne " + et.e.oat10);
  assert(et.ret.ratioCotRet > 0.4 && et.ret.ratioCotRet < 3, "ratio retraites " + et.ret.ratioCotRet);
  assert(et.e.gini > 0.2 && et.e.gini < 0.5, "gini " + et.e.gini);
  const proj = SIM.projection();
  assert(proj.length === 25, "projection 25 ans");
  finis(proj, "projection", new Set());
}

function jouer(role, seed) {
  SIM.nouvelle(role, { seed: seed });
  let et = SIM.etat();
  assert(Math.abs(et.ret.soldeMd + 6.6) < 0.05, "solde retraites initial " + et.ret.soldeMd);
  assert(Math.abs(et.e.deficitPct - 5.4) < 0.05, "déficit initial calé");
  assert(Math.abs(et.e.dettePct - 119) < 0.05, "dette initiale");
  assert(et.smic === 1867.02, "SMIC de départ");
  const proj0 = SIM.projection();
  assert(Math.abs(proj0[0].solde + 6.6) < 0.2, "année 0 de la projection " + proj0[0].solde);
  const sond0 = SIM.sondages();
  assert(sond0.intentions.length === D.candidats2027.length, "un score par candidat");
  const sommeInt = sond0.intentions.reduce((a, b) => a + b.v, 0);
  assert(Math.abs(sommeInt - 100) < 0.2, "intentions à 100 (" + sommeInt + ")");
  for (const id of Object.keys(sond0.categories)) {
    const col = sond0.categories[id].reduce((a, b) => a + b, 0);
    assert(Math.abs(col - 100) < 0.2, "colonne " + id);
  }
  // Conseil constitutionnel : un barème confiscatoire ne passe pas.
  SIM.preparer({ taux: { IR: 175 } });
  const cc = SIM.scrutin();
  assert(cc && cc.ok === false && cc.cc && cc.cc.length, "censure du barème");
  assert(SIM.etat().taux.IR === 100, "l'IR n'a pas été appliqué");

  let tours = 0;
  let dissoute = false;
  let reforme = false;
  while (!SIM.etat().fini && tours < 40) {
    et = SIM.etat();
    if (SIM.peutGouverner()) {
      if (!reforme && et.tour === 1) {
        SIM.preparer({
          age: Math.min(64, et.ret.ageLegal + 0.5),
          dep: { sante: 1, autres: -1 },
          mesures: { hopital: "plan" }
        });
        SIM.bouclerTexte();
        reforme = true;
      } else if (et.tour % 3 === 0) {
        SIM.preparer({ dep: { education: 0.4, autres: -0.6 } });
        SIM.bouclerTexte();
      } else if (et.tour % 3 === 1) {
        SIM.preparer({ mesures: { immigration: "ferme", climat: "accelerer" } });
        SIM.bouclerTexte();
      }
      if (role === "president" && !dissoute && et.tour >= 3 && SIM.peutDissoudre().ok) {
        const r = SIM.dissoudre();
        assert(r && r.ok, "dissolution présidentielle");
        assert(SIM.sommeSieges() === 577, "577 après dissolution");
        dissoute = true;
      }
      if (role === "president" && et.tour === 5) SIM.referendum("proportionnelle");
      if (role === "pm" && et.tour === 4) SIM.demanderDissolution();
    } else {
      SIM.actionOpposition(tours % 2 === 0 ? "tribune" : "censure");
    }
    const r = SIM.tour();
    assert(r && (r.ok || r.fini), "tour " + tours);
    verifier(SIM.etat(), role + " T" + SIM.etat().tri + " " + SIM.etat().annee);
    tours++;
  }
  et = SIM.etat();
  assert(et.fini, role + " : partie terminée");
  assert(et.annee === 2032, role + " : année " + et.annee);
  assert(et.elections && et.elections.p2027 && et.elections.p2032, role + " : deux présidentielles");
  assert(et.sondages.length >= 10, role + " : sondages trimestriels");
  assert(et.news.length >= 30, role + " : fil d'actualités (" + et.news.length + ")");
  assert(et.bilan && et.bilan.depart && et.bilan.fin, "bilan");
  JSON.parse(JSON.stringify(et));
  return { role, tours, gagnant2027: et.elections.p2027.gagnant, gagnant2032: et.elections.p2032.gagnant, dette: et.e.dettePct, deficit: et.e.deficitPct, chomage: et.e.chomage, soldeRet: et.ret.soldeMd, ratio: et.ret.ratioCotRet, news: et.news.length, lois: (et.lois || []).length };
}

const pm = jouer("pm", 20261107);
const pr = jouer("president", 7);
const sw = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");
assert(sw.includes("simfr-v3"), "cache du service worker");
assert(echecs === 0, "échecs");
console.log("Partie headless terminée sans erreur.");
console.log(JSON.stringify({ premierMinistre: pm, president: pr }, null, 2));
