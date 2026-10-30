import chai from "chai";
import { listItemAria } from "../list-item/list-item.js";
import { listAria } from "./list.js";

const { expect } = chai;

describe("listAria and listItemAria", () => {
    it("should be a list and its items, without an orientation", () => {
        expect(listAria()).to.deep.equal({ role: "list" });
        expect(listItemAria()).to.deep.equal({ role: "listitem" });
    });
});
