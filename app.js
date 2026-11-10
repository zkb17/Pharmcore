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
const BASE_DRUGS=DRUGS.slice();
const profileFields=['mechanism','caution','adverse','interactions','monitoring','kinetics','populations','toxicity'];
function getProfile(d){
 const base=C[d.cls]||{id:d.cls,name:d.className||'Custom medication class'};
 const result={...base,name:d.className||base.name};
 for(const field of profileFields){if(d.details?.[field])result[field]=d.details[field];}
 return result;
}
function rebuildCatalog(){
 DRUGS.splice(BASE_DRUGS.length);
 for(const d of state.customDrugs||[]) DRUGS.push({...d,custom:true});
}

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
const defaultState=()=>({schema:2,prefs:{rotation:'family',hasSeenWelcome:false,termHighlights:true},attempts:[],reviews:{},encounters:{},bookmarks:[],notes:{},customDrugs:[],session:null});
let state=defaultState(), view='dashboard', selectedDrug=null, drugEditor=null, sidebarOpen=false, noticeTimer=null;
let config={specialties:['family'],categories:['classification','mechanism','indications','contraindications','adverse','monitoring'],tiers:[1,2],mode:'mixed',length:20,priority:'adaptive',exam:false};
let libraryFilter={search:'',specialty:'all',tier:'all',saved:false,custom:false};
let reviewFilter='all';
let attendingSearch='',attendingFilter='current';
let importCandidate=null,drugListCandidate=null;
config.drugIds=null; // Null means normal rotation filtering; array means imported list only.
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

// Related, REAL pharmacologic classes make more useful distractors than unrelated trivia.
// Groups describe neighboring therapeutic approaches or molecular targets, NOT equivalence.
const DISTRACTOR_FAMILIES=[
 ['ace','arb','bb','bb-nonselect','bb-alpha','thiazide','loop','mra','ENaC','alpha1','alpha2-central','vasodil-nitrate','vasodil-direct','ccb-dhp','ccb-ndhp'],
 ['p2y12','prasugrel','aspirin','pde-antiplatelet','lmwh','ufh','indirect-xa','doac-xa','other-anticoag','warfarin','thrombolytic'],
 ['statin','npc1l1','bcell-small'],
 ['secretagogue','biguanide','insulin','glp1','dual-incretin','sglt2','dpp4','tzd','alpha-glucosidase','glucagon'],
 ['ppi','h2','sucralfate','5asa','bismuth'],
 ['nsaid','apap','opioid','gabapentinoid','local-anes','ketamine','colchicine'],
 ['aminopen','antipseudopen','pen-natural','pen-staph','ceph1','ceph2','ceph3','ceph4','ceph5','cephamycin','carbapenem','monobactam'],
 ['macrolide','tetracycline','fluoroquinolone','lincosamide','aminoglycoside','glycopep','glycopeptide-other','mrsa-other','daptomycin','tmp-smx','nitrofuran','fosfomycin','nitroimidazole'],
 ['azole','antifungal-echinocandin','antifungal-polyene','allylamine'],
 ['na-inhib','baloxavir','covid-rna','covid-protease','nucleoside-antiviral','antiviral-hiv-nrt','antiviral-hiv-inti','antiviral-hiv-pi','antiviral-hcv'],
 ['saba','resp-laba','ics','ics-laba','ics-lama-laba','resp-lama','resp-leukotriene','antihist','resp-lt-antihist','mab-ige','mab-il4','mab-il5','mab-tslp'],
 ['ssri','snri','bup','ssri-alt','maoi','serotonin-mod','na-specific','sari','5ht1a','lithium','mood-valproate'],
 ['atypical','atypical-long','firstgen-antipsych','benzo','nonbenzo-hypnotic','stimulant','nonstimulant-adhd'],
 ['antiepileptic-sv2a','antiepileptic-na','antiepileptic-cb','antiepileptic-gaba','antiepileptic-top','t-type','mood-valproate','gabapentinoid'],
 ['propofol','etomidate','barb-anesth','ketamine','volatile','dexmed','benzo'],
 ['nmba-nondep','nmba-dep','sugammadex','ache-reversal','benzo-antag','naloxone','dantrolene'],
 ['uterotonic','ergot-uterotonic','pge1','pge2','pgf2','oxy-antag','mag','gnrh','antiprog','sp-mod'],
 ['mab-tnf','mab-il6','mab-il17','mab-il23','mab-il1223','mab-il1','mab-cd80','autoinflam-jak','calcineurin','mtor','thiopurine','impdh','hcq'],
 ['mab-cd20','mab-cd19','mab-bispec-cd20','mab-cd38','mab-complement','mab-integrin'],
 ['mab-pd1','mab-pdl1','mab-ctla4','mab-her2','mab-her2-adc','mab-egfr','mab-vegf','mab-vegf-eye','mab-cd30-adc','mab-rankl'],
 ['tki-bcrabl','tki-egfr','tki-braf','MEK','bcell-small','autoinflam-jak'],
 ['cytotoxic-alkyl','cytotoxic-antimet','cytotoxic-taxane','vinca','anthracycline','platinum'],
 ['antiestrogen','aromatase','progestin','progestin-only','coc','gnrh','estrogen-replacement'],
 ['5ht3','antiemetic-d2','nk1','antimuscarinic','antihist'],
 ['alpha1-pressor','norepi','vasopressin-pressor','dobutamine','dopamine','epi'],
 ['mab-complement','rankl','mab-rankl','osteoporosis-sclerostin','bisphosphonate','parathyroid','pth-receptor'],
];
const DISTRACTOR_STOPWORDS=new Set(('the a an and or of for with without by in on to from is are as this that can may which it its treatment effects effect drug class inhibitors inhibitor agonists agonist receptor receptors selective direct indirect specific primarily primarily by increase reduce decreases inhibits blocking blocks causes inhibits therapy agent medication certain certain associated effects clinical risk patients use used').split(' '));
const TOKEN_MEMO=new Map();
function conceptTokens(s){s=String(s||'');if(TOKEN_MEMO.has(s))return TOKEN_MEMO.get(s);const out=new Set(s.toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(x=>x.length>=4&&!DISTRACTOR_STOPWORDS.has(x)));TOKEN_MEMO.set(s,out);return out;}
function commonConcepts(a,b){const x=conceptTokens(a),y=conceptTokens(b);let n=0;for(const term of x)if(y.has(term))n++;return n/Math.max(2,Math.min(x.size,y.size));}
function sameDistractorFamily(a,b){return DISTRACTOR_FAMILIES.some(g=>g.includes(a)&&g.includes(b));}
let CLASS_EXAMPLES=new Map(),NEAR_CLASS_CACHE=new Map();
function classDrugExample(cls){return CLASS_EXAMPLES.get(cls);}
function classNearness(target,candidate,category='mechanism'){
 if(!target||!candidate||target.id===candidate.id)return -100;
 const d=classDrugExample(target.id),other=classDrugExample(candidate.id);
 let score=0;
 if(sameDistractorFamily(target.id,candidate.id))score+=9;
 if(target.id.split('-')[0]===candidate.id.split('-')[0]&&target.id.includes('-'))score+=2;
 if(target.id.startsWith('mab-')&&candidate.id.startsWith('mab-'))score+=2;
 score+=2.1*commonConcepts(target.name,candidate.name);
 score+=2.5*commonConcepts(target.mechanism,candidate.mechanism);
 const field=FIELD_KEY[category]||category;
 score+=1.2*commonConcepts(target[field],candidate[field]);
 if(d&&other){
  if(d.specialties.some(x=>other.specialties.includes(x)))score+=.8;
  if(d.indications.some(x=>other.indications.includes(x)))score+=1.5;
  score+=.7*commonConcepts(d.indications.join(' '),other.indications.join(' '));
 }
 return score;
}
// Similar does not mean both options should plausibly be correct.
// Avoid overlapping symptom/precaution/monitoring facts among clinical-profile choices.
const CLINICAL_COLLISION_CATEGORIES=new Set(['adverse','contraindications','interactions','monitoring','populations','toxicity','pharmacokinetics']);
const SALIENT_OVERLAP=new Set(('edema hypotension hypertension hyperkalemia hypokalemia hyponatremia bradycardia tachycardia bleeding arrhythmia nephrotoxicity renal hepatic cough sedation seizures headache constipation diarrhea nausea vomiting rash infection myelosuppression thrombocytopenia QT prolongation anaphylaxis pancreatitis').toLowerCase().split(' '));
function ambiguousClinicalAlternative(right,wrong,category){
 if(!CLINICAL_COLLISION_CATEGORIES.has(category))return false;
 const a=conceptTokens(right),b=conceptTokens(wrong),common=[...a].filter(x=>b.has(x));
 const overlap=common.length/Math.max(1,Math.min(a.size,b.size));
 return overlap>=.36&&common.length>=2 || common.some(x=>SALIENT_OVERLAP.has(x))&&overlap>=.20;
}
function nearClasses(target,pool,seed,category='mechanism',count=3){
 const cacheKey=target.id+'|'+category;
 let ranked=NEAR_CLASS_CACHE.get(cacheKey);
 if(!ranked){ranked=[...Object.values(C),...new Map((state.customDrugs||[]).filter(d=>!C[d.cls]).map(d=>[d.cls,getProfile(d)])).values()]
  .filter(x=>x.id!==target.id).map(x=>({id:x.id,score:classNearness(target,x,category)})).sort((a,b)=>b.score-a.score).map(x=>x.id);
  NEAR_CLASS_CACHE.set(cacheKey,ranked);
 }
 const index=new Map(ranked.map((id,i)=>[id,i]));
 return shuffleSeeded(pool.filter(x=>x.id!==target.id),seed).sort((a,b)=>(index.get(a.id)??999999)-(index.get(b.id)??999999)).slice(0,count);
}
function indicationCollision(a,b){
 const text=String(a||'').toLowerCase(),other=String(b||'').toLowerCase();
 if(text.includes(other)||other.includes(text))return true;
 const ax=conceptTokens(a),bx=conceptTokens(b),common=[...ax].filter(t=>bx.has(t));
 return common.length>=1&&common.length/Math.max(1,Math.min(ax.size,bx.size))>=.66;
}
function nearDrugs(drug,pool,seed,count=3){
 return shuffleSeeded(pool.filter(x=>x.id!==drug.id),seed).map(x=>({x,score:classNearness(getProfile(drug),getProfile(x),'indications')+2*commonConcepts(drug.indications.join(' '),x.indications.join(' '))+(sameDistractorFamily(drug.cls,x.cls)?3:0)})).sort((a,b)=>b.score-a.score).slice(0,count).map(x=>x.x);
}
function choicesFromAnswer(id,correctText,incorrectValues){
 let raw=[{text:correctText,correct:true,why:''},...incorrectValues.map(x=>({text:x.text,correct:false,why:x.why,contrastClass:x.contrastClass,contrastDrug:x.contrastDrug}))];
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

// Enhanced educational explanations and independent, local AMBOSS-style term lookup.
// Terminology popovers are authored by PharmCore, not provided by AMBOSS.
let selectedTerm=null;
const naturalDrug=(d)=>d?.name||'This medication';
function matchNameRule(d){
 if(!d)return null;
 const token=d.name.trim().split(/[\s/(]+/)[0];
 return NAME_RECOGNITION_RULES.find(rule=>{
  if(!rule.rx.test(token))return false;
  // New antibody stems are antibody family indicators, but never claim a specific antigen.
  if(rule.classes.length===0)return /^(mab-|cgrp-mab|rsv-mab|rankl$|emicizumab$)/.test(d.cls)||d.cls==='mab-vegf-eye';
  return rule.classes.includes(d.cls);
 })||null;
}
function namingExplanation(d){
 if(!d)return '';
 if(d.details?.naming)return `Your name pattern note: ${d.details.naming}`;
 const c=getProfile(d),own=matchNameRule(d);
 const source='Pattern source: USAN / WHO international nonproprietary naming conventions.';
 if(own){
  const more=(own.stem.includes('mab')||['-tug','-bart','-ment','-mig'].includes(own.stem))
   ? ' The antibody suffix does not identify its molecular antigen or signal-transduction target. WHO replaced the general -mab suffix for newly assigned antibody names with -tug, -bart, -ment and -mig; many existing drugs retain -mab.'
   : '';
  return `Recognize ${own.stem}: this pattern suggests ${own.meaning}. Examples: ${own.examples}. ${d.name} is classified as ${c.name}.${more} ${source}`;
 }
 // Class-level contrast: e.g. a biologic or calcium-channel blocker without a regular suffix.
 const classMates=DRUGS.filter(x=>x.id!==d.id&&x.cls===d.cls);
 const patternedMate=classMates.map(x=>({drug:x,rule:matchNameRule(x)})).find(x=>x.rule);
 if(patternedMate)return `Class naming cue: ${patternedMate.drug.name} uses ${patternedMate.rule.stem} (${patternedMate.rule.meaning}). ${d.name} is also a ${c.name}, but does not carry that same cue. ${source}`;
 if(d.cls==='ccb-ndhp')return `${d.name} and the other non-dihydropyridine calcium-channel blockers (e.g., verapamil/diltiazem) do not share the -dipine suffix. Compare that with amlodipine/nifedipine: -dipine identifies the dihydropyridine subgroup. The drugs differ in cardiac vs vascular effects.`;
 if(d.cls==='calcineurin'&&/rolimus$/i.test(d.name))return `Name trap: ${d.name} ends in -rolimus, but is a calcineurin inhibitor, not an mTOR inhibitor. Sirolimus and everolimus inhibit mTOR. Memorize this exception rather than overgeneralizing from the ending.`;
 if(d.cls.startsWith('mab-')||d.cls==='cgrp-mab')return `Biologic recognition: established antibody drugs often end in -mab, while certain fusion proteins may end in -cept. The ending can identify the modality, not its antigen; for ${d.name} learn its actual pharmacologic class (${c.name}). Newer WHO antibody endings include -tug, -bart, -ment and -mig.`;
 const fellows=classMates.slice(0,3).map(x=>x.name);
 return fellows.length?
  `Name-family comparison: ${d.name} and ${fellows.join(' / ')} belong to ${c.name}. These examples do not share a dependable class-specific name stem; recognize them by their target, not by a coincidental ending.`:
  `Name-family recognition: ${d.name} is classified as ${c.name}. Its best memory cue is its molecular target/mechanism, since an unambiguous class suffix is not established for this particular name.`;
}

function pathwayFor(d){
 if(!d)return '';
 const p=getProfile(d);
 return d.custom&&d.details?.mechanism?
  `User-authored mechanism (unreviewed): ${d.details.mechanism}`:
  (PATHWAY_NOTES[d.cls]||`Mechanism from the ${p.name} class study record: ${p.mechanism||'No molecular target recorded.'} This is a class summary; targets and kinetics can differ among agents.`);
}
function deepenQuestion(q){
 const d=findDrug(q.drugId);if(!d)return q;
 const p=getProfile(d),extra=pathwayFor(d);
 const intro=`${d.name} belongs to the ${p.name} class. ${extra}`;
 const role=q.category==='contraindications'?`Safety connection: ${p.caution||'Check the labeled contraindications and relevant comorbidities.'}`:
  q.category==='adverse'?`Adverse-effect connection: ${p.adverse||'Adverse events depend on dose and individual susceptibility.'}`:
  q.category==='interactions'?`Interaction connection: ${p.interactions||'Review metabolic and pharmacodynamic interactions.'}`:
  q.category==='monitoring'?`Monitoring connection: ${p.monitoring||'Monitoring depends on the clinical indication and organ function.'}`:
  q.category==='pharmacokinetics'?`Disposition: ${p.kinetics||'Assess metabolism, clearance and formulation differences.'}`:
  q.category==='populations'?`Patient context: ${p.populations||'Consider pregnancy, age, renal and hepatic function.'}`:
  q.category==='toxicity'?`Toxicology: ${p.toxicity||'Toxicity and reversal depend on the drug and dose.'}`:
  q.category==='indications'?`Therapeutic link: the pharmacologic action supports its documented teaching indications (${d.indications.slice(0,4).join('; ')||'see labeling'}), but does not automatically make it first-line or appropriate for a particular patient.`:
  q.category==='dosing'?`Dosing is not determined by receptor mechanism alone; assess indication, age, weight, formulation, renal/hepatic function, route and maximum daily dose. The cited regimen applies only to the scenario described.`:
  q.category==='clinical'?`Clinical reasoning requires matching this pathway to the patient's presentation, contraindications, interacting agents and appropriate monitoring.`:
  `Interpretation: link the molecular action to downstream physiology and clinical effects; medication-specific differences still matter.`;
 q.deepDive={mechanism:intro,clinical:role,naming:namingExplanation(d)};
 for(const o of q.options){
  if(o.correct){
   const base=o.why||'This is the correct response.';
   o.why=`${base} Pharmacologic rationale: ${extra}`;
   if(q.category==='dosing')o.why+=' The regimen is scenario-specific; confirm the referenced drug label before any actual prescribing.';
  }else{
   // Generated class-distractors are constructed from OTHER class records; contrast their mechanisms explicitly.
   const fromClass=o.contrastClass?C[o.contrastClass]||(state.customDrugs||[]).map(getProfile).find(x=>x.id===o.contrastClass):null;
   const fromDrug=o.contrastDrug?findDrug(o.contrastDrug):null;
   const other=fromDrug?getProfile(fromDrug):fromClass;
   const otherPath=fromDrug?pathwayFor(fromDrug):fromClass?(PATHWAY_NOTES[fromClass.id]||fromClass.mechanism):'';
   let contrast='';
   if(other)contrast=` Mechanistic contrast: ${other.name} ${otherPath||'has a different principal pharmacologic target or class-level profile.'} In this question, the correct concept is associated with ${d.name} (${p.name}).`;
   else if(q.type==='clinical'){const candidate=DRUGS.filter(x=>x.id!==d.id&&x.name.length>=5&&o.text.toLowerCase().includes(x.name.toLowerCase())).sort((a,b)=>b.name.length-a.name.length)[0];contrast=candidate?` Alternative pharmacology: ${candidate.name} (${getProfile(candidate).name}) — ${pathwayFor(candidate)}`:` Pharmacologic distinction: ${p.mechanism||extra}`;}
   else if(q.type==='dosing')contrast=' A mechanistically appropriate drug can still be unsafe at the wrong dose, route, or interval; use the regimen specified by the source for this exact scenario.';
   else contrast=` Mechanistic anchor for the intended answer: ${extra}`;
   if(q.type==='rapid'&&['adverse','contraindications','interactions','monitoring','pharmacokinetics','populations','toxicity'].includes(q.category))contrast+=' This contrast identifies the indexed teaching fact; different drugs can share adverse effects or precautions in real practice.';
   o.why=(o.why||'This is not the intended answer.')+contrast;
  }
 }
 return q;
}
// Local term index. More than a thousand full dictionary matches are intentionally NOT
// performed on every render; restrict to a high-yield curated glossary plus current drug.
const TERM_KEYS=Object.keys(TERM_DEFINITIONS).sort((a,b)=>b.length-a.length);
const TERM_REGEX=new RegExp('(^|[^\\p{L}\\p{N}])('+TERM_KEYS.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?=$|[^\\p{L}\\p{N}])','giu');
function highlightTerms(value,{limit=18}={}){
 const source=String(value??'');
 if(state.prefs.termHighlights===false||source.length>7000)return esc(source);
 let out='',start=0,n=0;TERM_REGEX.lastIndex=0;let hit;
 while((hit=TERM_REGEX.exec(source))&&n<limit){const before=hit[1]||'',word=hit[2],pos=hit.index+before.length;
  out+=esc(source.slice(start,pos));out+=`<button type="button" class="term-link" data-action="term" data-term="${esc(word.toLowerCase())}" title="Explain ${esc(word)}" aria-label="Explain ${esc(word)}">${esc(word)}</button>`;
  start=pos+word.length;n++;
 }
 return out+esc(source.slice(start));
}
function termDefinition(word){const key=word.toLowerCase();
 if(TERM_DEFINITIONS[key])return TERM_DEFINITIONS[key];
 const drug=DRUGS.find(d=>d.name.toLowerCase()===key);
 return drug?`${drug.name}: ${getProfile(drug).name}. ${pathwayFor(drug)}`:'No local explanation is available. Use your AMBOSS account to search the term.';
}
function renderTermModal(){if(!selectedTerm)return '';
 const definition=termDefinition(selectedTerm);
 return `<div class="modal-backdrop" id="term-overlay"><div class="modal term-modal" role="dialog" aria-modal="true" aria-label="Medical term explanation"><div class="modal-head"><div><div class="eyebrow">LOCAL MEDICAL GLOSSARY · AMBOSS LOOKUP</div><h2>${esc(selectedTerm)}</h2></div><button class="close" data-action="close-term" aria-label="Close">${ic('close')}</button></div><p>${esc(definition)}</p><div class="callout" style="margin-bottom:16px">${ic('info','sm')} This short explanation is from PharmCore, not AMBOSS. For AMBOSS's full entry, copy the term and search it after opening the Library. An internet connection and AMBOSS access may be required.</div><div class="row" style="flex-wrap:wrap"><button class="btn small" data-action="copy-term">${ic('copy','sm')} Copy term</button><a class="btn ghost small" href="https://next.amboss.com/us/" target="_blank" rel="noopener noreferrer">Open AMBOSS ${ic('external','sm')}</a></div><p class="fineprint">Desktop Chrome: the official AMBOSS extension can also highlight website terms independently. This built-in glossary works on iPhone without an extension.</p></div></div>`;
}
function deepDiveHtml(q){if(!q.deepDive)return '';
 const e=q.deepDive;
 return `<div class="deep-dive"><div class="deep-title">${ic('atom','sm')} Pharmacology deep dive</div><div class="deep-row"><strong>Target → signaling → effect</strong><p>${highlightTerms(e.mechanism)}</p></div><div class="deep-row"><strong>Clinical consequence</strong><p>${highlightTerms(e.clinical)}</p></div><div class="deep-row"><strong>Why the drug is named this way</strong><p>${highlightTerms(e.naming)}</p></div><div class="glossary-caption">Dotted highlights are selectable medical terms. Tap to see a local definition and an AMBOSS lookup shortcut.</div></div>`;
}
const QUESTIONS=[];
const byCategory={};
const qIndex={};
function appendQuestion(q){deepenQuestion(q);QUESTIONS.push(q);qIndex[q.id]=q;(byCategory[q.category]||(byCategory[q.category]=[])).push(q);}
function generateQuestions(){
 CLASS_EXAMPLES=new Map(DRUGS.filter(d=>!d.needsReview).map(d=>[d.cls,d]).reverse());NEAR_CLASS_CACHE.clear();
 QUESTIONS.length=0;
 for(const key of Object.keys(qIndex))delete qIndex[key];
 for(const key of Object.keys(byCategory))delete byCategory[key];
 const extraClasses=[...new Map((state.customDrugs||[]).filter(d=>!C[d.cls]).map(d=>[d.cls,getProfile(d)])).values()];
 const classes=[...Object.values(C),...extraClasses];
 for(const d of DRUGS){
  if(d.needsReview)continue; // Name-only imports must not create fabricated pharmacology facts.
  const profile=getProfile(d);
  for(const cat of ['classification','mechanism','indications','contraindications','adverse','interactions','monitoring','pharmacokinetics','populations','toxicity']){
   const id=`fact-${d.id}-${cat}`;let stem,correct,alts=[];
   if(cat==='indications'&&!d.indications.length)continue;
   // Avoid tautological drug-to-class questions when class label contains drug name.
   if(cat==='classification'&&profile.name.toLowerCase().includes(d.name.toLowerCase()))continue;
   if(!['classification','indications'].includes(cat)&&!profile[FIELD_KEY[cat]||cat])continue;
   if(cat==='classification'){
    stem=`Which pharmacologic class best describes ${d.name}?`;correct=profile.name;
    alts=nearClasses(profile,classes.filter(c=>c.id!==d.cls),id,cat).map(c=>({text:c.name,contrastClass:c.id,why:`${c.name} is a different class; ${d.name} belongs to the ${profile.name} class.`}));
   }else if(cat==='indications'){
    stem=`Which is an indication included in PharmCore's teaching profile for ${d.name}?`;
    correct=d.indications[0];
    alts=nearDrugs(d,DRUGS.filter(x=>x.cls!==d.cls&&x.indications[0]&&!x.indications.some(y=>d.indications.some(z=>indicationCollision(y,z)))),id,50).filter((x,i,a)=>a.findIndex(y=>y.indications[0]===x.indications[0])===i).slice(0,3).map(x=>({text:x.indications[0],contrastDrug:x.id,why:`This is listed for ${x.name}; it is not the indication highlighted in ${d.name}'s study profile.`}));
   }else{
    stem=`For ${d.name}, which statement ${FIELD_LABELS[cat]}?`;
    correct=profile[FIELD_KEY[cat]||cat];
    alts=nearClasses(profile,classes.filter(c=>c.id!==d.cls&&c[FIELD_KEY[cat]||cat]&&c[FIELD_KEY[cat]||cat]!==correct&&!ambiguousClinicalAlternative(correct,c[FIELD_KEY[cat]||cat],cat)),id,cat,30).filter((c,i,a)=>a.findIndex(x=>x[FIELD_KEY[cat]||cat]===c[FIELD_KEY[cat]||cat])===i).slice(0,3).map(c=>({text:c[FIELD_KEY[cat]||cat],contrastClass:c.id,why:`This is a teaching point for ${c.name}. The key ${profile.name} concept is: ${correct}`}));
   }
   if(alts.length<3)continue;
   const opts=choicesFromAnswer(id,correct,alts);
   opts.forEach(o=>{if(o.correct)o.why=cat==='indications'?`${correct} is included as a key teaching indication for ${d.name}.`:`Correct. ${cat==='classification'?`${d.name} is a ${profile.name}.`:correct}`;});
   appendQuestion({id,drugId:d.id,category:cat,type:'rapid',specialties:d.specialties,tiers:[d.tier],stem,options:opts,teaching:cat==='indications'?`Other indications in this study record: ${d.indications.join('; ')}.`:cat==='classification'?`Key mechanism: ${profile.mechanism}`:`Class-level fact for ${profile.name}; check product-specific differences.`,source:d.custom?(d.referenceUrl||`https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(d.name)}`):`https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(d.name)}`,sourceLabel:d.custom?'User-supplied, unreviewed notes — verify with a current reference':`Look up current ${d.name} product labeling on DailyMed`});
  }
 }
 for(const c of classes){
  const meds=DRUGS.filter(d=>d.cls===c.id&&!d.needsReview);if(!meds.length)continue;const d=meds[0],id=`reverse-class-${c.id}`;
  // Example: "Mood stabilizer (lithium)" must never prompt an answer of "Lithium".
  if(c.name.toLowerCase().includes(d.name.toLowerCase()))continue;
  const others=nearDrugs(d,DRUGS.filter(x=>x.cls!==c.id),id,45).filter((x,i,a)=>a.findIndex(y=>y.cls===x.cls)===i).slice(0,3);
  const opts=choicesFromAnswer(id,d.name,others.map(x=>({text:x.name,contrastDrug:x.id,why:`${x.name} is classified as ${getProfile(x).name}, not ${c.name}.`})));
  opts.find(o=>o.correct).why=`${d.name} is an example of a ${c.name}.`;
  appendQuestion({id,drugId:d.id,category:'classification',type:'rapid',specialties:d.specialties,tiers:[d.tier],stem:`Which medication is an example of the ${c.name} class?`,options:opts,teaching:`Class mechanism: ${c.mechanism}`,source:'https://dailymed.nlm.nih.gov/dailymed/',sourceLabel:'DailyMed — medication prescribing information'});
 }
 for(const d of DOSING_CASES){const medx=findDrug(d.drug);const id=d.id;
  const choices=shuffleSeeded(d.options.map((text,index)=>({text,correct:index===d.correct,why:d.explain[index]})),id);
  appendQuestion({id,drugId:medx.id,category:'dosing',type:'dosing',specialties:d.specialties,tiers:[medx.tier],stem:d.stem,options:choices,teaching:'Indication, age/weight, route, maximums and organ function determine dosing; never generalize this regimen to other scenarios.',source:d.source,sourceLabel:d.sourceLabel});
 }
 for(const d of CLINICAL_CASES){const medx=findDrug(d.drug);const opts=shuffleSeeded(d.options.map((text,index)=>({text,correct:index===d.correct,why:index===d.correct?d.teaching:(CASE_DISTRACTOR_REASONS[d.id]?.[index]||`This does not address the mechanism in the vignette. ${d.teaching}`)})),d.id);
  appendQuestion({id:d.id,drugId:medx.id,category:'clinical',type:'clinical',specialties:d.specialties,tiers:[medx.tier],stem:d.stem,options:opts,teaching:d.teaching,source:d.source,sourceLabel:d.sourceLabel});
 }
}


// Progressive bedside-style oral board drill. It stays on ONE medication until the
// first miss and generates questions from the existing structured educational record.
// Complex cases are class-level teaching scenarios, NOT individual prescribing advice.
function attendingAltProfiles(d,key,count=3){
 const right=getProfile(d)[key];
 const others=[...Object.values(C),...(state.customDrugs||[]).filter(x=>!C[x.cls]).map(getProfile)].filter(c=>c.id!==d.cls&&c[key]&&c[key]!==right&&!ambiguousClinicalAlternative(right,c[key],key==='caution'?'contraindications':key==='kinetics'?'pharmacokinetics':key));
 const seen=new Set();return nearClasses(getProfile(d),others,`att-${d.id}-${key}`,key,Math.max(count*4,12)).filter(c=>{const x=c[key];if(seen.has(x))return false;seen.add(x);return true;}).slice(0,count);
}
function makeAttendingQ(d,stage,category,stem,answer,altValues,teaching,sourceSuffix=''){ 
 const id=`attend-${d.id}-${stage.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
 const alts=altValues.slice(0,3).map(x=>({text:x.text,why:x.why,contrastClass:x.cls||null}));
 if(!answer||alts.length<3||new Set([answer,...alts.map(x=>x.text)]).size<4)return null;
 const opts=choicesFromAnswer(id,answer,alts);
 opts.forEach(o=>{if(o.correct)o.why=teaching;});
 const q={id,drugId:d.id,category,type:category==='clinical'?'clinical':'rapid',specialties:d.specialties,tiers:[d.tier],attendingStage:stage,stem,options:opts,teaching,source:d.referenceUrl||`https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(d.name)}`,sourceLabel:d.custom?'Custom user-authored profile — independently verify':'DailyMed — verify current drug labeling',unreviewed:d.custom};
 deepenQuestion(q);qIndex[id]=q;return q;
}
function makeAttendingPair(d,stage,category,stem,key,teaching){
 const answer=getProfile(d)[key];
 if(!answer)return null;
 const others=attendingAltProfiles(d,key);
 return makeAttendingQ(d,stage,category,stem,answer,others.map(x=>({text:x[key],why:`This describes ${x.name}, not the recorded ${getProfile(d).name} teaching concept.`,cls:x.id})),teaching||`For ${d.name} (${getProfile(d).name}): ${answer}`);
}
function createAttendingSequence(drugId){
 const d=findDrug(drugId);if(!d)return [];
 const p=getProfile(d),ind=d.indications[0]||'the stated treatment indication';
 const out=[];const add=q=>{if(q)out.push(q.id)};
 // Level 1–3: names/classes and exact pharmacologic molecular basis.
 const clsQ=qIndex[`fact-${d.id}-classification`];if(clsQ){const q={...clsQ,id:`attend-${d.id}-01-recognition`,attendingStage:'Recognition',options:clsQ.options.map(o=>({...o}))};qIndex[q.id]=q;add(q);}
 add(makeAttendingPair(d,'Molecular mechanism','mechanism',`You are asked about ${d.name} on rounds. Which molecular action most accurately explains its pharmacology?`,'mechanism',`Mechanism: ${p.mechanism||'Not entered'}. Target context: ${pathwayFor(d)}`));
 const indOpts=nearDrugs(d,DRUGS.filter(x=>x.cls!==d.cls&&!x.indications.some(y=>d.indications.some(z=>indicationCollision(y,z)))&&x.indications[0]),`att-ind-${d.id}`,45).filter((x,i,a)=>a.findIndex(y=>y.indications[0]===x.indications[0])===i).slice(0,3);
 if(d.indications.length&&indOpts.length===3)add(makeAttendingQ(d,'Therapeutic role','indications',`In which of these settings would ${d.name} have a recognized therapeutic role?`,ind,indOpts.map(x=>({text:x.indications[0],why:`${x.indications[0]} is a teaching indication for ${x.name}. It is not the targeted use listed here.`,cls:x.cls})),`A relevant therapeutic use of ${d.name} is ${ind}. Its action: ${p.mechanism}`));
 add(makeAttendingPair(d,'Recognizing adverse effects','adverse',`A patient receiving ${d.name} reports a new symptom after starting therapy. Which adverse-effect pattern should be considered in the medication assessment?`,'adverse',`Recognize adverse effects of ${d.name}: ${p.adverse}. Mechanistic connection: ${pathwayFor(d)}`));
 add(makeAttendingPair(d,'Pre-treatment safety','contraindications',`You are considering ${d.name} for a patient with ${ind}. Which history or clinical condition most deserves review BEFORE starting therapy?`,'caution',`Safety review for ${d.name}: ${p.caution}. Distinguish a contraindication from a precaution by current labeling.`));
 add(makeAttendingPair(d,'Medication reconciliation','interactions',`The patient taking ${d.name} starts an additional medication. Which interaction pattern is most important to anticipate?`,'interactions',`For ${d.name}, review: ${p.interactions}. The interaction may be pharmacokinetic or pharmacodynamic.`));
 add(makeAttendingPair(d,'Follow-up plan','monitoring',`During follow-up for a patient using ${d.name} for ${ind}, which monitoring approach best fits its pharmacology and risks?`,'monitoring',`Monitoring for ${d.name}: ${p.monitoring}. Link this to the expected physiology and potential toxicity.`));
 add(makeAttendingPair(d,'Disposition and formulation','pharmacokinetics',`A patient using ${d.name} has a change in organ function or formulation. Which pharmacokinetic teaching point would guide your assessment?`,'kinetics',`Pharmacokinetic context for ${d.name}: ${p.kinetics}`));
 add(makeAttendingPair(d,'Special-population decision','populations',`You are modifying a medication plan involving ${d.name} for a patient with a complicating age, pregnancy, or organ-function issue. Which consideration is relevant?`,'populations',`Special-population issue for ${d.name}: ${p.populations}`));
 add(makeAttendingPair(d,'Recognizing toxicity','toxicity',`A patient taking ${d.name} is now being evaluated for possible drug toxicity. Which severe complication or response principle is most relevant to this medication?`,'toxicity',`Toxicity principle for ${d.name}: ${p.toxicity}. Re-evaluate the patient's clinical stability before selecting treatment.`));
 // Final integrative level: a mechanistic explanation AND a follow-up safety decision.
 if(p.mechanism&&p.monitoring){
  const answer=`Action: ${p.mechanism} Monitoring: ${p.monitoring}`;
  const alts=attendingAltProfiles(d,'monitoring',5).filter(x=>x.mechanism&&x.monitoring).slice(0,3).map(x=>({text:`Action: ${x.mechanism} Monitoring: ${x.monitoring}`,why:`This pair describes the ${x.name} class, not ${p.name}.`,cls:x.id}));
  add(makeAttendingQ(d,'Integrated clinical reasoning','clinical',`An attending asks you to justify using ${d.name} for ${ind} and to outline follow-up. Which paired explanation best connects its molecular mechanism to a sensible monitoring plan?`,answer,alts,`Integrate mechanism and follow-up for ${d.name}: ${answer}`));
 }
 return out;
}
function renderAttending(){
 const term=attendingSearch.trim().toLowerCase(),list=DRUGS.filter(d=>(attendingFilter==='all'||d.specialties.includes(state.prefs.rotation))&&(!term||d.name.toLowerCase().includes(term)||getProfile(d).name.toLowerCase().includes(term))).sort((a,b)=>a.tier-b.tier||a.name.localeCompare(b.name));
 const html=list.slice(0,40).map(d=>`<div class="attending-drug-row"><div class="attending-drug-info"><strong>${esc(d.name)}</strong><span class="small subtle">${esc(getProfile(d).name)} · Tier ${d.tier}${d.custom?' · Custom':''}</span></div><button class="btn small" data-action="attend-drug" data-id="${esc(d.id)}">Start drill ${ic('arrow','sm')}</button></div>`).join('');
 return `${pageTitle('CLINICAL ROUNDS','Attending drill','Choose one medication. The questions start with basic recognition and progress toward molecular mechanisms, safety, monitoring, special populations, and integrated clinical decisions. One wrong answer ends the round.')}
 <div class="card attending-guide"><div class="guide-number">01</div><div><h2>How the drill works</h2><p>One drug throughout · up to 11 progressively structured levels · detailed feedback after every answer · immediate stop on the first incorrect answer. Correct answers advance only when you select “Next challenge.”</p><p class="fineprint">Higher levels use synthesized class-level patient-care scenarios, not individually validated clinical orders. Incomplete custom drug profiles may yield fewer levels.</p></div></div>
 <section class="card"><div class="panel-title"><h2>Choose a medication</h2><span class="tag">${list.length} matches</span></div><div class="toolbar"><label class="search-wrap">${ic('search')}<input id="attending-search" aria-label="Search a drug to drill" placeholder="Search medication or class…" value="${esc(attendingSearch)}" autocomplete="off"></label><select id="attending-filter" class="form-select" aria-label="Rotation filter"><option value="current" ${attendingFilter==='current'?'selected':''}>Current rotation · ${esc(sname(state.prefs.rotation))}</option><option value="all" ${attendingFilter==='all'?'selected':''}>All specialties</option></select></div><div id="attending-drugs">${html||'<p class="subtle">No matching medications.</p>'}</div><div class="fineprint">Showing up to 40 results. Search by name to find any drug in the library, including your own additions.</div></section>`;
}
function refreshAttendingDrugList(){const host=$('#attending-drugs');if(!host)return;const focused=document.activeElement;const cursor=focused?.selectionStart;const s=attendingSearch;host.innerHTML=DRUGS.filter(d=>(attendingFilter==='all'||d.specialties.includes(state.prefs.rotation))&&(!s||d.name.toLowerCase().includes(s.toLowerCase())||getProfile(d).name.toLowerCase().includes(s.toLowerCase()))).sort((a,b)=>a.tier-b.tier||a.name.localeCompare(b.name)).slice(0,40).map(d=>`<div class="attending-drug-row"><div class="attending-drug-info"><strong>${esc(d.name)}</strong><span class="small subtle">${esc(getProfile(d).name)} · Tier ${d.tier}</span></div><button class="btn small" data-action="attend-drug" data-id="${esc(d.id)}">Start drill ${ic('arrow','sm')}</button></div>`).join('')||'<p class="subtle">No matching medications.</p>';}
function startAttending(drugId){
 const d=findDrug(drugId);if(!d){toast('Select an available drug.');return;}
 const qids=createAttendingSequence(drugId);if(!qids.length){toast('This drug needs more information before it can be drilled.');return;}
 state.session={qids,idx:0,answers:[],exam:false,review:false,attending:true,drugId,stopped:false,ended:false,started:now()};selectedDrug=null;persist();go('session');
}
function renderAttendingStop(){
 const s=state.session,q=qIndex[s.qids[s.idx]],ans=s.answers[s.idx],d=findDrug(s.drugId),choice=q.options[ans.chosen],correct=q.options.find(x=>x.correct);
 return `${pageTitle('ATTENDING DRILL · STOPPED','First miss ends the round',`You reached level ${s.idx+1} of ${s.qids.length} on ${d?.name||'this medication'}. Review the answer, then start a new drill when you are ready.`)}
 <div class="card attending-stop"><div class="negative strong">${ic('alert','sm')} Level ${s.idx+1} · ${esc(q.attendingStage||'Challenge')}</div><h2>${highlightTerms(q.stem)}</h2><div class="callout warn"><strong>Your answer:</strong> ${esc(choice?.text||'')}<div style="margin-top:8px"><strong>Correct answer:</strong> ${esc(correct?.text||'')}</div></div><p>${highlightTerms(q.teaching)}</p>${deepDiveHtml(q)}<div class="explain-list">${q.options.map((o,i)=>`<div class="explain-item ${o.correct?'correct':''}"><strong>${'ABCD'[i]}.</strong><span>${highlightTerms(o.why,{limit:14})}</span></div>`).join('')}</div><div class="divider"></div><p class="subtle small">${s.idx} consecutive correct · stopped immediately after your first incorrect answer. The attempt and review schedule are saved locally.</p><div class="row" style="flex-wrap:wrap"><button class="btn" data-action="attend-drug" data-id="${esc(s.drugId)}">Retry this drug</button><button class="btn ghost" data-action="attend-results">See full drill review</button><button class="btn ghost" data-action="nav" data-view="attending">Choose another drug</button></div></div>`;
}

function selectQuestions(opts){
 const cats=opts.mode==='dosing'?['dosing']:opts.mode==='clinical'?['clinical']:opts.mode==='rapid'?opts.categories.filter(c=>c!=='dosing'&&c!=='clinical'):opts.categories;
 let q=QUESTIONS.filter(q=>cats.includes(q.category)&&isInQuizScope(q,opts));
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
 if(opts.drugIds?.length){
  // One question per quizable imported medication first, then distribute the rest.
  const first=[],used=new Set();for(const id of opts.drugIds){const q=spaced.find(x=>x.drugId===id);if(q){first.push(q);used.add(q.id);}}
  spaced=[...first,...spaced.filter(q=>!used.has(q.id))];
 }
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
      ${navButton('attending','Attending drill','stethoscope')}
      ${navButton('library','Drug library','pill')}
      ${navButton('review','Due for review','clock',dueReviews()?dueReviews():'')}
      ${navButton('analytics','My progress','chart')}
      ${navButton('settings','Data & settings','settings')}
    </nav>
    <div class="side-block"><div class="section-caption" style="margin-left:0">Current rotation</div><select class="side-select" id="rotation-select" aria-label="Select your rotation">${SPECIALTIES.map(([k,n])=>`<option value="${k}" ${k===rotation?'selected':''}>${esc(n)}</option>`).join('')}</select><div class="side-help">Your rotation changes the dashboard and default quiz focus. Other specialties stay available.</div></div>
    <div class="side-footer"><div class="side-footer-title">${ic('database','sm')} ${esc(storage.type)} · Local only</div><p>Study history stays on this device until you export it. No account required.</p><button data-action="export">${ic('download','sm')} Export backup</button></div>
  </aside>
  <div class="main-frame">
   <header class="topbar"><div class="row"><button class="mobile-toggle" data-action="mobile" aria-label="Toggle navigation">${ic('menu')}</button><div class="crumb">${ic('layers','sm')} PharmCore ${ic('chevron','sm')} <span>${({dashboard:'Overview',practice:'Quiz builder',attending:'Attending drill',library:'Drug library',review:'Reviews',analytics:'Progress',settings:'Settings',session:'Study session',results:'Quiz results'})[view]||'Overview'}</span></div></div>
    <div class="top-actions"><button class="search-top" data-action="nav" data-view="library">${ic('search','sm')} Search medications…</button><button class="top-due" data-action="nav" data-view="review">${ic('clock','sm')} ${dueReviews()} due</button></div>
   </header>
   <main class="main-content" id="content">${content}<div class="footer-note">PharmCore ${PHARMCORE_VERSION} · Educational seed content · Not for point-of-care prescribing · No patient identifiers</div></main>
  </div>
 </div>${selectedDrug?renderDrugModal():''}${importCandidate?renderImportModal():''}${drugListCandidate?renderDrugListModal():''}${drugEditor!==null?renderDrugEditor():''}${selectedTerm?renderTermModal():''}`;
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
const QUIZ_LIST_CACHE=new WeakMap();
function drugScopeSet(ids){if(!ids?.length)return null;if(!QUIZ_LIST_CACHE.has(ids))QUIZ_LIST_CACHE.set(ids,new Set(ids));return QUIZ_LIST_CACHE.get(ids);}
function isInQuizScope(q,opts){
 const selected=drugScopeSet(opts.drugIds);
 // When using an imported list, the explicit drug choices supersede specialty and tier restrictions.
 return selected?selected.has(q.drugId):q.specialties.some(s=>opts.specialties.includes(s))&&opts.tiers.some(t=>q.tiers.includes(t));
}
function questionMatchesMode(q,opts){return opts.mode==='dosing'?q.category==='dosing':opts.mode==='clinical'?q.category==='clinical':opts.mode==='rapid'?q.type==='rapid'&&opts.categories.includes(q.category):opts.categories.includes(q.category);}
function availableForConfig(){const seen=config.priority==='new'?new Set(state.attempts.map(a=>a.qid)):null;return QUESTIONS.filter(q=>questionMatchesMode(q,config)&&isInQuizScope(q,config)&&(!seen||!seen.has(q.id))).length;}
function quizListSummary(){if(!config.drugIds?.length)return null;
 const selected=drugScopeSet(config.drugIds);const eligible=new Set(QUESTIONS.filter(q=>questionMatchesMode(q,config)&&selected.has(q.drugId)).map(q=>q.drugId));
 return {total:config.drugIds.length,eligible:eligible.size,needsInfo:config.drugIds.filter(id=>findDrug(id)?.needsReview).length};
}
function renderCheck(value,label,selected,group){return `<label class="checklabel ${selected?'checked':''}"><input type="checkbox" data-config-group="${group}" value="${esc(value)}" ${selected?'checked':''}/><span>${esc(label)}</span></label>`}
function choicesButtonGroup(name,entries,selected){return `<div class="button-group">${entries.map(([key,label])=>`<button class="chip ${selected===key?'active':''}" data-action="config-single" data-name="${name}" data-value="${esc(key)}">${esc(label)}</button>`).join('')}</div>`}
function renderPractice(){const available=availableForConfig(),total=available?(config.length?Math.min(config.length,available):available):0,importStats=quizListSummary();
 return `${pageTitle('PRACTICE STUDIO','Build your next quiz','Select multiple specialties and pharmacology dimensions. Choose how you want to practice, and PharmCore will assemble a question set from the curated starter library.')}
 <div class="card attending-promo"><div><span class="eyebrow">NEW · CLINICAL ROUNDS</span><h2>Attending drill · one drug, increasing difficulty</h2><p class="small subtle">Recognition → molecular action → adverse effects → contraindications → patient safety → integrated clinical decisions. First incorrect answer ends the round.</p></div><button class="btn" data-action="nav" data-view="attending">Choose a drug ${ic('arrow','sm')}</button></div>
 <div class="config-columns"><div class="builder-main">
  <section class="card druglist-import-card"><div class="between" style="gap:12px;align-items:center;flex-wrap:wrap"><div><div class="control-label">0. Import a drug list for this quiz</div><p class="small subtle" style="margin:5px 0">Upload JSON containing names or medication objects. Matching drugs use the existing library; new entries are saved locally.</p></div><div class="row" style="flex-wrap:wrap"><button class="btn small" data-action="quiz-import-list">${ic('upload','sm')} Import JSON</button>${config.drugIds?.length?`<button class="btn ghost small" data-action="quiz-clear-list">Clear list</button>`:''}</div></div>
  <input id="quiz-import-file" type="file" accept=".json,application/json" style="display:none">
  ${importStats?`<div class="import-scope"><strong>${importStats.total} medications selected</strong> · ${importStats.eligible} with questions in the chosen format${importStats.needsInfo?` · <b>${importStats.needsInfo} need pharmacology details</b>`:''}<p class="fineprint" style="margin:6px 0 0">Imported list ONLY: the specialty and tier filters below are ignored while this list is active. Questions still follow your selected knowledge dimensions, format and length. Name-only new drugs are added to the library but cannot generate pharmacology questions until you edit their profile.</p><details style="margin-top:8px"><summary>View imported drug list</summary><div class="import-chip-list">${config.drugIds.slice(0,300).map(id=>`<span class="tag ${findDrug(id)?.needsReview?'t3':''}">${esc(findDrug(id)?.name||'Unavailable')}</span>`).join('')}</div></details></div>`:'<div class="fineprint">No import active. Standard specialty and tier filters apply.</div>'}
  </section>
  <section class="card"><div class="field-label-line"><div class="control-label">1. Specialties</div><div class="row"><button class="text-button" data-action="toggle-all" data-name="specialties" data-value="all">All</button><span class="subtle tiny">·</span><button class="text-button" data-action="toggle-all" data-name="specialties" data-value="none">Clear</button></div></div><div class="checkgrid">${SPECIALTIES.map(([id,name])=>renderCheck(id,name,config.specialties.includes(id),'specialties')).join('')}</div></section>
  <section class="card"><div class="field-label-line"><div class="control-label">2. Knowledge dimensions</div><div class="row"><button class="text-button" data-action="toggle-all" data-name="categories" data-value="all">All</button><span class="subtle tiny">·</span><button class="text-button" data-action="toggle-all" data-name="categories" data-value="none">Clear</button></div></div><div class="checkgrid">${CATEGORIES.map(([id,name])=>renderCheck(id,name,config.categories.includes(id),'categories')).join('')}</div><p class="fineprint" style="margin:13px 0 0">Dosing currently includes ${availableCountByCategory('dosing')} source-linked scenario questions; clinical decision-making includes ${availableCountByCategory('clinical')} authored vignettes. Most other questions are built from class-level study facts.</p></section>
  <section class="card"><div class="control-label">3. Medication importance</div><div class="pillrow">${[[1,'Tier 1 · Essential'],[2,'Tier 2 · Important'],[3,'Tier 3 · Recognition']].map(([i,label])=>`<label class="checklabel ${config.tiers.includes(i)?'checked':''}"><input type="checkbox" data-config-group="tiers" value="${i}" ${config.tiers.includes(i)?'checked':''}>${label}</label>`).join('')}</div></section>
 </div><div class="builder-side">
  <section class="card"><div class="control-label">4. Question format</div><div class="stack">${[['mixed','Mixed — selected dimensions'],['rapid','Rapid recall — knowledge facts'],['clinical','Clinical vignettes'],['dosing','Dosing & prescribing']].map(([key,label])=>`<label class="checklabel ${config.mode===key?'checked':''}"><input type="radio" name="quiz-mode" value="${key}" ${config.mode===key?'checked':''}>${label}</label>`).join('')}</div></section>
  <section class="card"><div class="control-label">5. Question prioritization</div>${choicesButtonGroup('priority',[['adaptive','Adaptive'],['highyield','High yield'],['new','New only'],['random','Random']],config.priority)}<div class="divider"></div><div class="control-label">6. Length</div>${choicesButtonGroup('length',[[10,'10'],[20,'20'],[40,'40'],[0,'All']],config.length)}<div class="divider"></div><div class="control-label">7. Feedback style</div>${choicesButtonGroup('exam',[[false,'Practice · instant feedback'],[true,'Exam · results at end']],config.exam)}</section>
  <section class="card" style="background:#eef9f4;border-color:#d6ebdf"><div class="eyebrow">YOUR QUIZ</div><h2 style="margin:0 0 5px">${total} questions ready</h2><p class="small" style="color:#49766a">${importStats?`${importStats.total} imported medications`:`${config.specialties.length} specialties`} · ${config.mode==='clinical'||config.mode==='dosing'?1:config.categories.length} dimensions · ${config.exam?'Exam':'Instant feedback'}</p><div class="fineprint" style="margin-bottom:15px">${available===0?'No questions match these filters. If imported drugs are unclassified, edit them in the Drug Library or choose additional knowledge categories.':'You can change selections and regenerate a new session anytime.'}</div><button class="btn full" data-action="start-config" ${total===0?'disabled':''}>Start this quiz ${ic('arrow','sm')}</button></section>
 </div></div>`;
}
function renderSession(){const session=state.session;if(!session||!session.qids?.length)return `${pageTitle('STUDY SESSION','No quiz in progress')}<button class="btn" data-action="nav" data-view="practice">Create a quiz</button>`;
 if(session.attending&&session.stopped)return renderAttendingStop();
 if(session.ended||session.idx>=session.qids.length)return renderResults();
 const q=qIndex[session.qids[session.idx]];if(!q)return `<div class="banner">This saved question is no longer available. Return to the quiz builder.</div>`;
 const answered=session.answers[session.idx],n=session.qids.length,index=session.idx;
 const explanations=answered&&!session.exam?`<div class="feedback-card ${answered.correct?'':'wrong'}"><div class="feedback-head ${answered.correct?'positive':'negative'}">${ic(answered.correct?'check':'alert','sm')} ${answered.correct?'Correct answer':'Not quite — review the reasoning'}</div><div class="small" style="color:#496576">${highlightTerms(q.teaching||'Review the explanation for each option.')}</div>${deepDiveHtml(q)}<div class="explain-list">${q.options.map((o,i)=>`<div class="explain-item ${o.correct?'correct':''}"><strong>${'ABCD'[i]}.</strong><span>${highlightTerms(o.why,{limit:14})}</span></div>`).join('')}</div><div class="fineprint" style="margin-top:12px">Source: <a href="${esc(q.source)}" target="_blank" rel="noopener noreferrer">${esc(q.sourceLabel)} ${ic('external','sm')}</a></div></div>`:'';
 return `<div class="quiz-topbar"><div class="row"><button class="btn ghost small" data-action="quit-quiz">${ic('close','sm')} Exit quiz</button><span class="rotate-badge">${esc(session.attending?`Rounds · ${findDrug(session.drugId)?.name||'Drug'}`:session.exam?'Exam mode':'Practice mode')}</span></div><div class="small strong monospace">Question ${index+1} of ${n}</div></div>
 <section class="card question-card"><div class="quiz-progress"><div style="width:${Math.round(index/n*100)}%"></div></div><div class="quiz-kicker"><span class="tag t1">${esc(cname(q.category))}</span><span class="tag">${session.attending?esc(`Level ${index+1} · ${q.attendingStage||'Challenge'}`):'No hints · recall first'}</span><span class="tag">${session.attending?'Attending drill':q.type==='rapid'?'Rapid recall':q.type==='dosing'?'Dosing scenario':'Clinical vignette'}</span></div>
 <h2 class="question-title">${highlightTerms(q.stem)}</h2><div class="options">${q.options.map((o,i)=>`<button class="option ${answered&&!session.exam?(o.correct?'correct':i===answered.chosen?'incorrect':'dim'):''}" data-action="answer" data-index="${i}" ${answered?'disabled':''}><span class="opt-letter">${'ABCD'[i]}</span><span>${esc(o.text)}</span></button>`).join('')}</div>
 ${answered&&session.exam?`<div class="callout" style="margin-top:16px">${ic('check','sm')} Answer saved. Feedback and explanations will appear at the end of the exam.</div>`:''}
 ${explanations}
 ${answered&&!session.exam&&!session.attending?`<div class="confidence"><div class="control-label">How well did you know this?</div><div class="small subtle">Your choice adjusts when this drug–concept pair is reviewed again.</div><div class="button-group">${[['again','Again'],['hard','Hard'],['good','Good'],['easy','Easy']].map(([id,label])=>`<button class="chip ${answered.confidence===id?'active':''}" data-action="confidence" data-value="${id}">${label}</button>`).join('')}</div></div>`:''}
 </section><div class="quiz-bottom"><div class="fineprint">${session.attending?'Keep going until your first miss. All answers and explanations are saved.':session.exam?'Your answers are saved locally; detailed review comes after submission.':'Practice questions show feedback immediately. Press 1–4 to select an answer.'}</div>${answered?`<button class="btn" data-action="next-question">${session.attending?(index===n-1?'Finish rounds':'Next challenge'):(index===n-1?'Finish quiz':'Next question')} ${ic('arrow','sm')}</button>`:''}</div>`;
}
function renderResults(){const ss=state.session;if(!ss)return '';const ans=ss.answers.filter(Boolean),correct=ans.filter(a=>a.correct).length;
 return `${pageTitle('SESSION COMPLETE','Quiz results','Every answer is stored locally; review the rationales below to reinforce difficult concepts.')}
 <div class="card result-card"><div class="between" style="flex-wrap:wrap"><div><div class="eyebrow">YOUR SCORE</div><div class="result-big monospace">${ans.length?Math.round(correct/ans.length*100):0}%</div><div class="small subtle">${ss.attending?`${correct} consecutive correct · ${ss.stopped?'Stopped at first miss':`Cleared ${ss.qids.length} levels`}`:`${correct} correct out of ${ans.length} questions · ${ss.exam?'Exam':'Practice'} mode`}</div></div><div class="iconbox" style="width:75px;height:75px;border-radius:21px">${ic('chart','lg')}</div></div>
 <div class="divider"></div><div class="row" style="flex-wrap:wrap">${ss.attending?`<button class="btn" data-action="attend-drug" data-id="${esc(ss.drugId)}">Retry this drug ${ic('arrow','sm')}</button><button class="btn ghost" data-action="nav" data-view="attending">Choose another drug</button>`:`<button class="btn" data-action="nav" data-view="practice">Build another quiz ${ic('arrow','sm')}</button>`}<button class="btn ghost" data-action="start-reviews">Review due concepts</button><button class="btn ghost" data-action="export">Export progress</button></div>
 <div class="divider"></div><h2>Question-by-question review</h2>
 ${ss.qids.map((id,i)=>{const q=qIndex[id],a=ss.answers[i];if(!q||!a)return '';return `<details class="review-answer"><summary><span class="${a.correct?'positive':'negative'}">${a.correct?'✓':'✕'}</span> ${i+1}. ${esc(q.stem.slice(0,115))}${q.stem.length>115?'…':''}</summary><div class="small subtle" style="margin:8px 0">${esc(cname(q.category))} · ${esc(findDrug(q.drugId)?.name||'')}</div>${q.options.map(o=>`<div class="optionline ${o.correct?'good':''}">${o.correct?'✓ ':'• '}${esc(o.text)}${o.correct?' — correct':''}</div>`).join('')}<p>${esc(q.teaching)}</p>${deepDiveHtml(q)}<div class="explain-list">${q.options.map((o,i)=>`<div class="explain-item ${o.correct?'correct':''}"><strong>${'ABCD'[i]}.</strong><span>${highlightTerms(o.why,{limit:14})}</span></div>`).join('')}</div><p class="fineprint">Reference: <a href="${esc(q.source)}" target="_blank" rel="noopener noreferrer">${esc(q.sourceLabel)}</a></p></details>`}).join('')}
 </div>`;
}
function libraryMatches(d){const str=libraryFilter.search.trim().toLowerCase();return (!str||d.name.toLowerCase().includes(str)||getProfile(d).name.toLowerCase().includes(str)||d.indications.join(' ').toLowerCase().includes(str))&&(libraryFilter.specialty==='all'||d.specialties.includes(libraryFilter.specialty))&&(libraryFilter.tier==='all'||d.tier===Number(libraryFilter.tier))&&(!libraryFilter.saved||state.bookmarks.includes(d.id))&&(!libraryFilter.custom||d.custom);}
function renderDrugCard(d){const count=state.attempts.filter(a=>a.drugId===d.id).length,mastery=getDrugMastery(d),saved=state.bookmarks.includes(d.id);
 return `<div class="drug-card"><div class="between"><div class="tagrow"><span class="tag t${d.tier}">Tier ${d.tier}</span>${d.custom?'<span class="tag">My addition</span>':''}${d.needsReview?'<span class="tag t3">Needs details</span>':''}${state.encounters[d.id]?`<span class="tag t1">Seen in clinic</span>`:''}</div><button class="heart-btn ${saved?'active':''}" data-action="bookmark" data-id="${d.id}" aria-label="${saved?'Remove bookmark for':'Bookmark'} ${esc(d.name)}" title="Bookmark">${ic('heart','sm')}</button></div><h3>${esc(d.name)}</h3><div class="drug-class">${esc(getProfile(d).name)}</div><div class="indication">${esc(d.indications.slice(0,2).join(' · '))}</div><footer><span class="small subtle">${count?`${count} answers · ${mastery??0}% concept accuracy`:'Not yet studied'}</span><button class="text-button" data-action="drug" data-id="${d.id}">View profile ${ic('arrow','sm')}</button></footer></div>`;
}
function renderLibrary(){const matched=DRUGS.filter(libraryMatches).sort((a,b)=>a.tier-b.tier||a.name.localeCompare(b.name));
 return `${pageTitle('EXPLORE MEDICATIONS','Your drug library',`${DRUGS.length} essential, important and recognition-level medications, organized by rotation and pharmacology class.`, `<button class="btn ghost" data-action="export">${ic('download','sm')} Backup</button><button class="btn" data-action="add-drug">${ic('pill','sm')} + Add drug</button>`)}
 <div class="toolbar"><label class="search-wrap">${ic('search')}<input id="drug-search" aria-label="Search medications" placeholder="Search drug, class or indication…" value="${esc(libraryFilter.search)}" autocomplete="off"></label>
 <select class="form-select" id="library-specialty" aria-label="Filter by specialty"><option value="all">All specialties</option>${SPECIALTIES.map(([id,label])=>`<option value="${id}" ${libraryFilter.specialty===id?'selected':''}>${esc(label)}</option>`).join('')}</select>
 <select class="form-select" id="library-tier" aria-label="Filter by importance"><option value="all">All priorities</option>${[1,2,3].map(i=>`<option value="${i}" ${String(libraryFilter.tier)===String(i)?'selected':''}>Tier ${i}</option>`).join('')}</select>
 <button class="btn ${libraryFilter.saved?'soft':'ghost'}" data-action="toggle-bookmarks">${ic('heart','sm')} Saved only</button><button class="btn ${libraryFilter.custom?'soft':'ghost'}" data-action="toggle-custom">My additions (${state.customDrugs.length})</button></div>
 <div class="between" style="margin-bottom:14px"><span class="small subtle" id="library-count">${matched.length} medications</span><span class="fineprint">Profiles are class-level learning summaries. Check linked prescribing labels before clinical use.</span></div>
 <div class="drug-grid" id="drug-grid">${matched.length?matched.map(renderDrugCard).join(''):`<div class="empty" style="grid-column:1/-1">${ic('search')}<h3>No medications found</h3><p>Try changing your search or filters.</p></div>`}</div>`;
}
function refreshLibraryGrid(){const grid=$('#drug-grid');if(!grid)return;const matched=DRUGS.filter(libraryMatches).sort((a,b)=>a.tier-b.tier||a.name.localeCompare(b.name));grid.innerHTML=matched.length?matched.map(renderDrugCard).join(''):`<div class="empty" style="grid-column:1/-1">${ic('search')}<h3>No medications found</h3><p>Try changing your search or filters.</p></div>`;$('#library-count').textContent=`${matched.length} medications`;}
function renderDrugModal(){const d=findDrug(selectedDrug);if(!d)return '';const p=getProfile(d),saved=state.bookmarks.includes(d.id),enc=state.encounters[d.id];
 const fields=[['Mechanism',p.mechanism],['Indications',d.indications.join('; ')],['Contraindications & precautions',p.caution],['Adverse effects',p.adverse],['Interactions',p.interactions],['Monitoring',p.monitoring],['Pharmacokinetics',p.kinetics],['Special populations',p.populations],['Toxicity & reversal',p.toxicity]];
 return `<div class="modal-backdrop" id="drug-overlay"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(d.name)} medication profile"><div class="modal-head"><div><div class="eyebrow">TIER ${d.tier} · ${esc(p.name)}</div><h2>${esc(d.name)}</h2><p class="small subtle">${esc(d.specialties.map(sname).join(' · '))}</p></div><button class="close" data-action="close-modal" aria-label="Close">${ic('close')}</button></div>
 <div class="pillrow" style="margin-bottom:17px"><button class="btn ${saved?'soft':'ghost'} small" data-action="bookmark" data-id="${d.id}">${ic('heart','sm')} ${saved?'Bookmarked':'Bookmark drug'}</button><button class="btn ${enc?'soft':'ghost'} small" data-action="encounter" data-id="${d.id}">${ic('stethoscope','sm')} ${enc?'Seen on rotation ✓':'Mark seen on rotation'}</button><button class="btn small" data-action="practice-drug" data-id="${d.id}">Practice this drug ${ic('arrow','sm')}</button><button class="btn soft small" data-action="attend-drug" data-id="${d.id}">${ic('stethoscope','sm')} Attending drill</button>${d.custom?`<button class="btn ghost small" data-action="edit-drug" data-id="${d.id}">Edit my drug</button>`:''}</div>
 ${d.custom?`<div class="callout warn" style="margin-bottom:14px">${ic('info','sm')} User-supplied, unreviewed study information. Custom dosing notes are reference-only and do not generate dosing quiz items.</div>`:''}${d.tag?`<div class="callout warn" style="margin-bottom:14px">${ic('info','sm')} ${esc(d.tag)}</div>`:''}
 <div class="profile-deep">${deepDiveHtml({deepDive:{mechanism:pathwayFor(d),clinical:`Key monitored risks: ${p.adverse||'Review the profile.'} Main precautions: ${p.caution||'Review current labeling.'}`,naming:namingExplanation(d)}})}</div><div class="detail-grid"><div class="detail-field"><div class="label">Classification</div><p>${esc(p.name)}</p></div>${fields.map(([k,val])=>`<div class="detail-field"><div class="label">${esc(k)}</div><p>${highlightTerms(val||'Not entered for this class.')}</p></div>`).join('')}<div class="detail-field"><div class="label">Dosing & administration</div><p>${d.custom&&d.details?.dosing?esc(d.details.dosing):'Indication-, patient-, formulation- and route-specific. Use source-linked dosing cases when available and consult current labeling for prescriptions.'}</p></div></div>
 <div class="setting-block"><h3>Personal learning note</h3><p>Save a reminder about what you want to learn. Do not include any protected patient information.</p><textarea id="note-input" class="form-textarea" maxlength="3000" placeholder="E.g., I want to review why this medication is held before surgery…">${esc(state.notes[d.id]||'')}</textarea><div style="margin-top:9px"><button class="btn small" data-action="save-note" data-id="${d.id}">Save note</button></div></div>
 <div class="banner white">${ic('info','sm')} These are concise study notes, not validated individualized treatment advice. <a href="${esc(d.custom&&d.referenceUrl?d.referenceUrl:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(d.name)}`)}" target="_blank" rel="noopener noreferrer">Check current labeling for ${esc(d.name)} ${ic('external','sm')}</a></div></div></div>`;
}
// User-authored pharmacology information is local-only and not independently verified.
function safeReferenceUrl(raw){
 if(!raw)return '';
 try{const u=new URL(String(raw));return ['https:','http:'].includes(u.protocol)?u.href.slice(0,600):'';}catch{return '';}
}
function normalizeCustomDrug(src){
 if(!src||typeof src!=='object'||!/^custom-[a-z0-9-]{6,80}$/.test(String(src.id||'')))return null;
 const text=(val,max=3000)=>typeof val==='string'?val.trim().slice(0,max):'';
 const name=text(src.name,100),className=text(src.className,120);
 const cls=text(src.cls,100);
 if(!name||!(C[cls]||cls.startsWith('user-')))return null;
 if(!C[cls]&&!className)return null;
 const specialties=Array.isArray(src.specialties)?[...new Set(src.specialties.filter(v=>SPECIALTIES.some(x=>x[0]===v)))]:[];
 if(!specialties.length)return null;
 const details={};for(const key of [...profileFields,'dosing','naming'])details[key]=text(src.details?.[key]);
 const indications=Array.isArray(src.indications)?src.indications.map(x=>text(x,180)).filter(Boolean).slice(0,15):[];
 return {id:src.id,name,cls,className:C[cls]?'':className,indications,specialties,tier:[1,2,3].includes(Number(src.tier))?Number(src.tier):2,tag:text(src.tag,600),details,referenceUrl:safeReferenceUrl(src.referenceUrl),custom:true,needsReview:src.needsReview===true||cls==='user-unclassified',importedFromList:src.importedFromList===true,createdAt:Number(src.createdAt)||now(),updatedAt:Number(src.updatedAt)||now()};
}
function renderDrugEditor(){
 const d=drugEditor==='new'?null:findDrug(drugEditor);
 if(drugEditor!=='new'&&(!d||!d.custom))return '';
 const profile=d?getProfile(d):null;
 const f=d?.details||{};
 const areas=[['mechanism','Mechanism of action'],['caution','Contraindications & precautions'],['adverse','Adverse effects'],['interactions','Drug interactions'],['monitoring','Monitoring'],['kinetics','Pharmacokinetics'],['populations','Special populations'],['toxicity','Toxicity & reversal'],['dosing','Dosing reference notes (not used for auto-generated questions)'],['naming','Drug name / naming stem explanation (optional)']];
 const classOptions=Object.values(C).sort((a,b)=>a.name.localeCompare(b.name)).map(c=>`<option value="${esc(c.name)}"></option>`).join('');
 return `<div class="modal-backdrop" id="editor-overlay"><div class="modal editor-modal" role="dialog" aria-modal="true" aria-label="${d?'Edit medication':'Add medication'}">
  <div class="modal-head"><div><div class="eyebrow">YOUR PERSONAL DRUG LIBRARY</div><h2>${d?'Edit':'Add'} a medication</h2><p class="small subtle">New records are saved locally, included in backups, and used for recall questions when sufficient fields are provided.</p></div><button class="close" data-action="close-editor" aria-label="Close">${ic('close')}</button></div>
  <div class="callout warn">${ic('alert','sm')} Medical facts entered here are <b>your own unreviewed study notes</b>. Check current product labeling and guidelines. Dosing notes appear in the reference card but never generate dosing questions automatically.</div>
  <form id="drug-editor-form" class="editor-form">
   <div class="editor-row"><label class="editor-label">Medication name <span>*</span><input name="name" maxlength="100" required placeholder="e.g., Abatacept" value="${esc(d?.name||'')}"></label><label class="editor-label">Pharmacologic class <span>*</span><input name="className" list="known-drug-classes" maxlength="120" required placeholder="Choose or enter a class" value="${esc(profile?.name||'')}"><datalist id="known-drug-classes">${classOptions}</datalist><small>Select an existing class to inherit its general teaching facts, or type a new class.</small></label></div>
   <div class="editor-row"><label class="editor-label">Priority tier<select name="tier">${[1,2,3].map(n=>`<option value="${n}" ${d?.tier===n||!d&&n===2?'selected':''}>Tier ${n} — ${n===1?'Essential':n===2?'Important':'Recognition'}</option>`).join('')}</select></label><label class="editor-label">Reference URL (optional)<input name="referenceUrl" type="url" maxlength="600" placeholder="https://dailymed.nlm.nih.gov/..." value="${esc(d?.referenceUrl||'')}"></label></div>
   <div class="editor-label">Relevant rotations <span>*</span><div class="editor-specialties">${SPECIALTIES.map(([id,label])=>`<label><input type="checkbox" name="specialties" value="${id}" ${d?d.specialties.includes(id)?'checked':'':id===state.prefs.rotation?'checked':''}> ${esc(label)}</label>`).join('')}</div></div>
   <label class="editor-label">Indications <small>(one per line, optional)</small><textarea name="indications" rows="3" placeholder="e.g., Rheumatoid arthritis&#10;Psoriatic arthritis">${esc(d?.indications?.join('\n')||'')}</textarea></label>
   <label class="editor-label">Distinctive teaching note (optional)<textarea name="tag" rows="2" maxlength="600" placeholder="e.g., Screen for latent TB before initiation">${esc(d?.tag||'')}</textarea></label>
   <div class="editor-divider"><h3>Pharmacology details</h3><p class="small subtle">Leave fields blank to inherit class notes if this is an existing class. For a new class, only filled fields will generate questions.</p></div>
   <div class="editor-row">${areas.map(([key,label])=>`<label class="editor-label">${esc(label)}<textarea name="detail_${key}" rows="3" maxlength="3000" placeholder="${key==='dosing'?'Only a verified indication- and patient-specific regimen; leave blank if unsure':'Enter a concise, accurate teaching point'}">${esc(f[key]||'')}</textarea></label>`).join('')}</div>
   <div class="editor-actions"><button class="btn" type="submit">${ic('check','sm')} ${d?'Save changes':'Save medication'}</button><button class="btn ghost" type="button" data-action="close-editor">Cancel</button>${d?`<button class="btn danger" type="button" data-action="delete-custom-drug" data-id="${d.id}">Delete this drug</button>`:''}</div>
  </form></div></div>`;
}
function saveCustomDrug(fd){
 const name=String(fd.get('name')||'').trim().slice(0,100),classInput=String(fd.get('className')||'').trim().slice(0,120);
 const specialties=[...new Set(fd.getAll('specialties').filter(v=>SPECIALTIES.some(s=>s[0]===v)))];
 if(name.length<2||classInput.length<3||!specialties.length){toast('Enter a medication name, class and at least one rotation.');return;}
 const editing=drugEditor!=='new'?findDrug(drugEditor):null;
 if(DRUGS.some(d=>d.id!==editing?.id&&d.name.toLocaleLowerCase()===name.toLocaleLowerCase())){toast('A medication with this name is already in the library. Open its profile instead.');return;}
 const known=Object.values(C).find(c=>c.name.toLocaleLowerCase()===classInput.toLocaleLowerCase());
 const cls=known?known.id:`user-${slug(classInput).slice(0,75)||'class'}`;
 const details={};for(const key of [...profileFields,'dosing','naming'])details[key]=String(fd.get('detail_'+key)||'').trim().slice(0,3000);
 const indications=String(fd.get('indications')||'').split(/[\n;]/).map(x=>x.trim().slice(0,180)).filter(Boolean).slice(0,15);
 const input={id:editing?.id||`custom-${now().toString(36)}-${Math.random().toString(36).slice(2,9)}`,name,cls,className:known?'':classInput,indications,specialties,tier:Number(fd.get('tier')||2),tag:String(fd.get('tag')||'').trim().slice(0,600),details,referenceUrl:String(fd.get('referenceUrl')||''),custom:true,needsReview:/^unclassified\b/i.test(classInput),importedFromList:editing?.importedFromList===true,createdAt:editing?.createdAt||now(),updatedAt:now()};
 const d=normalizeCustomDrug(input);if(!d){toast('Cannot save this medication. Check the details and reference link.');return;}
 if(editing)state.customDrugs=state.customDrugs.map(x=>x.id===editing.id?d:x);
 else state.customDrugs.push(d);
 state.session=null;rebuildCatalog();generateQuestions();persist();drugEditor=null;selectedDrug=d.id;
 go('library');toast(editing?'Custom medication updated.':'Medication added to your local library and quiz bank.');
}
function deleteCustomDrug(id){
 const d=findDrug(id);if(!d?.custom)return;
 if(!confirm(`Delete ${d.name} and its saved quiz history, bookmarks and notes from this device? Export a backup first if you want to keep it.`))return;
 state.customDrugs=state.customDrugs.filter(x=>x.id!==id);
 state.attempts=state.attempts.filter(a=>a.drugId!==id);
 for(const key of Object.keys(state.reviews))if(key.startsWith(id+'|'))delete state.reviews[key];
 delete state.notes[id];delete state.encounters[id];state.bookmarks=state.bookmarks.filter(k=>k!==id);
 state.session=null;selectedDrug=null;drugEditor=null;rebuildCatalog();generateQuestions();persist();go('library');toast('Custom medication deleted from this device.');
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
 <div class="grid two"><section class="card"><div class="panel-title"><h2>Local storage</h2><span class="health-pill">${ic('shield','sm')} Private on this device</span></div><div class="data-list"><div class="data-item"><span class="label">Storage engine</span><strong>${esc(storage.type)}</strong></div><div class="data-item"><span class="label">Recorded answers</span><strong>${state.attempts.length}</strong></div><div class="data-item"><span class="label">Scheduled reviews</span><strong>${Object.keys(state.reviews).length}</strong></div><div class="data-item"><span class="label">Bookmarks</span><strong>${state.bookmarks.length}</strong></div><div class="data-item"><span class="label">My added medications</span><strong>${state.customDrugs.length}</strong></div><div class="data-item"><span class="label">Personal notes</span><strong>${Object.keys(state.notes).length}</strong></div></div><div class="divider"></div><div class="stack"><button class="btn" data-action="export">${ic('download','sm')} Export my progress (.json)</button><button class="btn ghost" data-action="import">${ic('upload','sm')} Import a progress backup</button><input id="import-file" type="file" accept=".json,application/json" style="display:none"></div></section>
 <section class="card"><div class="panel-title"><h2>How to move between devices</h2><span class="tag">Manual sync</span></div><div class="data-list"><div class="data-item"><span class="badge good">1</span><div><div class="label">Export from the device you've been using</div><div class="caption">Downloads a JSON file containing question history, mastery, notes, bookmarks <b>and custom medications</b>.</div></div></div><div class="data-item"><span class="badge good">2</span><div><div class="label">Transfer the file</div><div class="caption">Use AirDrop, iCloud Drive, email to yourself, or another method you trust.</div></div></div><div class="data-item"><span class="badge good">3</span><div><div class="label">Import on the other device</div><div class="caption">Choose Merge to combine study histories, or Replace to restore an exact copy.</div></div></div></div><div class="callout warn" style="margin-top:15px">${ic('alert','sm')} Browsers can clear local data. Export regularly and use the same website address and installation each time; browser and installed-web-app storage may be separate.</div></section></div>
 <div class="grid two sectiongap"><section class="card"><h2>Terminology highlighting</h2><p class="small subtle">Interactive definitions are authored by PharmCore, not AMBOSS. On desktop, the official AMBOSS Chrome extension can be used on websites independently; on iPhone the built-in glossary works without it.</p><label class="checklabel"><input type="checkbox" id="toggle-terms" ${state.prefs.termHighlights!==false?'checked':''}> Highlight medical terms in explanations</label><p class="fineprint"><a href="https://www.amboss.com/int/chrome" target="_blank" rel="noopener noreferrer">Official AMBOSS Chrome extension</a> · <a href="https://next.amboss.com/us/" target="_blank" rel="noopener noreferrer">Open AMBOSS</a></p><div class="divider"></div><h2>Storage & privacy guidance</h2><p class="small subtle">Your data isn't uploaded by PharmCore. A static host delivers the app's public files, and your device stores the learning history locally. Manual transfer files are unencrypted JSON; keep them in a trusted location.</p><button class="btn ghost small" data-action="request-persist">${ic('database','sm')} Request persistent browser storage</button><div class="fineprint" style="margin-top:10px">The browser may allow or deny a persistence request. Export remains the reliable backup method.</div></section>
 <section class="card"><h2>About the learning content</h2><p class="small subtle">${BASE_DRUGS.length} seed medications and ${state.customDrugs.length} user-added medications; ${QUESTIONS.length} total question prompts (many generated from class-level educational facts), ${DOSING_CASES.length} source-linked dosing scenarios and ${CLINICAL_CASES.length} authored clinical cases. This content has not undergone clinical editorial peer review.</p><div class="stack">${SOURCES.map(([name,url])=>`<a class="small" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${ic('external','sm')} ${esc(name)}</a>`).join('')}</div><div class="divider"></div><button class="btn danger small" data-action="reset">${ic('alert','sm')} Clear all local progress</button></section></div>`;
}
function renderDrugListModal(){if(!drugListCandidate)return '';
 const p=drugListCandidate,need=p.missing.filter(x=>x.needsReview);
 return `<div class="modal-backdrop" id="drug-list-overlay"><div class="modal" style="max-width:690px" role="dialog" aria-modal="true" aria-label="Import medications for quiz"><div class="modal-head"><div><div class="eyebrow">QUIZ BUILDER · JSON DRUG LIST</div><h2>Review imported medications</h2><p class="small subtle">${esc(p.fileName)} · ${p.ids.length} unique medication names</p></div><button class="close" data-action="quiz-close-import" aria-label="Close">${ic('close')}</button></div>
 <div class="grid three"><div class="metric"><span class="value">${p.existing.length}</span><span class="foot">Already in library</span></div><div class="metric"><span class="value">${p.missing.length}</span><span class="foot">New custom entries</span></div><div class="metric"><span class="value">${need.length}</span><span class="foot">Need profile details</span></div></div>
 ${p.missing.length?`<div class="callout warn" style="margin-top:14px">${ic('alert','sm')} New drugs with only a name are imported as <b>unclassified</b>. They will be selected for the quiz, but PharmCore won't invent drug classes, targets, indications or dosage facts. Edit those profiles in Drug Library to unlock their questions.</div>`:''}
 <div class="import-review-list">${p.entries.slice(0,70).map(e=>`<div class="import-preview-row"><b>${esc(e.name)}</b><span class="tag ${e.existing?'t1':e.needsReview?'t3':''}">${e.existing?'Matched':e.needsReview?'Needs details':'New · user-supplied class'}</span></div>`).join('')}${p.entries.length>70?`<p class="fineprint">... and ${p.entries.length-70} more.</p>`:''}</div>
 <div class="stack" style="margin-top:17px"><button class="btn full" data-action="quiz-confirm-import">${ic('check','sm')} Add new drugs & use this quiz list</button><button class="btn ghost full" data-action="quiz-close-import">Cancel</button></div><p class="fineprint">Importing a drug list is separate from restoring a PharmCore progress backup. No patient information or PHI should be uploaded.</p></div></div>`;
}
function normalizeDrugListName(value){return String(value||'').normalize('NFKC').trim().toLowerCase().replace(/\([^)]*\)/g,'').replace(/[^a-z0-9]+/g,'');}
function matchKnownDrugName(name){const key=normalizeDrugListName(name);
 const exact=DRUGS.find(x=>x.name.toLocaleLowerCase()===String(name).trim().toLocaleLowerCase());if(exact)return exact;
 const matches=DRUGS.filter(x=>normalizeDrugListName(x.name)===key);return matches.length===1?matches[0]:null;
}
function createImportRecord(input){
 const name=String(typeof input==='string'?input:input?.name||'').trim().slice(0,100);
 if(name.length<2||name.length>100)return null;
 if(typeof input==='string')input={name};
 if(!input||typeof input!=='object'||Array.isArray(input))return null;
 const classname=String(input.className||input.class||'').trim().slice(0,120);
 const known=Object.values(C).find(c=>c.name.toLocaleLowerCase()===classname.toLocaleLowerCase()||c.id.toLocaleLowerCase()===classname.toLocaleLowerCase());
 const needsReview=!classname;
 const cls=needsReview?'user-unclassified':known?known.id:`user-${slug(classname).slice(0,75)}`;
 const uniqueSpec=Array.isArray(input.specialties)?[...new Set(input.specialties.filter(x=>SPECIALTIES.some(s=>s[0]===x)))]:[];
 const specialties=uniqueSpec.length?uniqueSpec:config.specialties.length?config.specialties.slice():[state.prefs.rotation];
 let indications=Array.isArray(input.indications)?input.indications:typeof input.indications==='string'?input.indications.split(/[;\n]/):[];
 indications=indications.filter(x=>typeof x==='string').map(x=>x.trim().slice(0,180)).filter(Boolean).slice(0,15);
 const details={};for(const key of [...profileFields,'dosing','naming']){
  const value=input.details?.[key]??input[key];details[key]=typeof value==='string'?value.trim().slice(0,3000):'';
 }
 const id=`custom-${slug(name).slice(0,52)}-${hash(name.toLowerCase()).toString(36)}`;
 return normalizeCustomDrug({id,name,cls,className:known?'':needsReview?'Unclassified (edit to add pharmacology)':classname,
  indications,specialties,tier:[1,2,3].includes(Number(input.tier))?Number(input.tier):2,
  tag:typeof input.tag==='string'?input.tag:'',details,referenceUrl:input.referenceUrl||'',
  custom:true,needsReview,createdAt:now(),updatedAt:now(),importedFromList:true});
}
async function handleQuizDrugImport(file){if(!file)return;
 if(file.size>2*1024*1024){toast('Drug list exceeds the 2 MB limit.');return;}
 try{
  const raw=JSON.parse(await file.text());
  if(raw?.app==='PharmCore'&&raw?.payload)throw new Error('This is a progress backup. Use Settings → Import progress, not Quiz Builder.');
  const list=Array.isArray(raw)?raw:(raw&&typeof raw==='object'?(raw.drugs||raw.medications):null);
  if(!Array.isArray(list)||!list.length||list.length>500)throw new Error('Expected 1–500 drugs in an array or {"drugs":[...]}.');
  const entries=[],dedup=new Set(),existing=[],missing=[];
  for(const item of list){
   const name=typeof item==='string'?item:item?.name;
   if(typeof name!=='string'||name.trim().length<2||name.trim().length>100)throw new Error('Every drug must have a 2–100 character name.');
   const key=normalizeDrugListName(name);if(!key||dedup.has(key))continue;dedup.add(key);
   const matched=matchKnownDrugName(name);
   if(matched){existing.push(matched.id);entries.push({id:matched.id,name:matched.name,existing:true,needsReview:!!matched.needsReview});}
   else{const custom=createImportRecord(item);if(!custom)throw new Error(`Could not create entry for ${name}.`);
    missing.push(custom);entries.push({id:custom.id,name:custom.name,existing:false,needsReview:!!custom.needsReview});}
  }
  if(!entries.length)throw new Error('No medication names found.');
  drugListCandidate={ids:entries.map(x=>x.id),entries,existing,missing,fileName:file.name};render();
 }catch(err){toast(`Import failed: ${err.message}`);}
}
function confirmQuizDrugImport(){if(!drugListCandidate)return;
 const current=new Set(DRUGS.map(d=>d.id));let added=0;
 for(const entry of drugListCandidate.missing){if(!current.has(entry.id)){state.customDrugs.push(entry);current.add(entry.id);added++;}}
 config.drugIds=drugListCandidate.ids.filter(id=>current.has(id));state.prefs.quizDrugIds=config.drugIds.slice();
 drugListCandidate=null;rebuildCatalog();generateQuestions();persist();go('practice');
 toast(`${config.drugIds.length} drugs selected; ${added} new library entries added.`);
}
function clearQuizDrugList(){config.drugIds=null;delete state.prefs.quizDrugIds;persist();render();toast('Imported filter cleared. Normal specialty filters are active.');}
function renderImportModal(){if(!importCandidate)return '';const count=importCandidate.payload?.attempts?.length||0;
 return `<div class="modal-backdrop" id="import-overlay"><div class="modal" style="max-width:540px" role="dialog" aria-modal="true"><div class="modal-head"><div><div class="eyebrow">RESTORE STUDY DATA</div><h2>Import a PharmCore backup</h2></div><button class="close" data-action="close-import" aria-label="Close">${ic('close')}</button></div>
 <p class="small subtle">Backup exported ${esc(importCandidate.exportedAt?new Date(importCandidate.exportedAt).toLocaleString():'on an unknown date')}. Contains <b>${count}</b> answers, <b>${Object.keys(importCandidate.payload.reviews||{}).length}</b> review records and <b>${(importCandidate.payload.bookmarks||[]).length}</b> bookmarks, plus <b>${(importCandidate.payload.customDrugs||[]).length}</b> custom drugs.</p>
 <div class="stack"><button class="btn full" data-action="confirm-import" data-mode="merge">${ic('layers','sm')} Merge with this device's progress</button><button class="btn ghost full" data-action="confirm-import" data-mode="replace">${ic('rotate','sm')} Replace this device's progress</button><button class="btn ghost full" data-action="close-import">Cancel</button></div><p class="fineprint" style="margin-top:14px">Merge combines unique answer records and keeps newer review states; it cannot perfectly reconcile intervals computed independently on different devices. Replace overwrites all local progress. Export a backup first if needed.</p></div></div>`;
}
function render(){const pages={dashboard:renderDashboard,practice:renderPractice,attending:renderAttending,session:renderSession,results:renderResults,library:renderLibrary,review:renderReview,analytics:renderAnalytics,settings:renderSettings};
 $('#app').innerHTML=shell((pages[view]||renderDashboard)());document.title=`${({dashboard:'Overview',practice:'Quiz builder',session:'Quiz',results:'Results',library:'Drug library',review:'Reviews',analytics:'Progress',settings:'Settings'})[view]||'PharmCore'} · PharmCore`;}
function go(page){view=page;sidebarOpen=false;render();window.scrollTo({top:0,behavior:'instant'});}
function resetConfigToRotation(){config.specialties=[state.prefs.rotation];}
function launchQuestions(qids,{exam=false,review=false}={}){if(!qids.length){toast('No matching questions available. Adjust the filters.');return;}state.session={qids,idx:0,answers:[],exam,review,ended:false,started:now()};persist();go('session');}
function startConfiguredQuiz(){const questions=selectQuestions(config);launchQuestions(questions.map(q=>q.id),{exam:config.exam});}
function startQuickQuiz(){const quick={...config,drugIds:null,specialties:[state.prefs.rotation],tiers:[1],categories:['classification','mechanism','indications','contraindications','adverse','interactions','monitoring','pharmacokinetics','populations','toxicity','clinical'],mode:'mixed',length:10,exam:false};launchQuestions(selectQuestions(quick).map(q=>q.id),{exam:false});}
function startDueReviews(){let dueKeys=Object.keys(state.reviews).filter(k=>state.reviews[k].due<=now());if(reviewFilter!=='all')dueKeys=dueKeys.filter(k=>findDrug(k.split('|')[0])?.specialties.includes(reviewFilter));const qs=dueKeys.map(key=>QUESTIONS.find(q=>`${q.drugId}|${q.category}`===key)).filter(Boolean);launchQuestions(shuffleSeeded(qs,`review-${now()}`).slice(0,40).map(q=>q.id),{review:true});}
function startDrugQuiz(id){const qs=QUESTIONS.filter(q=>q.drugId===id&&q.type==='rapid');launchQuestions(shuffleSeeded(qs,id).map(q=>q.id),{});selectedDrug=null;}
function pickAnswer(index){const sess=state.session;if(!sess||sess.ended||sess.answers[sess.idx])return;const q=qIndex[sess.qids[sess.idx]],chosen=q.options[index];if(!chosen)return;const attemptId=saveAttempt(q,index,chosen.correct);sess.answers[sess.idx]={chosen:index,correct:chosen.correct,attemptId,confidence:null};if(sess.attending&&!chosen.correct){sess.stopped=true;sess.ended=true;sess.answers[sess.idx].confidence='again';applyReview(q,'again',false);}persist();render();}
function recordConfidence(c){const sess=state.session,ans=sess?.answers[sess.idx];if(!ans||sess.exam)return;if(ans.confidence){toast('Confidence is already recorded for this question.');return;}
 ans.confidence=c;applyReview(qIndex[sess.qids[sess.idx]],c,ans.correct);render();}
function advanceQuestion(){const sess=state.session,ans=sess?.answers[sess.idx];if(!ans)return;const q=qIndex[sess.qids[sess.idx]];
 if(!ans.confidence){const c=ans.correct?'good':'again';ans.confidence=c;applyReview(q,c,ans.correct);}
 if(sess.attending&&!ans.correct){sess.stopped=true;sess.ended=true;persist();render();return;}
 sess.idx++;if(sess.idx>=sess.qids.length){sess.ended=true;view='results';}persist();render();window.scrollTo({top:0,behavior:'instant'});}
function exportData(){const payload={app:'PharmCore',schema:2,exportedAt:new Date().toISOString(),appVersion:PHARMCORE_VERSION,payload:{...state,session:null}};const b=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(b);const a=document.createElement('a');a.href=url;a.download=`pharmcore-progress-${today()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);toast('Backup file downloaded. Keep it somewhere safe.');}
function validImported(p){if(!p||p.app!=='PharmCore'||![1,2].includes(p.schema)||!p.payload)return false;const s=p.payload;return Array.isArray(s.attempts)&&Array.isArray(s.bookmarks)&&s.reviews&&typeof s.reviews==='object'&&s.notes&&typeof s.notes==='object'&&s.encounters&&typeof s.encounters==='object';}
async function handleImport(file){if(!file)return;if(file.size>20*1024*1024){toast('Backup is larger than the supported 20 MB limit.');return;}try{const raw=JSON.parse(await file.text());if(!validImported(raw))throw new Error('Not a recognized PharmCore backup');importCandidate=raw;render();}catch(err){toast(`Could not read backup: ${err.message}`);}}
function cleanImported(p){const s=p.payload,base=defaultState();const customDrugs=(Array.isArray(s.customDrugs)?s.customDrugs:[]).slice(0,1200).map(normalizeCustomDrug).filter(Boolean);const knownIds=new Set([...BASE_DRUGS.map(d=>d.id),...customDrugs.map(d=>d.id)]);const attempts=s.attempts.filter(a=>a&&typeof a.id==='string'&&typeof a.qid==='string'&&typeof a.drugId==='string'&&typeof a.category==='string'&&typeof a.correct==='boolean'&&Number.isFinite(a.ts)).slice(-90000);
 const reviews={};Object.entries(s.reviews).slice(0,20000).forEach(([key,r])=>{if(r&&typeof r==='object'&&Number.isFinite(r.due)&&Number.isFinite(r.last)&&Number.isFinite(r.seen)&&Number.isFinite(r.correct))reviews[key]={seen:r.seen,correct:r.correct,streak:Number(r.streak)||0,interval:Number(r.interval)||0,ease:Number(r.ease)||2.5,due:r.due,last:r.last};});
 const notes={};Object.entries(s.notes).slice(0,500).forEach(([k,v])=>{if(typeof v==='string')notes[k]=v.slice(0,3000);});
 const encounters={};Object.entries(s.encounters).slice(0,500).forEach(([k,v])=>{if(v&&Number.isFinite(v.ts))encounters[k]={ts:v.ts,specialty:typeof v.specialty==='string'?v.specialty:'family'};});
 return {...base,prefs:{...base.prefs,...(s.prefs&&typeof s.prefs==='object'?{rotation:SPECIALTIES.some(x=>x[0]===s.prefs.rotation)?s.prefs.rotation:'family',termHighlights:s.prefs.termHighlights!==false,quizDrugIds:Array.isArray(s.prefs.quizDrugIds)?s.prefs.quizDrugIds.filter(id=>knownIds.has(id)).slice(0,500):undefined}:{})},attempts,reviews,notes,encounters,bookmarks:s.bookmarks.filter(x=>typeof x==='string'&&knownIds.has(x)).slice(0,1500),customDrugs,session:null};}
function confirmImport(mode){if(!importCandidate)return;const received=cleanImported(importCandidate);
 if(mode==='replace'){state=received;}
 else{const merged=new Map([...(state.customDrugs||[]),...received.customDrugs].map(d=>[d.id,d]));for(const d of state.customDrugs||[]){const current=merged.get(d.id);if(current&&Number(d.updatedAt||0)>Number(current.updatedAt||0))merged.set(d.id,d);}state.customDrugs=[...merged.values()];const seen=new Set(state.attempts.map(a=>a.id));const added=received.attempts.filter(a=>!seen.has(a.id));state.attempts=[...state.attempts,...added].sort((a,b)=>a.ts-b.ts);for(const [key,r] of Object.entries(received.reviews)){if(!state.reviews[key]||r.last>state.reviews[key].last)state.reviews[key]=r;}for(const [key,v] of Object.entries(received.encounters)){if(!state.encounters[key]||v.ts>state.encounters[key].ts)state.encounters[key]=v;}state.notes={...received.notes,...state.notes};state.bookmarks=[...new Set([...state.bookmarks,...received.bookmarks])];state.session=null;if(!state.prefs.quizDrugIds?.length&&received.prefs.quizDrugIds?.length)state.prefs.quizDrugIds=received.prefs.quizDrugIds;}
 importCandidate=null;state.session=null;rebuildCatalog();generateQuestions();config.drugIds=state.prefs.quizDrugIds?.filter(id=>findDrug(id))||null;persist();go('analytics');toast('Progress imported successfully.');}
function doReset(){if(!confirm('Permanently erase ALL local PharmCore progress, notes, bookmarks AND drugs you added on this device? Export a backup first if needed.'))return;state=defaultState();rebuildCatalog();generateQuestions();config.specialties=[state.prefs.rotation];config.drugIds=null;persist();go('dashboard');toast('This device’s local progress was reset.');}
function handleAction(action,btn){const id=btn.dataset.id;
 switch(action){
  case 'term':selectedTerm=btn.dataset.term;render();return;
  case 'close-term':selectedTerm=null;render();return;
  case 'copy-term':{const term=selectedTerm||'';if(navigator.clipboard?.writeText)navigator.clipboard.writeText(term).then(()=>toast('Copied: '+term)).catch(()=>toast('Select and copy the displayed term.'));else toast('Select and copy the displayed term.');return;}
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
  case 'attend-drug':startAttending(id);return;
  case 'attend-results':view='results';render();return;
  case 'save-note':{const note=$('#note-input')?.value?.trim().slice(0,3000)||'';if(note)state.notes[id]=note;else delete state.notes[id];persist();toast('Personal learning note saved on this device.');return;}
  case 'toggle-bookmarks':libraryFilter.saved=!libraryFilter.saved;render();return;
  case 'toggle-custom':libraryFilter.custom=!libraryFilter.custom;render();return;
  case 'add-drug':selectedDrug=null;drugEditor='new';render();return;
  case 'edit-drug':if(findDrug(id)?.custom){selectedDrug=null;drugEditor=id;render();}return;
  case 'close-editor':drugEditor=null;render();return;
  case 'delete-custom-drug':deleteCustomDrug(id);return;
  case 'start-reviews':startDueReviews();return;
  case 'export':exportData();return;
  case 'import':$('#import-file')?.click();return;
  case 'quiz-import-list':$('#quiz-import-file')?.click();return;
  case 'quiz-close-import':drugListCandidate=null;render();return;
  case 'quiz-confirm-import':confirmQuizDrugImport();return;
  case 'quiz-clear-list':clearQuizDrugList();return;
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
 if(e.target.id==='drug-list-overlay'){drugListCandidate=null;render();}
 if(e.target.id==='editor-overlay'){drugEditor=null;render();}
 if(e.target.id==='term-overlay'){selectedTerm=null;render();}
});
document.addEventListener('change',e=>{
 const t=e.target;
 if(t.id==='toggle-terms'){state.prefs.termHighlights=t.checked;persist();render();return;}
 if(t.id==='rotation-select'){state.prefs.rotation=t.value;config.specialties=[t.value];persist();render();return;}
 if(t.dataset.configGroup){const group=t.dataset.configGroup,val=group==='tiers'?Number(t.value):t.value;config[group]=t.checked?[...new Set([...config[group],val])]:config[group].filter(x=>x!==val);render();return;}
 if(t.name==='quiz-mode'){config.mode=t.value;render();return;}
 if(t.id==='attending-filter'){attendingFilter=t.value;render();return;}
 if(t.id==='library-specialty'){libraryFilter.specialty=t.value;refreshLibraryGrid();return;}
 if(t.id==='library-tier'){libraryFilter.tier=t.value;refreshLibraryGrid();return;}
 if(t.id==='review-specialty'){reviewFilter=t.value;render();return;}
 if(t.id==='import-file'){handleImport(t.files?.[0]);t.value='';return;}
 if(t.id==='quiz-import-file'){handleQuizDrugImport(t.files?.[0]);t.value='';return;}
 if(t.id==='editor-class'){const el=$('#editor-new-class');if(el)el.hidden=t.value!=='__new__';return;}
});
document.addEventListener('submit',e=>{if(e.target?.id==='drug-editor-form'){e.preventDefault();saveCustomDrug(new FormData(e.target));}});
document.addEventListener('input',e=>{if(e.target.id==='drug-search'){libraryFilter.search=e.target.value;refreshLibraryGrid();}if(e.target.id==='attending-search'){attendingSearch=e.target.value;refreshAttendingDrugList();}});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(selectedTerm){selectedTerm=null;render();}else if(importCandidate){importCandidate=null;render();}else if(drugListCandidate){drugListCandidate=null;render();}else if(drugEditor!==null){drugEditor=null;render();}else if(selectedDrug){selectedDrug=null;render();}return;}
 const active=document.activeElement;if(['INPUT','TEXTAREA','SELECT'].includes(active?.tagName))return;
 if(view==='session'&&state.session&&!state.session.answers[state.session.idx]&&/^[1-4]$/.test(e.key)){e.preventDefault();pickAnswer(Number(e.key)-1);}
});
(async()=>{
 await storage.init();const loaded=await storage.load();if(loaded&&typeof loaded==='object'&&Array.isArray(loaded.attempts)&&loaded.reviews&&loaded.prefs){state={...defaultState(),...loaded,prefs:{...defaultState().prefs,...loaded.prefs}};}
 rebuildCatalog();generateQuestions();
 config.specialties=[state.prefs.rotation];
 config.drugIds=Array.isArray(state.prefs.quizDrugIds)?state.prefs.quizDrugIds.filter(id=>findDrug(id)):null;
 if(state.session?.attending&&state.session.drugId)createAttendingSequence(state.session.drugId);
 if(state.session&&Array.isArray(state.session.qids)&&state.session.qids.length&&state.session.qids.every(id=>qIndex[id]))view=state.session.stopped?'session':state.session.ended?'results':'session';
 render();
 if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./service-worker.js').catch(e=>console.warn('Offline cache unavailable',e));
})();
