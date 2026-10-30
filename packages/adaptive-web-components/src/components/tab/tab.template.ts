import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { TabParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Tab } from "./tab.js";

/**
 * @public
 */
export const TabConditions = {
    selected: "[selected]",
};

export { TabParts };

/**
 * @public
 */
export const TabAnatomy: ComponentAnatomy<typeof TabConditions, typeof TabParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: TabConditions,
    parts: TabParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Tab template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Tab> =
    (ds: DesignSystem) => html<Tab>`
        <template @click="${x => x.handleClick()}">
            <slot name="start"></slot>
            <span class="content" part="content">
                <slot></slot>
            </span>
            <slot name="end"></slot>
        </template>
    `;
