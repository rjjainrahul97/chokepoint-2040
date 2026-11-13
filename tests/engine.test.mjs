import test from 'node:test';
import assert from 'node:assert/strict';
import {COUNTRIES,ACTIONS,POLICIES,TOTAL_TURNS,createGame,player,getEvent,getOptions,takeTurn,score,runWithPolicy,choosePolicy,productiveState,restrictionExposure,metrics,validSave,halfLabel} from '../src/engine.js';
const near=(a,b,message)=>assert.ok(Math.abs(a-b)<.025,`${message}: ${a} != ${b}`);
const advance=(s,count,policy='infrastructure')=>{for(let i=0;i<count;i++)s=takeTurn(s,choosePolicy(s,policy));return s;};
test('12 differentiated nations, one shared world and exactly 28 half-years',()=>{
 assert.equal(Object.keys(COUNTRIES).length,12);assert.equal(TOTAL_TURNS,28);assert.equal(halfLabel(27),'2040 · H2');
 const s=createGame();assert.equal(Object.keys(s.world.nations).length,12);assert.equal(new Set(Object.values(s.world.nations).map(n=>JSON.stringify(n.caps))).size,12);
 assert.ok(Object.keys(ACTIONS).length>=15);assert.equal(getOptions(s).length,3);
});
test('same seed and same actions reproduce every transition; input states stay immutable',()=>{
 let a=createGame('india',817),b=createGame('india',817);for(let i=0;i<28;i++){const snapshot=JSON.stringify(a),id=choosePolicy(a,'random');const next=takeTurn(a,id);assert.equal(JSON.stringify(a),snapshot);a=next;b=takeTurn(b,id);assert.deepEqual(a,b);}
 assert.ok(validSave(a));a.world.nations.india.cash+=1;assert.equal(validSave(a),false);
});
test('reject unknown, unaffordable, post-horizon and malformed inputs',()=>{
 assert.throws(()=>createGame('nowhere'));assert.throws(()=>createGame('india',Infinity));assert.throws(()=>createGame('india',-1));assert.throws(()=>takeTurn(createGame(),'buffer'));const s=createGame();player(s).cash=0;assert.throws(()=>takeTurn(s,'ai'));assert.ok(getOptions(s).some(x=>x.available));assert.throws(()=>takeTurn(runWithPolicy(),'repay'));assert.equal(validSave({version:3}),false);
});
test('all countries complete full campaigns under all policy archetypes',()=>{
 for(const c of Object.keys(COUNTRIES))for(const p of [...Object.keys(POLICIES),'random','adversarial','adaptive']){const s=runWithPolicy(c,2040,p);assert.equal(s.turn,28);assert.equal(s.history.length,28);assert.ok(Number.isFinite(score(s).total));assert.ok(getEvent(s)===null);for(const n of Object.values(s.world.nations))for(const v of Object.values(n.caps))assert.ok(v>=0&&v<=100);}
});
test('capital reconciles for player and every NPC, including fees, retirement and borrowing',()=>{
 for(const c of ['india','saudi','japan']){let s=createGame(c,273);for(let i=0;i<28;i++){s=takeTurn(s,choosePolicy(s,'adversarial'));for(const n of Object.values(s.world.nations)){const l=n.ledger;near(l.opening-l.spending-l.other+l.income,l.closing,`${c} ${n.id} ${i}`);near(l.other,l.operations+l.imports+l.interest+l.emergency+l.contractFees+l.switching+l.retirement,'cost breakdown');assert.ok(l.closing>=0);assert.ok(l.borrowing>=0);assert.equal(l.closing,n.cash);}}}
});
test('AI assets mature after work completes; no anticipatory production credit',()=>{
 let s=createGame();const initial=player(s).caps.compute;s=takeTurn(s,'ai');assert.equal(player(s).caps.compute,initial);assert.equal(player(s).projects[0].work,3); // weak execution adds one half-year
 s=advance(s,2);assert.equal(player(s).caps.compute,initial);s=advance(s,1);assert.ok(player(s).caps.compute>initial);assert.ok(player(s).completed.some(p=>p.action==='ai'));
});
test('AI-first India without utility investment carries material power and water stress',()=>{
 const ai=runWithPolicy('india',2040,'ai'),base=runWithPolicy('india',2040,'infrastructure');assert.ok(ai.history.some(h=>h.stress.energy>20&&h.stress.water>10));assert.ok(player(ai).caps.compute>player(base).caps.compute);assert.ok(player(ai).stress.energy>player(base).stress.energy);assert.ok(metrics(ai).prosperity<metrics(base).prosperity);
});
test('compute accelerates scientific progress when resources and engineers exist',()=>{
 const low=createGame(),high=createGame();for(const s of [low,high]){const n=player(s);n.caps.energy=100;n.caps.water=100;n.caps.talent=100;n.caps.labs=60;n.cash=100;n.caps.manufacturing=30;}player(high).caps.compute=70;player(low).caps.compute=10;
 const a=advance(low,8,'science'),b=advance(high,8,'science');assert.ok(player(b).ip>player(a).ip||player(b).science>player(a).science);assert.ok(player(b).ledger.operations>player(a).ledger.operations);
});
test('research, ownership, engineering and commercial value remain distinct',()=>{
 const s=createGame();const n=player(s);n.ip=6;n.caps.energy=100;n.caps.water=100;n.caps.talent=90;n.caps.manufacturing=20;n.caps.refining=20;n.knowhow=10;productiveState(s,n);const low=n.innovationOutput,lowCapture=n.captured;n.caps.manufacturing=80;n.caps.refining=80;n.knowhow=80;productiveState(s,n);assert.ok(n.innovationOutput>low*2);assert.ok(n.captured>lowCapture*2);assert.equal(n.ip,6);
});
test('cheap inputs pay immediately, then increase concentration and switching costs',()=>{
 const s=takeTurn(createGame(),'skills');const a=takeTurn(s,'imports'),b=takeTurn(s,'factory');assert.ok(metrics(a).prosperity>metrics(b).prosperity);assert.ok(player(a).concentration>player(b).concentration);assert.ok(player(a).lockin>player(b).lockin);assert.ok(player(a).cash>player(b).cash);
});
test('restrictions penalise concentrated sourcing; dependable access can make imports rational',()=>{
 const reliable=createGame(),blocked=createGame();for(const s of [reliable,blocked]){const n=player(s);n.caps.energy=95;n.caps.water=95;n.caps.manufacturing=80;n.caps.refining=20;n.concentration=88;n.importBoost=35;n.relationships.china=60;}blocked.world.restrictions.push({by:'china',good:'materials',until:4,severity:.6});productiveState(reliable,player(reliable));productiveState(blocked,player(blocked));assert.ok(player(reliable).output>player(blocked).output);assert.ok(player(reliable).unitCost<player(blocked).unitCost);
 const diversified=structuredClone(blocked);player(diversified).diversification=60;assert.ok(restrictionExposure(diversified,player(diversified))<restrictionExposure(blocked,player(blocked)));
});
test('infrastructure lowers production cost and limits operating resource stress',()=>{
 const s=createGame();const n=player(s);n.caps.compute=60;n.caps.manufacturing=65;productiveState(s,n);const output=n.output,cost=n.unitCost,stress=n.stress.energy;n.caps.energy=95;n.caps.water=95;n.caps.logistics=90;productiveState(s,n);assert.ok(n.output>output);assert.ok(n.unitCost<cost);assert.ok(n.stress.energy<stress);
});
test('water demand connects compute to farms and food affordability',()=>{
 const s=createGame('saudi');const n=player(s);n.caps.compute=80;productiveState(s,n);const stress=n.stress.food,water=n.stress.water;n.caps.water=95;n.caps.food=80;productiveState(s,n);assert.ok(n.stress.food<stress);assert.ok(n.stress.water<water);
});
test('foreign partnerships deliver earlier while creating actual recurring fees and lock-in',()=>{
 const partner=takeTurn(createGame(),'partner'),own=takeTurn(createGame(),'ai');assert.ok(player(partner).completed.some(x=>x.action==='partner'));assert.ok(player(own).projects.some(x=>x.action==='ai'));assert.ok(player(partner).ledger.contractFees>0);assert.ok(player(partner).lockin>player(own).lockin);
});
test('NPC investment, corporate assets and shared prices respond independently',()=>{
 const s=advance(createGame(),10,'industry');assert.ok(s.history.some(h=>h.countries.some(x=>x.type==='ai')));for(const [id,n] of Object.entries(s.world.nations))if(id!=='india'){assert.ok(n.policy.length>=3,`${id} acted`);assert.ok(n.completed.length>0,`${id} built assets`);assert.equal(n.settled,10);}
 assert.ok(Object.values(s.world.firms).some(f=>f.assets>32));assert.ok(s.history.some(h=>h.companies.length));assert.notDeepEqual(s.world.markets,createGame().world.markets);
});
test('China defends credible competitor capacity and keeps investing in technology',()=>{
 const s=createGame();player(s).completed.push({action:'factory'});const a=takeTurn(s,'skills');assert.ok(a.lastResult.countries.some(x=>x.type==='pricewar'));assert.ok(a.world.priceWarUntil>0);
 const end=advance(a,12);assert.ok(end.world.nations.china.policy.some(x=>['ai','research','pilot'].includes(x.id)));assert.ok(end.world.nations.china.caps.compute>s.world.nations.china.caps.compute);
});
test('different player investments change actual shared supply and prices',()=>{
 let a=takeTurn(createGame(),'ai'),b=takeTurn(createGame(),'skills');a=advance(a,5);b=advance(b,5);assert.notEqual(a.world.markets.cloud.supply,b.world.markets.cloud.supply);assert.notEqual(a.world.markets.cloud.price,b.world.markets.cloud.price);
});
test('corporations can be constrained; open access has benefits and possible retaliation',()=>{
 const s=createGame();const n=player(s);n.caps.institutions=80;n.corporate=80;n.lockin=50;
 // Find a real regulation opportunity through legal decisions.
 let a=s;while(!getOptions(a).some(x=>x.id==='regulate'&&x.available))a=takeTurn(a,choosePolicy(a,'austerity'));
 const before=player(a).corporate,lock=player(a).lockin;a=takeTurn(a,'regulate');assert.ok(player(a).corporate<before);assert.ok(player(a).lockin<lock);assert.ok(a.world.firms.aster.relationships.india<55);
});
test('late-game choices mature within the horizon and unfinished projects receive no free credit',()=>{
 let s=advance(createGame(),25);for(let i=25;i<28;i++){assert.ok(getOptions(s).every(x=>x.duration<=1));s=takeTurn(s,choosePolicy(s,'random'));}assert.equal(s.turn,28);assert.ok(player(s).projects.every(p=>p.work>0));assert.ok(player(s).completed.every(p=>p.finished<=28));
});
test('endings and scores reflect material campaign differences',()=>{
 const all=Object.keys(POLICIES).map(p=>score(runWithPolicy('india',2040,p)));assert.ok(new Set(all.map(x=>x.total)).size>=5);assert.ok(new Set(all.map(x=>x.ending.type)).size>=3);assert.ok(all.some(x=>x.ending.type==='research'));
});
