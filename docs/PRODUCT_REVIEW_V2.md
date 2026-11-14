# CHOKEPOINT 2035: product, design and player review

14 November 2026. This is an internal heuristic review and actual engineering/playthrough record, not an external user study. Baseline: b7aeb9328522b0e78c07a4ad9893462b37af4172. Supplied original portrait assets inspected; all 38 are 512px transparent PNGs, about 397KB combined. Individual files are around 8-12KB, so the release uses these small originals directly rather than adding a conversion pipeline.

| Lens | Finding | Revision |
|---|---|---|
| Product manager | The goal was explained, but 28 turns, dense reports and a future-only roadmap delayed the payoff. | 18 half-years to 2035, concise consequence reports, optional ledger/world/causal detail, normal and quick play, preserved 2040 legacy route. |
| Game designer | Repeated deck cards and concessions without enforceable limits weakened planning. | Urgency-ranked, state-driven encounters with seen-card exclusion; actual Atlas tender gates, a buyout, foreign licensed production and more expensive training terms. |
| New player | A portrait was requested, but none appeared; abstract warnings lacked dates or rescue choices. | Active actor portrait/name/agenda, concrete loan terms, visible conditional crisis deadlines, prioritised rescue briefs, a short credit-crisis scenario. |
| Returning player | Similar choices had too little persistent memory. | Contract rights/fees, price defence, retained institutions across mandate changes, saved speaker identity, same-world replay, selectable indicator tracks with dotted continuations. |
| Challenger | Passive survival and borrowing lacked a failure boundary. | Credit, approval and essential-food persistence counters can end a campaign. One-time restructuring has explicit prosperity, approval and relationship costs. |

## Shipped rule choices

- Preserve the existing six-market economic settlement and autonomous government/company investment rules. A separate validated encounter layer resolves new policies through that same settlement; no duplicate forecasting model or server.
- New campaigns use schema 4 and a separate storage key. The unchanged 2040 game and its schema-3 key remain at `legacy-2040/`. Old campaign hash tests still exercise the original resolver.
- Encounters rank actual bottlenecks, with seed-keyed tie-breaking. Twenty cabinet families, special partnerships/restrictions/concessions, rescue briefs and deferred mandate reviews avoid repeating an exact brief in an 18-turn run. Late options are filtered by remaining construction time rather than all using the same three answers.
- A production partner must actually have laboratory and process capability. The licensed patent remains abroad. The cheaper deal adds less process training than the expensive counteroffer. Both queue actual capacity and charge six subsequent half-years of royalties. China can defend its processing advantage through actual material price reductions. This is an incentive-based capability check, not a claim about real diplomacy.
- Atlas exclusivity blocks independent factories, co-investment and production partnerships in the resolver and UI. A four-unit buyout can be accessed from Treasury after the initial negotiation. It preserves already built assets. Supporting infrastructure remains possible.
- Credit crisis: debt above eight current half-years of tax receipts for two successive settlements. Social collapse: approval below 22 for two. Essential-food breakdown: food stress above 35 for three. Warnings show remaining windows and conditional dates. Crisis briefs take precedence over leadership reviews. Restructuring retires 20% of principal once, at living standards -3, approval -5 and foreign trust -12.
- Household/industrial mandate reviews can change the player representative. Corporate succession can occur after persistent market power rises. Existing debt, contracts and assets persist, and historical reports keep the prior speaker. These are fictional review windows, not real election forecasts.
- All four indicator tracks and overall progress can be selected. The solid history is actual; the dotted continuation uses the resolver with no new discretionary choices and stops at terminal failure or 2035.

## Tests and release procedure

1. Preserve a rollback branch before source changes.
2. Run legacy regression tests plus 2035 tests for deterministic replay, history, contracts, partnership fees/ownership, crisis rescue/failure and mandate continuity.
3. Sweep all 12 countries, 24 seeds and 11 policies (3,168 campaigns); check every actor's ledger, unique briefs, viable tested routes for every country/seed and multiple strategy winners. Store per-country CSVs and summary. This does not prove perfect balance or absence of all exploits.
4. Play a complete candidate at phone width, check portraits, a production partnership, leadership change, reload and share rendering.
5. Deploy the root, then play a fresh full campaign, exercise the credit-crisis failure and rescue, inspect 320/390px layout, indicator switching, save/reload and the legacy route. Read back runtime asset hashes.
6. Update BUILD_STATE with observed results, not intended results.

## Honest limits and next revisions

- No external human enjoyment/pacing study or physical Safari/Android/old-phone measurement yet. Automated speed is not proof of a 5-7-minute enjoyable run.
- Debt remains an interest-only credit line; fixed maturity, multiple lender covenants and refinancing schedules are not implemented.
- Negotiation is a small set of predefined capability-dependent packages. There is no general proactive diplomatic inbox, arbitrary counteroffer builder or bilateral trade inventory conservation.
- Atlas restrictions are enforceable; other licences preserve foreign IP and fees, but not every proposed data-residency, legal-breach or technology-substitution rule from the larger plan is implemented.
- Representative changes preserve commitments, but personal disposition and full political coalitions are not separately simulated. The resulting policy choice has real effects; a portrait change itself grants no unexplained bonus.
- All economic parameters and national presets remain fictional. Original scenario hypotheses must be assessed through the state, not forced by country-specific scripts.
