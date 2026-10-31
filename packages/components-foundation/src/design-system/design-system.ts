import {
    adaptiveConverters,
    type AnatomyTreatments,
    type ComponentAnatomy,
    formatRules,
    libraryTokenProperties,
    libraryTreatments,
    onFillCSS,
    type OnFillWithFill,
    renderStyleRules,
    type StyleRule,
    type StyleRules,
    styleRulesOnFills,
    type StyleRuleTarget,
} from "@adaptive-web/adaptive-ui";
import { createReferenceLibrary, referenceAnatomyTreatments, type ReferenceLibraryTokens } from "@adaptive-web/adaptive-ui/reference";
import { type Library, pathOf, refs, toCSS } from "design-token-library";

/**
 * What {@link DesignSystem.configure} changes of a design system.
 *
 * @public
 */
export interface DesignSystemOptions<TKey extends string = string, TStatic = unknown> {
    /** The prefix of the names of the elements. */
    readonly prefix?: string;

    /** The registry that the elements are defined in. */
    readonly registry?: CustomElementRegistry;

    /** The statics of the components, such as icons, by their key. */
    readonly statics?: Map<TKey, TStatic>;

    /** The token library that the styles are rendered with. */
    readonly library?: Library.Library<any>;

    /** The treatments that the anatomy of each component applies. */
    readonly anatomyTreatments?: AnatomyTreatments;
}

// The token of the color context, which a value on a fill is made in the context of. A library of a design system has the shape of the
// reference library.
const colorContext = refs<ReferenceLibraryTokens>().color.context;

/**
 * What brings a set of components together, whatever framework binds them: the prefix and the registry of their elements, their statics,
 * and the token library that their styles are rendered with.
 *
 * @remarks
 * The styles of the components are rendered with the token library of the design system: the rules refer to the custom properties of its
 * tokens, which {@link DesignSystem.adoptTokenStyles} writes. See `docs/decisions/0017-a-design-system-renders-the-styles-with-its-library.md`.
 * A framework's components extend it, to define their elements and to give their framework the styles.
 *
 * @public
 */
export class DesignSystem<TKey extends string = string, TStatic = unknown> {
    // The values on a fill of the components composed with this design system, for the token styles.
    private readonly _onFills = new Map<string, OnFillWithFill>();
    // The sheets of the token styles, with the selector of each.
    private readonly _tokenSheets = new Map<CSSStyleSheet, string>();
    private readonly _libraryChanged = { onChange: () => this.updateTokenStyles() };

    constructor(
        private _prefix: string,
        private _registry: CustomElementRegistry = customElements,
        private _statics: Map<TKey, TStatic> = new Map(),
        private _library: Library.Library<any> = createReferenceLibrary(),
        private _anatomyTreatments: AnatomyTreatments = referenceAnatomyTreatments,
    ) {}

    public get prefix() {
        return this._prefix;
    }

    public get registry() {
        return this._registry;
    }

    public get statics() {
        return this._statics;
    }

    /**
     * The token library that the styles of the components are rendered with, and whose tokens {@link DesignSystem.adoptTokenStyles} writes.
     * A library of the shape of the reference library, by default `createReferenceLibrary()`.
     */
    public get library() {
        return this._library;
    }

    /**
     * The treatments that the anatomy of each component applies, by default `referenceAnatomyTreatments`.
     */
    public get anatomyTreatments() {
        return this._anatomyTreatments;
    }

    /**
     * Overrides DesignSystem properties.
     */
    public configure(options: DesignSystemOptions<TKey, TStatic>): this {
        this._prefix = options.prefix ?? this._prefix;
        this._registry = options.registry ?? this._registry;
        this._statics = options.statics ?? this._statics;
        this._anatomyTreatments = options.anatomyTreatments ?? this._anatomyTreatments;
        if (options.library && options.library !== this._library) {
            if (this._tokenSheets.size > 0) {
                this._library.unsubscribe(this._libraryChanged);
                options.library.subscribe(this._libraryChanged);
            }
            this._library = options.library;
            this.updateTokenStyles();
        }

        return this;
    }

    /**
     * Sets the element prefix.
     *
     * @remarks
     * Can be chained with other methods on the DesignSystem class.
     */
    public withPrefix(prefix: string): this {
        this._prefix = prefix;
        return this;
    }

    /**
     * Renders the style rules of a component and the rules of its anatomy with the token library of the design system, as CSS.
     *
     * @remarks
     * The parts of the templates are class names, so a part of a rule or of the focus of the anatomy is written as a class (`control` is
     * `.control`). The values on a fill of the rules are added to the token styles.
     *
     * @param anatomy - The anatomy of the component.
     * @param styleRules - The style rules of the component.
     * @returns The CSS.
     */
    public renderStyles(anatomy?: ComponentAnatomy<any, any>, styleRules: StyleRules = []): string {
        const rules = styleRules.map(classPartsOfRule);
        const classAnatomy = anatomy ? classPartsOfAnatomy(anatomy) : undefined;

        const treatments = libraryTreatments(this._library);
        const css = formatRules(renderStyleRules(rules, {
            tokens: libraryTokenProperties(this._library, { context: colorContext }),
            treatments,
            anatomy: classAnatomy,
            anatomyTreatments: this._anatomyTreatments,
        }));

        const onFills = styleRulesOnFills(rules, { treatments, anatomy: classAnatomy, anatomyTreatments: this._anatomyTreatments });
        if (this.addOnFills(onFills)) {
            this.updateTokenStyles();
        }

        return css;
    }

    /**
     * Writes the tokens of the library as custom properties of a document or a shadow root, with the values on a fill of the components
     * composed with this design system, and keeps them up to date as the library changes and components are composed.
     *
     * @param target - The document, whose `:root` has the properties, or a shadow root, whose `:host` has them.
     */
    public adoptTokenStyles(target: Document | ShadowRoot = document): void {
        const selector = target instanceof Document ? ":root" : ":host";
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(this.tokenStyles(selector));
        target.adoptedStyleSheets = [...target.adoptedStyleSheets, sheet];
        if (this._tokenSheets.size === 0) {
            this._library.subscribe(this._libraryChanged);
        }
        this._tokenSheets.set(sheet, selector);
    }

    /**
     * The custom properties of the tokens of the library, and of the values on a fill of the components composed with this design system,
     * as a rule of CSS.
     *
     * @param selector - The selector of the rule, like `:root`.
     * @returns The rule.
     */
    public tokenStyles(selector: string): string {
        const tokens = toCSS(this._library, { converters: adaptiveConverters(this._library) });
        const onFills = onFillCSS(this._library, this._onFills.values(), { context: colorContext });
        return `${selector}{${tokens}${onFills}}`;
    }

    private addOnFills(onFills: readonly OnFillWithFill[]): boolean {
        let added = false;
        for (const onFill of onFills) {
            const key = `${pathOf(onFill.token).join(".")} on ${pathOf(onFill.fill).join(".")} ${onFill.activeFollowsRest === true}`;
            if (!this._onFills.has(key)) {
                this._onFills.set(key, onFill);
                added = true;
            }
        }
        return added;
    }

    private updateTokenStyles(): void {
        for (const [sheet, selector] of this._tokenSheets) {
            sheet.replaceSync(this.tokenStyles(selector));
        }
    }
}

// A part of a rule is a class name in the templates of the components.
function classPart(target: StyleRuleTarget): StyleRuleTarget {
    return target.part && !target.part.startsWith(".") ? { ...target, part: `.${target.part}` } : target;
}

function classPartsOfRule(rule: StyleRule): StyleRule {
    return rule.target ? { ...rule, target: classPart(rule.target) } : rule;
}

function classPartsOfAnatomy(anatomy: ComponentAnatomy<any, any>): ComponentAnatomy<any, any> {
    if (!anatomy.focus) {
        return anatomy;
    }
    const { focusTarget, resetTarget } = anatomy.focus;
    return {
        ...anatomy,
        focus: { ...anatomy.focus, focusTarget: classPart(focusTarget), resetTarget: resetTarget && classPart(resetTarget) },
    };
}
