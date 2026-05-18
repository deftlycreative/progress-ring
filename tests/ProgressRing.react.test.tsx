import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import ProgressRing from "../src/ProgressRing.tsx";

// The custom element is registered when ProgressRing.tsx imports progress-ring.js

function getEl(container: HTMLElement): HTMLElement {
    const el = container.querySelector("progress-ring");
    if (!el) throw new Error("<progress-ring> not found in rendered output");
    return el as HTMLElement;
}

describe("ProgressRing (React wrapper)", () => {
    it("renders a <progress-ring> element", () => {
        const { container } = render(<ProgressRing />);
        expect(container.querySelector("progress-ring")).not.toBeNull();
    });

    it("sets value attribute", async () => {
        const { container } = render(<ProgressRing value={72} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("value")).toBe("72");
    });

    it("sets min attribute", async () => {
        const { container } = render(<ProgressRing min={10} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("min")).toBe("10");
    });

    it("sets max attribute", async () => {
        const { container } = render(<ProgressRing max={50} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("max")).toBe("50");
    });

    it("sets primary-color attribute", async () => {
        const { container } = render(<ProgressRing primaryColor="#ff0000" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("primary-color")).toBe("#ff0000");
    });

    it("sets muted-color attribute", async () => {
        const { container } = render(<ProgressRing mutedColor="#aaaaaa" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("muted-color")).toBe("#aaaaaa");
    });

    it("sets background-color attribute", async () => {
        const { container } = render(<ProgressRing backgroundColor="#ffffff" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("background-color")).toBe("#ffffff");
    });

    it("sets animated attribute", async () => {
        const { container } = render(<ProgressRing animated={false} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("animated")).toBe("false");
    });

    it("sets animation-duration attribute", async () => {
        const { container } = render(<ProgressRing animationDuration={1000} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("animation-duration")).toBe("1000");
    });

    it("sets animation-delay attribute", async () => {
        const { container } = render(<ProgressRing animationDelay={300} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("animation-delay")).toBe("300");
    });

    it("sets animation-mode attribute", async () => {
        const { container } = render(<ProgressRing animationMode="duration" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("animation-mode")).toBe("duration");
    });

    it("defaults animation-mode to 'speed'", async () => {
        const { container } = render(<ProgressRing />);
        await act(async () => {});
        expect(getEl(container).getAttribute("animation-mode")).toBe("speed");
    });

    it("sets thickness attribute", async () => {
        const { container } = render(<ProgressRing thickness={12} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("thickness")).toBe("12");
    });

    it("sets stroke-linecap attribute", async () => {
        const { container } = render(<ProgressRing strokeLinecap="butt" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("stroke-linecap")).toBe("butt");
    });

    it("sets direction attribute", async () => {
        const { container } = render(<ProgressRing direction="counter-clockwise" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("direction")).toBe("counter-clockwise");
    });

    it("sets size attribute (numeric)", async () => {
        const { container } = render(<ProgressRing size={150} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("size")).toBe("150");
    });

    it('sets size attribute ("auto")', async () => {
        const { container } = render(<ProgressRing size="auto" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("size")).toBe("auto");
    });

    it("sets padding attribute", async () => {
        const { container } = render(<ProgressRing padding={8} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("padding")).toBe("8");
    });

    it("sets corner-radius attribute", async () => {
        const { container } = render(<ProgressRing cornerRadius={12} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("corner-radius")).toBe("12");
    });

    it("sets font-family attribute", async () => {
        const { container } = render(<ProgressRing fontFamily="Arial" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("font-family")).toBe("Arial");
    });

    it("sets font-size attribute", async () => {
        const { container } = render(<ProgressRing fontSize={24} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("font-size")).toBe("24");
    });

    it("sets font-weight attribute", async () => {
        const { container } = render(<ProgressRing fontWeight={700} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("font-weight")).toBe("700");
    });

    it("sets label-color attribute when provided", async () => {
        const { container } = render(<ProgressRing labelColor="#333333" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("label-color")).toBe("#333333");
    });

    it("removes label-color attribute when not provided", async () => {
        const { container } = render(<ProgressRing />);
        await act(async () => {});
        expect(getEl(container).hasAttribute("label-color")).toBe(false);
    });

    it("sets label-format attribute", async () => {
        const { container } = render(<ProgressRing labelFormat="fraction" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("label-format")).toBe("fraction");
    });

    it("sets label-format='integer' attribute", async () => {
        const { container } = render(<ProgressRing labelFormat="integer" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("label-format")).toBe("integer");
    });

    it("sets text-override attribute", async () => {
        const { container } = render(<ProgressRing textOverride="✓" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("text-override")).toBe("✓");
    });

    it("removes text-override attribute when prop is empty", async () => {
        const { container, rerender } = render(<ProgressRing textOverride="✓" />);
        await act(async () => {});
        rerender(<ProgressRing textOverride="" />);
        await act(async () => {});
        expect(getEl(container).hasAttribute("text-override")).toBe(false);
    });

    it("updates value attribute when prop changes", async () => {
        const { container, rerender } = render(<ProgressRing value={25} />);
        await act(async () => {});
        rerender(<ProgressRing value={80} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("value")).toBe("80");
    });

    it("updates primary-color attribute when prop changes", async () => {
        const { container, rerender } = render(<ProgressRing primaryColor="#aaaaaa" />);
        await act(async () => {});
        rerender(<ProgressRing primaryColor="#ff0000" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("primary-color")).toBe("#ff0000");
    });

    it("passes style prop to element", () => {
        // Use a property not overridden by _apply() (width/height are managed by the Web Component)
        const { container } = render(
            <ProgressRing style={{ opacity: 0.5 } as React.CSSProperties} />,
        );
        const el = getEl(container) as HTMLElement;
        expect(el.style.opacity).toBe("0.5");
    });

    it("passes className prop to element", () => {
        const { container } = render(<ProgressRing className="my-circle" />);
        expect(getEl(container).getAttribute("class")).toBe("my-circle");
    });

    it("sets avatar attribute when provided", async () => {
        const { container } = render(<ProgressRing avatar="https://example.com/photo.jpg" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("avatar")).toBe("https://example.com/photo.jpg");
    });

    it("removes avatar attribute when not provided", async () => {
        const { container } = render(<ProgressRing />);
        await act(async () => {});
        expect(getEl(container).hasAttribute("avatar")).toBe(false);
    });

    it("updates avatar attribute when prop changes", async () => {
        const { container, rerender } = render(
            <ProgressRing avatar="https://example.com/old.jpg" />,
        );
        await act(async () => {});
        rerender(<ProgressRing avatar="https://example.com/new.jpg" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("avatar")).toBe("https://example.com/new.jpg");
    });

    it("sets img-padding attribute when provided", async () => {
        const { container } = render(<ProgressRing imgPadding={4} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("img-padding")).toBe("4");
    });

    it("img-padding defaults to 0", async () => {
        const { container } = render(<ProgressRing />);
        await act(async () => {});
        expect(getEl(container).getAttribute("img-padding")).toBe("0");
    });

    it("updates img-padding attribute when prop changes", async () => {
        const { container, rerender } = render(<ProgressRing imgPadding={2} />);
        await act(async () => {});
        rerender(<ProgressRing imgPadding={6} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("img-padding")).toBe("6");
    });

    it("sets cut attribute when provided", async () => {
        const { container } = render(<ProgressRing cut={25} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("cut")).toBe("25");
    });

    it("cut defaults to 0", async () => {
        const { container } = render(<ProgressRing />);
        await act(async () => {});
        expect(getEl(container).getAttribute("cut")).toBe("0");
    });

    it("sets rotation attribute when provided", async () => {
        const { container } = render(<ProgressRing rotation={90} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("rotation")).toBe("90");
    });

    it("removes rotation attribute when not provided", async () => {
        const { container } = render(<ProgressRing />);
        await act(async () => {});
        expect(getEl(container).hasAttribute("rotation")).toBe(false);
    });

    it("sets track-thickness attribute when provided", async () => {
        const { container } = render(<ProgressRing trackThickness={3} />);
        await act(async () => {});
        expect(getEl(container).getAttribute("track-thickness")).toBe("3");
    });

    it("removes track-thickness attribute when not provided", async () => {
        const { container } = render(<ProgressRing />);
        await act(async () => {});
        expect(getEl(container).hasAttribute("track-thickness")).toBe(false);
    });

    it("sets linear-gradient attribute when provided", async () => {
        const { container } = render(<ProgressRing linearGradient="#ff0000,#0000ff" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("linear-gradient")).toBe("#ff0000,#0000ff");
    });

    it("removes linear-gradient attribute when not provided", async () => {
        const { container } = render(<ProgressRing />);
        await act(async () => {});
        expect(getEl(container).hasAttribute("linear-gradient")).toBe(false);
    });

    it("sets aria-label attribute when ariaLabel prop is provided", async () => {
        const { container } = render(<ProgressRing ariaLabel="Download progress" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("aria-label")).toBe("Download progress");
    });

    it("uses auto-generated aria-label when ariaLabel prop is not provided", async () => {
        const { container } = render(<ProgressRing value={72} />);
        await act(async () => {});
        // The web component auto-generates "N% complete" when no ariaLabel is given
        expect(getEl(container).getAttribute("aria-label")).toBe("72% complete");
    });

    it("updates aria-label attribute when ariaLabel prop changes", async () => {
        const { container, rerender } = render(<ProgressRing ariaLabel="Upload progress" />);
        await act(async () => {});
        rerender(<ProgressRing ariaLabel="Profile completion" />);
        await act(async () => {});
        expect(getEl(container).getAttribute("aria-label")).toBe("Profile completion");
    });
});
