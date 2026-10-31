import type { ComponentComposition } from "../design-system/composition.js";
import { componentBaseStyles } from "../styles/styles.js";
import { buttonAestheticStyles, ButtonAnatomy, buttonTemplateStyles } from "./button.styles.js";

/**
 * What a design system composes a {@link ButtonElement} from.
 *
 * @public
 */
export const buttonComposition: ComponentComposition = {
    name: "button",
    styles: [componentBaseStyles, buttonTemplateStyles, buttonAestheticStyles],
    anatomy: ButtonAnatomy,
};
