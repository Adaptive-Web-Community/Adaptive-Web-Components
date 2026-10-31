import {
    type ComposableStyles,
    type Constructable,
    ElementStyles,
    type ElementViewTemplate,
    FASTElementDefinition,
    type ShadowRootOptions,
} from '@microsoft/fast-element';
import type { ComponentAnatomy, StyleRules } from "@adaptive-web/adaptive-ui";
import {
    type ComponentComposition,
    type DesignSystemOptions,
    DesignSystem as FoundationDesignSystem,
} from "@adaptive-web/components-foundation";
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
 * The definition of a component: a function that composes it with a design system, with `compose<Name>`.
 *
 * @public
 */
export type ComponentDefinition = (ds: DesignSystem) => Promise<FASTElementDefinition>;

/**
 * The design system of the FAST components: the {@link @adaptive-web/components-foundation#DesignSystem} of the foundation, which defines
 * the components with FAST and gives their styles as FAST `ElementStyles`.
 *
 * @public
 */
export class DesignSystem extends FoundationDesignSystem<ComponentStatics, StaticallyComposableHTML> {
    /**
     * Defines a set of components, each composed with this design system: its prefix, its registry, its statics, and its token library.
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
            (await component(this)).define();
        }
    }

    /**
     * Composes the element definition of a component with this design system: its name with the prefix, its statics, its styles rendered
     * with the token library, and the template of the options or the default one.
     *
     * @param type - The class of the element.
     * @param composition - What the component is composed from, of the foundation.
     * @param template - The default template.
     * @param options - The options of the composition.
     * @returns A promise of the definition, which defines the element in the registry of the design system.
     *
     * @public
     */
    public compose<TType extends Constructable<HTMLElement>, TStatics extends ComponentStatics = never>(
        type: TType,
        composition: ComponentComposition<TStatics>,
        template: (ds: DesignSystem) => ElementViewTemplate<InstanceType<TType>, any>,
        options?: ComposeOptions<InstanceType<TType>, TStatics>
    ): Promise<FASTElementDefinition<TType>> {
        this.addStatics(composition, options?.statics);
        const styles = this.assembleStyles([...composition.styles], composition.anatomy, options);

        return FASTElementDefinition.compose(type, {
            name: this.elementName(composition),
            template: (options?.template ?? template)(this),
            styles,
            registry: this.registry,
            elementOptions: options?.elementOptions,
            shadowOptions: options?.shadowOptions,
        });
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
