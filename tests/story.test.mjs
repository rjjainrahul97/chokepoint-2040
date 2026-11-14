import test from 'node:test';
import assert from 'node:assert/strict';
import {COUNTRIES,createGame,takeTurn,choosePolicy,getOptions} from '../src/engine.js?v=4.5';
import {why,vignettes,headline,relevance,advice,effects,previous} from '../src/story.js?v=5.1';
test('plain-language layer explains every turn for every country without gaps',()=>{
 for(const c of Object.keys(COUNTRIES))for(const p of ['random','adaptive','imports','science']){let s=createGame(c,99);while(s.turn<28){for(const o of getOptions(s))assert.ok(effects(s,o).length,`${o.id} has effects`);assert.ok(advice(s).length);const b=s;s=takeTurn(s,choosePolicy(s,p));
  const w=why(b,s);for(const k of ['prosperity','mandate']) if(Math.abs(s.lastResult.delta[k])>.3)assert.ok(w[k].length,`${c} ${k} moved without a reason`);
  const v=vignettes(b,s);assert.ok(v.length>=1&&v.length<=3);assert.ok(headline(s).length>5);for(const x of [...s.lastResult.countries,...s.lastResult.companies])assert.ok(relevance(s,x));}
  assert.deepEqual(previous(s),(()=>{let r=createGame(c,99);for(const h of s.history.slice(0,-1))r=takeTurn(r,h.action);return r;})());}
});
