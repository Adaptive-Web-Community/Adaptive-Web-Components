import { customElement, type PartialFASTElementDefinition } from '@microsoft/fast-element';
import { FASTCheckbox } from '@microsoft/fast-foundation';
import { DefaultDesignSystem } from "../../design-system.js";
import { composeCheckbox } from './checkbox.compose.js';

/**
 * The default Adaptive Checkbox custom element. Implements {@link @microsoft/fast-foundation#FASTCheckbox}.
 *
 * @remarks
 * HTML Element: \<adaptive-checkbox\>
 *
 * @public
 */
customElement(
    composeCheckbox(DefaultDesignSystem) as unknown as PartialFASTElementDefinition
)(FASTCheckbox)
