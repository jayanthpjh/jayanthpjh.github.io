# Spatial engineering portfolio blueprint

## Intent and renderer boundary

A professional portfolio built around understandable data architectures and delivery expertise. The hero has a full-width explorer with adjacent project buttons. The diagrams illustrate repository architecture; packet motion is illustrative and is never live infrastructure telemetry.

`project-models.js` owns project content and graph definitions. `script.js` owns selection, stage explanation, theme, motion settings, and SVG routing. `styles.css` owns responsive layout, 3D module shapes, semantic color tokens, and animations. `index.html` contains the accessible page structure and permanent links.

## Editable project template

Add an entry to `window.portfolioModels`, then add a native button to `.project-switch` and a project article using the same project key. Each article has a separate `data-select` button and independent repository link.

```js
example: {
  name: 'Project name',
  slug: 'repository-folder',
  evidence: 'Describe what was actually tested, and what is only documented.',
  nodes: [
    { id: 'source', title: 'Source system', caption: 'Input type',
      kind: 'storage', x: 15, y: 50,
      detail: 'Plain-language explanation of this stage and engineering work.' },
    { id: 'output', title: 'Curated output', caption: 'Business purpose',
      kind: 'analytics', x: 85, y: 50,
      detail: 'Explain the outcome without inventing performance metrics.' }
  ],
  edges: [['source', 'output']]
}
```

- Node IDs must be unique within a model; every edge must reference existing IDs.
- Supported module kinds: storage, compute, quality, lake, analytics.
- Coordinates are percentages of the desktop scene. Leave room for module labels.
- Node order determines keyboard and mobile reading order.
- Project data is trusted, repository-authored content, not remote user input.
- Keep technology claims and deployment evidence tied to project documentation.

## Layout and state

The page runs introduction → explorer → career evidence → personal builds → professional experience → delivery method → about → contact.

Default selection is GCP. GCP has five sequential modules; AWS has six modules including two parallel input paths; Azure has seven modules with a common quality gate. Selecting a project replaces all modules and edges immediately. This removes outgoing CSS animations without timers, so rapid selections cannot leave stale nodes. Stage selection changes the detail panel and incident edge highlights.

Project selectors and stages are native buttons exposing `aria-pressed`. A polite status announces project changes. Project-card actions move focus to the matching hero selector before scrolling; external links do not change selection. The noscript message preserves access to repository documentation.

## Themes and motion

Semantic tokens define background, surface, raised surface, text, muted text, accent, teal, borders, buttons, and 3D faces. Dark uses indigo/slate with periwinkle and aquamarine. Light uses pearl/white with cobalt and deep teal. Never reuse pale dark-theme accents for light-theme text.

`portfolio-theme` and `portfolio-calm` persist preferences when storage is available. Storage failure must not break selection. Calm mode and the OS reduced-motion preference disable assembly, continuous packet motion, reveal motion, and smooth scrolling. Turning calm mode off restores CSS packet animation unless OS reduced motion is active.

Assembly lasts 650 ms with a 65 ms stage stagger. SVG packets follow actual graph edges. Section reveals run once as content enters the viewport; content is never hidden awaiting JavaScript. Project cards have subtle hover depth; the delivery method has dimensional step blocks.

At 700 px or narrower, modules stack as readable full-width buttons and connections route outside the cards. ResizeObserver recalculates routes from real module geometry. At wider sizes, branching project graphs have different coordinates and edges.

## Upgrade path

For Three.js/WebGL, keep the model keys, nodes, edges, selection controls, text explanations, native focus semantics, and evidence panel. Replace only scene rendering. Keep an HTML fallback, motion preferences, and the mobile layout. A WebGL upgrade is optional, not required by the current implementation.

## Release checks

Check GCP/AWS/Azure node and edge counts (5/4, 6/5, 7/6), changing edge geometry, stage explanations, rapid selection, card-button focus, independent repository links, and theme persistence. Check motion disabled and resumed, no browser errors, unique IDs and local resources. Inspect desktop and phone screenshots in both themes and check overflow at 320, 390, 768, 1024, and 1440 px. Check primary text at 4.5:1 and controls at 3:1 contrast. Version CSS and script URLs together when publishing so cached assets cannot mix old and new markup. Verify GitHub Pages completion and live selectors after release.
