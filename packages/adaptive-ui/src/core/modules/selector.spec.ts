import chai from "chai";
import { InteractiveState } from "../types.js";
import { makeSelector } from "./selector.js";
import { Interactivity } from "./types.js";

const { expect } = chai;

const { rest, hover, active, focus, disabled } = InteractiveState;

describe("makeSelector", () => {
    describe("with no configuration", () => {
        it("should target the host for every state", () => {
            [rest, hover, active, focus, disabled].forEach(state => {
                expect(makeSelector({}, state), state).to.equal(":host");
            });
        });

        it("should target the provided context", () => {
            expect(makeSelector({ context: ".control" }, rest)).to.equal(".control");
        });

        it("should treat an explicit `:host` context as the default", () => {
            expect(makeSelector({ context: ":host", interactive: ":not([disabled])" }, hover)).to.equal(
                ":host(:not([disabled]):hover)"
            );
        });
    });

    describe("with interactivity", () => {
        const params = { ...Interactivity.disabledAttribute };

        it("should not add a condition for the rest state", () => {
            expect(makeSelector(params, rest)).to.equal(":host");
        });

        it("should add the interactive condition and the default state selector", () => {
            expect(makeSelector(params, hover)).to.equal(":host(:not([disabled]):hover)");
            expect(makeSelector(params, active)).to.equal(":host(:not([disabled]):active)");
            expect(makeSelector(params, focus)).to.equal(":host(:not([disabled]):focus-visible)");
        });

        it("should add the disabled condition for the disabled state", () => {
            expect(makeSelector(params, disabled)).to.equal(":host([disabled])");
        });

        it("should support a class based disabled condition", () => {
            const classParams = { ...Interactivity.disabledClass };

            expect(makeSelector(classParams, hover)).to.equal(":host(:not(.disabled):hover)");
            expect(makeSelector(classParams, disabled)).to.equal(":host(.disabled)");
        });

        it("should only apply the state selector when always interactive", () => {
            const always = { ...Interactivity.always };

            expect(makeSelector(always, rest)).to.equal(":host");
            expect(makeSelector(always, hover)).to.equal(":host(:hover)");
            expect(makeSelector(always, focus)).to.equal(":host(:focus-visible)");
        });

        it("should not add a condition for the disabled state when not defined", () => {
            expect(makeSelector({ ...Interactivity.hrefAttribute }, disabled)).to.equal(":host");
        });

        it("should use a custom state selector", () => {
            expect(makeSelector({ ...params, hover: ":hover:not(.busy)" }, hover)).to.equal(
                ":host(:not([disabled]):hover:not(.busy))"
            );
        });

        it("should never apply the state selector to the disabled state", () => {
            expect(makeSelector({ ...params, disabled: "[disabled]", hover: ":hover" }, disabled)).to.equal(
                ":host([disabled])"
            );
        });

        it("should not add a disabled condition when the disabled selector is empty", () => {
            expect(makeSelector({ interactive: ":not(.x)", disabled: "" }, disabled)).to.equal(":host");
        });

        it("should combine the context condition with an empty disabled selector", () => {
            expect(makeSelector({ contextCondition: "[a]", disabled: "" }, disabled)).to.equal(":host([a])");
        });

        it("should not add conditions with interactivity of never", () => {
            expect(makeSelector({ ...Interactivity.never }, hover)).to.equal(":host");
        });
    });

    describe("with a context condition", () => {
        it("should add the condition to the host", () => {
            expect(makeSelector({ contextCondition: "[appearance='accent']" }, rest)).to.equal(
                ":host([appearance='accent'])"
            );
        });

        it("should combine the condition with the interactive state", () => {
            const params = { ...Interactivity.disabledAttribute, contextCondition: "[appearance='accent']" };

            expect(makeSelector(params, rest)).to.equal(":host([appearance='accent'])");
            expect(makeSelector(params, hover)).to.equal(":host([appearance='accent']:not([disabled]):hover)");
            expect(makeSelector(params, disabled)).to.equal(":host([appearance='accent'][disabled])");
        });

        it("should append the condition to a custom context", () => {
            expect(makeSelector({ context: ".control", contextCondition: "[checked]" }, rest)).to.equal(
                ".control[checked]"
            );
            expect(
                makeSelector({ ...Interactivity.always, context: ".control", contextCondition: "[checked]" }, hover)
            ).to.equal(".control[checked]:hover");
        });
    });

    describe("with a part", () => {
        it("should target the part descendant of the host", () => {
            expect(makeSelector({ part: ".control" }, rest)).to.equal(" .control");
        });

        it("should include the part condition", () => {
            expect(makeSelector({ part: ".control", partCondition: "[checked]" }, rest)).to.equal(
                " .control[checked]"
            );
        });

        it("should apply the state to the part and the interactive condition to the context", () => {
            const params = { ...Interactivity.disabledAttribute, part: ".control" };

            expect(makeSelector(params, rest)).to.equal(" .control");
            expect(makeSelector(params, hover)).to.equal(":host(:not([disabled])) .control:hover");
            expect(makeSelector(params, active)).to.equal(":host(:not([disabled])) .control:active");
            expect(makeSelector(params, focus)).to.equal(":host(:not([disabled])) .control:focus-visible");
            expect(makeSelector(params, disabled)).to.equal(":host([disabled]) .control");
        });

        it("should apply the state to the context when `stateOnContext` is set", () => {
            const params = { ...Interactivity.disabledAttribute, part: ".control", stateOnContext: true };

            expect(makeSelector(params, hover)).to.equal(":host(:not([disabled]):hover) .control");
            expect(makeSelector(params, focus)).to.equal(":host(:not([disabled]):focus-visible) .control");
            expect(makeSelector(params, rest)).to.equal(" .control");
        });

        it("should apply a part condition and state on the part", () => {
            const params = { ...Interactivity.always, part: ".control", partCondition: "[checked]" };

            // With no interactive condition there is nothing to add to the context.
            expect(makeSelector(params, rest)).to.equal(" .control[checked]");
            expect(makeSelector(params, hover)).to.equal(" .control[checked]:hover");
        });

        it("should use a custom focus selector on the part", () => {
            const params = { part: ".indicator", focus: ":focus-within" };

            expect(makeSelector(params, focus)).to.equal(" .indicator:focus-within");
        });

        it("should target all descendants with `*`", () => {
            expect(makeSelector({ part: "*" }, rest)).to.equal(" *");
            expect(makeSelector({ contextCondition: "[disabled]", part: "*" }, rest)).to.equal(":host([disabled]) *");
        });

        it("should append a pseudo element directly without a space", () => {
            expect(makeSelector({ context: ".control", part: "::before" }, rest)).to.equal(".control::before");
        });

        it("should use a custom context with a part", () => {
            expect(makeSelector({ context: ".root", part: ".label" }, rest)).to.equal(".root .label");
        });

        it("should not apply the state selector to a pseudo element or wildcard part", () => {
            const always = { ...Interactivity.always };

            expect(makeSelector({ ...always, context: ".control", part: "::after" }, hover)).to.equal(".control::after");
            expect(makeSelector({ ...always, part: "*" }, hover)).to.equal(" *");
        });

        it("should apply the interactive condition to the context for a pseudo element part", () => {
            const params = { ...Interactivity.disabledAttribute, part: "::after" };

            expect(makeSelector(params, hover)).to.equal(":host(:not([disabled]))::after");
        });
    });
});
