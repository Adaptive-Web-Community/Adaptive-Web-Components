import { DefaultDesignSystem } from "../../design-system.js";
import { composeRadioGroup } from "./radio-group.compose.js";

/**
 * The Radio Group custom element definition. Implements {@link @microsoft/fast-foundation#FASTRadioGroup}.
 *
 * @remarks
 * HTML Element: \<adaptive-radio-group\>
 *
 * @public
 */
export const radioGroupDefinition = composeRadioGroup(DefaultDesignSystem);