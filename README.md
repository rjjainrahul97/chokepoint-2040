# CHOKEPOINT 2035 v2.0

[Play](https://rjjainrahul97.github.io/chokepoint-2040/) · [Continue a 2040 campaign](https://rjjainrahul97.github.io/chokepoint-2040/legacy-2040/)

Can AI-powered R&D improve national sovereignty and prosperity if done right? Lead one of twelve countries through 18 half-years, 2027-2035. Borrow, build, bargain and trade. Discoveries need engineering, useful infrastructure and competitive production to deliver prosperity.

New in this release: supplied cartoon representatives, state-driven briefs, foreign production partnerships with royalties and retained IP, enforceable Atlas exclusivity and buyouts, leadership reviews, conditional failure deadlines and a credit-crisis scenario. Reports put immediate effects and commitments first. Choose which indicator the actual/dotted graph tracks. Existing 2040 saves have their own preserved route.

[Product/design/player review and revision plan](docs/PRODUCT_REVIEW_V2.md) · [Detailed longer-term rules contract](docs/NEXT_VERSION_PLAN.md) · [Build state, evidence and limits](BUILD_STATE.md).

Implementation: deterministic browser JavaScript plus SVG, no runtime library, login, analytics or paid API. Portraits load per active encounter, not as a 38-image preload. Testing: `npm test`; `node tools/modern-sweep.mjs`. The latter records 12 countries x 24 seeds x 11 policies, with per-country CSV evidence.

Known limits: fixed-maturity loans, a general diplomatic inbox and full personal/coalition politics remain future work. Phone-width Chrome tests do not establish physical Safari/Android performance or human enjoyment. See the review for precise implemented rules.

Rollback checkpoint: `rollback/pre-2035-playability` at `b7aeb9328522b0e78c07a4ad9893462b37af4172`. Restore runtime files in a new commit; retain both save keys, portraits and legacy assets.

---

## Historical v1.3 release notes

# CHOKEPOINT 2040 v1.3

[Play the game](https://rjjainrahul97.github.io/chokepoint-2040/)

**The question:** Can AI-powered R&D improve national sovereignty and prosperity if done right? Govern a country, build capabilities, manage household costs and discover whether your research becomes competitive production or someone else's opportunity.

## New in v1.3: choose debt, see its cost

- A policy costing more than cash remains selectable when project credit is available. Click it, review the cash gap and confirm borrowing. Affordable policies also offer full financing so you can retain cash.
- Project loans cost 3.5% per half-year. Their first interest charge is next half-year and reduces the tax-funded budget. Principal remains outstanding until repaid and affects your ending. This release uses an interest-only credit line, not fixed-maturity bonds.
- Treasury & borrowing shows the credit ceiling and offers a debt repayment policy each turn. Voluntary project credit is limited by recent tax revenue and existing debt. The legacy emergency facility still covers operating deficits.
- The ledger separates taxes/earned receipts from borrowing. Loan mode and amount survive deterministic replay, save/reload, historical charts and forecasts. A pre-v1.3-action save backup is retained on device for rollback.
- The opening explainer states the thesis, your job and possible outcomes, without promising that domestic AI or independence always wins.

**Artwork request:** [2D cartoon brief, exact files and usage plan](docs/ART_ASSET_BRIEF.md). Two fictional representatives for each country/company: 38 portraits, eight in the first batch. The [manifest](design/portrait-manifest.json) labels them requested, not supplied. Leadership changes and dialogue are planned, not yet live.

**Next version: CHOKEPOINT 2035.** [Detailed goal, rules and implementation plan](docs/NEXT_VERSION_PLAN.md). The wider 18-turn horizon, fixed-term debt, enforceable scoped contracts, negotiations, failure deadlines and succession remain pending. The current repair preserves 28-turn campaigns and the existing public URL. [Claude entry point](CLAUDE.md).

Verification and rollback: [BUILD_STATE.md](BUILD_STATE.md), [v1.3 evidence](test-results/v1.3/). Before this release: `rollback/pre-elective-debt-20261114` at `69738d4b4e360fc80370682be7d3f8d88aa8f01a`. Restore runtime files in a new commit; do not reset shared history. Old cash-only campaigns remain byte-equivalent. For a newly financed save on an old engine, recover the device's `chokepoint_2040_save_v3_before_v13` backup into the original key only with an explicit user recovery action, retaining the financed save separately.

## Previous visual release

Reviewed visual release: decision previews, a top-of-turn solid history with dotted conditional outlook, score and rival comparisons, optional warning loops, a world map and production-capacity shares. Existing campaigns and game rules are preserved.

The dotted path assumes **no new player choices**: queued projects, bills, research and autonomous world events continue for up to six half-years, ending at 2040. It is conditional, not guaranteed. Emergency borrowing covers cash deficits; v1.3 additionally offers explicit upfront project credit. Interest is deducted from the tax-funded budget.

Review, tests, assumptions and limits: [v1.2 review](docs/V1_2_REVIEW.md). Rollback: `rollback/pre-v1.2-20261114` at `31c7b77819ef97e74d36751c36b22f2ee0ce48ec`.

**Own tomorrow. Pay for today.** A free, mobile-first geopolitical strategy game about sovereign AI, industrial capability and the cost of independence.

[Play the game](https://rjjainrahul97.github.io/chokepoint-2040/)

Choose one of 12 countries. Govern for 28 half-years from 2027 H1 to 2040 H2. Each cabinet brief offers three policies. Build, trade, negotiate, regulate, commercialise research or protect households. Other countries and seven fictional corporate groups operate in the same world.

## What's new in v1.2: visual system

- Choice preview: dots on each option show how much each score moves this half-year, computed by running the real engine.
- Where you stand: an "if the game ended now" score against the 50 no-change line, plus each score against your 2027 start, the rival average, your rank of 12 and the approval danger zone.
- Warning signs: power, debt and dependency spirals drawn as cause loops when two or more conditions are true, each with a way to break it.
- World map in every consequence report: relations, your main supplier and active export controls.
- Moats: your share of world supply for each good against the top holders.
- Design reference at `design/visuals.html`: every pattern, the game it is borrowed from, and previews of the AI stack and sovereignty ladder planned for phase 2.

## What's new in v1.1: readable consequences

- Every turn's outcome now says **why** each headline number moved. Reasons are computed from the engine's own formulas, not flavour text.
- Four named citizens per country (worker, household, engineer, farmer) show what each decision meant on the ground, and where they stand in 2040.
- Plain-language metric names: Living standards, Independence, Public approval, Value kept at home, Budget.
- Visual dashboard: metric tiles with change since last turn, a 28-turn timeline, foundation bars with red bottlenecks, and an "under construction" pipeline.
- Option cards show budget share, time in months, and effect chips. An adviser line flags the most urgent problem before each choice.
- Budget shown as a bar breakdown in plain words; world events say whether they affect you.

## What's different in v1.0

- Nineteen distinct policy mechanics replace the common build/deal/buffer template.
- Laboratories and compute produce discoveries and owned IP. Pilot lines build process knowledge. Manufacturing needs equipment, materials, power, water, logistics and skilled workers before it captures value.
- Cheap inputs deliver immediate gains while supplier concentration, toolchain lock-in and switching costs accumulate. Reliable imports can still be useful.
- Six global supply/demand markets respond to government projects, export restrictions, corporate supply assets and player investment.
- NPC governments invest according to needs and strategic priorities. Firms expand, lobby, defer assets and reprice actual contracts.
- Every half-year has an itemised capital ledger, domestic and world consequences, delayed completion messages and optional detail.
- Quick play, saved campaigns, deterministic same-world replay, previous-run comparison, share text and previewable PNG outcome cards (SVG fallback).
- Multiple coexisting legacies based on the whole campaign, including research without industrial capture, profitable interdependence, corporate capture and failed substitution.

## Run and verify

No install or build step is needed. Use Node 20+ for tests and Python 3 for a local static preview:

```sh
npm test
node tools/balance.mjs
npm run serve
```

Open `http://localhost:8000`. Any static host supporting ES modules works. Production remains GitHub Pages from `main`, repository root. Existing `.nojekyll`, favicon and MIT licence are preserved.

For visible browser acceptance, open `tools/browser-check.html`, use the viewport selector and reload control, and follow [the verification record](docs/VERIFICATION.md). It loads the actual game rather than a mocked engine.

The balance harness writes `test-results/balance.json` and `test-results/campaigns.csv`. It checks 12 countries, eight seeds, eleven policies and 72 modified starting conditions. Scenario assertions live in `tests/engine.test.mjs`.

## Architecture

| File | Responsibility |
|---|---|
| `src/countries.js` | Preserved 12 country profiles and national objective weights |
| `src/engine.js` | Pure state transition, projects, discovery work, production, budgets, markets, government utilities, firm policies, outcomes and replay validation |
| `src/story.js` | Plain-language layer: metric reasons, citizen vignettes, headlines, adviser notes. Read-only over state |
| `src/visuals.js` | Visual components (preview, standing, spirals, world map, moats, AI stack, ladder). HTML/SVG strings, no libraries |
| `src/map-data.js` | Generated world map paths (Natural Earth via world-atlas, public domain). Rebuild with `tools/make-map.mjs` |
| `src/app.js` | Country selection, cabinet decisions, consequence briefings, optional systems view, saves and sharing |
| `src/style.css` | Responsive phone-first interface, keyboard focus and reduced-motion support |
| `tools/balance.mjs` | Country/seed/policy sweeps and state/accounting invariants |
| `docs/DESIGN_RESEARCH.md` | Verified reference mechanics, sources, adopted simplifications and rejected complexity |
| `BUILD_STATE.md` | Acceptance evidence, deployment status, rollback and known limits |

Each half-year: validate choice → commit capital/contract → country and corporate policies → complete engineering work → recompute markets → research/production/resource feedback → settle budgets → update shared prices → record consequence → advance time.

All twelve nations use the same resource and economic calculations. NPCs make a discrete investment once per three turns, staggered across nations; budgets, research and operating costs settle every turn. This deliberately limits how much construction happens in a six-minute game. Company supply assets contribute to the same markets.

## Transparent assumptions

This is entertainment with educational value. All indices and parameters are fictional. It is not economic forecasting software. Production and value kept are distinct: buying a foreign licence can raise output without transferring IP ownership. Capital is a strategic budget unit, not dollars or GDP. Market prices are multipliers and capability indices run from 0 to 100.

Project work requires time and can slow when engineering teams are crowded. Projects completed after 2040 receive no premature production credit. The final three briefs prefer choices that can pay off before the horizon.

The v3 save schema is separate from v2. Old saves remain under their old browser-storage key and are not migrated into the different engine. New saves are checked by replaying their action history. No account, network API, database, analytics, AI calls or service worker is used.

## Limits and rollback

Markets aggregate goods and do not conserve every bilateral financial flow. Defence, elections, exchange rates, detailed land use and full climate physics are outside scope. Finite simulations cannot establish perfect balance or prove the absence of exploits. The 5-7 minute duration is a design target pending human playtesting.

Rollback checkpoint for v1.1: branch `rollback/pre-v1.1-20261114`. Earlier checkpoint: branch `rollback/pre-v1-20261113`, commit `9ebb104499f0f58907d6080c72935e4c6ff087ae`. Restore its tracked game files in a new commit on main to trigger a Pages rollback. Retain history and the v3 save key to allow forward recovery.

MIT licensed. No proprietary game source code or protected assets are included.
