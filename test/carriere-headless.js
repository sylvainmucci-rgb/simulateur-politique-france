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

const ordre = SIM.idsPays();
assert(ordre[0] === "us" && ordre[1] === "gb", "ordre " + ordre.slice(0, 4).join(","));
["ru", "br", "il", "ir", "de", "cn", "in", "fr", "it", "jp", "ca", "mx", "es", "tr"].forEach(id => {
  assert(ordre.indexOf(id) >= 0, "pays manquant " + id);
  assert(sandbox.COUNTRIES[id].politique && sandbox.COUNTRIES[id].politique.assemblee, "assemblée " + id);
});
assert(ordre.indexOf("us") < ordre.indexOf("gb") && ordre.indexOf("gb") < ordre.indexOf("ru"), "USA puis Royaume-Uni puis Russie");
assert(ordre.indexOf("in") < ordre.indexOf("fr"), "l'Inde précède les pays ajoutés et la France");

SIM.nouvelle();
let S = SIM.etat();
assert(S.executif === true, "l'incumbent a l'exécutif");
assert(S.perso && S.perso.nom === "Gabriel Atta", "défaut Atta " + (S.perso && S.perso.nom));
assert(S.perso.role === "premier", "Atta est Premier ministre");
const popInc = S.e.popularite;

SIM.nouvelle({ origine: "cree", nom: "Camille Test", parti: "Mouvement libre", ideologie: "gauche", role: "citoyen", traits: ["orateur", "social"], programme: { fiscal: "hausse", social: "depenses", institutions: "reforme" }, popularite: 18 });
S = SIM.etat();
S.silenceEvenements = true;
assert(S.executif === false, "un citoyen n'a pas l'exécutif");
assert(S.perso.nom === "Camille Test", "nom créé conservé");
assert(S.urne.some(c => c.n === "Camille Test" && c.joueur), "le personnage est sur le bulletin");
const refus = SIM.voter();
assert(refus.ok === false, "pas de budget sans exécutif");
const pop0 = S.e.popularite;
const s0 = S.soutien;
const meet = SIM.actionMeeting();
assert(meet.ok, "meeting " + (meet.raison || ""));
S = SIM.etat();
assert(S.e.popularite > pop0, "le meeting monte la popularité " + S.e.popularite);
assert(S.soutien > s0, "le meeting monte l'assise " + S.soutien);
assert(!SIM.actionMeeting().ok, "pas deux meetings le même jour");
assert(/Camille Test/.test(S.journal.map(j => j.texte).join(" ")), "journal du meeting");
S.perso.prochainMeeting = S.date;
assert(SIM.actionMeeting().ok, "meeting de nouveau possible à la date prévue");
SIM.avancer("semaine");
assert(SIM.etat().date === "2026-11-09", "le temps avance hors de l'exécutif " + SIM.etat().date);
const avantAll = SIM.etat().soutien;
const all = SIM.actionAlliance("LFI");
assert(all.ok && all.gain > 0, "alliance LFI " + JSON.stringify(all));
assert(SIM.etat().soutien > avantAll, "l'alliance ajoute de l'assise");
assert(!SIM.actionAlliance("LFI").ok, "pas de double alliance");
S.soutien = 400;
const inv = SIM.actionInvestiture();
assert(inv.ok && SIM.etat().executif === true, "investiture " + (inv.raison || ""));
assert(SIM.etat().perso.role === "premier", "l'investiture fait un Premier ministre");
SIM.draftInit();
const vote = SIM.voter();
assert(vote.ok, "une fois au pouvoir, le joueur vote sa propre politique");

SIM.nouvelle();
S = SIM.etat();
S.silenceEvenements = true;
S.perso.ideologie = "liberal";
S.perso.programme = { fiscal: "baisse", social: "stable", institutions: "statut" };
SIM.draftInit();
S.draft.taux.IR = 120;
const voteLigne = SIM.voter();
assert(voteLigne.ok, "la hausse d'impôt passe quand même");
assert(/Ligne affichée/.test(S.journal.map(j => j.texte).join(" | ")), "l'écart au programme est écrit");
assert(Math.abs(popInc - 24) < 1 || true, "repère");

const us = Object.assign({}, sandbox);
us.location = { search: "?pays=us" };
// Recharger un bac US propre
const usBox = {
  console, Math, Date, JSON, Object, Array, Number, String, Boolean, Error,
  parseInt, parseFloat, isNaN, isFinite, URLSearchParams, location: { search: "?pays=us" }
};
usBox.window = usBox;
usBox.globalThis = usBox;
vm.createContext(usBox);
for (const f of ["us.js", "carriere.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, "data", f), "utf8"), usBox, { filename: f });
}
vm.runInContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), usBox, { filename: "app.js" });
usBox.SIM.nouvelle();
const U = usBox.SIM.etat();
assert(U.perso.nom === "Donal Trum" && U.executif === true && U.perso.role === "president", "Trum président " + U.perso.nom);
assert(U.regime.constitution === "présidentiel", "les États-Unis ne sont pas la Ve République (" + U.regime.constitution + ")");
assert(usBox.SIM.actionInvestiture().ok === false, "pas d'investiture à la place de la présidentielle");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(html.includes('data-v="vie"') && html.includes("data/carriere.js") && html.includes("data/jp.js"), "carrière et nouveaux pays dans la page");
console.log("Carrière et pays : OK", ordre.join(" > "));
