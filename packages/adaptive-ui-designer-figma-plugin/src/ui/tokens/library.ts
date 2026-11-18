import { adaptiveConverters, tokenNames } from "@adaptive-web/adaptive-ui";
import { createReferenceLibrary, type ReferenceLibraryTokens } from "@adaptive-web/adaptive-ui/reference";
import { type Library, refs, toProperties } from "design-token-library";

/**
 * A library of the shape of the reference system: the plugin's, and the library of each node, which extends the library of its parent.
 */
export type PluginLibrary = Library.Library<ReferenceLibraryTokens>;

/**
 * The library of the plugin, the reference system. A node never sets a value on it: the library of each node extends it.
 */
export const library: PluginLibrary = createReferenceLibrary();

/**
 * The refs of the tokens and the treatments.
 */
export const tokens = refs<ReferenceLibraryTokens>();

/**
 * The custom properties of the tokens, for the styles of the plugin's own elements.
 */
export const properties = toProperties(library, { converters: adaptiveConverters(library) });

/**
 * The names that find the tokens of the library, for the names that a design file stored.
 */
export const names = tokenNames(library);
