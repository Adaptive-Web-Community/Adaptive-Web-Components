import { chevronLeftIcon, chevronRightIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeFlipper } from "./flipper.compose.js";
import { FlipperStatics } from "./flipper.template.js";
import { styleModules } from "./flipper.styles.modules.js";

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
            [FlipperStatics.previous]: chevronLeftIcon,
            [FlipperStatics.next]: chevronRightIcon,
        },
        styleModules,
    }
);
