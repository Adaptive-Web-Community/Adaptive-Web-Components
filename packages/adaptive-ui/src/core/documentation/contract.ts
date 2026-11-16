/**
 * Product-facing contract: author-facing properties and content slots.
 *
 * @remarks
 * Document every slot the reference implementation exposes, including the default (unnamed) slot.
 * {@link Structure.parts} are style hooks; they do not replace slot documentation.
 *
 * Contract properties are also the semantic condition ids style bindings and themes key on—there is no
 * separate `conditions` map on {@link Structure}.
 *
 * @public
 */
export interface Contract {
    /**
     * Properties, attributes, and states as consuming teams should understand them.
     */
    readonly properties: readonly ContractProperty[];

    /**
     * Content slots (default and named). Use an empty array only when the host has no slotted content API.
     */
    readonly slots: readonly ContractSlot[];
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
