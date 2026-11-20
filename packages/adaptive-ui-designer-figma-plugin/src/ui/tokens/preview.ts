import { atName, formatValue, isInteractiveSet, StyleProperty } from "@adaptive-web/adaptive-ui";
import type { PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";
import { evaluateNodes } from "./evaluator.js";
import { library } from "./library.js";

/**
 * Gets the value of a token in the library of the plugin, as it is shown: the value at rest of an interactive token, and a calculation
 * as its result.
 *
 * @param name - The name of the token
 * @returns The value as CSS, or nothing for a name that isn't a token
 */
export function tokenValueAsString(name: string): string | undefined {
    try {
        const token = atName<{ readonly $type: string; readonly $value: unknown }>(library.tokens, name);
        const value = isInteractiveSet(token.$value) ? token.$value.rest : token.$value;
        return value === undefined || value === null ? undefined : formatValue(value);
    } catch {
        return undefined;
    }
}

// The CSS property that a style property is previewed with, which is the properties that are seen in a small swatch.
const previewProperties: Readonly<Partial<Record<StyleProperty, string>>> = {
    [StyleProperty.backgroundFill]: "background",
    [StyleProperty.foregroundFill]: "color",
    [StyleProperty.borderFillTop]: "border-color",
    [StyleProperty.borderThicknessTop]: "border-width",
    [StyleProperty.borderStyleTop]: "border-style",
    [StyleProperty.cornerRadiusTopLeft]: "border-radius",
    [StyleProperty.fontFamily]: "font-family",
    [StyleProperty.fontSize]: "font-size",
    [StyleProperty.fontWeight]: "font-weight",
    [StyleProperty.fontStyle]: "font-style",
    [StyleProperty.shadow]: "box-shadow",
};

const treatmentStyles = new Map<string, string>();

/**
 * Gets the style of a swatch for a treatment: the properties of the treatment that a small swatch shows, evaluated in the library of the
 * plugin at rest.
 *
 * @param name - The name of the treatment
 * @returns A `style` for an element, which has the properties of the treatment that it can show
 */
export function treatmentPreviewStyle(name: string): string {
    let style = treatmentStyles.get(name);
    if (style === undefined) {
        const node = { appliedTreatments: [name], appliedDesignTokens: {}, additionalData: {}, inheritedDesignTokens: {}, designTokens: {}, children: [], effectiveAppliedStyleValues: {} } as unknown as PluginUINodeData;
        evaluateNodes([node]);
        style = Object.entries(previewProperties)
            .flatMap(([property, css]) => {
                const applied = node.effectiveAppliedStyleValues[property as StyleProperty];
                return applied ? [`${css}: ${formatValue(applied.value)}`] : [];
            })
            .join("; ");
        treatmentStyles.set(name, style);
    }
    return style;
}
