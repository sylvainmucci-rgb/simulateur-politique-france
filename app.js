"use strict";
const D = COUNTRIES[new URLSearchParams(location.search).get('pays')||'fr'];
const $=s=>document.querySelector(s), f1=x=>(Math.round(x*10)/10).toLocaleString('fr-FR'), f0=x=>Math.round(x).toLocaleString('fr-FR');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), rnd=(a,b)=>a+Math.random()*(b-a);
const KEY='simfr_save_v1'; let S, view='dash';
function nouvelle(){ S={annee:D.debut.annee,tri:D.debut.trimestre,tour:0,e:{...D.eco},taux:{...D.taux},dep:{...D.depenses},rec:{...D.recettes},
  ret:{...D.retraites},smic:D.smic.brutMensuel,file:[],news:[],hist:{pib:[],chomage:[],inflation:[],dette:[],oat:[],deficit:[],pop:[]},
  n493:0,greve:0,soutien:D.politique.soutienBase,bce:2.0,fini:false,elu:null,draft:null,flexUE:0,bouclier:false};
  log("Vous prenez vos fonctions. Croissance atone (T3 : -0,1 %), inflation à 3,8 %, OAT à 4,76 %. Les marchés et Bruxelles attendent un budget crédible.","neg"); snap(); }
function log(t,c=""){S.news.unshift({d:`T${S.tri} ${S.annee}`,t,c}); S.news=S.news.slice(0,80);}
function snap(){const h=S.hist,e=S.e;h.pib.push(e.croissance);h.chomage.push(e.chomage);h.inflation.push(e.inflation);h.dette.push(e.dettePct);h.oat.push(e.oat10);h.deficit.push(e.deficitPct);h.pop.push(e.popularite);}
const totRec=()=>Object.values(S.rec).reduce((a,b)=>a+b,0), totDep=()=>Object.values(S.dep).reduce((a,b)=>a+b,0);

/* ---------- Mesures : chaque mesure décrit sa faisabilité et ses effets ---------- */
function draftInit(){S.draft={taux:{...S.taux},dep:Object.fromEntries(Object.keys(S.dep).filter(k=>k!=='interets').map(k=>[k,0])),age:S.ret.ageLegal,smic:0,mode:'vote'};}
function analyse(d){ // renvoie {dRec,dDep,impulsion,soutien,cc:[],ue:[],alertes:[]}
  const r={dRec:0,dDep:0,soutienG:0,soutienD:0,cc:[],alertes:[],greve:0,inflation:0};
  const t=d.taux; // élasticités simples (Md€ par point)
  r.dRec+=(t.IR-S.taux.IR)/100*S.rec.IR*0.85; r.dRec+=(t.TVA-S.taux.TVA)*10.5*0.95; r.dRec+=(t.IS-S.taux.IS)*2.3*0.8; r.dRec+=(t.CSG-S.taux.CSG)*15.5;
  r.soutienG+=(t.IR-S.taux.IR)*0.6+(t.IS-S.taux.IS)*3-(t.TVA-S.taux.TVA)*8-(t.CSG-S.taux.CSG)*5;
  r.soutienD-=(t.IR-S.taux.IR)*0.8+(t.IS-S.taux.IS)*4+(t.TVA-S.taux.TVA)*6+(t.CSG-S.taux.CSG)*4;
  for(const k in d.dep){const v=S.dep[k]*d.dep[k]/100; r.dDep+=v; r.soutienG+=d.dep[k]*(k==='defense'||k==='securite'?-0.3:1.2); r.soutienD+=d.dep[k]*(k==='defense'||k==='securite'?1.2:-0.4); if(d.dep[k]<-3&&['sante','education'].includes(k)) r.greve+=8;}
  const da=d.age-S.ret.ageLegal; if(da){r.dDep-=da*4*8; r.soutienG-=da*50; r.soutienD+=da*8; r.greve+=Math.max(0,da)*25;}
  r.dDep+=d.smic*0.9; r.inflation+=d.smic*0.05+(t.TVA-S.taux.TVA)*0.5; r.soutienG+=d.smic*4; r.soutienD-=d.smic*2;
  // Conseil constitutionnel
  if(t.IR>150) r.cc.push("IR : hausse > 50 % du barème jugée confiscatoire (principe d'égalité devant les charges publiques, art. 13 DDHC)");
  if(t.TVA>25) r.cc.push("TVA > 25 % : impossible (directive TVA européenne : taux normal libre mais seuil politique ; ici bloqué par le modèle pour rupture d'égalité)");
  if(d.age>67||d.age<60) r.cc.push("Âge légal hors 60–67 ans : non réaliste dans une LFSS (cavalier social, atteinte aux exigences du 11e al. du Préambule de 1946)");
  if(Math.abs(da)>2) r.cc.push("Variation de l'âge > 2 ans d'un coup : risque de censure (atteinte excessive aux situations légalement acquises)");
  if(d.smic>10) r.alertes.push("SMIC +10 % : forte pression sur les PME et l'emploi peu qualifié");
  // Majorité : base + transfert de groupes selon orientation
  const g=clamp(r.soutienG,-60,60), dr=clamp(r.soutienD,-60,60);
  r.voix=S.soutien + (g>0?g*1.2:g*0.3) + (dr>0?dr*1.0:dr*0.5);
  r.voix=Math.round(clamp(r.voix,120,420));
  r.solde=r.dRec-r.dDep; return r;}
function voter(){const d=S.draft, a=analyse(d);
  if(a.cc.length){modal("Conseil constitutionnel — censure",`<p>Le texte serait censuré :</p><ul>${a.cc.map(x=>`<li>${x}</li>`).join('')}</ul><p class=note>Modifiez les mesures.</p>`);return;}
  let ok=false;
  if(d.mode==='vote'){ ok=a.voix>=D.politique.majoriteAbsolue-14; // majorité relative des exprimés
    log(ok?`Le budget rectificatif est adopté (${a.voix} voix pour, majorité relative).`:`Rejet à l'Assemblée : ${a.voix} voix seulement. Le texte retourne en commission.`, ok?'pos':'neg');
    if(!ok){render();return;} }
  else { S.n493++; const censure=(577-a.voix)-50 > D.politique.majoriteAbsolue-20 || (S.n493>2 && Math.random()<0.35);
    log(`Le gouvernement engage sa responsabilité (49.3 n°${S.n493}). Motion de censure déposée.`,'neg');
    if(censure){ log("La motion de censure est ADOPTÉE. Le gouvernement est renversé : le budget tombe, nouveau Premier ministre nommé, -6 pts de popularité.","neg"); S.e.popularite-=6; S.e.confianceMarches-=8; S.soutien-=10; render(); return;}
    log("La motion de censure échoue. Le texte est considéré comme adopté. L'opinion goûte peu le 49.3 (-3 pts).",''); S.e.popularite-=3; S.e.tensionSociale+=5; }
  // application avec délais : recettes immédiates à 60 %, dépenses étalées
  S.taux={...d.taux}; S.rec.IR*=1+(d.taux.IR-100)/100*0; 
  S.file.push({reste:4,dRec:a.dRec/4,dDep:a.dDep/4}); S.ret.ageLegal=d.age; S.smic*=1+d.smic/100;
  S.e.inflation+=a.inflation*0.5; S.file.push({reste:2,inf:a.inflation*0.25});
  S.greve=clamp(S.greve+a.greve,0,100); if(a.greve>20) log(`L'intersyndicale (CGT, CFDT, FO…) appelle à une journée de grève et de manifestations nationales.`,'neg');
  const imp=-a.solde/S.e.pibMd*100; S.file.push({reste:4,g:imp*0.8/4}); // multiplicateur ~0,8
  if(a.solde>15) log(`Bruxelles salue un effort de ${f0(a.solde)} Md€ ; Moody's et S&P prennent note.`,'pos');
  if(a.solde<-10) log(`Les marchés tiquent : creusement de ${f0(-a.solde)} Md€, le spread OAT-Bund s'élargit.`,'neg'), S.e.confianceMarches-=6;
  draftInit(); render();}

/* ---------- Événements aléatoires ---------- */
const EVENTS=[
 [0.10,"Choc pétrolier : le Brent bondit de 25 % après des tensions au Moyen-Orient.",s=>{s.e.inflation+=0.6;s.file.push({reste:2,g:-0.1});},'neg'],
 [0.08,"Agence de notation : perspective négative sur la dette française.",s=>{s.e.confianceMarches-=8;},'neg'],
 [0.08,"Mouvement social des agriculteurs : blocages d'autoroutes contre le Mercosur.",s=>{s.e.tensionSociale+=8;s.e.popularite-=2;},'neg'],
 [0.07,"Canicule et sécheresse : production nucléaire réduite, prix de l'électricité en hausse.",s=>{s.e.inflation+=0.2;s.dep.energie+=2;},'neg'],
 [0.07,"Hausse des droits de douane américains sur les vins, spiritueux et l'aéronautique européens.",s=>{s.file.push({reste:3,g:-0.07});},'neg'],
 [0.08,"Bonne surprise : rebond des exportations aéronautiques (Airbus).",s=>{s.file.push({reste:2,g:0.1});},'pos'],
 [0.06,"Épidémie hivernale sévère : hôpitaux saturés, l'ONDAM dérape.",s=>{s.dep.sante+=3;s.e.popularite-=1;},'neg'],
 [0.06,"La BCE évoque une hausse de taux face à l'inflation de la zone euro.",s=>{s.bce+=0.25;},'neg'],
 [0.07,"Attentat déjoué : la sécurité redevient la priorité des Français.",s=>{s.e.popularite+=1;},''],
 [0.05,"Affaire politique : un ministre mis en examen démissionne.",s=>{s.e.popularite-=3;},'neg'],
 [0.06,"Afflux d'investissements étrangers (Choose France) : 15 Md€ annoncés.",s=>{s.file.push({reste:4,g:0.04});s.e.popularite+=1;},'pos'],
 [0.05,"Crise bancaire régionale en Europe : fuite vers le Bund.",s=>{s.e.confianceMarches-=6;s.file.push({reste:2,g:-0.1});},'neg']];

/* ---------- Tour ---------- */
function tour(){ if(S.fini) return; const e=S.e; let g=0.15, dRec=0, dDep=0, inf=0; // potentiel trim ~0,6 %/an hors chocs
  S.file.forEach(x=>{g+=x.g||0;dRec+=x.dRec||0;dDep+=x.dDep||0;inf+=x.inf||0;x.reste--;}); S.file=S.file.filter(x=>x.reste>0);
  for(const k in S.rec) S.rec[k]+=dRec*S.rec[k]/totRec(); for(const k in S.dep) if(k!=='interets') S.dep[k]+=dDep*S.dep[k]/(totDep()-S.dep.interets);
  // politique monétaire : BCE réagit à l'inflation zone euro (proxy : France)
  S.bce=clamp(S.bce+(e.inflation-2.5)*0.08,0,5); g-=(S.bce-2)*0.05; g-=(e.oat10-3.5)*0.04; g-=S.greve*0.002; g+=rnd(-0.15,0.15);
  e.croissanceT=g; e.croissance=e.croissance*0.75+g*4*0.25;
  e.inflation=clamp(e.inflation+(2.0-e.inflation)*0.15+inf+(g-0.25)*0.2+rnd(-0.15,0.15)-(S.bouclier?0.1:0),-1,15);
  e.chomage=clamp(e.chomage-0.35*(g*4-1.0)/4+ (S.smic/D.smic.brutMensuel-1)*0.5/4 +rnd(-0.05,0.05),3,20);
  const nom=(g+e.inflation/4)/100; e.pibMd*=1+nom;
  for(const k in S.rec) S.rec[k]*=1+nom*1.05; for(const k in S.dep) if(k!=='interets') S.dep[k]*=1+e.inflation/400*0.9;
  S.dep.retraites+= (S.ret.ageLegal<62.75? 0.5:0) ; S.dep.emploi+=(e.chomage-8.5)*0.3;
  // marchés
  const spread=clamp(0.15+0.035*(e.dettePct-100)+0.18*(e.deficitPct-3)+(60-e.confianceMarches)*0.015+S.greve*0.004,0.2,6);
  e.oat10+=(clamp(D.eco.bund10+(S.bce-2)*0.6+spread,0.5,12)-e.oat10)*0.35; S.dep.interets+= (e.oat10/100*e.detteMd - S.dep.interets)*0.03;
  e.confianceMarches=clamp(e.confianceMarches+(e.deficitPct<5?1.5:-1)+(e.dettePct>125?-2:0),0,100);
  const solde=totRec()-totDep(); e.deficitPct=-solde/e.pibMd*100; e.detteMd+=(-solde)/4; e.dettePct=e.detteMd/e.pibMd*100;
  // notation
  const notes=["AAA","AA+","AA","AA-","A+","A","A-","BBB+","BBB"]; let i=notes.indexOf(e.notation);
  if(e.dettePct>124&&e.deficitPct>5&&Math.random()<0.35&&i<8){i++;log(`Dégradation : la France passe à ${notes[i]}.`,'neg');e.confianceMarches-=5;}
  else if(e.deficitPct<3.5&&Math.random()<0.2&&i>0){i--;log(`Relèvement de la note souveraine à ${notes[i]}.`,'pos');}
  e.notation=notes[i];
  // social & opinion
  S.greve=clamp(S.greve*0.6,0,100); e.tensionSociale=clamp(e.tensionSociale*0.9+S.greve*0.3+(e.inflation-2)*2+(e.chomage-7)*1.5,0,100);
  e.popularite=clamp(e.popularite+(1.2*(g-0.2))-(e.inflation-2.5)*0.5-(e.chomage-8.5)*0.8-(e.tensionSociale-50)*0.04+rnd(-1.5,1.5),5,75);
  // UE
  if(e.deficitPct>3&&S.tri===2) log(`Commission européenne (Semestre européen) : la France reste en procédure de déficit excessif (${f1(e.deficitPct)} % vs 3 %). Ajustement structurel de 0,5 pt/an exigé.`,'neg');
  if(e.inflation>3) log(`BCE : taux de dépôt porté à ${f1(S.bce)} % pour contenir l'inflation (${f1(e.inflation)} %).`);
  EVENTS.forEach(([p,t,fn,c])=>{if(Math.random()<p){fn(S);log(t,c);}});
  // commentaires
  log(`INSEE : PIB ${g>=0?'+':''}${f1(g)} % ce trimestre ; chômage ${f1(e.chomage)} % ; inflation ${f1(e.inflation)} %. OAT 10 ans ${f1(e.oat10)} %.`, g<0?'neg':'');
  S.tri++; if(S.tri>4){S.tri=1;S.annee++;} S.tour++; snap();
  if(S.annee===2027&&S.tri===3&&!S.elu) election(); sauver(true); render();}
function election(){ const c=D.candidats2027.map(x=>({...x})); const pj=c.find(x=>x.joueur);
  pj.base=clamp(6+(S.e.popularite-20)*0.6+(S.e.croissance>1?3:0)-(S.e.chomage-8)*1.2,2,35);
  c.forEach(x=>x.s=Math.max(0.5,x.base+rnd(-2.5,2.5))); const t=c.reduce((a,b)=>a+b.s,0); c.forEach(x=>x.s=x.s/t*100); c.sort((a,b)=>b.s-a.s);
  const [a,b]=c; let r2a=a.p==='RN'?clamp(48+ (S.e.tensionSociale-50)*0.1-(b.joueur?(S.e.popularite-30)*0.15:0)+rnd(-3,3),35,62):55; 
  const gagnant=r2a>50?a:b; S.elu={t1:c,finale:[a,b],r2:[r2a,100-r2a],gagnant:gagnant.n}; S.fini=!gagnant.joueur;
  log(`PRÉSIDENTIELLE : ${gagnant.n} est élu(e) avec ${f1(Math.max(r2a,100-r2a))} % au second tour face à ${(gagnant===a?b:a).n}.`, gagnant.joueur?'pos':'neg'); view='elec';}

/* ---------- Rendu ---------- */
function kpi(k,v,cls=""){return `<div class=card><div class=k>${k}</div><div class="v ${cls}">${v}</div></div>`;}
function render(){ document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===view));
  $('#date').textContent=`${D.nom} — T${S.tri} ${S.annee}`; $('#tour').disabled=S.fini; const e=S.e, m=$('#main');
  if(view==='dash'){ m.innerHTML=`<div class=grid>${kpi('Croissance annualisée',f1(e.croissance)+' %',e.croissance<0.5?'bad':'good')}${kpi('PIB trimestriel',(e.croissanceT>=0?'+':'')+f1(e.croissanceT)+' %')}
   ${kpi('Inflation (IPCH)',f1(e.inflation)+' %',e.inflation>3?'bad':'')}${kpi('Chômage (BIT)',f1(e.chomage)+' %',e.chomage>8?'bad':'')}
   ${kpi('Dette publique',f1(e.dettePct)+' % PIB',e.dettePct>115?'bad':'')}${kpi('Dette (montant)',f0(e.detteMd)+' Md€')}
   ${kpi('Déficit public',f1(e.deficitPct)+' % PIB',e.deficitPct>3?'bad':'good')}${kpi('OAT 10 ans',f1(e.oat10)+' %',e.oat10>4?'bad':'')}
   ${kpi('Spread vs Bund',f0((e.oat10-D.eco.bund10)*100)+' pb')}${kpi('Note souveraine',e.notation)}${kpi('Taux BCE (dépôt)',f1(S.bce)+' %')}
   ${kpi('Popularité',f0(e.popularite)+' %',e.popularite<30?'bad':'')}${kpi('Tension sociale',f0(e.tensionSociale)+'/100',e.tensionSociale>60?'bad':'')}
   ${kpi('Confiance marchés',f0(e.confianceMarches)+'/100')}${kpi('Âge légal retraite',fage(S.ret.ageLegal))}${kpi('SMIC brut',f0(S.smic)+' €')}</div>
   <h2>Évolution</h2><div class=grid style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${['pib:Croissance (%)','chomage:Chômage (%)','inflation:Inflation (%)','dette:Dette (% PIB)','deficit:Déficit (% PIB)','oat:OAT 10 ans (%)','pop:Popularité (%)'].map(x=>{const[k,l]=x.split(':');return `<div class=card><div class=k>${l}</div><canvas data-h="${k}"></canvas></div>`}).join('')}</div>
   <h2>Budget annuel (Md€)</h2><div class=grid style="grid-template-columns:1fr 1fr"><div class=card><b>Recettes ${f0(totRec())}</b><table>${Object.entries(S.rec).map(([k,v])=>`<tr><td>${k}</td><td>${f0(v)}</td></tr>`).join('')}</table></div>
   <div class=card><b>Dépenses ${f0(totDep())}</b><table>${Object.entries(S.dep).map(([k,v])=>`<tr><td>${k}</td><td>${f0(v)}</td></tr>`).join('')}</table></div></div>
   <h2>Dernières nouvelles</h2>${S.news.slice(0,5).map(nw).join('')}`; drawCharts(); }
  if(view==='dec') renderDec();
  if(view==='parl'){ const P=D.politique.assemblee; m.innerHTML=`<h2>Assemblée nationale — 577 sièges, majorité absolue ${D.politique.majoriteAbsolue}</h2><div class=card>${P.map(p=>`<div class=row><label>${p.p}</label><span class=bar style="width:${p.s/1.6}%;background:${p.c}"></span>${p.s}</div>`).join('')}</div>
   <div class=card><p>Soutien gouvernemental estimé : <b>${S.soutien}</b> députés. Aucun bloc n'a la majorité absolue : chaque texte exige des compromis (PS pour la justice fiscale, LR pour la maîtrise des dépenses).</p>
   <p><b>Outils :</b> vote ordinaire (majorité relative des exprimés, ~275 voix), <b>49.3</b> (adoption sans vote sauf motion de censure à 289 voix ; RN+gauche peuvent la voter ensemble). 49.3 utilisés : ${S.n493}.</p>
   <p><b>Contraintes :</b> le Conseil constitutionnel censure les mesures confiscatoires ou disproportionnées ; l'UE (procédure de déficit excessif) exige une trajectoire vers 3 % ; la BCE fixe les taux, pas vous. La dissolution est possible depuis juillet 2025 (non modélisée en v1).</p></div>`;}
  if(view==='news') m.innerHTML=`<h2>Fil d'actualités</h2>${S.news.map(nw).join('')}`;
  if(view==='elec') renderElec();
  if(view==='src') m.innerHTML=`<h2>Sources et dates des données initiales</h2><div class=card><table>${D.sources.map(s=>`<tr><td><b>${s[0]}</b></td><td>${s[1]}</td></tr>`).join('')}</table></div>
   <p class=note>Modèle pédagogique simplifié : multiplicateur budgétaire ~0,8 étalé sur 4 trimestres, loi d'Okun (-0,35), spread OAT fonction de la dette, du déficit, de la confiance et des tensions sociales, règle de Taylor simplifiée pour la BCE. Les chiffres de départ sont arrondis ; ce n'est pas une prévision.</p>`;}
const fage=a=>`${Math.floor(a)} ans ${Math.round((a%1)*12)} mois`;
const nw=n=>`<div class="news ${n.c}"><span class=k>${n.d}</span> — ${n.t}</div>`;
function renderDec(){ if(!S.draft) draftInit(); const d=S.draft, a=analyse(d), m=$('#main');
  const sl=(lab,path,min,max,step,val,fmt)=>`<div class=row><label>${lab}</label><input type=range min=${min} max=${max} step=${step} value=${val} data-p="${path}"><b>${fmt(val)}</b></div>`;
  m.innerHTML=`<h2>Projet de loi de finances rectificative</h2><p class=note>Réglez vos mesures, observez l'estimation, puis faites voter ou utilisez le 49.3. Les effets s'étalent sur 2 à 4 trimestres.</p>
  <div class=card><b>Fiscalité</b>${sl('Barème IR (indice, 100 = actuel)','taux.IR',70,170,5,d.taux.IR,v=>v)}${sl('TVA taux normal','taux.TVA',15,28,0.5,d.taux.TVA,v=>v+' %')}
  ${sl('Impôt sur les sociétés','taux.IS',15,40,0.5,d.taux.IS,v=>v+' %')}${sl('CSG (taux activité)','taux.CSG',7,13,0.1,d.taux.CSG,v=>v+' %')}</div>
  <div class=card><b>Dépenses par mission (variation %)</b>${Object.keys(d.dep).map(k=>sl(k,'dep.'+k,-15,15,1,d.dep[k],v=>(v>0?'+':'')+v+' %')).join('')}</div>
  <div class=card><b>Social</b>${sl('Âge légal de départ','age',59,68,0.25,d.age,fage)}${sl('Coup de pouce SMIC','smic',0,15,0.5,d.smic,v=>'+'+v+' %')}</div>
  <div class=card><b>Europe & énergie</b><div class=row><button id=flex ${S.flexUE?'disabled':''}>Demander une flexibilité à Bruxelles (dépenses défense)</button><button id=boucl>${S.bouclier?'Lever':'Activer'} le bouclier tarifaire énergie (-0,4 pt d'inflation, 8 Md€/an)</button></div></div>
  <div class=card><b>Estimation</b><p>Impact solde public : <b class=${a.solde>=0?'good':'bad'}>${a.solde>=0?'+':''}${f1(a.solde)} Md€/an</b> (${f1(a.solde/S.e.pibMd*100)} pt de PIB) — effet croissance estimé ${f1(-a.solde/S.e.pibMd*80)} pt.</p>
  <p>Voix estimées : <b>${a.voix}</b> / 275 nécessaires (vote) — risque de censure si 49.3 : <b>${(577-a.voix)-50>D.politique.majoriteAbsolue-20?'ÉLEVÉ':'modéré'}</b>.</p>
  ${a.cc.map(x=>`<p class=bad>⚖️ ${x}</p>`).join('')}${a.alertes.map(x=>`<p class=warn>⚠️ ${x}</p>`).join('')}${a.greve>20?'<p class=warn>✊ Fort risque de grèves et de manifestations.</p>':''}
  <div class=row><button class=primary id=vote>🗳 Soumettre au vote</button><button id=v493>⚡ Engager le 49.3</button><button id=raz>Annuler</button></div></div>`;
  m.querySelectorAll('input[type=range]').forEach(i=>i.oninput=()=>{const[p,q]=i.dataset.p.split('.'); if(q) d[p][q]=+i.value; else d[p]=+i.value; renderDec();});
  $('#vote').onclick=()=>{d.mode='vote';voter();}; $('#v493').onclick=()=>{d.mode='493';voter();}; $('#raz').onclick=()=>{draftInit();renderDec();};
  $('#flex').onclick=()=>{S.flexUE=1; if(Math.random()<0.6){log("La Commission accorde la clause dérogatoire nationale pour la défense (jusqu'à 1,5 pt de PIB) : les marchés restent calmes.","pos");S.e.confianceMarches+=3;}else log("Bruxelles refuse : la trajectoire française n'est pas jugée crédible.","neg"); renderDec();};
  $('#boucl').onclick=()=>{S.bouclier=!S.bouclier; S.dep.energie+=S.bouclier?8:-8; S.e.popularite+=S.bouclier?2:-2; log(S.bouclier?"Bouclier tarifaire réactivé : soulagement des ménages, coût de 8 Md€/an.":"Fin du bouclier tarifaire : les factures augmentent."); renderDec();};}
function renderElec(){const m=$('#main'); if(!S.elu){m.innerHTML=`<h2>Présidentielle 2027 (avril, simulée au T2 2027)</h2><p>${D.noteCandidats}</p><div class=card><b>Intentions de vote indicatives</b>${D.candidats2027.map(c=>{const v=c.joueur?clamp(6+(S.e.popularite-20)*0.6,2,35):c.base;return `<div class=row><label>${c.n} (${c.p})${c.joueur?' — votre camp':''}</label><span class=bar style="width:${v*2}%;background:${c.c}"></span>${f0(v)} %</div>`}).join('')}</div><p class=note>Votre candidat dépend de votre popularité, du chômage et de la croissance.</p>`;return;}
  const E=S.elu; m.innerHTML=`<h2>Résultats de la présidentielle 2027</h2><div class=card><b>1er tour</b>${E.t1.map(c=>`<div class=row><label>${c.n}</label><span class=bar style="width:${c.s*2}%;background:${c.c}"></span>${f1(c.s)} %</div>`).join('')}</div>
  <div class=card><b>2nd tour</b> : ${E.finale[0].n} ${f1(E.r2[0])} % — ${E.finale[1].n} ${f1(E.r2[1])} %<h2>${E.gagnant} est élu(e).</h2>${S.fini?'<p class=bad>Votre camp perd le pouvoir. Fin de partie — recommencez pour tenter une autre stratégie.</p>':'<p class=good>Votre camp conserve l\'Élysée : le quinquennat continue.</p>'}</div>`;}
function drawCharts(){document.querySelectorAll('canvas[data-h]').forEach(c=>{const d=S.hist[c.dataset.h],x=c.getContext('2d');c.width=c.clientWidth*2;c.height=320;const W=c.width,H=c.height;
  const mn=Math.min(...d)-0.5,mx=Math.max(...d)+0.5;x.strokeStyle='#33476b';x.beginPath();if(mn<0&&mx>0){const y0=H-(-mn)/(mx-mn)*H;x.moveTo(0,y0);x.lineTo(W,y0);}x.stroke();
  x.strokeStyle='#4fa3d1';x.lineWidth=4;x.beginPath();d.forEach((v,i)=>{const px=d.length<2?W/2:i/(d.length-1)*W,py=H-(v-mn)/(mx-mn)*H;i?x.lineTo(px,py):x.moveTo(px,py);});x.stroke();
  x.fillStyle='#e8eef7';x.font='24px sans-serif';x.fillText(f1(d[d.length-1]),W-80,30);});}
function modal(t,h){const d=document.createElement('div');d.className='modal';d.innerHTML=`<div><h2>${t}</h2>${h}<button>OK</button></div>`;d.querySelector('button').onclick=()=>d.remove();document.body.appendChild(d);}
function sauver(silent){localStorage.setItem(KEY,JSON.stringify(S)); if(!silent) modal("Sauvegarde","<p>Partie sauvegardée dans ce navigateur.</p>");}
try{S=JSON.parse(localStorage.getItem(KEY))}catch(_){} if(!S||!S.e) nouvelle();
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{view=b.dataset.v;render();});
$('#tour').onclick=tour; $('#save').onclick=()=>sauver(false); $('#reset').onclick=()=>{if(confirm('Recommencer ?')){localStorage.removeItem(KEY);nouvelle();view='dash';render();}};
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
render();
