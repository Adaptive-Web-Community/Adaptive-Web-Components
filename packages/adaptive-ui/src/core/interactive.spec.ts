import chai from "chai";
import { InteractiveSet, mapStates } from "./interactive.js";

const { expect } = chai;

describe("mapStates", () => {
    const double = (value: number) => value * 2;

    it("should map the states that have a value, and only those", () => {
        const set: InteractiveSet<number> = { rest: 1, focus: 3 };
        const result = mapStates(set, double);

        expect(result).to.deep.equal({ rest: 2, focus: 6 });
        expect(Object.keys(result)).to.deep.equal(["rest", "focus"]);
    });

    it("should keep a state that is null, without mapping it", () => {
        expect(mapStates({ rest: 1, hover: null }, double)).to.deep.equal({ rest: 2, hover: null });
    });

    it("should not have a state that is undefined, so it leaves a state that it is spread over", () => {
        const base = { rest: 1, hover: 2 };

        expect({ ...base, ...mapStates({ rest: 3, hover: undefined }, double) }).to.deep.equal({ rest: 6, hover: 2 });
        expect({ ...base, ...mapStates({ hover: null }, double) }).to.deep.equal({ rest: 1, hover: null });
    });

    it("should give the state to the map", () => {
        expect(mapStates({ hover: 1, disabled: 2 }, (value, state) => `${state}:${value}`)).to.deep.equal({ hover: "hover:1", disabled: "disabled:2" });
    });
});
