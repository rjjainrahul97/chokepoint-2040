# CHOKEPOINT 2040 v1.2

[Play the game](https://rjjainrahul97.github.io/chokepoint-2040/)

Reviewed visual release: decision previews, a top-of-turn solid history with dotted conditional outlook, score and rival comparisons, optional warning loops, a world map and production-capacity shares. Existing campaigns and game rules are preserved.

The dotted path assumes **no new player choices**: queued projects, bills, research and autonomous world events continue for up to six half-years, ending at 2040. It is conditional, not guaranteed. Borrowing automatically covers cash deficits; interest is deducted from the tax-funded budget. There is no upfront loan option for unaffordable projects.

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
