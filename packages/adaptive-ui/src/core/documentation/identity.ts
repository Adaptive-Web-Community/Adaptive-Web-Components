/**
 * Required identity fields on a documentation record.
 *
 * @public
 */
export interface Identity {
    /**
     * Stable camelCase id of the component or pattern (for example `button`, `textField`).
     */
    readonly id: string;

    /**
     * Readable label, when it isn't the one made from the id (`textField` is `Text Field`).
     */
    readonly label?: string;

    /**
     * Consumer-facing definition and overview (Markdown).
     */
    readonly definition?: string;
}

/**
 * Identity section of a documentation record. Extend {@link Identity} to add consumer fields at the top level.
 *
 * @remarks
 * {@link Identity.id} is the only required field on a documentation record.
 *
 * @public
 */
export type IdentitySection<TIdentity extends Identity = Identity> = TIdentity;
