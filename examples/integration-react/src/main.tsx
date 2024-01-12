import { css, ElementStyles } from "@microsoft/fast-element";
import { DesignToken, PropertyStyleSheetBehavior } from "@microsoft/fast-foundation";
import { reactWrapper } from "@microsoft/fast-react-wrapper";
import { ElementStylesRenderer } from "@adaptive-web/adaptive-ui";
import { accentBaseColor, accentFillReadableControlStyles, accentFillReadableRest, cornerRadiusControl, criticalBaseColor, criticalFillReadableControlStyles, criticalFillReadableRest, densityControl, densityItemContainer, elevationFlyoutSize, fillSubtleHoverDelta, fontFamily, highlightBaseColor, labelFontWeight, neutralBaseColor, typeRampPlus1LineHeight, typeRampPlus2LineHeight, typeRampPlus3LineHeight, typeRampPlus4LineHeight, typeRampPlus5LineHeight, typeRampPlus6LineHeight } from "@adaptive-web/adaptive-ui/reference";
import { AdaptiveDesignSystem, ButtonAnatomy, buttonStyleModules, buttonTemplate, buttonTemplateStyles, componentBaseStyles, DesignSystem } from "@adaptive-web/adaptive-web-components";
import { accordionDefinition } from "@adaptive-web/adaptive-web-components/accordion";
import { accordionItemDefinition } from "@adaptive-web/adaptive-web-components/accordion-item";
import { badgeDefinition } from "@adaptive-web/adaptive-web-components/badge";
import { checkboxDefinition } from "@adaptive-web/adaptive-web-components/checkbox";
import { menuDefinition } from "@adaptive-web/adaptive-web-components/menu";
import { menuItemDefinition } from "@adaptive-web/adaptive-web-components/menu-item";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.js";
import { CustomButton } from "./custom-button.js";

// Simple example of adjusting styles for an "appearance" property
// const buttonStyles: ElementStyles = css`
//     .control { background-color: green; }
// `.withBehaviors(
//     new PropertyStyleSheetBehavior("purpose", "primary", css`.control { background-color: blue; }`),
//     new PropertyStyleSheetBehavior("purpose", "critical", css`.control { background-color: red; }`)
// );

// Similar to above but using design tokens for the values
// const buttonStyles: ElementStyles = css`
//     :host([purpose="primary"]) .control {
//         background-color: ${accentFillReadableRest};
//     }

//     :host([purpose="critical"]) .control {
//         background-color: ${criticalFillReadableRest};
//     }
// `;

// Both examples above are not recommended especially for color tokens because this method doesn't support interactive states

// Example of manually rendering style modules for a conditional property
// This is being built as https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/issues/86
const buttonStyleParams = (purpose: string) => {
    return {
        hostCondition: `[purpose='${purpose}']`,
        part: ButtonAnatomy.parts.control,
        interactivitySelector: ButtonAnatomy.interactivity?.interactivitySelector,
    };
};
const primaryElementStyles = new ElementStylesRenderer(accentFillReadableControlStyles).render(buttonStyleParams("primary"));
const criticalElementStyles = new ElementStylesRenderer(criticalFillReadableControlStyles).render(buttonStyleParams("critical"));
const buttonStyles: ElementStyles = new ElementStyles([primaryElementStyles, criticalElementStyles]);

// Manual example of composing a custom element
const buttonOptions = {
    styles: buttonStyles,
    styleModules: buttonStyleModules
};
const defaultStyles = [componentBaseStyles, buttonTemplateStyles];
const styles = DesignSystem.assembleStyles(defaultStyles, ButtonAnatomy, buttonOptions);

const customButtonDefinition = CustomButton.compose({
    name: `${AdaptiveDesignSystem.prefix}-button`,
    template: buttonTemplate(AdaptiveDesignSystem),
    styles,
    registry: AdaptiveDesignSystem.registry,
});


// Override design token values before the first time they are evaluated

// neutralBaseColor.withDefault("#ff00ff");
// fillSubtleHoverDelta.withDefault(8);
// elevationFlyoutSize.withDefault(64);

accentBaseColor.withDefault("#006DC7");
highlightBaseColor.withDefault("#22A6AB");
criticalBaseColor.withDefault("#FE4A49");
cornerRadiusControl.withDefault("6px");
densityControl.verticalPaddingUnits.withDefault(2.5);
densityControl.verticalGapUnits.withDefault(2);
densityItemContainer.horizontalGapUnits.withDefault(1);
fontFamily.withDefault("'Source Sans Pro', Arial, Helvetica, sans-serif");
labelFontWeight.withDefault(600);
typeRampPlus1LineHeight.withDefault("20px");
typeRampPlus2LineHeight.withDefault("24px");
typeRampPlus3LineHeight.withDefault("28px");
typeRampPlus4LineHeight.withDefault("34px");
typeRampPlus5LineHeight.withDefault("48px");
typeRampPlus6LineHeight.withDefault("48px");

DesignToken.registerDefaultStyleTarget();

// Override tokens after load to see the color change in real-time in the browser
// setTimeout(() => {
//     neutralBaseColor.withDefault("#ff00ff");
// }, 5000);


// Registers the component with the browser and defines the React wrapper

AdaptiveDesignSystem.defineComponents({
    accordionDefinition,
    accordionItemDefinition,
    badgeDefinition,
    myButtonDefinition: customButtonDefinition,
    checkboxDefinition,
    menuDefinition,
    menuItemDefinition,
});

const wrap = reactWrapper(React);
export const Accordion = wrap(accordionDefinition);
export const AccordionItem = wrap(accordionItemDefinition);
export const Badge = wrap(badgeDefinition);
export const Button = wrap(customButtonDefinition);
export const Checkbox = wrap(checkboxDefinition);
export const Menu = wrap(menuDefinition);
export const MenuItem = wrap(menuItemDefinition);


ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
