import { FASTPickerMenu } from "@microsoft/fast-foundation";
import type { ComposableStyles, FASTElementDefinition } from '@microsoft/fast-element';
import { componentBaseStyles } from "@adaptive-web/adaptive-ui";
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { aestheticStyles, templateStyles } from "./picker-menu.styles.js";
import { PickerMenuAnatomy, template } from "./picker-menu.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

export function composePickerMenu(
    ds: DesignSystem,
    options?: ComposeOptions<FASTPickerMenu>
): FASTElementDefinition {
    const styles: ComposableStyles[] = DesignSystem.assembleStyles(defaultStyles, PickerMenuAnatomy.interactivity, options);

    return FASTPickerMenu.compose({
        name: `${ds.prefix}-picker-menu`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
