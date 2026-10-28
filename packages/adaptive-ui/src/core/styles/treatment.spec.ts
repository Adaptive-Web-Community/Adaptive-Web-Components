import chai from "chai";
import { DesignToken, refs } from "design-token-library";
import { Treatment, treatmentProperties } from "./treatment.js";

const { expect } = chai;

const tokens = refs<{ radius: DesignToken.Dimension }>();

describe("treatmentProperties", () => {
    it("should be the properties of the treatment", () => {
        const treatment: Treatment = { properties: { opacity: "0.5", cursor: "pointer" } };

        expect([...treatmentProperties(treatment)]).to.deep.equal([["opacity", "0.5"], ["cursor", "pointer"]]);
    });

    it("should keep a ref to a token as it is", () => {
        const properties = treatmentProperties({ properties: { cornerRadiusTopLeft: tokens.radius } });

        expect(properties.get("cornerRadiusTopLeft")).to.equal(tokens.radius);
    });

    it("should leave out undefined, null, and empty values", () => {
        const properties = treatmentProperties({ properties: { opacity: undefined, cursor: null as unknown as string, gap: "" } });

        expect(properties.size).to.equal(0);
    });

    it("should keep a value of zero", () => {
        const properties = treatmentProperties({ properties: { opacity: 0 } });

        expect(properties.get("opacity")).to.equal(0);
    });

    it("should expand a shorthand into the properties it is for", () => {
        const properties = treatmentProperties({ properties: { padding: "4px", cornerRadius: "2px" } });

        expect(properties.has("padding")).to.be.false;
        expect(properties.get("paddingTop")).to.equal("4px");
        expect(properties.get("paddingLeft")).to.equal("4px");
        expect(properties.get("cornerRadiusTopLeft")).to.equal("2px");
        expect(properties.get("cornerRadiusBottomLeft")).to.equal("2px");
        expect(properties.size).to.equal(8);
    });

    it("should expand a directional shorthand", () => {
        const properties = treatmentProperties({ properties: { paddingHorizontal: "8px" } });

        expect([...properties.keys()]).to.deep.equal(["paddingRight", "paddingLeft"]);
    });

    it("should apply a later property over an earlier shorthand", () => {
        const properties = treatmentProperties({ properties: { padding: "4px", paddingLeft: "8px" } });

        expect(properties.get("paddingTop")).to.equal("4px");
        expect(properties.get("paddingLeft")).to.equal("8px");
    });

    it("should not treat another CSS property, or a name of the object prototype, as a shorthand", () => {
        const properties = treatmentProperties({ properties: { "--custom": "1", toString: "2" } });

        expect([...properties]).to.deep.equal([["--custom", "1"], ["toString", "2"]]);
    });

    it("should combine the properties of the treatments it is composed of", () => {
        const a: Treatment = { properties: { cursor: "pointer" } };
        const b: Treatment = { properties: { opacity: "0.5" } };

        expect([...treatmentProperties({ treatments: [a, b] })]).to.deep.equal([["cursor", "pointer"], ["opacity", "0.5"]]);
    });

    it("should apply a later treatment over an earlier one", () => {
        const a: Treatment = { properties: { cursor: "pointer", opacity: "1" } };
        const b: Treatment = { properties: { cursor: "default" } };
        const properties = treatmentProperties({ treatments: [a, b] });

        expect(properties.get("cursor")).to.equal("default");
        expect(properties.get("opacity")).to.equal("1");
    });

    it("should apply its own properties after those of its treatments", () => {
        const a: Treatment = { properties: { cursor: "pointer" } };
        const properties = treatmentProperties({ treatments: [a], properties: { cursor: "default", opacity: "0.5" } });

        expect(properties.get("cursor")).to.equal("default");
        expect(properties.get("opacity")).to.equal("0.5");
    });

    it("should apply a shorthand of a later treatment over the longhand of an earlier one", () => {
        const a: Treatment = { properties: { paddingTop: "1px" } };
        const b: Treatment = { properties: { padding: "4px" } };

        expect(treatmentProperties({ treatments: [a, b] }).get("paddingTop")).to.equal("4px");
    });

    it("should include the treatments of a treatment it is composed of", () => {
        const shape: Treatment = { name: "shape", properties: { cornerRadius: tokens.radius } };
        const control: Treatment = { name: "control", treatments: [shape], properties: { cursor: "pointer" } };
        const properties = treatmentProperties({ treatments: [control] });

        expect(properties.get("cornerRadiusTopLeft")).to.equal(tokens.radius);
        expect(properties.get("cursor")).to.equal("pointer");
    });
});
