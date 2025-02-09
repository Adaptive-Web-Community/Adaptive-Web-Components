import {
    createForegroundSet,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    accentFillReadableControlStyles,
    accentStrokeReadable,
    accentStrokeReadableRecipe,
    neutralFillSubtle
} from "@adaptive-web/adaptive-ui/reference";
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
    foregroundFill: createForegroundSet(accentStrokeReadableRecipe, neutralFillSubtle),
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
            {
                target: {
                    part: CheckboxAnatomy.parts.control,
                },
                styles: accentOutlineReadableControlStyles,
            },
            {
                target: {
                    contextCondition: CheckboxAnatomy.conditions.checked,
                    part: CheckboxAnatomy.parts.control,
                },
                styles: accentFillReadableControlStyles,
            },
            {
                target: {
                    part: CheckboxAnatomy.parts.label,
                },
                properties: {
                    fontFamily: "Times",
                    fontSize: "20px",
                },
            },
        ],
    }
);

myDS.defineComponents({
    myCheckboxDefinition,
});

DesignToken.registerDefaultStyleTarget();
