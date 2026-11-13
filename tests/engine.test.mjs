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
