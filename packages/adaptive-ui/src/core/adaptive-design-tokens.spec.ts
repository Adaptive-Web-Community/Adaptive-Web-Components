import chai from "chai";
import {
    DesignTokenMultiValue,
    DesignTokenRegistry,
    DesignTokenType,
    TypedCSSDesignToken,
    TypedDesignToken,
} from "./adaptive-design-tokens.js";
import { StyleProperty } from "./modules/types.js";

const { expect } = chai;

describe("DesignTokenType", () => {
    it("should have values that match their keys", () => {
        Object.entries(DesignTokenType).forEach(([key, value]) => {
            expect(value).to.equal(key);
        });
    });

    it("should include the Adaptive UI additions", () => {
        ["boolean", "fontStyle", "fontVariations", "palette", "recipe", "paint", "string"].forEach(type => {
            expect(DesignTokenType).to.have.property(type);
        });
    });
});

describe("TypedDesignToken", () => {
    it("should create a token with the name, type, and intended style property", () => {
        const token = TypedDesignToken.createTyped<number>("typed-test.single", DesignTokenType.number, StyleProperty.opacity);

        expect(token.name).to.equal("typed-test.single");
        expect(token.type).to.equal("number");
        expect(token.intendedFor).to.deep.equal([StyleProperty.opacity]);
    });

    it("should keep an array of intended style properties", () => {
        const intendedFor = [StyleProperty.paddingLeft, StyleProperty.paddingRight];
        const token = TypedDesignToken.createTyped<string>("typed-test.array", DesignTokenType.dimension, intendedFor);

        expect(token.intendedFor).to.deep.equal(intendedFor);
    });

    it("should not have an intended style property by default", () => {
        const token = TypedDesignToken.createTyped<number>("typed-test.none", DesignTokenType.number);

        expect(token.intendedFor).to.be.undefined;
    });

    it("should support a custom type", () => {
        const token = TypedDesignToken.createTyped<number>("typed-test.custom", "my-type");

        expect(token.type).to.equal("my-type");
    });

    it("should keep metadata per token", () => {
        const a = TypedDesignToken.createTyped<number>("typed-test.a", DesignTokenType.number, StyleProperty.opacity);
        const b = TypedDesignToken.createTyped<string>("typed-test.b", DesignTokenType.dimension, StyleProperty.gap);

        expect(a.type).to.equal("number");
        expect(b.type).to.equal("dimension");
        expect(a.intendedFor).to.deep.equal([StyleProperty.opacity]);
        expect(b.intendedFor).to.deep.equal([StyleProperty.gap]);
    });

    it("should register the token", () => {
        const token = TypedDesignToken.createTyped<number>("typed-test.registered", DesignTokenType.number);

        expect(DesignTokenRegistry.Shared.get("typed-test.registered")).to.equal(token);
    });

    it("should be constructable without registering", () => {
        const token = new TypedDesignToken<number>("typed-test.unregistered", DesignTokenType.number);

        expect(token.type).to.equal("number");
        expect(DesignTokenRegistry.Shared.has("typed-test.unregistered")).to.be.false;
    });

    it("should evaluate its default value", () => {
        const token = TypedDesignToken.createTyped<number>("typed-test.value", DesignTokenType.number).withDefault(42);

        expect(token.default).to.equal(42);
    });

    it("should evaluate a derived default value", () => {
        const base = TypedDesignToken.createTyped<number>("typed-test.base", DesignTokenType.number).withDefault(2);
        const derived = TypedDesignToken.createTyped<number>("typed-test.derived", DesignTokenType.number).withDefault(
            resolve => resolve(base) * 3
        );

        expect(derived.default).to.equal(6);
    });
});

describe("TypedCSSDesignToken", () => {
    it("should create a token with the name, type, and intended style property", () => {
        const token = TypedCSSDesignToken.createTyped<string>("css-typed-test.single", DesignTokenType.dimension, StyleProperty.gap);

        expect(token.name).to.equal("css-typed-test.single");
        expect(token.type).to.equal("dimension");
        expect(token.intendedFor).to.deep.equal([StyleProperty.gap]);
    });

    it("should keep an array of intended style properties", () => {
        const intendedFor = [StyleProperty.paddingTop, StyleProperty.paddingBottom];
        const token = TypedCSSDesignToken.createTyped<string>("css-typed-test.array", DesignTokenType.dimension, intendedFor);

        expect(token.intendedFor).to.deep.equal(intendedFor);
    });

    it("should convert dots in the name to dashes for the custom property", () => {
        const token = TypedCSSDesignToken.createTyped<string>("css-typed-test.some.nested.name", DesignTokenType.dimension);

        expect(token.cssCustomProperty).to.equal("--css-typed-test-some-nested-name");
        expect(token.createCSS()).to.equal("var(--css-typed-test-some-nested-name)");
    });

    it("should register the token", () => {
        const token = TypedCSSDesignToken.createTyped<string>("css-typed-test.registered", DesignTokenType.dimension);

        expect(DesignTokenRegistry.Shared.get("css-typed-test.registered")).to.equal(token);
    });

    it("should replace a previously registered token with the same name", () => {
        const first = TypedCSSDesignToken.createTyped<string>("css-typed-test.dupe", DesignTokenType.dimension);
        const second = TypedCSSDesignToken.createTyped<string>("css-typed-test.dupe", DesignTokenType.dimension);

        expect(DesignTokenRegistry.Shared.get("css-typed-test.dupe")).to.equal(second);
        expect(second).not.to.equal(first);
    });

    it("should evaluate its default value", () => {
        const token = TypedCSSDesignToken.createTyped<string>("css-typed-test.value", DesignTokenType.dimension).withDefault("8px");

        expect(token.default).to.equal("8px");
    });
});

describe("DesignTokenRegistry", () => {
    it("should have shared tokens and groups", () => {
        expect(DesignTokenRegistry.Shared).to.be.instanceOf(Map);
        expect(DesignTokenRegistry.Groups).to.be.instanceOf(Map);
    });
});

describe("DesignTokenMultiValue", () => {
    it("should be an array", () => {
        const values = new DesignTokenMultiValue<string>("a", "b");

        expect(values).to.be.instanceOf(Array);
        expect(values).to.have.length(2);
    });

    it("should create css by joining values with a comma", () => {
        expect(new DesignTokenMultiValue<string>("a", "b", "c").createCSS()).to.equal("a, b, c");
    });

    it("should create css for a single value", () => {
        expect(new DesignTokenMultiValue<string>("a").createCSS()).to.equal("a");
    });

    it("should create css for an empty list", () => {
        expect(new DesignTokenMultiValue<string>().createCSS()).to.equal("");
    });

    it("should use createCSS of directive values", () => {
        const directive = { createCSS: () => "directive-value" } as any;

        expect(new DesignTokenMultiValue<any>(directive, "plain").createCSS()).to.equal("directive-value, plain");
    });

    it("should preserve the type through array operations", () => {
        const values = new DesignTokenMultiValue<string>("a", "b");

        expect(values.createCSS()).to.equal("a, b");
        const filtered = values.filter(v => v === "a");

        expect(filtered).to.be.instanceOf(DesignTokenMultiValue);
        expect((filtered as DesignTokenMultiValue<string>).createCSS()).to.equal("a");
    });
});
