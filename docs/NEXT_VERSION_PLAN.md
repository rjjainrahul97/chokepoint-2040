# CHOKEPOINT 2035: next-version goal and game logic

Build ID: CP2035-20261114-RULES  
Status: SPECIFIED, NOT IMPLEMENTED  
Owner: Rahul Jain  
Version target: 2.0; proposed save schema 4  
Inspected baseline: `5cd457918621c99b31846bcc8ea99d5b89b56a42` (v1.2)  
Last source inspection and existing-suite execution: 14 November 2026

This is the canonical next-version implementation contract for Codex, Claude and human contributors. Read it before changing the engine. The latest user instructions take precedence. Implementation and deployment are authorised, but this revision records the requested logic first. Do not confuse planned features with shipped features. Do not claim that another assistant has read this file merely because it is public.

## 1. Product goal and scope

**CHOKEPOINT 2035** retains the current brand, countries, useful mechanics and public URL. Govern from 2027 H1 through 2035 H2: **18 half-year decisions**, rather than 28. Keep `https://rjjainrahul97.github.io/chokepoint-2040/` so existing shared links work. Change the displayed title and metadata when v2 ships, not during this planning-only update.

The central question remains: can sovereign AI and accelerated research help a country escape industrial dependence without undermining prosperity, public finances, essential services and institutions? This is a replayable entertainment simulation, not a forecast or an argument that self-sufficiency must win.

The player should build a viable route to higher living standards and durable economic value by 2035. Domestic innovation, licensed production, diversified trade and profitable interdependence are all legitimate routes. Survival alone is a weak result; industrial independence bought through impoverishment is also a weak result.

Target campaign duration remains 5-7 minutes, including the brief, reports and ending. Eighteen choices at 8-12 seconds only occupy 2.4-3.6 minutes; allow the remaining time for consequences, negotiations and reflection. This timing needs human observation, not a unit-test assertion.

### The brief players see

> Lead your country from 2027 to 2035. Raise living standards and build an economy that can survive pressure from suppliers, lenders and powerful companies. Each half-year, choose one policy or deal. You can borrow, but interest reduces your future budget. Projects take time, contracts limit later choices, and other countries respond. Use AI, industry or trade to prosper. Keep essential services running and avoid default or losing public support.

Then show the selected country's two concrete ambitions, its most urgent constraint and three possible approaches. One adviser sentence per turn explains the immediate problem and next deadline. It should help the player understand the board, not prescribe an optimal strategy.

## 2. What inspection actually found

[SRC] These findings come from the inspected v1.2 source, not just player impressions.

| Request | Current implementation | Required change |
|---|---|---|
| Choose debt to finance a project | `describeAction` requires cash at least equal to cost. No loan action. Deficits after settlement trigger automatic borrowing. | Elective financing before selection, finite credit and an explicit repayment schedule. |
| Service debt out of revenue | `economy` charges 3.5% of outstanding debt per half-year and includes it in costs. | Preserve cash accounting, replace a single debt number with transparent loan terms. |
| Different decisions | First three cards are fixed; later cards cycle through a shuffled deck with some crisis overrides. | State-triggered offers, project phases, deadlines, action gates and repetition controls. |
| Exclusive rights constrain later actions | Atlas contract records firm, expiry, fee and access. It does not encode a sector or enforce exclusivity. | Contract scope, blocked actions, expiry, negotiation and costed exit/breach. |
| Dependence has consequences | Concentration, lock-in, prices and restrictions already reduce output and increase costs. | Preserve those effects and connect specific missing inputs or rights to actual project/production blocks. |
| Countries and firms act | Shared markets, independent investments, restrictions and price defence exist. | Turn relevant actions into offers, counteroffers and response windows. |
| Graph | Solid history and dotted no-new-policy outlook already use engine state. | Retain, shorten horizon and annotate maturities, repayments, contract deadlines and risks. |
| Portraits | Country citizens and visual components exist; sample AI stack is design-only. | Add persistent country/company representatives. Derive all campaign visuals from real state. |

[SRC] Fresh baseline check: 29/29 existing tests passed on 14 November 2026. A low-cash India probe returned AI cost 7.03, cash 2, `available=false`; no borrow/loan/bond action exists. Three different seeds all opened on the AI card. These checks validate the diagnosis, not the new rules.

## 3. Rules that make consequences real

1. Every material consequence must change money, resources, timing, ownership, available actions or another actor's behaviour. A headline alone is not a consequence.
2. Every blocked option names the missing prerequisite or controlling actor, the affected scope, and an expiry or escape path where one exists.
3. Distinguish **physically impossible**, **legally restricted** and **possible but costly**. A government can breach a contract; the game must show the consequences rather than silently making regulation impossible.
4. Concentrated imports create exposure, not an automatic embargo. A supplier must control the relevant input and actually choose a restriction for supply to disappear.
5. Relationships influence willingness and prices. They cannot conjure equipment, licences or money a counterparty does not possess.
6. Show exact contractual dates; label economic crisis dates as conditional forecasts. Do not promise a failure date if future choices can change it.
7. Good combinations can succeed. Cheap imports can remain rational. AI can accelerate useful research, produce stranded discoveries or crowd out essentials.
8. All numbers introduced below are [ASM] fictional game parameters pending balance tests, not economic estimates.

## 4. One small shared engine

Retain plain JavaScript, SVG, browser storage and Node's built-in tests. No Python runtime, server, database, general game engine or live LLM is needed. Reuse the existing six market categories and twelve nations rather than adding dozens of commodities.

### Authoritative state

- Nation: cash; loan records; living standards; approval; environment; existing physical capabilities; sector output and resource utilisation.
- Projects: owner, phase, required inputs/rights, committed budget, remaining work, operating needs and completion history.
- Technology: discovery identity, IP owner, licences, pilot/process knowledge and sector application. A count of discoveries must not imply ownership of every technology.
- Supply links: good, supplier, available capacity, purchases, concentration and switching cost. Country and corporate assets must not be counted twice.
- Contracts: parties, covered sector/workload, obligations, exclusivity, IP/data rights, payment schedule, start, expiry and exit/breach terms.
- Actors: persistent assets, objectives, relationships and memory of actual commitments or breaches.
- Events: offers, deadlines, trigger IDs, cooldowns and choices already seen.
- History: actions, financing, quoted terms, realised ledgers, changes, causal IDs and terminal outcome.

Keep a single authoritative value for each fact. Dependency graphs, portraits, score tiles, warnings and choice gates are views of this state, not parallel systems with sample values.

### Fixed turn order

Use zero-based decision index `t=0..17`; label it `2027+floor(t/2), H(t%2+1)`. Resolve each half-year exactly once:

1. Open on the last settled state. Display debts due this period, active offers and warnings. Previously completed projects are available.
2. Validate the chosen action and financing quote against that state. Draw approved funding, pay initial costs and create commitments. A rejected action changes nothing.
3. Resolve accepted offers and immediate policies. NPCs choose feasible investment/trade actions, respecting the same resource, money and contract rules.
4. Clear the six markets from available capacity, demand and active restrictions. Apply local grid/water/food constraints. Settle production, tax, operating costs, fees and due debt payments.
5. Advance project work only when its phase prerequisites are met. A project finishing now supplies production from the next half-year. It never earns output before completion.
6. Update approval/environment, arrears and persistent crisis counters. Resolve deadlines using explicit inclusive/exclusive boundary rules covered by tests.
7. Evaluate terminal failures, then create next-period offers and announced actor responses. Record the result and advance `t`.

Ordinary retaliation is announced for the next half-year, giving a response opportunity. A seeded external shock can occur at settlement, but a recoverable warning/grace period precedes terminal failure. A newly created offer never expires before the player has seen it.

Separate `resolveTurn(state, action)` from rendering and from scenario randomness. Use seed-keyed draws by actor, technology and period; previews must not consume the live random stream. UI previews, dotted outlook, failure forecasts and tests must call the same resolver. Do not create a second approximate forecast engine.

## 5. Finance: borrowing is an actual choice

An expensive option remains selectable if an eligible loan can cover its funding gap. Its card shows **cash cost, proposed loan, interest per half-year, first payment, maturity and expected revenue after servicing**. The player may confirm cash plus loan, stage a smaller project or choose another policy. Funding is a sub-choice of the same decision, not a hidden extra turn.

A loan stores `id, lender, principal, ratePerHalfYear, drawTurn, firstInterestDue, maturityTurn, repaymentSchedule, covenants`. Rates on existing fixed-rate loans do not mysteriously change with relations; new or refinanced quotes can change. Public bonds have no foreign technology covenant by default; a strategic lender can offer a lower rate with an explicit condition.

[ASM] Start with four- and six-half-year bond terms. Interest starts the half-year after draw. Maturity repays principal; staged/amortising credit can be a later content variant. Use money in integer hundredths to avoid rounding drift. Do not call borrowed capital income or treat interest as principal retirement.

[ASM] Initial credit ceiling: total principal at most six times the trailing three settled tax receipts' mean (use a country-defined starting tax baseline before enough receipts exist). Also require scheduled next-period interest at most 35% of that tax mean and no unresolved default. Publish both limits in loan details. These are solvency guardrails, not claims about sovereign lending. Recalibrate if they make viable investments impossible or permit unlimited debt cycling. Maturity balloons are separately displayed and stress-tested; the interest ratio does not imply they are affordable.

Example, in budget units: cash 5, project costs 12, existing principal 3. A qualifying loan of 7 funds the project and raises principal to 10. At a uniform 4% half-year rate, next period's interest is 0.40. Tax revenue 6 leaves 5.60 after interest, before other bills. Principal stays 10 until repayment. If the existing loan has another rate, sum each loan's actual coupon instead.

The ledger identity is:

`closing cash = opening cash + taxes + other earned receipts + loan proceeds - decision spending - operations - imports - fees - interest paid - principal repaid`

Separately reconcile `closing principal = opening principal + draws - repayments - agreed write-downs`. Unpaid interest becomes explicit arrears, not paid cash. No silent negative cash, endless automatic rescue or double-charging.

Repayment, refinancing and restructuring are available finance policies when relevant. Refinancing needs an actual quote; it is not guaranteed. Show any resulting credit-access penalty or asset concession. A funding shortfall opens a payment crisis with a visible grace deadline and possible spending cuts, emergency finance or restructuring. Forecasts keep future liabilities beyond 2035 in the ending assessment; the horizon must not make unpaid debt free.

## 6. Discovery is not industrial success

Keep this pathway explicit:

**Research work -> discovery -> owned IP or licensed access -> pilot/process knowledge -> equipped production -> competitive sales -> value retained after imports, royalties and costs.**

AI increases research throughput when compute, laboratories and skilled workers are usable. Compute consumes operating capital, power and water and may require imported chips. A breakthrough creates a specific opportunity, not instant factories or guaranteed profits.

Projects use a few named complementary gates. A magnet pilot needs a relevant discovery/licence, engineering skill and equipment access. A commercial line additionally needs feedstock, process knowledge, power, water and logistics. Missing prerequisites pause the affected phase, identify the cause and preserve already paid costs. A mature but uncompetitive factory can produce at low margins or be mothballed; it should not create prosperity merely by existing.

Substitution projects reduce a named input coefficient or switch to an alternative equipment/process family after pilot validation. Their useful progress is seeded and repeatable, with a stated remaining work range. Do not roll a surprise coin on the final click. Research-only countries can earn royalties; that is distinct from domestic manufacturing value.

Capacity and demand use consistent normalised units per sector. Translate them into utilisation and costs before updating headline indices. Existing 0-100 national capability scores are not tonnes, megawatts or cash. Prefer a bottleneck minimum across inputs over stacking independent output bonuses.

## 7. Contracts and dependencies change later choices

| Commitment or shortage | Actual later consequence | Player counterplay |
|---|---|---|
| Aster six-turn exclusive cloud contract, specified workloads | Ordinary competing procurement for those workloads is unavailable; fees continue. Sensitive data partnership may be incompatible with residency terms. | Negotiate a carve-out, pay disclosed termination cost, build a migration bridge, wait for expiry, or knowingly breach. |
| Meridian licensed process without sublicensing rights | Produce under licence and pay royalties; cannot sell that IP or sublicense it as domestically owned. | Buy broader rights, develop a distinct process or negotiate a joint venture. |
| Concentrated imported chips plus an enacted export restriction | Restricted chips cannot commission the relevant cluster; affected project pauses. Existing usable chips do not vanish. | Alternative legal supplier, permitted lower-spec substitute, waiver, inventory buffer or redesign. |
| Long-term low-price material offtake with minimum purchases | Switching suppliers retains the purchase liability; domestic output may not be competitive. | Renegotiate, honour the term, pay exit cost or reduce investment scale. |
| Grid/water shortage | Plants run below capacity; new grid connection cannot be promised without headroom. | Grid/reuse investment, purchased supply where feasible, rationing, phased commissioning. |
| Breached agreement | Counterparty withdraws specified access, claims damages and updates trust; other actors react according to their exposure. | Settlement, court/arbitration route with a delay, alternative counterparties. |

A single `availability(state, action)` returns structured reasons, possible financing and escape routes. Both UI and engine call it. Disabled buttons alone do not enforce a rule. No restriction may be bypassed by constructing the action directly in code.

Every new contract preview says: **you get / you owe / you cannot ordinarily do / until when / how to exit**. Exact party, sector and workload scope matter. Exclusivity does not transfer control of the entire government. Corporate withdrawal must respect its assets and contractual obligations, with breach consequences for the company too.

## 8. Diplomacy and autonomous actors

NPC governments and the seven existing fictional firms retain independent assets and budgets. On each period they consider a small feasible set: invest, offer a licence/JV, offer supply, counterbid, restrict controlled exports, renegotiate, relocate a feasible asset or wait.

[ASM] Utility combines expected operating/royalty gain, strategic access and relationship value, minus capital/resource cost, lost sales and treaty/retaliation risk. The actor chooses the best positive feasible utility, with seeded tie-breaking. Do not hardcode punishment whenever the player improves. A rival may profit more from continued sales.

An inbox contains at most two relevant pending offers, usually valid for one or two visible decision windows. The turn's main brief promotes a due crisis or strategically important offer. Other offers can be declined or deferred. The player can initiate outreach from a compact diplomacy action: choose a capable counterparty, select supply/licence/JV and see a quote, rejection reason or counteroffer. Only the final committed negotiation consumes the turn. Do not allow unlimited free relation gains through repeated proposals.

### Required end-to-end example: Germany, India and China

1. Germany develops a dry-process magnet discovery and proves a pilot. Its technology, capacity and commercial interest make an overseas production partnership worthwhile.
2. India has sufficient skills/processing potential and unmet demand. Germany can offer a JV, or India can approach Germany. The same state checks govern both directions.
3. Offer: upfront capital, royalty, two-turn commissioning, defined German IP ownership, Indian manufacturing rights and process training. Accept, counter for transfer/non-exclusivity at a higher cost, or decline.
4. Acceptance queues real capacity and adds contractual rights/fees. Water savings begin only when the validated process operates. If India lacks a prerequisite, the quote discloses the delay or refuses the deal.
5. China evaluates expected lost processing margin, its remaining upstream leverage and retaliation costs. It may offer a cheaper long-term supply contract, invest to improve efficiency, restrict a controlled input, or do nothing. Each response changes actual prices, availability, assets or contracts.
6. India responds to a visible competing offer or restriction deadline. Existing exclusive procurement can prevent a new ordinary deal, with costed exits. A non-exclusive German partnership must not automatically cause an embargo.

This scenario is an acceptance fixture, not a script forced into every campaign. Equivalent opportunities can emerge between other capable countries. All countries remain in one shared world even when they are not selected.

## 9. Variety without a sprawling dialogue game

Replace deck position with eligibility, urgency and novelty:

`eligible trigger -> feasible actor/action choices -> deadline priority -> recent-family penalty -> seeded tie-break`

An event definition has an ID/family, prerequisites, trigger, involved actors, expiry, cooldown, repeat policy and real state effects. Priority is: imminent failure/payment -> due commitment -> expiring offer -> project turning point -> strategic opportunity -> ordinary cabinet agenda.

[ASM] Target at least 48 authored templates across finance, research stages, infrastructure, food/housing, trade, diplomacy, corporate bargaining and crisis management. Measure meaningful choice combinations, not just unique titles. Exact card plus option bundle may not repeat in one 18-turn campaign. Avoid consecutive same-family cards unless a crisis develops. An upgraded investment can recur only with a different phase, constraints or commitments.

The player still sees two or three choices. They may open a cabinet alternative to deal with a more urgent domestic problem, consuming the same major-action slot. Declining every foreign offer remains playable. Never force the player to accept irrelevant offers while an essential-service deadline passes.

## 10. Failure scenarios, dates and recovery

Separate a costly setback, a national-objective miss and an early terminal failure. A single bad metric must not silently become game over.

| Risk | Trigger and countdown [ASM] | Consequence and escape |
|---|---|---|
| Payment default | Due interest/principal cannot be paid; one full decision window of disclosed grace. | Restructure, refinance if eligible, cancel spending or raise emergency receipts. Unresolved sovereign default ends the campaign, with a causal timeline. |
| Government collapse | Approval below 20 at two consecutive settlements. First breach warns of next-settlement risk. | Restore essentials, relief or negotiated reform. Remaining below threshold at the second settlement ends the campaign. |
| Essential-service breakdown | Household power or food coverage below 60% of baseline essential demand for two consecutive settlements. | Ration industry, procure actual available imports, release buffers or restore infrastructure. Persistent breakdown ends the campaign. |
| Environmental emergency | Operating load exceeds the local safe envelope long enough to trigger permits/health opposition. | Specific asset curtailment and approval damage; mitigation, reuse or scaled operation. Terminal only through a stated service/government failure rule. |
| Commercial defeat | Licence expires, pilot lacks inputs, rival undercuts costs or customer contract is lost. | Project stalls, capacity closes or expected receipts disappear. Usually a recoverable setback, not instant game over. |
| Corporate capture | Dependence and signed concessions give one company control over critical operating access. | Constrained tenders, rents and investment pressure, with visible exit routes. Also an ending assessment, not an unexplained instant loss. |

Every danger card names the cause, affected asset/service, remaining windows, conditional critical half-year and at least one actually feasible intervention if available. If none exists, say why. Calculate the date using the resolver; do not hardcode a failure year for a country.

Credit maturity and contract expiry are exact dates. Shortage/default projections are labelled **if nothing changes**. Curing the cause resets the relevant consecutive-failure counter. Tests must prove warning, attempted rescue and actual failure dates agree. No unavoidable start-state failure for any country in the supported seed set.

The ending weighs actual living standards, functioning productive assets, retained IP/income, access resilience, remaining liabilities and public/environmental condition. It can identify several legacies at once. Do not choose the ending from the last click or one additive score. Keep the graph's composite progress score as orientation, not a substitute for these conditions.

## 11. Country differences

Retain all twelve countries. Reuse baseline capabilities while balancing the shorter horizon. Each country needs different feasible opportunities, counterparties and constraints, not only different scoring weights. These are [ASM] scenarios, not national rankings.

| Country | Campaign ambition | Distinct pressure/opportunity |
|---|---|---|
| India | Raise living standards and retain more industrial value | Execution, grid and water compete with compute; large production partnership opportunity. |
| United States | Preserve innovation and rebuild critical production | Chip/cloud IP leverage; reindustrialisation costs and partner trust. |
| China | Preserve competitive scale and secure advanced tools | Processing leadership; price defence competes with innovation and margins. |
| Germany | Keep advanced industry viable and monetise process IP | Energy cost pressure; overseas scale-up partners. |
| France | Turn science and usable power into commercial value | Research-to-pilot gap and infrastructure/social allocation. |
| Saudi Arabia | Convert capital/energy into durable new industry | Water, food and imported expertise constrain expansion. |
| UAE | Capture logistics and technology-service income | Reliable foreign access, food/water and contract concentration. |
| Japan | Protect process leadership and secure critical inputs | Resource/energy imports; valuable equipment licences. |
| South Korea | Sustain specialist manufacturing margins | Tool/material access and export-customer concentration. |
| Australia | Add profitable processing to resource exports | Overbuilding risk, water and downstream partner selection. |
| Indonesia | Move from extraction into higher-value production | Freight, skills and environmental limits. |
| Brazil | Raise industrial productivity from resource strengths | Logistics, engineering and domestic affordability. |

Before release, set two visible country-specific numeric ambitions and a safety guardrail from country-relative improvement and viable routes. Publish them in scenario data. These thresholds remain [GAP] until the 18-turn balance sweep; do not invent proof that the current 28-turn targets fit. All countries must have a tested path to a credible positive ending, including an import/partnership route where sensible.

## 12. Characters and the phone interface

Use fictional country envoys and company executives as persistent representatives. They speak for assets, objectives and past agreements, rather than acting as decorative random dialogue. Keep the existing seven composite firms: Aster Cloud, Meridian Machines, Helix Materials, BlueWave Freight, GrainVault, NorthGrid Energy and Atlas Industries.

Each character has a name, role, country/company, short agenda, stable portrait and remembered commitments. Relationship labels explain changes: honoured licence, rejected offer, breached offtake, shared project. Pressure tactics require leverage: controlling an input, financing a project, holding an exclusive contract or owning a critical asset. A disliked character without leverage cannot block everything.

Start the vertical slice with India/Germany/China representatives and one relevant executive. Later cover twelve countries and seven firms. Use original portraits, no copied game art or real politician likenesses. No national caricatures. Prefer small original SVG or compressed 128-192px WebP portraits, lazy-loaded per encounter. [ASM] Budget about 8-18KB per raster portrait; test actual assets rather than assuming compression. Do not add portrait generation at runtime.

The main screen should contain: time and turn graph; one urgent deadline/adviser line; one actor and dilemma; two or three large options. Optional drawers contain ledger, dependencies, projects and diplomacy. An outcome report prioritises: immediate change, delayed effect, actor response, newly blocked/unblocked option and risk deadline. Show a portrait when that actor has something material to say.

Keep solid actual history and a dotted conditional continuation to 2035, showing known project/loan/contract milestones. The continuation assumes no new player policy and includes existing obligations and actor behaviour; it is not a probability forecast. Offer an optional selected-decision comparison, never an unexplained confident prediction. Do not overwhelm a 390px phone with every series.

Targets: 44px minimum primary touch targets, no horizontal overflow at 320px/390px, reduced-motion support, keyboard access and a text alternative to charts. [ASM] Initial compressed game assets including the first portrait should stay below 250KB. Measure choice/forecast latency; move computation to a worker only if profiling proves needed. Actual older-phone performance and enjoyment remain [GAP] until tested.

## 13. Lessons from existing games and open implementations

These are sources for specific mechanics, not a claim to know proprietary algorithms. No proprietary code, text or art may be copied. The earlier [research register](DESIGN_RESEARCH.md) retains Victoria 3, Suzerain, Terra Invicta, Fate of the World and En-ROADS references and their evidence limits.

| Source checked | Verified mechanic/documentation | Our adaptation [INF/design] | What we reject |
|---|---|---|---|
| Civilization VII, publisher dev diary #6 | Negotiated offers, relationship-changing diplomatic actions, cooperation and sanctions. | Actor-led offers/counters and access conditional on actual agreements. | Hex-map conquest, eras, large research trees and a separate influence currency. |
| Democracy 4, official mod documentation | Linked variables with equations and multi-turn inertia. | Delayed operating/social effects and data-defined triggers. | Hundreds of sliders or calling our arithmetic a learning AI. |
| Offworld Trading Company, official gameplay guide | Input chains and supply/demand markets; buying inputs can outperform owning every upstream asset. | Bottlenecks, rivalry and genuinely viable imports. | Real-time trading, share takeovers and a new commodities dashboard. |
| Into the Breach, developer description | Enemy attacks are telegraphed before the player acts. | Readable threat, response window and expected consequence. | Its combat model; economic uncertainty is not fully knowable. |
| Endless Sky, FOSS mission documentation | Conditions for offering/accepting/completing/failing missions, deadlines and action triggers. | Declarative event prerequisites, branching commitments and explicit failure timers. | Its C++ engine and spaceflight simulation. No source copied. |

Primary links checked 14 November 2026:

- [Civilization VII publisher dev diary via Steam](https://store.steampowered.com/news/posts/?enddate=1736367930&feed=steam_community_announcements). Direct 2K page returned HTTP 403; publisher-hosted full announcement was readable. Do not use the failed fetch as proof.
- [Democracy 4 modding/effects](https://www.positech.co.uk/democracy4/modding.html).
- [Offworld official gameplay guide](https://wiki.offworldgame.com/index.php/Gameplay).
- [Into the Breach developer page](https://www.subsetgames.com/itb.html). Search-indexed developer description verified telegraphing; direct non-www fetch returned 403. No claim of inspecting its source.
- [Endless Sky mission documentation](https://github.com/endless-sky/endless-sky/wiki/CreatingMissions). Read the documented condition, deadline and trigger syntax; no claim of auditing the entire engine.
- [GitHub Pages static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [no server-side Python](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
- [Pyodide browser usage](https://pyodide.org/en/stable/usage/index.html).

[SRC] GitHub Pages can host the static HTML/CSS/JavaScript game; it does not run a Python server. Python could run client-side through Pyodide/WebAssembly, but requires loading and initialising another runtime. [INF] That adds effort without improving this small turn resolver. JavaScript can run the entire simulation locally in each player's browser. A shared world means one coherent world per campaign, not a persistent multiplayer server. Node can run the same rules in automated tests; Python remains optional offline analysis tooling.

## 14. Implementation sequence and Claude handoff

### P0: this planning revision

Publish this canonical plan, root `CLAUDE.md` and `AGENTS.md` pointers, and update README/BUILD_STATE. Keep runtime assets unchanged. Claude can read the public main branch or pull it locally. No cross-chat delivery/read receipt is implied.

### P1: prove the causal chain in a playable vertical slice

Add 18-turn configuration, integer money, elective debt, payment schedules, contract scopes and central availability reasons. Build the Germany/India/China example with real offers, leverage, delayed production and a preventable payment/shortage crisis. Wire a small playable briefing/negotiation/report UI while testing, rather than writing a detached engine prototype. Reuse existing visuals. No fake-data panels.

Proof: an unaffordable project can be financed; next-period revenue pays interest; an exclusive deal actually changes a later choice; a genuine foreign partnership changes capacity; a rival responds only when feasible; a warned failure is preventable. All results replay deterministically.

### P2: extend agency and variety

Implement the event dispatcher, proactive outreach, contract exits, supply substitutions, scoped licences, research stages and shared actor utility. Add content and differentiated objectives for all twelve countries. Remove the fixed opening/deck/endgame selection path. Balance resource demands and project durations for 18 turns. Preserve profitable import strategies.

### P3: make the rules readable and engaging

Complete onboarding, finance sub-choice, consequence reports, diplomacy inbox, project/deadline markers and conditional graph. Add the first portraits, then the full cast only after the core encounter works. Keep detail optional. Endings identify the actual project/deal/shortage chains, show liabilities beyond 2035 and support share cards plus same-seed replay.

### P4: balance, mobile verification and release

Run the matrix and browser checks below. Fix failures, rerun affected checks, then create a production checkpoint and deploy through existing Pages configuration. Freshly test the deployed root, not just local code. Update build evidence and known gaps after release.

Do not keep old campaigns under the new 18-turn resolver. Keep the old save key intact and introduce a versioned v2 key/schema. Offer an explicit new campaign and a preserved legacy route or export where feasible. Do not silently truncate a 2040 campaign or delete saved progress. Preserve the existing rollback branch and candidate assets.

## 15. Acceptance tests and release evidence

All tests below are **planned**, not passed by the baseline's 29 tests.

| ID | Required observed proof |
|---|---|
| A01 Brief/horizon | First-time player can state the goal, action cadence and main dangers. Exactly 18 settlements, final label 2035 H2; no simulated future credited beyond horizon. |
| A02 Elective debt | Cash 5/cost 12/eligible gap 7 succeeds with disclosed consent; cash-only selection fails atomically; ineligible credit explains why. |
| A03 Finance integrity | Reconcile cash and principal for every actor/turn; next-period coupon reduces tax-funded cash, not principal; maturity/arrears/refinance/write-down have separate records. |
| A04 No debt exploit | Repeated borrowing/repayment/quote retries cannot create cash; post-2035 liabilities count; default cannot be bypassed through hidden auto-credit. |
| A05 Contract gates | Covered competing tender is blocked by exclusivity in engine and UI; unrelated tender remains legal; payment/expiry/breach unlocks correctly and applies actual costs. |
| A06 Technology rights | Licensed discovery is not owned IP; forbidden sublicensing rejected; pilot/process/equipment gates delay commercial value. |
| A07 Import path dependence | Cheap sourcing improves early cost/output; switching has real cost/time; a controlled supply restriction pauses an affected project. Concentration alone does not invent an embargo. |
| A08 Rational imports | Reliable affordable imports can support a positive ending without compulsory import substitution. |
| A09 Resource opportunity cost | AI-first India without utilities develops more stress than a matched supported route; grid/reuse measurably improves operating economics and resource coverage. |
| A10 Diplomacy | Germany can initiate a qualifying JV; India can initiate outreach; terms/counters/declines/expiry produce distinct state changes. |
| A11 Rival incentives | Rival reaction changes actual price/access/capacity; no retaliation if unavailable or utility-negative; China continues its own technology investment. |
| A12 Company agency | Firm follows its assets/contracts, may reject or counter, and can be constrained. Contract breach has consequences for either party. |
| A13 Event variety | No repeated exact card/choice bundle in a campaign; content-family coverage and effect signatures expose cosmetic repetition. Repeated crises must arise from unresolved state. |
| A14 Failure timers | For each failure: trigger -> warning -> valid rescue -> recovery and alternate no-rescue -> failure at displayed boundary. At least one visible response window before avoidable terminal failure. |
| A15 Replay/preview | Identical seed/actions/financing reproduce byte-equivalent settled state. Previews/outlook do not change live state, offers or random stream. |
| A16 Endings | AI success, stranded IP, profitable interdependence, dependence vulnerability, fiscal exhaustion and social backlash trace to actual histories, not last-click or one score. |
| A17 All countries | Every country has a feasible positive route for every supported acceptance seed. Different starting endowments change viable deals and bottlenecks. |
| A18 Balance | No archetype dominates all four dimensions (prosperity, resilience, retained value, sustainable finances) across all country/seed pairs. Report distributions and failures, not a few winning examples. |
| A19 Mobile/runtime | Real browser campaigns at 390px; no overflow at 320px; keyboard/text alternatives, reload/save/replay/share, image fallbacks and no source errors. Physical old-phone gap explicitly recorded if untested. |
| A20 Public release | Deployed root matches tested asset hashes; complete public 18-turn campaign; documented checkpoint and tested recovery instructions; README/BUILD_STATE updated. |

[ASM] Planned first balance matrix: 12 countries x 24 seeds x 11 strategies = **3,168 campaigns**, up to 57,024 player transitions before early failures. Strategies: AI-first, research/licensing, domestic industry, infrastructure, cheap imports, diversification, foreign JV, household-first, fiscal caution, random and adversarial. Use the same world seeds for paired strategies. Track failures, dates, outcome dimensions, constraints, event families and unmet prerequisites. Add targeted high/low opening capital and resource-stress fixtures without pretending they are ordinary starts.

Browser minimum: several complete campaigns spanning domestic AI, import-led partnerships and a rescued crisis; a deliberate terminal failure; mid-game reload; same-world different-route replay; final report/share. Repeat a full successful campaign against the actual public root after deployment. Unit tests are insufficient evidence of comprehension, pacing or enjoyment. Do not force the illustrative hypotheses to pass by country-specific scripted outcomes.

## 16. Current status, risks and recovery

[SRC] This revision changes documentation only. The shipped game remains v1.2 / 2040 / 28 turns, with upfront loan selection still missing. Existing graph and tax-funded interest servicing remain working capabilities. The 29-test baseline is passing.

[GAP] No v2 rule, portrait, loan UI, diplomatic negotiation or failure timer has been implemented or playtested yet. The 3,168-campaign matrix, country target values, asset/performance targets and enjoyment assessment are pending.

[RISK] Adding contracts and event variety without central gates would create more misleading text. Adding portraits before proving actor leverage would make the same shallow choices prettier. Implement the causal vertical slice first, then extend content and art.

Rollback/checkpoint for this planning revision: baseline `5cd457918621c99b31846bcc8ea99d5b89b56a42`; revert only the planning commit in a new commit if needed. Existing runtime rollback remains `rollback/pre-v1.2-20261114` at `31c7b77819ef97e74d36751c36b22f2ee0ce48ec`. Do not reset shared history, remove legacy snapshots, change repository access or add paid services.

Next executable action: P1, debt/contracts/18-turn vertical slice. No architectural approval or additional service purchase is required.
