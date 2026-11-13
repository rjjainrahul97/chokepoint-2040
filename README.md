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
