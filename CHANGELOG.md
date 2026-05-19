# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-18

### Added

- **Accessibility** — host element now carries `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`; the inner SVG is marked `aria-hidden="true"` so screen readers don't double-announce it
- `aria-label` attribute / `ariaLabel` prop — auto-generates `"N% complete"` by default; a consumer-provided value is preserved across re-renders and only overwritten when the auto-generated label is still in place
- **`label-format` template strings** — any value containing `{` is treated as a format-token template; supported tokens: `{value}`, `{min}`, `{max}`, `{percent}` (e.g. `label-format="{value} of {max} tasks"`); tokens are replaced globally so a token may appear more than once
- `disconnectedCallback` — cancels any in-flight `requestAnimationFrame` when the element is removed from the DOM, preventing stale closures from keeping a detached element alive

### Fixed

- Format-token substitution now uses `replaceAll` so a token that appears more than once in the template (e.g. `"{value}/{value}"`) is fully replaced instead of only the first occurrence

### Performance

- `_apply()` now diffs props against the previous call (`_prevProps`) and skips each DOM-write group when its inputs are unchanged; for the common hot path (only `value` updating), the ~25 track/arc/style attribute writes are skipped and only ARIA state, label text, and arc position are touched
- `fill="none"` moved from `_apply()` to `_build()` so it is written once at construction rather than on every update

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
