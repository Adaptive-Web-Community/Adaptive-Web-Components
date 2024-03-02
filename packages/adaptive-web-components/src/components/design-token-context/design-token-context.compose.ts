import type { FASTElementDefinition } from '@microsoft/fast-element';
import { ComposeOptions, DesignSystem } from "../../design-system.js";
import { componentBaseStyles } from "../../styles/styles.js";
import { DesignTokenContextAnatomy, template } from "./design-token-context.template.js";
import { DesignTokenContext } from './design-token-context.js';

const defaultStyles = [componentBaseStyles];

/**
 * @public
 */
export function composeDesignTokenContext(
    ds: DesignSystem,
    options?: ComposeOptions<DesignTokenContext>
): FASTElementDefinition {
    const styles = DesignSystem.assembleStyles(defaultStyles, DesignTokenContextAnatomy, options);

    return DesignTokenContext.compose({
        name: `${ds.prefix}-design-token-context`,
        template: options?.template?.(ds) ?? template(ds),
        styles,
        registry: ds.registry,
        elementOptions: options?.elementOptions,
        shadowOptions: options?.shadowOptions
    });
}
