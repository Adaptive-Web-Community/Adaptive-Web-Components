import type { FASTElementDefinition } from '@microsoft/fast-element';
import type { ComposeOptions, DesignSystem } from "../../design-system.js";
import { AdaptiveMenuItem } from "./menu-item.js";
import { styles } from "./menu-item.styles.js";
import { MenuItemIconKeys, template } from "./menu-item.template.js";

export function composeMenuItem(
    ds: DesignSystem,
    options?: ComposeOptions<AdaptiveMenuItem, MenuItemIconKeys>
): FASTElementDefinition {
    if (options?.statics) {
        if (!ds.statics.has(MenuItemIconKeys.checkbox)) {
            ds.statics.set(
                MenuItemIconKeys.checkbox,
                options.statics[MenuItemIconKeys.checkbox]
            );
        }

        if (!ds.statics.has(MenuItemIconKeys.radio)) {
            ds.statics.set(
                MenuItemIconKeys.radio,
                options.statics[MenuItemIconKeys.radio]
            );
        }

        if (!ds.statics.has(MenuItemIconKeys.submenu)) {
            ds.statics.set(
                MenuItemIconKeys.submenu,
                options.statics[MenuItemIconKeys.submenu]
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