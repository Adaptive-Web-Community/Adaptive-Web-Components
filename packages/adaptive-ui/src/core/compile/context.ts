import type { Library } from "design-token-library";
import type { TokenNameIndex } from "../token-names.js";
import type { AnatomyTreatments } from "../styles/css/style-rules.js";
import type { TokenPropertiesResolver } from "../styles/css/rules.js";
import type { TreatmentResolver } from "../styles/treatment-token.js";

/**
 * What a JSON anatomy and style rules compile with.
 *
 * @public
 */
export interface CompileContext {
    /** The token library whose names and treatments the compile reads. */
    readonly library: Library.Library<any>;

    /** The names that find tokens in {@link CompileContext.library}. */
    readonly names: TokenNameIndex;

    /** The token custom properties that style rules resolve. */
    readonly tokens: TokenPropertiesResolver;

    /** The treatments that style rules resolve. */
    readonly treatments: TreatmentResolver;

    /** The treatments that component anatomy applies. */
    readonly anatomyTreatments: AnatomyTreatments;
}

/**
 * Reports a non-fatal issue while compiling JSON anatomy, like a renamed or unknown token name.
 *
 * @public
 */
export type CompileWarn = (message: string) => void;
