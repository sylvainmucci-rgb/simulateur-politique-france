"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function load() {
  const sandbox = {
    console, Math, Date, JSON, Object, Array, Number, String, Boolean, Error,
    parseInt, parseFloat, isNaN, isFinite, URLSearchParams, NaN, Infinity,
    location: { search: "" }
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
function assert(c, m) { if (!c) { echecs++; console.error("ÉCHEC : " + m); throw new Error(m); } }

const sb = load();
const SIM = sb.SIM;
SIM.nouvelle();
let S = SIM.etat();
S.silenceEvenements = true;
assert(S.date === "2026-11-02", "date de départ " + S.date);
const pop0 = S.e.popularite;
const inf0 = S.e.inflation;
SIM.draftInit();
S.draft.taux.TVA = 21;
const vote = SIM.voter();
assert(vote.ok, "vote TVA");
S = SIM.etat();
const journalVote = S.journal.map(j => j.texte).join(" | ");
assert(/TVA/.test(journalVote), "journal cite la TVA : " + journalVote);
assert(/popularité/.test(journalVote) && /-\s*3/.test(journalVote.replace("−", "-")), "popularité −3 : " + journalVote);
assert(Math.abs((pop0 - 3) - S.e.popularite) < 0.05, "popularité appliquée " + S.e.popularite + " vs " + (pop0 - 3));
assert(S.effets.filter(e => !e.fait && /TVA/.test(e.cause)).length === 2, "deux échéances TVA");
assert(Math.abs(S.e.inflation - inf0) < 0.05, "l'inflation ne bouge pas le jour du vote");

SIM.avancer("semaine");
S = SIM.etat();
assert(S.date === "2026-11-09", "une semaine pile " + S.date);
assert(S.recap && S.recap.pas === "1 semaine", "récap de la semaine");

for (let i = 0; i < 4; i++) SIM.avancer("semaine");
S = SIM.etat();
assert(S.date === "2026-12-07", "cinq semaines " + S.date);
const apres4 = S.journal.map(j => j.texte).join(" | ");
assert(/TVA/.test(apres4) && /inflation/.test(apres4), "inflation différée rattachée à la TVA : " + apres4);
assert(S.effets.filter(e => e.fait && /TVA/.test(e.cause)).length >= 1, "une échéance TVA est tombée");
for (let i = 0; i < 6; i++) SIM.avancer("semaine");
S = SIM.etat();
assert(S.effets.filter(e => e.fait && /TVA/.test(e.cause)).length === 2, "les deux échéances TVA sont tombées");
assert(S.e.inflation > inf0 + 0.15, "l'inflation garde la trace de la TVA (" + S.e.inflation + " contre " + inf0 + ")");

const rec = SIM.avancer("mois");
function somme(k) {
  let s = 0;
  for (const g of rec.groupes) s += g.deltas[k] || 0;
  s += rec.residual[k] || 0;
  return s;
}
const obs = rec.apres.inflation - rec.avant.inflation;
assert(Math.abs(somme("inflation") - obs) < 0.02, "le récap explique l'inflation " + somme("inflation") + " vs " + obs);
assert(rec.lignesJournal && rec.lignesJournal.length >= 1, "lignes de récap");

SIM.nouvelle();
S = SIM.etat();
S.silenceEvenements = true;
const du = S.date;
S.effets.push({ echeance: SIM.addDays(S.date, 10), cause: "Alerte test", inflation: 0.3, important: true, fait: false, decisionDate: S.date });
const recPause = SIM.avancer("an");
S = SIM.etat();
const ecoule = Math.round((new Date(S.date) - new Date(du)) / 86400000);
assert(recPause.pause && /Alerte test/.test(recPause.pause), "pause sur l'alerte : " + recPause.pause);
assert(ecoule < 21, "le saut d'un an s'est arrêté (" + ecoule + " j)");
assert(/Alerte test/.test(S.journal.map(j => j.texte).join(" ")), "journal de l'alerte");

const sw = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const manifest = fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf8");
assert(sw.includes("simfr-v3"), "cache SW");
assert(html.includes("<title>Statecraft</title>") && html.includes('data-pas="mois"') && html.includes('id="horloge"'), "titre et barre de temps");
assert(manifest.includes('"name":"Statecraft"') && manifest.includes('"short_name":"Statecraft"'), "manifest");
console.log("Journal et temps : OK");
console.log(JSON.stringify({ date: S.date, pause: recPause.pause, inflationApresTVA: inf0 }, null, 2));
