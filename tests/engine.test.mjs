import test from 'node:test';
import assert from 'node:assert/strict';
import {COUNTRIES,TOTAL_TURNS,createGame,getEvent,getOptions,takeTurn,score,runWithPolicy,EVENT_COUNT,halfLabel} from '../src/engine.js';
test('there are 12 distinct playable countries and 28 turns through 2040 H2',()=>{
 assert.equal(Object.keys(COUNTRIES).length,12);assert.equal(TOTAL_TURNS,28);assert.equal(EVENT_COUNT,28);assert.equal(halfLabel(0),'2027 · H1');assert.equal(halfLabel(27),'2040 · H2');
});
test('full-game runs complete for all countries under three strategies',()=>{
 for(const country of Object.keys(COUNTRIES))for(const strategy of ['build','deal','buffer']){
  const s=runWithPolicy(country,2040,strategy);assert.equal(s.turn,28);assert.equal(s.history.length,28);assert.ok(score(s).total>=0&&score(s).total<=100,`${country} ${strategy}`);
  for(const key of Object.keys(s.caps))assert.ok(s.caps[key]>=0&&s.caps[key]<=100,`${country}:${key}`);
 }
});
test('seeded decisions are deterministic and no turn has zero affordable choices',()=>{
 let a=createGame('india',7192),b=createGame('india',7192);
 for(let i=0;i<TOTAL_TURNS;i++){
  assert.deepEqual(getEvent(a),getEvent(b));
  assert.ok(getOptions(a).some(o=>o.available));
  let policy=(i%3===0?'build':i%3===1?'deal':'buffer');
  let choice=getOptions(a).find(o=>o.id===policy&&o.available)||getOptions(a).find(o=>o.available);
  a=takeTurn(a,choice.id);b=takeTurn(b,choice.id);assert.deepEqual(a,b);
 }
});
test('meaningfully different countries and policies yield different outcomes',()=>{
 let scores=[];for(const country of ['india','china','usa'])for(const policy of ['build','deal','buffer']){
  const s=runWithPolicy(country,2551,policy);scores.push([country,policy,score(s).total,score(s).ending.type]);
 }
 assert.ok(new Set(scores.map(x=>x[2])).size>=4,JSON.stringify(scores));
 assert.ok(new Set(scores.map(x=>x[3])).size>=2,JSON.stringify(scores));
});
test('invalid and unaffordable moves cannot be taken',()=>{
 const s=createGame('india');assert.throws(()=>takeTurn(s,'random'));
 s.cash=0;assert.throws(()=>takeTurn(s,'build'));
});

test('capital statement reconciles with charges, income and the cap for every half-year',()=>{
 for(const country of Object.keys(COUNTRIES))for(const strategy of ['build','deal','buffer']){
  let s=createGame(country,30129);
  for(let t=0;t<TOTAL_TURNS;t++){
   let opt=getOptions(s).find(x=>x.id===strategy&&x.available)||getOptions(s).find(x=>x.available);
   s=takeTurn(s,opt.id);
   const l=s.lastResult.ledger;
   assert.equal(l.opening-l.cost-l.corporateCharge+l.incomeReceived,l.closing,`${country} ${strategy} turn ${t}`);
   assert.equal(l.income-l.incomeReceived,l.capLost);
   assert.equal(l.closing,s.cash);
   assert.ok(l.incomeReceived>=0 && l.capLost>=0);
  }
 }
});
test('non-playable governments take actions with durable global effects',()=>{
 let s=createGame('india',294);const firstPressure={...s.world.pressure};
 const actionTypes=new Set(),countries=new Set(),ripples=new Set();
 for(let i=0;i<28;i++){
  const o=getOptions(s).find(x=>x.id==='deal'&&x.available)||getOptions(s).find(x=>x.available);
  s=takeTurn(s,o.id);
  const x=s.lastResult;
  assert.ok(x.foreignMove.countryId!==s.countryId);
  assert.equal(s.world.history.length,i+1);
  assert.ok(typeof x.foreignMove.effect==='string' && x.foreignMove.effect.length>20);
  assert.ok(typeof x.ripple.description==='string');
  actionTypes.add(x.foreignMove.type);countries.add(x.foreignMove.countryId);ripples.add(x.ripple.title);
 }
 assert.ok(actionTypes.size>=3,`actions: ${[...actionTypes]}`);
 assert.ok(countries.size>=6,`country count: ${countries.size}`);
 assert.ok(Object.entries(s.world.pressure).some(([k,v])=>v!==firstPressure[k]));
 assert.ok(s.world.history.some(x=>x.playerImpact!==0));
});
test('player decisions produce different global pressure under the same scenario',()=>{
 let build=takeTurn(createGame('india',2040),'build');
 let deal=takeTurn(createGame('india',2040),'deal');
 let buffer=takeTurn(createGame('india',2040),'buffer');
 const focus=build.lastResult.focus;
 assert.equal(build.lastResult.ripple.pressureChange,0);
 assert.ok(deal.lastResult.ripple.pressureChange<=0);
 assert.ok(buffer.lastResult.ripple.pressureChange>=0);
 assert.notEqual(deal.world.pressure[focus],buffer.world.pressure[focus]);
});

test('all world market pressure values remain finite across countries and seeds',()=>{
 for(const seed of [4,17,2040,29381,955523])for(const country of Object.keys(COUNTRIES)){
  let s=runWithPolicy(country,seed,'build');
  for(const [stage,v] of Object.entries(s.world.pressure))assert.ok(Number.isFinite(v)&&v>=0&&v<=85,`${country}, ${seed}: ${stage}=${v}`);
  for(const rival of Object.values(s.world.countries))for(const v of Object.values(rival.caps))assert.ok(Number.isFinite(v)&&v>=0&&v<=100);
 }
});
