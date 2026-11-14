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
- Repaired candidate: 26/26 tests passed, including new replay-cache, historical-score, corporate-capacity and SVG/diagnostic regressions.
- Desktop Node benchmark: 100 cold-state renders at turn 24, three option simulations plus standing and map. Detailed timings and locally estimated raw/gzip payload: `test-results/visual-performance.json`. These are not old-phone measurements.
- Pure state transitions, balancing and saves retain the existing rules. The engine changes only expose supply and share a pure scoring formula.
- Full sweep and actual public browser acceptance are recorded below when observed.

## Delivery route and limits

The current public game remains unchanged during candidate QA. A snapshot under `review-v12/` uses the same source modules in an isolated path on the existing GitHub Pages host, with no additional hosting service. After browser acceptance, merge the reviewed source into main and verify the root public game.

Local headless Chromium remains blocked by a process socket permission error. Use actual shared Chrome with the real phone-viewport fixture. Physical old-phone, Safari and Android timing remain unverified.
