# Current release card: elective debt, thesis and cartoon asset brief

Build ID: CP2040-20261114-DEBT-BRIEF
Status: DEPLOYED / PUBLIC ROOT VERIFIED
Version: 1.3 (current 28-turn ruleset; broader 2035 v2 remains pending)
Public URL: https://rjjainrahul97.github.io/chokepoint-2040/

## Changes and observed evidence

- [SRC] Upfront gap/full project credit is implemented with explicit consent, finite discretionary credit, a 3.5% half-year rate, first interest next half-year and voluntary repayment. It is an interest-only credit line; no fixed maturity/default system is claimed.
- [SRC] Exact reported case acceptance: cost 7.06, cash 4.66, chosen loan 2.40. Engine applies the project rather than rejecting the choice. Borrowing is recorded separately from tax/royalty income.
- [SRC] Home brief now states Rahul's AI/R&D thesis and describes possible campaign outcomes. Artwork request and usage plan: [docs/ART_ASSET_BRIEF.md](docs/ART_ASSET_BRIEF.md); requested cast: [design/portrait-manifest.json](design/portrait-manifest.json).
- [SRC] 36/36 tests passed. Forty-eight prior-release campaign hashes remain byte-equivalent; financed campaigns validate and replay with unchanged forecasts/history. A device backup before the first v1.3 decision supports rollback recovery.
- [SRC] Finance sweep: 576 complete campaigns, 16,128 transitions, 193,536 ledgers, 4,192 chosen loans and 2,553 repayment turns. Credit rejected 5,485 over-limit options. See test-results/v1.3/finance-sweep.json.
- [SRC] One complete normal-report candidate browser campaign: 28 India turns, seed 2040; loan cancellation, gap credit, repayment, turn-14 reload, ending and optional full credit/quick-report flow verified. Candidate ran on existing Pages after local preview failed with ERR_CONNECTION_REFUSED. No game-source console errors; unrelated browser-extension metadata errors observed.
- [SRC] Candidate at 390px and 320px: no horizontal overflow; narrow document client/scroll widths both 305px, excluding its scrollbar. Physical iPhone/Safari and old-phone timing remain unverified.
- [CALC] Locally estimated gzip total 66,533 bytes, zero runtime libraries, no portraits loaded. Desktop Node choice-preview/trajectory median 9.26ms, p95 11.85ms; these are not physical-phone measurements.

## Acceptance and remaining work

[SRC] Candidate snapshot: `1ab280e97e6519dab0fc8c8101de98022818209d`; Pages run `43587493944` SUCCESS. Production release: `bed08a49074ae217a30a902c179ac9f23662538b`; Pages run `43588410634` SUCCESS. Fresh public root loaded `app.js?v=4.7`. Eight deployed runtime files match local hashes (`test-results/v1.3/public-assets.json`). Existing production root remained untouched during candidate QA.

[SRC] Public acceptance: finished a normal-report campaign by resuming a valid v1.2 save after turn 1 and playing the remaining 27 turns, including a loan, turn-14 reload and rendered PNG outcome preview. Then played all 28 turns of a fresh same-world quick replay with optional full financing, a turn-19 reload and a different ending: fiscal exhaustion (30.83 debt, 97.4 production) versus diversification (0 debt, 51.4 production). No game-source console errors. Narrow root layout also had equal client/scroll widths. Final root explainer read back the exact thesis and possible outcomes. Full records: test-results/v1.3/public-browser.json. Three complete campaign histories were exercised across candidate and production, with 83 campaign decisions applied through the UI plus the additional full-credit quick-flow probe.

[GAP] Art is requested, not supplied or integrated. Political/board succession, negotiations, enforced exclusivity, fixed-maturity debt, failure countdowns and CHOKEPOINT 2035/18 turns are still pending in the canonical next-version contract. The current release repairs borrowing and explanation without claiming those broader criteria.

Rollback: `rollback/pre-elective-debt-20261114` -> `69738d4b4e360fc80370682be7d3f8d88aa8f01a`. Restore prior runtime files with a new commit, preserving history, new saves, candidate snapshots and supplied assets. Financed saves need the updated engine; a prior snapshot is retained at the save key plus `_before_v13`. Keep both before any recovery. No paid service, account permission change, runtime AI or new hosting.

Next action: continue the canonical 2035 vertical slice and import batch-1 portraits when supplied. Current debt/explainer repair is verified; the broader v2 acceptance contract remains open.

---

## Historical planning and release records

# Next-version build card: CHOKEPOINT 2035

Build ID: CP2035-20261114-RULES
Status: RULES SPECIFIED / IMPLEMENTATION PENDING
Date: 14 November 2026
Canonical contract: [docs/NEXT_VERSION_PLAN.md](docs/NEXT_VERSION_PLAN.md)
Claude entry point: [CLAUDE.md](CLAUDE.md); repository instructions: [AGENTS.md](AGENTS.md).

- [SRC] Inspected v1.2 at `5cd457918621c99b31846bcc8ea99d5b89b56a42`. Fresh baseline suite: 29/29 tests passed. Low-cash action probe confirms no elective project loan; first card remains identical across tested seeds.
- [SRC] Current source already has deficit borrowing, interest costs, shared markets, NPC investment and a conditional history graph. Exclusive concessions lack scoped action gates; most foreign events lack negotiable response windows.
- [ASM] Chosen next target: CHOKEPOINT 2035, 18 half-years, same repository/public URL, pure browser JavaScript. Detailed debt, contracts, diplomacy, failure timers, characters, event selection and release criteria are in the canonical contract.
- [SRC] This change is documentation only. Current live runtime remains CHOKEPOINT 2040 v1.2. Existing production assets and saves are unchanged.
- [GAP] No v2 feature or acceptance test is implemented/passed. Country numeric targets, new balance sweep, new browser acceptance and production rollout remain pending.
- Next action: P1 playable finance/contracts/India-Germany-China vertical slice, then full content, mobile verification and deployment. No new infrastructure is required.
- Planning checkpoint: `5cd457918621c99b31846bcc8ea99d5b89b56a42`; undo only the planning commit with a new revert commit. Existing production rollback below remains valid.
- Public feedback is paraphrased; private screenshot and personal contact details are excluded.

---

# Build completion capsule: CHOKEPOINT 2040 v1.2

Build ID: CP2040-20261114-VISUAL-REVIEW
Status: DEPLOYED / PUBLIC ROOT VERIFIED
Date: 14 November 2026 (India)
Public URL: https://rjjainrahul97.github.io/chokepoint-2040/

## Scope and inspected state

[SRC] Reviewed Claude's visual-system-v1.2 at `1c262da544bb098a9b8b7d3523d32a0f98602a85` against main `31c7b77819ef97e74d36751c36b22f2ee0ce48ec`. Preserved Claude's visual and storytelling improvements; added only corrections and the user's subsequent turn-graph/debt-visibility requirements.

[SRC] Rollback created: `rollback/pre-v1.2-20261114`, commit `31c7b77819ef97e74d36751c36b22f2ee0ce48ec`. The original Claude branch remains preserved. No paid service, new runtime dependency, credential exposure or permission change.

## Changes and verification

- [SRC] Fixed forecast-cache contamination across different replays. History charts use recorded changes and the shared score formula rather than replaying the whole campaign.
- [SRC] Restored exact financial precision, corrected corporate supply denominators, removed unsupported coercion-immunity claims, fixed duplicate SVG marker IDs and removed duplicated CSS.
- [SRC] Added top-of-turn actual progress plus a dotted, conditional committed-project outlook. It uses the actual settlement engine on clones, assumes no new player policy, includes world actors and running bills, and stops at 2040.
- [SRC] Verified automatic deficit borrowing and interest servicing. Reports explicitly show tax revenue less interest, outstanding principal and next-period servicing at the current balance. Upfront project borrowing is not implemented; that existing affordability rule is unchanged.
- [SRC] 29/29 tests passed, including replay isolation, historical-score equality, project outlook, saves, debt, horizon and immutability checks.
- [SRC] 1,128 complete simulations, 31,584 transitions and 354,816 government ledger checks passed. Underlying campaign results match the prior simulation.
- [SRC] Two full mobile browser campaigns passed on the isolated candidate: normal reports and a differently played quick replay; graph lengths, mid-game reload, changed outcomes and PNG preview checked. No game-source console errors.
- [SRC] 390px and 320px layouts fit. The final 2040 report has 29 historical points and no dotted future beyond the horizon.
- [SRC] Actual UI borrowing witness: debt 2.66; taxes 3.99; interest 0.09; tax receipts net of servicing 3.90; new deficit borrowing 0.05.
- [SRC] About 63 KB locally estimated gzip payload, zero runtime libraries. Desktop Node render including three option previews and six-step outlook: median about 11 ms, p95 about 24 ms. Physical old-phone timings are unverified.

Review and evidence: `docs/V1_2_REVIEW.md`, `test-results/v1.2/`, `test-results/visual-performance.json`, `test-results/balance.json`.

## Limits, recovery and deployment

[GAP] Physical iOS/Safari, Android and old-phone performance remain untested. Human pacing/enjoyment remain open. Dotted paths are conditional scenarios, not probable outcomes. The AI-stack and sovereignty-ladder examples are labelled design-only and are not shown as campaign facts.

[SRC] Local headless Chromium still fails on process socket permissions; actual shared Chrome tested real Pages modules in a phone-sized frame. Candidate snapshots are retained under review-v12/; production root was unchanged during acceptance.

Rollback by restoring game files from `rollback/pre-v1.2-20261114` in a new main commit; preserve history and save keys. No server migration is required.

[SRC] Merged release: `e51996876711f2db0dbea9a3372c072b8d3ba037`. GitHub Pages run [43580227322](https://github.com/rjjainrahul97/chokepoint-2040/actions/runs/43580227322) completed SUCCESS.

[SRC] Opened the exact public root URL after deployment; it loaded `src/app.js?v=4.5` and the new graph. Completed all 28 China turns on seed 17 on the public root, including a successful reload after turn 14 (15 history points). This is the third full browser campaign in this review, after two candidate campaigns. No game-source console errors were observed. Captured the phone graph using the deployed root assets. The public root was left ready to review.

[SRC] Final asset readback and hashes are in `test-results/v1.2/public-assets.json`; public campaign actions are in `test-results/v1.2/live-campaign.json`. Documentation-only closure does not change the tested product modules.

---

## Archived v1.0 build record

# Build completion capsule: CHOKEPOINT 2040 v1.0

Build ID: **CP2040-20261113-REBUILD**
Status: **DEPLOYED / TECHNICAL ACCEPTANCE VERIFIED / HUMAN PLAYTEST OPEN**
Date: 13 November 2026 (India)
Public game: https://rjjainrahul97.github.io/chokepoint-2040/
Product commit: `38fde46c9153961c41a7ec1e009790c85c4337aa`
Product Pages run: https://github.com/rjjainrahul97/chokepoint-2040/actions/runs/43461783120 (SUCCESS)

## Goal and authority

Rebuild a mobile-first, 28-decision game about whether sovereign AI and accelerated science can reduce industrial dependence without destroying the foundations of prosperity. This is entertainment with educational value, not forecasting.

The user authorised source changes, testing and the existing public GitHub Pages deployment. No paid service, access change, credential publication or unrelated deletion occurred.

## Inspected reality and preserved assets

[SRC] Inspected main at `9ebb104499f0f58907d6080c72935e4c6ff087ae`, live game, source, tests, dependency configuration and prior build state. Existing 9/9 tests passed before changes. Public HTTP returned 200. Browser observed country selection and the first decision.

[SRC] Weaknesses confirmed in source: three common move types; scalar technology without commercialisation stages; largely hash-selected NPC policies; generic corporate influence; artificial capital cap. Country profiles, deterministic replay, static hosting and the ledger concept were useful foundations.

[SRC] Existing 12 profiles, MIT licence, favicon and `.nojekyll` were preserved. No runtime dependency was added.

## Final architecture and decisions

- Plain JavaScript, SVG/canvas, browser storage and Node's built-in test runner. No server, login, database, runtime AI or analytics.
- Twelve countries in one world, with common production, research, resource and budget calculations. Eleven foreign governments choose investments by utility on staggered cycles.
- Six supply/demand markets; seven fictional firms with persistent assets, interests, power, relationships and contracts.
- Discovery work → owned IP → process know-how → commercial production → value retained, with separate state and complementary capabilities.
- Cheap imports create immediate benefits, supplier concentration, switching friction and missing domestic capability. Reliable access remains useful; autonomy is not a universal goal.
- Finite power, water, food, logistics, skills and execution capacity. Infrastructure can reduce costs and resource stress across sectors.
- Nineteen policy actions, three per brief, delayed projects and resource/finance/access crises. Final turns avoid long new projects; unfinished assets receive no premature production credit.
- A compact cabinet screen, consequence report, exact capital ledger and optional system view. Quick play, saves, same-world replay, prior-run comparison, text sharing and previewable downloadable PNG cards (SVG fallback).
- Old v2 saves remain under their old key. v3 saves validate by deterministic action replay; no migration pretends that the two engines are equivalent.

[ASM] Country starts, budgets, utility functions, market coefficients and scientific thresholds are fictional design assumptions. Markets are an aggregate approximation, not bilateral general equilibrium. Corporate supply assets are pooled; full per-firm financial/resource accounts are out of scope.

Primary-source research and rejected complexity: `docs/DESIGN_RESEARCH.md`. General game engines, OpenTTD/Freeciv integration and SDEverywhere compilation were rejected because they add burden for this small browser game. No proprietary source or assets were copied.

## Acceptance and observed proof

| Acceptance criterion | Result and evidence |
|---|---|
| Meaningful sovereign AI and R&D | PASS. Distinct discovery, IP, engineering, production and capture. Compute accelerates discoveries with complements; operating costs and resource stress can make it underperform. Scenario tests and sweep. |
| Imports create long-term dependence | PASS. Immediate growth, persistent supplier concentration and switching costs, actual export-control exposure and licence fees. Scenario tests and public consequences. |
| Resource/infrastructure trade-offs | PASS. Power/water/food/skills constrain production and politics; infrastructure reduces unit costs. Controlled tests and varied starting conditions. |
| Governments and corporations change one world | PASS. NPC projects, export restrictions, price defence, corporate asset expansion, contract repricing and regulation alter supply, prices, relationships and budgets. |
| Visible domestic/global consequences | PASS. Public browser observed country/company reactions, project arrivals, risks and exact ledger; optional explanations fit narrow frames. |
| Different strategies produce different outcomes | PASS within tested scope. Ten primary ending types, several policy winners across countries/seeds; endings trace campaign state and history. |
| Full 28-turn automated campaigns | PASS. 20 scenario tests; broad sweep of 1,128 campaigns, 31,584 turns and 354,816 government ledger checks. |
| Actual browser campaigns | PASS. Four full UI campaigns, including identical-action replay and the final China seed-17 run. Mid-game and end-state reload, share text and PNG download checked. |
| Phone usability | PASS for Chrome viewport scope. 390×844 frame; no overflow on all 28 final campaign turns. Expanded detail at 320px and tablet at 768px also fit. Large choice targets. Physical devices remain untested. |
| Existing public Pages deployment | PASS. Product and fixture Actions runs succeeded; five public asset bodies matched tested files byte-for-byte. Root URL opened in Chrome with final module `app.js?v=3.2`. |
| Durable state and rollback | PASS. Source, research, test evidence, screenshots and this capsule committed in the existing repository. Rollback branch preserved. |
| Human enjoyment and 5-7 minute pacing | OPEN. Design target; cannot be inferred from automated playthroughs. No human playtest conducted. |

Detailed evidence: `docs/VERIFICATION.md`, `test-results/balance.json`, `test-results/campaigns.csv`, `test-results/browser.json`, `test-results/browser-china.json`, `test-results/public-assets.json` and `test-results/proof/`.

## Last repairs and fresh results

[SRC] Browser evidence exposed apparent ledger mismatch from one-decimal display, unsupported arrow glyphs, seed input not always applied before start, and an immediate download that was difficult to observe. Fixed exact financial precision and glyphs; start now reads and validates the field and updates the campaign URL; outcome cards now preview as PNG with an explicit download link.

[SRC] Final UI completed China seed 17 through 2040. Reload at turn 14 resumed 2034 H1, decision 15/28. New seed retained. All 28 phone layouts stayed within the viewport. Public PNG download rendered 800×1000 and produced a valid 100,435-byte file. Displayed ledger reconciled: `14 - 7.03 - 1.91 + 4.68 = 9.74`.

[SRC] Identical India replay produced identical results. Text sharing copied the correct outcome and challenge link. No game-source console errors were observed. Browser-extension metadata errors were separated from application errors.

## Known limitations and debt

[INF] Adaptive and infrastructure policies often perform well. Science, industry and network policies win other tested worlds, but finite sweeps cannot prove the absence of a dominant exploit. Further balance changes should rerun the harness rather than rely on a few anecdotes.

[GAP] Human fun, first-time comprehension and 5-7 minute pacing are unmeasured. Safari/iOS and Android browser behaviour are not physically tested. Formal LCP was unavailable through the read-only browser surface; approximately 80 KB of product source, no external runtime assets and responsive observed interactions are narrower evidence.

[RISK] Governments are incentive archetypes, not realistic geopolitical forecasting agents. Defence, exchange rates, elections, detailed land use, population demographics and full climate physics are excluded. Corporate finance and market clearing remain aggregate approximations.

## Failed tooling and resolved build defects

- [SRC] Local headless Chromium launch: `socket() failed: Operation not permitted`. Used actual shared Chrome and real public mobile browsing contexts; no sandbox weakening.
- [SRC] Native Git push dry-run: shell has no GitHub credential. Published atomically through the authorised GitHub connector; no token was exposed or persisted.
- [SRC] Browser automation originally attempted a long replay/download batch and timed out. Re-inspected state, split bounded operations, and captured the final explicit PNG download successfully.
- [SRC] Browser summary role matching and Control+Home automation were unsupported in this interface. Used observed summary selectors for disclosures; these were tooling failures, not game errors.
- [SRC] Formal browser Performance API read was unsupported. No fabricated speed benchmark is reported.

## Recovery and handoff

Rollback reference: **`rollback/pre-v1-20261113`**, commit **`9ebb104499f0f58907d6080c72935e4c6ff087ae`**.

Restore its tracked game files in a new commit on main to trigger the existing Pages rollback. Do not force-push or delete history. Preserve old and new save keys for forward recovery. No server-side migration is needed.

There is no blocking user action for the deployed technical build. Next useful validation is a small human playtest focused on decision comprehension, duration, replay desire and whether resource feedback feels fair. That validation remains open rather than being labelled completed.
