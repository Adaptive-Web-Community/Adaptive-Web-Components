import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { Menu } from "./menu.js";
import { aestheticStyles, templateStyles } from "./menu.styles.js";
import { MenuAnatomy, template } from "./menu.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeMenu(
    ds: DesignSystem,
    options?: ComposeOptions<Menu>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, MenuAnatomy, options);

    return Menu.compose({
        name: `${ds.prefix}-menu`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
