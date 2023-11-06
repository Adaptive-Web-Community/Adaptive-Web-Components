import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles, svgIconStyles } from '../../styles/styles.js';
import { AdaptiveMenuItem } from "./menu-item.js";
import { aestheticStyles, templateStyles } from "./menu-item.styles.js";
import { MenuItemAnatomy, MenuItemStatics, template } from "./menu-item.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, svgIconStyles, aestheticStyles];

/**
 * @public
 */
export function composeMenuItem(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveMenuItem, MenuItemStatics>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(MenuItemStatics.checkbox)) {
            ds.statics.set(
                MenuItemStatics.checkbox,
                options.statics[MenuItemStatics.checkbox]
            );
        }

        if (!ds.statics.has(MenuItemStatics.radio)) {
            ds.statics.set(
                MenuItemStatics.radio,
                options.statics[MenuItemStatics.radio]
            );
        }

        if (!ds.statics.has(MenuItemStatics.submenu)) {
            ds.statics.set(
                MenuItemStatics.submenu,
                options.statics[MenuItemStatics.submenu]
            );
        }
    }

    const styles = DesignSystem.assembleStyles(defaultStyles, MenuItemAnatomy, options);

    return AdaptiveMenuItem.compose({
        name: `${ds.prefix}-menu-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
