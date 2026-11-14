# v1.2 visual-system review

Date: 14 November 2026. Requested: inspect Claude's `visual-system-v1.2` branch, repair only justified issues, test, and publish to the existing Pages site.

## Inspected revisions

- Live main: `31c7b77819ef97e74d36751c36b22f2ee0ce48ec` (v1.1 storytelling interface).
- Claude branch: `1c262da544bb098a9b8b7d3523d32a0f98602a85`.
- Rollback: `rollback/pre-v1.2-20261114`, preserving the live main commit.

## Findings and scoped repairs

1. Confirmed a preview cache collision. AI-first and partnership-first replays at the same turn returned identical cached forecasts even though the engine produced different changes. Cache now uses immutable state identity (WeakMap).
2. The score-history chart replayed the campaign to rebuild scores. It now uses recorded metric deltas and the capital ledger, sharing the exact scoring formula with the engine. No simulation run is needed to draw history. Regression tests compare every historical point with actual engine scores, including repayments and borrowing.
3. The v1.1 budget display rounded to one decimal, creating apparent accounting discrepancies. Financial amounts again use exact two-decimal precision.
4. The visual CSS section was duplicated. Removed the duplicate. No runtime package, font, image service or API was introduced.
5. The capacity chart excluded corporate assets from its world denominator and claimed its scale classification deterred coercion. It now includes corporate capacity and explicitly describes a scale marker, without pretending the engine grants immunity.
6. Multiple warning diagrams reused SVG marker IDs. IDs now include the loop identity.
7. Warning diagrams and standing detail could push the three decisions far down a phone screen. Diagnostics now expand on demand, while the score strip and concise warnings remain visible.
8. Project gain chips now say “up to”, since skills, capability ceilings and later conditions can reduce delivered gains.
9. Australia relationship flavour text no longer promises greater compact effectiveness that the engine does not implement.

AI-stack and sovereignty-ladder sample data are confined to the explicitly labelled design reference page. They are not rendered as real campaign state in the playable game.

## Verification before browser acceptance

- Original branch: 22/22 tests passed. The existing suite did not detect replay cache collisions.
- Repaired candidate: 29/29 tests passed, including new replay-cache, historical-score, corporate-capacity and SVG/diagnostic regressions.
- Desktop Node benchmark: 100 cold-state renders at turn 24, three option simulations plus standing and map. Detailed timings and locally estimated raw/gzip payload: `test-results/visual-performance.json`. These are not old-phone measurements.
- Pure state transitions, balancing and saves retain the existing rules. The engine changes only expose supply and share a pure scoring formula.
- Full sweep: 1,128 campaigns, 31,584 turns and 354,816 ledger checks passed; campaign CSV matches the pre-review simulation.

## Delivery route and limits

The current public game remains unchanged during candidate QA. A snapshot under `review-v12/` uses the same source modules in an isolated path on the existing GitHub Pages host, with no additional hosting service. After browser acceptance, merge the reviewed source into main and verify the root public game.

Local headless Chromium remains blocked by a process socket permission error. Use actual shared Chrome with the real phone-viewport fixture. Physical old-phone, Safari and Android timing remain unverified.


## Added turn graph and debt verification

Requested during review: a top-of-turn actual history plus dotted expected continuation, and confirmation that debt servicing reduces tax-funded resources.

- Added a solid progress-score history and a dotted six-half-year conditional outlook at the top of cabinet and consequence screens. Project completion is marked. The projection assumes no new discretionary policy, while committed projects, operating bills, scientific work, seeded world events, governments and corporations continue. It is not a guarantee or a forecast of the player's future choices.
- The outlook uses the same settlement functions as the real engine, operates only on cloned states, never enters saves, and stops at 2040. Tests verify deterministic output, input immutability, delayed completion, unavailable real “hold” action and end-horizon clipping.
- Debt is already enabled as automatic borrowing when mandatory costs exceed cash plus income. Existing project-affordability rules remain unchanged: there is no upfront project-loan button. Interest is 3.5% per half-year on existing principal, included in running costs before calculating closing budget; new deficit borrowing increases principal for later servicing.
- Consequences now show debt outstanding, interest paid, current tax revenue less servicing, and the next period's interest at the current balance. Borrowing is explicitly distinguished from tax income.
- Reduced mobile HUD height and hid repeated flavour quotations on narrow choice cards so the new graph does not bury the decision unnecessarily. Full citizen stories remain in consequences.

## Browser acceptance of the final candidate

Actual public preview, real 390×844 frame, no injected source or direct engine calls:

1. India, seed 2040, AI-first: 28 decisions with normal reports; every actual graph had the expected number of history points; 29 points at 2040, no projected continuation beyond the horizon.
2. Same-world India replay with an infrastructure policy: 28 decisions in quick mode; reload at turn 14 restored decision 15/28 and 15 actual history points; ending changed from “A nation still negotiating” to “Profitable interdependence”.
3. The AI-first campaign produced actual borrowing. Final report: outstanding debt 2.66; tax receipts 3.99; servicing 0.09; net taxes before other bills 3.90; new deficit borrowing 0.05. The model-level test independently confirms increased principal causes later interest costs.
4. No horizontal overflow at 390px, including expanded standing and warning diagnostics; 320px also fits. PNG outcome preview renders 800×1000. No game-source console errors observed.

Evidence: `test-results/v1.2/`, `test-results/visual-performance.json`, `test-results/balance.json`.

With the requested conditional outlook, the locally estimated complete gzip payload is about 63 KB, versus about 38 KB for live v1.1. No runtime library or remote asset added. Desktop Node render benchmark including three previews and the six-period outlook: median about 11 ms, p95 about 24 ms. These are not physical-phone or network timings.

Deployment and final root-site readback are recorded in BUILD_STATE.md. The preview snapshot remains isolated under review-v12/ as a reproducible acceptance fixture.
