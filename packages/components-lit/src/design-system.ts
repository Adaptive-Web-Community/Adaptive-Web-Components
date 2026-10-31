import { type CSSResultGroup, type LitElement, type TemplateResult, unsafeCSS } from "lit";
import type { ComponentAnatomy, StyleRules } from "@adaptive-web/adaptive-ui";
import { DesignSystem as FoundationDesignSystem } from "@adaptive-web/components-foundation";
import type { AccordionItemStatics } from "./components/index.js";

/**
 * The keys of the statics of the components, which an {@link ElementStaticMap} maps to their HTML.
 *
 * @public
 */
export type ComponentStatics = AccordionItemStatics;

/**
 * @public
 */
export type ElementStaticMap = Map<ComponentStatics, string>;

/**
 * An element that `compose<Name>` made with a design system: its name, the class that renders it, and the options of its definition.
 *
 * @public
 */
export interface ElementDefinition<TType extends typeof LitElement = typeof LitElement> {
    readonly name: string;
    readonly type: TType;
    readonly elementOptions?: ElementDefinitionOptions;
}

/**
 * The definition of a component: a function that composes it with a design system.
 *
 * @public
 */
export type ComponentDefinition = (ds: DesignSystem) => ElementDefinition;

/**
 * Configuration options for composing an element definition.
 *
 * @public
 */
export type ComposeOptions<TElement, TStatics extends string = never> = {
    template?: (ds: DesignSystem) => (element: TElement) => TemplateResult;
    styles?: CSSResultGroup;
    styleRules?: StyleRules;
    elementOptions?: ElementDefinitionOptions;
    statics?: Record<TStatics, string>;
};

/**
 * The design system of the Lit components: the {@link @adaptive-web/components-foundation#DesignSystem} of the foundation, which defines
 * the components and gives their styles to Lit.
 *
 * @public
 */
export class DesignSystem extends FoundationDesignSystem<ComponentStatics, string> {
    /**
     * Defines a set of components with the prefix and in the registry of the design system.
     */
    public defineComponents(components: Record<string, ComponentDefinition>): void {
        for (const component of Object.values(components)) {
            const { name, type, elementOptions } = component(this);
            this.registry.define(name, type, elementOptions);
        }
    }

    /**
     * Assembles the styles of a component: its own styles, then its style rules and the rules of its anatomy, rendered with the token library
     * of the design system ({@link @adaptive-web/components-foundation#DesignSystem.renderStyles}).
     *
     * @param defaultStyles - The CSS of the component, used if not overridden by `options.styles`.
     * @param anatomy - The anatomy of the component.
     * @param options - The component options, using `styles` and `styleRules`.
     * @returns The styles, for the `styles` of the class.
     */
    public assembleStyles(defaultStyles: string[], anatomy?: ComponentAnatomy<any, any>, options?: ComposeOptions<any, any>): CSSResultGroup {
        const componentStyles = options?.styles ?? defaultStyles.map(style => unsafeCSS(style));
        return [componentStyles, unsafeCSS(this.renderStyles(anatomy, options?.styleRules))];
    }
}

/**
 * The default {@link DesignSystem} configuration.
 *
 * @public
 */
export const DefaultDesignSystem: DesignSystem = new DesignSystem("adaptive");
