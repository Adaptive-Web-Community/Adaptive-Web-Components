import { accentBaseColor, cornerRadiusControl, criticalBaseColor, densityControl, densityItemContainer, fontFamily, highlightBaseColor, labelFontWeight, neutralBaseColor, neutralFillDiscernibleControlStyles, selectableSelectedStyles, StandardFontWeight, typeRampPlus1LineHeight, typeRampPlus2LineHeight, typeRampPlus3LineHeight, typeRampPlus4LineHeight, typeRampPlus5LineHeight, typeRampPlus6LineHeight } from "@adaptive-web/adaptive-ui/reference";
import { getTheme } from "./util.js";

// This file is a proxy for a separate published components package. See the package README.md for more information.

// Future example for swapping style definitions.
const theme = getTheme();

// selectableSelectedStyles.appendComposed(neutralFillDiscernibleControlStyles);

// Consider this equivalent to loading a base stylesheet.
// It would be incorporated into the DesignSystem object when creating a customized package for your DS.

// Override design token values before the first time they are evaluated
accentBaseColor.withDefault("#006DC7");
highlightBaseColor.withDefault("#22A6AB");
criticalBaseColor.withDefault("#FE4A49");
cornerRadiusControl.withDefault("6px");
densityControl.verticalPaddingUnits.withDefault(2.5);
densityControl.verticalGapUnits.withDefault(2);
densityItemContainer.horizontalGapUnits.withDefault(1);
fontFamily.withDefault("'Source Sans Pro', Arial, Helvetica, sans-serif");
labelFontWeight.withDefault(StandardFontWeight.SemiBold);
typeRampPlus1LineHeight.withDefault("20px");
typeRampPlus2LineHeight.withDefault("24px");
typeRampPlus3LineHeight.withDefault("28px");
typeRampPlus4LineHeight.withDefault("34px");
typeRampPlus5LineHeight.withDefault("48px");
typeRampPlus6LineHeight.withDefault("48px");

// Override tokens after load to see the color change in real-time in the browser
// setTimeout(() => {
//     neutralBaseColor.withDefault("#ff00ff");
// }, 5000);
