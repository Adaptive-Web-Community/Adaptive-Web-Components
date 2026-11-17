import chai from "chai";
import { type Contract, ContractPropertyKind, isConditionProperty, resolveContract } from "./contract.js";

const { expect } = chai;

const textInput = {
    id: "textInput",
    contract: {
        properties: [
            { id: "disabled", kind: ContractPropertyKind.boolean, description: "Whether it is disabled." },
            { id: "name", kind: ContractPropertyKind.string, nullable: true, description: "The name in the form data." },
        ],
        slots: [{ id: "label", description: "The label." }],
    },
} as const;

describe("resolveContract", () => {
    it("should return the own properties and slots of a contract without includes", () => {
        const contract: Contract = { properties: [{ id: "a", kind: ContractPropertyKind.boolean }], slots: [] };

        expect(resolveContract(contract).properties.map(property => property.id)).to.deep.equal(["a"]);
    });

    it("should put what is included before the own properties and slots", () => {
        const resolved = resolveContract({
            include: [textInput],
            properties: [{ id: "type", kind: ContractPropertyKind.string }],
            slots: [{ id: "start" }],
        });

        expect(resolved.properties.map(property => property.id)).to.deep.equal(["disabled", "name", "type"]);
        expect(resolved.slots.map(slot => slot.id)).to.deep.equal(["label", "start"]);
    });

    it("should include what an included contract includes", () => {
        const search = {
            id: "search",
            contract: { include: [textInput], properties: [{ id: "clearable", kind: ContractPropertyKind.boolean }], slots: [] },
        };

        const resolved = resolveContract({ include: [search], properties: [], slots: [] });

        expect(resolved.properties.map(property => property.id)).to.deep.equal(["disabled", "name", "clearable"]);
    });

    it("should let an own property change the text of an included one, in its place", () => {
        const resolved = resolveContract({
            include: [textInput],
            properties: [{ id: "disabled", kind: ContractPropertyKind.boolean, description: "Disabled in a search." }],
            slots: [],
        });

        expect(resolved.properties.map(property => property.id)).to.deep.equal(["disabled", "name"]);
        expect(resolved.properties[0].description).to.equal("Disabled in a search.");
    });

    it("should throw when an own property changes the kind of an included one", () => {
        expect(() =>
            resolveContract({
                include: [textInput],
                properties: [{ id: "disabled", kind: ContractPropertyKind.string }],
                slots: [],
            }),
        ).to.throw('Contract property "disabled" overrides the included one');
    });

    it("should throw when an own property changes the nullability of an included one", () => {
        expect(() =>
            resolveContract({
                include: [textInput],
                properties: [{ id: "name", kind: ContractPropertyKind.string }],
                slots: [],
            }),
        ).to.throw('Contract property "name" overrides the included one');
    });

    it("should throw when an own property changes whether an included one is a condition", () => {
        expect(() =>
            resolveContract({
                include: [textInput],
                properties: [{ id: "disabled", kind: ContractPropertyKind.boolean, condition: false }],
                slots: [],
            }),
        ).to.throw('Contract property "disabled" overrides the included one');
    });
});

describe("isConditionProperty", () => {
    it("should be a condition for a boolean or an enumerated property", () => {
        expect(isConditionProperty({ id: "checked", kind: ContractPropertyKind.boolean })).to.equal(true);
        expect(isConditionProperty({ id: "orientation", kind: ContractPropertyKind.enum, enumValues: [{ id: "vertical" }] })).to.equal(true);
    });

    it("should not be a condition for a string, a number, or an object property", () => {
        expect(isConditionProperty({ id: "label", kind: ContractPropertyKind.string })).to.equal(false);
        expect(isConditionProperty({ id: "maxLength", kind: ContractPropertyKind.number })).to.equal(false);
        expect(isConditionProperty({ id: "range", kind: ContractPropertyKind.object })).to.equal(false);
    });

    it("should not be a condition for a property with condition false", () => {
        expect(isConditionProperty({ id: "defaultPressed", kind: ContractPropertyKind.boolean, condition: false })).to.equal(false);
    });
});
