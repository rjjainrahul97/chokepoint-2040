/* Original deterministic game model. Indices are fictional design assumptions. MIT. */
import {COUNTRIES} from './countries.js';
export {COUNTRIES};
export const VERSION=3, TOTAL_TURNS=28, START_YEAR=2027;
export const halfLabel=t=>`${2027+Math.floor(t/2)} · H${t%2+1}`;
export const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
export const round=x=>Math.round(x*100)/100;
export function hash(x){let h=2166136261;for(const c of String(x)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
const roll=(s,key)=>hash(`${s.seed}:${key}`)/4294967296;
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const clone=x=>JSON.parse(JSON.stringify(x));
export const CAP_NAMES={energy:'Power',water:'Water',food:'Food',logistics:'Ports & rail',talent:'Skills',institutions:'Execution',minerals:'Minerals',refining:'Processing',manufacturing:'Factories',compute:'Sovereign compute',labs:'Research base'};
export const GOODS={materials:'Processed materials',equipment:'Chips & equipment',cloud:'Cloud compute',energy:'Energy',food:'Food',freight:'Freight'};
const GOOD_CAP={materials:'refining',equipment:'manufacturing',cloud:'compute',energy:'energy',food:'food',freight:'logistics'};
const WEIGHT={india:1.35,usa:1.65,china:2.1,germany:1,france:.8,saudi:.65,uae:.45,japan:1.05,korea:.85,australia:.7,indonesia:.9,brazil:1};
export const ACTORS={
 aster:{name:'Aster Cloud',sector:'cloud',interest:'Proprietary cloud contracts',home:'usa',power:57,assets:30},
 meridian:{name:'Meridian Machines',sector:'equipment',interest:'Equipment licences and royalties',home:'japan',power:53,assets:32},
 helix:{name:'Helix Materials',sector:'materials',interest:'High-margin processing concessions',home:'china',power:52,assets:28},
 bluewave:{name:'BlueWave Freight',sector:'freight',interest:'Control of port slots',home:'uae',power:47,assets:27},
 grainvault:{name:'GrainVault',sector:'food',interest:'Long-term food offtake',home:'brazil',power:46,assets:27},
 northgrid:{name:'NorthGrid Energy',sector:'energy',interest:'Guaranteed returns on grid assets',home:'saudi',power:50,assets:30},
 atlas:{name:'Atlas Industries',sector:'equipment',interest:'Domestic protection and public contracts',home:null,power:42,assets:24}
};
export function player(s){return s.world.nations[s.countryId];}
function makeNation(id){const c=COUNTRIES[id],v=c.starting;return {
 id,caps:{energy:v.energy,water:v.water,food:v.food,logistics:v.logistics,talent:v.technology,institutions:v.governance,minerals:v.resources,refining:v.processing,manufacturing:v.factories,compute:round(v.connectivity*.30),labs:round(v.technology*.45)},
 cash:c.budget+5,debt:0,prosperity:round(32+mean([v.factories,v.logistics,v.food,v.technology])*.34),mandate:67,environment:76,
 ip:0,science:0,knowhow:round(v.technology*.50),innovationOutput:0,captured:0,royalties:0,
 supplier:id==='china'?'usa':'china',concentration:id==='china'?22:48,lockin:5,diversification:0,importBoost:0,contracts:[],projects:[],completed:[],policy:[],
 relationships:Object.fromEntries(Object.keys(COUNTRIES).filter(k=>k!==id).map(k=>[k,55])),
 corporate:38,stress:{energy:0,water:0,food:0,talent:0},output:0,unitCost:1,restrictionLoss:0,ledger:null,settled:0
 };}
export function createGame(countryId='india',seed=2040){
 if(!COUNTRIES[countryId])throw Error('Unknown country');
 if(!Number.isSafeInteger(Number(seed))||Number(seed)<1||Number(seed)>2147483647)throw Error('Invalid scenario seed');
 const s={version:VERSION,countryId,seed:Number(seed),turn:0,world:{nations:Object.fromEntries(Object.keys(COUNTRIES).map(id=>[id,makeNation(id)])),firms:clone(ACTORS),markets:{},restrictions:[],priceWarUntil:-1,frontier:0,news:[],shocks:{}},history:[],lastResult:null};
 for(const f of Object.values(s.world.firms))f.relationships=Object.fromEntries(Object.keys(COUNTRIES).map(id=>[id,55]));
 clearMarkets(s);for(const n of Object.values(s.world.nations)){productiveState(s,n);}s.start=metrics(s);return s;
}
export const ACTIONS={
 ai:{title:'Build sovereign AI',cost:7,duration:3,tag:'AI',gain:{compute:15,labs:5},upside:'Own compute; research runs faster.',downside:'Imported chips; lasting power and water demand.'},
 research:{title:'Back university labs',cost:5,duration:3,tag:'Science',gain:{labs:15,talent:4},upside:'More discoveries and domestically owned IP.',downside:'No factory output until engineers scale it.'},
 pilot:{title:'Scale a pilot line',cost:5,duration:2,tag:'Industry',gain:{manufacturing:7,refining:6},upside:'Turn owned IP into process know-how.',downside:'Needs skills, equipment and reliable utilities.'},
 factory:{title:'Build a magnet cluster',cost:7,duration:4,tag:'Industry',gain:{manufacturing:15,refining:13},upside:'Own more processing and production.',downside:'Slow, resource hungry; rivals may cut prices.'},
 imports:{title:'Take the cheapest inputs',cost:1,duration:0,tag:'Trade',upside:'Fast output; low-cost Chinese components.',downside:'Concentration and switching costs compound.'},
 diversify:{title:'Sign a supplier compact',cost:4,duration:1,tag:'Diplomacy',gain:{logistics:3},upside:'Australia and Japan open alternative supply.',downside:'Higher prices; switching takes time.'},
 partner:{title:'License a foreign process',cost:3,duration:1,tag:'Partnership',gain:{manufacturing:7,compute:4},upside:'Faster production using Meridian know-how.',downside:'Royalties, foreign IP and equipment lock-in.'},
 grid:{title:'Connect clean power',cost:6,duration:3,tag:'Infrastructure',gain:{energy:20},upside:'More power; lower costs across industry.',downside:'Capital tied up for eighteen months.'},
 water:{title:'Reuse industrial water',cost:5,duration:2,tag:'Infrastructure',gain:{water:20},upside:'Protect farms, homes and industrial cooling.',downside:'Less money for immediate expansion.'},
 freight:{title:'Unclog ports and rail',cost:5,duration:3,tag:'Infrastructure',gain:{logistics:19},upside:'Cheaper inputs and better export margins.',downside:'Construction competes for equipment and skills.'},
 food:{title:'Back farms and storage',cost:4,duration:2,tag:'Society',gain:{food:18,water:3},upside:'Reduce food bills and harvest vulnerability.',downside:'Industrial programmes wait.'},
 skills:{title:'Fund skills and housing',cost:4,duration:2,tag:'Society',gain:{talent:13,institutions:8},upside:'Engineers stay; projects execute faster.',downside:'No immediate production capacity.'},
 welfare:{title:'Protect household budgets',cost:2,duration:0,tag:'Society',upside:'Immediate public support and demand.',downside:'Temporary help; bottlenecks remain.'},
 regulate:{title:'Enforce open access',cost:2,duration:0,tag:'Institutions',upside:'Curb monopoly rents; loosen cloud lock-in.',downside:'Incumbents may defer their next investment.'},
 concede:{title:'Give Atlas exclusive rights',cost:0,duration:1,tag:'Corporate',gain:{manufacturing:10},upside:'Private finance delivers factories quickly.',downside:'Tax holidays and corporate bargaining power.'},
 bargain:{title:'Require shared technology',cost:3,duration:2,tag:'Corporate',gain:{manufacturing:8,refining:4},upside:'Co-invest with domestic firms; retain control.',downside:'Smaller investment; needs credible institutions.'},
 conserve:{title:'Cap industrial consumption',cost:0,duration:0,tag:'Resources',upside:'Ease power and water stress this half-year.',downside:'Factories sell less; new projects wait.'},
 royalties:{title:'License our IP abroad',cost:0,duration:0,tag:'Science',upside:'Monetise discoveries without building plants.',downside:'Foreign manufacturers capture most value.'},
 repay:{title:'Rebuild fiscal room',cost:0,duration:0,tag:'Finance',upside:'Use revenue to retire debt and restore trust.',downside:'No new capacity; growth can stall.'}
};
const DILEMMAS=[
 ['ai','The intelligence race','Your cabinet wants a national AI programme. Who should own the capacity?',['ai','partner','skills']],
 ['industry','The price of independence','Manufacturers can buy cheap components today, or build a more difficult alternative.',['imports','factory','diversify']],
 ['power','Who gets the next megawatt?','Homes, factories and compute clusters want the same grid connections.',['grid','conserve','imports']],
 ['science','A discovery is not a business','Researchers see a promising material. Scaling it is another problem entirely.',['research','pilot','royalties']],
 ['water','The watershed bargain','Industrial cooling and agriculture are drawing from the same water system.',['water','food','conserve']],
 ['corporate','The company at the cabinet table','Atlas offers private capital, if it receives exclusive operating rights.',['concede','bargain','regulate']],
 ['freight','An economy waiting at the port','Freight delays eat margins. BlueWave offers priority access at a price.',['freight','partner','diversify']],
 ['social','The cost of ambition','Voters want cheaper food and housing. Your industrial lobby wants more investment.',['food','skills','welfare']],
 ['research','Who keeps the invention?','More science, a domestic pilot, or royalties from foreign factories?',['research','pilot','royalties']],
 ['trade','A world of conditional access','Supplier agreements promise low prices. Their fine print outlasts this government.',['imports','diversify','regulate']],
 ['execution','The engineering bottleneck','Money is available, but skilled teams and project managers are scarce.',['skills','pilot','partner']],
 ['energy','Capacity has a running cost','A new investment round forces a choice between ambition and the foundations.',['ai','grid','water']],
 ['industry2','The factory frontier','Global buyers reward cost and reliability. National flags do not earn a premium.',['factory','freight','imports']],
 ['finance','The next government inherits this','How much unfinished ambition should you carry into the next decade?',['repay','bargain','research']]
];
export function getEvent(s){
 if(s.turn>=28)return null;const n=player(s);let index;
 if(s.turn<3)index=s.turn;else {const block=Math.floor((s.turn-3)/13);const deck=Array.from({length:13},(_,i)=>i+1).sort((a,b)=>hash(`${s.seed}:deck:${block}:${a}`)-hash(`${s.seed}:deck:${block}:${b}`));index=deck[(s.turn-3)%13];}
 let [id,title,text,choices]=DILEMMAS[index];
 if(s.turn%4===3 && n.stress.water>8){[id,title,text,choices]=['drought','The river cannot serve everyone','Cooling demand and farms exceed local water supply. Food prices and public anger are rising.',['water','conserve','welfare']];}
 else if(s.turn%4===3 && n.debt>12){[id,title,text,choices]=['debt','The bill comes due','Debt service is squeezing the budget. Investors question the next megaproject.',['repay','concede','welfare']];}
 else if(s.turn%4===3 && restrictionExposure(s,n)>.08){[id,title,text,choices]=['restriction','Your supplier changes the terms','Export controls hit concentrated buyers hardest. Your factories need a response.',['diversify','pilot','imports']];}
 if(s.turn>=25){[id,title,text,choices]=['endgame','What can you finish by 2040?','There is little time left. Protect gains, earn royalties, or commission a fast partnership.',['repay','royalties','partner']];}
 return {id,title,text,choices,half:halfLabel(s.turn)};
}
export function getOptions(s){const e=getEvent(s);if(!e)return [];const n=player(s);const opts=e.choices.map(id=>describeAction(s,n,id));if(!opts.some(x=>x.available))opts[2]=describeAction(s,n,'conserve');return opts;}
export function describeAction(s,n,id){const a=ACTIONS[id];if(!a)throw Error('Unknown action');const duration=a.duration+(a.duration>1&&n.caps.institutions<40?1:0);let cost=a.cost;
 if(['ai','factory','pilot','grid','freight'].includes(id))cost=round(cost*(.82+.18*(s.world.markets.equipment?.price||1)));
 return {...a,...(id==='imports'&&n.id==='china'?{upside:'Fast output from lower-cost foreign equipment.',downside:'Foreign toolchains and switching costs compound.'}:{}),id,cost,duration,available:n.cash>=cost,financing:fundingQuote(s,n,cost,n.cash>=cost?'full':'gap'),afterHorizon:s.turn+duration>28,detail:id==='royalties'?(n.ip?`${n.ip} owned IP available for licensing.`:'No owned IP yet. This earns no royalties.'):duration?`Operational ${halfLabel(s.turn+duration-1)}${s.turn+duration>28?' (after the horizon)':''}.`:'Takes effect this half-year.'};}
// Voluntary project credit, separate from the legacy emergency bill facility.
export const CREDIT_RATE=.035;
const cents=x=>Math.round(x*100);
function fundingQuote(s,n,cost,mode){
 const recent=n.id===s.countryId?s.history.slice(-3).map(h=>h.ledger.tax):[];
 const tax=round(recent.length?mean(recent):(n.ledger?.tax??(3.2+n.prosperity*.025+n.captured*.018+(COUNTRIES[n.id].budget-9)*.22)));
 const limit=round(Math.min(tax*6,tax*.35/CREDIT_RATE)),room=round(Math.max(0,limit-n.debt));
 const amount=mode==='full'?cost:round(Math.max(0,cost-n.cash));
 const eligible=amount>0&&cents(amount)<=cents(room);
 return {mode,amount,eligible,rate:CREDIT_RATE,creditLimit:limit,creditRoom:room,taxBaseline:tax,
  nextInterest:round((n.debt+amount)*CREDIT_RATE),addedInterest:round(amount*CREDIT_RATE),firstInterestTurn:s.turn+1,
  reason:amount<=0?'No funding gap.':eligible?'':`Loan needs ${amount}; remaining project credit is ${room}. Repay debt or choose a cheaper policy.`};
}
export function financingQuote(s,id,mode='gap'){
 if(!['gap','full'].includes(mode))throw Error('Unknown financing mode');
 const a=describeAction(s,player(s),id);return fundingQuote(s,player(s),a.cost,mode);
}
// Preserve old string actions and make financing part of deterministic saved replay.
export function historyChoice(h){return h.financing?{id:h.action,financing:h.financing.mode}:h.action;}
function addCap(n,key,v){n.caps[key]=round(clamp(n.caps[key]+v));}
function schedule(s,n,id,a){n.projects.push({id:`${n.id}:${s.turn}:${id}`,action:id,label:a.title,started:s.turn,due:s.turn+a.duration,work:a.duration,gain:clone(a.gain||{})});}
function enact(s,n,id){const a=describeAction(s,n,id);if(!a.available)throw Error('Choice unavailable');n.cash=round(n.cash-a.cost);n.policy.push({turn:s.turn,id});let message='',dependency='';
 if(a.duration)schedule(s,n,id,a);
 if(id==='ai'){n.concentration=clamp(n.concentration+3);dependency='Sovereign models still need imported chips and maintenance.';}
 if(id==='imports'){
  n.importBoost=clamp(n.importBoost+13,0,42);n.concentration=clamp(n.concentration+9,0,95);n.lockin=clamp(n.lockin+7);
  addCap(n,'manufacturing',2);n.prosperity=clamp(n.prosperity+1.15);n.relationships[n.supplier]=clamp((n.relationships[n.supplier]||55)+3);
  message='Cheap inputs lift production now.';dependency=`${COUNTRIES[n.supplier].name} sourcing deepens; switching becomes more expensive.`;
 }
 if(id==='partner'){
  n.contracts.push({firm:'meridian',until:s.turn+8,fee:.42,access:10});n.lockin=clamp(n.lockin+7);n.corporate=clamp(n.corporate+3);n.relationships.japan=clamp((n.relationships.japan||55)+4);
  dependency='Eight-half-year equipment licence: 0.42 capital each turn; foreign IP.';
 }
 if(id==='concede'){n.contracts.push({firm:'atlas',until:s.turn+10,fee:.55,access:0});n.corporate=clamp(n.corporate+12);dependency='Atlas receives ten half-years of tax concessions: 0.55 each turn.';}
 if(id==='bargain'){n.corporate=clamp(n.corporate+(n.caps.institutions<45?4:-4));n.knowhow=clamp(n.knowhow+2);}
 if(id==='diversify'){dependency=`Switching costs ${round(n.lockin*.025)} capital while supplier concentration falls gradually.`;}
 if(id==='welfare'){n.mandate=clamp(n.mandate+8);n.prosperity=clamp(n.prosperity+.5);message='Household relief buys political time.';}
 if(id==='regulate'){
  const strong=n.caps.institutions>=50;n.corporate=clamp(n.corporate-(strong?12:6));n.lockin=clamp(n.lockin-9);addCap(n,'institutions',2);
  const firm=s.world.firms.aster;firm.power=clamp(firm.power-2);firm.relationships[n.id]=clamp(firm.relationships[n.id]-9);
  message=strong?'Open-access rules weaken incumbent rents.':'Weak enforcement limits the open-access rules.';
 }
 if(id==='royalties'){const earned=round(n.ip*1.1);n.royalties=round(n.royalties+earned);n.cash=round(n.cash+earned);n.ipLicensed=n.ip;n.mandate=clamp(n.mandate+1);message=`Foreign manufacturers pay ${earned} in IP royalties; domestic production does not rise.`;}
 if(id==='repay'){const paid=Math.min(n.cash*.45,n.debt);n.cash=round(n.cash-paid);n.debt=round(n.debt-paid);n.mandate=clamp(n.mandate+2);message=`Retired ${round(paid)} of debt.`;}
 return {action:id,cost:a.cost,option:a,message,dependency};
}
function mature(s,n,notes){const active=[];for(const p of n.projects){
 // Work uses institutional capacity and finite engineering teams, rather than moving dates by a random roll.
 const congestion=Math.max(.55,1-Math.max(0,n.projects.length-3)*.12);p.work=round(p.work-congestion);
 if(p.work>.01){p.due=s.turn+1+Math.ceil(p.work);active.push(p);continue;}
 const a=p.action;let scale=1;
 if(a==='pilot'){scale=clamp((n.caps.talent+n.caps.institutions)/120,.3,1);n.knowhow=round(clamp(n.knowhow+(n.ip?15:5)*scale));}
 if(a==='factory')scale=clamp((n.caps.talent+40)/110,.4,1);
 for(const [k,g] of Object.entries(p.gain))addCap(n,k,g*scale);
 if(a==='diversify'){n.diversification=clamp(n.diversification+17,0,70);n.concentration=clamp(n.concentration-14,0,95);n.lockin=clamp(n.lockin-4);for(const k of ['australia','japan'])n.relationships[k]=clamp((n.relationships[k]||55)+7);}
 if(a==='grid'||a==='water')n.environment=clamp(n.environment+5);
 n.completed.push({...p,finished:s.turn+1});notes.push(`${p.label} online${scale<1?` at ${Math.round(scale*100)}% effectiveness (skills gap)`:''}.`);
 }n.projects=active;}
export function supply(n,g){const c=n.caps;const power=clamp((c.energy+30)/(28+c.manufacturing*.4+c.compute*.55+c.refining*.15),.25,1.2);const water=clamp((c.water+25)/(20+c.manufacturing*.25+c.compute*.42+c.refining*.2),.25,1.2);
 let x=c[GOOD_CAP[g]];
 if(g==='materials')x=Math.min(c.minerals+25,c.refining)*Math.min(power,water);
 if(g==='equipment')x=c.manufacturing*(.45+n.knowhow/130)*Math.min(power,water);
 if(g==='cloud')x=c.compute*clamp(c.talent/65,.35,1.2)*Math.min(power,water);
 return Math.max(1,x)*WEIGHT[n.id];}
function demand(n,g){const c=n.caps;const base={materials:25+c.manufacturing*.45,equipment:24+c.compute*.5+c.refining*.2,cloud:20+c.labs*.5,energy:28+c.manufacturing*.4+c.compute*.55+c.refining*.15,food:52+(n.prosperity-50)*.12,freight:35+c.manufacturing*.3};return base[g]*WEIGHT[n.id];}
function clearMarkets(s){const nations=Object.values(s.world.nations);const markets={};for(const g of Object.keys(GOODS)){
 const gross=nations.reduce((a,n)=>a+supply(n,g),0)+Object.values(s.world.firms).filter(f=>f.sector===g).reduce((a,f)=>a+f.assets*.32,0);
 const wanted=nations.reduce((a,n)=>a+demand(n,g),0);const withheld=s.world.restrictions.filter(r=>r.good===g&&r.until>s.turn).reduce((a,r)=>a+supply(s.world.nations[r.by],g)*r.severity*.35,0);
 const shock=s.world.shocks[g]||0;const available=gross*(1-shock)-withheld;
 const ratio=wanted/Math.max(1,available);const price=clamp(.6+.45*ratio,.65,2.4)*(g==='materials'&&s.world.priceWarUntil>s.turn?.82:1);
 markets[g]={supply:round(available),demand:round(wanted),price:round(price),fill:round(clamp(available/wanted,.35,1)),controller:Object.keys(COUNTRIES).sort((a,b)=>supply(s.world.nations[b],g)-supply(s.world.nations[a],g))[0]};
 }s.world.markets=markets;}
export function restrictionExposure(s,n){return s.world.restrictions.filter(r=>r.until>s.turn&&r.by!==n.id).reduce((sum,r)=>{const relationship=n.relationships[r.by]??55;const share=r.by===n.supplier?n.concentration/100:(1-n.diversification/100)*.35;return sum+r.severity*share*(1-n.diversification/130)*(relationship>=75?.55:1);},0);}
export function productiveState(s,n){const c=n.caps,rest=clamp(restrictionExposure(s,n),0,.75);const partner=n.contracts.filter(x=>x.until>s.turn).reduce((a,x)=>a+x.access,0);
 const heat=s.world.shocks.water||0;const conserve=n.policy.at(-1)?.turn===s.turn&&n.policy.at(-1)?.id==='conserve';
 const powerNeed=28+c.manufacturing*.4+c.compute*.55+c.refining*.15;const waterNeed=20+c.manufacturing*.25+c.compute*.42+c.refining*.2;
 const power=clamp((c.energy+(conserve?15:0))/powerNeed,.25,1);const water=clamp((c.water*(1-heat)+(conserve?12:0))/waterNeed,.25,1);
 const foodSupply=c.food*(s.world.markets.food?.fill||1)*(.7+.3*water);const foodStress=Math.max(0,53-foodSupply);
 const talentStress=Math.max(0,(c.compute*.4+c.labs*.4+c.manufacturing*.18)-c.talent);
 n.stress={energy:round(Math.max(0,powerNeed-c.energy-(conserve?15:0))),water:round(Math.max(0,waterNeed-c.water*(1-heat)-(conserve?12:0))),food:round(foodStress),talent:round(talentStress)};
 const domestic=Math.min(c.refining+18,c.minerals+28);const imports=(30+n.importBoost)*(1-rest)*(s.world.markets.materials?.fill||1);
 const inputs=clamp((domestic+imports)/(c.manufacturing+30),.25,1);
 const equipment=clamp((n.knowhow+35+partner)/(c.manufacturing+18),.45,1);
 n.unitCost=round(clamp(1.9-c.logistics*.006-c.energy*.003-n.knowhow*.003+(.25*(s.world.markets.energy?.price||1))+rest*.5-(n.importBoost/160),.55,2.5));
 n.output=round(c.manufacturing*Math.min(power,water,inputs,equipment)*(1-talentStress/180)*(conserve?.78:1));
 n.restrictionLoss=round(rest*100);
 // Research output, IP ownership, process engineering and commercial production are distinct.
 n.innovationOutput=round(Math.min(n.ip*10,n.knowhow,n.output,c.refining+15)*(1-rest));
 n.captured=round(clamp((n.output*.45+n.innovationOutput*.55)*(1-n.corporate*.003)*(n.contracts.some(x=>x.firm==='meridian'&&x.until>s.turn)?.88:1)));
 return {power,water,inputs,equipment,rest};}
function economy(s,n,notes,immediate=0,spending=0,opening=n.cash,projectBorrowing=0){const c=n.caps;const q=productiveState(s,n);
 const scienceRate=c.labs/32*(.45+c.compute/60)*clamp(c.talent/60,.3,1.3)*Math.min(q.power,q.water)*(1-n.stress.talent/150);
 n.science=round(n.science+scienceRate);
 const threshold=10+roll(s,`${n.id}:breakthrough:${n.ip}`)*5;
 if(n.science>=threshold){n.science=round(n.science-threshold);n.ip++;notes.push(`Breakthrough #${n.ip}: owned IP. ${n.knowhow<45?'Pilot engineering is still missing.':'Engineers can now attempt commercial production.'}`);}
 if(n.ip && n.knowhow<85)n.knowhow=round(clamp(n.knowhow+Math.min(c.manufacturing,c.talent)*.002));
 const exports=n.output/n.unitCost*(s.world.priceWarUntil>s.turn&&n.id!=='china'?.9:1);
 const benefit=.1+exports/45+n.captured/90+(n.importBoost*.008)-q.rest*4;
 const pain=(n.stress.energy+n.stress.water)*.022+n.stress.food*.045+n.debt*.015+Math.max(0,60-n.environment)*.012;
 n.prosperity=round(clamp(n.prosperity+benefit*(1-n.prosperity/160)-pain));
 n.environment=round(clamp(n.environment-(c.compute*.006+c.refining*.004+c.manufacturing*.003)+c.energy*.002));
 n.mandate=round(clamp(n.mandate+.1+(n.prosperity-55)*.014-n.stress.food*.07-(n.stress.water+n.stress.energy)*.024-Math.max(0,55-n.environment)*.035-Math.max(0,n.corporate-70)*.025));
 const contractFees=n.contracts.filter(x=>x.until>s.turn).reduce((a,x)=>a+x.fee,0);
 const operations=round(.35+c.compute*.024+c.labs*.013+(c.refining+c.manufacturing)*.003);
 const imports=round((.25+n.importBoost*.018)*(s.world.markets.materials.price)*(1+n.lockin/220)+q.rest*.9);
 const interest=round((n.debt-projectBorrowing)*CREDIT_RATE), emergency=round((n.stress.energy+n.stress.water+n.stress.food)*.012);
 const switching=n.policy.at(-1)?.turn===s.turn&&n.policy.at(-1)?.id==='diversify'?round(n.lockin*.025):0;
 const retirement=n.policy.at(-1)?.turn===s.turn&&n.policy.at(-1)?.id==='repay'?round(opening-spending+immediate-n.cash):0;
 const other=round(operations+imports+interest+emergency+contractFees+switching+retirement);
 const tax=round(3.2+n.prosperity*.025+n.captured*.018+(COUNTRIES[n.id].budget-9)*.22);
 const income=round(tax+immediate);let closing=round(opening+projectBorrowing-spending-other+income);let borrowing=0;
 if(closing<0){borrowing=round(-closing);n.debt=round(n.debt+borrowing);closing=0;notes.push(`Treasury borrowed ${borrowing} to pay operating bills.`);}
 n.cash=closing;
 n.ledger={opening,spending,operations,imports,interest,emergency,contractFees,switching,retirement,other,tax,receipts:immediate,borrowing,income:round(income+borrowing+projectBorrowing),closing};
 if(projectBorrowing){n.ledger.borrowing=round(borrowing+projectBorrowing);n.ledger.projectBorrowing=projectBorrowing;n.ledger.deficitBorrowing=borrowing;}
 n.importBoost=round(Math.max(0,n.importBoost-.9));n.lockin=round(Math.max(0,n.lockin-.15));
 if(n.diversification>0)n.concentration=round(Math.max(8,n.concentration-.15));
 n.contracts=n.contracts.filter(x=>x.until>s.turn);n.settled++;
}
function npcUtility(s,n,id){const c=n.caps;const base={grid:n.stress.energy*.25+(70-c.energy)*.04,water:n.stress.water*.3+(60-c.water)*.035,food:n.stress.food*.35,skills:n.stress.talent*.25+(65-c.institutions)*.035,ai:(75-c.compute)*.05+(n.id==='china'||n.id==='usa'?1.1:0),research:(65-c.labs)*.04,pilot:n.ip*.4+(50-n.knowhow)*.025,factory:(65-c.manufacturing)*.05+(c.refining>65?.6:0),freight:(70-c.logistics)*.06,diversify:n.concentration*.025+restrictionExposure(s,n)*5,imports:n.cash<7?2:.1,repay:n.debt*.2,welfare:(65-n.mandate)*.15};
 return (base[id]||0)+(s.world.markets.materials.price-1)*(id==='factory'?2:0)+roll(s,`${s.turn}:${n.id}:utility:${id}`)*.45;
}
function moveGovernments(s){const news=[];for(const n of Object.values(s.world.nations)){
 if(n.id===s.countryId)continue;
 if(s.turn%3===hash(n.id)%3){const choices=['ai','research','pilot','factory','grid','water','food','freight','skills','diversify','imports','repay','welfare'].filter(id=>describeAction(s,n,id).available).sort((a,b)=>npcUtility(s,n,b)-npcUtility(s,n,a));
 const id=choices[0],before=n.cash;const result=enact(s,n,id);n._spending=result.cost;n._opening=before;
 news.push({actor:n.id,tone:'neutral',text:`${COUNTRIES[n.id].name}: ${ACTIONS[id].title.toLowerCase()}.`,type:id});
 }
 // A large supplier defends credible scale; a restriction also costs its own export income.
 if(n.id==='china'){
 const rivals=Object.values(s.world.nations).filter(x=>x.id!=='china'&&x.completed.filter(p=>p.action==='factory').length>0);
 if(rivals.length&&s.world.priceWarUntil<s.turn&&n.cash>=2){n.cash=round(n.cash-2);n._spending=round((n._spending||0)+2);s.world.priceWarUntil=s.turn+3;news.push({actor:'china',tone:'negative',text:'China cuts materials prices to defend its export market. New domestic plants face thinner margins.',type:'pricewar'});}
 const buyer=Object.values(s.world.nations).filter(x=>x.id!=='china'&&x.supplier==='china'&&x.concentration>65&&x.importBoost>10&&x.relationships.china<80).sort((a,b)=>b.concentration-a.concentration)[0];
 if(buyer&&s.turn>=7&&!s.world.restrictions.some(r=>r.by==='china'&&r.until>s.turn)&&n.caps.refining>65){s.world.restrictions.push({by:'china',good:'materials',until:s.turn+3,severity:.40});n.prosperity=clamp(n.prosperity-.4);news.push({actor:'china',tone:'negative',text:'China tightens material export licences. Concentrated buyers lose access; Chinese exporters also lose sales.',type:'restrict'});}
 }
 if(n.id==='usa'&&n.caps.compute>45&&s.turn%8===6&&s.world.nations.china.caps.compute>30){s.world.restrictions.push({by:'usa',good:'equipment',until:s.turn+2,severity:.15});news.push({actor:'usa',tone:'negative',text:'The US restricts advanced equipment as rival compute capacity expands.',type:'restrict'});}
 }
 const p=player(s);
 if(p.projects.some(x=>x.action==='factory')&&s.turn%5===2){p.relationships.australia=clamp((p.relationships.australia||55)+3);s.world.nations.australia.relationships[s.countryId]=clamp((s.world.nations.australia.relationships[s.countryId]||55)+3);news.push({actor:'australia',tone:'positive',text:'Australia courts your new processing cluster. Its improved relationship makes alternative sourcing more credible.',type:'offer'});}
 return news;}
function moveFirms(s){const news=[];const n=player(s);for(const [id,f] of Object.entries(s.world.firms)){
 const market=s.world.markets[f.sector];const active=Object.values(s.world.nations).flatMap(x=>x.contracts.filter(c=>c.firm===id&&c.until>s.turn));
 f.profit=round(market.price*(1+active.length*.12));f.power=round(clamp(f.power+(active.length*.12)-(n.policy.at(-1)?.id==='regulate'?.25:0)));
 f.relationships[n.id]=round(clamp(f.relationships[n.id]+(n.policy.at(-1)?.id==='concede'?.8:0)));
 if(market.price>1.08&&s.turn%3===hash(id)%3){f.assets=round(f.assets+2.2);news.push({actor:id,tone:'positive',text:`${f.name} expands ${GOODS[f.sector].toLowerCase()} assets to capture high prices. Global supply rises.`,type:'expand'});}
 else if(f.power>58&&active.length&&s.turn%4===0){for(const country of Object.values(s.world.nations))for(const c of country.contracts)if(c.firm===id)c.fee=round(c.fee+.06);news.push({actor:id,tone:'negative',text:`${f.name} reprices tied contracts as its bargaining power grows.`,type:'reprice'});}
 if(id==='aster'&&n.policy.at(-1)?.id==='regulate'&&f.relationships[n.id]<45){f.assets=round(Math.max(12,f.assets-1));news.push({actor:id,tone:'negative',text:'Aster defers a cloud expansion after open-access regulation. Its global capacity falls.',type:'relocate'});}
 if(id==='atlas'&&n.corporate>65){n.corporate=round(clamp(n.corporate+.45));news.push({actor:id,tone:'negative',text:'Atlas uses its exclusive position to lobby for renewed concessions.',type:'lobby'});}
 }return news;}
function setShocks(s){s.world.shocks={};const phase=hash(`${s.seed}:climate-phase`)%6;
 if((s.turn+phase)%9===5){s.world.shocks.water=.17;s.world.shocks.food=.10;return 'A seeded heatwave reduces water and global food supply this half-year.';}
 if((s.turn+phase)%11===7){s.world.shocks.freight=.15;return 'A shipping disruption tightens freight capacity this half-year.';}return '';}
export function metrics(s){const n=player(s);const autonomy=clamp(100-n.concentration*.48-n.lockin*.25-n.restrictionLoss*.35+n.diversification*.3);
 return {prosperity:round(n.prosperity),value:round(n.captured),autonomy:round(autonomy),mandate:round(n.mandate),environment:round(n.environment)};}
export function dependency(s){const n=player(s);return Object.entries(GOODS).map(([id,name])=>{const m=s.world.markets[id];return {id,name,controller:m.controller,price:m.price,fill:m.fill,domestic:round(n.caps[GOOD_CAP[id]]),risk:round(clamp(id==='materials'?n.concentration+n.lockin*.2-n.diversification*.5:100-n.caps[GOOD_CAP[id]]+n.lockin*.12)),substitute:id==='materials'?'Recycle, diversify, process at home':id==='cloud'?'Open models, domestic compute':id==='equipment'?'Pilot engineering, shared licences':'Infrastructure or alternative imports'};});}
function advanceTurn(original,choiceId,hold=false,unrestricted=false){
 if(original.turn>=28)throw Error('Game already finished');
 let financing=null;
 if(!hold&&typeof choiceId==='object'&&choiceId!==null){
  if(Object.keys(choiceId).some(k=>!['id','financing'].includes(k))||!['gap','full'].includes(choiceId.financing))throw Error('Invalid financing request');
  financing=choiceId.financing;choiceId=choiceId.id;
 }
 const opts=getOptions(original);const opt=opts.find(x=>x.id===choiceId)||(unrestricted&&ACTIONS[choiceId]?describeAction(original,player(original),choiceId):null)||(choiceId==='repay'&&player(original).debt>0?describeAction(original,player(original),'repay'):null);
 const quote=!hold&&opt&&financing?financingQuote(original,choiceId,financing):null;
 if(!hold&&(!opt||(financing?!quote.eligible:!opt.available)))throw Error(quote?.reason||'Choice unavailable');
 const s=clone(original),n=player(s),opening=n.cash,before=metrics(s),beforeMarkets=clone(s.world.markets);const notes=[];
 const projectBorrowing=quote?.amount||0;
 if(projectBorrowing){n.cash=round(n.cash+projectBorrowing);n.debt=round(n.debt+projectBorrowing);notes.push(`Borrowed ${projectBorrowing} for this decision. Interest starts ${halfLabel(s.turn+1)} at 3.5% per half-year.`);}
 const r=hold?{action:'hold',cost:0,option:{title:'Maintain committed plans',duration:0},message:'No new discretionary policy.',dependency:''}:enact(s,n,choiceId);if(hold)n.policy.push({turn:s.turn,id:'hold'});const receipts=choiceId==='royalties'?round(n.cash-(opening-r.cost)):0;
 const shock=setShocks(s);const countries=moveGovernments(s),companies=moveFirms(s);
 for(const x of Object.values(s.world.nations))mature(s,x,x.id===s.countryId?notes:[]);
 clearMarkets(s);
 for(const x of Object.values(s.world.nations)){
  economy(s,x,x.id===s.countryId?notes:[],x.id===s.countryId?receipts:0,x.id===s.countryId?r.cost:(x._spending||0),x.id===s.countryId?opening:(x._opening??round(x.cash+(x._spending||0))),x.id===s.countryId?projectBorrowing:0);delete x._opening;delete x._spending;
 }
 clearMarkets(s);s.world.frontier=round(mean(Object.values(s.world.nations).map(x=>x.ip)));s.world.restrictions=s.world.restrictions.filter(x=>x.until>s.turn);
 const after=metrics(s);const delta=Object.fromEntries(Object.keys(before).map(k=>[k,round(after[k]-before[k])]));
 const news=[...countries,...companies];s.world.news=news;
 const changed=Object.keys(GOODS).sort((a,b)=>Math.abs(s.world.markets[b].price-beforeMarkets[b].price)-Math.abs(s.world.markets[a].price-beforeMarkets[a].price))[0];
 const result={turn:s.turn,half:halfLabel(s.turn),event:hold?'Committed-plan outlook':getEvent(original).title,action:hold?'hold':choiceId,choice:r.option.title,domestic:r.message||`${r.option.title}: ${r.option.duration?'capital committed; construction has begun.':'policy took effect.'}`,dependency:r.dependency,notes,shock,delta,stress:clone(n.stress),ledger:clone(n.ledger),countries,companies,global:`${GOODS[changed]} price ${beforeMarkets[changed].price.toFixed(2)} → ${s.world.markets[changed].price.toFixed(2)}×; supply ${s.world.markets[changed].supply}, demand ${s.world.markets[changed].demand}.`,later:n.projects.map(p=>({label:p.label,due:p.due})),output:n.output,unitCost:n.unitCost,ip:n.ip,captured:n.captured};
 if(projectBorrowing)result.financing={mode:financing,amount:projectBorrowing,rate:CREDIT_RATE,firstInterestTurn:original.turn+1};
 s.history.push(result);s.lastResult=result;s.turn++;return s;
}
export function takeTurn(original,choiceId){return advanceTurn(original,choiceId);}
// Conditional projection only: let queued projects, upkeep and the seeded world run,
// with no new player investments, subsidies, rationing or debt repayments.
// Virtual states never enter a saved campaign or its history.
export function committedOutlook(original,halves=6){const points=[];let s=original;
 const count=Math.max(0,Math.min(8,Math.floor(halves)));
 for(let i=0;i<count&&s.turn<TOTAL_TURNS;i++){const completed=player(s).completed.length;s=advanceTurn(s,null,true);const n=player(s);points.push({turn:s.turn,score:score(s).total,metrics:metrics(s),debt:n.debt,cash:n.cash,interest:n.ledger.interest,tax:n.ledger.tax,completed:n.completed.slice(completed).map(p=>p.label)});}
 return points;}

// One scoring rule for the outcome and the read-only historical chart.
export function progressScore(countryId,start,m,debt=0){const w=COUNTRIES[countryId].weights;
 const progress=(m.prosperity-start.prosperity)*w.prosperity+(m.value-start.value)*w.value+(m.autonomy-start.autonomy)*w.resilience+(m.mandate-start.mandate)*w.public;
 return Math.round(clamp(50+progress*1.15-debt*.6-Math.max(0,55-m.environment)*.4));}
export function score(s){const n=player(s),m=metrics(s),start=s.start;
 const total=progressScore(s.countryId,start,m,n.debt);
 const endings=[];const add=(test,type,title,text)=>{if(test)endings.push({type,title,text});};
 add(n.corporate>74,'capture','The company state','Exclusive deals delivered capacity. Corporate power now constrains the government.');
 add(n.mandate<35||n.environment<43,'backlash','The price at home','Industrial ambition eroded the social or environmental foundations beneath it.');
 add(n.debt>15,'fiscal','Sovereign, on borrowed time','National assets grew while debt service consumed future choices.');
 add(n.ip>=3&&!n.completed.some(p=>p.action==='pilot')&&n.knowhow<45,'research','Invented here. Made elsewhere.','Your laboratories produced IP faster than local industry could turn it into production.');
 add(n.completed.some(p=>p.action==='factory')&&n.output<35,'substitution','The empty industrial park','Domestic plants were built, but missing complements left them uncompetitive.');
 add(n.concentration>75&&m.prosperity>start.prosperity+4,'fragile','Prosperity on permission','Cheap imports drove growth. Concentrated suppliers retained the power to interrupt it.');
 add(n.innovationOutput>32&&n.captured>35&&n.output>55,'leadership','The industrial frontier','Research, engineering and production reinforced one another, creating domestic value.');
 add(n.diversification>=30&&m.autonomy>65,'diversification','Many partners. More options.','Supplier compacts reduced concentration without requiring complete self-sufficiency.');
 add(m.prosperity>65&&n.concentration<76&&n.debt<10&&n.output>35,'interdependence','Profitable interdependence','Reliable imports, capable institutions and competitive production paid off together.');
 add(m.prosperity>65&&n.caps.compute<40,'prosperity','A good life without the frontier','Prosperity came from useful capabilities and trade rather than owning every technology.');
 add(true,'balanced','A nation still negotiating','You gained capabilities while leaving real trade-offs for the next government.');
 const ending=endings[0];const milestones=s.history.filter(h=>h.notes.some(t=>t.includes('Breakthrough')||t.includes('online'))||h.dependency).filter((_,i,a)=>i===0||i===Math.floor(a.length/2)||i===a.length-1);
 return {total,ending,endings,metrics:m,ip:n.ip,production:n.output,captured:n.captured,knowhow:n.knowhow,unitCost:n.unitCost,debt:n.debt,corporate:n.corporate,milestones,pending:n.projects.length};}
export const POLICIES={
 ai:['ai','research','partner','pilot','factory','imports','concede','royalties','repay','welfare','skills','grid','water','food','freight','diversify','regulate','bargain','conserve'],
 imports:['imports','partner','concede','royalties','welfare','research','repay','food','conserve','diversify','skills','ai','grid','water','factory','pilot','freight','bargain','regulate'],
 infrastructure:['grid','water','freight','food','skills','pilot','bargain','diversify','repay','regulate','factory','research','ai','imports','partner','welfare','conserve','royalties','concede'],
 science:['research','ai','royalties','skills','partner','repay','regulate','diversify','grid','water','food','freight','conserve','pilot','factory','welfare','bargain','imports','concede'],
 industry:['factory','pilot','bargain','skills','grid','water','freight','food','repay','diversify','research','ai','partner','imports','regulate','welfare','royalties','concede','conserve'],
 network:['diversify','partner','bargain','freight','food','skills','grid','water','regulate','repay','royalties','pilot','imports','factory','research','ai','welfare','conserve','concede'],
 corporate:['concede','partner','imports','bargain','royalties','welfare','repay','research','ai','food','grid','water','skills','factory','pilot','freight','conserve','diversify','regulate'],
 austerity:['repay','conserve','royalties','regulate','welfare','food','skills','diversify','partner','bargain','water','freight','grid','imports','factory','pilot','research','ai','concede']
};
export function choosePolicy(s,policy='adaptive'){const opts=getOptions(s).filter(x=>x.available);if(policy==='random')return opts[hash(`${s.seed}:${s.turn}:random`)%opts.length].id;if(policy==='adversarial')return opts.sort((a,b)=>b.cost-a.cost||b.duration-a.duration)[0].id;
 if(policy==='adaptive'){const n=player(s);const need=n.stress.water>8?'water':n.stress.energy>8?'grid':n.stress.food>10?'food':n.debt>8?'repay':n.ip&&n.knowhow<55?'pilot':n.caps.compute<35?'ai':n.caps.manufacturing<65?'factory':'diversify';if(opts.some(x=>x.id===need))return need;policy='infrastructure';}
 const ranking=POLICIES[policy]||POLICIES.infrastructure;return opts.sort((a,b)=>ranking.indexOf(a.id)-ranking.indexOf(b.id))[0].id;}
export function runWithPolicy(country='india',seed=2040,policy='adaptive'){let s=createGame(country,seed);while(s.turn<28)s=takeTurn(s,choosePolicy(s,policy));return s;}
export function validSave(x){try{if(x?.version!==VERSION||!COUNTRIES[x.countryId]||!Number.isSafeInteger(x.seed)||x.seed<1||x.seed>2147483647||!Number.isInteger(x.turn)||x.turn<0||x.turn>28||x.history.length!==x.turn)return false;let s=createGame(x.countryId,x.seed);for(const h of x.history){if(h.turn!==s.turn)return false;s=takeTurn(s,historyChoice(h));}return JSON.stringify(s)===JSON.stringify(x);}catch{return false;}}

// Internal settlement primitive for the separately validated 2035 campaign.
export function settlePolicy(s,choice){return advanceTurn(s,choice,false,true);}
export function settleHold(s){return advanceTurn(s,null,true);}
