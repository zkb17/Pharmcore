/* PharmCore content QA: run with node audit-questions.cjs. Checks deterministic structural/prompt leaks.
   Automated checks cannot replace a clinical editorial review of every statement. */
const fs=require('fs'),vm=require('vm'),path=require('path');
const ctx=vm.createContext({console,document:{addEventListener:()=>{}},navigator:{},window:{},URL,Date,Math,setTimeout,clearTimeout});
for(const f of ['data.js','expanded-library.js','learning.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),ctx,{filename:f});
let app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
app=app.slice(0,app.lastIndexOf('(async()=>{'));
vm.runInContext(app,ctx,{filename:'app.js'});
vm.runInContext('generateQuestions()',ctx);
const payload=vm.runInContext(`({drugs:DRUGS.length,classes:Object.keys(C).length,
  qs:QUESTIONS.map(q=>({id:q.id,drugId:q.drugId,category:q.category,stem:q.stem,answer:q.options.find(o=>o.correct)?.text,options:q.options.map(o=>o.text),className:getProfile(findDrug(q.drugId)).name,drugName:findDrug(q.drugId).name})),
  names:DRUGS.map(d=>({name:d.name,cls:d.cls,matched:!!matchNameRule(d),explanation:namingExplanation(d)})),
  rounds:DRUGS.map(d=>{const ids=createAttendingSequence(d.id);return {id:d.id,name:d.name,ids,questions:ids.map(id=>({id,stem:qIndex[id]?.stem,answer:qIndex[id]?.options.find(o=>o.correct)?.text,options:qIndex[id]?.options.map(o=>o.text)}))}})
})`,ctx);
const errors=[];
function normalize(s){return String(s??'').toLowerCase().replace(/[\u2010-\u2015]/g,'-').replace(/\s+/g,' ').trim();}
function check(q,kind){
 const id=q.id, stem=normalize(q.stem),answer=normalize(q.answer);
 if(!q.stem||!q.answer)errors.push(`${kind} ${id}: missing stem or answer`);
 if(!Array.isArray(q.options)||q.options.length!==4||new Set(q.options).size!==4)errors.push(`${kind} ${id}: not four unique options`);
 if(answer.length>=6&&stem.includes(answer))errors.push(`${kind} ${id}: correct option appears verbatim in stem (${q.answer.slice(0,50)})`);
 if(kind==='general'&&q.category==='mechanism'&&q.className&&normalize(q.className)!==normalize(q.drugName)&&stem.includes(normalize(q.className)))errors.push(`${kind} ${id}: mechanism stem names the class`);
 if(/^for the .+ class \(which includes/i.test(q.stem))errors.push(`${kind} ${id}: legacy class giveaway wording`);
}
payload.qs.forEach(q=>check(q,'general'));
payload.rounds.forEach(d=>{if(!d.questions.length)errors.push(`attending ${d.name}: no questions`); d.questions.forEach(q=>check(q,'attending'));});
const noPattern=payload.names.filter(d=>!d.matched);
const negative=payload.names.filter(d=>/No reliable standardized pharmacologic stem has been identified|No reliable standardized.*stem/i.test(d.explanation));
console.log(JSON.stringify({version:'1.4.0',seedDrugs:payload.drugs,classes:payload.classes,quizQuestions:payload.qs.length,attendingDrugs:payload.rounds.length,attendingQuestions:payload.rounds.reduce((n,x)=>n+x.questions.length,0),drugsWithDirectNameStems:payload.names.length-noPattern.length,drugsWithContextualNameExplanations:noPattern.length,legacyFallbackMessages:negative.length,minAttendingLevels:Math.min(...payload.rounds.map(d=>d.questions.length)),maxAttendingLevels:Math.max(...payload.rounds.map(d=>d.questions.length)),failures:errors.length,sampleErrors:errors.slice(0,30)},null,2));
if(errors.length){fs.writeFileSync(path.join(__dirname,'audit-failures.txt'),errors.join('\n')+'\n');process.exit(1)}
