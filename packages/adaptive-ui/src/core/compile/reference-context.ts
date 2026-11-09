import { refs } from "design-token-library";
import { createReferenceLibrary, type ReferenceLibraryTokens } from "../../reference/library.js";
import { referenceAnatomyTreatments } from "../../reference/treatments.js";
import { libraryTokenProperties } from "../styles/css/rules.js";
import { libraryTreatments } from "../styles/treatment-token.js";
import { tokenNames } from "../token-names.js";
import { type CompileContext } from "./context.js";

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
