# CHOKEPOINT 2040

A free, mobile-first strategy game about industrial dependencies, mega-companies and international bargaining power. It is intentionally **fictional** and designed for fun, not to forecast actual GDP, security outcomes or corporate decisions.

## Play

Pick from 12 countries. Each turn represents six months between 2027 H1 and 2040 H2 (28 turns). A global event occurs and a non-playable corporate or institutional actor can react. Choose between building domestic capacity, negotiating access or buying time with emergency relief. Some projects take multiple turns, and water, food, logistics, energy and governance constrain industrial performance.

Every run has a numeric seed. Share links using `?country=india&seed=123456` to replay the same event order. Games automatically save to the current browser's local storage.

## Run locally

No build tools, AI API, login, server or paid dependencies required.

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Or open with any static-web-server extension. Browser ES modules must be served over HTTP(S), not `file://`.

## Tests

Requires Node.js 20+ for the `node:test` runner.

```sh
npm test
```

Runs all 12 countries through 28 turns, checks seeded determinism, gameplay completeness, affordability, non-identical outcomes and invalid moves.

## GitHub Pages

1. Create an empty **public** repository named `chokepoint-2040` in your GitHub account.
2. Upload the entire project contents so `index.html` is at the repository root.
3. In repository **Settings → Pages**, set **Build and deployment → Deploy from a branch**, choose `main` and `/ (root)`.
4. GitHub should publish at `https://YOUR_USERNAME.github.io/chokepoint-2040/`. Confirm the deployed URL directly, since deployment may be asynchronous.

No GitHub Actions workflow is necessary.

## Architecture

- `src/engine.js`: all game rules, countries, event deck, economic constraints, corporate responses and scoring.
- `src/app.js`: front end, country selection, campaign navigation, saving and sharing.
- `src/style.css`: responsive mobile-first interface.
- `tests/engine.test.mjs`: deterministic simulation checks.
- `BUILD_STATE.md`: assumptions, checks, risks and handoff.

## Simulation design assumptions

- Country capability scores start as **illustrative game values** rather than verified macroeconomic measurements.
- Corporate actors are **fictional composites**, not representations of actual businesses.
- A low-capacity country can still win by combining partnerships, industrial investments and buffers.
- High-score outcomes are not guaranteed to match a named ending: endings emphasise dominant trade-off traps.
- The simulation excludes currency, electoral politics and monetary policy as explicit levers to keep turns quick; their effects appear indirectly through events.

## Licence

MIT. This is a small educational toy.


## Version 0.2: explain what actually happened

- One player choice per **half-year** (two calendar quarters); 28 turns from 2027 H1 to 2040 H2.
- The next turn shows a compact **After action** report, naming the player's global ripple, an independent country move, domestic score changes, and a reconciled capital equation. Expand it for corporate responses and delayed project completions.
- Each non-playable government has its own capability starting point, country-specific investment priorities and deterministic motives. Their export restrictions, trade corridors, standards competition and infrastructure investments affect shared global supply pressure and sometimes the player's capabilities.
- Production capacity started by rival governments comes online after three half-years; global pressure eases or rises with government actions, with gradual decay. Your production completions and trade deals can also ease pressure, while emergency stockpiling marginally tightens it.
- Positive, neutral and negative effects use icon + text + colour (never colour alone).
- In-game definitions explain prosperity, domestic value capture, resilience, public mandate, alliances, corporate power and investable capital.
- Capital ledger: `opening - decision cost - corporate fees + received income = closing`. Standard income is 3, +1 when Prosperity reaches 60, -1 when debt exceeds 18, with maximum balance 13. Lost income at the cap is disclosed.
- Save key bumped to `chokepoint_2040_save_v2` due to the richer world state; existing v1 saves are not overwritten but will not automatically migrate.

### Testing

`npm test` validates full 28-turn campaigns for all 12 countries under three policies, deterministic results, capital reconciliation, AI nation responses, player market ripples and finite world pressure. Local browser testing is a separate gate and may require a permitted browser runtime.
