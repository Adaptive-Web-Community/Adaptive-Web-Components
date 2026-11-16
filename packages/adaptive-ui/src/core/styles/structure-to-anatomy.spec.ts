import chai from "chai";
import { ContractPropertyKind, type Documentation, structureParts } from "../documentation/index.js";
import { Focus, Interactivity } from "./anatomy.js";
import type { PlatformBinding } from "./binding.js";
import { documentationToComponentAnatomy, structureToComponentAnatomy } from "./structure-to-anatomy.js";

const { expect } = chai;

const buttonDoc = {
    id: "button",
    structure: {
        parts: {
            control: {
                interactive: true,
            },
            content: {},
        },
    },
    contract: {
        properties: [
            { id: "iconOnly", kind: ContractPropertyKind.boolean },
        ],
        slots: [],
    },
} satisfies Documentation;

const buttonBinding = {
    conditionSelectors: {
        iconOnly: ".icon-only",
    },
    partSelectors: {
        control: ".control",
        content: ".content",
    },
    interactivity: Interactivity.disabledAttribute,
    focus: Focus.partFocused("control"),
} as const satisfies PlatformBinding;

const expectedButtonAnatomy = {
    name: "Button",
    interactivity: Interactivity.disabledAttribute,
    conditions: buttonBinding.conditionSelectors,
    parts: buttonBinding.partSelectors,
    focus: { focusTarget: { part: ".control", ignoreInteractivity: true } },
};

const textFieldStructure = {
    parts: {
        label: {},
        root: { indicatesFocus: true },
        control: {
            interactive: true,
        },
    },
};

const textFieldConditionSelectors = {} as const;
const textFieldPartSelectors = {
    label: ".label",
    root: ".root",
    control: ".control",
} as const;

const textFieldBinding: PlatformBinding<typeof textFieldConditionSelectors, typeof textFieldPartSelectors> = {
    conditionSelectors: textFieldConditionSelectors,
    partSelectors: textFieldPartSelectors,
    focus: Focus.partWithin<typeof textFieldStructure.parts>("root", "control"),
    cursor: { part: "control", cursorType: "text" },
};

describe("structureToComponentAnatomy", () => {
    it("should set anatomy name from documentation name", () => {
        const anatomy = documentationToComponentAnatomy(buttonDoc, buttonBinding);

        expect(anatomy.name).to.equal("Button");
    });

    it("should match a button-like profile when structure and binding align", () => {
        const anatomy = structureToComponentAnatomy(
            buttonDoc.structure,
            buttonBinding,
            "Button",
        );

        expect(anatomy).to.deep.equal(expectedButtonAnatomy);
    });

    it("should resolve the part ids of the binding's focus to selectors", () => {
        const anatomy = structureToComponentAnatomy(textFieldStructure, textFieldBinding);

        expect(anatomy.focus).to.deep.equal({
            focusTarget: { part: ".root", focus: ":focus-within", ignoreInteractivity: true },
            resetTarget: { part: ".control", ignoreInteractivity: true },
        });
    });

    it("should derive the focus from the part that indicates focus when the binding has none", () => {
        const anatomy = structureToComponentAnatomy(textFieldStructure, {
            conditionSelectors: textFieldConditionSelectors,
            partSelectors: textFieldPartSelectors,
        });

        expect(anatomy.focus).to.deep.equal({ focusTarget: { part: ".root", ignoreInteractivity: true } });
    });

    it("should put the focus on the context when the context indicates focus", () => {
        const anatomy = structureToComponentAnatomy(
            { indicatesFocus: true, parts: { content: {} } },
            { conditionSelectors: {}, partSelectors: { content: ".content" } },
        );

        expect(anatomy.focus).to.deep.equal(Focus.contextFocused());
    });

    it("should find the parts nested in other parts", () => {
        const structure = { parts: { root: { parts: { control: { parts: { expand: { interactive: true } } } } } } };

        expect(() => structureToComponentAnatomy(structure, { conditionSelectors: {}, partSelectors: { root: ".root", control: ".control" } }))
            .to.throw('Structure part "expand" has no selector in the platform binding.');
    });

    it("should throw for a part id that is used twice in the tree", () => {
        expect(() => structureParts({ parts: { a: { parts: { b: {} } }, b: {} } })).to.throw('Structure part "b" is used more than once');
    });

    it("should use the first part that indicates focus and warn about the others", () => {
        const warnings: string[] = [];
        const warn = console.warn;
        console.warn = (message: string) => warnings.push(message);
        try {
            const anatomy = structureToComponentAnatomy(
                { parts: { up: { indicatesFocus: true }, down: { indicatesFocus: true } } },
                { conditionSelectors: {}, partSelectors: { up: ".up", down: ".down" } },
            );

            expect(anatomy.focus).to.deep.equal({ focusTarget: { part: ".up", ignoreInteractivity: true } });
            expect(warnings).to.have.length(1);
            expect(warnings[0]).to.contain('"down"');
        } finally {
            console.warn = warn;
        }
    });

    it("should resolve the part id of the binding's cursor to a selector", () => {
        const anatomy = structureToComponentAnatomy(textFieldStructure, textFieldBinding);

        expect(anatomy.cursor).to.deep.equal({ part: ".control", cursorType: "text" });
    });

    it("should keep a cursor of false", () => {
        const anatomy = structureToComponentAnatomy(textFieldStructure, { ...textFieldBinding, cursor: false });

        expect(anatomy.cursor).to.equal(false);
    });

    it("should leave out interactivity, focus, and cursor that the binding doesn't have", () => {
        const anatomy = structureToComponentAnatomy({ parts: { label: {}, root: {}, control: {} } }, {
            conditionSelectors: textFieldConditionSelectors,
            partSelectors: textFieldPartSelectors,
        });

        expect(anatomy).to.deep.equal({ conditions: textFieldConditionSelectors, parts: textFieldPartSelectors });
    });

    it("should throw when a part of the binding's focus has no selector", () => {
        expect(() =>
            structureToComponentAnatomy(textFieldStructure, {
                ...textFieldBinding,
                focus: { focusTarget: { part: "missing" } },
            }),
        ).to.throw('Binding focus target part "missing" has no selector in the platform binding.');
    });

    it("should throw when structure ids are missing from binding", () => {
        expect(() =>
            structureToComponentAnatomy(
                {
                    ...buttonDoc.structure,
                    parts: {
                        ...buttonDoc.structure.parts,
                        missing: {},
                    },
                },
                buttonBinding,
            ),
        ).to.throw('Structure part "missing" has no selector in the platform binding.');
    });

    it("should throw when contract properties are missing from binding conditions", () => {
        expect(() =>
            documentationToComponentAnatomy(
                buttonDoc,
                { ...buttonBinding, conditionSelectors: {} },
            ),
        ).to.throw('Contract property "iconOnly" has no condition selector in the platform binding.');
    });
});
