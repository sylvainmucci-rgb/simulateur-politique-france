"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const sandbox = {
  console, Math, Date, JSON, Object, Array, Number, String, Boolean, Error,
  parseInt, parseFloat, isNaN, isFinite, URLSearchParams, location: { search: "?pays=fr" }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const f of fs.readdirSync(path.join(root, "data")).filter(x => x.endsWith(".js"))) {
  vm.runInContext(fs.readFileSync(path.join(root, "data", f), "utf8"), sandbox, { filename: f });
}
vm.runInContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), sandbox, { filename: "app.js" });
const SIM = sandbox.SIM;
function assert(c, m) { if (!c) { console.error("ÉCHEC", m); process.exit(1); } }
SIM.nouvelle();
let S = SIM.etat();
S.silenceEvenements = true;
const d1 = SIM.appliquerRupture("dissolution");
assert(d1.ok, "dissolution");
assert(S.regime.parlement === "dissous", "parlement dissous");
assert(/oppos/i.test(S.journal[0].texte) || S.journal[0].prevus.length >= 0, "journal");
const d2 = SIM.appliquerRupture("dissolution");
assert(!d2.ok, "seconde dissolution bloquée");
const a16 = SIM.appliquerRupture("article16");
assert(a16.ok && S.regime.article16, "article 16");
const d3 = SIM.appliquerRupture("dissolution");
assert(!d3.ok && /article 16/i.test(d3.raison), "pas de dissolution sous l'article 16");
const sus = SIM.appliquerRupture("suspendre");
assert(sus.ok && S.regime.coup > 20, "suspension coûte");
assert(S.journal[0].texte.includes("Conseil constitutionnel"), "opposant cité");
const fx = SIM.appliquerRupture("frexit");
assert(fx.ok && S.regime.ue === false && S.regime.euro === false, "frexit");
assert(S.regime.sanctions >= 40, "sanctions");
SIM.avancer("semaine");
assert(S.date === "2026-11-09", "le temps avance encore");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const man = fs.readFileSync(path.join(root, "manifest.json"), "utf8");
assert(html.includes("Sovereign"), "titre");
assert(man.includes("Sovereign") && man.includes("Élysée"), "manifest");
console.log("Régime : OK", { coup: S.regime.coup, crise: S.regime.crise, sanctions: S.regime.sanctions });
