import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { SearchParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import type { Search } from "./search.js";

/**
 * @public
 */
export const SearchConditions = {
};

export { SearchParts };

/**
 * @public
 */
export const SearchAnatomy: ComponentAnatomy<typeof SearchConditions, typeof SearchParts> = {
    interactivity: controlInteractivity,
    conditions: SearchConditions,
    parts: SearchParts,
    focus: Focus.partWithin("root", "control"),
};

/**
 * Default Search template: the label, the native `<input type="search">`, whose attributes the element's controller writes, and the clear
 * button, which is for the pointer: Escape clears a search field.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Search> =
    (ds: DesignSystem) => html<Search>`
        <label class="label" part="label" for="control" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name="label" ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </label>
        <div class="root" part="root">
            <slot name="start"></slot>
            <div class="input-wrapper" part="input-wrapper">
                <input class="control" part="control" id="control" ${ref("control")} />
                <button
                    class="clear-button"
                    part="clear-button"
                    type="button"
                    tabindex="-1"
                    aria-hidden="true"
                    ?hidden="${x => !x.value || x.readOnly}"
                    @click="${x => x.clear()}"
                >
                    <slot name="clear-glyph">
                        <svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.146447 0.146447C0.338683 -0.0478972 0.645911 -0.0270359 0.853553 0.146447L4.5 3.793L8.14645 0.146447C8.34171 -0.0488155 8.65829 -0.0488155 8.85355 0.146447C9.04882 0.341709 9.04882 0.658291 8.85355 0.853553L5.207 4.5L8.85355 8.14645C9.05934 8.35223 9.03129 8.67582 8.85355 8.85355C8.67582 9.03129 8.35409 9.02703 8.14645 8.85355L4.5 5.207L0.853553 8.85355C0.658291 9.04882 0.341709 9.04882 0.146447 8.85355C-0.0488155 8.65829 -0.0488155 8.34171 0.146447 8.14645L3.793 4.5L0.146447 0.853553C-0.0268697 0.680237 -0.0457894 0.34079 0.146447 0.146447Z"
                            />
                        </svg>
                    </slot>
                </button>
            </div>
            <slot name="end"></slot>
        </div>
    `;
