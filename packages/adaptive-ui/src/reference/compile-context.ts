import { refs } from "design-token-library";
import { type CompileContext } from "../core/compile/context.js";
import { libraryTokenProperties } from "../core/styles/css/rules.js";
import { libraryTreatments } from "../core/styles/treatment-token.js";
import { tokenNames } from "../core/token-names.js";
import { createReferenceLibrary, type ReferenceLibraryTokens } from "./library.js";
import { referenceAnatomyTreatments } from "./treatments.js";

/**
 * A {@link CompileContext} for the reference design system.
 *
 * @public
 */
export function referenceCompileContext(): CompileContext {
    const library = createReferenceLibrary();
    return {
        library,
        names: tokenNames(library),
        tokens: libraryTokenProperties(library, { context: refs<ReferenceLibraryTokens>().color.context }),
        treatments: libraryTreatments(library),
        anatomyTreatments: referenceAnatomyTreatments,
    };
}
