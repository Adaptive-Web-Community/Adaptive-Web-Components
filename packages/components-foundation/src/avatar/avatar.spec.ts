import chai from "chai";
import { avatarAria, type AvatarElement } from "./avatar.js";

const { expect } = chai;

class TestAvatar extends HTMLElement implements AvatarElement {
    public name: string | null = null;
}
customElements.define("test-avatar", TestAvatar);

describe("avatarAria", () => {
    it("should be an image named by the name", () => {
        const avatar = new TestAvatar();
        avatar.name = "Ada Lovelace";

        expect(avatarAria(avatar)).to.deep.equal({ role: "img", ariaLabel: "Ada Lovelace" });
    });

    it("should clear the name when there is none", () => {
        expect(avatarAria(new TestAvatar())).to.deep.equal({ role: "img", ariaLabel: null });
    });
});
