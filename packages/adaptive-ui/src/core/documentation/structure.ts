import type { DocRef } from "./doc-ref.js";

/**
 * A styleable or structural part of a component.
 *
 * @public
 */
export interface PartDefinition {
    /**
     * Display label for docs.
     */
    readonly label?: string;

    /**
     * Purpose of the part (Markdown).
     */
    readonly description?: string;

    /**
     * The part does something when the user acts on it (for example handles a click), so it can present as interactive.
     */
    readonly interactive?: boolean;

    /**
     * Focus presents on this part: the focus indicator is drawn here, which may not be the element that takes focus. A component may have more
     * than one (a stepper's up and down), each indicating at different times.
     *
     * @remarks
     * Which element takes focus, how the platform's own indicator is reset there, and the selector that matches focus are {@link PlatformBinding} details.
     */
    readonly indicatesFocus?: boolean;

    /**
     * The parts inside this one, keyed by stable camelCase id (the key is the id; entries do not repeat it).
     *
     * @remarks
     * Ids are unique across the whole structure, so a binding maps each id to a selector in one flat map. The nesting says what is inside what,
     * for instance an interactive part inside an interactive context.
     */
    readonly parts?: Record<string, PartDefinition>;

    /**
     * The part is an instance of another component (a button inside a carousel), which has its own documentation and structure.
     */
    readonly component?: DocRef;
}

/**
 * Semantic structure slice of {@link Documentation}: the tree of a component's parts, whose root is the component's context.
 *
 * @remarks
 * The structure is the context part itself: its own markers, like `interactive` and `indicatesFocus`, are those of
 * the context, and its `parts` are the tree below it.
 *
 * Visual and state differentiations authors style against are {@link ContractProperty} ids on the contract slice;
 * {@link PlatformBinding.conditions} maps those ids to platform selectors. Interactivity, focus, and cursor are styled on a platform, so they
 * are in {@link PlatformBinding}.
 *
 * @public
 */
export interface Structure extends PartDefinition {}

/**
 * A part below the context of a structure, with where it is.
 *
 * @public
 */
export interface StructurePart {
    /**
     * The id of the part.
     */
    readonly id: string;

    /**
     * The definition of the part.
     */
    readonly part: PartDefinition;

    /**
     * The id of the part it is in, or `undefined` if it is directly in the context.
     */
    readonly parent?: string;
}

/**
 * The parts below the context of a structure, depth first in the order written.
 *
 * @param structure - The structure
 * @returns Each part with its parent
 * @throws An error for an id used by more than one part
 *
 * @public
 */
export function structureParts(structure: Structure): StructurePart[] {
    const found: StructurePart[] = [];
    const ids = new Set<string>();
    const walk = (parts: Record<string, PartDefinition> | undefined, parent: string | undefined): void => {
        for (const [id, part] of Object.entries(parts ?? {})) {
            if (ids.has(id)) {
                throw new Error(`Structure part "${id}" is used more than once; part ids are unique across the structure.`);
            }
            ids.add(id);
            found.push({ id, part, parent });
            walk(part.parts, id);
        }
    };
    walk(structure.parts, undefined);
    return found;
}

/**
 * Semantic structure section of a documentation record.
 *
 * @public
 */
export type StructureSection<TStructure extends Structure = Structure> = {
    readonly structure?: TStructure;
};
