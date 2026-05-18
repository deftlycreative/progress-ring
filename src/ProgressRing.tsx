import { CSSProperties, useEffect, useRef } from "react";
import "./progress-ring.js";

export interface ProgressRingProps {
    value?: number;
    min?: number;
    max?: number;
    primaryColor?: string;
    mutedColor?: string;
    backgroundColor?: string;
    animated?: boolean;
    animationDelay?: number;
    animationDuration?: number;
    /** Whether animation duration is constant or scales with arc length. Default: "speed" */
    animationMode?: "speed" | "duration";
    thickness?: number;
    strokeLinecap?: "round" | "butt" | "square";
    direction?: "clockwise" | "counter-clockwise";
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number | string;
    labelColor?: string;
    labelFormat?: "percent" | "fraction" | "value" | "integer" | "none";
    /** Override the label text entirely. When non-empty, replaces whatever labelFormat would show */
    textOverride?: string;
    /** URL of an avatar image to display inside the circle instead of the label text */
    avatar?: string;
    /** Inset spacing in SVG units between the avatar image and the inner edge of the arc. Default: 0 */
    imgPadding?: number;
    /** Percentage of the arc circumference to leave open as a gap (0–99). Default: 0 */
    cut?: number;
    /** Start angle in degrees. Default: -90 (top). 0 = 3 o'clock, 90 = 6 o'clock */
    rotation?: number;
    /** Stroke width for the background track; defaults to thickness when omitted */
    trackThickness?: number;
    /** 2+ comma-separated colours for a linear gradient arc stroke, e.g. "#ff0000,#0000ff" */
    linearGradient?: string;
    size?: number | "auto";
    padding?: number;
    cornerRadius?: number;
    /** Accessible label for the progress ring (e.g. "Download progress"). Defaults to "N% complete". */
    ariaLabel?: string;
    style?: CSSProperties;
    className?: string;
}

/**
 * React wrapper for the <progress-ring> Web Component.
 *
 * React doesn't forward camelCase props to custom element attributes, so we
 * set them imperatively via a ref instead.
 */
export default function ProgressRing({
    value = 0,
    min = 0,
    max = 100,
    primaryColor = "#4f8ef7",
    mutedColor = "#e0e0e0",
    backgroundColor = "transparent",
    animated = true,
    animationDelay = 0,
    animationDuration = 600,
    animationMode = "speed" as "speed" | "duration",
    thickness = 8,
    strokeLinecap = "round" as "round" | "butt" | "square",
    direction = "clockwise" as "clockwise" | "counter-clockwise",
    fontFamily = "inherit",
    fontSize = 20,
    fontWeight = 400,
    labelColor,
    labelFormat = "percent" as "percent" | "fraction" | "value" | "integer" | "none",
    textOverride,
    avatar,
    size = 100 as number | "auto",
    padding = 0,
    cornerRadius = 0,
    imgPadding = 0,
    cut = 0,
    rotation,
    trackThickness,
    linearGradient,
    ariaLabel,
    style,
    className,
}: ProgressRingProps) {
    const ref = useRef<HTMLElement>(null);
    const prevAttrsRef = useRef<Record<string, string | null>>({});

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Only call setAttribute/removeAttribute when the value has actually changed.
        // This avoids triggering attributeChangedCallback (and a full re-render) for
        // every prop on every render cycle — most renders only change `value`.
        // null, undefined, and "" are all treated as "remove the attribute".
        const setAttr = (name: string, value: string | null | undefined) => {
            const normalized = value == null || value === "" ? null : value;
            const prev = prevAttrsRef.current;
            if (prev[name] === normalized) return;
            prev[name] = normalized;
            if (normalized === null) el.removeAttribute(name);
            else el.setAttribute(name, normalized);
        };

        setAttr("value", String(value));
        setAttr("min", String(min));
        setAttr("max", String(max));
        setAttr("primary-color", primaryColor);
        setAttr("muted-color", mutedColor);
        setAttr("background-color", backgroundColor);
        setAttr("animated", String(animated));
        setAttr("animation-delay", String(animationDelay));
        setAttr("animation-duration", String(animationDuration));
        setAttr("animation-mode", animationMode);
        setAttr("thickness", String(thickness));
        setAttr("stroke-linecap", strokeLinecap);
        setAttr("direction", direction);
        setAttr("font-family", fontFamily);
        setAttr("font-size", String(fontSize));
        setAttr("font-weight", String(fontWeight));
        setAttr("label-color", labelColor);
        setAttr("avatar", avatar);
        setAttr("img-padding", String(imgPadding));
        setAttr("cut", String(cut));
        setAttr("rotation", rotation !== undefined ? String(rotation) : null);
        setAttr("track-thickness", trackThickness !== undefined ? String(trackThickness) : null);
        setAttr("linear-gradient", linearGradient);
        setAttr("label-format", labelFormat);
        setAttr("text-override", textOverride);
        setAttr("size", String(size));
        setAttr("padding", String(padding));
        setAttr("corner-radius", String(cornerRadius));
        setAttr("aria-label", ariaLabel);
    }, [
        value,
        min,
        max,
        primaryColor,
        mutedColor,
        backgroundColor,
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
        labelColor,
        labelFormat,
        textOverride,
        avatar,
        imgPadding,
        cut,
        rotation,
        trackThickness,
        linearGradient,
        size,
        padding,
        cornerRadius,
        ariaLabel,
    ]);

    return <progress-ring ref={ref} style={style} class={className} />;
}
