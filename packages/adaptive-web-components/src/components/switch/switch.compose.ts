import { FASTSwitch } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./switch.styles.js";
import { SwitchAnatomy, template } from "./switch.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeSwitch(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSwitch>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, SwitchAnatomy, options);

    return FASTSwitch.compose({
        name: `${ds.prefix}-switch`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
