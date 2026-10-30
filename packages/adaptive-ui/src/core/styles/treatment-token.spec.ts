import chai from "chai";
import { DesignToken, hex, isRef, Library, pathOf, px, refs, toCSS } from "design-token-library";
import { adaptiveConverters } from "../token-css.js";
import { getFormerNames } from "../token-metadata.js";
import { AdaptiveDesignToken, InteractiveToken } from "../token-types.js";
import { onFill } from "./on-fill.js";
import { refAt } from "../token-ref.js";
import { changeTreatment, isTreatmentRef, libraryTreatments, treatment, treatmentAt, TreatmentChanges, TreatmentToken } from "./treatment-token.js";

const { expect } = chai;

// The path of a value that is a ref; a ref read from a treatment is a new one, so it is compared by its path.
const pathOfValue = (value: unknown) => (isRef(value) ? pathOf(value) : undefined);

interface Tokens {
    fill: InteractiveToken<DesignToken.Values.Color>;
    stroke: DesignToken.Color;
    radius: DesignToken.Dimension;
    shape: { treatments: { round: TreatmentToken; square: TreatmentToken } };
    density: { treatment: { $root: TreatmentToken; tight: TreatmentToken } };
    treatments: { action: TreatmentToken; other: TreatmentToken };
}

const t = refs<Tokens>();
const create = () =>
    Library.create<Tokens>({
        fill: { $type: AdaptiveDesignToken.interactive, $value: { rest: hex("#eeeeee"), hover: hex("#dddddd") } },
        stroke: { $type: DesignToken.Type.Color, $value: hex("#000000") },
        radius: { $type: DesignToken.Type.Dimension, $value: px(4) },
        shape: {
            treatments: {
                round: treatment({ properties: { cornerRadius: t.radius } }),
                square: treatment({ properties: { cornerRadius: "0" } }),
            },
        },
        density: {
            treatment: {
                $root: treatment({ properties: { gap: "8px" } }),
                tight: treatment({ properties: { gap: "4px" } }),
            },
        },
        treatments: {
            action: treatment(
                {
                    treatments: [t.shape.treatments.round, t.density.treatment],
                    properties: { backgroundFill: t.fill, foregroundFill: onFill(t.stroke, { activeFollowsRest: true }), borderFill: { rest: t.stroke } },
                },
                { formerNames: ["styles.action"] }
            ),
            other: treatment({ properties: { opacity: 0.5 } }),
        },
    });

describe("treatment", () => {
    it("should be plain data, with the path of each ref", () => {
        expect(treatment({ treatments: [t.shape.treatments.round], properties: { backgroundFill: t.fill, opacity: 0.5 } })).to.deep.equal({
            $type: AdaptiveDesignToken.treatment,
            $value: { treatments: [{ ref: "shape.treatments.round" }], properties: { backgroundFill: { ref: "fill" }, opacity: 0.5 } },
        });
    });

    it("should keep a value on a fill and a set of states, with the paths of their refs", () => {
        expect(create().tokens.treatments.action.$value.properties).to.deep.include({
            foregroundFill: { token: { ref: "stroke" }, activeFollowsRest: true },
            borderFill: { rest: { ref: "stroke" } },
        });
    });

    it("should keep a group that stands for its root as the path of the group", () => {
        expect(create().tokens.treatments.action.$value.treatments).to.deep.equal([{ ref: "shape.treatments.round" }, { ref: "density.treatment" }]);
    });

    it("should have the metadata it is given, like the names it had", () => {
        expect(getFormerNames(create().tokens.treatments.action)).to.deep.equal(["styles.action"]);
    });

    it("should not be written to CSS", () => {
        const library = create();

        expect(toCSS(library, { converters: adaptiveConverters(library) })).to.equal("--fill:#eeeeee;--fill-hover:#dddddd;--stroke:#000000;--radius:4px;");
    });
});

describe("treatmentAt", () => {
    it("should be the treatment of a token, with refs, and the treatments it is composed of", () => {
        const action = treatmentAt(create(), "treatments.action");

        expect(action.name).to.equal("treatments.action");
        expect(action.treatments?.map(composed => composed.name)).to.deep.equal(["shape.treatments.round", "density.treatment"]);
        expect(action.treatments?.[1].properties).to.deep.equal({ gap: "8px" });
        expect(pathOfValue(action.properties?.backgroundFill)).to.deep.equal(["fill"]);
    });

    it("should read a group with a $root as its root", () => {
        expect(treatmentAt(create(), "density.treatment").properties).to.deep.equal({ gap: "8px" });
        expect(() => treatmentAt(create(), "shape.treatments")).to.throw("shape.treatments is a group without a $root");
    });

    it("should get a treatment by ref, a group standing for its root", () => {
        const treatments = libraryTreatments(create());

        expect(treatments(t.density.treatment).properties).to.deep.equal({ gap: "8px" });
        expect(treatments(t.density.treatment.tight).properties).to.deep.equal({ gap: "4px" });
    });
});

describe("isTreatmentRef", () => {
    it("should tell a ref to a treatment, or to a group whose root is one, from a ref to another token or to nothing", () => {
        const library = create();

        expect(isTreatmentRef(library, refAt(["treatments", "action"]))).to.be.true;
        expect(isTreatmentRef(library, refAt(["density", "treatment"]))).to.be.true;
        expect(isTreatmentRef(library, refAt(["stroke"]))).to.be.false;
        expect(isTreatmentRef(library, refAt(["shape", "treatments"]))).to.be.false;
        expect(isTreatmentRef(library, refAt(["missing"]))).to.be.false;
    });
});

describe("changeTreatment", () => {
    const change = (changes: TreatmentChanges) => changeTreatment(create(), t.treatments.action, changes).$value;

    it("should replace, remove, and insert, in order", () => {
        expect(
            change({
                treatments: [
                    { replace: t.shape.treatments.round, with: t.shape.treatments.square },
                    { insert: t.treatments.other, before: "start" },
                    { insert: t.density.treatment.tight, after: t.shape.treatments.square },
                    { remove: t.density.treatment },
                    { insert: t.shape.treatments.round },
                ],
            }).treatments
        ).to.deep.equal([{ ref: "treatments.other" }, { ref: "shape.treatments.square" }, { ref: "density.treatment.tight" }, { ref: "shape.treatments.round" }]);
    });

    it("should insert before a treatment, and at the end", () => {
        expect(
            change({ treatments: [{ insert: t.treatments.other, before: t.density.treatment }, { insert: t.density.treatment.tight, after: "end" }] })
                .treatments
        ).to.deep.equal([
            { ref: "shape.treatments.round" },
            { ref: "treatments.other" },
            { ref: "density.treatment" },
            { ref: "density.treatment.tight" },
        ]);
    });

    it("should find a treatment by its group or its $root, the same one", () => {
        expect(change({ treatments: [{ remove: t.density.treatment.$root }] }).treatments).to.deep.equal([{ ref: "shape.treatments.round" }]);
    });

    it("should merge the properties, where null removes one", () => {
        expect(change({ properties: { backgroundFill: t.stroke, borderFill: null, opacity: 1 } }).properties).to.deep.equal({
            backgroundFill: { ref: "stroke" },
            foregroundFill: { token: { ref: "stroke" }, activeFollowsRest: true },
            opacity: 1,
        });
    });

    it("should not replace, or insert next to, a treatment that the list doesn't have", () => {
        expect(() => change({ treatments: [{ replace: t.treatments.other, with: t.shape.treatments.square }] })).to.throw(
            "treatments.action isn't composed of treatments.other, which a step to replace names"
        );
        expect(() => change({ treatments: [{ insert: t.shape.treatments.square, after: t.treatments.other }] })).to.throw("which a step to insert names");
        expect(() => change({ treatments: [{ insert: t.shape.treatments.square, before: t.treatments.other }] })).to.throw("which a step to insert names");
    });

    it("should warn of a remove of a treatment that the list doesn't have, and go on", () => {
        const warn = console.warn;
        const warnings: unknown[] = [];
        console.warn = (...args: unknown[]) => warnings.push(args.join(" "));
        try {
            expect(change({ treatments: [{ remove: t.treatments.other }] }).treatments).to.have.length(2);
        } finally {
            console.warn = warn;
        }

        expect(warnings).to.deep.equal(["treatments.action isn't composed of treatments.other, which a step to remove names"]);
    });

    it("should be the full value for a library that extends the library, which the treatments composed of it follow", () => {
        const library = create();
        const extended = library.extend({
            shape: { treatments: { round: changeTreatment(library, t.shape.treatments.round, { properties: { cornerRadius: "8px" } }) } },
        });

        expect(extended.tokens.shape.treatments.round.$value).to.deep.equal({ properties: { cornerRadius: "8px" } });
        expect(treatmentAt(extended, "treatments.action").treatments?.[0].properties).to.deep.equal({ cornerRadius: "8px" });
        expect(pathOfValue(treatmentAt(library, "treatments.action").treatments?.[0].properties?.cornerRadius)).to.deep.equal(["radius"]);
    });
});
