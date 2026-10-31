import type { ComponentAnatomy } from "@adaptive-web/adaptive-ui";

/**
 * What a design system composes a component from, whatever framework binds it: the name of its element, its CSS, its anatomy, and the
 * keys of its statics.
 *
 * @remarks
 * A framework's design system composes the element with the class and the template of its binding, and the options of the composition.
 *
 * @public
 */
export interface ComponentComposition<TStatics extends string = never> {
    /** The name of the element after the prefix of a design system: `button`, of `adaptive-button`. */
    readonly name: string;

    /** The CSS of the component, which the `styles` of the options replace. */
    readonly styles: readonly string[];

    /** The anatomy of the component, whose rules are rendered with the style rules of the options. */
    readonly anatomy: ComponentAnatomy<any, any>;

    /** The keys of the statics that the template renders, whose values the `statics` of the options give. */
    readonly statics?: readonly TStatics[];
}
