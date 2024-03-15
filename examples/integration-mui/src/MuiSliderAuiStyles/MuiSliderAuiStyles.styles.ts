import { css, ElementStyles } from '@microsoft/fast-element';
import { ComponentAnatomy, ElementStylesRenderer, StyleRules } from "@adaptive-web/adaptive-ui";
import { controlShapeStyles, designUnit, highlightFillReadableControlStyles, neutralStrokeDiscernible, neutralStrokeSubtle, roundShapeStyles, typeRampMinus1Styles } from "@adaptive-web/adaptive-ui/reference";
import { globalStyleRules } from '@adaptive-web/adaptive-web-components';
import { MuiSliderAuiStylesAnatomy } from './MuiSliderAuiStyles.js';

/**
 * The Adaptive UI styles for the MUI Slider React component.
 *
 * There's probably a better structure for this, just using a static property to
 * generate and register the global styles once.
 *
 * The evolution of this (already in PoC) is to generate styles at build time for zero runtime hit.
 */
export abstract class MuiSliderAuiStyle {
    private static _registered: boolean = false;
    private static _styles: ElementStyles | null = null;

    private static initStyles() {
        console.log("MuiSliderAuiStyles: initStyles (happens once)");

        // Separating what needs to be reset from MUI default styling.
        const resetStyleRules: StyleRules = [
            {
                target : {
                    part: MuiSliderAuiStylesAnatomy.parts.rail,
                },
                properties: {
                    "opacity": 1, // Reset MUI choice
                },
            },
            {
                target : {
                    part: MuiSliderAuiStylesAnatomy.parts.mark,
                },
                properties: {
                    top: "80%", // This is a bit more complicated than a reset, but manually dealing with structural decisions
                },
            },
        ];

        // The Adaptive UI styles as applied from design tooling. This would be generated (or equivalent).
        const styleRules: StyleRules = [
            {
                target : {
                    part: MuiSliderAuiStylesAnatomy.parts.root,
                },
                styles: controlShapeStyles,
                properties: {
                    "height": designUnit,
                },
            },
            {
                target : {
                    part: MuiSliderAuiStylesAnatomy.parts.rail,
                },
                styles: controlShapeStyles,
                properties: {
                    backgroundFill: neutralStrokeDiscernible.rest,
                },
            },
            {
                target : {
                    part: MuiSliderAuiStylesAnatomy.parts.track,
                },
                styles: [
                    controlShapeStyles,
                    highlightFillReadableControlStyles,
                ],
            },
            {
                target : {
                    part: MuiSliderAuiStylesAnatomy.parts.thumb,
                },
                styles: [
                    roundShapeStyles,
                    highlightFillReadableControlStyles,
                ],
                properties: {
                    height: css.partial`calc(${designUnit} * 4)`, 
                    width: css.partial`calc(${designUnit} * 4)`,
                }
            },
            {
                target : {
                    part: MuiSliderAuiStylesAnatomy.parts.mark,
                },
                properties: {
                    backgroundFill: neutralStrokeSubtle.rest,
                    height: css.partial`calc(${designUnit} * 2)`, 
                    width: css.partial`calc(${designUnit} / 2)`,
                },
            },
            {
                target : {
                    part: MuiSliderAuiStylesAnatomy.parts.markLabel,
                },
                styles: typeRampMinus1Styles,
            },
        ];

        // Turn the definitions into a stylesheet. This is the part that could happen at build time as mentioned above.
        MuiSliderAuiStyle._styles = MuiSliderAuiStyle.renderStyles(styleRules, MuiSliderAuiStylesAnatomy);
    }

    // This belongs as a helper function in Adaptive UI, here for illustration purposes.
    private static renderStyles(styleRules: StyleRules, anatomy: ComponentAnatomy<any, any>): ElementStyles {
        const allStyleRules = [
            ...globalStyleRules(anatomy),
            ...styleRules,
        ];
        const renderStyles = ElementStylesRenderer.renderStyleRules([], allStyleRules, anatomy);
        // console.log(' renderStyles ', renderStyles);
        return renderStyles
    }

    public static registerStyles() {
        if (!MuiSliderAuiStyle._registered) {
            if (MuiSliderAuiStyle._styles === null) {
                MuiSliderAuiStyle.initStyles();
            }
            console.log("MuiSliderAuiStyle registering styles");
            MuiSliderAuiStyle._registered = true;
            MuiSliderAuiStyle._styles?.addStylesTo(document);
        }
    }

    public static get styles() {
        if (MuiSliderAuiStyle._styles === null) {
            MuiSliderAuiStyle.initStyles();
        }

        console.log("MuiSliderAuiStyles: getting styles (called for each instance)");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return MuiSliderAuiStyle._styles!;
    }
}
