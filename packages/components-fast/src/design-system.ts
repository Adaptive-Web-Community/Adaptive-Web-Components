import {
    type ComposableStyles,
    ElementStyles,
    type ElementViewTemplate,
    FASTElementDefinition,
    type PartialFASTElementDefinition,
    type ShadowRootOptions,
} from '@microsoft/fast-element';
import type { ComponentAnatomy, StyleRules } from "@adaptive-web/adaptive-ui";
import { type DesignSystemOptions, DesignSystem as FoundationDesignSystem } from "@adaptive-web/components-foundation";
import type {
    AccordionItemStatics,
    BreadcrumbItemStatics,
    CalendarStatics,
    CheckboxStatics,
    MenuItemStatics,
    NumberFieldStatics,
    PickerStatics,
    RadioStatics,
    SelectStatics,
    TreeItemStatics
} from "./components/index.js";
import type { StaticallyComposableHTML } from "./utilities/template-helpers.js";

/**
 * The keys of the statics of the components, which an {@link ElementStaticMap} maps to their HTML.
 *
 * @public
 */
export type ComponentStatics =
    AccordionItemStatics
    | BreadcrumbItemStatics
    | CalendarStatics
    | CheckboxStatics
    | MenuItemStatics
    | NumberFieldStatics
    | PickerStatics
    | RadioStatics
    | SelectStatics
    | TreeItemStatics;

/**
 * Represents partial metadata configuration for a custom element.
 *
 * @public
 */
export type PartialDesignSystem = DesignSystemOptions<ComponentStatics, StaticallyComposableHTML>;

/**
 * @public
 */
export type ElementStaticMap = Map<ComponentStatics, StaticallyComposableHTML>;

/**
 * The definition of a component, as `compose<Name>` returns it, or a function that composes it with a design system.
 *
 * @public
 */
export type ComponentDefinition = Promise<FASTElementDefinition> | ((ds: DesignSystem) => Promise<FASTElementDefinition>);

/**
 * The design system of the FAST components: the {@link @adaptive-web/components-foundation#DesignSystem} of the foundation, which defines
 * the components with FAST and gives their styles as FAST `ElementStyles`.
 *
 * @public
 */
export class DesignSystem extends FoundationDesignSystem<ComponentStatics, StaticallyComposableHTML> {
    /**
     * Defines a set of components using the prefix and registry defined with the DesignSystem
     *
     * @remarks
     * Composing a definition is asynchronous in `fast-element` 3, so the components are defined once their definitions are composed.
     *
     * @returns A promise that resolves when the components are defined.
     *
     * @public
     */
    public async defineComponents(components: Record<string, ComponentDefinition>): Promise<void> {
        for (const component of Object.values(components)) {
            if (typeof component === 'function') {
                (await component(this)).define();
                continue;
            }

            let definition = await component;
            const elementNameParts = definition.name.split('-');
            const prefix = elementNameParts.shift();

            if (prefix !== this.prefix) {
                const newDefinition = {
                    ...(definition as unknown as PartialFASTElementDefinition),
                    name: `${this.prefix}-${elementNameParts.join('-')}`
                };

                definition = await FASTElementDefinition.compose(definition.type, newDefinition);
            }

            definition.define(this.registry);
        }
    }

    /**
     * Assembles the styles of a component: its own styles, then its style rules and the rules of its anatomy, rendered with the token library
     * of the design system ({@link @adaptive-web/components-foundation#DesignSystem.renderStyles}).
     *
     * @param defaultStyles - The default collection of styles to use if not overridden by `options.styles`.
     * @param anatomy - The anatomy of the component.
     * @param options - The component options, using `styles` and `styleRules`.
     * @returns The collection of desired styles.
     *
     * @public
     */
    public assembleStyles(
        defaultStyles: ComposableStyles[], anatomy?: ComponentAnatomy<any, any>, options?: ComposeOptions<any>
    ): ElementStyles {
        const componentStyles: ComposableStyles[] = options?.styles ?
            (Array.isArray(options.styles) ? options.styles : [options.styles]) :
            defaultStyles;

        return new ElementStyles([...componentStyles, this.renderStyles(anatomy, options?.styleRules)]);
    }
}

/**
 * The default {@link DesignSystem} configuration.
 *
 * @public
 */
export const DefaultDesignSystem: DesignSystem = new DesignSystem("adaptive");

/**
 * Configuration options for composing an element definition.
 *
 * @public
 */
export type ComposeOptions<TSource, TStatics extends string = any> = {
    template?: (ds: DesignSystem) => ElementViewTemplate<TSource, any>;
    styles?: ElementStyles | ElementStyles[];
    styleRules?: StyleRules;
    shadowOptions?: Partial<ShadowRootOptions>;
    elementOptions?: ElementDefinitionOptions;
    statics?: Record<TStatics, StaticallyComposableHTML>;
}
