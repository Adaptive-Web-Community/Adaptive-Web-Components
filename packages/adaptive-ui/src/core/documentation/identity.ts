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

    /**
     * What a reader needs after the definition: details of how it behaves or is to be used (Markdown, paragraphs separated by a blank line).
     *
     * @remarks
     * Rendered after the definition in the Markdown projection, and as the `@remarks` of the generated TypeScript contract.
     */
    readonly remarks?: string;
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
