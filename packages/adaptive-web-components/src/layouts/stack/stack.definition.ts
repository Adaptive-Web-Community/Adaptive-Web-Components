import { Stack } from './stack.js';
import { template } from './stack.template.js';
import { styles } from './stack.styles.js';
import type { DesignSystem } from '../../design-system.js';

/**
 * The Stack custom element definition
 * 
 * @remarks
 * HTML Element: \<adaptive-stack\>
 * 
 * @public
 */
export const definition = (ds: DesignSystem) =>
    Stack.compose({
        name: `${ds.prefix}-stack`,
        registry: ds.registry,
        template: template(ds),
        styles
    });