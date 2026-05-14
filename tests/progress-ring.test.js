import { describe, it, expect, afterEach } from "vitest";
import "../src/progress-ring.js";

// ── helpers ──────────────────────────────────────────────────────────────────

function mount(attrs = {}) {
    const el = document.createElement("progress-ring");
    for (const [key, val] of Object.entries(attrs)) {
        el.setAttribute(key, String(val));
    }
    document.body.appendChild(el);
    return el;
}

const shadow = (el) => el.shadowRoot;
const svgEl = (el) => shadow(el).querySelector("svg");
const arc = (el) => shadow(el).querySelector(".progress");
const track = (el) => shadow(el).querySelector(".track");
const label = (el) => shadow(el).querySelector("text");

const circumference = (thickness = 8) => 2 * Math.PI * ((100 - thickness) / 2);
const expectedOffset = (percent, thickness = 8) => {
    const circ = circumference(thickness);
    return circ - (percent / 100) * circ;
};

let el;
afterEach(() => {
    if (el) {
        el.remove();
        el = null;
    }
});

// ── DOM structure ─────────────────────────────────────────────────────────────

describe("DOM structure", () => {
    it("creates a shadow root", () => {
        el = mount();
        expect(shadow(el)).not.toBeNull();
    });

    it("renders an SVG element", () => {
        el = mount();
        expect(svgEl(el)).not.toBeNull();
    });

    it('SVG has viewBox="0 0 100 100"', () => {
        el = mount();
        expect(svgEl(el).getAttribute("viewBox")).toBe("0 0 100 100");
    });

    it('SVG has role="img"', () => {
        el = mount();
        expect(svgEl(el).getAttribute("role")).toBe("img");
    });

    it("renders a track circle", () => {
        el = mount();
        expect(track(el)).not.toBeNull();
    });

    it("renders a progress arc circle", () => {
        el = mount();
        expect(arc(el)).not.toBeNull();
    });

    it("renders a text label element", () => {
        el = mount();
        expect(label(el)).not.toBeNull();
    });

    it('label has dominant-baseline="central"', () => {
        el = mount();
        expect(label(el).getAttribute("dominant-baseline")).toBe("central");
    });

    it('label has text-anchor="middle"', () => {
        el = mount();
        expect(label(el).getAttribute("text-anchor")).toBe("middle");
    });

    it("label is centered at (50, 50)", () => {
        el = mount();
        expect(label(el).getAttribute("x")).toBe("50");
        expect(label(el).getAttribute("y")).toBe("50");
    });

    it("circles are centered at (50, 50)", () => {
        el = mount();
        expect(arc(el).getAttribute("cx")).toBe("50");
        expect(arc(el).getAttribute("cy")).toBe("50");
        expect(track(el).getAttribute("cx")).toBe("50");
        expect(track(el).getAttribute("cy")).toBe("50");
    });

    it("only one SVG is present in the shadow root", () => {
        el = mount();
        expect(shadow(el).querySelectorAll("svg").length).toBe(1);
    });

    it("custom element is registered", () => {
        expect(customElements.get("progress-ring")).toBeDefined();
    });
});

// ── value / min / max ─────────────────────────────────────────────────────────

describe("value / min / max computation", () => {
    it("defaults to 0% with no attributes", () => {
        el = mount({ animated: false });
        expect(svgEl(el).getAttribute("aria-label")).toBe("0% complete");
    });

    it("uses value as percent when min=0 max=100 (defaults)", () => {
        el = mount({ value: 72, animated: false });
        expect(svgEl(el).getAttribute("aria-label")).toBe("72% complete");
    });

    it("computes percent from value and max", () => {
        el = mount({ value: 3, max: 4, animated: false });
        expect(svgEl(el).getAttribute("aria-label")).toBe("75% complete");
    });

    it("computes percent from value, min, and max", () => {
        el = mount({ value: 15, min: 10, max: 20, animated: false });
        expect(svgEl(el).getAttribute("aria-label")).toBe("50% complete");
    });

    it("clamps value below min to 0%", () => {
        el = mount({ value: -5, min: 0, max: 100, animated: false });
        expect(svgEl(el).getAttribute("aria-label")).toBe("0% complete");
    });

    it("clamps value above max to 100%", () => {
        el = mount({ value: 200, min: 0, max: 100, animated: false });
        expect(svgEl(el).getAttribute("aria-label")).toBe("100% complete");
    });

    it("handles value equal to min (0%)", () => {
        el = mount({ value: 0, min: 0, max: 100, animated: false });
        expect(svgEl(el).getAttribute("aria-label")).toBe("0% complete");
    });

    it("handles value equal to max (100%)", () => {
        el = mount({ value: 100, min: 0, max: 100, animated: false });
        expect(svgEl(el).getAttribute("aria-label")).toBe("100% complete");
    });

    it("aria-label uses rounded percent for non-integer results", () => {
        // 1/3 = 33.33...% → aria-label should say "33% complete"
        el = mount({ value: 1, max: 3, animated: false });
        expect(svgEl(el).getAttribute("aria-label")).toBe("33% complete");
    });
});

// ── arc dashoffset math ───────────────────────────────────────────────────────

describe("arc dashoffset math", () => {
    it("sets correct dashoffset for 0%", () => {
        el = mount({ value: 0, animated: false });
        const circ = circumference();
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(circ, 1);
    });

    it("sets correct dashoffset for 50%", () => {
        el = mount({ value: 50, animated: false });
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(
            expectedOffset(50),
            1,
        );
    });

    it("sets correct dashoffset for 100%", () => {
        el = mount({ value: 100, animated: false });
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(0, 1);
    });

    it("sets correct dashoffset for 25%", () => {
        el = mount({ value: 25, animated: false });
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(
            expectedOffset(25),
            1,
        );
    });

    it("sets dasharray equal to circumference", () => {
        el = mount({ value: 50, animated: false });
        expect(parseFloat(arc(el).getAttribute("stroke-dasharray"))).toBeCloseTo(
            circumference(),
            1,
        );
    });

    it("recalculates circumference and offset when thickness changes", () => {
        el = mount({ value: 50, thickness: 16, animated: false });
        const circ = circumference(16);
        expect(parseFloat(arc(el).getAttribute("stroke-dasharray"))).toBeCloseTo(circ, 1);
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(circ / 2, 1);
    });

    it("adjusts radius based on thickness", () => {
        el = mount({ thickness: 10, animated: false });
        const r = (100 - 10) / 2;
        expect(parseFloat(arc(el).getAttribute("r"))).toBeCloseTo(r, 1);
        expect(parseFloat(track(el).getAttribute("r"))).toBeCloseTo(r, 1);
    });

    it("sets stroke-width on arc to match thickness", () => {
        el = mount({ thickness: 12, animated: false });
        expect(parseFloat(arc(el).getAttribute("stroke-width"))).toBe(12);
    });

    it("sets stroke-width on track to match thickness", () => {
        el = mount({ thickness: 12, animated: false });
        expect(parseFloat(track(el).getAttribute("stroke-width"))).toBe(12);
    });

    it("arc and track stroke-width stay equal when thickness changes", () => {
        el = mount({ thickness: 20, animated: false });
        expect(arc(el).getAttribute("stroke-width")).toBe(track(el).getAttribute("stroke-width"));
    });
});

// ── track-thickness ───────────────────────────────────────────────────────────

describe("track-thickness", () => {
    it("defaults to same as thickness when not set", () => {
        el = mount({ thickness: 12, animated: false });
        expect(parseFloat(track(el).getAttribute("stroke-width"))).toBe(12);
        expect(parseFloat(arc(el).getAttribute("stroke-width"))).toBe(12);
    });

    it("sets a different stroke width on the track", () => {
        el = mount({ thickness: 10, "track-thickness": 4, animated: false });
        expect(parseFloat(track(el).getAttribute("stroke-width"))).toBe(4);
        expect(parseFloat(arc(el).getAttribute("stroke-width"))).toBe(10);
    });

    it("track can be thinner than the arc", () => {
        el = mount({ thickness: 12, "track-thickness": 2, animated: false });
        expect(parseFloat(track(el).getAttribute("stroke-width"))).toBe(2);
    });

    it("updates reactively", () => {
        el = mount({ thickness: 8, animated: false });
        el.setAttribute("track-thickness", "3");
        expect(parseFloat(track(el).getAttribute("stroke-width"))).toBe(3);
        expect(parseFloat(arc(el).getAttribute("stroke-width"))).toBe(8);
    });

    it("removing track-thickness reverts to arc thickness", () => {
        el = mount({ thickness: 8, "track-thickness": 2, animated: false });
        el.removeAttribute("track-thickness");
        expect(parseFloat(track(el).getAttribute("stroke-width"))).toBe(8);
    });
});

// ── colors ────────────────────────────────────────────────────────────────────

describe("colors", () => {
    it("applies primary-color to arc stroke", () => {
        el = mount({ "primary-color": "#ff0000", animated: false });
        expect(arc(el).getAttribute("stroke")).toBe("#ff0000");
    });

    it("defaults primary-color to #4f8ef7", () => {
        el = mount({ animated: false });
        expect(arc(el).getAttribute("stroke")).toBe("#4f8ef7");
    });

    it("applies muted-color to track stroke", () => {
        el = mount({ "muted-color": "#cccccc", animated: false });
        expect(track(el).getAttribute("stroke")).toBe("#cccccc");
    });

    it("defaults muted-color to #e0e0e0", () => {
        el = mount({ animated: false });
        expect(track(el).getAttribute("stroke")).toBe("#e0e0e0");
    });

    it('track has fill="none"', () => {
        el = mount({ animated: false });
        expect(track(el).getAttribute("fill")).toBe("none");
    });

    it('arc has fill="none"', () => {
        el = mount({ animated: false });
        expect(arc(el).getAttribute("fill")).toBe("none");
    });

    it("applies background-color to host element style", () => {
        el = mount({ "background-color": "#f0f0f0", animated: false });
        expect(el.style.background).toBe("#f0f0f0");
    });

    it("defaults background-color to transparent", () => {
        el = mount({ animated: false });
        expect(el.style.background).toBe("transparent");
    });

    it("applies label-color to label fill", () => {
        el = mount({ "label-color": "#333333", animated: false });
        expect(label(el).getAttribute("fill")).toBe("#333333");
    });

    it("label-color defaults to primary-color", () => {
        el = mount({ "primary-color": "#abcdef", animated: false });
        expect(label(el).getAttribute("fill")).toBe("#abcdef");
    });

    it("label-color overrides primary-color for label only", () => {
        el = mount({
            "primary-color": "#0000ff",
            "label-color": "#ff0000",
            animated: false,
        });
        expect(arc(el).getAttribute("stroke")).toBe("#0000ff");
        expect(label(el).getAttribute("fill")).toBe("#ff0000");
    });

    it("primary-color change updates label fill when no explicit label-color", () => {
        el = mount({ "primary-color": "#aaaaaa", animated: false });
        el.setAttribute("primary-color", "#123456");
        expect(label(el).getAttribute("fill")).toBe("#123456");
    });

    it("removing label-color falls back to primary-color", () => {
        el = mount({
            "primary-color": "#aaaaaa",
            "label-color": "#ff0000",
            animated: false,
        });
        el.removeAttribute("label-color");
        expect(label(el).getAttribute("fill")).toBe("#aaaaaa");
    });

    it("explicit label-color is not overwritten by primary-color change", () => {
        el = mount({
            "primary-color": "#aaaaaa",
            "label-color": "#ff0000",
            animated: false,
        });
        el.setAttribute("primary-color", "#0000ff");
        expect(label(el).getAttribute("fill")).toBe("#ff0000");
    });
});

// ── linear-gradient ───────────────────────────────────────────────────────────

describe("linear-gradient", () => {
    const gradient = (el) => shadow(el).querySelector("linearGradient");

    it("renders a linearGradient element in defs", () => {
        el = mount({ animated: false });
        expect(gradient(el)).not.toBeNull();
    });

    it("arc uses primary-color when linear-gradient is not set", () => {
        el = mount({ "primary-color": "#ff0000", animated: false });
        expect(arc(el).getAttribute("stroke")).toBe("#ff0000");
    });

    it("arc stroke references the gradient url when set", () => {
        el = mount({ "linear-gradient": "#ffff00,brown", animated: false });
        expect(arc(el).getAttribute("stroke")).toMatch(/^url\(#/);
    });

    it("creates the correct number of stops", () => {
        el = mount({
            "linear-gradient": "#ff0000,#ffff00,#00ff00",
            animated: false,
        });
        expect(gradient(el).querySelectorAll("stop").length).toBe(3);
    });

    it("first stop is at offset 0%", () => {
        el = mount({ "linear-gradient": "#ff0000,#0000ff", animated: false });
        const stops = gradient(el).querySelectorAll("stop");
        expect(stops[0].getAttribute("offset")).toBe("0%");
    });

    it("last stop is at offset 100%", () => {
        el = mount({ "linear-gradient": "#ff0000,#0000ff", animated: false });
        const stops = gradient(el).querySelectorAll("stop");
        expect(stops[stops.length - 1].getAttribute("offset")).toBe("100%");
    });

    it("stops use the provided colours", () => {
        el = mount({ "linear-gradient": "#ff0000,#0000ff", animated: false });
        const stops = gradient(el).querySelectorAll("stop");
        expect(stops[0].getAttribute("stop-color")).toBe("#ff0000");
        expect(stops[1].getAttribute("stop-color")).toBe("#0000ff");
    });

    it("single colour falls back to primary-color", () => {
        el = mount({
            "primary-color": "#ff0000",
            "linear-gradient": "#00ff00",
            animated: false,
        });
        expect(arc(el).getAttribute("stroke")).toBe("#ff0000");
    });

    it("reverts to primary-color when attribute is removed", () => {
        el = mount({
            "primary-color": "#abcdef",
            "linear-gradient": "#ff0000,#0000ff",
            animated: false,
        });
        el.removeAttribute("linear-gradient");
        expect(arc(el).getAttribute("stroke")).toBe("#abcdef");
    });

    it("updates stops when attribute value changes", () => {
        el = mount({ "linear-gradient": "#ff0000,#0000ff", animated: false });
        el.setAttribute("linear-gradient", "#00ff00,#ff00ff,#0000ff");
        expect(gradient(el).querySelectorAll("stop").length).toBe(3);
    });

    it("gradient id is unique per instance", () => {
        const el1 = mount({
            "linear-gradient": "#ff0000,#0000ff",
            animated: false,
        });
        const el2 = mount({
            "linear-gradient": "#00ff00,#ffff00",
            animated: false,
        });
        const id1 = shadow(el1).querySelector("linearGradient").getAttribute("id");
        const id2 = shadow(el2).querySelector("linearGradient").getAttribute("id");
        expect(id1).not.toBe(id2);
        el1.remove();
        el2.remove();
    });
});

// ── sizing ────────────────────────────────────────────────────────────────────

describe("sizing", () => {
    it("defaults size to 100px", () => {
        el = mount({ animated: false });
        expect(el.style.width).toBe("100px");
        expect(el.style.height).toBe("100px");
    });

    it("sets explicit pixel size", () => {
        el = mount({ size: 200, animated: false });
        expect(el.style.width).toBe("200px");
        expect(el.style.height).toBe("200px");
    });

    it("width and height are always equal for numeric size", () => {
        el = mount({ size: 64, animated: false });
        expect(el.style.width).toBe(el.style.height);
    });

    it('size="auto" sets width to 100%', () => {
        el = mount({ size: "auto", animated: false });
        expect(el.style.width).toBe("100%");
    });

    it('size="auto" sets height to auto', () => {
        el = mount({ size: "auto", animated: false });
        expect(el.style.height).toBe("auto");
    });

    it('size="auto" sets aspect-ratio to 1', () => {
        el = mount({ size: "auto", animated: false });
        expect(el.style.aspectRatio).toBe("1");
    });

    it("numeric size clears aspect-ratio", () => {
        el = mount({ size: 100, animated: false });
        expect(el.style.aspectRatio).toBe("");
    });
});

// ── padding & corner-radius ───────────────────────────────────────────────────

describe("padding and corner-radius", () => {
    it("no padding by default", () => {
        el = mount({ animated: false });
        expect(el.style.padding).toBe("");
    });

    it("applies padding in px", () => {
        el = mount({ padding: 12, animated: false });
        expect(el.style.padding).toBe("12px");
    });

    it("no border-radius by default", () => {
        el = mount({ animated: false });
        expect(el.style.borderRadius).toBe("");
    });

    it("applies corner-radius as border-radius in px", () => {
        el = mount({ "corner-radius": 16, animated: false });
        expect(el.style.borderRadius).toBe("16px");
    });
});

// ── label format ──────────────────────────────────────────────────────────────

describe("label-format", () => {
    it('defaults to "percent" format', () => {
        el = mount({ value: 75, animated: false });
        expect(label(el).textContent).toBe("75%");
    });

    it("rounds percent to nearest integer", () => {
        // 1/3 = 33.33...% → 33%
        el = mount({ value: 1, max: 3, animated: false });
        expect(label(el).textContent).toBe("33%");
    });

    it('label-format="percent" shows rounded percent with %', () => {
        el = mount({ value: 50, "label-format": "percent", animated: false });
        expect(label(el).textContent).toBe("50%");
    });

    it('label-format="fraction" shows value/max', () => {
        el = mount({
            value: 3,
            max: 10,
            "label-format": "fraction",
            animated: false,
        });
        expect(label(el).textContent).toBe("3/10");
    });

    it('label-format="fraction" uses raw value/max regardless of min offset', () => {
        // min=5, value=10, max=15 → percent=50%, but fraction is "10/15" not "5/10"
        el = mount({
            value: 10,
            min: 5,
            max: 15,
            "label-format": "fraction",
            animated: false,
        });
        expect(label(el).textContent).toBe("10/15");
    });

    it('label-format="fraction" uses raw value (not percent)', () => {
        el = mount({
            value: 1450,
            max: 2000,
            "label-format": "fraction",
            animated: false,
        });
        expect(label(el).textContent).toBe("1450/2000");
    });

    it('label-format="value" shows raw value', () => {
        el = mount({
            value: 1450,
            max: 2000,
            "label-format": "value",
            animated: false,
        });
        expect(label(el).textContent).toBe("1450");
    });

    it('label-format="value" preserves decimal places from value attribute', () => {
        el = mount({
            value: 1.5,
            max: 10,
            "label-format": "value",
            animated: false,
        });
        expect(label(el).textContent).toBe("1.5");
    });

    it('label-format="percent" rounds up at 0.5 boundary', () => {
        // 1/2 = exactly 50% — no rounding needed, just checking the boundary exists
        // Use a case that lands on .5: 1/4 = 25%, 3/8 = 37.5% → 38%
        el = mount({
            value: 3,
            max: 8,
            "label-format": "percent",
            animated: false,
        });
        expect(label(el).textContent).toBe("38%");
    });

    it('label-format="none" shows empty string', () => {
        el = mount({ value: 50, "label-format": "none", animated: false });
        expect(label(el).textContent).toBe("");
    });

    it('label-format="integer" shows rounded percent without %', () => {
        el = mount({ value: 75, "label-format": "integer", animated: false });
        expect(label(el).textContent).toBe("75");
    });

    it('label-format="integer" rounds to nearest integer', () => {
        // 1/3 = 33.33...% → 33
        el = mount({ value: 1, max: 3, "label-format": "integer", animated: false });
        expect(label(el).textContent).toBe("33");
    });

});

// ── text-override ─────────────────────────────────────────────────────────────

describe("text-override", () => {
    it("shows override text instead of label-format output", () => {
        el = mount({ value: 50, "text-override": "✓", animated: false });
        expect(label(el).textContent).toBe("✓");
    });

    it("override takes precedence over label-format", () => {
        el = mount({ value: 50, "label-format": "fraction", "text-override": "done", animated: false });
        expect(label(el).textContent).toBe("done");
    });

    it("empty text-override falls through to label-format", () => {
        el = mount({ value: 50, "text-override": "", animated: false });
        expect(label(el).textContent).toBe("50%");
    });

});

// ── typography ────────────────────────────────────────────────────────────────

describe("typography", () => {
    it("defaults font-size to 20", () => {
        el = mount({ animated: false });
        expect(label(el).getAttribute("font-size")).toBe("20");
    });

    it("applies custom font-size", () => {
        el = mount({ "font-size": 32, animated: false });
        expect(label(el).getAttribute("font-size")).toBe("32");
    });

    it("defaults font-weight to 400", () => {
        el = mount({ animated: false });
        expect(label(el).getAttribute("font-weight")).toBe("400");
    });

    it("applies custom font-weight (numeric)", () => {
        el = mount({ "font-weight": 700, animated: false });
        expect(label(el).getAttribute("font-weight")).toBe("700");
    });

    it("applies custom font-weight (string)", () => {
        el = mount({ "font-weight": "bold", animated: false });
        expect(label(el).getAttribute("font-weight")).toBe("bold");
    });

    it("applies font-family", () => {
        el = mount({ "font-family": "Georgia, serif", animated: false });
        expect(label(el).getAttribute("font-family")).toBe("Georgia, serif");
    });

    it("defaults font-family to inherit", () => {
        el = mount({ animated: false });
        expect(label(el).getAttribute("font-family")).toBe("inherit");
    });
});

// ── arc style ─────────────────────────────────────────────────────────────────

describe("stroke-linecap", () => {
    it('defaults to "round"', () => {
        el = mount({ animated: false });
        expect(arc(el).getAttribute("stroke-linecap")).toBe("round");
    });

    it('applies "butt"', () => {
        el = mount({ "stroke-linecap": "butt", animated: false });
        expect(arc(el).getAttribute("stroke-linecap")).toBe("butt");
    });

    it('applies "square"', () => {
        el = mount({ "stroke-linecap": "square", animated: false });
        expect(arc(el).getAttribute("stroke-linecap")).toBe("square");
    });
});

describe("direction", () => {
    it("clockwise uses rotate(-90, 50, 50)", () => {
        el = mount({ direction: "clockwise", animated: false });
        expect(arc(el).getAttribute("transform")).toBe("rotate(-90, 50, 50)");
    });

    it("defaults to clockwise", () => {
        el = mount({ animated: false });
        expect(arc(el).getAttribute("transform")).toBe("rotate(-90, 50, 50)");
    });

    it("counter-clockwise produces a different transform", () => {
        el = mount({ direction: "counter-clockwise", animated: false });
        expect(arc(el).getAttribute("transform")).not.toBe("rotate(-90, 50, 50)");
    });

    it("counter-clockwise transform contains rotate(90", () => {
        el = mount({ direction: "counter-clockwise", animated: false });
        expect(arc(el).getAttribute("transform")).toContain("rotate(90");
    });

    it("counter-clockwise uses exact transform string", () => {
        el = mount({ direction: "counter-clockwise", animated: false });
        expect(arc(el).getAttribute("transform")).toBe(
            "rotate(90, 50, 50) scale(-1, 1) translate(-100, 0)",
        );
    });

    it("track does not have a stroke-linecap attribute", () => {
        el = mount({ "stroke-linecap": "butt", animated: false });
        expect(track(el).hasAttribute("stroke-linecap")).toBe(false);
    });
});

// ── cut ───────────────────────────────────────────────────────────────────────

describe("cut", () => {
    const availableCirc = (cutPct, thickness = 8) => circumference(thickness) * (1 - cutPct / 100);

    it("defaults to 0 — full circle dasharray", () => {
        el = mount({ animated: false });
        const circ = circumference();
        expect(parseFloat(arc(el).getAttribute("stroke-dasharray"))).toBeCloseTo(circ, 1);
    });

    it("reduces the available arc length on the arc", () => {
        el = mount({ cut: 25, animated: false });
        expect(parseFloat(arc(el).getAttribute("stroke-dasharray"))).toBeCloseTo(
            availableCirc(25),
            1,
        );
    });

    it("reduces the available arc length on the track", () => {
        el = mount({ cut: 25, animated: false });
        expect(parseFloat(track(el).getAttribute("stroke-dasharray"))).toBeCloseTo(
            availableCirc(25),
            1,
        );
    });

    it("arc dashoffset is 0 at 100% with cut", () => {
        el = mount({ value: 100, cut: 20, animated: false });
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(0, 1);
    });

    it("arc dashoffset equals availableCirc at 0% with cut", () => {
        el = mount({ value: 0, cut: 20, animated: false });
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(
            availableCirc(20),
            1,
        );
    });

    it("arc dashoffset is half of available at 50% with cut", () => {
        el = mount({ value: 50, cut: 30, animated: false });
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(
            availableCirc(30) / 2,
            1,
        );
    });

    it("clamps cut to maximum 99", () => {
        el = mount({ cut: 110, animated: false });
        expect(parseFloat(arc(el).getAttribute("stroke-dasharray"))).toBeCloseTo(
            availableCirc(99),
            1,
        );
    });

    it("updates reactively", () => {
        el = mount({ cut: 0, animated: false });
        el.setAttribute("cut", "40");
        expect(parseFloat(arc(el).getAttribute("stroke-dasharray"))).toBeCloseTo(
            availableCirc(40),
            1,
        );
    });
});

// ── rotation ──────────────────────────────────────────────────────────────────

describe("rotation", () => {
    it("clockwise defaults to rotate(-90, 50, 50)", () => {
        el = mount({ direction: "clockwise", animated: false });
        expect(arc(el).getAttribute("transform")).toBe("rotate(-90, 50, 50)");
    });

    it("applies arbitrary rotation for clockwise", () => {
        el = mount({ rotation: 0, animated: false });
        expect(arc(el).getAttribute("transform")).toBe("rotate(0, 50, 50)");
    });

    it("rotation 90 starts at the bottom", () => {
        el = mount({ rotation: 90, animated: false });
        expect(arc(el).getAttribute("transform")).toBe("rotate(90, 50, 50)");
    });

    it("applies the same transform to the track", () => {
        el = mount({ rotation: 45, animated: false });
        expect(track(el).getAttribute("transform")).toBe("rotate(45, 50, 50)");
    });

    it("counter-clockwise defaults to rotate(90 … scale(-1,1)…)", () => {
        el = mount({ direction: "counter-clockwise", animated: false });
        expect(arc(el).getAttribute("transform")).toBe(
            "rotate(90, 50, 50) scale(-1, 1) translate(-100, 0)",
        );
    });

    it("applies rotation for counter-clockwise (rotation+180)", () => {
        el = mount({
            direction: "counter-clockwise",
            rotation: 0,
            animated: false,
        });
        expect(arc(el).getAttribute("transform")).toBe(
            "rotate(180, 50, 50) scale(-1, 1) translate(-100, 0)",
        );
    });

    it("updates reactively", () => {
        el = mount({ rotation: 0, animated: false });
        el.setAttribute("rotation", "90");
        expect(arc(el).getAttribute("transform")).toBe("rotate(90, 50, 50)");
    });
});

// ── animation ─────────────────────────────────────────────────────────────────

describe("animation", () => {
    it("applies a CSS transition when animated=true", () => {
        el = mount({ animated: true });
        expect(arc(el).style.transition).toContain("stroke-dashoffset");
    });

    it('transition is "none" when animated=false', () => {
        el = mount({ animated: false });
        expect(arc(el).style.transition).toBe("none");
    });

    it("transition includes animation-duration", () => {
        el = mount({ animated: true, "animation-duration": 1200 });
        expect(arc(el).style.transition).toContain("1200ms");
    });

    it("transition includes animation-delay", () => {
        el = mount({ animated: true, "animation-delay": 400 });
        expect(arc(el).style.transition).toContain("400ms");
    });

    it("defaults animation-duration to 600ms", () => {
        el = mount({ animated: true });
        expect(arc(el).style.transition).toContain("600ms");
    });

    it("defaults animation-delay to 0ms", () => {
        el = mount({ animated: true });
        expect(arc(el).style.transition).toContain("0ms");
    });
});

// ── reactivity ───────────────────────────────────────────────────────────────

describe("reactivity (attribute changes after mount)", () => {
    it("updates aria-label when value changes", () => {
        el = mount({ value: 0, animated: false });
        el.setAttribute("value", "80");
        expect(svgEl(el).getAttribute("aria-label")).toBe("80% complete");
    });

    it("updates dashoffset when value changes", () => {
        el = mount({ value: 0, animated: false });
        el.setAttribute("value", "100");
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(0, 1);
    });

    it("updates label text when value changes", () => {
        el = mount({ value: 0, animated: false });
        el.setAttribute("value", "75");
        expect(label(el).textContent).toBe("75%");
    });

    it("updates arc stroke when primary-color changes", () => {
        el = mount({ animated: false });
        el.setAttribute("primary-color", "#00ff00");
        expect(arc(el).getAttribute("stroke")).toBe("#00ff00");
    });

    it("updates track stroke when muted-color changes", () => {
        el = mount({ animated: false });
        el.setAttribute("muted-color", "#aabbcc");
        expect(track(el).getAttribute("stroke")).toBe("#aabbcc");
    });

    it("updates host background when background-color changes", () => {
        el = mount({ animated: false });
        el.setAttribute("background-color", "#123456");
        expect(el.style.background).toBe("#123456");
    });

    it("updates host size when size changes", () => {
        el = mount({ size: 100, animated: false });
        el.setAttribute("size", "250");
        expect(el.style.width).toBe("250px");
        expect(el.style.height).toBe("250px");
    });

    it('switches to size="auto" dynamically', () => {
        el = mount({ size: 100, animated: false });
        el.setAttribute("size", "auto");
        expect(el.style.width).toBe("100%");
        expect(el.style.aspectRatio).toBe("1");
    });

    it("updates label-format dynamically", () => {
        el = mount({ value: 5, max: 10, animated: false });
        el.setAttribute("label-format", "fraction");
        expect(label(el).textContent).toBe("5/10");
    });

    it("hides label when label-format set to none after mount", () => {
        el = mount({ value: 50, animated: false });
        el.setAttribute("label-format", "none");
        expect(label(el).textContent).toBe("");
    });

    it("updates stroke-linecap dynamically", () => {
        el = mount({ animated: false });
        el.setAttribute("stroke-linecap", "butt");
        expect(arc(el).getAttribute("stroke-linecap")).toBe("butt");
    });

    it("updates direction dynamically", () => {
        el = mount({ direction: "clockwise", animated: false });
        el.setAttribute("direction", "counter-clockwise");
        expect(arc(el).getAttribute("transform")).not.toBe("rotate(-90, 50, 50)");
    });

    it("updates font-size dynamically", () => {
        el = mount({ animated: false });
        el.setAttribute("font-size", "28");
        expect(label(el).getAttribute("font-size")).toBe("28");
    });

    it("updates thickness and recalculates geometry", () => {
        el = mount({ value: 50, thickness: 8, animated: false });
        el.setAttribute("thickness", "20");
        const circ = circumference(20);
        expect(parseFloat(arc(el).getAttribute("stroke-dasharray"))).toBeCloseTo(circ, 1);
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(circ / 2, 1);
    });

    it("updates min and recomputes percent", () => {
        // value=60, min=0, max=100 → 60%
        el = mount({ value: 60, min: 0, max: 100, animated: false });
        // raise min to 10 → (60-10)/(100-10)*100 = 55.55...% ≈ 56%
        el.setAttribute("min", "10");
        expect(svgEl(el).getAttribute("aria-label")).toBe("56% complete");
    });

    it("updates max and recomputes percent", () => {
        // value=50, min=0, max=100 → 50%
        el = mount({ value: 50, min: 0, max: 100, animated: false });
        // lower max to 50 → 100%
        el.setAttribute("max", "50");
        expect(svgEl(el).getAttribute("aria-label")).toBe("100% complete");
    });

    it("updates label fill when label-color changes", () => {
        el = mount({ "label-color": "#aaaaaa", animated: false });
        el.setAttribute("label-color", "#ff0000");
        expect(label(el).getAttribute("fill")).toBe("#ff0000");
    });

    it("updates font-family dynamically", () => {
        el = mount({ animated: false });
        el.setAttribute("font-family", "Courier New, monospace");
        expect(label(el).getAttribute("font-family")).toBe("Courier New, monospace");
    });

    it("updates font-weight dynamically", () => {
        el = mount({ animated: false });
        el.setAttribute("font-weight", "700");
        expect(label(el).getAttribute("font-weight")).toBe("700");
    });

    it("disables animation when animated toggled to false after mount", () => {
        el = mount({ animated: true });
        el.setAttribute("animated", "false");
        expect(arc(el).style.transition).toBe("none");
    });

    it("switches size from auto back to numeric", () => {
        el = mount({ size: "auto", animated: false });
        el.setAttribute("size", "120");
        expect(el.style.width).toBe("120px");
        expect(el.style.height).toBe("120px");
        expect(el.style.aspectRatio).toBe("");
    });
});

// ── avatar ───────────────────────────────────────────────────────────────────

describe("avatar", () => {
    const avatarImg = (el) => shadow(el).querySelector("image");
    const clipCircle = (el) => shadow(el).querySelector("clipPath circle");

    it("renders an SVG image element", () => {
        el = mount({ animated: false });
        expect(avatarImg(el)).not.toBeNull();
    });

    it("avatar image is hidden by default", () => {
        el = mount({ animated: false });
        expect(avatarImg(el).getAttribute("display")).toBe("none");
    });

    it("label is visible by default (no avatar)", () => {
        el = mount({ value: 50, animated: false });
        expect(label(el).style.display).not.toBe("none");
    });

    it("shows avatar image when avatar attribute is set", () => {
        el = mount({ avatar: "https://example.com/photo.jpg", animated: false });
        expect(avatarImg(el).getAttribute("display")).not.toBe("none");
    });

    it("hides text label when avatar is set", () => {
        el = mount({ avatar: "https://example.com/photo.jpg", animated: false });
        expect(label(el).style.display).toBe("none");
    });

    it("sets href on the image element", () => {
        el = mount({ avatar: "https://example.com/photo.jpg", animated: false });
        expect(avatarImg(el).getAttribute("href")).toBe("https://example.com/photo.jpg");
    });

    it("sets preserveAspectRatio to xMidYMid slice", () => {
        el = mount({ animated: false });
        expect(avatarImg(el).getAttribute("preserveAspectRatio")).toBe("xMidYMid slice");
    });

    it("clips the image to a circle", () => {
        el = mount({ animated: false });
        expect(avatarImg(el).getAttribute("clip-path")).toMatch(/^url\(#/);
    });

    it("clip circle radius equals inner edge of stroke (50 - thickness)", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            thickness: 8,
            animated: false,
        });
        expect(parseFloat(clipCircle(el).getAttribute("r"))).toBeCloseTo(42, 1);
    });

    it("clip circle radius updates when thickness changes", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            thickness: 16,
            animated: false,
        });
        expect(parseFloat(clipCircle(el).getAttribute("r"))).toBeCloseTo(34, 1);
    });

    it("image x and y equal thickness", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            thickness: 8,
            animated: false,
        });
        expect(parseFloat(avatarImg(el).getAttribute("x"))).toBe(8);
        expect(parseFloat(avatarImg(el).getAttribute("y"))).toBe(8);
    });

    it("image width and height equal (100 - 2 * thickness)", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            thickness: 8,
            animated: false,
        });
        expect(parseFloat(avatarImg(el).getAttribute("width"))).toBeCloseTo(84, 1);
        expect(parseFloat(avatarImg(el).getAttribute("height"))).toBeCloseTo(84, 1);
    });

    it("image dimensions update when thickness changes", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            thickness: 20,
            animated: false,
        });
        expect(parseFloat(avatarImg(el).getAttribute("width"))).toBeCloseTo(60, 1);
        expect(parseFloat(avatarImg(el).getAttribute("height"))).toBeCloseTo(60, 1);
    });

    it("removing avatar hides image and restores label", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            value: 50,
            animated: false,
        });
        el.removeAttribute("avatar");
        expect(avatarImg(el).getAttribute("display")).toBe("none");
        expect(label(el).style.display).not.toBe("none");
        expect(label(el).textContent).toBe("50%");
    });

    it("updating avatar changes the href", () => {
        el = mount({ avatar: "https://example.com/old.jpg", animated: false });
        el.setAttribute("avatar", "https://example.com/new.jpg");
        expect(avatarImg(el).getAttribute("href")).toBe("https://example.com/new.jpg");
    });

    it("each instance has a distinct clip-path id", () => {
        const el1 = mount({ avatar: "https://example.com/a.jpg", animated: false });
        const el2 = mount({ avatar: "https://example.com/b.jpg", animated: false });
        const id1 = shadow(el1).querySelector("image").getAttribute("clip-path");
        const id2 = shadow(el2).querySelector("image").getAttribute("clip-path");
        expect(id1).not.toBe(id2);
        el1.remove();
        el2.remove();
    });

    it("img-padding defaults to 0 — image x/y equal thickness", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            thickness: 8,
            animated: false,
        });
        expect(parseFloat(avatarImg(el).getAttribute("x"))).toBe(8);
        expect(parseFloat(avatarImg(el).getAttribute("y"))).toBe(8);
    });

    it("img-padding insets the image x/y", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            thickness: 8,
            "img-padding": 4,
            animated: false,
        });
        expect(parseFloat(avatarImg(el).getAttribute("x"))).toBe(12);
        expect(parseFloat(avatarImg(el).getAttribute("y"))).toBe(12);
    });

    it("img-padding shrinks the image width/height", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            thickness: 8,
            "img-padding": 4,
            animated: false,
        });
        // innerR = 50 - 8 - 4 = 38; width = 38*2 = 76
        expect(parseFloat(avatarImg(el).getAttribute("width"))).toBeCloseTo(76, 1);
        expect(parseFloat(avatarImg(el).getAttribute("height"))).toBeCloseTo(76, 1);
    });

    it("img-padding shrinks the clip circle radius", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            thickness: 8,
            "img-padding": 4,
            animated: false,
        });
        // r = 50 - 8 - 4 = 38
        expect(parseFloat(clipCircle(el).getAttribute("r"))).toBeCloseTo(38, 1);
    });

    it("img-padding updates reactively", () => {
        el = mount({
            avatar: "https://example.com/photo.jpg",
            thickness: 8,
            animated: false,
        });
        el.setAttribute("img-padding", "6");
        // innerR = 50 - 8 - 6 = 36
        expect(parseFloat(avatarImg(el).getAttribute("width"))).toBeCloseTo(72, 1);
        expect(parseFloat(clipCircle(el).getAttribute("r"))).toBeCloseTo(36, 1);
    });
});

// ── lifecycle ─────────────────────────────────────────────────────────────────

describe("lifecycle", () => {
    it("applies attributes set before DOM connection", () => {
        el = document.createElement("progress-ring");
        el.setAttribute("value", "60");
        el.setAttribute("animated", "false");
        document.body.appendChild(el);
        expect(svgEl(el).getAttribute("aria-label")).toBe("60% complete");
    });

    it("applies primary-color set before connection", () => {
        el = document.createElement("progress-ring");
        el.setAttribute("primary-color", "#ff1234");
        el.setAttribute("animated", "false");
        document.body.appendChild(el);
        expect(arc(el).getAttribute("stroke")).toBe("#ff1234");
    });

    it("reconnecting does not duplicate SVG elements in shadow root", () => {
        el = mount({ animated: false });
        el.remove();
        document.body.appendChild(el);
        expect(shadow(el).querySelectorAll("svg").length).toBe(1);
    });

    it("reconnecting does not duplicate circle elements", () => {
        el = mount({ animated: false });
        el.remove();
        document.body.appendChild(el);
        // 2 visible circles (track + arc); clipPath circle is inside <defs>
        expect(shadow(el).querySelectorAll("svg > circle").length).toBe(2);
    });

    it("state is preserved correctly after reconnect", () => {
        el = mount({ value: 75, "primary-color": "#abcdef", animated: false });
        el.remove();
        document.body.appendChild(el);
        expect(label(el).textContent).toBe("75%");
        expect(arc(el).getAttribute("stroke")).toBe("#abcdef");
    });

    it("attribute change after reconnect still updates the element", () => {
        el = mount({ value: 0, animated: false });
        el.remove();
        document.body.appendChild(el);
        el.setAttribute("value", "50");
        expect(label(el).textContent).toBe("50%");
    });
});

// ── animation lifecycle ───────────────────────────────────────────────────────

describe("animation lifecycle", () => {
    it("_hasAnimated flag is set after first animated mount", () => {
        el = mount({ animated: true });
        // After initial connection, _hasAnimated should be true preventing re-animation
        expect(el._hasAnimated).toBe(true);
    });

    it("_hasAnimated flag is NOT set when animated=false on first mount", () => {
        el = mount({ animated: false });
        expect(el._hasAnimated).toBeFalsy();
    });

    it("subsequent value changes do not reset dashoffset to circ (no re-animation)", () => {
        // On an already-animated element, changing value sets dashoffset directly (no rAF)
        el = mount({ value: 100, animated: true });
        // _hasAnimated is now true; change value — dashoffset should update synchronously
        el.setAttribute("value", "50");
        const circ = circumference();
        // dashoffset should NOT be reset to circ (full circumference) as that's the animation start
        expect(parseFloat(arc(el).getAttribute("stroke-dashoffset"))).toBeCloseTo(
            expectedOffset(50),
            1,
        );
    });

    it("attributes set synchronously after connection win over the initial rAF (framework compat)", () => {
        // Regression: React/Vue set attributes via useEffect immediately after the element is
        // connected. The initial connectedCallback fires with value=0 and schedules a rAF that
        // would overwrite the arc offset. The rAF must be cancelled when _apply() is called again
        // before it fires, so the final arc position matches the real value, not 0.
        const el2 = document.createElement("progress-ring");
        document.body.appendChild(el2); // connectedCallback fires here with value=0, rAF queued
        el2.setAttribute("value", "72"); // _apply() called again — should cancel the stale rAF
        el2.setAttribute("animated", "true");
        // The stale rAF (arcOffset captured at value=0) must not overwrite the correct offset.
        // After the synchronous setAttribute call the arc should already reflect value=72.
        expect(parseFloat(arc(el2).getAttribute("stroke-dashoffset"))).toBeCloseTo(
            expectedOffset(72),
            1,
        );
        el2.remove();
    });
});

// ── reactivity — clearing values ──────────────────────────────────────────────

describe("reactivity — clearing values back to zero", () => {
    it("clears padding when set back to 0", () => {
        el = mount({ padding: 16, animated: false });
        el.setAttribute("padding", "0");
        expect(el.style.padding).toBe("");
    });

    it("clears border-radius when corner-radius set back to 0", () => {
        el = mount({ "corner-radius": 16, animated: false });
        el.setAttribute("corner-radius", "0");
        expect(el.style.borderRadius).toBe("");
    });

    it("restores label when show-label changed back to true", () => {
        el = mount({ value: 42, "show-label": "false", animated: false });
        el.setAttribute("show-label", "true");
        expect(label(el).textContent).toBe("42%");
    });

    it("restores default background when background-color removed", () => {
        el = mount({ "background-color": "#ff0000", animated: false });
        el.removeAttribute("background-color");
        expect(el.style.background).toBe("transparent");
    });
});

// ── edge cases ────────────────────────────────────────────────────────────────

describe("edge cases", () => {
    it("handles fractional value", () => {
        el = mount({ value: 33.3, max: 100, animated: false });
        expect(label(el).textContent).toBe("33%");
    });

    it("handles min equal to max gracefully (no NaN crash)", () => {
        // (0 - 5) / (5 - 5) = NaN → should clamp to 0
        el = mount({ value: 0, min: 5, max: 5, animated: false });
        expect(label(el).textContent).not.toMatch(/NaN/);
    });

    it("multiple instances are independent", () => {
        const el1 = mount({ value: 25, animated: false });
        const el2 = mount({ value: 75, animated: false });
        expect(label(el1).textContent).toBe("25%");
        expect(label(el2).textContent).toBe("75%");
        el1.remove();
        el2.remove();
    });

    it("min > max does not crash", () => {
        // min=100, max=0, value=50 → (50-100)/(0-100)*100 = 50% — valid math, just inverted range
        expect(() => {
            el = mount({ value: 50, min: 100, max: 0, animated: false });
        }).not.toThrow();
    });

    it("DOM paint order: track is before arc in SVG children", () => {
        el = mount({ animated: false });
        const children = Array.from(svgEl(el).children);
        const trackIdx = children.indexOf(track(el));
        const arcIdx = children.indexOf(arc(el));
        expect(trackIdx).toBeLessThan(arcIdx);
    });

    it("arc is before label in SVG children", () => {
        el = mount({ animated: false });
        const children = Array.from(svgEl(el).children);
        const arcIdx = children.indexOf(arc(el));
        const labelIdx = children.indexOf(label(el));
        expect(arcIdx).toBeLessThan(labelIdx);
    });
});
