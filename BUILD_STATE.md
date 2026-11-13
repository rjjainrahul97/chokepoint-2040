# Build checkpoint - CHOKEPOINT 2040

Build ID: CP-2040-20261113
Status: PARTIAL (GitHub source and Pages deployment verified; live hosted user path not independently observed)

## Goal
Free, phone-first strategy game at a publicly accessible GitHub Pages URL, playable in approximately 5-7 minutes.

## Working build
- 12 selectable countries with differentiated starting characteristics and score weights.
- 28 half-year turns from 2027 H1 to 2040 H2.
- One of three fast moves per turn; delayed projects and compounding constraints.
- Fictional non-playable corporate and institutional actors that create events and can respond to moves.
- Industrial factors: resources, refining, technology, manufacturing, logistics, energy, water, food, governance and connectivity.
- Multiple outcome archetypes with numerical score and detailed end report.
- Same-world replay via seeded scenario and share link, saved browser session, no account, AI API, analytics or paid dependencies.

## Verification evidence
- npm test on 2026-11-13: 5/5 PASS, including 36 full 28-turn policy runs (12 countries x 3 strategies), seed reproducibility, choices affordability, invalid action rejection and outcome diversity.
- node --check src/app.js and src/engine.js: PASS.
- Local HTTP server: 200 OK for index.html.
- Browser captures observed: /mnt/data/chokepoint-home.png, /mnt/data/chokepoint-play.png, /mnt/data/chokepoint-end.png. Home, game and end screens visually inspected at mobile size.
- Not verified: public GitHub Pages delivery; needs live check after commit and Pages configuration.

## Tool and authorisation state
- GitHub connector successfully authenticated as rjjainrahul97 on 2026-11-13.
- GitHub repository rjjainrahul97/chokepoint-2040: observed public, writable and on main (2026-11-13).
- Available connected GitHub integration can edit existing repository files but lacks create-repository and Pages configuration methods.
- Public publishing was explicitly requested by the user. Must publish only game artefacts and no private files.

## Exact blocker and action
1. Commit tested static assets to public repository main branch, preserving existing MIT licence.
2. Confirm GitHub remote source matches the intended static build.
3. Enable GitHub Pages from repository Settings > Pages > Deploy from branch > `main` > `/(root)` and save if not already enabled.
4. Verify actual public URL, game start, one turn and 2040 end-to-end before marking COMPLETE.

## Recovery and risks
- Local artefact: chokepoint-2040.zip.
- No existing repositories or files were modified.
- Git version control should provide rollback once published.
- Simplified and fictional strategic model. Scores are game assumptions, not forecasts; corporate names are fictional composites.
- Current code has no external runtime dependencies.

## V0.2 usability and state update (13 November 2026)
- Goal: clarify two calendar quarters per turn, cash deductions/replenishment, and how prosperity, value capture, resilience and public mandate influence play. Make country and company responses visible with positive/neutral/negative cues.
- [SRC] Local JS syntax checks and 9 engine test cases PASS, including 12 countries x 3 policies through 2040, capital conservation for all 28 turns, different global market pressures by player choices, bot country reactions, and market state sanity across multiple seeds.
- [SRC] Headless Chromium (system executable) completed a mobile 390x844 flow using in-memory HTML/CSS/ES module injection: country selection, India first decision, after-action card, cash ledger, all 28 choices, end state; 0 JavaScript page errors. Direct local HTTP navigation from the test browser was blocked by runtime policy; inline injection served as narrow runtime smoke test.
- Design: version 2 simulation state includes persistent shared global pressure, non-playable governments and delayed foreign capacity investments. Each turn shows compact national and global outcome headline, sign/icon/colour impact cues, reconciled capital equation and expandable causal details.
- [RISK] Generated non-playable country policies are deterministic illustrative game rules, not predictions. Source v1 save files are retained under their original storage key but not loaded by v2; users start fresh with richer simulation state.
- [SRC] Source committed to main as cdea3c5621838b5fc9516aa799f535eadcd9de8e. Remote index.html and src/engine.js fetched and verified after commit. GitHub Pages run 43431512638 completed SUCCESS.
- [GAP] Hosted public HTTP path could not be fetched independently because available runtimes block or cannot resolve the GitHub Pages address. Final user-browser smoke test is outstanding.
- Rollback: previous verified GitHub commit before V0.2; revert V0.2 via GitHub history if regression.

### V0.2 deployment evidence
- [SRC] GitHub source commit cdea3c5621838b5fc9516aa799f535eadcd9de8e: eight files updated; .nojekyll, MIT licence and favicon preserved.
- [SRC] Pages Actions deployment https://github.com/rjjainrahul97/chokepoint-2040/actions/runs/43431512638 completed SUCCESS. Source branch: main, path: /.
- [SRC] Test output: 9/9 PASS, 28-turn synthetic playthrough on mobile headless Chromium, no JS page errors.
- [GAP] External request to https://rjjainrahul97.github.io/chokepoint-2040/ was blocked by the available web and local execution runtimes. User must confirm opening and advancing a turn at this URL.
- Rollback to previous source commit d222c25fd781b7041fce406c8bf13347af3efd91 if needed. Note: v2 saves are separate from legacy v1 saves.
