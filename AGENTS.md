## Cursor Cloud specific instructions

This is a static portfolio site (HTML, CSS, and vanilla JavaScript). There is no package manager, lockfile, build step, linter, test runner, or backend. Do not add a dependency install to startup.

- Serve the site from the repository root with `python3 -m http.server 8080` and open `http://127.0.0.1:8080/`. Python 3 is already on the image; no virtualenv is required.
- The core flow is the architecture explorer. Project buttons (`[data-select]`) swap the graph, metrics, and deployment note. Stage buttons (`.stage`) update the engineering note and highlight connected edges. Default selection is GCP (`Shipment & Fulfillment`). AWS and Azure are the other two models in `project-models.js`.
- `#theme-toggle` and `#calm-toggle` persist `portfolio-theme` and `portfolio-calm` in `localStorage`. Storage failures are ignored.
- There is no lint or test script. `node --check script.js` and `node --check project-models.js` only confirm syntax. Manual release checks are listed in `docs/hero-model-blueprint.md`.
- Google Fonts are optional. The layout still renders with fallback fonts if `fonts.googleapis.com` is unreachable.
- `.nojekyll` is an empty GitHub Pages marker. Leave it in place.
