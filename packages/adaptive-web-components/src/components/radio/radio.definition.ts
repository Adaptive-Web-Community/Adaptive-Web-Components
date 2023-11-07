import { radioIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeRadio } from "./radio.compose.js";
import { RadioStatics } from "./radio.template.js";
import { styleModules } from "./radio.styles.modules.js";

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
            [RadioStatics.checked]: radioIcon,
        },
        styleModules,
    }
);
