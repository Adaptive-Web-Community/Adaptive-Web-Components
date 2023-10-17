import { InteractivityDefinition, StyleModules, StyleModuleTarget, Styles } from "@adaptive-web/adaptive-ui";
import { disabledStyles } from "@adaptive-web/adaptive-ui/reference";

/**
 * Global visual styles.
 * 
 * @public
 */
export function globalStyleModules(interactivity?: InteractivityDefinition): StyleModules {
    const styles = new Array<[StyleModuleTarget, Styles]>();

    // If this component can be disabled, apply the style to all children.
    if (interactivity?.disabledSelector !== undefined) {
        styles.push(
            [
                {
                    hostCondition: interactivity.disabledSelector,
                    part: "*",
                },
                disabledStyles,
            ]
        );
    }

    return styles;
}
