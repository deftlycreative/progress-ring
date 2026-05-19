<template>
    <progress-ring ref="elRef" />
</template>

<script setup>
import { ref, watchEffect } from "vue";
import "./progress-ring.js";

const props = defineProps({
    value: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    primaryColor: { type: String, default: "#4f8ef7" },
    mutedColor: { type: String, default: "#e0e0e0" },
    backgroundColor: { type: String, default: "transparent" },
    animated: { type: Boolean, default: true },
    animationDelay: { type: Number, default: 0 },
    animationDuration: { type: Number, default: 600 },
    animationMode: { type: String, default: "speed" },
    thickness: { type: Number, default: 8 },
    strokeLinecap: { type: String, default: "round" },
    direction: { type: String, default: "clockwise" },
    fontFamily: { type: String, default: "inherit" },
    fontSize: { type: Number, default: 20 },
    fontWeight: { type: [Number, String], default: 400 },
    labelColor: { type: String, default: null },
    /** Named mode or format-token template using {value}, {min}, {max}, {percent} — e.g. "{value} of {max} tasks". Default: "percent" */
    labelFormat: { type: String, default: "percent" },
    textOverride: { type: String, default: null },
    avatar: { type: String, default: null },
    imgPadding: { type: Number, default: 0 },
    cut: { type: Number, default: 0 },
    rotation: { type: Number, default: null },
    trackThickness: { type: Number, default: null },
    linearGradient: { type: String, default: null },
    size: { type: [Number, String], default: 100 },
    padding: { type: Number, default: 0 },
    cornerRadius: { type: Number, default: 0 },
    ariaLabel: { type: String, default: null },
});

const elRef = ref(null);
const prevAttrs = {};

// flush:'sync' ensures attributes are set immediately when elRef is assigned
// (during the DOM patch) and whenever props change — no extra tick required.
watchEffect(() => {
    const el = elRef.value;
    if (!el) return;

    // null, undefined, and "" are all treated as "remove the attribute".
    // prevAttrs guards against calling setAttribute for unchanged values.
    const setAttr = (name, value) => {
        const normalized = value == null || value === "" ? null : String(value);
        if (prevAttrs[name] === normalized) return;
        prevAttrs[name] = normalized;
        if (normalized === null) el.removeAttribute(name);
        else el.setAttribute(name, normalized);
    };

    setAttr("value", props.value);
    setAttr("min", props.min);
    setAttr("max", props.max);
    setAttr("primary-color", props.primaryColor);
    setAttr("muted-color", props.mutedColor);
    setAttr("background-color", props.backgroundColor);
    setAttr("animated", props.animated);
    setAttr("animation-delay", props.animationDelay);
    setAttr("animation-duration", props.animationDuration);
    setAttr("animation-mode", props.animationMode);
    setAttr("thickness", props.thickness);
    setAttr("stroke-linecap", props.strokeLinecap);
    setAttr("direction", props.direction);
    setAttr("font-family", props.fontFamily);
    setAttr("font-size", props.fontSize);
    setAttr("font-weight", props.fontWeight);
    setAttr("label-color", props.labelColor);
    setAttr("label-format", props.labelFormat);
    setAttr("text-override", props.textOverride);
    setAttr("avatar", props.avatar);
    setAttr("img-padding", props.imgPadding);
    setAttr("cut", props.cut);
    setAttr("rotation", props.rotation);
    setAttr("track-thickness", props.trackThickness);
    setAttr("linear-gradient", props.linearGradient);
    setAttr("size", props.size);
    setAttr("padding", props.padding);
    setAttr("corner-radius", props.cornerRadius);
    setAttr("aria-label", props.ariaLabel);
}, { flush: "sync" });
</script>
