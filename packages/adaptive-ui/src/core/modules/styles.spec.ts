import chai from "chai";
import { Color } from "../color/color.js";
import { createTokenDimension, createTokenPaint } from "../token-helpers.js";
import { InteractiveTokenGroup } from "../types.js";
import { Paint } from "../color/paint.js";
import { createTokenNonCss } from "../token-helpers.js";
import { InteractivePaintSet } from "../color/recipe.js";
import { DesignTokenType } from "../adaptive-design-tokens.js";
import { BorderFill, BorderStyle, BorderThickness, convertStylesToFocusState, CornerRadius, Fill, Padding, Styles } from "./styles.js";

const { expect } = chai;

let nameCount = 0;
const uniqueName = (prefix = "styles-test") => `${prefix}-${nameCount++}`;

describe("Styles", () => {
    describe("fromProperties", () => {
        it("should store the properties", () => {
            const styles = Styles.fromProperties({ opacity: "0.5", cursor: "pointer" });

            expect(styles.properties).to.be.instanceOf(Map);
            expect(styles.properties!.get("opacity")).to.equal("0.5");
            expect(styles.properties!.get("cursor")).to.equal("pointer");
            expect(styles.composed).to.be.undefined;
        });

        it("should skip undefined and empty values", () => {
            const styles = Styles.fromProperties({ opacity: undefined, cursor: "" });

            expect(styles.properties!.size).to.equal(0);
        });

        it("should have no name by default", () => {
            expect(Styles.fromProperties({ cursor: "pointer" }).name).to.be.undefined;
        });

        it("should register a named style as shared", () => {
            const name = uniqueName();
            const styles = Styles.fromProperties({ cursor: "pointer" }, name);

            expect(styles.name).to.equal(name);
            expect(Styles.Shared.get(name)).to.equal(styles);
        });

        it("should not register an unnamed style", () => {
            const before = Styles.Shared.size;

            Styles.fromProperties({ cursor: "pointer" });

            expect(Styles.Shared.size).to.equal(before);
        });

        it("should throw when creating a style with a duplicate name", () => {
            const name = uniqueName();
            Styles.fromProperties({ cursor: "pointer" }, name);

            expect(() => Styles.fromProperties({ cursor: "default" }, name)).to.throw(
                `Style '${name}' already created. Update it instead.`
            );
        });
    });

    describe("effectiveProperties", () => {
        it("should be the style properties", () => {
            const styles = Styles.fromProperties({ opacity: "0.5", cursor: "pointer" });

            expect([...styles.effectiveProperties]).to.deep.equal([["opacity", "0.5"], ["cursor", "pointer"]]);
        });

        it("should expand shorthand properties", () => {
            const styles = Styles.fromProperties({ padding: "4px", cornerRadius: "2px" });
            const props = styles.effectiveProperties;

            expect(props.has("padding")).to.be.false;
            expect(props.get("paddingTop")).to.equal("4px");
            expect(props.get("paddingRight")).to.equal("4px");
            expect(props.get("paddingBottom")).to.equal("4px");
            expect(props.get("paddingLeft")).to.equal("4px");
            expect(props.get("cornerRadiusTopLeft")).to.equal("2px");
            expect(props.get("cornerRadiusBottomLeft")).to.equal("2px");
            expect(props.size).to.equal(8);
        });

        it("should expand a directional shorthand", () => {
            const props = Styles.fromProperties({ paddingHorizontal: "8px" }).effectiveProperties;

            expect([...props.keys()]).to.deep.equal(["paddingRight", "paddingLeft"]);
        });

        it("should apply a later property over an earlier shorthand", () => {
            const props = Styles.fromProperties({ padding: "4px", paddingLeft: "8px" }).effectiveProperties;

            expect(props.get("paddingTop")).to.equal("4px");
            expect(props.get("paddingLeft")).to.equal("8px");
        });

        it("should not treat custom css properties as shorthand", () => {
            const props = Styles.fromProperties({ "--custom": "1" }).effectiveProperties;

            expect(props.get("--custom")).to.equal("1");
        });
    });

    describe("effectiveAdaptiveProperties", () => {
        it("should only include StyleProperty keys", () => {
            const styles = Styles.fromProperties({ cursor: "pointer", "--custom": "1", padding: "4px" });
            const props = styles.effectiveAdaptiveProperties;

            expect(props.get("cursor")).to.equal("pointer");
            expect(props.get("paddingTop")).to.equal("4px");
            expect(props.has("--custom" as any)).to.be.false;
            expect(props.size).to.equal(5);
        });
    });

    describe("compose", () => {
        it("should combine properties from each style", () => {
            const a = Styles.fromProperties({ cursor: "pointer" });
            const b = Styles.fromProperties({ opacity: "0.5" });
            const composed = Styles.compose([a, b]);

            expect(composed.composed).to.deep.equal([a, b]);
            expect(composed.properties).to.be.undefined;
            expect([...composed.effectiveProperties]).to.deep.equal([["cursor", "pointer"], ["opacity", "0.5"]]);
        });

        it("should apply later styles over earlier styles", () => {
            const a = Styles.fromProperties({ cursor: "pointer", opacity: "1" });
            const b = Styles.fromProperties({ cursor: "default" });
            const composed = Styles.compose([a, b]);

            expect(composed.effectiveProperties.get("cursor")).to.equal("default");
            expect(composed.effectiveProperties.get("opacity")).to.equal("1");
        });

        it("should add additional properties last", () => {
            const a = Styles.fromProperties({ cursor: "pointer" });
            const composed = Styles.compose([a], { cursor: "default", opacity: "0.5" });

            expect(composed.effectiveProperties.get("cursor")).to.equal("default");
            expect(composed.effectiveProperties.get("opacity")).to.equal("0.5");
        });

        it("should apply shorthand from a composed style over earlier longhand", () => {
            const a = Styles.fromProperties({ paddingTop: "1px" });
            const b = Styles.fromProperties({ padding: "4px" });
            const composed = Styles.compose([a, b]);

            expect(composed.effectiveProperties.get("paddingTop")).to.equal("4px");
        });

        it("should register with a name", () => {
            const name = uniqueName();
            const composed = Styles.compose([], undefined, name);

            expect(Styles.Shared.get(name)).to.equal(composed);
        });
    });

    describe("fromDeclaration", () => {
        it("should support a single style", () => {
            const a = Styles.fromProperties({ cursor: "pointer" });
            const result = Styles.fromDeclaration({ styles: a });

            expect(result.composed).to.deep.equal([a]);
            expect(result.effectiveProperties.get("cursor")).to.equal("pointer");
        });

        it("should support an array of styles", () => {
            const a = Styles.fromProperties({ cursor: "pointer" });
            const b = Styles.fromProperties({ opacity: "0.5" });
            const result = Styles.fromDeclaration({ styles: [a, b] });

            expect(result.composed).to.deep.equal([a, b]);
        });

        it("should support properties only", () => {
            const result = Styles.fromDeclaration({ properties: { cursor: "pointer" } });

            expect(result.composed).to.have.length(1);
            expect(result.effectiveProperties.get("cursor")).to.equal("pointer");
        });

        it("should support styles and properties, with properties last", () => {
            const a = Styles.fromProperties({ cursor: "pointer" });
            const result = Styles.fromDeclaration({ styles: a, properties: { cursor: "default" } });

            expect(result.composed).to.have.length(2);
            expect(result.effectiveProperties.get("cursor")).to.equal("default");
        });

        it("should support an empty declaration", () => {
            const result = Styles.fromDeclaration({});

            expect(result.effectiveProperties.size).to.equal(0);
        });

        it("should accept a name", () => {
            const name = uniqueName();

            expect(Styles.fromDeclaration({ properties: { cursor: "pointer" } }, name).name).to.equal(name);
            expect(Styles.Shared.has(name)).to.be.true;
        });
    });

    describe("composed styles", () => {
        it("should append a composed style and update the effective properties", () => {
            const composed = Styles.compose([Styles.fromProperties({ cursor: "pointer" })]);

            composed.appendComposed(Styles.fromProperties({ opacity: "0.5" }));

            expect(composed.composed).to.have.length(2);
            expect(composed.effectiveProperties.get("opacity")).to.equal("0.5");
        });

        it("should append to a style with no composed styles", () => {
            const styles = Styles.fromProperties({ cursor: "pointer" });

            styles.appendComposed(Styles.fromProperties({ opacity: "0.5" }));

            expect(styles.composed).to.have.length(1);
            expect(styles.effectiveProperties.get("cursor")).to.equal("pointer");
            expect(styles.effectiveProperties.get("opacity")).to.equal("0.5");
        });

        it("should clear composed styles and update the effective properties", () => {
            const composed = Styles.compose([Styles.fromProperties({ cursor: "pointer" })]);
            composed.properties = new Map([["opacity", "0.5"]]);

            expect([...composed.effectiveProperties.keys()]).to.deep.equal(["cursor", "opacity"]);

            composed.clearComposed();

            expect(composed.composed).to.be.undefined;
            expect([...composed.effectiveProperties.keys()]).to.deep.equal(["opacity"]);
        });

        it("should update the effective properties when properties are set", () => {
            const styles = Styles.fromProperties({ cursor: "pointer" });

            styles.properties = new Map([["opacity", "0.5"]]);

            expect([...styles.effectiveProperties.keys()]).to.deep.equal(["opacity"]);
        });

        it("should reflect changes of a composed style only after the effective properties are rebuilt", () => {
            const inner = Styles.fromProperties({ cursor: "pointer" });
            const outer = Styles.compose([inner]);

            inner.properties = new Map([["cursor", "default"]]);

            expect(inner.effectiveProperties.get("cursor")).to.equal("default");
            expect(outer.effectiveProperties.get("cursor")).to.equal("pointer");
        });
    });
});

describe("convertStylesToFocusState", () => {
    it("should keep string values for the focus state", () => {
        const result = convertStylesToFocusState(Styles.fromProperties({ outlineStyle: "solid" }));

        expect(result.effectiveProperties.get("outlineStyle")).to.deep.equal({
            rest: undefined,
            hover: undefined,
            active: undefined,
            focus: "solid",
            disabled: undefined,
        });
    });

    it("should keep design token values for the focus state", () => {
        const token = createTokenDimension(uniqueName("focus-token"));
        const result = convertStylesToFocusState(Styles.fromProperties({ outlineThickness: token }));
        const value = result.effectiveProperties.get("outlineThickness") as any;

        expect(value.focus).to.equal(token);
        expect(value.rest).to.be.undefined;
    });

    it("should keep css directives for the focus state", () => {
        const color = Color.fromRgb(1, 0, 0);
        const result = convertStylesToFocusState(Styles.fromProperties({ outlineColor: color }));

        expect((result.effectiveProperties.get("outlineColor") as any).focus).to.equal(color);
    });

    it("should use the focus value of an interactive set", () => {
        const rest = createTokenPaint(uniqueName("rest"));
        const focus = createTokenPaint(uniqueName("focus"));
        const result = convertStylesToFocusState(
            Styles.fromProperties({
                outlineColor: { rest, hover: rest, active: rest, focus, disabled: rest },
            })
        );

        expect(result.effectiveProperties.get("outlineColor")).to.deep.equal({
            rest: undefined,
            hover: undefined,
            active: undefined,
            focus,
            disabled: undefined,
        });
    });

    it("should skip interactive sets without a focus value", () => {
        const rest = createTokenPaint(uniqueName("rest"));
        const result = convertStylesToFocusState(
            Styles.fromProperties({
                outlineColor: { rest, hover: rest, active: rest, focus: null, disabled: rest },
            })
        );

        expect(result.effectiveProperties.has("outlineColor")).to.be.false;
    });

    it("should convert every effective property, including expanded shorthand", () => {
        const result = convertStylesToFocusState(Styles.fromProperties({ borderThickness: "2px" }));

        expect(result.effectiveProperties.size).to.equal(4);
        expect((result.effectiveProperties.get("borderThicknessLeft") as any).focus).to.equal("2px");
    });

    it("should not modify the original styles", () => {
        const original = Styles.fromProperties({ outlineStyle: "solid" });

        convertStylesToFocusState(original);

        expect(original.effectiveProperties.get("outlineStyle")).to.equal("solid");
    });
});

describe("style property helpers", () => {
    const sides = (value: unknown, names: string[]) =>
        Object.fromEntries(names.map(n => [n, value]));

    it("BorderFill.all should set every side", () => {
        expect(BorderFill.all("red")).to.deep.equal(
            sides("red", ["borderFillTop", "borderFillRight", "borderFillBottom", "borderFillLeft"])
        );
    });

    it("BorderThickness.all should set every side", () => {
        expect(BorderThickness.all("1px")).to.deep.equal(
            sides("1px", ["borderThicknessTop", "borderThicknessRight", "borderThicknessBottom", "borderThicknessLeft"])
        );
    });

    it("BorderStyle.all should set every side", () => {
        expect(BorderStyle.all("solid")).to.deep.equal(
            sides("solid", ["borderStyleTop", "borderStyleRight", "borderStyleBottom", "borderStyleLeft"])
        );
    });

    it("CornerRadius.all should set every corner", () => {
        expect(CornerRadius.all("4px")).to.deep.equal(
            sides("4px", ["cornerRadiusTopLeft", "cornerRadiusTopRight", "cornerRadiusBottomRight", "cornerRadiusBottomLeft"])
        );
    });

    it("Padding.all should set every side", () => {
        expect(Padding.all("4px")).to.deep.equal(
            sides("4px", ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"])
        );
    });

    it("Padding.verticalHorizontal should set vertical and horizontal sides", () => {
        expect(Padding.verticalHorizontal("2px", "8px")).to.deep.equal({
            paddingTop: "2px",
            paddingRight: "8px",
            paddingBottom: "2px",
            paddingLeft: "8px",
        });
    });

    it("should produce properties usable with Styles", () => {
        const styles = Styles.fromProperties({ ...Padding.all("4px"), ...CornerRadius.all("2px") });

        expect(styles.effectiveProperties.size).to.equal(8);
    });
});

describe("Fill", () => {
    const paintGroup = (name: string): InteractiveTokenGroup<Paint> => {
        const token = () => createTokenPaint(uniqueName(name)).withDefault(Color.fromRgb(0.5, 0.5, 0.5));
        return { name: uniqueName(`${name}-group`), type: DesignTokenType.color, rest: token(), hover: token(), active: token(), focus: token(), disabled: token() };
    };

    it("backgroundNonInteractive should use the same token for every state", () => {
        const background = createTokenPaint(uniqueName("bg"));
        const result = Fill.backgroundNonInteractive(background);
        const fill = result.backgroundFill as InteractiveTokenGroup<Paint>;

        expect(fill.name).to.equal(`${background.name}-value`);
        expect(fill.rest).to.equal(background);
        expect(fill.hover).to.equal(background);
        expect(fill.active).to.equal(background);
        expect(fill.focus).to.equal(background);
        expect(fill.disabled).to.equal(background);
    });

    it("backgroundNonInteractive should use a different token for disabled", () => {
        const background = createTokenPaint(uniqueName("bg"));
        const disabled = createTokenPaint(uniqueName("bg-disabled"));
        const fill = Fill.backgroundNonInteractive(background, disabled).backgroundFill as InteractiveTokenGroup<Paint>;

        expect(fill.rest).to.equal(background);
        expect(fill.disabled).to.equal(disabled);
    });

    it("foregroundNonInteractive should use the same token for every state", () => {
        const foreground = createTokenPaint(uniqueName("fg"));
        const result = Fill.foregroundNonInteractive(foreground);
        const fill = result.foregroundFill as InteractiveTokenGroup<Paint>;

        expect(fill.name).to.equal(`${foreground.name}-with-disabled-value`);
        expect(fill.rest).to.equal(foreground);
        expect(fill.focus).to.equal(foreground);
        expect(fill.disabled).to.equal(foreground);
    });

    it("foregroundNonInteractive should use a different token for disabled", () => {
        const foreground = createTokenPaint(uniqueName("fg"));
        const disabled = createTokenPaint(uniqueName("fg-disabled"));
        const fill = Fill.foregroundNonInteractive(foreground, disabled).foregroundFill as InteractiveTokenGroup<Paint>;

        expect(fill.rest).to.equal(foreground);
        expect(fill.disabled).to.equal(disabled);
    });

    it("backgroundAndForeground should create a foreground set for the background", () => {
        const background = paintGroup("bg");
        const set: InteractivePaintSet = { rest: Color.transparent, hover: null, active: null, focus: null, disabled: null };
        const recipe = createTokenNonCss<any>(`${uniqueName("fg")}.recipe`, DesignTokenType.recipe).withDefault({ evaluate: () => set });
        const result = Fill.backgroundAndForeground(background, recipe);
        const foreground = result.foregroundFill as InteractiveTokenGroup<Paint>;

        expect(result.backgroundFill).to.equal(background);
        expect(foreground.name).to.equal(`${recipe.name.replace(".recipe", "")}.on.${background.name.replace("color.", "")}`);
    });

    it("backgroundAndForegroundBySet should create a foreground set for the background", () => {
        const background = paintGroup("bg");
        const set: InteractivePaintSet = { rest: Color.transparent, hover: null, active: null, focus: null, disabled: null };
        const recipe = createTokenNonCss<any>(`${uniqueName("fg")}.recipe`, DesignTokenType.recipe).withDefault({ evaluate: () => set });
        const result = Fill.backgroundAndForegroundBySet(background, recipe);
        const foreground = result.foregroundFill as InteractiveTokenGroup<Paint>;

        expect(result.backgroundFill).to.equal(background);
        expect(foreground.name).to.equal(`${recipe.name.replace(".recipe", "")}.on.${background.name.replace("color.", "")}`);
    });
});
