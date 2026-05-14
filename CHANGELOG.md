# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-05-14

### Added

- `animation-mode` attribute / `animationMode` prop (`"speed"` | `"duration"`, default `"speed"`) — `"speed"` scales the transition duration proportionally to the arc length so all arcs animate at a consistent visual speed; `"duration"` preserves the original fixed-duration behaviour

## [1.0.3] - 2026-05-14

### Added

- `label-format="integer"` — displays `Math.round(percent)` without a `%` sign
- `text-override` attribute / `textOverride` prop — replaces the label with any arbitrary string while the arc still reflects `value`

## [1.0.2] - 2026-05-13

### Fixed

- GitHub Actions publish workflow updated to Node 24 (ships with npm 11.x, required for Trusted Publishing)

## [1.0.0] - 2026-05-13

### Added

- Initial release of `@deftlycreative/progress-ring`
- SVG-based circular progress Web Component with Shadow DOM encapsulation
- 27 configurable attributes covering value, colors, sizing, animation, label, gauge mode, gradient arc, and avatar
- Vue 3 wrapper (`@deftlycreative/progress-ring/vue`)
- React wrapper (`@deftlycreative/progress-ring/react`)
- TypeScript declarations
- CSS draw-in animation with configurable duration and delay
- Gauge/speedometer mode via `cut` + `rotation`
- Linear gradient arc stroke
- Avatar image support (replaces label)
- Accessible via `role="img"` + `aria-label`
- ESM and UMD builds via `dist/`
- GitHub Actions CI and npm publish workflows
