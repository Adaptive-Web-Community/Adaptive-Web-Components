import {
    accentFillReadableControlStyles,
    accentStrokeReadable,
    accentStrokeReadableRecipe,
    createForegroundSet,
    neutralFillSubtle,
    Styles,
} from '@adaptive-web/adaptive-ui';
import {
    AdaptiveDesignSystem,
    CheckboxAnatomy,
    CheckboxStatics,
    composeCheckbox,
    DesignSystem,
} from '@adaptive-web/adaptive-web-components';
import { checkboxDefinition } from "@adaptive-web/adaptive-web-components/checkbox";
import { radioDefinition } from "@adaptive-web/adaptive-web-components/radio";
import { radioGroupDefinition } from "@adaptive-web/adaptive-web-components/radio-group";
import { switchDefinition } from "@adaptive-web/adaptive-web-components/switch";
import { DesignToken } from "@microsoft/fast-foundation";
import checkIcon from "./assets/check.svg";
import indeterminateIcon from "./assets/indeterminate.svg";

// --- Example part 1 ---

// Compose and define the components. Note that currently some style modules are adjusted in `init-ds` first.
AdaptiveDesignSystem.defineComponents({
    checkboxDefinition,
    radioDefinition,
    radioGroupDefinition,
    switchDefinition,
});

// --- Example part 2 ---

// Define a custom style module.
const accentOutlineReadableControlStyles: Styles = Styles.fromProperties({
    backgroundFill: neutralFillSubtle,
    borderFill: accentStrokeReadable,
    foregroundFill: createForegroundSet(accentStrokeReadableRecipe, "rest", neutralFillSubtle),
});

const myDS = new DesignSystem("my");

const myCheckboxDefinition = composeCheckbox(
    myDS,
    {
        // Customizing a component definition, currently the `statics` are not exported individually.
        statics: {
            [CheckboxStatics.checked]: checkIcon,
            [CheckboxStatics.indeterminate]: indeterminateIcon,
        },
        // Custom modular styles.
        styleModules: [
            [
                {
                    part: CheckboxAnatomy.parts.control,
                },
                accentOutlineReadableControlStyles
            ],
            [
                {
                    hostCondition: CheckboxAnatomy.conditions.checked,
                    part: CheckboxAnatomy.parts.control,
                },
                accentFillReadableControlStyles
            ],
            [
                {
                    part: CheckboxAnatomy.parts.label,
                },
                Styles.fromProperties({
                    fontFamily: "Times",
                    fontSize: "20px",
                })
            ],
        ],
    }
);

AdaptiveDesignSystem.defineComponents({
    myCheckboxDefinition,
});

DesignToken.registerDefaultStyleTarget();
