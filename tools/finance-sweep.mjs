import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {COUNTRIES,createGame,player,getOptions,takeTurn,choosePolicy,historyChoice,validSave,score,round} from '../src/engine.js';
import {scoreHistory} from '../src/visuals.js';
let campaigns=0,transitions=0,ledgerChecks=0,loanTurns=0,creditDenied=0,repayments=0;const endings={},witnesses=[];
for(const country of Object.keys(COUNTRIES))for(const seed of [1,7,17,99,273,617,817,2040])for(const policy of ['gap-growth','retain-cash','borrow-repay','fiscal','random','credit-stress']){
 let s=createGame(country,seed),debt=0,expected=[score(s).total];
 while(s.turn<28){
  const opts=getOptions(s),finance=opts.filter(o=>o.financing.eligible&&o.cost>0),cash=opts.filter(o=>o.available),high=finance.sort((a,b)=>b.cost-a.cost)[0];
  creditDenied+=opts.filter(o=>!o.available&&!o.financing.eligible).length;
  let request;
  if(policy==='borrow-repay'&&player(s).debt>0&&s.turn%3===0&&player(s).cash>0)request='repay';
  else if(policy==='retain-cash'&&high)request={id:high.id,financing:high.financing.mode};
  else if(policy==='gap-growth'||policy==='credit-stress'){const o=opts.filter(o=>o.available||o.financing.eligible).sort((a,b)=>b.cost-a.cost)[0];request=o.available?o.id:{id:o.id,financing:'gap'};}
  else if(policy==='borrow-repay'&&high&&s.turn%3===1)request={id:high.id,financing:high.financing.mode};
  else request=choosePolicy(s,policy==='fiscal'?'austerity':'random');
  const before=player(s).debt,snapshot=JSON.stringify(s);const next=takeTurn(s,request);assert.equal(JSON.stringify(s),snapshot);
  s=next;transitions++;const h=s.lastResult,l=h.ledger;
  if(h.financing){loanTurns++;if(witnesses.length<8)witnesses.push({country,seed,turn:s.turn,opening:l.opening,cost:l.spending,loan:h.financing.amount,interest:l.interest,closing:l.closing});}
  if(h.action==='repay')repayments++;
  const expectedDebt=round(before+(h.financing?.amount||0)+(l.deficitBorrowing??l.borrowing)-l.retirement);
  assert.ok(Math.abs(player(s).debt-expectedDebt)<.025,`principal ${country}/${policy}/${s.turn}`);
  for(const n of Object.values(s.world.nations)){const q=n.ledger;assert.ok(Math.abs(q.opening-q.spending-q.other+q.income-q.closing)<.025);assert.ok(n.debt>=0&&n.cash>=0);ledgerChecks++;for(const v of Object.values(n.caps))assert.ok(Number.isFinite(v)&&v>=0&&v<=100);}
  expected.push(score(s).total);assert.deepEqual(scoreHistory(s),expected);
 }
 assert.ok(validSave(s));let replay=createGame(country,seed);for(const h of s.history)replay=takeTurn(replay,historyChoice(h));assert.deepEqual(replay,s);
 const type=score(s).ending.type;endings[type]=(endings[type]||0)+1;campaigns++;
}
const result={generated:new Date().toISOString(),campaigns,transitions,ledgerChecks,loanTurns,creditDenied,repayments,endings,witnesses,limits:['Current 28-turn v1.3 release; not acceptance of the planned 18-turn v2.','Finance sweep checks transitions/accounting/replay, not a proof that borrowing is perfectly balanced.','Fixed maturity, terminal defaults, negotiable diplomacy and political succession are pending.']};
writeFileSync('test-results/v1.3/finance-sweep.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
