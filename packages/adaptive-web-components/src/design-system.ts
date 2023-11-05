import {
    type ComposableStyles,
    ElementStyles,
    FASTElementDefinition,
} from '@microsoft/fast-element';
import {
    type ComponentAnatomy,
    ElementStylesRenderer,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { globalStyleModules } from './global.styles.modules.js';

/**
 * Represents metadata configuration for a custom element.
 * 
 * @beta
 */
export class DesignSystem {
    constructor(
        private _prefix: string,
        private _registry: CustomElementRegistry = customElements
    ) {}

    public get prefix() {
        return this._prefix;
    }

    public get registry() {
        return this._registry;
    }

    /**
     * Defines a set of components using the prefix and registry defined with the DesignSystem
     * 
     * @beta
     */
    public defineComponents(components: Record<string, FASTElementDefinition>) {
        for (const key in components) {
            const definition = components[key];
            definition.define(this._registry);
        }
    }

    /**
     * Assembles the collection of intended styles, evaluating and injecting modular styling if provided.
     *
     * @param defaultStyles - The default collection of styles to use if not overridden by `options.styles`.
     * @param interactivity - The interactivity selectors for the component.
     * @param stylesOrModules - Additional styles and/or style modules.
     * @returns The collection of desired styles.
     * 
     * @beta
     */
    public static assembleStyles(
        defaultStyles: ComposableStyles[], anatomy?: ComponentAnatomy<any, any>, ...stylesOrModules: Array<ElementStyles | StyleModules>
    ): ElementStyles {
        const componentStyles = defaultStyles;
        const allStyleModules = [...globalStyleModules(anatomy)];

        stylesOrModules.forEach(item => {
            if (item instanceof ElementStyles) {
                componentStyles.push(item);
            } else {
                allStyleModules.push(...item);
            }
        });

        for (const [target, styles] of allStyleModules) {
            const renderedStyles = new ElementStylesRenderer(styles).render(target, anatomy?.interactivity);
            componentStyles.push(renderedStyles);
        }

        return new ElementStyles(componentStyles);
    }
}

/**
 * The default {@link DesignSystem} configuration.
 *
 * @beta
 */
export const adaptiveDesignSystem: DesignSystem = new DesignSystem("adaptive");

/**
 * Configuration options for composing an element definition.
 * 
 * @internal
 */
export type ComposeOptions<TOptions = any> = {
    baseName: string;
    templateOptions?: TOptions;
}
