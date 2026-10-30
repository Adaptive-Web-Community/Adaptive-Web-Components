import chai from "chai";
import { type ButtonElement, ButtonType } from "./button.js";
import { ButtonController } from "./button.controller.js";

const { expect } = chai;

class TestButton extends HTMLElement implements ButtonElement {
    public hideLabel = false;
    public disabled = false;
    public type: ButtonType = ButtonType.button;
    public name: string | null = null;
    public value: string | null = null;
    public formAction: string | null = null;
    public formEnctype: string | null = null;
    public formMethod: string | null = null;
    public formNoValidate = false;
    public formTarget: string | null = null;
    public readonly form: HTMLFormElement | null = null;
    public readonly labels: NodeList = document.createDocumentFragment().childNodes;
    public commandForElement: Element | null = null;
    public command: string | null = null;
}
customElements.define("test-button", TestButton);

function setup(type: ButtonType = ButtonType.button) {
    const form = document.createElement("form");
    const host = form.appendChild(new TestButton());
    host.type = type;
    document.body.append(form);
    const internals = { role: null as string | null, ariaExpanded: null as string | null, form: form as HTMLFormElement | null, states: new Set<string>() };
    const controller = new ButtonController(host, internals);
    controller.connect();
    return { form, host, internals, controller };
}

function key(target: Element, type: "keydown" | "keyup", key: string): KeyboardEvent {
    const event = new KeyboardEvent(type, { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
}

function countClicks(host: HTMLElement): { count: number } {
    const clicks = { count: 0 };
    host.addEventListener("click", () => clicks.count++);
    return clicks;
}

describe("ButtonController", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("should give the element the button role", () => {
        const { internals } = setup();

        expect(internals.role).to.equal("button");
    });

    it("should make the element focusable", () => {
        const { host } = setup();

        expect(host.getAttribute("tabindex")).to.equal("0");
    });

    it("should keep the tabindex of the author", () => {
        const host = new TestButton();
        host.setAttribute("tabindex", "-1");

        new ButtonController(host, { role: null, ariaExpanded: null, form: null, states: new Set() }).connect();

        expect(host.getAttribute("tabindex")).to.equal("-1");
    });

    describe("keyboard", () => {
        it("should click when Enter is pressed", () => {
            const { host } = setup();
            const clicks = countClicks(host);

            key(host, "keydown", "Enter");

            expect(clicks.count).to.equal(1);
        });

        it("should click when Space is released, and be active while it is held", () => {
            const { host, internals } = setup();
            const clicks = countClicks(host);

            const down = key(host, "keydown", " ");
            expect(down.defaultPrevented).to.be.true;
            expect(internals.states.has("active")).to.be.true;
            expect(clicks.count).to.equal(0);

            key(host, "keyup", " ");
            expect(internals.states.has("active")).to.be.false;
            expect(clicks.count).to.equal(1);
        });

        it("should not click when the focus leaves while Space is held", () => {
            const { host, internals } = setup();
            const clicks = countClicks(host);

            key(host, "keydown", " ");
            host.dispatchEvent(new Event("blur"));
            key(host, "keyup", " ");

            expect(internals.states.has("active")).to.be.false;
            expect(clicks.count).to.equal(0);
        });

        it("should ignore a key in the content", () => {
            const { host } = setup();
            const clicks = countClicks(host);
            const content = host.appendChild(document.createElement("span"));

            key(content, "keydown", "Enter");

            expect(clicks.count).to.equal(0);
        });

        it("should ignore a key that was handled already", () => {
            const { host } = setup();
            const clicks = countClicks(host);
            host.addEventListener("keydown", event => event.preventDefault(), { capture: true });

            key(host, "keydown", "Enter");

            expect(clicks.count).to.equal(0);
        });
    });

    describe("form", () => {
        it("should submit the form when its type is submit", () => {
            const { form, host } = setup(ButtonType.submit);
            let submits = 0;
            form.addEventListener("submit", event => {
                submits++;
                event.preventDefault();
            });

            host.click();

            expect(submits).to.equal(1);
        });

        it("should submit with a submitter that has the name, the value, and the overrides", () => {
            const { form, host } = setup(ButtonType.submit);
            host.name = "action";
            host.value = "save";
            host.formAction = "/save";
            host.formMethod = "post";
            host.formNoValidate = true;
            let submitter: HTMLButtonElement | null = null;
            form.addEventListener("submit", event => {
                submitter = form.querySelector("button");
                event.preventDefault();
            });

            host.click();

            expect(submitter).to.not.be.null;
            const { type, hidden, name, value, formNoValidate } = submitter!;
            expect({ type, hidden, name, value, formNoValidate }).to.deep.equal({
                type: "submit",
                hidden: true,
                name: "action",
                value: "save",
                formNoValidate: true,
            });
            expect(submitter!.getAttribute("formaction")).to.equal("/save");
            expect(submitter!.getAttribute("formmethod")).to.equal("post");
            expect(submitter!.hasAttribute("formenctype")).to.be.false;
            expect(form.querySelector("button")).to.be.null;
        });

        it("should reset the form when its type is reset", () => {
            const { form, host } = setup(ButtonType.reset);
            let resets = 0;
            form.addEventListener("reset", () => resets++);

            host.click();

            expect(resets).to.equal(1);
        });

        it("should do nothing in the form when its type is button", () => {
            const { form, host } = setup(ButtonType.button);
            let events = 0;
            form.addEventListener("submit", event => {
                events++;
                event.preventDefault();
            });
            form.addEventListener("reset", () => events++);

            host.click();

            expect(events).to.equal(0);
        });

        it("should not submit when the click was cancelled", () => {
            const { form, host } = setup(ButtonType.submit);
            let submits = 0;
            form.addEventListener("submit", event => {
                submits++;
                event.preventDefault();
            });
            document.addEventListener("click", event => event.preventDefault(), { capture: true, once: true });

            host.click();

            expect(submits).to.equal(0);
        });

        it("should do nothing without a form", () => {
            const host = document.body.appendChild(new TestButton());
            host.type = ButtonType.submit;
            new ButtonController(host, { role: null, ariaExpanded: null, form: null, states: new Set() }).connect();

            expect(() => host.click()).to.not.throw();
        });

        it("should invoke its command as a button, and not as a submit button", () => {
            const { form, host } = setup(ButtonType.button);
            const target = form.appendChild(document.createElement("div"));
            const commands: string[] = [];
            target.addEventListener("command", event => commands.push((event as CommandEvent).command));
            host.commandForElement = target;
            host.command = "--open";

            host.click();
            host.type = ButtonType.submit;
            form.addEventListener("submit", event => event.preventDefault());
            host.click();

            expect(commands).to.deep.equal(["--open"]);
        });

        it("should stop handling clicks when disconnected", () => {
            const { form, host, controller } = setup(ButtonType.reset);
            let resets = 0;
            form.addEventListener("reset", () => resets++);

            controller.disconnect();
            host.click();

            expect(resets).to.equal(0);
        });
    });
});
