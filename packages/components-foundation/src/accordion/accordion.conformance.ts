import { afterEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { AccordionItemParts } from "../accordion-item/accordion-item.js";
import { accessibilityNodeOf } from "../conformance/accessibility.js";
import { cleanupFixtures, fixture, nextFrame, partOf, queryAll } from "../conformance/fixture.js";
import { AccordionExpandMode } from "./accordion.js";

/**
 * The names of the elements of an accordion.
 *
 * @public
 */
export interface AccordionTags {
    /** The name of the {@link AccordionElement}. */
    readonly accordion: string;

    /** The name of the {@link AccordionItemElement}. */
    readonly item: string;
}

/**
 * Tests that the elements of the tags are an {@link AccordionElement} and its {@link AccordionItemElement}s with the behavior of
 * {@link AccordionController} and {@link toggleAccordionItem}, as the browser exposes it.
 *
 * @remarks
 * The parts are read from the items' shadow roots, which are open.
 *
 * @public
 */
export function accordionConformance(tags: AccordionTags): void {
    const item = (attributes = "", heading = "Heading") =>
        `<${tags.item} ${attributes}><span slot="heading">${heading}</span>Content</${tags.item}>`;
    const accordion = (attributes: string, ...items: string[]) => `<${tags.accordion} ${attributes}>${items.join("")}</${tags.accordion}>`;

    describe(`${tags.item} as an accordion item`, () => {
        afterEach(cleanupFixtures);

        it("has a heading at its level, 2 by default", async () => {
            const element = await fixture(item());
            const heading = await accessibilityNodeOf(partOf(element, AccordionItemParts.heading));

            expect(heading.role).toBe("heading");
            expect(heading.properties.level).toBe(2);

            element.setAttribute("heading-level", "4");
            await nextFrame();
            expect((await accessibilityNodeOf(partOf(element, AccordionItemParts.heading))).properties.level).toBe(4);
        });

        it("has a collapsed button named by the heading, and a hidden panel", async () => {
            const element = await fixture(item());
            const button = await accessibilityNodeOf(partOf(element, AccordionItemParts.button));

            expect(button.role).toBe("button");
            expect(button.name).toBe("Heading");
            expect(button.properties.expanded).toBe(false);
            expect((await accessibilityNodeOf(partOf(element, AccordionItemParts.panel))).ignored).toBe(true);
        });

        it("has an expanded button that controls a region named by the button", async () => {
            const element = await fixture(item("expanded"));
            const button = await accessibilityNodeOf(partOf(element, AccordionItemParts.button));
            const panel = await accessibilityNodeOf(partOf(element, AccordionItemParts.panel));

            expect(button.properties.expanded).toBe(true);
            expect(button.relations.controls).toEqual([panel.id]);
            expect(panel.role).toBe("region");
            expect(panel.name).toBe("Heading");
        });

        it("expands and collapses when its button is clicked, with a change event", async () => {
            const element = await fixture(item());
            let changes = 0;
            element.addEventListener("change", () => changes++);

            await userEvent.click(partOf(element, AccordionItemParts.button));
            await nextFrame();
            expect(changes).toBe(1);
            expect(element.hasAttribute("expanded")).toBe(true);
            expect((await accessibilityNodeOf(partOf(element, AccordionItemParts.panel))).ignored).toBe(false);

            await userEvent.click(partOf(element, AccordionItemParts.button));
            await nextFrame();
            expect(changes).toBe(2);
            expect(element.hasAttribute("expanded")).toBe(false);
            expect((await accessibilityNodeOf(partOf(element, AccordionItemParts.panel))).ignored).toBe(true);
        });

        it("has a disabled button when it is disabled, which doesn't expand it", async () => {
            const element = await fixture(item("disabled"));
            const button = partOf(element, AccordionItemParts.button);
            button.click();
            await nextFrame();

            expect((await accessibilityNodeOf(button)).properties.disabled).toBe(true);
            expect(element.hasAttribute("expanded")).toBe(false);
        });

        it("focuses its button when it is focused", async () => {
            const element = await fixture(item());
            element.focus();

            expect(element.shadowRoot?.activeElement).toBe(partOf(element, AccordionItemParts.button));
        });
    });

    describe(`${tags.accordion} as an accordion`, () => {
        afterEach(cleanupFixtures);

        it("moves the focus between the items with the arrow keys, wrapping, and to the first and last with Home and End", async () => {
            const element = await fixture(accordion("", item(), item("disabled"), item(), item()));
            const items = queryAll(element, tags.item);
            items[0].focus();

            await userEvent.keyboard("{ArrowDown}");
            expect(document.activeElement).toBe(items[2]);
            await userEvent.keyboard("{ArrowUp}");
            expect(document.activeElement).toBe(items[0]);
            await userEvent.keyboard("{ArrowUp}");
            expect(document.activeElement).toBe(items[3]);
            await userEvent.keyboard("{ArrowDown}");
            expect(document.activeElement).toBe(items[0]);
            await userEvent.keyboard("{End}");
            expect(document.activeElement).toBe(items[3]);
            await userEvent.keyboard("{Home}");
            expect(document.activeElement).toBe(items[0]);
        });

        it("expands items independently in the multi mode, by default", async () => {
            const element = await fixture(accordion("", item(), item()));
            const items = queryAll(element, tags.item);

            await userEvent.click(partOf(items[0], AccordionItemParts.button));
            await userEvent.click(partOf(items[1], AccordionItemParts.button));
            await nextFrame();

            expect(items.map(i => i.hasAttribute("expanded"))).toEqual([true, true]);
        });

        it("keeps one item expanded in the single mode, the first by default, and its button can't collapse it", async () => {
            const element = await fixture(accordion(`expand-mode="${AccordionExpandMode.single}"`, item(), item()));
            const items = queryAll(element, tags.item);

            expect(items.map(i => i.hasAttribute("expanded"))).toEqual([true, false]);
            expect((await accessibilityNodeOf(partOf(items[0], AccordionItemParts.button))).properties.disabled).toBe(true);

            await userEvent.click(partOf(items[1], AccordionItemParts.button));
            await nextFrame();

            expect(items.map(i => i.hasAttribute("expanded"))).toEqual([false, true]);
            expect((await accessibilityNodeOf(partOf(items[0], AccordionItemParts.button))).properties.disabled).toBeUndefined();
            expect((await accessibilityNodeOf(partOf(items[1], AccordionItemParts.button))).properties.disabled).toBe(true);
        });
    });
}
