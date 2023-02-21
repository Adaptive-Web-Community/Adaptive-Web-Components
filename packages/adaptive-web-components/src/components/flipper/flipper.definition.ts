import chevronLeftIcon from "@fluentui/svg-icons/icons/chevron_left_16_regular.svg";
import chevronRightIcon from "@fluentui/svg-icons/icons/chevron_right_16_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeFlipper } from "./flipper.compose.js";
import { FlipperIconKeys } from "./flipper.template.js";

/**
 * The Flipper custom element definition. Implements {@link @microsoft/fast-foundation#FASTFlipper}.
 *
 * @remarks
 * HTML Element: \<adaptive-flipper\>
 *
 * @public
 */
export const flipperDefinition = composeFlipper(
    DefaultDesignSystem,
    {
        statics: {
            [FlipperIconKeys.previous]: chevronLeftIcon,
            [FlipperIconKeys.next]: chevronRightIcon
        }
    }
);
