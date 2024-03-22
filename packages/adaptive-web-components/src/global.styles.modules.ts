import { CSSDesignToken } from "@microsoft/fast-foundation";
import {
    ComponentAnatomy,
    InteractiveSet,
    StyleProperties,
    StyleRule,
    StyleRules,
    Styles,
    StyleValue
} from "@adaptive-web/adaptive-ui";
import { disabledStyles, focusIndicatorStyles } from "@adaptive-web/adaptive-ui/reference";

/**
 * Converts `Styles` to focus-only state. This allows styles to be constructed as usual, using interactive sets
 * or simple values, but convert the styles specifically to focus state to the necessary structure.
 *
 * @param styles - The input `Styles` to convert to focus-only styles.
 * @returns Converted `Styles`.
 */
const convertToFocusState = (styles: Styles) => {
    const props: StyleProperties = {};
    styles.effectiveProperties.forEach((value, target) => {
        let focusValue: StyleValue | null;
        if (typeof value === "string" || value instanceof CSSDesignToken) {
            focusValue = value;
        } else if (value && typeof (value as any).createCSS === "function") {
            focusValue = value;
        } else {
            focusValue = (value as InteractiveSet<any>).focus;
        }

        if (focusValue) {
            props[target] = {
                rest: undefined,
                hover: undefined,
                active: undefined,
                focus: focusValue,
                disabled: undefined,
            };
        }
    });
    return Styles.fromProperties(props);
};

/**
 * Focus-only state of the customized focus indicator styles.
 */
const focusStateStyles = convertToFocusState(focusIndicatorStyles);

/**
 * Styles to remove browser default styling.
 */
const focusResetStyles = convertToFocusState(Styles.fromProperties({
    outlineStyle: "none",
}));

/**
 * Global visual styles.
 * 
 * @public
 */
export const globalStyleRules = (anatomy?: ComponentAnatomy<any, any>): StyleRules => {
    const styles = new Array<StyleRule>();

    // If this component can be disabled, apply the style to all children.
    if (anatomy?.interactivity?.disabledSelector !== undefined) {
        styles.push(
            {
                target : {
                    contextCondition: anatomy.interactivity.disabledSelector,
                    part: "*",
                },
                styles: disabledStyles,
            },
        );
    }

    // If this component can get focus, apply the focus indicator styles.
    if (anatomy?.focus) {
        if (anatomy.focus?.resetTarget) {
            styles.push(
                {
                    target: anatomy.focus?.resetTarget,
                    styles: focusResetStyles,
                }
            );
        }

        // Set intentional focus styles
        styles.push(
            {
                target: anatomy.focus.focusTarget,
                styles: focusStateStyles,
            }
        );
    }

    return styles;
};
