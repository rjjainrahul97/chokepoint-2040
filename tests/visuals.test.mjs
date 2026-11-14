import test from 'node:test';
import assert from 'node:assert/strict';
import {COUNTRIES,createGame,takeTurn,choosePolicy,getOptions,score,committedOutlook} from '../src/engine.js?v=4.5';
import {previewRow,forecast,standing,scoreHistory,loops,loopCard,warnings,worldMap,moatData,moats,aiStack,ladder,trajectory} from '../src/visuals.js';
test('visual components render for every country and match engine numbers',()=>{
 for(const c of Object.keys(COUNTRIES)){let s=createGame(c,7);
  for(let t=0;t<28;t++){if(t%9===0){for(const o of getOptions(s))if(o.available){const d=forecast(s,o.id);assert.deepEqual(d,takeTurn(s,o.id).lastResult.delta);assert.ok(previewRow(s,o.id).includes('pv'));}
    assert.ok(standing(s).includes('bullet'));assert.ok(worldMap(s).includes('<svg'));assert.equal(loops(s).length,3);
    const m=moatData(s);assert.equal(m.length,6);for(const x of m)assert.ok(x.share>0&&x.share<1&&x.rank>=1&&x.rank<=12);assert.ok(moats(s).includes('moat-row'));}
   s=takeTurn(s,choosePolicy(s,'adaptive'));}
  const h=scoreHistory(s);assert.equal(h.length,29);assert.equal(h.at(-1),score(s).total);}
 assert.ok(aiStack([{layer:'Energy',home:.6,ally:.2,foreign:.2,status:'Owned',risk:'low'}]).includes('layer'));
 assert.ok(ladder(1,[['Host sensitive workloads at home',true]]).includes('You are here'));
});

test('choice previews stay accurate when the same world is replayed differently',()=>{
 const a=takeTurn(createGame('india',2040),'ai'),b=takeTurn(createGame('india',2040),'partner');
 assert.notDeepEqual(takeTurn(a,'imports').lastResult.delta,takeTurn(b,'imports').lastResult.delta);
 assert.deepEqual(forecast(a,'imports'),takeTurn(a,'imports').lastResult.delta);
 assert.deepEqual(forecast(b,'imports'),takeTurn(b,'imports').lastResult.delta);
 assert.deepEqual(forecast(a,'imports'),takeTurn(a,'imports').lastResult.delta);
});

test('historical chart agrees with the actual score at every turn, including debt repayment',()=>{
 for(const country of Object.keys(COUNTRIES))for(const policy of ['adaptive','adversarial','random','austerity'])for(const seed of [17,2040]){
  let s=createGame(country,seed),expected=[score(s).total];
  while(s.turn<28){s=takeTurn(s,choosePolicy(s,policy));expected.push(score(s).total);assert.deepEqual(scoreHistory(s),expected,`${country}/${policy}/${seed}/${s.turn}`);}
 }
});

test('capacity shares include corporate supply and do not promise coercion immunity',()=>{
 const s=createGame();const before=moatData(s);s.world.firms.helix.assets+=500;
 const after=moatData(s);assert.ok(after.find(x=>x.g==='materials').share<before.find(x=>x.g==='materials').share);
 assert.match(moats(s),/including corporate capacity/);assert.doesNotMatch(moats(s),/deters coercion/);
});

test('warning SVG references are unique and diagnostics do not block cabinet choices',()=>{
 const s=createGame();Object.assign(s.world.nations.india,{cash:1,debt:20,concentration:90,lockin:40});
 const cards=loops(s).map(x=>loopCard(x)).join('');const ids=[...cards.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size);
 assert.match(warnings(s),/^<details/);
});

test('turn graph separates recorded history from a conditional committed-project outlook',()=>{
 const s=takeTurn(createGame('india',2040),'ai'),before=JSON.stringify(s);
 const future=committedOutlook(s,6);assert.equal(future.length,6);assert.ok(future.some(p=>p.completed.includes('Build sovereign AI')));
 assert.ok(future.every(p=>Number.isFinite(p.score)&&p.turn<=28));assert.equal(JSON.stringify(s),before);
 const html=trajectory(s);assert.match(html,/path-actual/);assert.match(html,/path-projected/);assert.match(html,/no new choices/);
 assert.throws(()=>takeTurn(s,'hold'));
 let end=s;while(end.turn<28)end=takeTurn(end,choosePolicy(end,'adaptive'));
 assert.deepEqual(committedOutlook(end,6),[]);assert.doesNotMatch(trajectory(end),/<polyline class="path-projected"/);
});

test('outlook is deterministic and stops at 2040',()=>{
 let s=createGame('japan',17);while(s.turn<26)s=takeTurn(s,choosePolicy(s,'random'));
 assert.deepEqual(committedOutlook(s),committedOutlook(s));assert.equal(committedOutlook(s).length,2);assert.equal(committedOutlook(s).at(-1).turn,28);
});
