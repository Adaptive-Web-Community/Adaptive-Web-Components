import { ElementStyles } from '@microsoft/fast-element';
import { ComponentAnatomy, ElementStylesRenderer, StyleRules } from "@adaptive-web/adaptive-ui";
import { densityControl, densityLayer, neutralForegroundReadableElementStyles } from "@adaptive-web/adaptive-ui/reference";
import { globalStyleRules } from '@adaptive-web/adaptive-web-components';
import { ContentItemAnatomy } from './ContentItem.js';
import { cardStyles, itemTitleStyles, layerContainerVertical } from './styles.js';

/**
 * The Adaptive UI styles for the ContentItem React component.
 *
 * There's probably a better structure for this, I just used the static property to
 * illustrate that the generation is done once.
 *
 * The evolution of this (already in PoC) is to generate styles at build time for zero runtime hit.
 */

/**
 *    target: {
                    part: 'MuiButton-root'
                },
 */
export abstract class ContentItemStyles {
    private static _styles: ElementStyles | null = null;

    private static initStyles() {
        console.log("ContentItem: initStyles (happens once)");

        // Think of these like regular css rules. The `target` creates the css selector.
        // The `styles` render all the properties from the set and `properties` are typically more fine-grained than the styles.
        const styleRules: StyleRules = [
            {  // target: css selector .container
                // part = class (think of it like a css class)
             
                target: {
                    part: ContentItemAnatomy.parts.container,
                },
                styles: cardStyles,
                properties: {
                    "display": "flex",
                    "flex-direction": "column",
                    "flex-grow": "1",
                    "overflow": "hidden",
                },
            },
            {
                target: {
                    part: ContentItemAnatomy.parts.thumbnail,
                },
                properties: {
                    "width": "100%",
                    "aspect-ratio": "16 / 9",
                },
            },
            {
                target: {
                    part: ContentItemAnatomy.parts.details,
                },
                styles: layerContainerVertical,
            },
            {
                target: {
                    part: ContentItemAnatomy.parts.title,
                },
                styles: itemTitleStyles,
            },
            {
                target: {
                    part: ContentItemAnatomy.parts.description,
                },
                properties: {
                    "display": "none",
                },
            },
            {
                target: {
                    part: ContentItemAnatomy.parts.properties,
                },
                properties: {
                    gap: densityLayer.verticalGap,
                    "display": "grid", /* css grid styling isn't supported in Figma, not sure which path to take for Design-to-Code yet. */
                    "grid-template-rows": "auto",
                    "grid-template-columns": "auto",
                    "justify-items": "start",
                },
            },
            {
                target: {
                    part: ContentItemAnatomy.parts.badge,
                },
                properties: {
                    "grid-column": "1/none",
                },
            },
            {
                target: {
                    part: ContentItemAnatomy.parts.metadata,
                },
                styles: neutralForegroundReadableElementStyles,
                properties: {
                    gap: densityControl.horizontalGap,
                    "display": "flex",
                    "align-self": "center",
                    "grid-row": "2",
                },
            },
            {
                target: {
                    part: ContentItemAnatomy.parts.actions,
                },
                properties: {
                    gap: densityControl.horizontalGap,
                    "display": "flex",
                    "grid-row": "2",
                    "grid-column": "2",
                    "justify-self": "end",
                },
            },
        ];

        // Turn the definitions into a stylesheet. This is the part that could happen at build time as mentioned above.
        ContentItemStyles._styles = ContentItemStyles.renderStyles(styleRules, ContentItemAnatomy);
    }

    // This belongs as a helper function in Adaptive UI, here for illustration purposes.
    private static renderStyles(styleRules: StyleRules, anatomy: ComponentAnatomy<any, any>): ElementStyles {
        const allStyleRules = [
            ...globalStyleRules(anatomy),
            ...styleRules,
        ];

        return ElementStylesRenderer.renderStyleRules([], allStyleRules, anatomy);
    }

    public static get styles() {
        if (ContentItemStyles._styles === null) {
            ContentItemStyles.initStyles();
        }

        console.log("ContentItem: getting styles (called for each instance)");
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return ContentItemStyles._styles!;
    }
}
