import type { FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveMenu } from "./menu.js";
import { aestheticStyles, templateStyles } from "./menu.styles.js";
import { MenuAnatomy, template } from "./menu.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeMenu(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveMenu>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, MenuAnatomy.interactivity, options);

    return AdaptiveMenu.compose({
        name: `${ds.prefix}-menu`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
