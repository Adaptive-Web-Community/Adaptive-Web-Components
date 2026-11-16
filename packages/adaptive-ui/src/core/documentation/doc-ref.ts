/**
 * Stable, library-neutral pointer to another documentation record.
 *
 * @remarks
 * Generators resolve this through a {@link DocLinkContext} (catalog, Storybook scope, design-system id)—
 * not by storing Storybook or product URLs in authored doc data.
 *
 * @public
 */
export interface DocRef {
    /**
     * Stable camelCase id within the catalog (for example `button`, `textField`, `formLayout`).
     */
    readonly id: string;

    /**
     * Optional scope when the same id exists in more than one library (for example package name).
     */
    readonly library?: string;
}

/**
 * Inputs for resolving {@link DocRef} to a consumer-specific URL or path.
 *
 * @public
 */
export interface DocLinkContext {
    /**
     * Catalog or design-system id that owns the documentation set.
     */
    readonly catalogId: string;

    /**
     * Optional base URL for relative resolution (portal root, Storybook deploy URL, etc.).
     */
    readonly baseUrl?: string;
}

/**
 * Resolves durable {@link DocRef} values to links for a given catalog (Storybook, portal, IDE).
 *
 * @param ref - The documentation pointer to resolve.
 * @param context - Catalog and base URL for link generation.
 * @returns A URL or path, or `undefined` when the ref is not in the catalog.
 *
 * @public
 */
export type DocRefResolver = (ref: DocRef, context: DocLinkContext) => string | undefined;
