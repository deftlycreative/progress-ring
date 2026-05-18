const SVG_NS = "http://www.w3.org/2000/svg";

// All attribute default values in one place — edit here, not inside _getProps.
const DEFAULTS = {
    value: "0",
    min: "0",
    max: "100",
    primaryColor: "#4f8ef7",
    mutedColor: "#e0e0e0",
    backgroundColor: "transparent",
    animationDelay: "0",
    animationDuration: "600",
    animationMode: "speed",
    thickness: "8",
    strokeLinecap: "round",
    direction: "clockwise",
    fontFamily: "inherit",
    fontSize: "20",
    fontWeight: "400",
    labelFormat: "percent",
    textOverride: "",
    // labelColor defaults to primaryColor (derived — see _getProps)
    size: "100",
    padding: "0",
    cornerRadius: "0",
    avatar: "",
    imgPadding: "0",
    cut: "0",
    rotation: "-90",
    // trackThickness defaults to thickness (derived — see _getProps)
    linearGradient: "",
    // animated defaults to true (truthy unless explicitly set to "false")
};

let _instanceCount = 0;

class ProgressRing extends HTMLElement {
    static get observedAttributes() {
        return [
            "value",
            "min",
            "max",
            "primary-color",
            "muted-color",
            "background-color",
            "animated",
            "animation-delay",
            "animation-duration",
            "animation-mode",
            "thickness",
            "stroke-linecap",
            "direction",
            "font-family",
            "font-size",
            "font-weight",
            "label-color",
            "label-format",
            "text-override",
            "size",
            "padding",
            "corner-radius",
            "avatar",
            "img-padding",
            "cut",
            "rotation",
            "track-thickness",
            "linear-gradient",
        ];
    }

    constructor() {
        super();
        this._instanceId = _instanceCount++;
        this.attachShadow({ mode: "open" });
        this._built = false;
    }

    connectedCallback() {
        if (!this._built) this._build();
        this._apply();
    }

    attributeChangedCallback() {
        if (!this._built) return;
        // Batch synchronous setAttribute bursts (e.g. from React/Vue wrappers that
        // set all props at once) into a single _apply() via a microtask.
        if (!this._applyScheduled) {
            this._applyScheduled = true;
            Promise.resolve().then(() => {
                this._applyScheduled = false;
                this._apply();
            });
        }
    }

    // ── helpers ────────────────────────────────────────────────────────────────

    _getProps() {
        const attr = (name) => this.getAttribute(name);
        const value = parseFloat(attr("value") ?? DEFAULTS.value);
        const min = parseFloat(attr("min") ?? DEFAULTS.min);
        const max = parseFloat(attr("max") ?? DEFAULTS.max);
        const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
        const primary = attr("primary-color") ?? DEFAULTS.primaryColor;
        const muted = attr("muted-color") ?? DEFAULTS.mutedColor;
        const bg = attr("background-color") ?? DEFAULTS.backgroundColor;
        const animated = attr("animated") !== "false";
        const animationDelay = parseInt(attr("animation-delay") ?? DEFAULTS.animationDelay, 10);
        const animationDuration = parseInt(attr("animation-duration") ?? DEFAULTS.animationDuration, 10);
        const animationMode = attr("animation-mode") ?? DEFAULTS.animationMode;
        const thickness = parseInt(attr("thickness") ?? DEFAULTS.thickness, 10);
        const strokeLinecap = attr("stroke-linecap") ?? DEFAULTS.strokeLinecap;
        const direction = attr("direction") ?? DEFAULTS.direction;
        const fontFamily = attr("font-family") ?? DEFAULTS.fontFamily;
        const fontSize = parseInt(attr("font-size") ?? DEFAULTS.fontSize, 10);
        const fontWeight = attr("font-weight") ?? DEFAULTS.fontWeight;
        const labelFormat = attr("label-format") ?? DEFAULTS.labelFormat;
        const textOverride = attr("text-override") ?? DEFAULTS.textOverride;
        const labelColor = attr("label-color") ?? primary;
        const rawSize = attr("size") ?? DEFAULTS.size;
        const size = rawSize === "auto" ? "auto" : parseInt(rawSize, 10);
        const padding = parseInt(attr("padding") ?? DEFAULTS.padding, 10);
        const cornerRadius = parseInt(attr("corner-radius") ?? DEFAULTS.cornerRadius, 10);
        const avatar = attr("avatar") ?? DEFAULTS.avatar;
        const imgPadding = parseInt(attr("img-padding") ?? DEFAULTS.imgPadding, 10);
        const cut = Math.min(99, Math.max(0, parseFloat(attr("cut") ?? DEFAULTS.cut)));
        const rotation = parseFloat(attr("rotation") ?? DEFAULTS.rotation);
        const rawTrackThickness = attr("track-thickness");
        const trackThickness = rawTrackThickness !== null ? parseInt(rawTrackThickness, 10) : thickness;
        const linearGradient = attr("linear-gradient") ?? DEFAULTS.linearGradient;
        return {
            value,
            min,
            max,
            percent,
            primary,
            muted,
            bg,
            animated,
            animationDelay,
            animationDuration,
            animationMode,
            thickness,
            strokeLinecap,
            direction,
            fontFamily,
            fontSize,
            fontWeight,
            labelFormat,
            textOverride,
            labelColor,
            size,
            padding,
            cornerRadius,
            avatar,
            imgPadding,
            cut,
            rotation,
            trackThickness,
            linearGradient,
        };
    }

    // ── build DOM once ─────────────────────────────────────────────────────────

    _build() {
        const style = document.createElement("style");
        style.textContent = `
      :host { display: inline-block; width: 100px; height: 100px; }
      svg   { display: block; width: 100%; height: 100%; }
      .progress { transition: stroke-dashoffset 0.6s ease; }
    `;

        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("xmlns", SVG_NS);
        svg.setAttribute("role", "img");

        const mkCircle = (cls) => {
            const el = document.createElementNS(SVG_NS, "circle");
            el.setAttribute("cx", "50");
            el.setAttribute("cy", "50");
            if (cls) el.setAttribute("class", cls);
            return el;
        };

        this._svg = svg;
        this._track = mkCircle("track");
        this._arc = mkCircle("progress");
        this._label = document.createElementNS(SVG_NS, "text");

        this._label.setAttribute("x", "50");
        this._label.setAttribute("y", "50");
        this._label.setAttribute("dominant-baseline", "central");
        this._label.setAttribute("text-anchor", "middle");
        this._label.setAttribute("font-size", "20");

        // Avatar: clipped <image> inside the arc
        const clipId = `pc-clip-${this._instanceId}`;
        const defs = document.createElementNS(SVG_NS, "defs");
        const clipPath = document.createElementNS(SVG_NS, "clipPath");
        clipPath.setAttribute("id", clipId);
        const clipCircle = document.createElementNS(SVG_NS, "circle");
        clipCircle.setAttribute("cx", "50");
        clipCircle.setAttribute("cy", "50");
        clipPath.appendChild(clipCircle);
        defs.appendChild(clipPath);

        const gradient = document.createElementNS(SVG_NS, "linearGradient");
        gradient.setAttribute("id", `pc-gradient-${this._instanceId}`);
        gradient.setAttribute("gradientUnits", "userSpaceOnUse");
        gradient.setAttribute("x1", "0");
        gradient.setAttribute("y1", "50");
        gradient.setAttribute("x2", "100");
        gradient.setAttribute("y2", "50");
        defs.appendChild(gradient);
        this._gradient = gradient;

        const avatarImg = document.createElementNS(SVG_NS, "image");
        avatarImg.setAttribute("clip-path", `url(#${clipId})`);
        avatarImg.setAttribute("preserveAspectRatio", "xMidYMid slice");
        avatarImg.setAttribute("display", "none");

        this._clipCircle = clipCircle;
        this._avatarImg = avatarImg;

        svg.append(defs, this._track, this._arc, this._label, this._avatarImg);
        this.shadowRoot.append(style, svg);
        this._built = true;
    }

    // ── apply current props to cached elements ─────────────────────────────────

    _apply() {
        const {
            value,
            max,
            percent,
            primary,
            muted,
            bg,
            animated,
            animationDelay,
            animationDuration,
            animationMode,
            thickness,
            strokeLinecap,
            direction,
            fontFamily,
            fontSize,
            fontWeight,
            labelFormat,
            textOverride,
            labelColor,
            size,
            padding,
            cornerRadius,
            avatar,
            imgPadding,
            cut,
            rotation,
            trackThickness,
            linearGradient,
        } = this._getProps();
        const r = (100 - thickness) / 2;
        const circ = 2 * Math.PI * r;
        const availableCirc = circ * (1 - cut / 100);
        const arcOffset = availableCirc - (percent / 100) * availableCirc;
        // Single-value dasharray (N = N-on N-off) is required for cut=0 so that
        // stroke-dashoffset can hide the unfilled portion.  Two-value form is only
        // needed when cut>0 to create the physical gap at the bottom of a gauge.
        const dashArray = cut > 0 ? `${availableCirc} ${circ - availableCirc}` : `${availableCirc}`;

        this._svg.setAttribute("aria-label", `${Math.round(percent)}% complete`);
        if (size === "auto") {
            this.style.width = "100%";
            this.style.height = "auto";
            this.style.aspectRatio = "1";
        } else {
            this.style.width = `${size}px`;
            this.style.height = `${size}px`;
            this.style.aspectRatio = "";
        }
        this.style.background = bg;
        this.style.padding = padding ? `${padding}px` : "";
        this.style.borderRadius = cornerRadius ? `${cornerRadius}px` : "";

        const rotate =
            direction === "counter-clockwise"
                ? `rotate(${rotation + 180}, 50, 50) scale(-1, 1) translate(-100, 0)`
                : `rotate(${rotation}, 50, 50)`;

        this._track.setAttribute("r", r);
        this._track.setAttribute("fill", "none");
        this._track.setAttribute("stroke", muted);
        this._track.setAttribute("stroke-width", trackThickness);
        this._track.setAttribute("stroke-dasharray", dashArray);
        this._track.setAttribute("transform", rotate);

        this._arc.setAttribute("r", r);
        this._arc.setAttribute("fill", "none");
        this._arc.setAttribute("stroke-width", thickness);
        this._arc.setAttribute("stroke-linecap", strokeLinecap);
        this._arc.setAttribute("stroke-dasharray", dashArray);
        this._arc.setAttribute("transform", rotate);
        // Arc stroke: linear gradient or flat primary colour
        const gradStops = linearGradient
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        if (gradStops.length >= 2) {
            // Only rebuild stop nodes when the gradient string actually changed.
            if (linearGradient !== this._prevLinearGradient) {
                this._prevLinearGradient = linearGradient;
                while (this._gradient.firstChild) this._gradient.removeChild(this._gradient.firstChild);
                gradStops.forEach((color, i) => {
                    const stop = document.createElementNS(SVG_NS, "stop");
                    stop.setAttribute("offset", `${(i / (gradStops.length - 1)) * 100}%`);
                    stop.setAttribute("stop-color", color);
                    this._gradient.appendChild(stop);
                });
            }
            this._arc.setAttribute("stroke", `url(#pc-gradient-${this._instanceId})`);
        } else {
            this._prevLinearGradient = "";
            this._arc.setAttribute("stroke", primary);
        }
        const effectiveDuration = animationMode === "duration"
            ? animationDuration
            : animationDuration * (percent / 100);
        this._arc.style.transition = animated
            ? `stroke-dashoffset ${effectiveDuration}ms ease ${animationDelay}ms`
            : "none";

        this._label.setAttribute("fill", labelColor);
        this._label.setAttribute("font-family", fontFamily);
        this._label.setAttribute("font-size", fontSize);
        this._label.setAttribute("font-weight", fontWeight);
        const labelText = (() => {
            if (textOverride) return textOverride;
            if (labelFormat === "none") return "";
            if (labelFormat === "fraction") return `${value}/${max}`;
            if (labelFormat === "value") return `${value}`;
            if (labelFormat === "integer") return `${Math.round(percent)}`;
            return `${Math.round(percent)}%`; // 'percent' default
        })();
        this._label.textContent = labelText;

        // Avatar vs label
        const innerR = 50 - thickness - imgPadding;
        if (avatar) {
            this._avatarImg.setAttribute("href", avatar);
            this._avatarImg.setAttribute("x", String(thickness + imgPadding));
            this._avatarImg.setAttribute("y", String(thickness + imgPadding));
            this._avatarImg.setAttribute("width", String(innerR * 2));
            this._avatarImg.setAttribute("height", String(innerR * 2));
            this._clipCircle.setAttribute("r", String(innerR));
            this._avatarImg.removeAttribute("display");
            this._label.style.display = "none";
        } else {
            this._avatarImg.setAttribute("display", "none");
            this._label.style.display = "";
        }

        // Animate from 0 on first paint.
        // Cancel any pending rAF from a previous _apply() call — this can happen when a
        // framework (React, Vue) sets attributes immediately after connectedCallback, causing
        // the stale closure arcOffset to overwrite the correct value.
        if (this._animRaf !== undefined) {
            cancelAnimationFrame(this._animRaf);
            this._animRaf = undefined;
        }
        // Only animate if there is something visible to sweep to (percent > 0).
        // When frameworks (Vue, React) first connect the element before setting
        // attributes, percent is 0 from the default value — skipping the animation
        // here keeps _hasAnimated false so the next _apply() with real props can
        // run the sweep.
        if (animated && !this._hasAnimated && percent > 0) {
            this._arc.setAttribute("stroke-dashoffset", availableCirc);
            this._animRaf = requestAnimationFrame(() => {
                this._animRaf = requestAnimationFrame(() => {
                    this._animRaf = undefined;
                    this._arc.setAttribute("stroke-dashoffset", arcOffset);
                });
            });
            this._hasAnimated = true;
        } else {
            this._arc.setAttribute("stroke-dashoffset", arcOffset);
        }
    }
}

if (!customElements.get("progress-ring")) {
    customElements.define("progress-ring", ProgressRing);
}

export default ProgressRing;
