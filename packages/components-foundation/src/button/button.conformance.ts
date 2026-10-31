import { afterEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { accessibilityNodeOf } from "../conformance/accessibility.js";
import { cleanupFixtures, fixture, query } from "../conformance/fixture.js";
import { ButtonType } from "./button.js";

/**
 * Tests that the element of a tag is a {@link ButtonElement} with the behavior of {@link ButtonController}, as the browser exposes it.
 *
 * @param tag - The name of the element.
 *
 * @public
 */
export function buttonConformance(tag: string): void {
    describe(`${tag} as a button`, () => {
        afterEach(cleanupFixtures);

        const button = (attributes = "", content = "Save") => `<${tag} ${attributes}>${content}</${tag}>`;

        function countClicks(element: HTMLElement): { readonly count: number } {
            const clicks = { count: 0 };
            element.addEventListener("click", () => clicks.count++);
            return clicks;
        }

        function submissions(form: HTMLFormElement): FormData[] {
            const submitted: FormData[] = [];
            form.addEventListener("submit", event => {
                event.preventDefault();
                submitted.push(new FormData(form, event.submitter));
            });
            return submitted;
        }

        it("is a button named by its content", async () => {
            const node = await accessibilityNodeOf(await fixture(button()));

            expect(node.role).toBe("button");
            expect(node.name).toBe("Save");
        });

        it("is named by its content when the label is hidden", async () => {
            const element = await fixture(button("hide-label", `<svg slot="start" aria-hidden="true"></svg>Save`));

            expect((await accessibilityNodeOf(element)).name).toBe("Save");
        });

        it("is named by the author's aria-label", async () => {
            const element = await fixture(button(`aria-label="Save the file"`));

            expect((await accessibilityNodeOf(element)).name).toBe("Save the file");
        });

        it("is in the tab order", async () => {
            const element = await fixture(button());
            await userEvent.tab();

            expect(document.activeElement).toBe(element);
        });

        it("keeps the author's tabindex", async () => {
            const element = await fixture(button(`tabindex="-1"`));

            expect(element.tabIndex).toBe(-1);
        });

        it("clicks when Enter is pressed", async () => {
            const element = await fixture(button());
            const clicks = countClicks(element);
            element.focus();
            await userEvent.keyboard("{Enter}");

            expect(clicks.count).toBe(1);
        });

        it("clicks when Space is released, and is active while it is held", async () => {
            const element = await fixture(button());
            const clicks = countClicks(element);
            element.focus();

            await userEvent.keyboard("[Space>]");
            expect(clicks.count).toBe(0);
            expect(element.matches(":state(active)")).toBe(true);

            await userEvent.keyboard("[/Space]");
            expect(clicks.count).toBe(1);
            expect(element.matches(":state(active)")).toBe(false);
        });

        it("doesn't submit its form by default", async () => {
            const form = await fixture(`<form>${button()}</form>`, HTMLFormElement);
            const submitted = submissions(form);
            query(form, tag).click();

            expect(submitted).toHaveLength(0);
        });

        it("submits its form with its name and value", async () => {
            const form = await fixture(`<form>${button(`type="${ButtonType.submit}" name="action" value="save"`)}</form>`, HTMLFormElement);
            const submitted = submissions(form);
            query(form, tag).click();

            expect(submitted).toHaveLength(1);
            expect(submitted[0].get("action")).toBe("save");
        });

        it("resets its form", async () => {
            const form = await fixture(`<form><input name="text" value="initial">${button(`type="${ButtonType.reset}"`)}</form>`, HTMLFormElement);
            const input = query(form, "input");
            if (input instanceof HTMLInputElement) {
                input.value = "changed";
            }
            query(form, tag).click();

            expect(new FormData(form).get("text")).toBe("initial");
        });

        it("is disabled by its disabled attribute", async () => {
            const element = await fixture(button("disabled"));
            element.focus();

            expect((await accessibilityNodeOf(element)).properties.disabled).toBe(true);
            expect(element.matches(":disabled")).toBe(true);
            expect(document.activeElement).not.toBe(element);
        });

        it("is disabled by a disabled fieldset", async () => {
            const fieldset = await fixture(`<fieldset disabled>${button()}</fieldset>`);

            expect((await accessibilityNodeOf(query(fieldset, tag))).properties.disabled).toBe(true);
        });

        it("doesn't submit its form when disabled", async () => {
            const form = await fixture(`<form>${button(`type="${ButtonType.submit}" disabled`)}</form>`, HTMLFormElement);
            const submitted = submissions(form);
            query(form, tag).click();

            expect(submitted).toHaveLength(0);
        });
    });
}
