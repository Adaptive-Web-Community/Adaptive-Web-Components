import { adaptiveConverters } from "@adaptive-web/adaptive-ui";
import { createReferenceLibrary, type ReferenceLibraryTokens } from "@adaptive-web/adaptive-ui/reference";
import { type Library, refs, toProperties } from "design-token-library";

/**
 * A library of the shape of the reference system: the explorer's, and the library of each scope, which extends it.
 */
export type ExplorerLibrary = Library.Library<ReferenceLibraryTokens>;

/**
 * The library of the explorer, the reference system. The design system renders the components with it, and the scopes extend it.
 */
export const library: ExplorerLibrary = createReferenceLibrary();

/**
 * The refs of the tokens and the treatments.
 */
export const tokens = refs<ReferenceLibraryTokens>();

/**
 * The custom properties of the tokens, for the styles of the explorer's elements. A token has the same property in every scope, which
 * writes its value.
 */
export const properties = toProperties(library, { converters: adaptiveConverters(library) });
