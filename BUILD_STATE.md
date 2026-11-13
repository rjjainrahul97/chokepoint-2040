# Build state: CHOKEPOINT 2040 v1.0

Build ID: CP2040-20261113-REBUILD
Status: IMPLEMENTED / AUTOMATED VERIFICATION PASSED / PUBLIC BROWSER VERIFICATION IN PROGRESS
Date: 13 November 2026 (India)
Authority: user authorised source changes, free tools and the existing public Pages deployment. No paid services, access changes, credential publication or unrelated deletion.

## Inspection and checkpoint

[SRC] Inspected main at `9ebb104499f0f58907d6080c72935e4c6ff087ae`, source, tests, package configuration, prior BUILD_STATE and live public game. Existing nine tests passed before changes. Public HTTP returned 200. Browser observed country selection and India first decision.

[SRC] Verified weaknesses in code: three common action types; scalar technology rather than discovery/commercialisation; largely hash-selected NPC actions; generic corporate influence; artificially capped capital. Existing replay, country profiles, static hosting and ledger concepts were preserved.

[SRC] Rollback branch created on GitHub: `rollback/pre-v1-20261113` at `9ebb104499f0f58907d6080c72935e4c6ff087ae`. MIT licence, favicon and `.nojekyll` preserved. Git history retains all prior files.

## Build decisions

- Pure browser JavaScript and SVG, no build dependency, server, login or paid API.
- Shared state for 12 countries, six markets and seven fictional corporate groups.
- Separate discovery, IP ownership, know-how, production and value retained.
- Persistent contracts, recurring fees, supplier concentration, switching friction and alternative sourcing.
- Finite power/water/food/skills and institutional limits; infrastructure reduces operating bottlenecks and costs.
- Nineteen policy actions, three per brief; state-dependent crises; horizon-aware final turns.
- Compact cabinet and consequence screens; deeper model details are optional.
- Old v2 saves preserved separately; v3 validation uses action replay.
- Rejected general-purpose game engines and scientific-model compilers. Research and sources: `docs/DESIGN_RESEARCH.md`.

## Verification so far

[SRC] `npm test`: 20/20 passed, including 132 complete 28-turn country/policy campaigns, immutability and replay, capital settlement for all governments, projects, AI/resource stress, discovery acceleration, production complements, import vulnerability, infrastructure cost effects, food/water interactions, contract costs, corporate regulation, China response and sensible final turns.

[SRC] `node tools/balance.mjs`: 1,128 complete campaigns, 31,584 turns, 354,816 government ledger checks. Twelve countries, eight seeds, eleven policies, plus 72 varied starting-condition campaigns. Ten primary ending types observed. Every country has a tested score route >=50. Several strategies win or tie across worlds; no single tested strategy wins every country. Full summary and inspectable campaigns are in `test-results/`.

[INF] Adaptive and infrastructure policies are often strong. This reflects complementarity but remains a balance risk; the finite sweep is not proof of perfect balance. Research, industry and network strategies also win in observed worlds.

[GAP] Current release public browser playthrough, 390px layout checks, save/reload, sharing and screenshots are still pending. Do not treat this checkpoint as a completed deployment acceptance.

## Known limits and failed tools

[ASM] Country starts, market parameters, policy utilities and scientific thresholds are fictional game design assumptions, not empirical estimates. Six bounded markets approximate supply access; no full bilateral economic clearing.

[GAP] Human fun, first-time comprehension and 5-7 minute duration have not been measured with users. Automated clicks cannot prove those qualities.

[SRC] Local headless Chromium launch failed with `socket() failed: Operation not permitted`. Native Git push dry-run failed because shell Git has no GitHub credential. The connected GitHub API is writable and is the publication route. Public browser testing uses the available shared Chrome interface. No credential or sandbox weakening was attempted.

## Recovery

Restore game files from rollback branch in a new main commit. Pages remains on the existing main/root setup. Keep old and new save keys; neither requires a server-side migration.

## Next action

Publish the tested source through the GitHub connector, verify Pages assets against source, play complete public campaigns at mobile width, repair any failures, and replace this pending evidence with the observed release and deployment proof.
