import {
    AdaptiveDesignToken,
    atName,
    type Color,
    evaluate,
    InteractiveState,
    isGradient,
    isInteractiveSet,
    isOnFill,
    isPaint,
    type OnFillWithFill,
    parseColor,
    resolveOnFills,
    resolveTokenName,
    StyleProperty,
    type StyleValues,
    treatmentAt,
    treatmentProperties,
    valueOnFill,
} from "@adaptive-web/adaptive-ui";
import {
    AdditionalDataKeys,
    type AppliedDesignTokens,
    getLogger,
    type PluginUINodeData,
    type ReadonlyAppliedDesignTokens,
    type ReadonlyAppliedTreatments,
    type ReadonlyDesignTokenValues,
    STYLE_REMOVE,
} from "@adaptive-web/adaptive-ui-designer-core";
import type { ReferenceLibraryTokens } from "@adaptive-web/adaptive-ui/reference";
import { isRef, type Library, pathOf, ref } from "design-token-library";
import { library, names, type PluginLibrary, tokens } from "./library.js";
import { parseTokenValue } from "./values.js";

const logger = getLogger().getSubLogger({ name: "Evaluator", minLevel: 2 });

/**
 * Where an applied style is from, in the order that they override each other.
 */
const Source = {
    /** The treatments applied to the main component. */
    componentTreatments: "componentTreatments",
    /** The design tokens applied to the main component. */
    component: "component",
    /** The treatments applied to the node. */
    localTreatments: "localTreatments",
    /** The design tokens applied to the node, which are the ones that are saved from the evaluation. */
    local: "local",
} as const;

type Source = (typeof Source)[keyof typeof Source];

/**
 * A style that is applied to a property of a node, from a source.
 */
interface Applied {
    /**
     * What is applied, or the mark that the style is removed.
     */
    readonly style: StyleValues | typeof STYLE_REMOVE;

    readonly source: Source;

    /**
     * The token that is applied, for a design token applied by name, in the name that it now has.
     */
    readonly token?: string;

    /**
     * The state that the name fixes, for the name of a state of an interactive token.
     */
    readonly state?: InteractiveState;
}

const styleProperties: ReadonlySet<string> = new Set(Object.values(StyleProperty));
const states: ReadonlySet<string> = new Set(Object.values(InteractiveState));

const isStyleProperty = (key: string): key is StyleProperty => styleProperties.has(key);

// The value in a state, which is the one of the rest where the state has none. A state that is null was cleared on purpose.
const inState = <T>(set: { readonly [state in InteractiveState]?: T | null }, state: InteractiveState): T | null | undefined =>
    set[state] === undefined ? set.rest : set[state];

/**
 * Gets the library of a node: its parent's, with the values that the designer gave it, in the order that they override each other, and
 * the color context where the node is in a fill.
 *
 * @remarks
 * A node that has none of them is evaluated in the library of its parent as it is. An extension reads its tokens again (about five times
 * what the library it extends costs, measured on the reference library), and most nodes have nothing of their own.
 */
function extendedBy(parent: PluginLibrary, context: Color | undefined, ...overrides: (ReadonlyDesignTokenValues | undefined)[]): PluginLibrary {
    if (context === undefined && overrides.every(values => values === undefined || Object.keys(values).length === 0)) {
        return parent;
    }
    const extension = parent.extend({});
    if (context !== undefined) {
        extension.tokens.color.context.set(context);
    }
    for (const values of overrides) {
        for (const [name, { value }] of Object.entries(values ?? {})) {
            const resolved = resolveTokenName(names, name);
            if (resolved === undefined || resolved.state !== undefined || !value) {
                logger.warn("    token not found, or not one to give a value to:", name);
                continue;
            }
            try {
                const token = atName<{ readonly $type: string; set(value: unknown): void }>(extension.tokens, resolved.path.join("."));
                const parsed = parseTokenValue(token.$type, value);
                if (parsed === undefined) {
                    logger.warn(`    "${value}" is not a value of the type of ${name}: ${token.$type}`);
                    continue;
                }
                token.set(parsed);
            } catch (e) {
                logger.warn("    token value error", name, e);
            }
        }
    }
    return extension;
}

// The properties of the treatments, by name, which don't depend on the library of a node.
const treatmentCache = new Map<string, ReadonlyMap<string, StyleValues> | undefined>();

function propertiesOfTreatment(name: string): ReadonlyMap<string, StyleValues> | undefined {
    if (!treatmentCache.has(name)) {
        const resolved = resolveTokenName(names, name);
        let properties: Map<string, StyleValues> | undefined;
        try {
            properties = resolved ? treatmentProperties(treatmentAt(library, resolved.name)) : undefined;
        } catch (e) {
            logger.error("Treatment is not a treatment:", name, e);
        }
        if (properties === undefined) {
            logger.error("Treatment not found:", name);
        }
        treatmentCache.set(name, properties);
    }
    return treatmentCache.get(name);
}

function treatmentsApplied(applied: Map<StyleProperty, Applied>, treatments: ReadonlyAppliedTreatments | undefined, source: Source) {
    for (let name of treatments ?? []) {
        const remove = name.startsWith(STYLE_REMOVE);
        if (remove) {
            name = name.replace(STYLE_REMOVE, "");
        }
        for (const [key, style] of propertiesOfTreatment(name) ?? []) {
            if (isStyleProperty(key)) {
                applied.set(key, { style: remove ? STYLE_REMOVE : style, source });
            }
        }
    }
}

function tokensApplied(applied: Map<StyleProperty, Applied>, designTokens: ReadonlyAppliedDesignTokens | undefined, source: Source) {
    for (const [target, token] of Object.entries(designTokens ?? {}) as [StyleProperty, { tokenID: string }][]) {
        if (token.tokenID === STYLE_REMOVE) {
            applied.set(target, { style: STYLE_REMOVE, source });
            continue;
        }
        const resolved = resolveTokenName(names, token.tokenID);
        if (resolved === undefined) {
            logger.error("Token not found:", token.tokenID);
            continue;
        }
        applied.set(target, { style: ref<unknown, ReferenceLibraryTokens>(resolved.path.join(".") as Library.TokenPath<ReferenceLibraryTokens, unknown>), source, token: resolved.name, state: resolved.state });
    }
}

/**
 * Gets the effective styles applied to a node, from the sources in the order they override each other.
 *
 * The marks of what was removed are taken from the node, as they have done their work when the styles are collected.
 */
function collectEffectiveAppliedStyles(node: PluginUINodeData): Map<StyleProperty, Applied> {
    const applied = new Map<StyleProperty, Applied>();

    treatmentsApplied(applied, node.refAppliedTreatments, Source.componentTreatments);
    tokensApplied(applied, node.refAppliedDesignTokens, Source.component);
    treatmentsApplied(applied, node.appliedTreatments, Source.localTreatments);
    tokensApplied(applied, node.appliedDesignTokens, Source.local);

    // Remove the applied styles which have been marked as removed.
    for (let i = node.appliedTreatments.length - 1; i >= 0; i--) {
        if (node.appliedTreatments[i].startsWith(STYLE_REMOVE)) {
            node.appliedTreatments.splice(i, 1);
        }
    }
    for (const [target, token] of Object.entries(node.appliedDesignTokens)) {
        if (token.tokenID === STYLE_REMOVE) {
            delete node.appliedDesignTokens[target as StyleProperty];
        }
    }

    return applied;
}

// The value of a style for a state, which is the value that a node is painted with.
function valueOf(extension: PluginLibrary, style: StyleValues, state: InteractiveState): unknown {
    if (isOnFill(style)) {
        return style.fill === undefined ? valueOf(extension, style.token, state) : inState(valueOnFill(extension, style as OnFillWithFill, tokens.color.context), state);
    }
    if (isRef(style)) {
        const token = atName<{ readonly $type: string; readonly $value: unknown }>(extension.tokens, pathOf(style).join("."));
        const value = token.$type === AdaptiveDesignToken.expression ? evaluate(token.$value as Parameters<typeof evaluate>[0], extension) : token.$value;
        return isInteractiveSet(value) ? inState(value, state) : value;
    }
    if (isInteractiveSet<StyleValues>(style)) {
        const value = inState(style, state);
        return value === undefined || value === null ? value : valueOf(extension, value, state);
    }
    return style;
}

// The styles of the properties, where a value on a fill is on the background fill that is applied, which may come from another treatment.
function withFills(styles: Map<StyleProperty, StyleValues>): Map<StyleProperty, StyleValues> {
    try {
        return resolveOnFills(styles) as Map<StyleProperty, StyleValues>;
    } catch (e) {
        logger.warn("    a value on a fill has no fill that is a token, it is the value of the token alone", e);
        return new Map(Array.from(styles, ([key, style]) => [key, isOnFill(style) ? style.token : style]));
    }
}

function evaluateNode(node: PluginUINodeData, extension: PluginLibrary): void {
    const stateName = node.additionalData[AdditionalDataKeys.state]?.toLowerCase() ?? InteractiveState.rest;
    const state = states.has(stateName) ? (stateName as InteractiveState) : InteractiveState.rest;

    const applied = collectEffectiveAppliedStyles(node);
    const fills = withFills(new Map(Array.from(applied).flatMap(([target, { style }]) => (style === STYLE_REMOVE ? [] : [[target, style] as const]))));
    node.effectiveAppliedStyleValues = {};

    for (const [target, info] of applied) {
        let value: unknown;
        try {
            value = info.style === STYLE_REMOVE ? STYLE_REMOVE : valueOf(extension, fills.get(target) as StyleValues, info.state ?? state);
        } catch (e) {
            logger.error("Value not evaluated:", target, e);
            continue;
        }
        // A state that a style has no value for is not set, and one that is cleared on purpose is removed.
        if (value === undefined) {
            continue;
        }
        node.effectiveAppliedStyleValues[target] = { value: value === null ? STYLE_REMOVE : value };

        if (info.source === Source.local && info.token !== undefined) {
            (node.appliedDesignTokens as AppliedDesignTokens)[target] = { tokenID: info.token };
        }
    }

    // A child is in the context of the fill that is applied to this node, which is how a design tool sees it.
    const fill = node.effectiveAppliedStyleValues[StyleProperty.backgroundFill]?.value;
    for (const child of node.children) {
        const childLibrary = extendedBy(extension, isPaint(fill) && !isGradient(fill) ? fill : undefined, child.refDesignTokens, child.designTokens);
        evaluateNode(child, childLibrary);
    }
}

/**
 * Evaluates the styles that are applied to the nodes, and to their children, into the effective applied style values of each node.
 *
 * @remarks
 * Each node is evaluated in a library that extends the library of its parent, with the values that the designer gave it, and with the color
 * context set to the fill that its parent has. What a node is evaluated with is the plain data of the token types, so it can be sent as it is.
 * A node with no values of its own, and not in a fill, is evaluated in the library of its parent. The library of a node is not kept, and is
 * collected when the evaluation is done.
 *
 * @param nodes - The selected nodes
 */
export function evaluateNodes(nodes: PluginUINodeData[]): void {
    for (const node of nodes) {
        const parentFill = node.additionalData[AdditionalDataKeys.toolParentFillColor];
        const extension = extendedBy(library, parentFill ? parseColor(parentFill) : undefined, node.inheritedDesignTokens, node.refDesignTokens, node.designTokens);
        evaluateNode(node, extension);
    }
}
