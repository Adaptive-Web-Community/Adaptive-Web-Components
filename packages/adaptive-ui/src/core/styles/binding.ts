import type { Contract } from "../documentation/contract.js";
import type { IdentitySection } from "../documentation/identity.js";
import type { Structure } from "../documentation/structure.js";
import type {
    ComponentConditions,
    ComponentParts,
    Condition,
    FocusDefinition,
    InteractivityDefinition,
} from "./anatomy.js";

/**
 * Documentation record shape required to type-check a {@link PlatformBinding}.
 *
 * @public
 */
export type DocumentationForBinding = IdentitySection & {
    readonly structure: Structure;
    readonly contract: Contract;
};

/**
 * Contract property ids on a {@link Contract}.
 *
 * @public
 */
export type ContractPropertyId<TContract extends Contract> =
    TContract["properties"][number]["id"];

/**
 * Structure part ids on a {@link Structure}, at every level of its tree.
 *
 * @public
 */
export type StructurePartId<TStructure> = TStructure extends { readonly parts: infer TParts }
    ? { [K in keyof TParts & string]: K | StructurePartId<TParts[K]> }[keyof TParts & string]
    : never;

/**
 * The selectors of a contract property: one selector, or for an enumerated property one for each of its {@link ContractEnumValue} ids.
 *
 * @public
 */
export type ConditionSelectorFor<TProperty> = TProperty extends {
    readonly kind: "enum";
    readonly enumValues: readonly (infer TValue extends { readonly id: string })[];
}
    ? { readonly [K in TValue["id"]]: string }
    : string;

/**
 * Condition selector map with one entry per {@link ContractProperty.id}, each typed from its property (see {@link ConditionSelectorFor}).
 *
 * @remarks
 * Typed from the literal ids of the documentation, which {@link defineDocumentation} keeps.
 *
 * @public
 */
export type BindingConditionSelectorsFor<TContract extends Contract> = {
    readonly [TProperty in TContract["properties"][number] as TProperty["id"]]: ConditionSelectorFor<TProperty>;
};

/**
 * Part selector map with one platform selector per structure part id.
 *
 * @public
 */
export type BindingPartSelectorsFor<TStructure extends Structure> = {
    readonly [K in StructurePartId<TStructure>]: string;
};

/**
 * {@link PlatformBinding} typed from a documentation record's contract and structure slices.
 *
 * @public
 */
export type PlatformBindingFor<TDoc extends DocumentationForBinding> = PlatformBinding<
    BindingConditionSelectorsFor<TDoc["contract"]>,
    BindingPartSelectorsFor<TDoc["structure"]>
>;

/**
 * Maps each structure condition id to platform selectors (boolean) or value-to-selector maps (enum).
 *
 * @remarks
 * Keys align with {@link ContractProperty.id} on the component contract. This is the long-term binding shape;
 * {@link ComponentConditions} is the same type, also used on {@link ComponentAnatomy} during migration.
 *
 * @public
 */
export type BindingConditionSelectors = ComponentConditions;

/**
 * Maps each structure part id to a selector or equivalent target on this platform.
 *
 * @remarks
 * Keys align with {@link Structure.parts}. {@link ComponentParts} is the same type.
 *
 * @public
 */
export type BindingPartSelectors = ComponentParts;

/**
 * Platform selector entry for one condition.
 *
 * @public
 */
export type BindingConditionSelector = Condition;

/**
 * The cursor of an interactive component on a platform, on a part named by its id.
 *
 * @public
 */
export interface BindingCursor<TParts extends BindingPartSelectors = BindingPartSelectors> {
    /**
     * The part id that shows the cursor; the part of the focus target when omitted.
     */
    readonly part?: keyof TParts & string;

    /**
     * The cursor keyword (for example `pointer`, `text`); `pointer` when omitted.
     */
    readonly cursorType?: string;
}

/**
 * Per-platform mapping from semantic structure ids to selectors, classes, and compile-time interactivity, focus, and cursor.
 *
 * @remarks
 * Interactivity, focus, and cursor are here and not in {@link Structure}: they say how a platform selects and styles the states, the
 * focus indicator, the reset of the platform's own indicator, and the pointer. The parts of `focus` and `cursor` are part ids, which the
 * adapter resolves through `partSelectors`.
 *
 * @public
 */
export interface PlatformBinding<
    TConditions extends BindingConditionSelectors = BindingConditionSelectors,
    TParts extends BindingPartSelectors = BindingPartSelectors,
> {
    /**
     * Selector of the context element, the root of the component's structure; the renderer's default when omitted.
     */
    readonly contextSelector?: string;

    /**
     * Condition id to platform selector map (see {@link BindingConditionSelectors}).
     */
    readonly conditionSelectors: TConditions;

    /**
     * Part id to platform selector map (see {@link BindingPartSelectors}).
     */
    readonly partSelectors: TParts;

    /**
     * Platform selectors for interactive, hover, active, focus, and disabled gating.
     */
    readonly interactivity?: InteractivityDefinition;

    /**
     * Focus indicator and reset targets for the style renderer, with parts as part ids, like the presets of `Focus`.
     */
    readonly focus?: FocusDefinition<TParts>;

    /**
     * The cursor, or `false` to disable automatic cursor generation.
     */
    readonly cursor?: BindingCursor<TParts> | false;
}
