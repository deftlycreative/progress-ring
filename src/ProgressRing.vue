<template>
    <progress-ring
        :value="String(value)"
        :min="String(min)"
        :max="String(max)"
        :primary-color="primaryColor"
        :muted-color="mutedColor"
        :background-color="backgroundColor"
        :animated="String(animated)"
        :animation-delay="String(animationDelay)"
        :animation-duration="String(animationDuration)"
        :animation-mode="animationMode"
        :thickness="String(thickness)"
        :stroke-linecap="strokeLinecap"
        :direction="direction"
        :font-family="fontFamily"
        :font-size="String(fontSize)"
        :font-weight="String(fontWeight)"
        :label-color="labelColor"
        :label-format="labelFormat"
        :text-override="textOverride"
        :avatar="avatar"
        :img-padding="String(imgPadding)"
        :cut="String(cut)"
        :rotation="rotation !== null ? String(rotation) : null"
        :track-thickness="trackThickness !== null ? String(trackThickness) : null"
        :linear-gradient="linearGradient"
        :size="String(size)"
        :padding="String(padding)"
        :corner-radius="String(cornerRadius)"
    />
</template>

<script setup>
import "./progress-ring.js";

defineProps({
    value: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    primaryColor: { type: String, default: "#4f8ef7" },
    mutedColor: { type: String, default: "#e0e0e0" },
    backgroundColor: { type: String, default: "transparent" },
    animated: { type: Boolean, default: true },
    animationDelay: { type: Number, default: 0 },
    animationDuration: { type: Number, default: 600 },
    animationMode: { type: String, default: 'speed' },
    thickness: { type: Number, default: 8 },
    strokeLinecap: { type: String, default: "round" },
    direction: { type: String, default: "clockwise" },
    fontFamily: { type: String, default: "inherit" },
    fontSize: { type: Number, default: 20 },
    fontWeight: { type: [Number, String], default: 400 },
    labelColor: { type: String, default: null },
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
});
</script>
