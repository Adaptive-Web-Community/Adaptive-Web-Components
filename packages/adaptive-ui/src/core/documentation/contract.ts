/**
 * Product-facing contract: author-facing properties and content slots.
 *
 * @remarks
 * Document every slot the reference implementation exposes, including the default (unnamed) slot.
 * {@link Structure.parts} are style hooks; they do not replace slot documentation.
 *
 * The boolean and enumerated properties are also the semantic condition ids style bindings and themes key on (see
 * {@link ContractProperty.condition})—there is no separate `conditions` map on {@link Structure}.
 *
 * @public
 */
export interface Contract {
    /**
     * Contracts shared with other components (a text field, a text area, and a search are each a text input), whose properties and slots
     * this one has too.
     *
     * @remarks
     * Included by value, so the literal ids stay for {@link PlatformBindingFor}. A property or slot of the same id here overrides the
     * included one, to describe it for this component: it may change the label and the description, and nothing of its type (see
     * {@link resolveContract}). Use {@link resolveContract} for the whole contract.
     */
    readonly include?: readonly ContractInclude[];

    /**
     * Properties, attributes, and states as consuming teams should understand them, in addition to the included ones.
     */
    readonly properties: readonly ContractProperty[];

    /**
     * Content slots (default and named), in addition to the included ones. Use an empty array only when the host has no slotted content API.
     */
    readonly slots: readonly ContractSlot[];
}

/**
 * A contract shared by components, as {@link Contract.include} takes it: a documentation record with a contract, like the one of an abstract
 * component or an interface, which may have no structure of its own.
 *
 * @public
 */
export interface ContractInclude {
    /**
     * Id of the documented interface (`textInput`), which names its generated contract (`TextInputContract`).
     */
    readonly id: string;

    /**
     * The contract that is shared.
     */
    readonly contract: Contract;
}

/**
 * The properties of a {@link Contract} and of everything it includes, by type, with the literal ids that {@link defineDocumentation} keeps.
 *
 * @public
 */
export type ContractProperties<TContract extends Contract> =
    | TContract["properties"][number]
    | (TContract extends { readonly include: readonly (infer TInclude)[] }
          ? TInclude extends { readonly contract: infer TIncluded extends Contract }
              ? ContractProperties<TIncluded>
              : never
          : never);

type ConditionProperty<TProperty> = TProperty extends { readonly kind: "boolean" | "enum" }
    ? TProperty extends { readonly condition: false } ? never : TProperty
    : never;

/**
 * The properties of a {@link Contract} and of everything it includes that are style conditions (see {@link ContractProperty.condition}).
 *
 * @public
 */
export type ContractConditionProperties<TContract extends Contract> = ConditionProperty<ContractProperties<TContract>>;

/**
 * Whether a property is a style condition: it is a boolean or enumerated property, and not `condition: false`.
 *
 * @param property - The contract property
 * @returns Whether a binding selects the property as a condition
 *
 * @public
 */
export function isConditionProperty(property: ContractProperty): boolean {
    return (property.kind === ContractPropertyKind.boolean || property.kind === ContractPropertyKind.enum) && property.condition !== false;
}

/**
 * A {@link Contract} with what it includes merged in: the properties and slots that the component has.
 *
 * @public
 */
export type ResolvedContract = Pick<Contract, "properties" | "slots">;

/**
 * Merges what a {@link Contract} includes with its own properties and slots.
 *
 * @remarks
 * What is included comes first, in the order of `include`, then the contract's own. A property or slot of an id that was included takes its
 * place and its text (`label`, `description`), and may not change what it is: the same kind, nullability, and condition, so the component
 * can't diverge from the interface that it includes.
 *
 * @param contract - The contract, with or without `include`
 * @returns The properties and slots of the whole contract
 * @throws If an own property overrides an included one with another kind, nullability, or condition
 *
 * @public
 */
export function resolveContract(contract: Contract): ResolvedContract {
    const properties = new Map<string, ContractProperty>();
    const slots = new Map<string, ContractSlot>();

    const add = (source: Contract): void => {
        for (const included of source.include ?? []) {
            add(included.contract);
        }
        for (const property of source.properties) {
            const base = properties.get(property.id);
            if (
                base !== undefined &&
                (base.kind !== property.kind ||
                    (base.nullable ?? false) !== (property.nullable ?? false) ||
                    isConditionProperty(base) !== isConditionProperty(property))
            ) {
                throw new Error(
                    `Contract property "${property.id}" overrides the included one with another kind, nullability, or condition; it may change only its text.`,
                );
            }
            properties.set(property.id, property);
        }
        for (const slot of source.slots) {
            slots.set(slot.id, slot);
        }
    };
    add(contract);

    return { properties: [...properties.values()], slots: [...slots.values()] };
}

/**
 * Product-facing contract section of a documentation record.
 *
 * @public
 */
export type ContractSection<TContract extends Contract = Contract> = {
    readonly contract?: TContract;
};

/**
 * Documented scalar and structured types for {@link ContractProperty}.
 *
 * @public
 */
export const ContractPropertyKind = {
    boolean: "boolean",
    string: "string",
    number: "number",
    enum: "enum",
    object: "object",
} as const;

/** @public */
export type ContractPropertyKind = (typeof ContractPropertyKind)[keyof typeof ContractPropertyKind];

/**
 * Scalar kinds allowed on fields of an object-typed {@link ContractProperty}.
 *
 * @public
 */
export type ContractObjectFieldKind = Exclude<ContractPropertyKind, "enum" | "object">;

/**
 * One field on an object-typed contract property.
 *
 * @public
 */
export interface ContractObjectField {
    /**
     * Stable camelCase field id.
     */
    readonly id: string;

    /**
     * Documented type of the field.
     */
    readonly kind: ContractObjectFieldKind;

    /**
     * Display label for docs tables.
     */
    readonly label?: string;

    /**
     * Field semantics (Markdown).
     */
    readonly description?: string;
}

/**
 * One author-facing property, attribute, or state on the component contract.
 *
 * @public
 */
export interface ContractProperty {
    /**
     * Stable camelCase id aligned with binding condition keys and contract naming.
     */
    readonly id: string;

    /**
     * Consumer-facing name for tables and Storybook.
     */
    readonly label?: string;

    /**
     * Semantics of the property or state (Markdown).
     */
    readonly description?: string;

    /**
     * Documented type of the property. Use `enum` with {@link ContractProperty.enumValues}; use `object` with
     * {@link ContractProperty.objectProperties}.
     */
    readonly kind: ContractPropertyKind;

    /**
     * Whether the property can be `null`: it has no value, like an attribute that isn't set. `null` is the one way a property says so;
     * `undefined` isn't a state of a property of an element, which always has a value.
     *
     * @remarks
     * Not for a boolean, which is `false` when it isn't set.
     */
    readonly nullable?: boolean;

    /**
     * `false` when a boolean or enumerated property isn't a style condition. Each of the others is one, which a platform binding selects
     * (`checked`, `orientation`).
     *
     * @remarks
     * A condition is a state that the component presents and styles key on, so its values are a known set: a string or a number
     * property is never one. A boolean or an enumerated property that only configures behavior says so with `false`.
     */
    readonly condition?: false;

    /**
     * Allowed values when {@link ContractProperty.kind} is `enum`.
     */
    readonly enumValues?: readonly ContractEnumValue[];

    /**
     * Field definitions when {@link ContractProperty.kind} is `object`.
     */
    readonly objectProperties?: readonly ContractObjectField[];
}

/**
 * One allowed or documented value for an enum {@link ContractProperty}.
 *
 * @public
 */
export interface ContractEnumValue {
    /**
     * Stable value id (for example `primary`, `readOnly`).
     */
    readonly id: string;

    /**
     * Display label for the value.
     */
    readonly label?: string;

    /**
     * When to use this value (Markdown).
     */
    readonly description?: string;
}

/**
 * One content slot on the component contract.
 *
 * @public
 */
export interface ContractSlot {
    /**
     * Stable slot id: `default` for the primary unnamed slot; otherwise the HTML `slot` / `name` value
     * (for example `start`, `end`).
     */
    readonly id: string;

    /**
     * Display label for docs tables.
     */
    readonly label?: string;

    /**
     * What authors should place in this slot (Markdown).
     */
    readonly description?: string;
}
