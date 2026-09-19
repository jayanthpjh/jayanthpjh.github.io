# Hero System Map Blueprint

## Purpose

The hero visual communicates a forward-deployed data engineer moving a real customer system from source discovery to trusted production output. It is a project-driven topology, not an abstract nucleus or decorative orb.

## Visual anatomy

1. **Sources**: files, events, operational databases, and SaaS feeds.
2. **Field bridge**: source-to-target mapping, integration, and transformation work.
3. **Trust layer**: schema checks, reconciliation, observability, and failure handling.
4. **Lakehouse**: bronze/silver/gold or equivalent governed storage and orchestration.
5. **Outcome**: BI, operations, underwriting, logistics, or commerce decisions.

Edges show direction. Animated packets represent data movement. Glass cards represent systems and checkpoints. The small deployment badge represents the engineer working inside the customer context.

## Project configuration contract

Each project entry in `script.js` supplies:

- `label` and `status` for the deployment badge
- `headline` and `description` for the model panel
- `source`, `bridge`, `quality`, `serve`, and `output` stage labels
- two `metrics` pairs for the system panel

To add a project, add a new key to `models`, add a project card with the same `data-project` value, and keep the stage arrays in the same shape.

## Interaction rules

- Cards select the model; external project links remain independent.
- Enter and Space activate focused cards.
- The selected card exposes `aria-pressed="true"` and receives `.is-selected`.
- The map exposes the active project through `data-active-project`.
- Calm mode and `prefers-reduced-motion` stop continuous packet and particle motion.

## Future WebGL upgrade

A future Three.js or WebGPU renderer can replace the SVG/canvas layer while keeping the project configuration contract and card-selection events unchanged. Preserve the same five-stage topology, focus behavior, reduced-motion behavior, and mobile fallback.
