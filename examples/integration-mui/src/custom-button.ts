import { attr, ElementStyles } from "@microsoft/fast-element";
import { PropertyStyleSheetBehavior } from "@microsoft/fast-foundation";
import { ElementStylesRenderer } from "@adaptive-web/adaptive-ui";
import { Button } from "@adaptive-web/adaptive-web-components";
import { AdaptiveDesignSystem, ButtonAnatomy, buttonStyleModules, buttonTemplate, buttonTemplateStyles, componentBaseStyles, DesignSystem } from "@adaptive-web/adaptive-web-components";
import { accentFillReadableControlStyles, criticalFillReadableControlStyles } from "@adaptive-web/adaptive-ui/reference";

/**
 * Custom Button class override.
 * This only exists to show the most formal way to add an attribute to a class.
 * Simple attributes can also be passed in to the `compose` call.
 */
export class CustomButton extends Button {
    @attr
    public purpose: string | null = null;
}

// Simple example of adjusting styles for a "purpose" property
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

export const customButtonDefinition = CustomButton.compose({
    name: `${AdaptiveDesignSystem.prefix}-button`,
    template: buttonTemplate(AdaptiveDesignSystem),
    styles,
    registry: AdaptiveDesignSystem.registry,
});
