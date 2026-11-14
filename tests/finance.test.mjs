import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createGame,player,takeTurn,getOptions,choosePolicy,financingQuote,validSave,historyChoice,committedOutlook,score,runWithPolicy} from '../src/engine-legacy.js';
import {previous} from '../src/story.js';
import {forecast,scoreHistory} from '../src/visuals.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<.011,`${a} != ${b}`);
function lowCash(){const s=createGame('india',2040);player(s).cash=4.66;return s;}

test('over-budget choice borrows only the cash gap after explicit funding request',()=>{
 const s=lowCash(),q=financingQuote(s,'ai'),original=JSON.stringify(s);assert.equal(q.amount,2.37);assert.ok(q.eligible);
 assert.throws(()=>takeTurn(s,'ai'));assert.equal(JSON.stringify(s),original);
 const n=takeTurn(s,{id:'ai',financing:'gap'}),l=n.lastResult.ledger;
 assert.equal(l.opening,4.66);assert.equal(l.projectBorrowing,2.37);assert.equal(l.spending,7.03);
 near(player(n).debt,2.37+(l.deficitBorrowing||0));assert.equal(JSON.stringify(s),original);
 near(l.opening-l.spending-l.other+l.tax+l.receipts+l.borrowing,l.closing);
});

test('the reported 7.06 cost and 4.66 cash case can finance its exact 2.40 gap',()=>{
 const s=takeTurn(createGame(),'ai');player(s).cash=4.66;s.world.markets.equipment.price=1.05;
 const q=financingQuote(s,'factory');assert.equal(q.amount,2.4);assert.ok(q.eligible);
 const next=takeTurn(s,{id:'factory',financing:'gap'});assert.equal(next.lastResult.ledger.spending,7.06);assert.equal(next.lastResult.ledger.projectBorrowing,2.4);assert.ok(player(next).projects.some(p=>p.action==='factory'));
});

test('chosen credit starts interest next half-year and reduces revenue available to spend',()=>{
 let s=takeTurn(createGame(),{id:'ai',financing:'full'});assert.equal(s.lastResult.ledger.projectBorrowing,7.03);
 assert.equal(s.lastResult.ledger.interest,0);assert.equal(s.lastResult.financing.firstInterestTurn,1);
 assert.equal(s.lastResult.ledger.opening,14);assert.equal(player(s).debt,7.03);
 s=takeTurn(s,'imports');const l=s.lastResult.ledger;assert.equal(l.interest,.25);assert.equal(player(s).debt,7.03);
 near(l.other,l.operations+l.imports+l.interest+l.emergency+l.contractFees+l.switching+l.retirement);
 assert.ok(l.tax-l.interest<l.tax);near(l.opening-l.spending-l.other+l.income,l.closing);
});

test('funding is finite, quoted without mutation and rejects malformed or unavailable actions',()=>{
 const s=lowCash();player(s).debt=100;const before=JSON.stringify(s),q=financingQuote(s,'ai');assert.equal(q.eligible,false);assert.match(q.reason,/credit/);
 for(const request of [{id:'ai',financing:'gap'},{id:'ai',financing:'anything'},{id:'ai',financing:'full',amount:999},{id:'factory',financing:'gap'}])assert.throws(()=>takeTurn(s,request));
 assert.throws(()=>financingQuote(s,'ai','anything'));assert.equal(JSON.stringify(s),before);
 assert.equal(financingQuote(createGame(),'conserve','full').eligible,false);
});

test('a treasury repayment works outside a scheduled finance card and retires principal',()=>{
 let s=takeTurn(createGame(),{id:'ai',financing:'full'});assert.ok(!getOptions(s).some(x=>x.id==='repay'));
 const debt=player(s).debt,cash=player(s).cash;s=takeTurn(s,'repay');
 near(player(s).debt,debt-Math.min(debt,cash*.45));assert.ok(s.lastResult.ledger.retirement>0);assert.ok(validSave(s));
});

test('financed campaigns survive save, reload, deterministic replay, histories and forecasts',()=>{
 let a=createGame('india',17),b=createGame('india',17),expected=[score(a).total];
 for(let t=0;t<28;t++){
  const opt=getOptions(a).find(o=>o.financing.eligible&&o.cost>0),request=opt?{id:opt.id,financing:opt.financing.mode}:choosePolicy(a,'adaptive');
  const before=JSON.stringify(a);assert.deepEqual(forecast(a,request),takeTurn(a,request).lastResult.delta);committedOutlook(a);assert.equal(JSON.stringify(a),before);
  a=takeTurn(a,request);b=takeTurn(b,request);assert.deepEqual(a,b);assert.ok(validSave(a));
  expected.push(score(a).total);assert.deepEqual(scoreHistory(a),expected);
  assert.deepEqual(previous(a),(()=>{let p=createGame('india',17);for(const h of a.history.slice(0,-1))p=takeTurn(p,historyChoice(h));return p;})());
 }
 const changed=structuredClone(a);const loan=changed.history.find(h=>h.financing);loan.financing.amount+=1;assert.equal(validSave(changed),false);
});

test('old v1.2 campaigns remain byte-equivalent and valid after the finance patch',()=>{
 const fixture=JSON.parse(readFileSync(new URL('./fixtures/v1.2-campaign-hashes.json',import.meta.url)));
 for(const {country,seed,policy,sha256} of fixture.campaigns){const s=runWithPolicy(country,seed,policy);assert.equal(createHash('sha256').update(JSON.stringify(s)).digest('hex'),sha256,`${country}/${seed}/${policy}`);assert.ok(validSave(s));}
});
