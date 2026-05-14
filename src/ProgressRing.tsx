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
    thickness?: number;
    strokeLinecap?: "round" | "butt" | "square";
    direction?: "clockwise" | "counter-clockwise";
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number | string;
    labelColor?: string;
    labelFormat?: "percent" | "fraction" | "value" | "none";
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
    thickness = 8,
    strokeLinecap = "round" as "round" | "butt" | "square",
    direction = "clockwise" as "clockwise" | "counter-clockwise",
    fontFamily = "inherit",
    fontSize = 20,
    fontWeight = 400,
    labelColor,
    labelFormat = "percent" as "percent" | "fraction" | "value" | "none",
    avatar,
    size = 100 as number | "auto",
    padding = 0,
    cornerRadius = 0,
    imgPadding = 0,
    cut = 0,
    rotation,
    trackThickness,
    linearGradient,
    style,
    className,
}: ProgressRingProps) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.setAttribute("value", String(value));
        el.setAttribute("min", String(min));
        el.setAttribute("max", String(max));
        el.setAttribute("primary-color", primaryColor);
        el.setAttribute("muted-color", mutedColor);
        el.setAttribute("background-color", backgroundColor);
        el.setAttribute("animated", String(animated));
        el.setAttribute("animation-delay", String(animationDelay));
        el.setAttribute("animation-duration", String(animationDuration));
        el.setAttribute("thickness", String(thickness));
        el.setAttribute("stroke-linecap", strokeLinecap);
        el.setAttribute("direction", direction);
        el.setAttribute("font-family", fontFamily);
        el.setAttribute("font-size", String(fontSize));
        el.setAttribute("font-weight", String(fontWeight));
        if (labelColor) el.setAttribute("label-color", labelColor);
        else el.removeAttribute("label-color");
        if (avatar) el.setAttribute("avatar", avatar);
        else el.removeAttribute("avatar");
        el.setAttribute("img-padding", String(imgPadding));
        el.setAttribute("cut", String(cut));
        if (rotation !== undefined) el.setAttribute("rotation", String(rotation));
        else el.removeAttribute("rotation");
        if (trackThickness !== undefined)
            el.setAttribute("track-thickness", String(trackThickness));
        else el.removeAttribute("track-thickness");
        if (linearGradient) el.setAttribute("linear-gradient", linearGradient);
        else el.removeAttribute("linear-gradient");
        el.setAttribute("label-format", labelFormat);
        el.setAttribute("size", String(size));
        el.setAttribute("padding", String(padding));
        el.setAttribute("corner-radius", String(cornerRadius));
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
        thickness,
        strokeLinecap,
        direction,
        fontFamily,
        fontSize,
        fontWeight,
        labelColor,
        labelFormat,
        avatar,
        imgPadding,
        cut,
        rotation,
        trackThickness,
        linearGradient,
        size,
        padding,
        cornerRadius,
    ]);

    return <progress-ring ref={ref} style={style} class={className} />;
}
