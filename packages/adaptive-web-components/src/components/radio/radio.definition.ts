import circleIcon from "@fluentui/svg-icons/icons/circle_12_filled.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeRadio } from "./radio.compose.js";
import { RadioIconKeys } from "./radio.template.js";

/**
 * The Radio custom element definition. Implements {@link @microsoft/fast-foundation#FASTRadio}.
 *
 * @remarks
 * HTML Element: \<adaptive-radio\>
 *
 * @public
 */
export const radioDefinition = composeRadio(
    DefaultDesignSystem,
    {
        statics: {
            [RadioIconKeys.checked]: circleIcon
        }
    }
);