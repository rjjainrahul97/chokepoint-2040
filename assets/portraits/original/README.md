# CHOKEPOINT 2040 | Fictional representative portraits

**Status:** All 38 source images supplied on 14 November 2026. Gameplay integration remains a separate Build Protocol task.

- **Assets:** 38 individual transparent 512 x 512 PNG files in this folder (24 countries, 14 companies).
- **File names:** Exact matches for every `sourceFilename` in [the machine-readable cast](../../../design/portrait-manifest.json). Do not rename.
- **Art direction:** Original flat 2D editorial cartoons, bold outlines, restrained cel shading, no real public-figure likenesses, no flags or labels.
- **Provenance:** Created specifically for CHOKEPOINT 2040; no third-party art. Generated from the original vector artwork in [scripts/generate_portraits.py](../../../scripts/generate_portraits.py).
- **Source format:** 48-colour indexed PNG preserving alpha transparency. Size 512 x 512. The script can regenerate the source files.
- **Not yet integrated:** Build Protocol should produce 192px WebP runtime derivatives, update the cast manifest's asset status, wire portrait IDs to events, test fallback/save continuity, and avoid loading every portrait at once.

**Rebuild from repo root:**
```bash
pip install cairosvg pillow
python scripts/generate_portraits.py
```

**Batch 1 (8 assets):** `country-india-a.png`, `country-india-b.png`, `country-china-a.png`, `country-china-b.png`, `country-germany-a.png`, `country-germany-b.png`, `company-meridian-a.png`, `company-meridian-b.png`.

**Batch 2:** Remaining 30 files in this same folder.
