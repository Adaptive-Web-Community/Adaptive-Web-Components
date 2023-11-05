import { FASTCheckbox } from "@microsoft/fast-foundation";
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { adaptiveDesignSystem, DesignSystem } from "../../design-system.js";
import { styleModules } from "./checkbox.styles.modules.js";
import { aestheticStyles, templateStyles } from "./checkbox.styles.js";
import { CheckboxAnatomy, checkboxTemplate } from "./checkbox.template.js";
import checkboxOptions from "./checkbox.options.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];
 
/**
 * The Checkbox custom element definition. Implements {@link @microsoft/fast-foundation#FASTCheckbox}.
 *
 * @remarks
 * HTML Element: \<adaptive-checkbox\>
 *
 * @public
 */
export const checkboxDefinition = FASTCheckbox.compose({
    name: `${adaptiveDesignSystem.prefix}-${checkboxOptions.basename}`,
    template: checkboxTemplate(checkboxOptions.templateOptions),
    styles: DesignSystem.assembleStyles(defaultStyles, CheckboxAnatomy, styleModules)
});
