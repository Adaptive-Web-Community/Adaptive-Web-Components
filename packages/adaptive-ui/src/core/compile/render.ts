import { formatRules } from "../styles/css/rules.js";
import { renderStyleRules, styleRulesOnFills } from "../styles/css/style-rules.js";
import { type SerializableOnFill, serializeOnFill } from "../styles/on-fill.js";
import type { CompileContext } from "./context.js";
import type { CompileStyleSheet } from "./stylesheet.js";

/**
 * Renders a compile stylesheet to a CSS string, without formatting or minification.
 *
 * @public
 */
export function compileStyleRulesToCss(sheet: CompileStyleSheet, context: CompileContext): string {
    return formatRules(renderStyleRules(sheet.rules, {
        tokens: context.tokens,
        treatments: context.treatments,
        anatomy: sheet.anatomy,
        anatomyTreatments: context.anatomyTreatments,
    }));
}

/**
 * Gets the values on a fill of a compile stylesheet, written as data for the CSS of the tokens.
 *
 * @public
 */
export function onFillsFromStyleSheet(sheet: CompileStyleSheet, context: CompileContext): SerializableOnFill[] {
    return styleRulesOnFills(sheet.rules, {
        treatments: context.treatments,
        anatomy: sheet.anatomy,
        anatomyTreatments: context.anatomyTreatments,
    }).map(value => serializeOnFill(value));
}
