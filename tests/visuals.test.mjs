import test from 'node:test';
import assert from 'node:assert/strict';
import {COUNTRIES,createGame,takeTurn,choosePolicy,getOptions,score} from '../src/engine.js?v=4';
import {previewRow,forecast,standing,scoreHistory,loops,worldMap,moatData,moats,aiStack,ladder} from '../src/visuals.js';
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
