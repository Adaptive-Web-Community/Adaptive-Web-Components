import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { aestheticStyles, templateStyles } from "./dialog.styles.js";
import { DialogAnatomy, template } from "./dialog.template.js";
import { Dialog } from "./dialog.js";

const defaultStyles = [componentBaseStyles, templateStyles, aestheticStyles];

/**
 * @public
 */
export function composeDialog(
    ds: DesignSystem,
    options?: ComposeOptions<Dialog>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, DialogAnatomy, options);

    return Dialog.compose({
        name: `${ds.prefix}-dialog`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
