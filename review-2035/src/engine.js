/* CHOKEPOINT 2035: deterministic encounter and commitment rules over shared economic settlement. */
import * as B from './engine-legacy.js';
export * from './engine-legacy.js';
export const VERSION=4,TOTAL_TURNS=18;
const copy=x=>JSON.parse(JSON.stringify(x)),{player,round,clamp,hash,metrics}=B;
Object.assign(B.ACTIONS,{
 jv:{title:'Accept the production partnership',cost:4,duration:2,tag:'Diplomacy',gain:{manufacturing:10,refining:6},upside:'Faster licensed production and process training.',downside:'Foreign IP, six turns of royalties; no sublicensing.'},
 transfer:{title:'Counter: pay for shared know-how',cost:6,duration:2,tag:'Diplomacy',gain:{manufacturing:8,refining:5},upside:'More process training; no exclusivity.',downside:'More capital, less production scale; foreign patent remains.'},
 exit:{title:'Buy out Atlas exclusivity',cost:4,duration:0,tag:'Contracts',upside:'Independent factory and partnership tenders reopen.',downside:'Pay 4 now; existing factories remain.'},
 restructure:{title:'Restructure the sovereign debt',cost:0,duration:0,tag:'Finance',upside:'Retire 20% of principal; available once.',downside:'Living standards −3, approval −5 and foreign trust −12.'}
});
export const createGame=(country='india',seed=2040)=>({...B.createGame(country,seed),version:4,turnLimit:18,seen:[],crises:{fiscal:0,social:0,food:0},leaders:{},restructured:false,terminal:null});
export const isOver=s=>!!s.terminal||s.turn>=(s.turnLimit||28);
export function representative(s,owner){return `${owner}-${s.leaders?.[owner]||'a'}`;}
const EXCLUSIVE=s=>player(s).contracts.find(c=>c.exclusive&&c.until>s.turn);
const partner=s=>Object.values(s.world.nations).filter(n=>n.id!==s.countryId&&n.caps.labs>=30&&n.knowhow>=40).sort((a,b)=>(b.ip-a.ip)||((b.caps.talent+b.knowhow)-(a.caps.talent+a.knowhow))||a.id.localeCompare(b.id))[0];
const CARDS=[
 ['intelligence','A national intelligence programme','Researchers want compute. Engineers warn that chips, cooling and the grid must come first.',['ai','research','skills'],'aster',s=>25-player(s).caps.compute*.1],
 ['inputs','The cheapest bid has strings','Cheap components improve margins now. Repeated purchases deepen supplier concentration.',['imports','diversify','factory'],'china',s=>8+player(s).concentration*.06],
 ['grid','Who gets the next megawatt?','A larger grid helps homes, research and factories. Rationing gives relief now but cuts production.',['grid','conserve','water'],'northgrid',s=>player(s).stress.energy*.6],
 ['water','A contested watershed','Industrial cooling and agriculture draw on the same supply. Which constraint should ease first?',['water','food','conserve'],'grainvault',s=>player(s).stress.water*.9],
 ['science','A discovery needs a production line','A patent is an opportunity. Engineers, equipment and an economical process must turn it into sales.',['pilot','research','royalties'],null,s=>player(s).ip*4],
 ['atlas','Private capital wants preferred access','Atlas offers fast factories, a recurring concession fee and exclusive manufacturing access. Independent factory and JV tenders will close until expiry or a 4-unit buyout.',['concede','bargain','regulate'],'atlas',s=>10],
 ['logistics','Your exports wait at the port','Freight delays and equipment prices erode margins. Invest in routes or change the sourcing mix.',['freight','diversify','imports'],'bluewave',s=>(80-player(s).caps.logistics)*.2],
 ['households','Who benefits from the investment boom?','Food bills and housing compete with industrial spending. Public patience is a resource too.',['food','welfare','skills'],null,s=>(70-player(s).mandate)*.8],
 ['licence','A shortcut through foreign know-how','Meridian offers quick equipment access. Recurring fees and foreign patent ownership outlast commissioning.',['partner','pilot','research'],'meridian',s=>12],
 ['execution','The missing engineering teams','Too many concurrent projects strain execution. Skills and logistics can make existing investments useful.',['skills','freight','conserve'],null,s=>player(s).projects.length*4],
 ['finance','Growth meets its interest bill','Revenue must pay interest before another industrial promise. Retire debt, seek concessions or restructure once at a cost.',['repay','restructure','concede'],null,s=>player(s).debt*.7],
 ['open','Who controls the next expansion?','Open access reduces lock-in. Incumbents may defer investment if a monopoly stops paying.',['regulate','bargain','partner'],'aster',s=>player(s).corporate*.2],
 ['scale','Compete on cost, not flags','New capacity earns value only if its inputs, skills and infrastructure let it sell competitively.',['factory','freight','pilot'],'atlas',s=>12],
 ['reuse','Efficiency before another megaproject','Reuse water, improve electricity supply or keep capital free through temporary rationing.',['water','grid','conserve'],'northgrid',s=>10],
 ['talent','Keep the people who make it work','Compute does not replace process engineers. Training and living conditions compete for the same public budget.',['skills','research','welfare'],null,s=>10],
 ['trade','A portfolio of suppliers','A diversified order book costs more upfront. Dependable cheap imports can still be rational.',['diversify','imports','freight'],'australia',s=>12],
 ['value','Who will manufacture the invention?','License your owned patents abroad, build process capability or obtain a foreign production licence.',['royalties','pilot','partner'],'meridian',s=>player(s).ip*5],
 ['harvest','A buffer against the next disruption','Farms, storage and reliable freight can insulate households from global shortages.',['food','freight','welfare'],'grainvault',s=>10],
 ['power2','An economy with operating costs','Finished projects need affordable utilities every period, not just construction capital.',['grid','water','repay'],'northgrid',s=>9],
 ['industry2','The next industrial customer','Buyers want reliable output and fair prices. Expand only where your economy can support the load.',['factory','partner','diversify'],'atlas',s=>9]
];
export function getEvent(s){
 if(s.version!==4)return B.getEvent(s);if(isOver(s))return null;const n=player(s),used=new Set(s.seen);
 if(s.turn===8||s.turn===16)return {id:`review-${s.turn}`,title:'A new mandate at the cabinet table',text:'An affordability mandate would prioritise public services. Retaining the industrial mandate protects the current programme. Debt, assets and contracts survive either choice.',choices:['welfare','skills','repay'],actor:s.countryId,half:B.halfLabel(s.turn)};
 const provider=partner(s);
 if(provider&&s.turn>=3&&!used.has('diplomacy')&&n.caps.talent>=35)return {id:'diplomacy',title:`${B.COUNTRIES[provider.id].name} proposes a production partnership`,text:'A proven foreign process can reach production faster. Accept a six-half-year licence (0.45 per turn, foreign IP, no sublicensing), counter for more know-how, or diversify suppliers instead.',choices:['jv','transfer','diversify'],actor:provider.id,provider:provider.id,half:B.halfLabel(s.turn)};
 if(EXCLUSIVE(s)&&!used.has('locked'))return {id:'locked',title:'The concession closes your next tender',text:`Atlas controls manufacturing access until ${B.halfLabel(EXCLUSIVE(s).until-1)}. Independent factory and JV tenders are blocked. Buy out the contract, build supporting infrastructure or reduce demand.`,choices:['exit','grid','conserve'],actor:'atlas',half:B.halfLabel(s.turn)};
 if(n.restrictionLoss>8&&!used.has('restriction'))return {id:'restriction',title:'A supplier uses its leverage',text:`Active export controls raise costs and reduce input availability. Exposure is ${Math.round(n.restrictionLoss)}. Reducing reliance takes investment or a different production mix.`,choices:['diversify','pilot','conserve'],actor:n.supplier,half:B.halfLabel(s.turn)};
 let deck=CARDS.filter(c=>!used.has(c[0]));
 if(s.turn>=15)deck=deck.filter(c=>c[3].some(id=>B.ACTIONS[id].duration<=2));
 const card=deck.sort((a,b)=>(b[5](s)+hash(`${s.seed}:${b[0]}`)%13)-(a[5](s)+hash(`${s.seed}:${a[0]}`)%13))[0]||CARDS[0];
 let [id,title,text,choices,actor]=card;
 if(s.turn>=15)choices=['repay','royalties','partner'];
 return {id,title,text,choices,actor:actor||s.countryId,half:B.halfLabel(s.turn)};
}
export function describeAction(s,n,id){const a=B.describeAction(s,n,id);if(s.version!==4)return a;
 let blocked='';if(EXCLUSIVE(s)&&['factory','jv','transfer','bargain'].includes(id))blocked='Atlas exclusivity blocks this tender. Buy out for 4 or wait for expiry.';
 if(id==='exit'&&!EXCLUSIVE(s))blocked='No exclusive concession to buy out.';
 if(id==='restructure'&&(s.restructured||n.debt<=0))blocked=s.restructured?'Restructuring was already used.':'No outstanding debt.';
 return {...a,blocked,available:a.available&&!blocked,financing:{...a.financing,eligible:a.financing.eligible&&!blocked},afterHorizon:s.turn+a.duration>18};}
export function financingQuote(s,id,mode='gap'){const q=B.financingQuote(s,id,mode),a=describeAction(s,player(s),id);return a.blocked?{...q,eligible:false,reason:a.blocked}:q;}
export function getOptions(s){if(s.version!==4)return B.getOptions(s);const e=getEvent(s);return e?e.choices.map(id=>describeAction(s,player(s),id)):[];}
export function dangers(s){if(s.version!==4||isOver(s))return [];const n=player(s),tax=n.ledger?.tax||4;return [
 ['fiscal',n.debt>tax*8,2,'Credit crisis','Repay or restructure before two consecutive high-debt settlements.'],
 ['social',n.mandate<22,2,'Government collapse','Restore public support before the next critical settlement.'],
 ['food',n.stress.food>35,3,'Essential food breakdown','Invest in food or relieve demand before three critical settlements.']
 ].filter(([,active])=>active).map(([id,,limit,title,rescue])=>({id,title,rescue,remaining:Math.max(1,limit-(s.crises[id]||0)),due:B.halfLabel(s.turn+Math.max(1,limit-(s.crises[id]||0))-1)}));}
export function takeTurn(original,request){
 if(original.version!==4)return B.takeTurn(original,request);if(isOver(original))throw Error('Campaign finished');
 const id=typeof request==='string'?request:request?.id,hold=id==='hold',event=getEvent(original),n0=player(original);
 if(!hold&&!event.choices.includes(id)&&!['repay','conserve','exit'].includes(id))throw Error('Policy not offered');
 const a=hold?null:describeAction(original,n0,id);if(a?.blocked)throw Error(a.blocked);
 const pre=copy(original);let writeDown=0;
 if(id==='restructure'){writeDown=round(player(pre).debt*.2);player(pre).debt=round(player(pre).debt-writeDown);}
 let s=hold?B.settleHold(pre):B.settlePolicy(pre,request);const n=player(s),h=s.lastResult;h.event=event.title;h.actor=event.actor;h.speaker=representative(original,event.actor);h.changes=[];
 if(id==='concede'){n.contracts.at(-1).exclusive=true;h.changes.push('Atlas now blocks independent factories, domestic co-investment and JVs. Exit: 4-unit buyout or expiry.');}
 if(id==='exit'){n.contracts=n.contracts.filter(c=>!c.exclusive);h.changes.push('Paid 4 to end Atlas exclusivity. Independent tenders reopen; existing factories stay.');}
 if(['jv','transfer'].includes(id)){
  n.contracts.push({firm:'meridian',until:original.turn+6,fee:.45,access:8,ipOwner:event.provider,noSublicense:true});n.knowhow=clamp(n.knowhow+(id==='transfer'?12:4));n.lockin=clamp(n.lockin+(id==='jv'?7:2));n.relationships[event.provider]=clamp(n.relationships[event.provider]+8);
  h.changes.push(`${B.COUNTRIES[event.provider].name} retains the patent; production is licensed, not domestically owned IP. Royalty 0.45/half-year; no sublicensing.`);
  if(original.countryId!=='china'&&s.world.nations.china.caps.refining>n.caps.refining){s.world.priceWarUntil=s.turn+3;h.countries.push({actor:'china',type:'pricewar',tone:'negative',text:'China defends processing sales with a three-period material price cut. Cheaper imports also squeeze your new factory margins.'});}
 }
 if(id==='restructure'){s.restructured=true;n.prosperity=clamp(n.prosperity-3);n.mandate=clamp(n.mandate-5);for(const k in n.relationships)n.relationships[k]=clamp(n.relationships[k]-12);h.ledger.writeDown=writeDown;h.changes.push(`Restructuring retires ${writeDown} principal; approval −5, living standards −3, foreign trust −12. Not repeatable.`);}
 if(event.id.startsWith('review-')){s.leaders[s.countryId]=id==='welfare'?'b':id==='skills'?'a':s.leaders[s.countryId]||'a';h.changes.push(`Mandate: ${s.leaders[s.countryId]==='b'?'household affordability':'industrial renewal'}. All contracts and debt remain.`);if(id==='welfare')n.contracts.forEach(c=>{if(c.exclusive)h.changes.push('A new mandate cannot cancel the Atlas concession without a buyout.');});}
 // Corporate succession responds to accumulated market power, not a random portrait swap.
 for(const [firm,f]of Object.entries(s.world.firms))if(!s.leaders[firm]&&f.power>60&&s.turn>=6){s.leaders[firm]='b';h.changes.push(`${f.name} changes leadership as its market power grows; obligations persist.`);break;}
 if(!s.seen.includes(event.id))s.seen.push(event.id);
 const tests={fiscal:n.debt>(n.ledger.tax||4)*8,social:n.mandate<22,food:n.stress.food>35};
 for(const k in tests)s.crises[k]=tests[k]?(s.crises[k]||0)+1:0;
 const failed=Object.keys(tests).find(k=>s.crises[k]>=(k==='food'?3:2));if(failed)s.terminal={type:failed,title:{fiscal:'The credit line closes',social:'The mandate collapses',food:'Essential supplies fail'}[failed],text:'The warned crisis persisted. Review your decisions and replay the same world to try a recovery.',turn:s.turn};
 h.delta=Object.fromEntries(Object.keys(metrics(original)).map(k=>[k,round(metrics(s)[k]-metrics(original)[k])]));
 h.ledger=copy(n.ledger);if(writeDown)h.ledger.writeDown=writeDown;
 s.history[s.history.length-1]=h;s.lastResult=h;return s;
}
export function score(s){const z=B.score(s);if(s.terminal)return {...z,ending:s.terminal,endings:[s.terminal,...z.endings]};return z;}
export function choosePolicy(s,policy='adaptive'){
 if(s.version!==4)return B.choosePolicy(s,policy);let opts=getOptions(s).filter(o=>o.available);if(!opts.length)return 'conserve';
 const n=player(s),need=n.stress.food>20?'food':n.mandate<30?'welfare':n.stress.water>8?'water':n.stress.energy>10?'grid':n.debt>10?'repay':n.ip&&n.knowhow<55?'pilot':'skills';
 if(policy==='random')return opts[hash(`${s.seed}:${s.turn}:random`)%opts.length].id;
 if(policy==='adversarial')return opts.sort((a,b)=>b.cost-a.cost)[0].id;
 if(policy==='adaptive'&&opts.some(o=>o.id===need))return need;
 const rank=B.POLICIES[policy]||B.POLICIES.infrastructure;return opts.sort((a,b)=>(rank.indexOf(a.id)<0?9:rank.indexOf(a.id))-(rank.indexOf(b.id)<0?9:rank.indexOf(b.id)))[0].id;
}
export function runWithPolicy(country='india',seed=2040,policy='adaptive'){let s=createGame(country,seed);while(!isOver(s))s=takeTurn(s,choosePolicy(s,policy));return s;}
export function validSave(x){if(x?.version!==4)return B.validSave(x);try{let s=createGame(x.countryId,x.seed);if(!Number.isInteger(x.turn)||x.turn<0||x.turn>18||x.history.length!==x.turn)return false;for(const h of x.history)s=takeTurn(s,B.historyChoice(h));return JSON.stringify(s)===JSON.stringify(x);}catch{return false;}}
export function committedOutlook(original,halves=6){if(original.version!==4)return B.committedOutlook(original,halves);const points=[];let s=original;for(let i=0;i<halves&&!isOver(s);i++){const completed=player(s).completed.length;s=takeTurn(s,'hold');const n=player(s);points.push({turn:s.turn,score:score(s).total,metrics:metrics(s),debt:n.debt,cash:n.cash,interest:n.ledger.interest,tax:n.ledger.tax,completed:n.completed.slice(completed).map(p=>p.label)});}return points;}
