import { type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { hasContent, SwitchParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { controlInteractivity } from "../../utilities/interactivity.js";
import type { Switch } from "./switch.js";

/**
 * @public
 */
export const SwitchConditions = {
    checked: ":state(checked)",
};

export { SwitchParts };

/**
 * @public
 */
export const SwitchAnatomy: ComponentAnatomy<typeof SwitchConditions, typeof SwitchParts> = {
    interactivity: controlInteractivity,
    conditions: SwitchConditions,
    parts: SwitchParts,
    focus: Focus.contextFocused(),
};

/**
 * Default Switch template. The element is the switch, and its content is the label.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Switch> =
    (ds: DesignSystem) => html<Switch>`
        <span class="label" part="label" ?hidden="${x => !hasContent(x.defaultSlottedNodes)}">
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </span>
        <div class="switch" part="switch">
            <slot name="switch">
                <div class="thumb" part="thumb"></div>
            </slot>
        </div>
    `;
