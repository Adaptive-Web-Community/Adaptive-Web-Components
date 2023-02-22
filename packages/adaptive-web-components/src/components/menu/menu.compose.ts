import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveMenu } from "./menu.js";
import { aestheticStyles, templateStyles } from "./menu.styles.js";
import { template } from "./menu.template.js";

const styles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composeMenu(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveMenu>
): FASTElementDefinition {
    return AdaptiveMenu.compose({
        name: `${ds.prefix}-menu`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}