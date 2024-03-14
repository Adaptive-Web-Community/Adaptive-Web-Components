import { ElementStyles } from '@microsoft/fast-element';
import { ComponentAnatomy, ElementStylesRenderer, StyleRules } from "@adaptive-web/adaptive-ui";
import { actionStyles, } from "@adaptive-web/adaptive-ui/reference";
import { globalStyleRules } from '@adaptive-web/adaptive-web-components';


import { MuiButtonAuiStylesAnatomy } from './MuiButtonAuiStyles.js';


export abstract class MuiButtonAuiStyles {
    private static _styles: ElementStyles | null = null;

    private static initStyles() {
        console.log("MuiButtonAuiStyles: initStyles (happens once)");
        console.log(' actionStyles ', actionStyles);
        // Think of these like regular css rules. The `target` creates the css selector.
        // The `styles` render all the properties from the set and `properties` are typically more fine-grained than the styles.
        const styleRules: StyleRules = [
            {  // target: css selector .container
                // part = class (think of it like a css class)

                target: {
                    part: MuiButtonAuiStylesAnatomy.parts['MuiButtonBase-root'],
                },
                styles: actionStyles,
                properties: {
                    "text-transform": "none",  // Default override in MUI
                    "display": "flex",
                    "align-items": "center",
                    "white-space": "nowrap",
                    "flex-grow": "1",
                    "justify-content": "center",
                    "border": "none",
                    "margin": "0",
                    "padding": "0",
                },
            },
            {
                target: {
                    part: 'MuiButton-root'
                },
                styles: actionStyles,
            },

            {
                target: {
                    part: 'MuiButton-root',
                    partCondition: ':not([disabled])'
                },
                properties: {
                    color: 'red',
                }
            },


        ];

        // Turn the definitions into a stylesheet. This is the part that could happen at build time as mentioned above.
        MuiButtonAuiStyles._styles = MuiButtonAuiStyles.renderStyles(styleRules, MuiButtonAuiStylesAnatomy);
    }

    // This belongs as a helper function in Adaptive UI, here for illustration purposes.
    private static renderStyles(styleRules: StyleRules, anatomy: ComponentAnatomy<any, any>): ElementStyles { 
        const allStyleRules = [
            ...globalStyleRules(anatomy),
            ...styleRules,
        ];
        const renderStyles = ElementStylesRenderer.renderStyleRules([], allStyleRules, anatomy); 
        console.log(' renderStyles ', renderStyles);
        return renderStyles
    }

    public static get styles() {
        if (MuiButtonAuiStyles._styles === null) {
            MuiButtonAuiStyles.initStyles();
        }

        console.log("MuiButtonAuiStyles: getting styles (called for each instance)");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return MuiButtonAuiStyles._styles!;
    }
}
