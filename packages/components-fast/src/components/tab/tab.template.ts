import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import {
    tabDocumentation,
    TabParts,
    TabSlots,
    tabWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Tab } from "./tab.js";

/**
 * @public
 */
export const TabAnatomy = documentationToComponentAnatomy(tabDocumentation, tabWebBinding);

/**
 * Default Tab template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Tab> =
    (ds: DesignSystem) => html<Tab>`
        <template @click="${x => x.handleClick()}">
            <slot name=${(_) => TabSlots.start}></slot>
            <span class=${(_) => TabParts.content} part=${(_) => TabParts.content}>
                <slot></slot>
            </span>
            <slot name=${(_) => TabSlots.end}></slot>
        </template>
    `;
