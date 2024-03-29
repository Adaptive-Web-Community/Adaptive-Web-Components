import { FASTDialog } from "@microsoft/fast-foundation";
import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./dialog.styles.js";
import { DialogAnatomy, template } from "./dialog.template.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDialog(
    ds: DesignSystem,
    options?: ComposeOptions<FASTDialog>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, DialogAnatomy, options);

    return FASTDialog.compose({
        name: `${ds.prefix}-dialog`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
