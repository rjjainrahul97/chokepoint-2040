# Design research and scope

Research date: 13 November 2026. This document separates observed mechanics from this game's design assumptions. No proprietary code, artwork, text passages or data files were copied.

| Reference | Verified source mechanics | Adapted into CHOKEPOINT | Rejected for a 28-decision game |
|---|---|---|---|
| Victoria 3 | Developer diary describes production methods with input/output and workforce requirements; an upgrade can create new input dependencies. Official changelog documents trade capacity and research queues. | Complementary inputs; engineering and utilities gate production; improved technology is not a universal upgrade. | Pops, individual buildings, diplomatic warfare, detailed employment and hundreds of goods. |
| Democracy 4 | Official mod documentation describes connected simulation objects, equation-based effects and inertia over several turns. | Delayed projects, resource feedback, public support and state-dependent consequences. | Full electorate segmentation, policy sliders and a large neural-effect network. Our engine is ordinary arithmetic, not machine learning. |
| Suzerain | Developer site and press kit describe cabinet agendas, welfare/economy/diplomacy conflicts and branching political outcomes. | A cabinet dilemma, competing interests, short consequential choices and multiple legacies. | A large dialogue tree, character simulation and a million-word narrative. No claim is made about its undisclosed economic equations. |
| Offworld Trading Company | Official gameplay documentation describes input extraction/refining, player-driven supply/demand prices, patents, corporate rivalry and viable imported inputs. | Six shared markets, input costs, corporate expansion, price defence and importing as a legitimate option. | Real-time trading, stock buyouts, sabotage and per-building resource inventories. |
| Terra Invicta | Publisher-hosted wiki distinguishes global scientific research from faction engineering projects; science unlocks possibilities rather than directly creating every asset. | Discovery, ownership, pilot engineering and production are different stages; NPC governments pursue their own needs. | Space combat, a vast technology tree and council-agent management. Our NPC utility rules are our own, not a reproduction of its AI. |
| Fate of the World | Original developer/publisher Steam listing describes balancing finite resources and climate against food, power and population needs. The successor publisher's development blog describes policy cards and economic/environmental/industrial/technological/political indicators. | Constrained policy choices, household pressure and environmental feedback. | A full climate model. The successor dev blog is not proof of the original game's exact algorithms. No authoritative open-source release of the original engine was verified. |
| En-ROADS | Technical reference explains aggregated energy/economic/land/climate systems, delays, feedback and unintended consequences. User guide explains slow capital turnover. | Explicit construction lead times, operating loads, complementary investments and limited aggregation. | Calibrated climate projections, scientific parameter claims and long-horizon physical climate modelling. |

## Primary documentation

- [Victoria 3 developer production-method diary, publisher's Steam announcement](https://store.steampowered.com/news/posts/?enddate=1624550727&feed=steam_community_announcements)
- [Victoria 3 official 1.2 changelog](https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-78-update-1-2-changelog)
- [Democracy 4 official modding and effect inertia](https://www.positech.co.uk/democracy4/modding.html)
- [Democracy 4 simulation objects](https://www.positech.co.uk/democracy4/mod_simulation.html)
- [Suzerain developer site](https://www.suzeraingame.com/) and [Torpor press kit](https://www.torporgames.com/presskit)
- [Offworld official gameplay guide](https://wiki.offworldgame.com/index.php?title=Gameplay) and [buildings/patents](https://wiki.offworldgame.com/index.php/Buildings)
- [Terra Invicta publisher-hosted technology documentation](https://wiki.hoodedhorse.com/Terra_Invicta/Technology)
- [Fate of the World developer/publisher listing](https://store.steampowered.com/app/80200/Fate_of_the_World/)
- [Soothsayer successor development blog](https://www.soothsayergames.com/dev-blog/)
- [En-ROADS technical reference](https://docs.climateinteractive.org/projects/en-roads-reference-guide/en/latest/)
- [En-ROADS dynamics guide](https://docs.climateinteractive.org/projects/en-roads/en/latest/guide/background.html)

## Open implementations considered

- [OpenTTD](https://github.com/OpenTTD/OpenTTD), GPL-2.0: inspected its public `src/economy.cpp`. A mature transport economy, but its C++ engine, map, vehicles and maintenance model are much larger than this browser game requires. Design reference only; no source reuse.
- [Freeciv](https://github.com/freeciv/freeciv), GPL-2.0: verified upstream project and licensing. Its empire/server/client structure would add rather than remove work. No claim of inspecting its entire AI implementation.
- [SDEverywhere](https://github.com/climateinteractive/SDEverywhere), MIT: documented Vensim/Stella model compilation to C/JS/WebAssembly and model-check infrastructure. Useful for equation-heavy scientific models. Unnecessary compiler/build tooling for a small turn-based simulation with explicit projects and contracts.

Decision: retain plain JavaScript, browser SVG, browser storage and Node's built-in test runner. Zero runtime packages. Do not import a general game engine just to obtain arithmetic, buttons and a project queue.

## Model assumptions, not verified real-world facts

[ASM] Every country capability, national weight, supplier share, action cost, behavioural rule and threshold is fictional. Country differentiation uses different starting infrastructure, skills, resources, institutional capacity, budgets, scale and objective weights. It is not a ranking of real countries.

[ASM] Six bounded price/fill markets approximate global supply pressure. This is not bilateral general equilibrium, and financial flows are not globally conserved between every buyer and seller. Local water and grid capacity remain local bottlenecks even when global energy supply is abundant.

[ASM] NPCs rank investment needs using utility; seeded tie-breaking varies scenarios. China can defend a threatened processing market with a subsidised price cut or restrict highly concentrated buyers. The US can restrict advanced equipment in response to rival capacity. These are gameplay incentive rules, not political forecasts.

[ASM] Companies own persistent supply assets and contracts, and their profits and power influence expansion, repricing and lobbying. Rejected concessions, regulated access and public alternatives can limit them. There is no private firm balance-sheet or shareholder simulation.

[ASM] Research uncertainty is a seed-keyed scientific work threshold for each discovery. Given the same world and actions it is fully repeatable. Resource and engineering constraints determine whether the opportunity becomes valuable. No random per-click success roll decides whether an investment is good.
