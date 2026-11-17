import { elements, type ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { switchDocumentation, SwitchParts, SwitchSlots, switchWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Switch } from "./switch.js";

/**
 * @public
 */
export const SwitchAnatomy = documentationToComponentAnatomy(switchDocumentation, switchWebBinding);

/**
 * Default Switch template. The element is the switch, and its label names it.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Switch> =
    (ds: DesignSystem) => html<Switch>`
        <span class=${(_) => SwitchParts.label} part=${(_) => SwitchParts.label} ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name=${(_) => SwitchSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
        <div class=${(_) => SwitchParts.switch} part=${(_) => SwitchParts.switch}>
            <slot name=${(_) => SwitchSlots.switch}>
                <div class=${(_) => SwitchParts.thumb} part=${(_) => SwitchParts.thumb}></div>
            </slot>
        </div>
    `;
