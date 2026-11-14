import {createGame as createLegacy} from './engine-legacy.js';
/* Plain-language layer: turns engine numbers into reasons, people and headlines. Reads state only; never changes it. */
import {COUNTRIES,createGame,takeTurn,player,historyChoice} from './engine.js?v=5';

export const METRIC={
 prosperity:{icon:'🏠',name:'Living standards',means:'How well off households are'},
 autonomy:{icon:'🛡️',name:'Independence',means:'How hard it is for others to cut off your supplies'},
 mandate:{icon:'🗳️',name:'Public approval',means:'Whether voters still back you'},
 value:{icon:'🏭',name:'Value kept at home',means:'Profit your own firms keep, not foreign licence holders'}
};
export const CAP={energy:['⚡','Power'],water:['💧','Water'],food:['🌾','Food'],logistics:['🚢','Ports & rail'],talent:['🎓','Skills'],institutions:['🏛️','Execution'],minerals:['⛏️','Minerals'],refining:['⚗️','Processing'],manufacturing:['🏭','Factories'],compute:['🖥️','AI compute'],labs:['🔬','Research']};
export const ICON={ai:'🤖',research:'🔬',pilot:'⚙️',factory:'🏭',imports:'📦',diversify:'🌐',partner:'📝',grid:'⚡',water:'💧',freight:'🚢',food:'🌾',skills:'🎓',welfare:'🛒',regulate:'⚖️',concede:'🏢',bargain:'🤝',conserve:'🔌',royalties:'💡',repay:'🏦'};

// What the player gets and gives up, as chips: [tone, text].
const EFFECTS={
 ai:[['+','AI compute +15'],['+','Research +5'],['−','Uses more power & water'],['−','Imported chips: −Independence']],
 research:[['+','Research +15'],['+','Skills +4'],['−','No factory output by itself']],
 pilot:[['+','Factories +7'],['+','Processing +6'],['+','Turns inventions into know-how']],
 factory:[['+','Factories +15'],['+','Processing +13'],['−','Uses more power & water']],
 imports:[['+','Output and living standards now'],['−','Independence falls'],['−','Harder to switch later']],
 diversify:[['+','Independence rises over time'],['+','Ports & rail +3'],['−','One-off switching fee']],
 partner:[['+','Factories +7'],['+','AI compute +4'],['−','Fee 0.42 every turn for 4 years'],['−','Profits shared abroad']],
 grid:[['+','Power +20'],['+','Lower costs for industry']],
 water:[['+','Water +20'],['+','Protects farms and cooling']],
 freight:[['+','Ports & rail +19'],['+','Cheaper inputs, better export margins']],
 food:[['+','Food +18'],['+','Water +3'],['+','Lower grocery bills']],
 skills:[['+','Skills +13'],['+','Execution +8'],['+','Projects finish faster']],
 welfare:[['+','Public approval +8 now'],['−','Fixes nothing underneath']],
 regulate:[['+','Independence: less lock-in'],['+','Corporate power falls'],['−','Cloud firms may hold back investment']],
 concede:[['+','Factories +10, free today'],['−','Fee 0.55 every turn for 5 years'],['−','Atlas gains political power']],
 bargain:[['+','Factories +8'],['+','Processing +4'],['+','Keeps control at home']],
 conserve:[['+','Eases power & water shortages now'],['−','Factories produce 22% less this turn']],
 royalties:[],repay:[]
};
export function effects(s,o){const n=player(s);
 if(o.id==='royalties')return n.ip?[['+',`+${Math.round(n.ip*1.1*10)/10} budget from ${n.ip} invention${n.ip>1?'s':''}`],['−','Foreign factories make the product']]:[['−','You own no inventions yet: earns nothing']];
 if(o.id==='repay')return n.debt?[['+',`Pays down up to ${Math.round(Math.min(n.cash*.45,n.debt)*10)/10} of debt`],['+','Approval +2'],['−','No new capacity']]:[['−','You have no debt: little effect'],['+','Approval +2']];
 return (EFFECTS[o.id]||[['+',o.upside||'Enables a new route'],['−',o.downside||'Costs capital and time']]).map(([tone,text])=>[tone,/^[A-Za-z &]+ \+\d/.test(text)?`Up to ${text.toLowerCase()}`:text]);}

// What ordinary people would notice, per action.
const FELT={ai:'Students and start-ups will get national compute, once it is built.',research:'Universities hire; the payoff is inventions, not jobs, at first.',pilot:'A test production line gives engineers hands-on process experience.',factory:'A big construction site. Thousands of jobs, if power, water and skills keep up.',imports:'Shops and factories get cheaper parts this year.',diversify:'Prices rise a little while new suppliers are signed up.',partner:'A foreign firm runs the know-how; your workers run the machines.',grid:'Fewer blackouts, once the lines are connected.',water:'Farms and towns get a steadier water supply.',freight:'Less waiting at ports; goods move faster and cheaper.',food:'Grocery bills ease once the harvest and storage are in.',skills:'Engineers stop leaving for jobs abroad.',welfare:'A relief payment lands in household accounts this month.',regulate:'Big platforms must open up; some may sulk.',concede:'Atlas builds fast, but pays little tax for years.',bargain:'Local firms get a share of the technology, not just the jobs.',conserve:'Factories run shorter shifts so homes keep the lights on.',royalties:'Your scientists earn fees; the factories are abroad.',repay:'Less new spending; interest bills shrink.'};
export const felt=id=>FELT[id]||'';

const HEADLINE={ai:'breaks ground on a national AI cluster',research:'pours money into university labs',pilot:'opens a pilot production line',factory:'commits to a giant industrial cluster',imports:'opts for the cheapest foreign inputs',diversify:'signs new supplier deals to cut reliance',partner:'licenses foreign factory know-how',grid:'starts building clean power lines',water:'invests in industrial water reuse',freight:'moves to unclog ports and rail',food:'backs farmers and grain storage',skills:'funds engineers, training and housing',welfare:'sends relief to households',regulate:'forces tech giants to open up',concede:'hands Atlas exclusive rights',bargain:'demands technology sharing from investors',conserve:'rations industrial power and water',royalties:'licenses its inventions abroad',repay:'tightens the belt to repay debt'};

// Four named citizens per country: worker, household, engineer, farmer.
const PEOPLE={
 india:[['Ravi','assembly worker','Chennai'],['Meena','runs a family of four','Lucknow'],['Arjun','chip engineer','Bengaluru'],['Lakshmi','onion farmer','Nashik']],
 usa:[['Dana','machinist','Ohio'],['Maria','parent of three','Phoenix'],['Kevin','AI researcher','Austin'],['Tom','corn farmer','Iowa']],
 china:[['Wei','factory technician','Shenzhen'],['Li Na','household budget-keeper','Chengdu'],['Zhang Hao','lithography engineer','Shanghai'],['Liu Fang','rice farmer','Hunan']],
 germany:[['Jonas','auto-plant worker','Stuttgart'],['Anna','parent and nurse','Leipzig'],['Katrin','process engineer','Dresden'],['Hans','dairy farmer','Bavaria']],
 france:[['Julien','aerospace fitter','Toulouse'],['Camille','single parent','Lille'],['Sophie','lab researcher','Grenoble'],['Pierre','grain farmer','Beauce']],
 saudi:[['Faisal','refinery operator','Jubail'],['Noura','household manager','Riyadh'],['Sara','data-centre engineer','NEOM'],['Abdullah','greenhouse farmer','Al-Jouf']],
 uae:[['Omar','port supervisor','Jebel Ali'],['Fatima','household manager','Sharjah'],['Aisha','AI engineer','Abu Dhabi'],['Rashid','date grower','Al Ain']],
 japan:[['Kenji','line worker','Nagoya'],['Yuki','parent of two','Osaka'],['Haruka','materials scientist','Tsukuba'],['Takeshi','rice farmer','Niigata']],
 korea:[['Min-jun','fab technician','Pyeongtaek'],['Ji-woo','household budget-keeper','Busan'],['Seo-yeon','chip designer','Pangyo'],['Dong-hyun','pear farmer','Jeolla']],
 australia:[['Jack','mine operator','Pilbara'],['Chloe','parent of two','Adelaide'],['Priya','battery researcher','Melbourne'],['Mick','wheat farmer','Wagga Wagga']],
 indonesia:[['Budi','smelter worker','Morowali'],['Siti','household budget-keeper','Surabaya'],['Rizky','software engineer','Bandung'],['Wayan','rice farmer','Bali']],
 brazil:[['João','steelworker','Minas Gerais'],['Ana','parent of three','Recife'],['Lucas','biotech researcher','Campinas'],['Rosa','soy farmer','Mato Grosso']]
};
export const people=id=>PEOPLE[id].map(([name,role,place],i)=>({name,role,place,face:['👷','🧺','🧑‍🔬','🧑‍🌾'][i]}));

// The state before the last decision, rebuilt by deterministic replay.
export function previous(s){let p=s.version===4?createGame(s.countryId,s.seed,s.scenario):createLegacy(s.countryId,s.seed);for(const h of s.history.slice(0,-1))p=takeTurn(p,historyChoice(h));return p;}

const r1=x=>Math.round(x*10)/10;
const top=(list,k=3)=>list.filter(x=>Math.abs(x[1])>=.05).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,k);
// Mirrors engine formulas, so the reasons are the real drivers rather than flavour text.
export function why(before,after){const a=player(after),b=player(before),h=after.lastResult,id=h.action,cn=COUNTRIES[a.supplier].name;
 const exports=a.output/a.unitCost,damp=1-b.prosperity/160;
 const prosperity=top([
  ['Factories and exports earning',(.1+exports/45+a.captured/90)*damp],
  ['Cheap imported inputs',a.importBoost*.008*damp+(id==='imports'?1.15:0)],
  ['Household relief',id==='welfare'?.5:0],
  ['Export controls blocking inputs',-a.restrictionLoss/100*4*damp],
  ['Power and water shortages',-(a.stress.energy+a.stress.water)*.022],
  ['Food shortages',-a.stress.food*.045],
  ['Interest on debt',-a.debt*.015],
  ['Pollution',-Math.max(0,60-a.environment)*.012]]);
 const mandate=top([
  [a.prosperity>=55?'Comfortable living standards':'Living standards below what voters expect',.1+(a.prosperity-55)*.014],
  ['Relief payments',id==='welfare'?8:0],['Debt repaid',id==='repay'?2:0],['Inventions earning money',id==='royalties'?1:0],
  ['Food prices',-a.stress.food*.07],['Blackouts and water cuts',-(a.stress.water+a.stress.energy)*.024],
  ['Pollution',-Math.max(0,55-a.environment)*.035],['Corporate influence',-Math.max(0,a.corporate-70)*.025]]);
 const autonomy=top([
  [`Reliance on ${cn} for inputs`,-(a.concentration-b.concentration)*.48],
  ['Lock-in to contracts and toolchains',-(a.lockin-b.lockin)*.25],
  ['Export controls',-(a.restrictionLoss-b.restrictionLoss)*.35],
  ['Alternative suppliers',(a.diversification-b.diversification)*.3]]);
 const value=top([['Domestic production',(a.output-b.output)*.45],['Commercialised inventions',(a.innovationOutput-b.innovationOutput)*.55]],2);
 return {prosperity,mandate,autonomy,value};}

// Up to three short stories about named people, chosen by what actually happened.
export function vignettes(before,after){const a=player(after),b=player(before),h=after.lastResult,id=h.action,[worker,home,engineer,farmer]=people(after.countryId),out=[],used=new Set();
 const add=(p,text,tone)=>{if(out.length<3&&!used.has(p.name)){used.add(p.name);out.push({...p,text,tone});}};
 const online=h.notes.find(t=>t.includes(' online')),idea=h.notes.find(t=>t.startsWith('Breakthrough'));
 if(idea)add(engineer,`${engineer.name}'s lab in ${engineer.place} files a patent. ${COUNTRIES[after.countryId].name} now owns invention #${a.ip}. ${a.knowhow<45?'Nobody here can manufacture it yet: a pilot line would help.':'Local engineers can try to manufacture it.'}`,'positive');
 if(online)add(['Factories','Processing','magnet','pilot'].some(w=>online.includes(w))?worker:['AI','labs'].some(w=>online.includes(w))?engineer:home,`${online.replace(/\.$/,'')}: ${online.includes('skills gap')?'it works, but without enough engineers it runs below capacity.':'the project you started has finished and now counts.'}`,online.includes('skills gap')?'neutral':'positive');
 if(h.ledger.projectBorrowing)add(home,`The treasury chose a loan of ${h.ledger.projectBorrowing} for this decision. Interest starts next half-year and leaves less revenue for public services.`,'neutral');
 if(h.ledger.borrowing-(h.ledger.projectBorrowing||0)>0)add(home,`The treasury borrowed ${r1(h.ledger.borrowing-(h.ledger.projectBorrowing||0))} to pay this half-year's bills. ${home.name} in ${home.place} will pay for that interest through future budgets.`,'negative');
 if(a.stress.energy>3)add(worker,`${worker.name}'s shift at the ${worker.place} plant was cut. The grid cannot power homes, factories and data centres at once.`,'negative');
 if(a.stress.water>3||h.shock.includes('heatwave'))add(farmer,`${farmer.name} in ${farmer.place} watches the canal run low. Farms and factory cooling draw on the same water.`,'negative');
 if(a.stress.food>3)add(home,`${home.name}'s grocery bill jumped this month. Food supply is short, and voters notice.`,'negative');
 if(a.stress.talent>3)add(engineer,`${engineer.name} has three job offers. Skilled people are scarce, so projects slow down.`,'neutral');
 if(a.restrictionLoss>b.restrictionLoss+1)add(worker,`Deliveries to ${worker.name}'s plant are stuck. Export controls hit countries that buy from one supplier.`,'negative');
 const mine={ai:engineer,research:engineer,pilot:engineer,factory:worker,imports:worker,partner:worker,concede:worker,bargain:worker,grid:worker,conserve:worker,water:farmer,food:farmer,welfare:home,repay:home,skills:engineer,freight:worker,diversify:worker,regulate:home,royalties:engineer}[id];
 if(mine)add(mine,`${mine.name}, ${mine.role} in ${mine.place}: "${felt(id)}"`,'neutral');
 const dp=a.prosperity-b.prosperity;
 add(home,dp>.3?`${home.name} feels a little better off this half-year.`:dp<-.3?`${home.name} is cutting back. Money feels tighter in ${home.place}.`:`Not much changes for ${home.name} in ${home.place} this time.`,dp>.3?'positive':dp<-.3?'negative':'neutral');
 return out;}

export function headline(after){const h=after.lastResult,c=COUNTRIES[after.countryId].name;
 if(h.notes.some(t=>t.startsWith('Treasury borrowed')))return `${c} borrows to pay its bills`;
 if(h.countries.some(x=>x.type==='restrict')&&player(after).restrictionLoss>3)return `Export controls squeeze ${c}'s factories`;
 const online=h.notes.find(t=>t.includes(' online'));if(online)return `${online.split(' online')[0]} is finished`;
 if(h.notes.some(t=>t.startsWith('Breakthrough')))return `${c}'s scientists make a breakthrough`;
 return `${c} ${HEADLINE[h.action]}`;}

// Why a world event matters to the player.
export function relevance(s,x){const n=player(s);
 if(x.type==='restrict')return x.actor===n.supplier?`This hits you: ${Math.round(n.concentration)}% of your key inputs depend on ${COUNTRIES[n.supplier].name}.`:'You are not their main customer, so the direct hit is small.';
 if(x.type==='pricewar')return 'Cheaper materials help buyers, but squeeze any new plants you build.';
 if(x.type==='offer')return 'Australia is courting your investment. A supplier compact is still needed to diversify actual sourcing.';
 if(x.type==='expand')return 'More global supply: prices for that good should ease.';
 if(x.type==='reprice')return n.contracts.some(c=>c.firm===x.actor)?'You hold one of their contracts: your fees just rose.':'You hold no contract with them, so no direct cost.';
 if(x.type==='relocate')return 'Less cloud capacity worldwide after your regulation.';
 if(x.type==='lobby')return 'Atlas will push you for more concessions.';
 if(['ai','factory','pilot'].includes(x.type))return 'A rival competing for chips, equipment and buyers.';
 if(['imports','diversify'].includes(x.type))return 'Shifts demand for materials, which moves world prices.';
 return 'Mostly domestic: little direct effect on you.';}

// The single most useful thing to notice before choosing.
export function advice(s){const n=player(s),t=[];
 if(n.stress.energy>3)t.push(['⚡',`Power is short by ${r1(n.stress.energy)}. Factories and data centres lose output until you add power or ration it.`]);
 if(n.stress.water>3)t.push(['💧',`Water is short by ${r1(n.stress.water)}. Farms and factory cooling are competing.`]);
 if(n.stress.food>3)t.push(['🌾','Food is short. Grocery bills are draining approval.']);
 if(n.stress.talent>3)t.push(['🎓','Not enough skilled engineers. New projects will run below capacity.']);
 if(n.debt>8)t.push(['🏦',`Debt is ${r1(n.debt)}. Interest eats into every future budget.`]);
 if(n.mandate<45)t.push(['🗳️','Approval is low. Below 35, your legacy becomes a backlash.']);
 if(n.ip&&n.knowhow<45)t.push(['💡',`You own ${n.ip} invention${n.ip>1?'s':''} but cannot make ${n.ip>1?'them':'it'} yet. A pilot line turns inventions into production.`]);
 if(n.concentration>70)t.push(['🛡️',`${Math.round(n.concentration)}% reliance on ${COUNTRIES[n.supplier].name}. One export ban could stall your factories.`]);
 if(!t.length)t.push(['✅','No emergencies. A good moment to invest in something slow.']);
 return t.slice(0,2);}
