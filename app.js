/* PharmCore: no runtime API calls; study content is packaged with the app. */
'use strict';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Date().toISOString().slice(0,10);
const now=()=>Date.now();
const days=(ms)=>Math.ceil((ms-now())/86400000);
const shortDate=ms=>ms?new Date(ms).toLocaleDateString(undefined,{month:'short',day:'numeric'}):'Never';
const cname=k=>CATEGORIES.find(x=>x[0]===k)?.[1]||k;
const sname=k=>SPECIALTIES.find(x=>x[0]===k)?.[1]||k;
const findDrug=id=>DRUGS.find(d=>d.id===id||d.name===id);
const slug=val=>String(val).toLowerCase().replace(/[^a-z0-9]+/g,'-');
const hash=str=>{let n=2166136261;for(let i=0;i<str.length;i++){n^=str.charCodeAt(i);n=Math.imul(n,16777619);}return n>>>0};
const shuffleSeeded=(arr,seed)=>{const out=arr.slice();let st=hash(seed)||1;for(let i=out.length-1;i>0;i--){st=(Math.imul(st,1664525)+1013904223)>>>0;const j=st%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out};
const iconPaths={
 dashboard:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
 quiz:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
 pill:'<path d="M10.5 20.4a7 7 0 0 1-9.9-9.9l9.9-9.9a7 7 0 0 1 9.9 9.9z" transform="translate(1.4 1.4) scale(.88)"/><path d="m8 16 8-8"/>',
 layers:'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
 chart:'<path d="M3 3v18h18M7 16v-4M12 16V8M17 16V5"/>',
 settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="white"/><circle cx="16" cy="17" r="2" fill="white"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 chevron:'<path d="m9 18 6-6-6-6"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
 check:'<path d="m4 12 5 5L20 6"/>',
 close:'<path d="M5 5l14 14M19 5 5 19"/>',
 alert:'<path d="M12 2 2 21h20L12 2Z"/><path d="M12 9v4m0 4h.01"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
 activity:'<path d="M2 12h4l3-7 5 14 3-7h5"/>',
 shield:'<path d="M12 2 4 6v6c0 5 3 8 8 10 5-2 8-5 8-10V6l-8-4Z"/><path d="m9 12 2 2 4-4"/>',
 download:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',
 upload:'<path d="M12 21V8m-5 5 5-5 5 5M4 7V3h16v4"/>',
 database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 2 4 3 9 3s9-1 9-3V5M3 12c0 2 4 3 9 3s9-1 9-3"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 atom:'<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(40 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-40 12 12)"/>',
 calculator:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h2m4 0h2M8 15h2m4 0h2M8 19h2m4 0h2"/>',
 users:'<circle cx="9" cy="8" r="3"/><path d="M2 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 4 5"/>',
 stethoscope:'<path d="M5 3v6a5 5 0 0 0 10 0V3M3 3h4m6 0h4M10 14v2a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="12" r="2"/>',
 star:'<path d="m12 2 3.1 6.5 7.1 1-5.1 5 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5.1-5 7.1-1z"/>',
 bolt:'<path d="M13 2 4 13h7l-1 9 10-12h-7z"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/>',
 copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10h4"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/>',
 external:'<path d="M13 4h7v7M20 4l-9 9M20 14v6H4V4h6"/>',
 rotate:'<path d="M3 12a9 9 0 1 0 3-7M3 3v6h6"/>',
 book:'<path d="M4 4h6a3 3 0 0 1 3 3v14H7a3 3 0 0 0-3 2V4Zm16 0h-4a3 3 0 0 0-3 3v14h6a2 2 0 0 1 2 2V4Z"/>',
 filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>'
};
const ic=(name,cl='')=>`<svg class="ic ${cl}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]||iconPaths.info}</svg>`;
const defaultState=()=>({schema:1,prefs:{rotation:'family',hasSeenWelcome:false},attempts:[],reviews:{},encounters:{},bookmarks:[],notes:{},session:null});
let state=defaultState(), view='dashboard', selectedDrug=null, sidebarOpen=false, noticeTimer=null;
let config={specialties:['family'],categories:['classification','mechanism','indications','contraindications','adverse','monitoring'],tiers:[1,2],mode:'mixed',length:20,priority:'adaptive',exam:false};
let libraryFilter={search:'',specialty:'all',tier:'all',saved:false};
let reviewFilter='all';
let importCandidate=null;
const storage={type:'Initializing',db:null,writeQueue:Promise.resolve(),async init(){
 if(!('indexedDB'in window)){this.type='LocalStorage fallback';return;}
 try{this.db=await new Promise((resolve,reject)=>{const req=indexedDB.open('PharmCoreLocal',1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('saved'))db.createObjectStore('saved');};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});this.type='IndexedDB';}
 catch(e){console.warn('IndexedDB unavailable, trying localStorage',e);this.type='LocalStorage fallback';}
 },async load(){
 try{if(this.db){const loaded=await new Promise((res,rej)=>{const tx=this.db.transaction('saved','readonly'),req=tx.objectStore('saved').get('user-state');req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error);});if(loaded)return loaded;}
 else {const x=localStorage.getItem('pharmcore-local-v1');if(x)return JSON.parse(x);}}
 catch(e){console.warn('Local load error',e)}return null;
 },save(data){const snapshot=JSON.stringify(data);this.writeQueue=this.writeQueue.catch(()=>{}).then(async()=>{
 if(this.db){await new Promise((resolve,reject)=>{const tx=this.db.transaction('saved','readwrite');tx.objectStore('saved').put(JSON.parse(snapshot),'user-state');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
 else{localStorage.setItem('pharmcore-local-v1',snapshot);}
 }).catch(e=>{console.error('Could not save progress',e);toast('Saving failed. Please export your progress.');});return this.writeQueue;}
};
function persist(){storage.save(state);}
function toast(message){const old=$('.notice');if(old)old.remove();const el=document.createElement('div');el.className='notice';el.textContent=message;document.body.appendChild(el);clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.remove(),4200);}
function attemptCount(){return state.attempts.length}
function accuracy(arr=state.attempts){return arr.length?Math.round(arr.filter(a=>a.correct).length/arr.length*100):0}
function uniqueDrugsSeen(){return new Set(state.attempts.map(a=>a.drugId)).size}
function dueReviews(){return Object.values(state.reviews).filter(x=>x.due<=now()).length}
function dueForQuestion(q){const rv=state.reviews[`${q.drugId}|${q.category}`];return rv?.due<=now()}
function reviewItem(did,cat){return state.reviews[`${did}|${cat}`]}
function saveAttempt(q,chosen,correct){const id=`${now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;state.attempts.push({id,qid:q.id,drugId:q.drugId,category:q.category,correct,chosen,ts:now(),confidence:null});persist();return id;}
function applyReview(q,confidence,correct){const key=`${q.drugId}|${q.category}`;const prev=state.reviews[key]||{seen:0,correct:0,streak:0,interval:0,ease:2.5};
 const v={...prev,seen:prev.seen+1,correct:prev.correct+(correct?1:0),streak:correct?prev.streak+1:0,last:now()};
 if(!correct||confidence==='again'){v.interval=0.06;v.ease=Math.max(1.3,prev.ease-.2);}
 else if(confidence==='hard'){v.interval=prev.interval>0.5?Math.max(1,prev.interval*1.2):0.5;v.ease=Math.max(1.3,prev.ease-.12);}
 else if(confidence==='easy'){v.interval=prev.interval>=1?Math.max(4,prev.interval*prev.ease*1.35):4;v.ease=Math.min(3.2,prev.ease+.15);}
 else{v.interval=prev.interval>=1?Math.max(2,prev.interval*prev.ease):1;v.ease=prev.ease;}
 v.due=now()+v.interval*86400000;state.reviews[key]=v;
 if(state.session&&state.session.answers[state.session.idx]){const att=state.attempts.find(a=>a.id===state.session.answers[state.session.idx].attemptId);if(att)att.confidence=confidence;}
 persist();
}
function getDrugMastery(d){const r=Object.entries(state.reviews).filter(([key])=>key.startsWith(d.id+'|')).map(([,v])=>v);if(!r.length)return null;return Math.round(r.reduce((sum,v)=>sum+v.correct/v.seen*100,0)/r.length)}
function coveredCount(){return Object.keys(state.reviews).length}
function availableCountByCategory(cat){return QUESTIONS.filter(q=>q.category===cat).length}
function dailyStreak(){const seen=new Set(state.attempts.map(a=>new Date(a.ts).toLocaleDateString('en-CA')));let n=0;let dt=new Date();if(!seen.has(dt.toLocaleDateString('en-CA')))dt.setDate(dt.getDate()-1);while(seen.has(dt.toLocaleDateString('en-CA'))){n++;dt.setDate(dt.getDate()-1);}return n;}

function choicesFromAnswer(id,correctText,incorrectValues){
 let raw=[{text:correctText,correct:true,why:''},...incorrectValues.map(x=>({text:x.text,correct:false,why:x.why}))];
 const seen=new Set();raw=raw.filter(x=>{if(seen.has(x.text))return false;seen.add(x.text);return true;});
 return shuffleSeeded(raw,id);
}
const FIELD_KEY={contraindications:'caution',pharmacokinetics:'kinetics'};
const FIELD_LABELS={mechanism:'best describes its primary class-level mechanism of action',contraindications:'describes a key precaution or reason to avoid it',adverse:'is a characteristic adverse-effect profile',interactions:'is a characteristic drug interaction',monitoring:'is an important monitoring consideration',pharmacokinetics:'is an important pharmacokinetic teaching point',populations:'is a key consideration in special populations',toxicity:'describes a relevant toxicity or reversal principle'};
// Explanation for each authored vignette's distractors (ordered by the source-case options).
const CASE_DISTRACTOR_REASONS={
 'case-01':['','Amlodipine treats blood pressure and does not share metformin’s eGFR <30 contraindication.','Cetirizine is an H1 antihistamine; renal dosing may change, but it is not the diabetes drug in question.','Atorvastatin is a lipid-lowering statin, not the specified diabetes therapy.'],
 'case-02':['','Losartan blocks AT1 receptors without raising bradykinin and causes much less cough.','Amlodipine is a vascular calcium-channel blocker more commonly associated with ankle edema.','Hydrochlorothiazide causes electrolyte disturbances, not bradykinin-mediated cough.'],
 'case-03':['','Serum amylase is not a routine marker for mineralocorticoid antagonist safety.','Serial daily troponins are not the principal monitoring test for spironolactone.','Lipase is evaluated for suspected pancreatic disease, not the characteristic hyperkalemia risk.'],
 'case-04':['','Sertraline is an SSRI and does not carry bupropion’s specific seizure-disorder contraindication.','Escitalopram is an SSRI; seizure threshold is not the distinctive contraindication being tested.','Fluoxetine is an SSRI; bupropion is the drug specifically contraindicated here.'],
 'case-05':['','Cetirizine is an antihistamine and is not the classic narrow-therapeutic-index thiazide interaction.','Ondansetron is an antiemetic, not the drug whose renal clearance is lowered by thiazides.','Levothyroxine has absorption interactions, but this is not the described thiazide toxicity risk.'],
 'case-06':['','Ceftriaxone can achieve systemic and renal tissue exposure and is used in selected serious infections.','Ciprofloxacin may be used for susceptible pyelonephritis when appropriate; culture and safety considerations matter.','Levofloxacin has systemic exposure and can treat selected susceptible pyelonephritis cases.'],
 'case-07':['','Naloxone reverses opioids, not the uncontrolled skeletal-muscle calcium release of malignant hyperthermia.','Flumazenil reverses selected benzodiazepine effects and is not treatment for malignant hyperthermia.','N-acetylcysteine treats acetaminophen toxicity, not malignant hyperthermia.'],
 'case-08':['','Neuromuscular paralysis without hypnosis describes muscle relaxants, not propofol’s primary action.','Propofol provides hypnosis but lacks meaningful direct analgesia.','Hyperkalemia is a classic succinylcholine risk, not propofol’s expected primary effect.'],
 'case-09':['','Paralysis can abolish movement while leaving the patient aware; ventilation must still be monitored.','Rocuronium prevents neuromuscular transmission but does not cause unconsciousness.','Residual blockade can persist and quantitative monitoring is valuable.'],
 'case-10':['','IV vancomycin is reserved for different serious gram-positive infections, not routine GAS pharyngitis.','Metronidazole targets anaerobes/protozoa and is not preferred for GAS pharyngitis.','Nitrofurantoin concentrates in urine and does not treat pharyngitis.'],
 'case-11':['','Famotidine is an H2 blocker, not the 5-HT3 antiemetic whose QT warning is being tested.','Acetaminophen treats pain/fever, not the relevant 5-HT3 antiemetic risk.','Amoxicillin is an antibiotic, not a postoperative nausea medication.'],
 'case-12':['','Sugammadex reverses rocuronium/vecuronium neuromuscular blockade, not opioid respiratory depression.','Dantrolene treats malignant hyperthermia, not opioid-mediated hypoventilation.','Ondansetron treats nausea and does not reverse opioid receptors.'],
 'case-13':['','Increased bowel sounds alone do not indicate the respiratory and neuromuscular depression of magnesium toxicity.','Painless urination is not a hallmark of magnesium toxicity; urine output matters because magnesium is renally cleared.','Sneezing is not a characteristic sign of magnesium toxicity.'],
 'case-14':['','Levothyroxine replaces thyroid hormone and is not an alpha-1 blocker for BPH.','Amoxicillin treats susceptible bacterial infection and is not a BPH medication.','Inhaled budesonide controls airway inflammation, not urinary outflow obstruction.'],
 'case-15':['','Rapid lamotrigine re-initiation with a widespread rash is a warning sign and should not be assumed benign.','Inhaled steroid withdrawal does not explain the specific lamotrigine titration-related rash concern.','Cholinergic crisis causes muscarinic/nicotinic symptoms, not the characteristic severe lamotrigine rash.'],
 'case-16':['','Peak expiratory flow measures airway obstruction, not warfarin anticoagulant intensity.','Intraocular pressure is unrelated to this classic warfarin drug interaction.','Amylase is not used to assess warfarin activity.'],
 'case-17':['','Oral cetirizine can reduce hives but cannot replace IM epinephrine for airway/circulatory compromise.','Prednisone has delayed effects and does not immediately reverse anaphylactic shock or bronchospasm.','Famotidine is at most an adjunct and is not adequate first-line anaphylaxis treatment.'],
 'case-18':['','Continuously increasing albuterol without reassessing control leaves airway inflammation undertreated.','Stopping controller therapy often worsens asthma control in patients needing anti-inflammatory treatment.','Antibiotics do not replace evidence-based asthma controller therapy without a specific bacterial indication.']
};

const QUESTIONS=[];
const byCategory={};
const qIndex={};
function appendQuestion(q){QUESTIONS.push(q);qIndex[q.id]=q;(byCategory[q.category]||(byCategory[q.category]=[])).push(q);}
function generateQuestions(){
 const classes=Object.values(C);
 for(const d of DRUGS){
  const profile=C[d.cls];
  for(const cat of ['classification','mechanism','indications','contraindications','adverse','interactions','monitoring','pharmacokinetics','populations','toxicity']){
   const id=`fact-${d.id}-${cat}`;let stem,correct,alts=[];
   if(cat==='classification'){
    stem=`Which pharmacologic class best describes ${d.name}?`;correct=profile.name;
    alts=shuffleSeeded(classes.filter(c=>c.id!==d.cls),id).slice(0,3).map(c=>({text:c.name,why:`${c.name} is a different class; ${d.name} belongs to the ${profile.name} class.`}));
   }else if(cat==='indications'){
    stem=`Which is an indication included in PharmCore's teaching profile for ${d.name}?`;
    correct=d.indications[0];
    alts=shuffleSeeded(DRUGS.filter(x=>x.cls!==d.cls&&!x.indications.includes(correct)&&!x.indications.some(y=>d.indications.includes(y))),id).filter((x,i,a)=>a.findIndex(y=>y.indications[0]===x.indications[0])===i).slice(0,3).map(x=>({text:x.indications[0],why:`This is listed for ${x.name}; it is not the indication highlighted in ${d.name}'s study profile.`}));
   }else{
    stem=`For the ${profile.name} class (which includes ${d.name}), which statement ${FIELD_LABELS[cat]}?`;
    correct=profile[FIELD_KEY[cat]||cat];
    alts=shuffleSeeded(classes.filter(c=>c.id!==d.cls&&c[FIELD_KEY[cat]||cat]&&c[FIELD_KEY[cat]||cat]!==correct),id).slice(0,3).map(c=>({text:c[FIELD_KEY[cat]||cat],why:`This is a teaching point for ${c.name}. The key ${profile.name} concept is: ${correct}`}));
   }
   if(alts.length<3)continue;
   const opts=choicesFromAnswer(id,correct,alts);
   opts.forEach(o=>{if(o.correct)o.why=cat==='indications'?`${correct} is included as a key teaching indication for ${d.name}.`:`Correct. ${cat==='classification'?`${d.name} is a ${profile.name}.`:correct}`;});
   appendQuestion({id,drugId:d.id,category:cat,type:'rapid',specialties:d.specialties,tiers:[d.tier],stem,options:opts,teaching:cat==='indications'?`Other indications in this study record: ${d.indications.join('; ')}.`:cat==='classification'?`Key mechanism: ${profile.mechanism}`:`Class-level fact for ${profile.name}; check product-specific differences.`,source:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(d.name)}`,sourceLabel:`Look up current ${d.name} product labeling on DailyMed`});
  }
 }
 for(const c of classes){
  const meds=DRUGS.filter(d=>d.cls===c.id);if(!meds.length)continue;const d=meds[0],id=`reverse-class-${c.id}`;
  const others=shuffleSeeded(DRUGS.filter(x=>x.cls!==c.id),id).filter((x,i,a)=>a.findIndex(y=>y.cls===x.cls)===i).slice(0,3);
  const opts=choicesFromAnswer(id,d.name,others.map(x=>({text:x.name,why:`${x.name} is classified as ${C[x.cls].name}, not ${c.name}.`})));
  opts.find(o=>o.correct).why=`${d.name} is an example of a ${c.name}.`;
  appendQuestion({id,drugId:d.id,category:'classification',type:'rapid',specialties:d.specialties,tiers:[d.tier],stem:`Which medication is an example of a ${c.name}?`,options:opts,teaching:`Class mechanism: ${c.mechanism}`,source:'https://dailymed.nlm.nih.gov/dailymed/',sourceLabel:'DailyMed — medication prescribing information'});
 }
 for(const d of DOSING_CASES){const medx=findDrug(d.drug);const id=d.id;
  const choices=shuffleSeeded(d.options.map((text,index)=>({text,correct:index===d.correct,why:d.explain[index]})),id);
  appendQuestion({id,drugId:medx.id,category:'dosing',type:'dosing',specialties:d.specialties,tiers:[medx.tier],stem:d.stem,options:choices,teaching:'Indication, age/weight, route, maximums and organ function determine dosing; never generalize this regimen to other scenarios.',source:d.source,sourceLabel:d.sourceLabel});
 }
 for(const d of CLINICAL_CASES){const medx=findDrug(d.drug);const opts=shuffleSeeded(d.options.map((text,index)=>({text,correct:index===d.correct,why:index===d.correct?d.teaching:(CASE_DISTRACTOR_REASONS[d.id]?.[index]||`This does not address the mechanism in the vignette. ${d.teaching}`)})),d.id);
  appendQuestion({id:d.id,drugId:medx.id,category:'clinical',type:'clinical',specialties:d.specialties,tiers:[medx.tier],stem:d.stem,options:opts,teaching:d.teaching,source:d.source,sourceLabel:d.sourceLabel});
 }
}
generateQuestions();

function selectQuestions(opts){
 const cats=opts.mode==='dosing'?['dosing']:opts.mode==='clinical'?['clinical']:opts.mode==='rapid'?opts.categories.filter(c=>c!=='dosing'&&c!=='clinical'):opts.categories;
 let q=QUESTIONS.filter(q=>cats.includes(q.category)&&q.specialties.some(s=>opts.specialties.includes(s))&&opts.tiers.some(t=>q.tiers.includes(t)));
 if(opts.priority==='new'){const seen=new Set(state.attempts.map(a=>a.qid));q=q.filter(x=>!seen.has(x.id));}
 const date=now();
 q=q.map(item=>{
  const prior=reviewItem(item.drugId,item.category),oldAttempts=state.attempts.filter(a=>a.qid===item.id);
  let weight=1;
  if(!prior){weight=opts.priority==='new'?100:opts.priority==='adaptive'?6:1;}
  else if(prior.due<=date){weight=opts.priority==='adaptive'?11:2;}
  else if(opts.priority==='new'){weight=.03;}
  else if(opts.priority==='adaptive'){weight=.4;}
  if(prior?.seen&&prior.correct/prior.seen<.6)weight*=2;
  if(opts.priority==='highyield'){weight=item.tiers.includes(1)?10:1;}
  if(opts.priority==='random')weight=1;
  const recent=oldAttempts.at(-1)?.ts||0;
  return {item,score:Math.random()*Math.max(0.03,weight)+(Date.now()-recent<43200000&&opts.priority!=='adaptive'?-0.3:0)};
 }).sort((a,b)=>b.score-a.score).map(x=>x.item);
 // Spread questions across medications instead of repeating one medication immediately.
 let spaced=[],last=[];
 while(q.length){let i=q.findIndex(x=>!last.includes(x.drugId));if(i===-1){last=[];i=0;}const item=q.splice(i,1)[0];spaced.push(item);last.push(item.drugId);if(last.length>4)last.shift();}
 return spaced.slice(0,opts.length===0?undefined:opts.length);
}

function navButton(id,label,iconName,badge=''){return `<button class="nav-item ${view===id?'active':''}" data-action="nav" data-view="${id}" aria-current="${view===id?'page':'false'}">${ic(iconName)}<span>${label}</span>${badge?`<span class="smallpill">${badge}</span>`:''}</button>`}
function shell(content){const rotation=state.prefs.rotation;
 return `<div class="shell">
  <aside class="sidebar ${sidebarOpen?'open':''}" aria-label="Main navigation">
    <div class="brand"><div class="brand-icon">P<span>+</span></div><div><div class="brand-name">PharmCore</div><div class="brand-desc">CLINICAL STUDY SYSTEM</div></div></div>
    <div class="section-caption">Workspace</div><nav class="navlinks">
      ${navButton('dashboard','Overview','dashboard')}
      ${navButton('practice','Quiz builder','quiz')}
      ${navButton('library','Drug library','pill')}
      ${navButton('review','Due for review','clock',dueReviews()?dueReviews():'')}
      ${navButton('analytics','My progress','chart')}
      ${navButton('settings','Data & settings','settings')}
    </nav>
    <div class="side-block"><div class="section-caption" style="margin-left:0">Current rotation</div><select class="side-select" id="rotation-select" aria-label="Select your rotation">${SPECIALTIES.map(([k,n])=>`<option value="${k}" ${k===rotation?'selected':''}>${esc(n)}</option>`).join('')}</select><div class="side-help">Your rotation changes the dashboard and default quiz focus. Other specialties stay available.</div></div>
    <div class="side-footer"><div class="side-footer-title">${ic('database','sm')} ${esc(storage.type)} · Local only</div><p>Study history stays on this device until you export it. No account required.</p><button data-action="export">${ic('download','sm')} Export backup</button></div>
  </aside>
  <div class="main-frame">
   <header class="topbar"><div class="row"><button class="mobile-toggle" data-action="mobile" aria-label="Toggle navigation">${ic('menu')}</button><div class="crumb">${ic('layers','sm')} PharmCore ${ic('chevron','sm')} <span>${({dashboard:'Overview',practice:'Quiz builder',library:'Drug library',review:'Reviews',analytics:'Progress',settings:'Settings',session:'Study session',results:'Quiz results'})[view]||'Overview'}</span></div></div>
    <div class="top-actions"><button class="search-top" data-action="nav" data-view="library">${ic('search','sm')} Search medications…</button><button class="top-due" data-action="nav" data-view="review">${ic('clock','sm')} ${dueReviews()} due</button></div>
   </header>
   <main class="main-content" id="content">${content}<div class="footer-note">PharmCore ${PHARMCORE_VERSION} · Educational seed content · Not for point-of-care prescribing · No patient identifiers</div></main>
  </div>
 </div>${selectedDrug?renderDrugModal():''}${importCandidate?renderImportModal():''}`;
}
function pageTitle(kicker,title,description='',actions=''){return `<div class="page-head"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1>${description?`<p class="lead">${description}</p>`:''}</div>${actions?`<div class="page-actions">${actions}</div>`:''}</div>`}
function metric(label,value,footer,iconName,accent=false){return `<div class="card metric ${accent?'metric-accent':''}"><div class="between"><div class="eyebrow">${label}</div><div class="iconbox ${accent?'':'blue'}" style="width:31px;height:31px">${ic(iconName,'sm')}</div></div><div class="value monospace">${value}</div><div class="foot">${footer}</div></div>`}
function questionPoolForRotation(rot){return QUESTIONS.filter(q=>q.specialties.includes(rot)).length}
function rotationAccuracy(rot){const ids=new Set(DRUGS.filter(d=>d.specialties.includes(rot)).map(d=>d.id));const at=state.attempts.filter(a=>ids.has(a.drugId));return at.length?`${accuracy(at)}%`:'Not started'}
function rotationCovered(rot){const ids=new Set(DRUGS.filter(d=>d.specialties.includes(rot)).map(d=>d.id));return Object.keys(state.reviews).filter(key=>ids.has(key.split('|')[0])).length}
function renderDashboard(){const r=state.prefs.rotation, drugs=DRUGS.filter(d=>d.specialties.includes(r));
 const usedByCategory=CATEGORIES.map(([key,label])=>{const attempts=state.attempts.filter(a=>a.category===key);return {key,label,n:attempts.length,pct:accuracy(attempts)}});
 const most=Object.entries(state.reviews).filter(([,v])=>v.due<=now()).sort((a,b)=>a[1].due-b[1].due).slice(0,5);
 const recentEncounter=Object.entries(state.encounters).sort((a,b)=>b[1].ts-a[1].ts).slice(0,4);
 return `${pageTitle('YOUR STUDY HOME','Welcome back to PharmCore','A focused pharmacology learning system that follows you from one clinical rotation to the next.',`<button class="btn ghost" data-action="export">${ic('download','sm')} Back up progress</button>`)}
 <div class="grid four">
  ${metric('Total questions',attemptCount(),'Across all rotations and quiz modes','quiz',true)}
  ${metric('Overall accuracy',attemptCount()?accuracy()+'%':'—',attemptCount()?'Based on completed answers':'Complete a quiz to start','activity')}
  ${metric('Review concepts due',dueReviews(),'Knowledge dimensions ready for spaced review','clock')}
  ${metric('Medications seen',uniqueDrugsSeen(),`Of ${DRUGS.length} in this starter library`,'pill')}
 </div>
 <div class="sectiongap hero"><div><div class="eyebrow">CURRENT ROTATION</div><h2>${esc(sname(r))}</h2><p>${drugs.length} relevant medications · ${questionPoolForRotation(r)} available questions in this rotation · ${rotationAccuracy(r)} rotation accuracy so far.</p><button class="btn alt" data-action="quick-study">${ic('bolt','sm')} Start high-yield practice ${ic('arrow','sm')}</button></div><div class="hero-art">${ic('stethoscope')}</div></div>
 <div class="grid two sectiongap">
  <section class="card"><div class="panel-title"><h2>What to study next</h2><span class="rotation-tag">${esc(sname(r))}</span></div>
    ${most.length?`<div class="data-list">${most.map(([key,v])=>{const [did,cat]=key.split('|'),d=findDrug(did);return d?`<div class="data-item"><div><div class="label">${esc(d.name)}</div><div class="caption">${esc(cname(cat))}</div></div><span class="badge bad">Due now</span></div>`:''}).join('')}</div><button class="btn small" data-action="start-reviews">${ic('rotate','sm')} Review due concepts</button>`:
      `<div class="empty" style="padding:30px 15px">${ic('check')}<h3>${attemptCount()?'No reviews are due':'Your learning journey starts here'}</h3><p class="small">${attemptCount()?'Continue with new questions or explore another specialty.':'Take a quick quiz to establish your baseline.'}</p><button class="btn small" data-action="nav" data-view="practice">Build a quiz</button></div>`}
  </section>
  <section class="card"><div class="panel-title"><h2>Knowledge category performance</h2><button class="text-button" data-action="nav" data-view="analytics">Full analytics ${ic('arrow','sm')}</button></div>
    ${usedByCategory.filter(x=>x.n>0).length?usedByCategory.filter(x=>x.n>0).slice(0,6).map(x=>`<div class="progressrow"><div class="name">${esc(x.label)}</div><div class="progressbar"><div style="width:${x.pct}%"></div></div><div class="percent monospace">${x.pct}%</div></div>`).join(''):`<div class="empty" style="padding:35px 12px">${ic('chart')}<h3>No performance data yet</h3><p class="small">Your category-level mastery will populate after your first quiz.</p></div>`}
  </section>
 </div>
 <div class="grid two sectiongap">
  <section class="card"><div class="panel-title"><h2>My clinical encounters</h2><button class="text-button" data-action="nav" data-view="library">Open library ${ic('arrow','sm')}</button></div>
   ${recentEncounter.length?`<div class="data-list">${recentEncounter.map(([id,v])=>{const d=findDrug(id);return d?`<div class="data-item"><div><div class="label">${esc(d.name)}</div><div class="caption">${esc(sname(v.specialty||r))}</div></div><span class="small subtle">${shortDate(v.ts)}</span></div>`:''}).join('')}</div>`:`<p class="subtle small">Find a drug in the library and select “Seen on rotation” to add it to your personal review list. Avoid patient information.</p><button class="btn ghost small" data-action="nav" data-view="library">Browse medications</button>`}
  </section>
  <section class="card"><div class="panel-title"><h2>Rotation snapshot</h2><span class="tag">Starter library</span></div>
   <div class="between" style="margin:11px 0"><span class="small subtle">Relevant medications</span><b>${drugs.length}</b></div>
   <div class="between" style="margin:11px 0"><span class="small subtle">Tier 1 essential</span><b>${drugs.filter(d=>d.tier===1).length}</b></div>
   <div class="between" style="margin:11px 0"><span class="small subtle">Concepts studied</span><b>${rotationCovered(r)}</b></div>
   <div class="between" style="margin:11px 0"><span class="small subtle">Current study streak</span><b>${dailyStreak()} day${dailyStreak()===1?'':'s'}</b></div>
   <div class="divider"></div><div class="fineprint">Class-level cards are educational summaries, not validated prescribing instructions. Dosing questions contain explicit scenarios and source links.</div>
  </section>
 </div><div class="sectiongap banner">${ic('shield','sm')} This app stores quiz progress and personal notes on this device only. Export regularly, especially before changing devices or clearing browser data. Never enter patient identifiers.</div>`;
}
function availableForConfig(){const seen=config.priority==='new'?new Set(state.attempts.map(a=>a.qid)):null;return QUESTIONS.filter(q=>(config.mode==='dosing'?q.category==='dosing':config.mode==='clinical'?q.category==='clinical':config.mode==='rapid'?q.type==='rapid'&&config.categories.includes(q.category):config.categories.includes(q.category))&&q.specialties.some(s=>config.specialties.includes(s))&&config.tiers.some(t=>q.tiers.includes(t))&&(!seen||!seen.has(q.id))).length}
function renderCheck(value,label,selected,group){return `<label class="checklabel ${selected?'checked':''}"><input type="checkbox" data-config-group="${group}" value="${esc(value)}" ${selected?'checked':''}/><span>${esc(label)}</span></label>`}
function choicesButtonGroup(name,entries,selected){return `<div class="button-group">${entries.map(([key,label])=>`<button class="chip ${selected===key?'active':''}" data-action="config-single" data-name="${name}" data-value="${esc(key)}">${esc(label)}</button>`).join('')}</div>`}
function renderPractice(){const available=availableForConfig(),total=available?(config.length?Math.min(config.length,available):available):0;
 return `${pageTitle('PRACTICE STUDIO','Build your next quiz','Select multiple specialties and pharmacology dimensions. Choose how you want to practice, and PharmCore will assemble a question set from the curated starter library.')}
 <div class="config-columns"><div class="builder-main">
  <section class="card"><div class="field-label-line"><div class="control-label">1. Specialties</div><div class="row"><button class="text-button" data-action="toggle-all" data-name="specialties" data-value="all">All</button><span class="subtle tiny">·</span><button class="text-button" data-action="toggle-all" data-name="specialties" data-value="none">Clear</button></div></div><div class="checkgrid">${SPECIALTIES.map(([id,name])=>renderCheck(id,name,config.specialties.includes(id),'specialties')).join('')}</div></section>
  <section class="card"><div class="field-label-line"><div class="control-label">2. Knowledge dimensions</div><div class="row"><button class="text-button" data-action="toggle-all" data-name="categories" data-value="all">All</button><span class="subtle tiny">·</span><button class="text-button" data-action="toggle-all" data-name="categories" data-value="none">Clear</button></div></div><div class="checkgrid">${CATEGORIES.map(([id,name])=>renderCheck(id,name,config.categories.includes(id),'categories')).join('')}</div><p class="fineprint" style="margin:13px 0 0">Dosing currently includes ${availableCountByCategory('dosing')} source-linked scenario questions; clinical decision-making includes ${availableCountByCategory('clinical')} authored vignettes. Most other questions are built from class-level study facts.</p></section>
  <section class="card"><div class="control-label">3. Medication importance</div><div class="pillrow">${[[1,'Tier 1 · Essential'],[2,'Tier 2 · Important'],[3,'Tier 3 · Recognition']].map(([i,label])=>`<label class="checklabel ${config.tiers.includes(i)?'checked':''}"><input type="checkbox" data-config-group="tiers" value="${i}" ${config.tiers.includes(i)?'checked':''}>${label}</label>`).join('')}</div></section>
 </div><div class="builder-side">
  <section class="card"><div class="control-label">4. Question format</div><div class="stack">${[['mixed','Mixed — selected dimensions'],['rapid','Rapid recall — knowledge facts'],['clinical','Clinical vignettes'],['dosing','Dosing & prescribing']].map(([key,label])=>`<label class="checklabel ${config.mode===key?'checked':''}"><input type="radio" name="quiz-mode" value="${key}" ${config.mode===key?'checked':''}>${label}</label>`).join('')}</div></section>
  <section class="card"><div class="control-label">5. Question prioritization</div>${choicesButtonGroup('priority',[['adaptive','Adaptive'],['highyield','High yield'],['new','New only'],['random','Random']],config.priority)}<div class="divider"></div><div class="control-label">6. Length</div>${choicesButtonGroup('length',[[10,'10'],[20,'20'],[40,'40'],[0,'All']],config.length)}<div class="divider"></div><div class="control-label">7. Feedback style</div>${choicesButtonGroup('exam',[[false,'Practice · instant feedback'],[true,'Exam · results at end']],config.exam)}</section>
  <section class="card" style="background:#eef9f4;border-color:#d6ebdf"><div class="eyebrow">YOUR QUIZ</div><h2 style="margin:0 0 5px">${total} questions ready</h2><p class="small" style="color:#49766a">${config.specialties.length} specialties · ${config.mode==='clinical'||config.mode==='dosing'?1:config.categories.length} dimensions · ${config.exam?'Exam':'Instant feedback'}</p><div class="fineprint" style="margin-bottom:15px">${available===0?'No questions match these filters. Try more specialties, tiers or categories.':'You can change selections and regenerate a new session anytime.'}</div><button class="btn full" data-action="start-config" ${total===0?'disabled':''}>Start this quiz ${ic('arrow','sm')}</button></section>
 </div></div>`;
}
function renderSession(){const session=state.session;if(!session||!session.qids?.length)return `${pageTitle('STUDY SESSION','No quiz in progress')}<button class="btn" data-action="nav" data-view="practice">Create a quiz</button>`;
 if(session.ended||session.idx>=session.qids.length)return renderResults();
 const q=qIndex[session.qids[session.idx]];if(!q)return `<div class="banner">This saved question is no longer available. Return to the quiz builder.</div>`;
 const answered=session.answers[session.idx],n=session.qids.length,index=session.idx;
 const explanations=answered&&!session.exam?`<div class="feedback-card ${answered.correct?'':'wrong'}"><div class="feedback-head ${answered.correct?'positive':'negative'}">${ic(answered.correct?'check':'alert','sm')} ${answered.correct?'Correct answer':'Not quite — review the reasoning'}</div><div class="small" style="color:#496576">${esc(q.teaching||'Review the explanation for each option.')}</div><div class="explain-list">${q.options.map((o,i)=>`<div class="explain-item ${o.correct?'correct':''}"><strong>${'ABCD'[i]}.</strong><span>${esc(o.why)}</span></div>`).join('')}</div><div class="fineprint" style="margin-top:12px">Source: <a href="${esc(q.source)}" target="_blank" rel="noopener noreferrer">${esc(q.sourceLabel)} ${ic('external','sm')}</a></div></div>`:'';
 return `<div class="quiz-topbar"><div class="row"><button class="btn ghost small" data-action="quit-quiz">${ic('close','sm')} Exit quiz</button><span class="rotate-badge">${esc(session.exam?'Exam mode':'Practice mode')}</span></div><div class="small strong monospace">Question ${index+1} of ${n}</div></div>
 <section class="card question-card"><div class="quiz-progress"><div style="width:${Math.round(index/n*100)}%"></div></div><div class="quiz-kicker"><span class="tag t1">${esc(cname(q.category))}</span><span class="tag">${esc(findDrug(q.drugId)?.name||'Clinical pharmacology')}</span><span class="tag">${q.type==='rapid'?'Rapid recall':q.type==='dosing'?'Dosing scenario':'Clinical vignette'}</span></div>
 <h2 class="question-title">${esc(q.stem)}</h2><div class="options">${q.options.map((o,i)=>`<button class="option ${answered&&!session.exam?(o.correct?'correct':i===answered.chosen?'incorrect':'dim'):''}" data-action="answer" data-index="${i}" ${answered?'disabled':''}><span class="opt-letter">${'ABCD'[i]}</span><span>${esc(o.text)}</span></button>`).join('')}</div>
 ${answered&&session.exam?`<div class="callout" style="margin-top:16px">${ic('check','sm')} Answer saved. Feedback and explanations will appear at the end of the exam.</div>`:''}
 ${explanations}
 ${answered&&!session.exam?`<div class="confidence"><div class="control-label">How well did you know this?</div><div class="small subtle">Your choice adjusts when this drug–concept pair is reviewed again.</div><div class="button-group">${[['again','Again'],['hard','Hard'],['good','Good'],['easy','Easy']].map(([id,label])=>`<button class="chip ${answered.confidence===id?'active':''}" data-action="confidence" data-value="${id}">${label}</button>`).join('')}</div></div>`:''}
 </section><div class="quiz-bottom"><div class="fineprint">${session.exam?'Your answers are saved locally; detailed review comes after submission.':'Practice questions show feedback immediately. Press 1–4 to select an answer.'}</div>${answered?`<button class="btn" data-action="next-question">${index===n-1?'Finish quiz':'Next question'} ${ic('arrow','sm')}</button>`:''}</div>`;
}
function renderResults(){const ss=state.session;if(!ss)return '';const ans=ss.answers.filter(Boolean),correct=ans.filter(a=>a.correct).length;
 return `${pageTitle('SESSION COMPLETE','Quiz results','Every answer is stored locally; review the rationales below to reinforce difficult concepts.')}
 <div class="card result-card"><div class="between" style="flex-wrap:wrap"><div><div class="eyebrow">YOUR SCORE</div><div class="result-big monospace">${ans.length?Math.round(correct/ans.length*100):0}%</div><div class="small subtle">${correct} correct out of ${ans.length} questions · ${ss.exam?'Exam':'Practice'} mode</div></div><div class="iconbox" style="width:75px;height:75px;border-radius:21px">${ic('chart','lg')}</div></div>
 <div class="divider"></div><div class="row" style="flex-wrap:wrap"><button class="btn" data-action="nav" data-view="practice">Build another quiz ${ic('arrow','sm')}</button><button class="btn ghost" data-action="start-reviews">Review due concepts</button><button class="btn ghost" data-action="export">Export progress</button></div>
 <div class="divider"></div><h2>Question-by-question review</h2>
 ${ss.qids.map((id,i)=>{const q=qIndex[id],a=ss.answers[i];if(!q||!a)return '';return `<details class="review-answer"><summary><span class="${a.correct?'positive':'negative'}">${a.correct?'✓':'✕'}</span> ${i+1}. ${esc(q.stem.slice(0,115))}${q.stem.length>115?'…':''}</summary><div class="small subtle" style="margin:8px 0">${esc(cname(q.category))} · ${esc(findDrug(q.drugId)?.name||'')}</div>${q.options.map(o=>`<div class="optionline ${o.correct?'good':''}">${o.correct?'✓ ':'• '}${esc(o.text)}${o.correct?' — correct':''}</div>`).join('')}<p>${esc(q.teaching)}</p><div class="explain-list">${q.options.map((o,i)=>`<div class="explain-item ${o.correct?'correct':''}"><strong>${'ABCD'[i]}.</strong><span>${esc(o.why)}</span></div>`).join('')}</div><p class="fineprint">Reference: <a href="${esc(q.source)}" target="_blank" rel="noopener noreferrer">${esc(q.sourceLabel)}</a></p></details>`}).join('')}
 </div>`;
}
function libraryMatches(d){const str=libraryFilter.search.trim().toLowerCase();return (!str||d.name.toLowerCase().includes(str)||C[d.cls].name.toLowerCase().includes(str)||d.indications.join(' ').toLowerCase().includes(str))&&(libraryFilter.specialty==='all'||d.specialties.includes(libraryFilter.specialty))&&(libraryFilter.tier==='all'||d.tier===Number(libraryFilter.tier))&&(!libraryFilter.saved||state.bookmarks.includes(d.id));}
function renderDrugCard(d){const count=state.attempts.filter(a=>a.drugId===d.id).length,mastery=getDrugMastery(d),saved=state.bookmarks.includes(d.id);
 return `<div class="drug-card"><div class="between"><div class="tagrow"><span class="tag t${d.tier}">Tier ${d.tier}</span>${state.encounters[d.id]?`<span class="tag t1">Seen in clinic</span>`:''}</div><button class="heart-btn ${saved?'active':''}" data-action="bookmark" data-id="${d.id}" aria-label="${saved?'Remove bookmark for':'Bookmark'} ${esc(d.name)}" title="Bookmark">${ic('heart','sm')}</button></div><h3>${esc(d.name)}</h3><div class="drug-class">${esc(C[d.cls].name)}</div><div class="indication">${esc(d.indications.slice(0,2).join(' · '))}</div><footer><span class="small subtle">${count?`${count} answers · ${mastery??0}% concept accuracy`:'Not yet studied'}</span><button class="text-button" data-action="drug" data-id="${d.id}">View profile ${ic('arrow','sm')}</button></footer></div>`;
}
function renderLibrary(){const matched=DRUGS.filter(libraryMatches).sort((a,b)=>a.tier-b.tier||a.name.localeCompare(b.name));
 return `${pageTitle('EXPLORE MEDICATIONS','Your drug library',`${DRUGS.length} essential, important and recognition-level medications, organized by rotation and pharmacology class.`, `<button class="btn ghost" data-action="export">${ic('download','sm')} Save my progress</button>`)}
 <div class="toolbar"><label class="search-wrap">${ic('search')}<input id="drug-search" aria-label="Search medications" placeholder="Search drug, class or indication…" value="${esc(libraryFilter.search)}" autocomplete="off"></label>
 <select class="form-select" id="library-specialty" aria-label="Filter by specialty"><option value="all">All specialties</option>${SPECIALTIES.map(([id,label])=>`<option value="${id}" ${libraryFilter.specialty===id?'selected':''}>${esc(label)}</option>`).join('')}</select>
 <select class="form-select" id="library-tier" aria-label="Filter by importance"><option value="all">All priorities</option>${[1,2,3].map(i=>`<option value="${i}" ${String(libraryFilter.tier)===String(i)?'selected':''}>Tier ${i}</option>`).join('')}</select>
 <button class="btn ${libraryFilter.saved?'soft':'ghost'}" data-action="toggle-bookmarks">${ic('heart','sm')} Saved only</button></div>
 <div class="between" style="margin-bottom:14px"><span class="small subtle" id="library-count">${matched.length} medications</span><span class="fineprint">Profiles are class-level learning summaries. Check linked prescribing labels before clinical use.</span></div>
 <div class="drug-grid" id="drug-grid">${matched.length?matched.map(renderDrugCard).join(''):`<div class="empty" style="grid-column:1/-1">${ic('search')}<h3>No medications found</h3><p>Try changing your search or filters.</p></div>`}</div>`;
}
function refreshLibraryGrid(){const grid=$('#drug-grid');if(!grid)return;const matched=DRUGS.filter(libraryMatches).sort((a,b)=>a.tier-b.tier||a.name.localeCompare(b.name));grid.innerHTML=matched.length?matched.map(renderDrugCard).join(''):`<div class="empty" style="grid-column:1/-1">${ic('search')}<h3>No medications found</h3><p>Try changing your search or filters.</p></div>`;$('#library-count').textContent=`${matched.length} medications`;}
function renderDrugModal(){const d=findDrug(selectedDrug);if(!d)return '';const p=C[d.cls],saved=state.bookmarks.includes(d.id),enc=state.encounters[d.id];
 const fields=[['Mechanism',p.mechanism],['Indications',d.indications.join('; ')],['Contraindications & precautions',p.caution],['Adverse effects',p.adverse],['Interactions',p.interactions],['Monitoring',p.monitoring],['Pharmacokinetics',p.kinetics],['Special populations',p.populations],['Toxicity & reversal',p.toxicity]];
 return `<div class="modal-backdrop" id="drug-overlay"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(d.name)} medication profile"><div class="modal-head"><div><div class="eyebrow">TIER ${d.tier} · ${esc(p.name)}</div><h2>${esc(d.name)}</h2><p class="small subtle">${esc(d.specialties.map(sname).join(' · '))}</p></div><button class="close" data-action="close-modal" aria-label="Close">${ic('close')}</button></div>
 <div class="pillrow" style="margin-bottom:17px"><button class="btn ${saved?'soft':'ghost'} small" data-action="bookmark" data-id="${d.id}">${ic('heart','sm')} ${saved?'Bookmarked':'Bookmark drug'}</button><button class="btn ${enc?'soft':'ghost'} small" data-action="encounter" data-id="${d.id}">${ic('stethoscope','sm')} ${enc?'Seen on rotation ✓':'Mark seen on rotation'}</button><button class="btn small" data-action="practice-drug" data-id="${d.id}">Practice this drug ${ic('arrow','sm')}</button></div>
 ${d.tag?`<div class="callout warn" style="margin-bottom:14px">${ic('info','sm')} ${esc(d.tag)}</div>`:''}
 <div class="detail-grid"><div class="detail-field"><div class="label">Classification</div><p>${esc(p.name)}</p></div>${fields.map(([k,val])=>`<div class="detail-field"><div class="label">${esc(k)}</div><p>${esc(val)}</p></div>`).join('')}<div class="detail-field"><div class="label">Dosing & administration</div><p>Indication-, patient-, formulation- and route-specific. Use the source-linked dosing questions when available and consult current labeling for actual prescriptions.</p></div></div>
 <div class="setting-block"><h3>Personal learning note</h3><p>Save a reminder about what you want to learn. Do not include any protected patient information.</p><textarea id="note-input" class="form-textarea" maxlength="3000" placeholder="E.g., I want to review why this medication is held before surgery…">${esc(state.notes[d.id]||'')}</textarea><div style="margin-top:9px"><button class="btn small" data-action="save-note" data-id="${d.id}">Save note</button></div></div>
 <div class="banner white">${ic('info','sm')} These are concise class-level study notes, not validated individualized treatment advice. <a href="https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(d.name)}" target="_blank" rel="noopener noreferrer">Check current labeling for ${esc(d.name)} ${ic('external','sm')}</a></div></div></div>`;
}
function renderReview(){const dueKeys=Object.entries(state.reviews).filter(([,v])=>v.due<=now());const upcoming=Object.entries(state.reviews).filter(([,v])=>v.due>now()).sort((a,b)=>a[1].due-b[1].due).slice(0,8);
 const filtered=dueKeys.filter(([key])=>reviewFilter==='all'||findDrug(key.split('|')[0])?.specialties.includes(reviewFilter));
 return `${pageTitle('SPACED REPETITION','Review what matters','Review scheduling follows each medication and knowledge dimension separately. Wrong answers and difficult concepts return sooner.',`<button class="btn ghost" data-action="export">${ic('download','sm')} Backup</button>`)}
 <div class="grid three">${metric('Due now',dueKeys.length,'Across all reviewed concepts','clock',true)}${metric('Concepts encountered',Object.keys(state.reviews).length,'Distinct drug × knowledge pairs','layers')}${metric('Study streak',dailyStreak()+' days','Consecutive calendar days with questions answered','calendar')}</div>
 <div class="grid two sectiongap"><section class="card"><div class="panel-title"><h2>Your review queue</h2><span class="badge good">${filtered.length} ready</span></div><div class="field-row" style="margin-bottom:12px"><select id="review-specialty" class="form-select" aria-label="Review specialty"><option value="all">All specialties</option>${SPECIALTIES.map(([id,n])=>`<option value="${id}" ${reviewFilter===id?'selected':''}>${esc(n)}</option>`).join('')}</select></div>
 ${filtered.length?`<div class="data-list">${filtered.slice(0,9).map(([key,v])=>{const [id,cat]=key.split('|'),d=findDrug(id);return d?`<div class="data-item"><div><div class="label">${esc(d.name)}</div><div class="caption">${esc(cname(cat))} · ${v.seen} review${v.seen===1?'':'s'}</div></div><span class="badge bad">Due</span></div>`:''}).join('')}</div><button class="btn full" data-action="start-reviews" ${filtered.length?'':'disabled'}>Study ${filtered.length} due concepts ${ic('arrow','sm')}</button>`:`<div class="empty">${ic('check')}<h3>You're caught up</h3><p>No concepts are currently due in this filter. New questions will build your future review queue.</p><button class="btn small" data-action="nav" data-view="practice">Practice new material</button></div>`}
 </section><section class="card"><div class="panel-title"><h2>Upcoming reviews</h2><span class="tag">Next scheduled</span></div>${upcoming.length?`<div class="data-list">${upcoming.map(([key,v])=>{const [id,cat]=key.split('|'),d=findDrug(id);return d?`<div class="data-item"><div><div class="label">${esc(d.name)}</div><div class="caption">${esc(cname(cat))}</div></div><span class="small subtle">${shortDate(v.due)}</span></div>`:''}).join('')}</div>`:`<div class="empty" style="padding:35px 10px">${ic('calendar')}<h3>No upcoming items</h3><p>Finish a quiz and choose a confidence rating to schedule future reviews.</p></div>`}<div class="divider"></div><p class="fineprint">Intervals are a simple adaptive heuristic, not a validated model of durable retention. Export your local data regularly.</p></section></div>`;
}
function renderAnalytics(){const rotStats=SPECIALTIES.map(([id,name])=>{const ids=new Set(DRUGS.filter(d=>d.specialties.includes(id)).map(d=>d.id)),a=state.attempts.filter(x=>ids.has(x.drugId));return {id,name,count:a.length,accuracy:accuracy(a),covered:Object.keys(state.reviews).filter(k=>ids.has(k.split('|')[0])).length};});
 const catStats=CATEGORIES.map(([id,label])=>{const a=state.attempts.filter(x=>x.category===id);return {id,label,count:a.length,accuracy:accuracy(a),coverage:Object.keys(state.reviews).filter(k=>k.endsWith('|'+id)).length,total:availableCountByCategory(id)};});
 const latest=state.attempts.slice(-12).reverse();
 return `${pageTitle('KNOWLEDGE TRACKING','Your learning analytics','Accuracy and concept coverage are tracked separately, so high scores cannot hide entire categories you have not studied.')}
 <div class="grid four">${metric('Completed answers',attemptCount(),'Every response from all sessions','quiz',true)}${metric('Overall accuracy',attemptCount()?accuracy()+'%':'—','Correct answers / total answers','activity')}${metric('Concepts covered',coveredCount(),`Of ${Object.keys(C).length?'many':'0'} drug-category study pairs`,'layers')}${metric('Saved medications',state.bookmarks.length,'Personal bookmarks across specialties','heart')}</div>
 <div class="grid two sectiongap"><section class="card"><div class="panel-title"><h2>Accuracy by pharmacology dimension</h2><span class="tag">12 knowledge categories</span></div>${catStats.map(x=>`<div class="progressrow"><div class="name">${esc(x.label)}</div><div class="progressbar ${x.count===0?'orange':''}"><div style="width:${x.count?x.accuracy:0}%"></div></div><div class="percent monospace">${x.count?x.accuracy+'%':'—'}</div></div>`).join('')}</section>
 <section class="card"><div class="panel-title"><h2>Exposure by category</h2><span class="tag">Unique concepts</span></div>${catStats.map(x=>`<div class="between" style="padding:9px 0;border-bottom:1px solid #f0f2f3"><span class="small">${esc(x.label)}</span><span class="small monospace"><b>${x.coverage}</b> / ${x.total} questions available</span></div>`).join('')}<p class="fineprint" style="margin-top:12px">A concept means one drug and one knowledge dimension; multiple question types may contribute to the same concept. Source-linked dosing and clinical cases are fewer by design.</p></section></div>
 <div class="grid two sectiongap"><section class="card"><div class="panel-title"><h2>Rotation performance</h2><span class="tag">Cross-specialty</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Specialty</th><th>Answers</th><th>Accuracy</th><th>Concepts</th></tr></thead><tbody>${rotStats.map(x=>`<tr><td>${esc(x.name)}</td><td>${x.count}</td><td>${x.count?x.accuracy+'%':'—'}</td><td>${x.covered}</td></tr>`).join('')}</tbody></table></div></section>
 <section class="card"><div class="panel-title"><h2>Recent responses</h2><span class="tag">Latest 12</span></div>${latest.length?`<div class="data-list">${latest.map(a=>`<div class="data-item"><div><div class="label">${esc(findDrug(a.drugId)?.name||'Medication')}</div><div class="caption">${esc(cname(a.category))} · ${shortDate(a.ts)}</div></div><span class="badge ${a.correct?'good':'bad'}">${a.correct?'Correct':'Incorrect'}</span></div>`).join('')}</div>`:`<div class="empty">${ic('activity')}<h3>Nothing here yet</h3><p>After your first quiz, you'll see a history of recent responses.</p></div>`}</section></div>`;
}
function renderSettings(){return `${pageTitle('YOUR DATA','Local storage & backups','All study progress stays on the device and browser where you use PharmCore. Transfer it manually whenever you like.')}
 <div class="grid two"><section class="card"><div class="panel-title"><h2>Local storage</h2><span class="health-pill">${ic('shield','sm')} Private on this device</span></div><div class="data-list"><div class="data-item"><span class="label">Storage engine</span><strong>${esc(storage.type)}</strong></div><div class="data-item"><span class="label">Recorded answers</span><strong>${state.attempts.length}</strong></div><div class="data-item"><span class="label">Scheduled reviews</span><strong>${Object.keys(state.reviews).length}</strong></div><div class="data-item"><span class="label">Bookmarks</span><strong>${state.bookmarks.length}</strong></div><div class="data-item"><span class="label">Personal notes</span><strong>${Object.keys(state.notes).length}</strong></div></div><div class="divider"></div><div class="stack"><button class="btn" data-action="export">${ic('download','sm')} Export my progress (.json)</button><button class="btn ghost" data-action="import">${ic('upload','sm')} Import a progress backup</button><input id="import-file" type="file" accept=".json,application/json" style="display:none"></div></section>
 <section class="card"><div class="panel-title"><h2>How to move between devices</h2><span class="tag">Manual sync</span></div><div class="data-list"><div class="data-item"><span class="badge good">1</span><div><div class="label">Export from the device you've been using</div><div class="caption">Downloads a JSON file containing question history, mastery, notes and bookmarks.</div></div></div><div class="data-item"><span class="badge good">2</span><div><div class="label">Transfer the file</div><div class="caption">Use AirDrop, iCloud Drive, email to yourself, or another method you trust.</div></div></div><div class="data-item"><span class="badge good">3</span><div><div class="label">Import on the other device</div><div class="caption">Choose Merge to combine study histories, or Replace to restore an exact copy.</div></div></div></div><div class="callout warn" style="margin-top:15px">${ic('alert','sm')} Browsers can clear local data. Export regularly and use the same website address and installation each time; browser and installed-web-app storage may be separate.</div></section></div>
 <div class="grid two sectiongap"><section class="card"><h2>Storage & privacy guidance</h2><p class="small subtle">Your data isn't uploaded by PharmCore. A static host delivers the app's public files, and your device stores the learning history locally. Manual transfer files are unencrypted JSON; keep them in a trusted location.</p><button class="btn ghost small" data-action="request-persist">${ic('database','sm')} Request persistent browser storage</button><div class="fineprint" style="margin-top:10px">The browser may allow or deny a persistence request. Export remains the reliable backup method.</div></section>
 <section class="card"><h2>About the learning content</h2><p class="small subtle">${DRUGS.length} seed medications; ${QUESTIONS.length} total question prompts (many generated from class-level educational facts), ${DOSING_CASES.length} source-linked dosing scenarios and ${CLINICAL_CASES.length} authored clinical cases. This content has not undergone clinical editorial peer review.</p><div class="stack">${SOURCES.map(([name,url])=>`<a class="small" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${ic('external','sm')} ${esc(name)}</a>`).join('')}</div><div class="divider"></div><button class="btn danger small" data-action="reset">${ic('alert','sm')} Clear all local progress</button></section></div>`;
}
function renderImportModal(){if(!importCandidate)return '';const count=importCandidate.payload?.attempts?.length||0;
 return `<div class="modal-backdrop" id="import-overlay"><div class="modal" style="max-width:540px" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="eyebrow">RESTORE STUDY DATA</div><h2>Import a PharmCore backup</h2></div><button class="close" data-action="close-import" aria-label="Close">${ic('close')}</button></div>
 <p class="small subtle">Backup exported ${esc(importCandidate.exportedAt?new Date(importCandidate.exportedAt).toLocaleString():'on an unknown date')}. Contains <b>${count}</b> answers, <b>${Object.keys(importCandidate.payload.reviews||{}).length}</b> review records and <b>${(importCandidate.payload.bookmarks||[]).length}</b> bookmarks.</p>
 <div class="stack"><button class="btn full" data-action="confirm-import" data-mode="merge">${ic('layers','sm')} Merge with this device's progress</button><button class="btn ghost full" data-action="confirm-import" data-mode="replace">${ic('rotate','sm')} Replace this device's progress</button><button class="btn ghost full" data-action="close-import">Cancel</button></div><p class="fineprint" style="margin-top:14px">Merge combines unique answer records and keeps newer review states; it cannot perfectly reconcile intervals computed independently on different devices. Replace overwrites all local progress. Export a backup first if needed.</p></div></div>`;
}
function render(){const pages={dashboard:renderDashboard,practice:renderPractice,session:renderSession,results:renderResults,library:renderLibrary,review:renderReview,analytics:renderAnalytics,settings:renderSettings};
 $('#app').innerHTML=shell((pages[view]||renderDashboard)());document.title=`${({dashboard:'Overview',practice:'Quiz builder',session:'Quiz',results:'Results',library:'Drug library',review:'Reviews',analytics:'Progress',settings:'Settings'})[view]||'PharmCore'} · PharmCore`;}
function go(page){view=page;sidebarOpen=false;render();window.scrollTo({top:0,behavior:'instant'});}
function resetConfigToRotation(){config.specialties=[state.prefs.rotation];}
function launchQuestions(qids,{exam=false,review=false}={}){if(!qids.length){toast('No matching questions available. Adjust the filters.');return;}state.session={qids,idx:0,answers:[],exam,review,ended:false,started:now()};persist();go('session');}
function startConfiguredQuiz(){const questions=selectQuestions(config);launchQuestions(questions.map(q=>q.id),{exam:config.exam});}
function startQuickQuiz(){config.specialties=[state.prefs.rotation];config.tiers=[1];config.categories=['classification','mechanism','indications','contraindications','adverse','interactions','monitoring','pharmacokinetics','populations','toxicity','clinical'];config.mode='mixed';config.length=10;config.exam=false;startConfiguredQuiz();}
function startDueReviews(){let dueKeys=Object.keys(state.reviews).filter(k=>state.reviews[k].due<=now());if(reviewFilter!=='all')dueKeys=dueKeys.filter(k=>findDrug(k.split('|')[0])?.specialties.includes(reviewFilter));const qs=dueKeys.map(key=>QUESTIONS.find(q=>`${q.drugId}|${q.category}`===key)).filter(Boolean);launchQuestions(shuffleSeeded(qs,`review-${now()}`).slice(0,40).map(q=>q.id),{review:true});}
function startDrugQuiz(id){const qs=QUESTIONS.filter(q=>q.drugId===id&&q.type==='rapid');launchQuestions(shuffleSeeded(qs,id).map(q=>q.id),{});selectedDrug=null;}
function pickAnswer(index){const sess=state.session;if(!sess||sess.ended||sess.answers[sess.idx])return;const q=qIndex[sess.qids[sess.idx]],chosen=q.options[index];if(!chosen)return;const attemptId=saveAttempt(q,index,chosen.correct);sess.answers[sess.idx]={chosen:index,correct:chosen.correct,attemptId,confidence:null};persist();render();}
function recordConfidence(c){const sess=state.session,ans=sess?.answers[sess.idx];if(!ans||sess.exam)return;if(ans.confidence){toast('Confidence is already recorded for this question.');return;}
 ans.confidence=c;applyReview(qIndex[sess.qids[sess.idx]],c,ans.correct);render();}
function advanceQuestion(){const sess=state.session,ans=sess?.answers[sess.idx];if(!ans)return;const q=qIndex[sess.qids[sess.idx]];
 if(!ans.confidence){const c=ans.correct?'good':'again';ans.confidence=c;applyReview(q,c,ans.correct);}
 sess.idx++;if(sess.idx>=sess.qids.length){sess.ended=true;view='results';}persist();render();window.scrollTo({top:0,behavior:'instant'});}
function exportData(){const payload={app:'PharmCore',schema:1,exportedAt:new Date().toISOString(),appVersion:PHARMCORE_VERSION,payload:{...state,session:null}};const b=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(b);const a=document.createElement('a');a.href=url;a.download=`pharmcore-progress-${today()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);toast('Backup file downloaded. Keep it somewhere safe.');}
function validImported(p){if(!p||p.app!=='PharmCore'||p.schema!==1||!p.payload)return false;const s=p.payload;return Array.isArray(s.attempts)&&Array.isArray(s.bookmarks)&&s.reviews&&typeof s.reviews==='object'&&s.notes&&typeof s.notes==='object'&&s.encounters&&typeof s.encounters==='object';}
async function handleImport(file){if(!file)return;if(file.size>5*1024*1024){toast('Backup is larger than the supported 5 MB limit.');return;}try{const raw=JSON.parse(await file.text());if(!validImported(raw))throw new Error('Not a recognized PharmCore backup');importCandidate=raw;render();}catch(err){toast(`Could not read backup: ${err.message}`);}}
function cleanImported(p){const s=p.payload,base=defaultState();const attempts=s.attempts.filter(a=>a&&typeof a.id==='string'&&typeof a.qid==='string'&&typeof a.drugId==='string'&&typeof a.category==='string'&&typeof a.correct==='boolean'&&Number.isFinite(a.ts)).slice(-90000);
 const reviews={};Object.entries(s.reviews).slice(0,20000).forEach(([key,r])=>{if(r&&typeof r==='object'&&Number.isFinite(r.due)&&Number.isFinite(r.last)&&Number.isFinite(r.seen)&&Number.isFinite(r.correct))reviews[key]={seen:r.seen,correct:r.correct,streak:Number(r.streak)||0,interval:Number(r.interval)||0,ease:Number(r.ease)||2.5,due:r.due,last:r.last};});
 const notes={};Object.entries(s.notes).slice(0,500).forEach(([k,v])=>{if(typeof v==='string')notes[k]=v.slice(0,3000);});
 const encounters={};Object.entries(s.encounters).slice(0,500).forEach(([k,v])=>{if(v&&Number.isFinite(v.ts))encounters[k]={ts:v.ts,specialty:typeof v.specialty==='string'?v.specialty:'family'};});
 return {...base,prefs:{...base.prefs,...(s.prefs&&typeof s.prefs==='object'?{rotation:SPECIALTIES.some(x=>x[0]===s.prefs.rotation)?s.prefs.rotation:'family'}:{})},attempts,reviews,notes,encounters,bookmarks:s.bookmarks.filter(x=>typeof x==='string'&&findDrug(x)).slice(0,500),session:null};}
function confirmImport(mode){if(!importCandidate)return;const received=cleanImported(importCandidate);
 if(mode==='replace'){state=received;}
 else{const seen=new Set(state.attempts.map(a=>a.id));const added=received.attempts.filter(a=>!seen.has(a.id));state.attempts=[...state.attempts,...added].sort((a,b)=>a.ts-b.ts);for(const [key,r] of Object.entries(received.reviews)){if(!state.reviews[key]||r.last>state.reviews[key].last)state.reviews[key]=r;}for(const [key,v] of Object.entries(received.encounters)){if(!state.encounters[key]||v.ts>state.encounters[key].ts)state.encounters[key]=v;}state.notes={...received.notes,...state.notes};state.bookmarks=[...new Set([...state.bookmarks,...received.bookmarks])];state.session=null;}
 importCandidate=null;persist();go('analytics');toast('Progress imported successfully.');}
function doReset(){if(!confirm('Permanently erase ALL local PharmCore progress, notes and bookmarks on this device? Export a backup first if needed.'))return;state=defaultState();config.specialties=[state.prefs.rotation];persist();go('dashboard');toast('This device’s local progress was reset.');}
function handleAction(action,btn){const id=btn.dataset.id;
 switch(action){
  case 'nav':go(btn.dataset.view);return;
  case 'mobile':sidebarOpen=!sidebarOpen;render();return;
  case 'quick-study':startQuickQuiz();return;
  case 'toggle-all':{const name=btn.dataset.name,list=name==='specialties'?SPECIALTIES.map(x=>x[0]):CATEGORIES.map(x=>x[0]);config[name]=btn.dataset.value==='all'?list:[];render();return;}
  case 'config-single':{const name=btn.dataset.name,value=btn.dataset.value;config[name]=name==='length'?Number(value):name==='exam'?value==='true':value;render();return;}
  case 'start-config':startConfiguredQuiz();return;
  case 'answer':pickAnswer(Number(btn.dataset.index));return;
  case 'confidence':recordConfidence(btn.dataset.value);return;
  case 'next-question':advanceQuestion();return;
  case 'quit-quiz':if(confirm('Exit this quiz? Completed answers will remain saved.')){state.session=null;persist();go('practice');}return;
  case 'drug':selectedDrug=id;render();return;
  case 'close-modal':selectedDrug=null;render();return;
  case 'bookmark':{if(state.bookmarks.includes(id))state.bookmarks=state.bookmarks.filter(x=>x!==id);else state.bookmarks.push(id);persist();render();return;}
  case 'encounter':{if(state.encounters[id])delete state.encounters[id];else state.encounters[id]={ts:now(),specialty:state.prefs.rotation};persist();render();return;}
  case 'practice-drug':selectedDrug=null;startDrugQuiz(id);return;
  case 'save-note':{const note=$('#note-input')?.value?.trim().slice(0,3000)||'';if(note)state.notes[id]=note;else delete state.notes[id];persist();toast('Personal learning note saved on this device.');return;}
  case 'toggle-bookmarks':libraryFilter.saved=!libraryFilter.saved;render();return;
  case 'start-reviews':startDueReviews();return;
  case 'export':exportData();return;
  case 'import':$('#import-file')?.click();return;
  case 'close-import':importCandidate=null;render();return;
  case 'confirm-import':confirmImport(btn.dataset.mode);return;
  case 'reset':doReset();return;
  case 'request-persist':{
   if(!navigator.storage?.persist){toast('Persistent storage requests are not supported in this browser.');return;}
   navigator.storage.persist().then(ok=>toast(ok?'Persistent storage granted by your browser.':'Persistence not granted. Keep exporting backup files.')).catch(()=>toast('Could not request persistent storage.'));
   return;}
 }
}
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-action]');if(button){e.preventDefault();if(!button.disabled)handleAction(button.dataset.action,button);return;}
 if(e.target.id==='drug-overlay'){selectedDrug=null;render();}
 if(e.target.id==='import-overlay'){importCandidate=null;render();}
});
document.addEventListener('change',e=>{
 const t=e.target;
 if(t.id==='rotation-select'){state.prefs.rotation=t.value;config.specialties=[t.value];persist();render();return;}
 if(t.dataset.configGroup){const group=t.dataset.configGroup,val=group==='tiers'?Number(t.value):t.value;config[group]=t.checked?[...new Set([...config[group],val])]:config[group].filter(x=>x!==val);render();return;}
 if(t.name==='quiz-mode'){config.mode=t.value;render();return;}
 if(t.id==='library-specialty'){libraryFilter.specialty=t.value;refreshLibraryGrid();return;}
 if(t.id==='library-tier'){libraryFilter.tier=t.value;refreshLibraryGrid();return;}
 if(t.id==='review-specialty'){reviewFilter=t.value;render();return;}
 if(t.id==='import-file'){handleImport(t.files?.[0]);t.value='';return;}
});
document.addEventListener('input',e=>{if(e.target.id==='drug-search'){libraryFilter.search=e.target.value;refreshLibraryGrid();}});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(importCandidate){importCandidate=null;render();}else if(selectedDrug){selectedDrug=null;render();}return;}
 const active=document.activeElement;if(['INPUT','TEXTAREA','SELECT'].includes(active?.tagName))return;
 if(view==='session'&&state.session&&!state.session.answers[state.session.idx]&&/^[1-4]$/.test(e.key)){e.preventDefault();pickAnswer(Number(e.key)-1);}
});
(async()=>{
 await storage.init();const loaded=await storage.load();if(loaded&&typeof loaded==='object'&&Array.isArray(loaded.attempts)&&loaded.reviews&&loaded.prefs){state={...defaultState(),...loaded,prefs:{...defaultState().prefs,...loaded.prefs}};}
 config.specialties=[state.prefs.rotation];
 if(state.session&&Array.isArray(state.session.qids)&&state.session.qids.length&&state.session.qids.every(id=>qIndex[id]))view=state.session.ended?'results':'session';
 render();
 if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./service-worker.js').catch(e=>console.warn('Offline cache unavailable',e));
})();
