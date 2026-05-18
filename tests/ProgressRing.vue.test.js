import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProgressRing from "../src/ProgressRing.vue";

// The custom element is registered when ProgressRing.vue imports progress-ring.js

function getEl(wrapper) {
    const el = wrapper.element.querySelector("progress-ring");
    if (!el) throw new Error("<progress-ring> not found in rendered output");
    return el;
}

describe("ProgressRing (Vue wrapper)", () => {
    it("renders a <progress-ring> element", () => {
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.tagName.toLowerCase()).toBe("progress-ring");
    });

    it("sets value attribute", () => {
        const wrapper = mount(ProgressRing, { props: { value: 72 } });
        expect(wrapper.element.getAttribute("value")).toBe("72");
    });

    it("sets min attribute", () => {
        const wrapper = mount(ProgressRing, { props: { min: 10 } });
        expect(wrapper.element.getAttribute("min")).toBe("10");
    });

    it("sets max attribute", () => {
        const wrapper = mount(ProgressRing, { props: { max: 50 } });
        expect(wrapper.element.getAttribute("max")).toBe("50");
    });

    it("sets primary-color attribute", () => {
        const wrapper = mount(ProgressRing, {
            props: { primaryColor: "#ff0000" },
        });
        expect(wrapper.element.getAttribute("primary-color")).toBe("#ff0000");
    });

    it("sets muted-color attribute", () => {
        const wrapper = mount(ProgressRing, { props: { mutedColor: "#aaaaaa" } });
        expect(wrapper.element.getAttribute("muted-color")).toBe("#aaaaaa");
    });

    it("sets background-color attribute", () => {
        const wrapper = mount(ProgressRing, {
            props: { backgroundColor: "#ffffff" },
        });
        expect(wrapper.element.getAttribute("background-color")).toBe("#ffffff");
    });

    it('sets animated attribute to "false"', () => {
        const wrapper = mount(ProgressRing, { props: { animated: false } });
        expect(wrapper.element.getAttribute("animated")).toBe("false");
    });

    it('sets animated attribute to "true"', () => {
        const wrapper = mount(ProgressRing, { props: { animated: true } });
        expect(wrapper.element.getAttribute("animated")).toBe("true");
    });

    it("sets animation-duration attribute", () => {
        const wrapper = mount(ProgressRing, {
            props: { animationDuration: 1000 },
        });
        expect(wrapper.element.getAttribute("animation-duration")).toBe("1000");
    });

    it("sets animation-delay attribute", () => {
        const wrapper = mount(ProgressRing, { props: { animationDelay: 300 } });
        expect(wrapper.element.getAttribute("animation-delay")).toBe("300");
    });

    it("sets animation-mode attribute", () => {
        const wrapper = mount(ProgressRing, { props: { animationMode: "duration" } });
        expect(wrapper.element.getAttribute("animation-mode")).toBe("duration");
    });

    it("defaults animation-mode to 'speed'", () => {
        const wrapper = mount(ProgressRing, {});
        expect(wrapper.element.getAttribute("animation-mode")).toBe("speed");
    });

    it("sets thickness attribute", () => {
        const wrapper = mount(ProgressRing, { props: { thickness: 14 } });
        expect(wrapper.element.getAttribute("thickness")).toBe("14");
    });

    it("sets stroke-linecap attribute", () => {
        const wrapper = mount(ProgressRing, { props: { strokeLinecap: "butt" } });
        expect(wrapper.element.getAttribute("stroke-linecap")).toBe("butt");
    });

    it("sets direction attribute", () => {
        const wrapper = mount(ProgressRing, {
            props: { direction: "counter-clockwise" },
        });
        expect(wrapper.element.getAttribute("direction")).toBe("counter-clockwise");
    });

    it("sets size attribute (numeric)", () => {
        const wrapper = mount(ProgressRing, { props: { size: 200 } });
        expect(wrapper.element.getAttribute("size")).toBe("200");
    });

    it('sets size attribute ("auto")', () => {
        const wrapper = mount(ProgressRing, { props: { size: "auto" } });
        expect(wrapper.element.getAttribute("size")).toBe("auto");
    });

    it("sets padding attribute", () => {
        const wrapper = mount(ProgressRing, { props: { padding: 8 } });
        expect(wrapper.element.getAttribute("padding")).toBe("8");
    });

    it("sets corner-radius attribute", () => {
        const wrapper = mount(ProgressRing, { props: { cornerRadius: 12 } });
        expect(wrapper.element.getAttribute("corner-radius")).toBe("12");
    });

    it("sets font-family attribute", () => {
        const wrapper = mount(ProgressRing, {
            props: { fontFamily: "Georgia, serif" },
        });
        expect(wrapper.element.getAttribute("font-family")).toBe("Georgia, serif");
    });

    it("sets font-size attribute", () => {
        const wrapper = mount(ProgressRing, { props: { fontSize: 28 } });
        expect(wrapper.element.getAttribute("font-size")).toBe("28");
    });

    it("sets font-weight attribute", () => {
        const wrapper = mount(ProgressRing, { props: { fontWeight: 700 } });
        expect(wrapper.element.getAttribute("font-weight")).toBe("700");
    });

    it("sets label-color attribute", () => {
        const wrapper = mount(ProgressRing, { props: { labelColor: "#333333" } });
        expect(wrapper.element.getAttribute("label-color")).toBe("#333333");
    });

    it("sets label-format attribute", () => {
        const wrapper = mount(ProgressRing, {
            props: { labelFormat: "fraction" },
        });
        expect(wrapper.element.getAttribute("label-format")).toBe("fraction");
    });

    it("sets label-format='integer' attribute", () => {
        const wrapper = mount(ProgressRing, {
            props: { labelFormat: "integer" },
        });
        expect(wrapper.element.getAttribute("label-format")).toBe("integer");
    });

    it("sets text-override attribute", () => {
        const wrapper = mount(ProgressRing, { props: { textOverride: "✓" } });
        expect(wrapper.element.getAttribute("text-override")).toBe("✓");
    });

    it("updates text-override attribute when prop changes", async () => {
        const wrapper = mount(ProgressRing, { props: { textOverride: "✓" } });
        await wrapper.setProps({ textOverride: "!" });
        expect(wrapper.element.getAttribute("text-override")).toBe("!");
    });

    it("updates value attribute when prop changes", async () => {
        const wrapper = mount(ProgressRing, { props: { value: 25 } });
        await wrapper.setProps({ value: 80 });
        expect(wrapper.element.getAttribute("value")).toBe("80");
    });

    it("updates primary-color attribute when prop changes", async () => {
        const wrapper = mount(ProgressRing, {
            props: { primaryColor: "#aaaaaa" },
        });
        await wrapper.setProps({ primaryColor: "#ff0000" });
        expect(wrapper.element.getAttribute("primary-color")).toBe("#ff0000");
    });

    it("updates label-format attribute when prop changes", async () => {
        const wrapper = mount(ProgressRing, {
            props: { labelFormat: "percent" },
        });
        await wrapper.setProps({ labelFormat: "fraction" });
        expect(wrapper.element.getAttribute("label-format")).toBe("fraction");
    });

    it("uses default value of 0 when not provided", () => {
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.getAttribute("value")).toBe("0");
    });

    it("uses default max of 100 when not provided", () => {
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.getAttribute("max")).toBe("100");
    });

    it("uses default size of 100 when not provided", () => {
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.getAttribute("size")).toBe("100");
    });

    it("labelColor defaults to null and the attribute is NOT set on the element", () => {
        // Vue 3 removes attributes bound to null, so label-color should be absent,
        // allowing the Web Component to fall back to primary-color itself.
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.hasAttribute("label-color")).toBe(false);
    });

    it("passing labelColor=null explicitly does not set the attribute", () => {
        const wrapper = mount(ProgressRing, { props: { labelColor: null } });
        expect(wrapper.element.hasAttribute("label-color")).toBe(false);
    });

    it("sets avatar attribute when provided", () => {
        const wrapper = mount(ProgressRing, {
            props: { avatar: "https://example.com/photo.jpg" },
        });
        expect(wrapper.element.getAttribute("avatar")).toBe("https://example.com/photo.jpg");
    });

    it("does not set avatar attribute when not provided", () => {
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.hasAttribute("avatar")).toBe(false);
    });

    it("updates avatar attribute when prop changes", async () => {
        const wrapper = mount(ProgressRing, {
            props: { avatar: "https://example.com/old.jpg" },
        });
        await wrapper.setProps({ avatar: "https://example.com/new.jpg" });
        expect(wrapper.element.getAttribute("avatar")).toBe("https://example.com/new.jpg");
    });

    it("sets img-padding attribute when provided", () => {
        const wrapper = mount(ProgressRing, { props: { imgPadding: 4 } });
        expect(wrapper.element.getAttribute("img-padding")).toBe("4");
    });

    it("img-padding defaults to 0", () => {
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.getAttribute("img-padding")).toBe("0");
    });

    it("updates img-padding attribute when prop changes", async () => {
        const wrapper = mount(ProgressRing, { props: { imgPadding: 2 } });
        await wrapper.setProps({ imgPadding: 6 });
        expect(wrapper.element.getAttribute("img-padding")).toBe("6");
    });

    it("sets cut attribute when provided", () => {
        const wrapper = mount(ProgressRing, { props: { cut: 25 } });
        expect(wrapper.element.getAttribute("cut")).toBe("25");
    });

    it("cut defaults to 0", () => {
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.getAttribute("cut")).toBe("0");
    });

    it("sets rotation attribute when provided", () => {
        const wrapper = mount(ProgressRing, { props: { rotation: 90 } });
        expect(wrapper.element.getAttribute("rotation")).toBe("90");
    });

    it("rotation defaults to null and attribute is not set", () => {
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.hasAttribute("rotation")).toBe(false);
    });

    it("sets track-thickness attribute when provided", () => {
        const wrapper = mount(ProgressRing, { props: { trackThickness: 3 } });
        expect(wrapper.element.getAttribute("track-thickness")).toBe("3");
    });

    it("track-thickness defaults to null and attribute is not set", () => {
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.hasAttribute("track-thickness")).toBe(false);
    });

    it("sets linear-gradient attribute when provided", () => {
        const wrapper = mount(ProgressRing, {
            props: { linearGradient: "#ff0000,#0000ff" },
        });
        expect(wrapper.element.getAttribute("linear-gradient")).toBe("#ff0000,#0000ff");
    });

    it("linear-gradient defaults to null and attribute is not set", () => {
        const wrapper = mount(ProgressRing);
        expect(wrapper.element.hasAttribute("linear-gradient")).toBe(false);
    });

    it("sets aria-label attribute when ariaLabel prop is provided", () => {
        const wrapper = mount(ProgressRing, { props: { ariaLabel: "Download progress" } });
        expect(wrapper.element.getAttribute("aria-label")).toBe("Download progress");
    });

    it("removes aria-label attribute when ariaLabel prop is null", () => {
        const wrapper = mount(ProgressRing, { props: { ariaLabel: null } });
        // null prop → attribute removed; the web component will set the auto-generated label
        expect(wrapper.element.hasAttribute("aria-label")).toBe(false);
    });

    it("updates aria-label attribute when ariaLabel prop changes", async () => {
        const wrapper = mount(ProgressRing, { props: { ariaLabel: "Upload progress" } });
        await wrapper.setProps({ ariaLabel: "Profile completion" });
        expect(wrapper.element.getAttribute("aria-label")).toBe("Profile completion");
    });
});
