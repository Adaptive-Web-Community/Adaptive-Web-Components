import { radioIcon } from "@adaptive-web/components-foundation";
import type { ComponentDefinition } from "../../design-system.js";
import { composeRadio } from "./radio.compose.js";
import { RadioStatics } from "./radio.template.js";
import { styleRules } from "./radio.styles.rules.js";

/**
 * The Radio custom element definition. Implements {@link Radio}.
 *
 * @remarks
 * HTML Element: \<adaptive-radio\>
 *
 * @public
 */
export const radioDefinition: ComponentDefinition = ds => composeRadio(
    ds,
    {
        statics: {
            [RadioStatics.checked]: radioIcon,
        },
        styleRules,
    }
);
