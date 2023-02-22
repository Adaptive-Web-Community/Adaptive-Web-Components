import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveMenuItem } from "./menu-item.js";
import { styles } from "./menu-item.styles.js";
import { MenuItemStatics, template } from "./menu-item.template.js";

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

    return AdaptiveMenuItem.compose({
        name: `${ds.prefix}-menu-item`,
        template: options?.template?.(ds) ?? template(ds),
        styles: options?.styles ?? styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}