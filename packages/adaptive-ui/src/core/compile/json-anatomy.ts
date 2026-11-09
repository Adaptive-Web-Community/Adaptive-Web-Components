import {
    type SerializableAnatomy,
    type SerializableBooleanCondition,
    type SerializableStringCondition,
    type SerializableStyleRule,
} from "../styles/anatomy.js";
import { InteractiveState } from "../interactive.js";
import { deserializeOnFill, isSerializableOnFill, type OnFill, type SerializableOnFill } from "../styles/on-fill.js";
import { type StyleProperties, type StyleValues } from "../styles/properties.js";
import { type StyleRule, type StyleRuleTarget } from "../styles/rule.js";
import { isTreatmentRef, type TreatmentRef } from "../styles/treatment-token.js";
import { type ResolvedTokenName, resolveTokenName } from "../token-names.js";
import { refAt } from "../token-ref.js";
import { type CompileContext, type CompileWarn } from "./context.js";
import { type CompileStyleSheet } from "./stylesheet.js";

type PartResolution =
    | { kind: "context" }
    | { kind: "resolved"; selector: string }
    | { kind: "invalid"; partName: string };

function resolvePart(anatomy: SerializableAnatomy, part?: string): PartResolution {
    if (!part) {
        return { kind: "context" };
    }

    const selector = anatomy.parts[part];
    if (selector === undefined) {
        return { kind: "invalid", partName: part };
    }

    return { kind: "resolved", selector };
}

function partFromResolution(resolution: PartResolution): string | undefined {
    return resolution.kind === "resolved" ? resolution.selector : undefined;
}

function createCondition(obj: SerializableAnatomy, style: SerializableStyleRule): string | undefined {
    if (style.contextCondition) {
        const conditionSelectors = Object.entries(style.contextCondition).map(entry => {
            const conditionKey = entry[0];
            const value = entry[1];

            const condition = obj.conditions[conditionKey];
            if (typeof value === "string") {
                return (condition as SerializableStringCondition)[value];
            } else {
                if (value === false) {
                    return `:not(${condition as SerializableBooleanCondition})`;
                } else {
                    return condition as SerializableBooleanCondition;
                }
            }
        });
        return conditionSelectors.join("");
    }
}

/**
 * Turns a JSON anatomy into style rules and anatomy data using the names and treatments of a {@link CompileContext}.
 *
 * @public
 */
export function jsonToStyleSheet(
    obj: SerializableAnatomy,
    context: CompileContext,
    warn?: CompileWarn,
): CompileStyleSheet {
    const report = warn ?? (() => undefined);
    const tokenOf = (name: string): ResolvedTokenName | undefined => {
        const found = resolveTokenName(context.names, name);
        if (found?.renamed) {
            report(`The token "${name}" was renamed to "${found.name}", update the source.`);
        }
        if (found !== undefined && found.deprecated !== false) {
            const why = typeof found.deprecated === "string" ? ` ${found.deprecated}` : "";
            report(`The token "${found.name}" is deprecated.${why}`);
        }
        return found;
    };

    const propertyValue = (value: string): StyleValues | undefined => {
        const found = tokenOf(value);
        if (found === undefined) {
            return value;
        }
        if (found.state === undefined) {
            return refAt(found.path);
        }
        if (found.state === InteractiveState.rest) {
            return { rest: refAt(found.path) };
        }
        report(`The token "${value}" is a state of an interactive token, which only its rest can be used as, skipping.`);
        return undefined;
    };

    const treatmentOf = (name: string): TreatmentRef | undefined => {
        const found = tokenOf(name);
        if (found === undefined || found.state !== undefined) {
            return undefined;
        }
        const ref = refAt(found.path);
        return isTreatmentRef(context.library, ref) ? ref : undefined;
    };

    const onFillValue = (value: SerializableOnFill, property: string): OnFill | undefined => {
        const pathOf = (name: string): string | undefined => {
            const found = tokenOf(name);
            if (found === undefined || found.state !== undefined) {
                report(`Unknown token "${name}" in the value on a fill of ${property}, skipping.`);
                return undefined;
            }
            return found.path.join(".");
        };
        const token = pathOf(value.token);
        const fill = value.fill === undefined ? undefined : pathOf(value.fill);
        if (token === undefined || (value.fill !== undefined && fill === undefined)) {
            return undefined;
        }
        return deserializeOnFill({ ...value, token, ...(fill !== undefined && { fill }) });
    };

    const warnUnknownPart = (partName: string, partContext: string): void => {
        report(`Unknown part "${partName}" in ${partContext}, skipping.`);
    };

    const sheet: CompileStyleSheet = {
        anatomy: {
            name: obj.name,
            context: obj.context,
            conditions: obj.conditions,
            parts: obj.parts,
            interactivity: obj.interactivity,
            focus: obj.focus,
            cursor: obj.cursor,
        },
        rules: obj.styleRules.flatMap(style => {
            const partResolution = resolvePart(obj, style.part);
            if (partResolution.kind === "invalid") {
                warnUnknownPart(partResolution.partName, "style rule");
                return [];
            }

            const treatments = [...(style.styles ?? []), ...(style.treatments ?? [])].flatMap(name => {
                const treatment = treatmentOf(name);
                if (treatment === undefined) {
                    report(`Unknown treatment "${name}" in style rule, skipping.`);
                    return [];
                }
                return [treatment];
            });

            const properties: StyleProperties = {};
            if (style.properties) {
                for (const [target, value] of Object.entries(style.properties)) {
                    properties[target] = isSerializableOnFill(value) ? onFillValue(value, target) : propertyValue(value);
                }
            }

            const target: StyleRuleTarget = {
                context: obj.context,
                contextCondition: createCondition(obj, style),
                stateOnContext: style.stateOnContext,
                part: partFromResolution(partResolution),
            };

            const rule: StyleRule = {
                target,
                treatments,
                properties,
            };

            return [rule];
        }),
    };

    if (sheet.anatomy.focus) {
        const focusTargetResolution = resolvePart(obj, sheet.anatomy.focus.focusTarget.part);
        if (focusTargetResolution.kind === "invalid") {
            warnUnknownPart(focusTargetResolution.partName, "focus.focusTarget");
            delete sheet.anatomy.focus;
        } else {
            sheet.anatomy.focus.focusTarget.part = partFromResolution(focusTargetResolution);

            if (sheet.anatomy.focus.resetTarget) {
                const resetTargetResolution = resolvePart(obj, sheet.anatomy.focus.resetTarget.part);
                if (resetTargetResolution.kind === "invalid") {
                    warnUnknownPart(resetTargetResolution.partName, "focus.resetTarget");
                    delete sheet.anatomy.focus.resetTarget;
                } else {
                    sheet.anatomy.focus.resetTarget.part = partFromResolution(resetTargetResolution);
                }
            }
        }
    }

    if (sheet.anatomy.cursor && typeof sheet.anatomy.cursor === "object" && sheet.anatomy.cursor.part) {
        const cursorPartResolution = resolvePart(obj, sheet.anatomy.cursor.part);
        if (cursorPartResolution.kind === "invalid") {
            warnUnknownPart(cursorPartResolution.partName, "cursor");
            sheet.anatomy.cursor.part = undefined;
        } else {
            sheet.anatomy.cursor.part = partFromResolution(cursorPartResolution);
        }
    }

    return sheet;
}
