# Verification record

Date: 13 November 2026. Product code: `38fde46c9153961c41a7ec1e009790c85c4337aa`.

## Automated simulation

Run `npm test` for 20 scenario and invariant tests. Run `node tools/balance.mjs` for the broader sweep.

The sweep completed 1,128 campaigns, 31,584 half-year transitions and 354,816 government ledger checks. The base matrix is 12 countries × 8 seeds × 11 policies. Another 72 campaigns vary energy, water, food and institutions to 75% or 120% of starting values.

Ten primary ending types appeared: balancing, diversification, research without commercialisation, corporate capture, profitable interdependence, fragile prosperity, industrial leadership, backlash, failed substitution and fiscal exhaustion. Every country has a tested viable route. Adaptive and infrastructure policies frequently win, with network, industry and science wins in other worlds. These finite observations do not prove global balance or exclude exploits.

Inspect `test-results/balance.json` for counts and `test-results/campaigns.csv` for every baseline campaign.

## Actual public browser tests

Public URL: https://rjjainrahul97.github.io/chokepoint-2040/

Mobile fixture: https://rjjainrahul97.github.io/chokepoint-2040/tools/browser-check.html

The fixture embeds the actual public game and its modules in a 390 × 844 CSS viewport. It is a real browsing context, not a screenshot mock or injected copy of the app. Classic scrollbars reserve 15px, making content width 375px. Narrower 320px and tablet 768px frames were also tested.

Four full campaigns passed automated UI interactions: India seed 2040 with normal consequence briefings, an exact-action quick-play replay, Saudi Arabia seed 2040, and China seed 17 using the final product code. The China action sequence and per-turn geometry are in `test-results/browser-china.json`.

Checks passed:

1. All 28 choices lead to an actual 2040 outcome in both normal and quick play.
2. An identical India action sequence reproduces the same headline metrics. The previous-run comparison renders correctly.
3. The final seed control retains China seed 17 on start and reload. A mid-campaign reload resumes at 2034 H1, decision 15/28, without duplicate processing.
4. End-state reload restores the outcome.
5. The text-share action copies the outcome and a matching country/seed challenge URL.
6. The outcome-card preview renders at 800 × 1000. The explicit PNG link produces a captured download with valid PNG signature, 100,435 bytes.
7. No horizontal overflow across all 28 China turns at phone width. Expanded causes at 320px and expanded system details at 390px remain within the viewport. Tablet layout also fits.
8. Measured decision targets are 116-134px high; main buttons are 50px. Keyboard focus styles and reduced-motion CSS are present.
9. The displayed financial statement reconciles: `14 - 7.03 - 1.91 + 4.68 = 9.74`. It now uses exact financial precision rather than misleading rounded columns.
10. No application-source console errors were observed. Browser-extension metadata errors were identified separately and did not come from game code.

Screenshots and an actual downloaded card are in `test-results/proof/`. `test-results/browser.json` records checks and repaired defects.

## Deployment

GitHub Pages used the existing main/root configuration. Product deployment run [43461783120](https://github.com/rjjainrahul97/chokepoint-2040/actions/runs/43461783120) completed successfully for `38fde46c9153961c41a7ec1e009790c85c4337aa`. The mobile acceptance fixture update also deployed successfully, run [43462169933](https://github.com/rjjainrahul97/chokepoint-2040/actions/runs/43462169933).

Fresh public HTTP requests returned 200 for index, app, engine, countries and CSS. All five asset bodies matched the locally tested files byte-for-byte. Hashes and byte counts are in `test-results/public-assets.json`. The complete product payload is approximately 80 KB before compression, with no external fonts, analytics, runtime APIs or packages.

The root public URL was also opened directly in Chrome after all product changes. It loaded `src/app.js?v=3.2` and resumed the saved India campaign.

## Remaining validation

- No physical Safari/iOS or Android browser run. Chrome viewport testing is not a substitute for cross-browser device coverage.
- No user study of enjoyment, first-time comprehension or the 5-7 minute target. Automated rapid clicking cannot establish human pacing.
- No formal LCP benchmark: the available read-only browser interface did not expose Performance APIs.
- The model deliberately aggregates markets, corporate finance, land demand, population and institutions. It is an original fictional game model, not an empirical country simulation.
