import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {COUNTRIES,POLICIES,createGame,player,takeTurn,getOptions,choosePolicy,score} from '../src/engine.js';
const seeds=[1,17,97,817,2040,3011,9109,213097];
const policies=[...Object.keys(POLICIES),'adaptive','random','adversarial'];
const rows=[],endings={},winners={},bestByCountry={};let turns=0,ledgerChecks=0,restrictions=0,borrowing=0;
for(const country of Object.keys(COUNTRIES))for(const seed of seeds){const group=[];for(const policy of policies){
 let s=createGame(country,seed);
 while(s.turn<28){assert.ok(getOptions(s).some(x=>x.available));s=takeTurn(s,choosePolicy(s,policy));turns++;
  for(const n of Object.values(s.world.nations)){
   const l=n.ledger;assert.ok(Math.abs(l.opening-l.spending-l.other+l.income-l.closing)<.025,`${country}/${seed}/${policy}/${n.id}/${s.turn}: ledger`);ledgerChecks++;
   for(const [k,v] of Object.entries(n.caps))assert.ok(Number.isFinite(v)&&v>=0&&v<=100,`cap ${k}`);
   for(const k of ['cash','debt','prosperity','mandate','environment','output','captured','ip','science','knowhow','lockin','concentration'])assert.ok(Number.isFinite(n[k])&&n[k]>=0,`${country}/${policy}: ${k}`);
   assert.ok(n.completed.every(p=>p.finished>=p.started+1));assert.ok(n.projects.every(p=>p.work>0));
  }
  for(const m of Object.values(s.world.markets))assert.ok(m.price>0&&m.supply>0&&m.demand>0&&m.fill>0&&m.fill<=1);
 }
 const z=score(s),n=player(s);const row={country,seed,policy,score:z.total,ending:z.ending.type,prosperity:z.metrics.prosperity,autonomy:z.metrics.autonomy,value:n.captured,mandate:n.mandate,ip:n.ip,output:n.output,cash:n.cash,debt:n.debt,energyStress:n.stress.energy,waterStress:n.stress.water,concentration:n.concentration};rows.push(row);group.push(row);endings[row.ending]=(endings[row.ending]||0)+1;restrictions+=s.history.filter(h=>h.countries.some(x=>x.type==='restrict')).length;borrowing+=s.history.filter(h=>h.ledger.borrowing>0).length;
 }
 const best=Math.max(...group.map(x=>x.score));for(const row of group.filter(x=>x.score===best))winners[row.policy]=(winners[row.policy]||0)+1;bestByCountry[country]=Math.max(bestByCountry[country]||0,best);
}
// Robustness to resource and execution starting conditions, beyond base country presets.
let variants=0;for(const country of Object.keys(COUNTRIES))for(const factor of [.75,1.2])for(const policy of ['adaptive','random','adversarial']){let s=createGame(country,617);for(const key of ['energy','water','food','institutions'])player(s).caps[key]=Math.min(100,player(s).caps[key]*factor);while(s.turn<28){s=takeTurn(s,choosePolicy(s,policy));turns++;}assert.ok(Number.isFinite(score(s).total));variants++;}
assert.ok(Object.values(bestByCountry).every(x=>x>=50),'A country has no tested route to a viable outcome');
assert.ok(Object.keys(winners).length>=3,'A single score policy dominates every country and world');
assert.ok(Object.keys(endings).length>=6,'Insufficient observed ending diversity');
const summary={generated:new Date().toISOString(),campaigns:rows.length+variants,baselineCampaigns:rows.length,startingConditionCampaigns:variants,seeds,policies,turns,ledgerChecks,restrictions,turnsRequiringBorrowing:borrowing,endings,scoreWinsOrTies:winners,bestScoreByCountry:bestByCountry,limits:['Finite policy sweep does not prove absence of an exploit.','Score weights are design assumptions; trade-offs also matter across individual metrics.','Human completion time and enjoyment require playtesting.']};
writeFileSync('test-results/balance.json',JSON.stringify(summary,null,2)+'\n');writeFileSync('test-results/campaigns.csv',Object.keys(rows[0]).join(',')+'\n'+rows.map(x=>Object.values(x).join(',')).join('\n')+'\n');console.log(JSON.stringify(summary,null,2));
