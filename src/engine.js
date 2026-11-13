/* CHOKEPOINT 2040: deterministic, fictional educational strategy simulation.
 * No network, tracking, external dependencies or real economic forecasts.
 */
export const START_YEAR=2027;
export const TOTAL_TURNS=28;
export const QUARTERS_PER_TURN=2;
export const CAPITAL_CAP=13;
export const STAGES=['resources','processing','technology','factories','logistics','energy','water','food','governance','connectivity'];
export const STAGE_NAMES={resources:'Raw materials',processing:'Processing',technology:'Industrial know-how',factories:'Manufacturing',logistics:'Logistics',energy:'Energy',water:'Water',food:'Food',governance:'Execution',connectivity:'Connectivity'};
export const STAGE_SUPPLIERS={resources:'Australia / Brazil',processing:'China',technology:'US / Japan / EU',factories:'China / East Asia',logistics:'Global shipping firms',energy:'Gulf / global markets',water:'Local watershed',food:'Global grain markets',governance:'Domestic institutions',connectivity:'Global cloud & networks'};
export const ACTORS={
 aster:{name:'Aster Cloud',kind:'Cloud & AI giant',power:'Compute access, data centres, AI tooling',icon:'◈'},
 helix:{name:'Helix Materials',kind:'Minerals & processing giant',power:'Metals, licences and specialist facilities',icon:'⬡'},
 bluewave:{name:'BlueWave Logistics',kind:'Global shipping consortium',power:'Port slots, freight rates and trade routes',icon:'≋'},
 grainvault:{name:'GrainVault',kind:'Global agrifood trader',power:'Food storage, ports and commodity supply',icon:'❖'},
 meridian:{name:'Meridian Foundries',kind:'Semiconductor & automation giant',power:'Specialist chips and factory equipment',icon:'▧'},
 northgrid:{name:'NorthGrid Energy',kind:'Energy & grid operator',power:'Grid connections, infrastructure and electricity',icon:'ϟ'},
 linkspan:{name:'LinkSpan Networks',kind:'Connectivity platform',power:'Subsea cables, satellite capacity and fibre',icon:'◎'},
 union:{name:'Industrial Workers Federation',kind:'National organised labour',power:'Collective action and worker representation',icon:'✦'},
 markets:{name:'Global Bond Syndicate',kind:'Capital markets',power:'Debt pricing and capital mobility',icon:'◇'}
};
const C=(name,flag,region,objective,starting,budget,weights)=>({name,flag,region,objective,starting,budget,weights});
export const COUNTRIES={
 india:C('India','🇮🇳','South Asia','Lift value capture while keeping industry affordable',{resources:48,processing:30,technology:56,factories:44,logistics:44,energy:45,water:41,food:67,governance:32,connectivity:69},9,{prosperity:.34,resilience:.25,value:.29,public:.12}),
 usa:C('United States','🇺🇸','North America','Rebuild strategic industry without losing innovation leadership',{resources:60,processing:47,technology:89,factories:62,logistics:74,energy:78,water:60,food:78,governance:65,connectivity:90},9,{prosperity:.28,resilience:.29,value:.30,public:.13}),
 china:C('China','🇨🇳','East Asia','Preserve industrial scale while escaping technology chokepoints',{resources:66,processing:90,technology:69,factories:92,logistics:84,energy:74,water:53,food:60,governance:72,connectivity:79},8,{prosperity:.29,resilience:.31,value:.31,public:.09}),
 germany:C('Germany','🇩🇪','Europe','Protect high-value production against supply and energy shocks',{resources:32,processing:66,technology:85,factories:77,logistics:83,energy:43,water:72,food:72,governance:77,connectivity:84},8,{prosperity:.34,resilience:.27,value:.29,public:.10}),
 france:C('France','🇫🇷','Europe','Convert research, energy and engineering into competitive industry',{resources:38,processing:61,technology:78,factories:70,logistics:72,energy:74,water:69,food:78,governance:70,connectivity:84},8,{prosperity:.29,resilience:.26,value:.30,public:.15}),
 saudi:C('Saudi Arabia','🇸🇦','Middle East','Turn energy and capital strength into broader industrial value',{resources:77,processing:52,technology:37,factories:40,logistics:65,energy:94,water:25,food:29,governance:57,connectivity:72},11,{prosperity:.24,resilience:.23,value:.42,public:.11}),
 uae:C('United Arab Emirates','🇦🇪','Middle East','Build a resilient global processing and logistics hub',{resources:62,processing:46,technology:52,factories:41,logistics:86,energy:91,water:30,food:33,governance:74,connectivity:86},11,{prosperity:.25,resilience:.30,value:.34,public:.11}),
 japan:C('Japan','🇯🇵','East Asia','Secure inputs while preserving world-class industrial expertise',{resources:23,processing:69,technology:89,factories:82,logistics:86,energy:32,water:80,food:49,governance:84,connectivity:88},8,{prosperity:.30,resilience:.31,value:.31,public:.08}),
 korea:C('South Korea','🇰🇷','East Asia','Keep specialist manufacturing competitive and secure',{resources:25,processing:66,technology:88,factories:89,logistics:82,energy:38,water:74,food:52,governance:77,connectivity:89},8,{prosperity:.34,resilience:.28,value:.29,public:.09}),
 australia:C('Australia','🇦🇺','Oceania','Capture downstream value from resources without overbuilding',{resources:90,processing:36,technology:67,factories:41,logistics:67,energy:83,water:57,food:81,governance:84,connectivity:82},9,{prosperity:.30,resilience:.18,value:.42,public:.10}),
 indonesia:C('Indonesia','🇮🇩','Southeast Asia','Move up the value chain from extraction to manufacturing',{resources:85,processing:63,technology:37,factories:48,logistics:47,energy:66,water:67,food:67,governance:44,connectivity:61},9,{prosperity:.30,resilience:.19,value:.39,public:.12}),
 brazil:C('Brazil','🇧🇷','South America','Develop productive industry from resource and market strengths',{resources:88,processing:51,technology:49,factories:58,logistics:50,energy:79,water:76,food:93,governance:50,connectivity:67},9,{prosperity:.31,resilience:.20,value:.36,public:.13})
};
export const INDICATOR_HELP={
 prosperity:'Economic performance. Strong production and infrastructure help it grow; financing costs, bottlenecks and market disruption drag it down. At 60, it raises capital income.',
 value:'Domestic industrial value retained from research, processing and manufacturing. Higher figures improve your national score; dependent supply chains limit conversion.',
 resilience:'Ability to withstand supply disruption. Driven mainly by your three biggest dependency exposures, alliances and emergency reserves. Higher is safer.',
 public:'Political support for your strategy. Weak support eventually undermines execution; resource shortages and unpopular trade-offs damage it.',
 capital:'Your spendable strategic budget, not an actual currency. Every half-year you pay decision costs, receive income based on prosperity and debt, and may face emergency fees. It cannot exceed 13.',
 alliances:'International partner relationships that reduce exposure. Deals strengthen them, but goodwill decays without maintenance.',
 corporate:'Bargaining power of non-playable firms. Powerful firms can demand concessions, threaten relocation and reduce domestic control.',
 pressure:'Worldwide pressure on a supply-chain stage. Higher means more expensive, less reliable access. Other countries can ease or tighten it.'
};
const clamp=(x,min=0,max=100)=>Math.max(min,Math.min(max,x));
const avg=(arr)=>arr.reduce((a,b)=>a+b,0)/arr.length;
function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
export const halfLabel=(turn)=>`${START_YEAR+Math.floor(turn/2)} · H${turn%2+1}`;
const EVENTS=[
 {id:'minerals',title:'The magnet squeeze',actor:'helix',focus:'processing',threat:10,desc:'A dominant exporter tightens magnet-material licences. Vehicle and robot makers scramble.'},
 {id:'cloudtax',title:'The cloud ultimatum',actor:'aster',focus:'technology',threat:5,desc:'Aster Cloud demands a tax holiday for its next research campus, or it may invest abroad.'},
 {id:'port',title:'Container shock',actor:'bluewave',focus:'logistics',threat:9,desc:'BlueWave raises freight rates after key shipping routes face disruption.'},
 {id:'energy',title:'The power crunch',actor:'northgrid',focus:'energy',threat:9,desc:'Grid constraints make new industrial plants expensive to operate.'},
 {id:'food',title:'The grain squeeze',actor:'grainvault',focus:'food',threat:8,desc:'Two harvest failures tighten global grain supply. Food bills rise before pay cheques do.'},
 {id:'chips',title:'Chip allocations are sold out',actor:'meridian',focus:'technology',threat:8,desc:'Meridian Foundries allocates its latest industrial chips to the highest bidders.'},
 {id:'river',title:'Water rights in dispute',actor:'northgrid',focus:'water',threat:9,desc:'Factories, farms and households compete for scarce water.'},
 {id:'robotics',title:'Robots cross a threshold',actor:'meridian',focus:'factories',threat:5,desc:'A manufacturing rival cuts unit costs with advanced automation. Buyers demand lower prices.'},
 {id:'regulation',title:'A permit backlog',actor:'markets',focus:'governance',threat:7,desc:'Investors complain that industrial approvals are taking longer than construction.'},
 {id:'cables',title:'The cable choke',actor:'linkspan',focus:'connectivity',threat:8,desc:'LinkSpan prioritises high-margin connectivity markets, raising data and industrial network costs.'},
 {id:'bond',title:'Bond desks get nervous',actor:'markets',focus:'governance',threat:6,desc:'International investors demand higher yields from governments funding industrial megaprojects.'},
 {id:'ore',title:'Resource diplomacy',actor:'helix',focus:'resources',threat:7,desc:'A mineral-exporting country renegotiates permits and export terms.'},
 {id:'antitrust',title:'The platform hearing',actor:'aster',focus:'connectivity',threat:5,desc:'Legislators accuse digital giants of using their networks to squeeze local firms.'},
 {id:'labor',title:'A factory-floor revolt',actor:'union',focus:'factories',threat:7,desc:'Automation is lifting output, but organised workers demand a share of the gains.'},
 {id:'heat',title:'Two years of heat',actor:'grainvault',focus:'water',threat:9,desc:'Heatwaves hit water reservoirs, crops and industrial cooling systems at once.'},
 {id:'foundry',title:'Move us or lose us',actor:'meridian',focus:'factories',threat:6,desc:'A major equipment supplier threatens to shift its regional factory unless concessions arrive.'},
 {id:'electric',title:'Transformer backlog',actor:'northgrid',focus:'energy',threat:8,desc:'A global shortage of transformers slows grid connections and new plants.'},
 {id:'recycle',title:'Recycling breakthroughs',actor:'helix',focus:'processing',threat:4,desc:'New materials-recovery techniques could reduce virgin mineral demand, but patents are contested.'},
 {id:'tariffs',title:'Tariff retaliation',actor:'markets',focus:'logistics',threat:7,desc:'Major economies raise border barriers. Your exporters face delays and new compliance costs.'},
 {id:'seed',title:'Seeds of leverage',actor:'grainvault',focus:'food',threat:7,desc:'GrainVault bundles crop data, seeds and distribution contracts, alarming domestic growers.'},
 {id:'watercorp',title:'Data centres drink first',actor:'aster',focus:'water',threat:9,desc:'Aster Cloud wants reliable water and power for a giant data-centre cluster.'},
 {id:'standards',title:'Two industrial standards',actor:'meridian',focus:'technology',threat:6,desc:'Competing nations adopt incompatible industrial software standards.'},
 {id:'warehouse',title:'Ports go autonomous',actor:'bluewave',focus:'logistics',threat:6,desc:'New robotic ports can halve bottlenecks, but upgrades require specialised systems.'},
 {id:'bio',title:'Materials lab breakthrough',actor:'aster',focus:'technology',threat:4,desc:'An AI system discovers a useful industrial material. Nobody has a proven mass-production process.'},
 {id:'pipeline',title:'A supplier quietly folds',actor:'helix',focus:'processing',threat:7,desc:'A financially stressed supplier exits a niche market, exposing hidden concentration.'},
 {id:'satellite',title:'Orbital connectivity monopoly',actor:'linkspan',focus:'connectivity',threat:6,desc:'Satellite and subsea bandwidth consolidate under a few private operators.'},
 {id:'climate',title:'Climate insurance repricing',actor:'bluewave',focus:'logistics',threat:8,desc:'Insurers lift premiums on coastal factories and routes prone to extreme weather.'},
 {id:'currency',title:'Capital flight',actor:'markets',focus:'governance',threat:6,desc:'A global capital reversal raises the financing costs of long-horizon industrial projects.'}
];
export const EVENT_COUNT=EVENTS.length;
const COST_BASE={build:4,deal:2,buffer:0};
const FOREIGN_PRIORITIES={india:['processing','logistics','factories'],usa:['technology','factories','processing'],china:['factories','processing','technology'],germany:['energy','processing','logistics'],france:['technology','energy','processing'],saudi:['processing','water','factories'],uae:['logistics','processing','water'],japan:['technology','resources','processing'],korea:['technology','resources','energy'],australia:['processing','resources','logistics'],indonesia:['processing','factories','logistics'],brazil:['logistics','processing','factories']};
const WORLD_STAGES=['resources','processing','technology','factories','logistics','energy','water','food','connectivity'];
function newWorld(){return {pressure:Object.fromEntries(WORLD_STAGES.map(s=>[s,12])),countries:Object.fromEntries(Object.entries(COUNTRIES).map(([id,c])=>[id,{caps:{...c.starting},projectsCompleted:0}])),projects:[],history:[]};}
export function globalPressure(state,focus){return Math.round(state.world?.pressure?.[focus]??12);}
function moveWorld(state){
 const world=state.world;const turn=state.turn;const rivals=Object.keys(COUNTRIES).filter(id=>id!==state.countryId);
 const actorId=rivals[(hash(`${state.seed}:${turn}:foreign-actor`)+turn)%rivals.length];
 const actor=COUNTRIES[actorId];const bot=world.countries[actorId];
 const prior=FOREIGN_PRIORITIES[actorId];const stage=prior[hash(`${state.seed}:${turn}:${actorId}:focus`)%prior.length];
 const value=bot.caps[stage];const roll=hash(`${state.seed}:${turn}:${actorId}:policy`)%100;
 const priorPressure=globalPressure(state,stage);
 let type='build',title='',effect='',tone='neutral',playerImpact=0,globalShift=0;
 if(roll<19 && value>=58 && ['china','usa','indonesia','saudi','australia'].includes(actorId) && ['processing','resources','technology','energy'].includes(stage)){
  type='restrict';globalShift=7;tone='negative';title='tightens strategic exports';effect=`Supply access for ${STAGE_NAMES[stage].toLowerCase()} becomes harder globally.`;
 }else if(roll<38 && ['usa','china','germany','france','korea','japan'].includes(actorId)){
  type='standards';globalShift=4;tone='negative';title='tightens industrial standards';effect=`Suppliers using ${actor.name}'s standards gain an advantage; competitors face additional compliance costs.`;
 }else if(roll<64){
  type='build';title='invests in production capacity';effect=`A competing ${STAGE_NAMES[stage].toLowerCase()} project begins construction; additional supply could arrive in three half-years.`;
  world.projects.push({countryId:actorId,stage,finishTurn:turn+3,gain:5});
 }else if(roll<82){
  type='pact';globalShift=-5;tone='positive';title='opens a trade corridor';effect=`International ${STAGE_NAMES[stage].toLowerCase()} access improves as new trade links are agreed.`;
 }else{
  type='scale';globalShift=-4;tone='positive';title='expands exports';effect=`An existing ${STAGE_NAMES[stage].toLowerCase()} supplier increases available international capacity.`;
  bot.caps[stage]=clamp(value+2);
 }
 if(globalShift){world.pressure[stage]=clamp(world.pressure[stage]+globalShift,0,85);}
 const afterPressure=globalPressure(state,stage);const directExposure=dependency(state)[stage]??100-state.caps[stage];
 if(type==='restrict'||type==='standards'){
  if(directExposure>45){playerImpact=-(directExposure>72?3:2);inc(state,stage,playerImpact);}
  else if(directExposure>30){playerImpact=-1;inc(state,stage,-1);}
 }else if(type==='pact'||type==='scale'){
  if(directExposure>42){playerImpact=1;inc(state,stage,1);}
 }
 const completed=[];world.projects=world.projects.filter(p=>{if(p.finishTurn<=turn){
  world.countries[p.countryId].caps[p.stage]=clamp(world.countries[p.countryId].caps[p.stage]+p.gain);
  world.countries[p.countryId].projectsCompleted++;world.pressure[p.stage]=clamp(world.pressure[p.stage]-5,0,85);
  completed.push({countryId:p.countryId,stage:p.stage,amount:p.gain});return false;}return true;});
 // Pressure eases gradually, unless a country's investments or restrictions keep moving the frontier.
 for(const key of WORLD_STAGES)world.pressure[key]=clamp(world.pressure[key]+(world.pressure[key]>12?-1:world.pressure[key]<12?1:0),0,85);
 const news={countryId:actorId,country:actor.name,flag:actor.flag,type,stage,title,effect,tone,playerImpact,pressureBefore:priorPressure,pressureAfter:globalPressure(state,stage),completed,quarter:halfLabel(turn)};
 world.history.push(news);return news;
}
const RESPONSES={
 resources:[['Process more at home','Domestic conversion plants', 'build'],['Sign cross-border mineral deals','Diversify sources', 'deal'],['Secure emergency supply','Short-term input buffers', 'buffer']],
 processing:[['Build a processing base','Own the missing middle stage','build'],['Share technology with allies','Joint processing rights','deal'],['Diversify and stockpile','Buy time, not ownership','buffer']],
 technology:[['Fund applied R&D','Turn science into usable know-how','build'],['Licence technology abroad','Access IP with strings attached','deal'],['Protect existing firms','Temporary subsidies and flexibility','buffer']],
 factories:[['Upgrade local factories','Automate and train workers','build'],['Attract a joint venture','Faster capacity, shared control','deal'],['Keep production running','Short-term industrial support','buffer']],
 logistics:[['Modernise ports and rail','Lower national unit costs','build'],['Agree shipping access','Faster slots, partner leverage','deal'],['Subsidise emergency routes','Immediate relief at a price','buffer']],
 energy:[['Expand grid and generation','More reliable industrial power','build'],['Buy cross-border supply','Fast imports, some dependence','deal'],['Ration and conserve','Avoid immediate factory shutdowns','buffer']],
 water:[['Invest in water systems','Reuse, storage and efficiency','build'],['Negotiate water concessions','Private capital, public trade-offs','deal'],['Prioritise essential users','Temporary relief, hard choices','buffer']],
 food:[['Upgrade farming and storage','Improve yields and resilience','build'],['Diversify food contracts','Reliable imports and offtake','deal'],['Support households now','Immediate relief, fiscal burden','buffer']],
 governance:[['Reform industrial approvals','Faster permits and enforcement','build'],['Offer investor guarantees','Quicker deals, contingent liabilities','deal'],['Fund targeted relief','Protect mandate for now','buffer']],
 connectivity:[['Build open networks','Reduce platform dependence','build'],['Sign capacity agreements','Cheaper bandwidth, lock-in','deal'],['Cap consumer charges','Short-term stability, investor pushback','buffer']]
};
const SPECIAL_CHOICES={
 cloudtax:[['Build open AI infrastructure','Public capacity; no privileged tax deal'],['Offer conditional tax incentives','Fast investment; greater corporate power'],['Refuse Aster’s ultimatum','Maintain policy independence; risk delay']],
 foundry:[['Improve the industrial cluster','Fix competitiveness instead of paying'],['Offer jobs-linked incentives','Secure the plant with conditions'],['Call the relocation bluff','Preserve fiscal room; risk departure']],
 watercorp:[['Build shared water recycling','Make industrial water more productive'],['Negotiate water-use rights','New investment, shared control'],['Prioritise households','Immediate relief; tougher company talks']],
 antitrust:[['Fund interoperable networks','Create domestic alternatives'],['Negotiate platform rules','Keep services, concede influence'],['Cap fees temporarily','Calm public anger, deter expansion']],
 labor:[['Invest in retraining','Raise factory productivity sustainably'],['Negotiate a labour pact','Secure cooperation at a price'],['Protect threatened workers','Immediate political relief']],
 seed:[['Build local storage and seeds','Improve domestic agrifood capability'],['Negotiate diversified offtake','Accept supply under conditions'],['Support farmers temporarily','Protect livelihoods but not market power']],
 bio:[['Back the scale-up laboratory','Convert IP into usable production'],['License with manufacturers','Accelerate production through partners'],['Publish and share the discovery','Public knowledge, uncertain capture']]
};
function eventDeck(seed){ // One event per turn, shuffled in short acts so each scenario spans all themes.
 const arr=[];
 for(let block=0;block<7;block++){
   const ids=[...Array(4)].map((_,i)=>block*4+i);
   ids.sort((a,b)=>hash(`${seed}-shuffle-${block}-${a}`)-hash(`${seed}-shuffle-${block}-${b}`));
   arr.push(...ids);
 }
 return arr;
}
export function createGame(countryId='india',seed=2040){
 const country=COUNTRIES[countryId]||COUNTRIES.india;
 const state={version:2,world:newWorld(),countryId:COUNTRIES[countryId]?countryId:'india',seed:Number(seed)||2040,turn:0,caps:{...country.starting},cash:country.budget,public:66,corporate:38,alliances:29,buffer:8,debt:0,prosperity:49,value:42,projects:[],history:[],messages:[],lastResult:null};
 return recalc(state);
}
export function getEvent(state){if(state.turn>=TOTAL_TURNS)return null; const idx=eventDeck(state.seed)[state.turn];const base=EVENTS[idx];let desc=base.desc;
 if(base.focus==='technology'&&state.caps.technology>82) desc+=' Your engineers are strong, but suppliers still control critical production tools.';
 if(base.focus==='water'&&state.caps.water<42) desc+=' Your water system is already stretched.';
 if(base.actor==='aster'&&state.corporate>68) desc+=' The firm already has unusual bargaining power here.';
 return {...base,desc,half:halfLabel(state.turn),actorName:ACTORS[base.actor].name};}
export function getOptions(state,event=getEvent(state)){
 if(!event)return [];
 const focus=event.focus;
 const labels=SPECIAL_CHOICES[event.id]||RESPONSES[focus];
 const duration=focus==='governance'?3:focus==='resources'||focus==='processing'||focus==='energy'?5:focus==='water'?4:focus==='factories'?4:3;
 const country=COUNTRIES[state.countryId];
 return labels.map((o,i)=>{
  const type=['build','deal','buffer'][i];
  let cost=COST_BASE[type];
  let costReason='';
  if(type==='build'&&state.caps.governance<38){cost+=1;costReason='1 extra: red tape';}
  if(type==='deal'&&state.alliances<22){cost+=1;costReason='1 extra: weak partnerships';}
  const dur=type==='build'?duration:type==='deal'?2:0;
  const payoff=type==='build'?(13+Math.round((100-state.caps[focus])/20)):(type==='deal'?7:2);
  let detail=type==='build'?`+${payoff} ${STAGE_NAMES[focus].toLowerCase()} after ${dur} halves`:type==='deal'?`+${payoff} capability in ${dur} halves; more foreign influence`:`Immediate relief; no lasting industry`;
  if(type==='build'&&state.turn+dur>=TOTAL_TURNS)detail=`Project matures ${state.turn+dur>=TOTAL_TURNS?'after the final decision':'soon'}; scored in 2040 forecast`;
  const avoidable=type==='buffer'?0:type==='deal'?0:0;
  return {id:type,title:o[0],subtitle:o[1],cost,costReason,duration:dur,payoff,focus,detail,available:state.cash>=cost,corporate:type==='deal'?9:type==='build'?-2:1,alliances:type==='deal'?9:type==='build'?0:0,public:type==='buffer'?6:type==='build'?-2:1};
 });
}
function inc(state,key,amount){state.caps[key]=clamp(state.caps[key]+amount);}
function completeProjects(state){let msgs=[];const finished=[];state.projects=state.projects.filter(p=>{if(p.finishTurn<=state.turn){finished.push(p);return false;}return true;});for(const p of finished){inc(state,p.focus,p.gain);if(p.type==='build'){state.value=clamp(state.value+1);state.public=clamp(state.public+1);state.corporate=clamp(state.corporate-1);}else state.alliances=clamp(state.alliances+2);if(p.type==='build' && state.world?.pressure[p.focus]!==undefined)state.world.pressure[p.focus]=clamp(state.world.pressure[p.focus]-3,0,85);msgs.push(`${p.label} completed (+${p.gain} ${STAGE_NAMES[p.focus].toLowerCase()})${p.type==='build'?', adding supply beyond your borders':''}.`);}return msgs;}
function macro(state,ev,option){
 // Complementary capability model: the bottleneck in the middle of the chain matters.
 const c=state.caps;
 const chain=Math.min(c.processing,c.factories,c.logistics,c.energy);
 const innovation=Math.max(0,c.technology-chain);
 const available=clamp((c.water*.38+c.food*.30+c.energy*.32)/100,.25,1);
 const exec=clamp((c.governance+35)/135,.30,1);
 const industrial=(.50*chain+.20*c.technology+.15*c.connectivity+.15*c.resources)*(.65+.35*available)*(.65+.35*exec);
 const exposure=dependency(state);
 const worldFriction=avg(['processing','technology','logistics','energy'].map(k=>globalPressure(state,k)))/100;
 const growth=.50+(industrial-40)/32-(state.debt*.018)-(state.corporate>80?.22:0)-worldFriction*.55;
 state.prosperity=clamp(state.prosperity+growth);
 const addedValue=(Math.min(c.processing,c.factories)-45)/50+(c.technology-60)/230-(state.corporate-45)/130;
 state.value=clamp(state.value+addedValue);
 state.public=clamp(state.public+(state.prosperity>=48?.2:-.45)+(state.caps.food<30?-1.2:0)+(state.caps.water<25?-.65:0));
 state.corporate=clamp(state.corporate+(.22+state.alliances*.002),10,95);
 state.debt=Math.max(0,state.debt+(state.cash===0?.3:-.13));
 const income=3+(state.prosperity>=60?1:0)-(state.debt>18?1:0);
 const priorCash=state.cash;state.cash=clamp(state.cash+income,0,CAPITAL_CAP);
 const incomeReceived=state.cash-priorCash;const capLost=income-incomeReceived;
 state.buffer=clamp(state.buffer-.7,0,35);
 state.alliances=clamp(state.alliances-.65,0,100);
 if(state.public<16)state.caps.governance=clamp(state.caps.governance-.8);
 return {industrial,exposure,income,incomeReceived,capLost};
}
export function dependency(state){const c=state.caps;const modes=['processing','technology','factories','logistics','energy','water','food','connectivity'];const exposure={};for(const stage of modes){let score=100-c[stage];if(['processing','factories','technology','logistics','energy','connectivity'].includes(stage))score=Math.max(0,score-state.alliances*.19-state.buffer*.20);if(state.world && ['processing','technology','factories','logistics','energy','connectivity'].includes(stage))score+=globalPressure(state,stage)*.24;exposure[stage]=clamp(Math.round(score));}return exposure;}
export function recalc(state){const c=state.caps;const d=dependency(state);const rev=avg(Object.values(d).sort((a,b)=>b-a).slice(0,3));const social=avg([c.water,c.food,c.governance]);state.resilience=clamp(Math.round(95-.84*rev+.12*(social-50)+state.buffer*.12),0,100);state.value=Math.round(clamp(state.value));state.prosperity=Math.round(clamp(state.prosperity));state.public=Math.round(clamp(state.public));return state;}
export function takeTurn(original,choiceId){
 if(original.turn>=TOTAL_TURNS)throw Error('Game already finished');
 const s=JSON.parse(JSON.stringify(original));const event=getEvent(s);const option=getOptions(s,event).find(o=>o.id===choiceId);
 if(!option||!option.available)throw Error('Choice unavailable');
 const before={cash:s.cash,prosperity:s.prosperity,value:s.value,resilience:s.resilience,public:s.public,corporate:s.corporate,alliances:s.alliances};
 s.cash-=option.cost;
 // Baseline event shock, mitigated by investments already in place and the selected response.
 const vuln=clamp((70-s.caps[event.focus])/70,0,1.5);
 const rawDamage=event.threat*(.50+.65*vuln)*(1+globalPressure(s,event.focus)/110);
 let mitigation=option.id==='buffer'?.83:option.id==='deal'?.43:.19;
 mitigation=Math.min(.95,mitigation+s.buffer*.006+s.caps.governance*.001);
 const damage=Math.max(1,Math.round(rawDamage*(1-mitigation)));
 inc(s,event.focus,-damage);
 if(option.id==='buffer'){
   inc(s,event.focus,2);s.buffer=clamp(s.buffer+8);s.public=clamp(s.public+3);s.debt+=1.0;
 }else {
   s.projects.push({id:`p${s.turn}-${choiceId}`,label:option.title,focus:event.focus,gain:option.payoff,finishTurn:s.turn+option.duration,type:choiceId});
   if(option.id==='deal'){s.corporate=clamp(s.corporate+5);s.alliances=clamp(s.alliances+8);s.public=clamp(s.public+1);}
   else {s.corporate=clamp(s.corporate-2);s.public=clamp(s.public-1);s.value=clamp(s.value+.6);}
 }
 let corporateMove='';
 let corporateCharge=0;
 // Non-playable actors have their own agenda, reacting to tax rules, state power and scarcity.
 const roll=hash(`${s.seed}:${s.turn}:${s.countryId}:corporate`)%100;
 if(event.actor==='aster'&&s.corporate>58&&choiceId==='build'){
  s.caps.connectivity=clamp(s.caps.connectivity-2);corporateMove='Aster Cloud postpones its next regional investment after tougher public terms.';
 }else if(event.actor==='helix'&&s.caps.processing>65&&choiceId==='build'){
  s.caps.processing=clamp(s.caps.processing-2);corporateMove='Helix Materials cuts export prices to put pressure on your new local capacity.';
 }else if(event.actor==='bluewave'&&s.caps.logistics<42&&choiceId==='buffer'){
  corporateCharge=Math.min(1,s.cash);s.cash-=corporateCharge;corporateMove='BlueWave charges a premium for emergency shipping access.';
 }else if(event.actor==='union'&&s.caps.factories>65&&choiceId==='build'){
  s.public=clamp(s.public-5);corporateMove='The Industrial Workers Federation demands retraining commitments.';
 }else if(roll<13&&s.corporate>58){
  const moveStage=['factories','logistics','connectivity','technology'][roll%4];inc(s,moveStage,-2);corporateMove=`A large multinational shifts a contract abroad, reducing ${STAGE_NAMES[moveStage].toLowerCase()} capacity.`;
 }else if(roll>89&&s.alliances>45){
  inc(s,'technology',2);corporateMove='A partner nation shares technical training through an industrial cooperation pact.';
 }
 let ripple;
 if(option.id==='deal'){const prev=globalPressure(s,event.focus);s.world.pressure[event.focus]=clamp(prev-2,0,85);ripple={tone:'positive',title:'Trade ties open supply',description:`Your deal eases pressure on ${STAGE_NAMES[event.focus].toLowerCase()} access for the wider market.`,pressureChange:globalPressure(s,event.focus)-prev};}
 else if(option.id==='buffer'){const prev=globalPressure(s,event.focus);s.world.pressure[event.focus]=clamp(prev+1,0,85);ripple={tone:'neutral',title:'Relief now, dependency remains',description:`Your emergency buying protects local users but marginally tightens near-term global ${STAGE_NAMES[event.focus].toLowerCase()} supply.`,pressureChange:globalPressure(s,event.focus)-prev};}
 else {ripple={tone:'neutral',title:'New capacity is being built',description:`Your project could ease international ${STAGE_NAMES[event.focus].toLowerCase()} shortages if it completes. Today it has not produced anything yet.`,pressureChange:0};}
 const foreignMove=moveWorld(s);
 s.turn++;
 const completed=completeProjects(s);
 const macroResult=macro(s,event,option);
 recalc(s);
 const ledger={opening:before.cash,cost:option.cost,corporateCharge,income:macroResult.income,incomeReceived:macroResult.incomeReceived,capLost:macroResult.capLost,closing:s.cash};
 const metricChange={prosperity:s.prosperity-before.prosperity,value:s.value-before.value,resilience:s.resilience-before.resilience,public:s.public-before.public,alliances:Math.round(s.alliances-before.alliances),corporate:Math.round(s.corporate-before.corporate)};
 const cause={quarter:halfLabel(original.turn),event:event.title,actor:event.actorName,choice:option.title,cost:option.cost,damage,focus:event.focus,project:option.id==='buffer'?'Immediate mitigation':`${option.duration} halves to deliver`,companyResponse:corporateMove,completed,foreignMove,ripple,ledger,metricChange,globalPressure:globalPressure(s,event.focus)};
 s.history.push(cause);s.lastResult=cause;
 s.messages=[...(corporateMove?[corporateMove]:[]),...completed].slice(0,3);
 if(s.turn===TOTAL_TURNS){ // Give plausible end-period partial credit for projects not yet complete.
  for(const p of s.projects){const remaining=p.finishTurn-s.turn;const credit=Math.max(0,.65-.15*remaining);if(credit>0){inc(s,p.focus,Math.round(p.gain*credit));}}
  recalc(s);
 }
 return s;
}
export function score(state){
 const country=COUNTRIES[state.countryId];const c=state.caps;
 const value=clamp(Math.round(state.value),0,100);
 const prosperity=clamp(Math.round(state.prosperity),0,100);
 const resilience=clamp(Math.round(state.resilience),0,100);
 const publicScore=clamp(Math.round(state.public),0,100);
 const w=country.weights;
 const starting=recalc({caps:{...country.starting},alliances:29,buffer:8,value:42,prosperity:49,public:66});
 const baseWeighted=w.value*starting.value+w.prosperity*starting.prosperity+w.resilience*starting.resilience+w.public*starting.public;
 const endWeighted=w.value*value+w.prosperity*prosperity+w.resilience*resilience+w.public*publicScore;
 // Player performance is measured against the selected country's own starting conditions.
 const chain=Math.min(c.processing,c.factories,c.logistics,c.energy);
 const conversionGap=Math.max(0,c.technology-chain-20);
 const total=clamp(Math.round(55+(endWeighted-baseWeighted)*1.35 -Math.min(18,state.debt*.33) -Math.max(0,state.corporate-78)*.30-conversionGap*.55),0,100);
 let ending={title:'A careful balancing act',type:'balanced',message:'You navigated the rivalry, but some strategic bottlenecks remain.'};
 if(state.corporate>83&&state.alliances<72)ending={title:'The Corporate Hostage',type:'capture',message:'Big firms financed your growth, then gained enough influence to dictate terms.'};
 else if(state.corporate>86&&state.alliances>=72)ending={title:'The Corporate Bargain',type:'bargain',message:'Your global deals delivered capacity, but corporate operators now hold the strongest cards.'};
 else if(c.water<24||c.food<22)ending={title:'The Resource Squeeze',type:'climate',message:'Industrial ambitions collided with scarce water or food security.'};
 else if(state.debt>17||state.cash<2&&state.public<38)ending={title:'The Subsidy State',type:'fiscal',message:'You built capacity, but financing pressure and public impatience eroded the gains.'};
 else if(c.technology-chain>30)ending={title:'The Research Trap',type:'research',message:'Your scientists moved faster than the factories, ports and grids needed to use their discoveries.'};
 else if(c.resources>chain+31)ending={title:'The Resource Trap',type:'resources',message:'You owned valuable inputs but struggled to capture processing and manufacturing value.'};
 else if(resilience>68&&state.alliances>57&&state.corporate<78)ending={title:'The Strategic Networker',type:'network',message:'You reduced concentration through dependable alliances instead of costly total self-sufficiency.'};
 else if(value>65&&prosperity>60&&resilience>55)ending={title:'The Industrial Powerhouse',type:'powerhouse',message:'Research, supply chains and manufacturing reinforced one another.'};
 else if(prosperity>65&&resilience<44)ending={title:'Fragile Prosperity',type:'fragile',message:'Your economy grew, but a few suppliers can still interrupt the system.'};
 else if(total<38)ending={title:'The Lost Decade',type:'lost',message:'Short-term fixes delayed the hard work of building durable capabilities.'};
 else if(total>=65)ending={title:'The Quiet Builder',type:'builder',message:'Steady infrastructure and production gains compounded into industrial strength.'};
 const ranked=Object.entries(dependency(state)).sort((a,b)=>b[1]-a[1]);
 const strongest=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];
 const early=state.history.filter(h=>h.quarter.split(' ')[0]<2034).slice(0,8);
 const buildChoices=state.history.filter(h=>['Build','Upgrade','Fund','Reform','Expand','Modernise','Invest'].some(t=>h.choice.startsWith(t))).length;
 const dealChoices=state.history.filter(h=>/Sign|Share|Licence|Attract|Buy|Negotiate|Offer|Agree|Diversify food/.test(h.choice)).length;
 return {total,ending,value,prosperity,resilience,public:publicScore,ranked,strongest,buildChoices,dealChoices,history:state.history};
}
export function runWithPolicy(country='india',seed=2040,policy='build'){let s=createGame(country,seed);while(s.turn<TOTAL_TURNS){const opts=getOptions(s);const picked=opts.find(o=>o.id===policy&&o.available)||opts.find(o=>o.available);if(!picked)throw Error('no available moves');s=takeTurn(s,picked.id);}return s;}
