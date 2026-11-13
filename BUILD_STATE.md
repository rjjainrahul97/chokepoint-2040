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
