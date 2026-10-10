import chai from "chai";
import { binarySearch } from "./binary-search.js";

const { expect } = chai;

describe("binarySearch", () => {
    const values = [1, 3, 5, 7, 9, 11, 13];

    it("should return the first value that satisfies a monotonic condition", () => {
        expect(binarySearch(values, v => v >= 6)).to.equal(7);
        expect(binarySearch(values, v => v >= 7)).to.equal(7);
        expect(binarySearch(values, v => v >= 1)).to.equal(1);
    });

    it("should return the last value when no value satisfies the condition", () => {
        expect(binarySearch(values, v => v > 100)).to.equal(13);
    });

    it("should only search from the start index", () => {
        // 1 satisfies the condition, but the search begins after it.
        expect(binarySearch(values, v => v >= 1, 3)).to.equal(7);
    });

    it("should not search beyond the end index", () => {
        expect(binarySearch(values, v => v > 100, 0, 3)).to.equal(7);
    });

    it("should return the value at the index when start and end are equal", () => {
        expect(binarySearch(values, () => false, 2, 2)).to.equal(5);
    });

    it("should support a single-item array", () => {
        expect(binarySearch([42], () => false)).to.equal(42);
    });

    it("should support readonly arrays", () => {
        const readonlyValues: ReadonlyArray<string> = Object.freeze(["a", "b", "c"]);
        expect(binarySearch(readonlyValues, v => v >= "b")).to.equal("b");
    });
});
