/**
 * TypeScript declarations for the <progress-ring> Web Component.
 *
 * Augments HTMLElementTagNameMap so that TypeScript recognises the element in
 * querySelector / createElement calls and in JSX for frameworks that use the
 * raw custom element tag (e.g. Svelte, Angular, plain TS).
 *
 * MAINTENANCE: These declarations are hand-maintained. When you add, remove, or
 * rename an attribute in progress-ring.js, update this file and DEFAULTS in
 * progress-ring.js to match.
 */

export interface ProgressRingAttributes {
    /** Current progress value. Default: 0 */
    value?: number | string;
    /** Minimum value (maps to 0%). Default: 0 */
    min?: number | string;
    /** Maximum value (maps to 100%). Default: 100 */
    max?: number | string;
    /** Arc (progress) colour. Default: #4f8ef7 */
    "primary-color"?: string;
    /** Track (background arc) colour. Default: #e0e0e0 */
    "muted-color"?: string;
    /** Host element background colour. Default: transparent */
    "background-color"?: string;
    /** Whether to animate the arc on first mount. Default: true */
    animated?: boolean | string;
    /** Draw-in animation duration in ms. Default: 600 */
    "animation-duration"?: number | string;
    /** Draw-in animation delay in ms. Default: 0 */
    "animation-delay"?: number | string;
    /** Whether animation duration is constant or scales with arc length. Default: "speed" */
    "animation-mode"?: "speed" | "duration";
    /** Stroke width in SVG units. Default: 8 */
    thickness?: number | string;
    /** Arc endpoint shape. Default: "round" */
    "stroke-linecap"?: "round" | "butt" | "square";
    /** Fill direction. Default: "clockwise" */
    direction?: "clockwise" | "counter-clockwise";
    /** Width and height in px, or "auto" to fill the parent. Default: 100 */
    size?: number | string;
    /** Inner padding in px. Default: 0 */
    padding?: number | string;
    /** Host element border-radius in px. Default: 0 */
    "corner-radius"?: number | string;
    /** What to display in the centre. Default: "percent" */
    "label-format"?: "percent" | "fraction" | "value" | "integer" | "none";
    /** Override the label text entirely. When non-empty, replaces whatever label-format would show */
    "text-override"?: string;
    /** Label colour. Defaults to primary-color. */
    "label-color"?: string;
    /** Label font family. Default: inherit */
    "font-family"?: string;
    /** Label font size in SVG units. Default: 20 */
    "font-size"?: number | string;
    /** Label font weight. Default: 400 */
    "font-weight"?: number | string;
    /** URL of an avatar image to display inside the circle instead of the label text */
    avatar?: string;
    /** Inset spacing in SVG units between the avatar image and the inner edge of the arc. Default: 0 */
    "img-padding"?: number | string;
    /** Percentage of the arc circumference to leave open as a gap (0–99). Default: 0 */
    cut?: number | string;
    /** Start angle in degrees. -90 = top (default), 0 = 3 o'clock, 90 = 6 o'clock */
    rotation?: number | string;
    /** Stroke width for the background track ring; defaults to thickness when omitted */
    "track-thickness"?: number | string;
    /** 2+ comma-separated colours for a linear gradient arc stroke, e.g. "#ff0000,#0000ff" */
    "linear-gradient"?: string;
}

export interface ProgressRingElement extends HTMLElement, ProgressRingAttributes {}

declare global {
    interface HTMLElementTagNameMap {
        "progress-ring": ProgressRingElement;
    }

    // Allows <progress-ring> in JSX without a framework wrapper (e.g. Preact)
    namespace JSX {
        interface IntrinsicElements {
            "progress-ring": ProgressRingAttributes & {
                ref?: unknown;
                class?: string;
                style?: string | Record<string, string | number>;
            };
        }
    }
}

declare const ProgressRing: {
    new (): ProgressRingElement;
    readonly observedAttributes: string[];
};

export default ProgressRing;
