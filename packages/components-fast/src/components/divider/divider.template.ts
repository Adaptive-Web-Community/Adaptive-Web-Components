import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { dividerDocumentation, dividerWebBinding } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Divider } from "./divider.js";

/**
 * @public
 */
export const DividerAnatomy = documentationToComponentAnatomy(dividerDocumentation, dividerWebBinding);

/**
 * Default Divider template.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Divider> =
    (ds: DesignSystem) => html<Divider>`
        <slot></slot>
    `;
