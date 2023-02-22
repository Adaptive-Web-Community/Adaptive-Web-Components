import { FASTSwitch } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./switch.styles.js";
import { template } from "./switch.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeSwitch(
    ds: DesignSystem,
    options?: ComposeOptions<FASTSwitch>
): FASTElementDefinition {
    return FASTSwitch.compose({
        name: `${ds.prefix}-switch`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}