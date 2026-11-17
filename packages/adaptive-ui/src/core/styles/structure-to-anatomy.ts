import { labelOf } from "../documentation/doc-common.js";
import { type Contract, isConditionProperty, resolveContract } from "../documentation/contract.js";
import { type Structure, structureParts } from "../documentation/structure.js";
import type { DocumentationForBinding } from "./binding.js";
import { type ComponentAnatomy, type CursorDefinition, Focus, type FocusDefinition } from "./anatomy.js";
import type { BindingConditionSelectors, BindingCursor, BindingPartSelectors, PlatformBinding } from "./binding.js";
import type { StyleRuleTarget } from "./rule.js";
import type { StyleProfile } from "./style-profile.js";

function assertStructureBindingAlignment(structure: Structure, partSelectors: BindingPartSelectors): void {
    for (const { id: partKey } of structureParts(structure)) {
        if (!(partKey in partSelectors)) {
            throw new Error(
                `Structure part "${partKey}" has no selector in the platform binding.`,
            );
        }
    }
}

function assertContractBindingAlignment(contract: Contract, conditionSelectors: BindingConditionSelectors): void {
    for (const property of resolveContract(contract).properties.filter(isConditionProperty)) {
        if (!(property.id in conditionSelectors)) {
            throw new Error(
                `Contract property "${property.id}" has no condition selector in the platform binding.`,
            );
        }
    }
}

// The selector of a part id of the binding's focus or cursor.
function partSelector(partSelectors: BindingPartSelectors, part: string, of: string): string {
    const selector = partSelectors[part];
    if (selector === undefined) {
        throw new Error(`Binding ${of} part "${part}" has no selector in the platform binding.`);
    }
    return selector;
}

function targetWithSelector(partSelectors: BindingPartSelectors, target: StyleRuleTarget, of: string): StyleRuleTarget {
    return target.part === undefined ? target : { ...target, part: partSelector(partSelectors, target.part, of) };
}

function focusWithSelectors<TParts extends BindingPartSelectors>(
    partSelectors: TParts,
    focus: FocusDefinition<TParts> | undefined,
): FocusDefinition<TParts> | undefined {
    if (focus === undefined) {
        return undefined;
    }
    return {
        focusTarget: targetWithSelector(partSelectors, focus.focusTarget, "focus target"),
        ...(focus.resetTarget !== undefined
            ? { resetTarget: targetWithSelector(partSelectors, focus.resetTarget, "reset target") }
            : {}),
    };
}

function cursorWithSelector<TParts extends BindingPartSelectors>(
    partSelectors: TParts,
    cursor: BindingCursor<TParts> | false | undefined,
): CursorDefinition | false | undefined {
    if (cursor === undefined || cursor === false || cursor.part === undefined) {
        return cursor;
    }
    return { ...cursor, part: partSelector(partSelectors, cursor.part, "cursor") };
}

// The focus of the first part that indicates focus, with the indicator on it. The binding's own focus (a reset target, focus within a wrapper, or the
// context) takes precedence over this.
function focusOfStructure(structure: Structure): FocusDefinition<any> | undefined {
    // The context first, then the parts in order. Each indicator is the context (undefined) or a part id.
    const indicators: (string | undefined)[] = [
        ...(structure.indicatesFocus ? [undefined] : []),
        ...structureParts(structure).filter(({ part }) => part.indicatesFocus).map(({ id }) => id),
    ];
    if (indicators.length > 1) {
        const name = (id: string | undefined): string => (id === undefined ? "the context" : `"${id}"`);
        console.warn(`Structure has more than one place that indicates focus; the focus is on ${name(indicators[0])}, not ${indicators.slice(1).map(name).join(", ")}.`);
    }
    if (indicators.length === 0) {
        return undefined;
    }
    return indicators[0] === undefined ? Focus.contextFocused() : Focus.partFocused(indicators[0]);
}

/**
 * Options when adapting structure and binding into {@link ComponentAnatomy} for the current renderer.
 *
 * @public
 */
export interface StructureToComponentAnatomyOptions {
    /**
     * When true (default), throws if structure ids are missing from the binding or mismatch record keys.
     */
    readonly validate?: boolean;
}

/**
 * Merges {@link Structure} with {@link PlatformBinding} into {@link ComponentAnatomy} for `renderStyleRules`.
 *
 * @remarks
 * {@link ComponentAnatomy} is the transitional combined shape that inlined selectors with structure.
 * New authoring uses structure plus binding; this adapter remains until the renderer accepts those layers directly.
 *
 * The optional `name` sets legacy {@link ComponentAnatomy.name} for the current compiler only—it is not part of
 * structure. Prefer {@link documentationToComponentAnatomy} so the name comes from {@link IdentitySection.name}.
 *
 * The interactivity, focus, and cursor are the binding's, with the part ids of the focus and the cursor resolved to the binding's selectors. A
 * binding without a focus gets the focus of the first {@link PartDefinition.indicatesFocus} part (a warning for any others).
 *
 * @param structure - Semantic part definitions, which the binding must have a selector for.
 * @param binding - Platform selectors, interactivity, focus, and cursor.
 * @param name - Legacy compile label; omit when the caller does not need {@link ComponentAnatomy.name}.
 * @param options - Validation behavior.
 * @returns Combined anatomy for APIs that still require {@link ComponentAnatomy}.
 *
 * @public
 */
export function structureToComponentAnatomy<
    TConditions extends BindingConditionSelectors,
    TParts extends BindingPartSelectors,
>(
    structure: Structure,
    binding: PlatformBinding<TConditions, TParts>,
    name?: string,
    options?: StructureToComponentAnatomyOptions,
): ComponentAnatomy<TConditions, TParts> {
    if (options?.validate !== false) {
        assertStructureBindingAlignment(structure, binding.partSelectors);
    }

    const { interactivity } = binding;
    const focus = focusWithSelectors(binding.partSelectors, binding.focus ?? focusOfStructure(structure));
    const cursor = cursorWithSelector(binding.partSelectors, binding.cursor);

    const anatomy = {
        conditions: binding.conditionSelectors,
        parts: binding.partSelectors,
        ...(name !== undefined ? { name } : {}),
        ...(binding.contextSelector !== undefined ? { context: binding.contextSelector } : {}),
        ...(interactivity !== undefined ? { interactivity } : {}),
        ...(focus !== undefined ? { focus } : {}),
        ...(cursor !== undefined ? { cursor } : {}),
    } as ComponentAnatomy<TConditions, TParts>;

    return anatomy;
}

/**
 * {@link IdentitySection} and a structure slice for compile {@link ComponentAnatomy.name} and structure.
 *
 * @public
 */
export type DocumentationForAnatomy = DocumentationForBinding;

/**
 * Adapts documentation identity (`name`) and structure plus binding into {@link ComponentAnatomy}.
 *
 * @public
 */
export function documentationToComponentAnatomy<
    TConditions extends BindingConditionSelectors,
    TParts extends BindingPartSelectors,
>(
    documentation: DocumentationForAnatomy,
    binding: PlatformBinding<TConditions, TParts>,
    options?: StructureToComponentAnatomyOptions,
): ComponentAnatomy<TConditions, TParts> {
    if (documentation.structure === undefined) {
        throw new Error("Documentation must include a structure section.");
    }
    if (documentation.contract === undefined) {
        throw new Error("Documentation must include a contract section.");
    }
    if (options?.validate !== false) {
        assertContractBindingAlignment(documentation.contract, binding.conditionSelectors);
    }
    return structureToComponentAnatomy(
        documentation.structure,
        binding,
        labelOf(documentation),
        options,
    );
}

/**
 * Convenience adapter for a {@link StyleProfile}-shaped pair without rules.
 *
 * @param profile - Structure and binding for one platform.
 * @param name - Legacy compile label for {@link ComponentAnatomy.name}.
 * @param options - Validation behavior.
 * @returns Combined anatomy for APIs that still require {@link ComponentAnatomy}.
 *
 * @public
 */
export function styleProfileToComponentAnatomy<
    TConditions extends BindingConditionSelectors,
    TParts extends BindingPartSelectors,
>(
    profile: StyleProfile<TConditions, TParts>,
    name: string,
    options?: StructureToComponentAnatomyOptions,
): ComponentAnatomy<TConditions, TParts> {
    return structureToComponentAnatomy(profile.structure, profile.binding, name, options);
}
