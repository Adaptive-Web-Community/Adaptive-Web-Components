import {
    type ComposableStyles,
    ElementStyles,
    type ElementViewTemplate,
    FASTElementDefinition,
    type PartialFASTElementDefinition,
    type ShadowRootOptions,
} from '@microsoft/fast-element';
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
import { type Library, ownTokensOf, pathOf, refs, toCSS } from "design-token-library";
import type {
    AccordionItemStatics,
    BreadcrumbItemStatics,
    CalendarStatics,
    CheckboxStatics,
    MenuItemStatics,
    NumberFieldStatics,
    PickerStatics,
    RadioStatics,
    SelectStatics,
    TreeItemStatics
} from "./components/index.js";
import type { StaticallyComposableHTML } from "./utilities/template-helpers.js";

/**
 * The keys of the statics of the components, which an {@link ElementStaticMap} maps to their HTML.
 *
 * @public
 */
export type ComponentStatics =
    AccordionItemStatics
    | BreadcrumbItemStatics
    | CalendarStatics
    | CheckboxStatics
    | MenuItemStatics
    | NumberFieldStatics
    | PickerStatics
    | RadioStatics
    | SelectStatics
    | TreeItemStatics;

/**
 * Represents partial metadata configuration for a custom element.
 * 
 * @public
 */
export type PartialDesignSystem = Partial<DesignSystem>;

/**
 * @public
 */
export type ElementStaticMap = Map<ComponentStatics, StaticallyComposableHTML>;

/**
 * The definition of a component, as `compose<Name>` returns it, or a function that composes it with a design system.
 *
 * @public
 */
export type ComponentDefinition = Promise<FASTElementDefinition> | ((ds: DesignSystem) => Promise<FASTElementDefinition>);

// The token of the color context, which a value on a fill is made in the context of. A library of a design system has the shape of the
// reference library.
const colorContext = refs<ReferenceLibraryTokens>().color.context;

// The sheet of the token styles of a target, the selector of its rule, the scope it has, or none for the library of the design system, and
// the CSS it has.
interface TokenSheet {
    readonly sheet: CSSStyleSheet;
    readonly selector: string;
    readonly scope: Library.Library<any> | undefined;
    readonly subscriber: Library.Subscriber<any>;
    css: string;
    pending: boolean;
}

/**
 * Represents metadata configuration for a custom element.
 *
 * @remarks
 * The styles of the components are rendered with the token library of the design system: the rules refer to the custom properties of its
 * tokens, which {@link DesignSystem.adoptTokenStyles} writes. See `docs/decisions/0017-a-design-system-renders-the-styles-with-its-library.md`.
 *
 * @public
 */
export class DesignSystem {
    // The values on a fill of the components composed with this design system, for the token styles.
    private readonly _onFills = new Map<string, OnFillWithFill>();
    // The converters of the token styles, made once from the library of the design system: the custom property of a token, which an
    // expression refers to, has the same name in every scope.
    private _converters?: ReturnType<typeof adaptiveConverters>;
    private get converters(): ReturnType<typeof adaptiveConverters> {
        return (this._converters ??= adaptiveConverters(this._library));
    }
    // The custom properties of the tokens, for the style rules, made once from the library of the design system as the converters are.
    private _tokenProperties?: ReturnType<typeof libraryTokenProperties>;
    private get tokenProperties(): ReturnType<typeof libraryTokenProperties> {
        return (this._tokenProperties ??= libraryTokenProperties(this._library, { context: colorContext }));
    }
    // The sheets of the token styles, by their target.
    private readonly _tokenSheets = new Map<Document | ShadowRoot, TokenSheet>();

    constructor(
        private _prefix: string,
        private _registry: CustomElementRegistry = customElements,
        private _statics: ElementStaticMap = new Map(),
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
     * 
     * @public
     */
    public configure(options: PartialDesignSystem): this {
        this._prefix = options.prefix ?? this._prefix;
        this._registry = options.registry ?? this._registry;
        this._statics = options.statics ?? this._statics;
        this._anatomyTreatments = options.anatomyTreatments ?? this._anatomyTreatments;
        if (options.library && options.library !== this._library) {
            for (const tokenSheet of this._tokenSheets.values()) {
                if (!tokenSheet.scope) {
                    this._library.unsubscribe(tokenSheet.subscriber);
                    options.library.subscribe(tokenSheet.subscriber);
                }
            }
            this._library = options.library;
            this._converters = undefined;
            this._tokenProperties = undefined;
            this.updateTokenStyles();
        }

        return this;
    }

    /**
     * Sets the element prefix.
     * 
     * @remarks
     * Can be chained with other methods on the DesignSystem class.
     * 
     * @public
     */
    public withPrefix(prefix: string): this {
        this._prefix = prefix;
        return this;
    }

    /**
     * Defines a set of components using the prefix and registry defined with the DesignSystem
     *
     * @remarks
     * Composing a definition is asynchronous in `fast-element` 3, so the components are defined once their definitions are composed.
     *
     * @returns A promise that resolves when the components are defined.
     *
     * @public
     */
    public async defineComponents(components: Record<string, ComponentDefinition>): Promise<void> {
        for (const component of Object.values(components)) {
            if (typeof component === 'function') {
                (await component(this)).define();
                continue;
            }

            let definition = await component;
            const elementNameParts = definition.name.split('-');
            const prefix = elementNameParts.shift();

            if (prefix !== this._prefix) {
                const newDefinition = {
                    ...(definition as unknown as PartialFASTElementDefinition),
                    name: `${this._prefix}-${elementNameParts.join('-')}`
                };

                definition = await FASTElementDefinition.compose(definition.type, newDefinition);
            }

            definition.define(this._registry);
        }
    }

    /**
     * Assembles the styles of a component: its own styles, then its style rules and the rules of its anatomy, rendered with the token library
     * of the design system.
     *
     * @remarks
     * The parts of the templates are class names, so a part of a rule or of the focus of the anatomy is written as a class (`control` is
     * `.control`). The values on a fill of the rules are added to the token styles.
     *
     * @param defaultStyles - The default collection of styles to use if not overridden by `options.styles`.
     * @param anatomy - The anatomy of the component.
     * @param options - The component options, using `styles` and `styleRules`.
     * @returns The collection of desired styles.
     *
     * @public
     */
    public assembleStyles(
        defaultStyles: ComposableStyles[], anatomy?: ComponentAnatomy<any, any>, options?: ComposeOptions<any>
    ): ElementStyles {
        const componentStyles: ComposableStyles[] = options?.styles ?
            (Array.isArray(options.styles) ? options.styles : [options.styles]) :
            defaultStyles;

        const rules = (options?.styleRules ?? []).map(classPartsOfRule);
        const classAnatomy = anatomy ? classPartsOfAnatomy(anatomy) : undefined;

        const treatments = libraryTreatments(this._library);
        const css = formatRules(renderStyleRules(rules, {
            tokens: this.tokenProperties,
            treatments,
            anatomy: classAnatomy,
            anatomyTreatments: this._anatomyTreatments,
        }));

        const onFills = styleRulesOnFills(rules, { treatments, anatomy: classAnatomy, anatomyTreatments: this._anatomyTreatments });
        if (this.addOnFills(onFills)) {
            this.updateTokenStyles();
        }

        return new ElementStyles([...componentStyles, css]);
    }

    /**
     * Writes the tokens of the library as custom properties of a document or a shadow root, with the values on a fill of the components
     * composed with this design system, and keeps them up to date as the library changes and components are composed.
     *
     * @remarks
     * A scope, like a layer, has a library of its own, which extends the library of the scope it is in. Its target, the shadow root of its
     * element, has the tokens whose values the scope changes, and the elements in it inherit the others from the scope it is in. See
     * `docs/decisions/0018-a-scope-writes-the-tokens-it-changes.md`.
     *
     * Writing the tokens of a target again replaces the ones it had.
     *
     * @param target - The document, whose `:root` has the properties, or a shadow root, whose `:host` has them.
     * @param scope - The library of the scope of the target, which extends the library of the scope it is in, or none for the library of
     * the design system, which follows the one that {@link DesignSystem.configure} gives.
     *
     * @public
     */
    public adoptTokenStyles(target: Document | ShadowRoot = document, scope?: Library.Library<any>): void {
        this.removeTokenStyles(target);
        const sheet = new CSSStyleSheet();
        const tokenSheet: TokenSheet = {
            sheet,
            selector: target instanceof Document ? ":root" : ":host",
            scope,
            // A change of the library may notify more than once at a time: the sheet is written once.
            subscriber: { onChange: () => this.scheduleWrite(tokenSheet) },
            css: "",
            pending: false,
        };
        this.write(tokenSheet);
        target.adoptedStyleSheets = [...target.adoptedStyleSheets, sheet];
        this.librariesOf(tokenSheet).forEach(library => library.subscribe(tokenSheet.subscriber));
        this._tokenSheets.set(target, tokenSheet);
    }

    /**
     * Removes the tokens that {@link DesignSystem.adoptTokenStyles} wrote to a document or a shadow root, and stops keeping them up to date.
     * For a scope whose element is disconnected.
     *
     * @param target - The document or the shadow root.
     *
     * @public
     */
    public removeTokenStyles(target: Document | ShadowRoot): void {
        const tokenSheet = this._tokenSheets.get(target);
        if (!tokenSheet) {
            return;
        }
        this.librariesOf(tokenSheet).forEach(library => library.unsubscribe(tokenSheet.subscriber));
        target.adoptedStyleSheets = target.adoptedStyleSheets.filter(sheet => sheet !== tokenSheet.sheet);
        this._tokenSheets.delete(target);
    }

    /**
     * The custom properties of the tokens of the library, and of the values on a fill of the components composed with this design system,
     * as a rule of CSS.
     *
     * @remarks
     * The rule of a scope has the tokens that its library changes, which it tells with `ownTokensOf()`: the tokens whose values it sets and the
     * tokens that refer to them, through other tokens too. A property that refers to another
     * (`calc(var(--a) * 2)`) is resolved where it is written, so the scope declares it again when it refers to a token that it changes.
     *
     * @param selector - The selector of the rule, like `:root`.
     * @param scope - The library of a scope, or none for the library of the design system.
     * @returns The rule.
     *
     * @public
     */
    public tokenStyles(selector: string, scope?: Library.Library<any>): string {
        if (!scope) {
            return `${selector}{${this.declarations(this._library)}}`;
        }
        // The tokens of the scope that aren't its ancestor's, the ones it sets and the ones that depend on them.
        const own = new Set(ownTokensOf(scope));
        const changed = new Set(Array.from(own, token => token.name));
        const tokens = toCSS(scope, { converters: this.converters, filter: token => own.has(token) });
        // A value on a fill is made of the token and of the fill, and changes with either.
        const onFills = Array.from(this._onFills.values()).filter(
            ({ token, fill }) => changed.has(pathOf(token).join(".")) || changed.has(pathOf(fill).join("."))
        );
        return `${selector}{${tokens}${onFillCSS(scope, onFills, { context: colorContext })}}`;
    }

    // The declarations of the custom properties of a library, its tokens and the values on a fill.
    private declarations(library: Library.Library<any>): string {
        const tokens = toCSS(library, { converters: this.converters });
        const onFills = onFillCSS(library, this._onFills.values(), { context: colorContext });
        return `${tokens}${onFills}`;
    }

    // The libraries whose changes change the styles of a sheet: the library of the design system, or of the scope. A scope follows the
    // library it inherits from, which notifies the tokens it changes.
    private librariesOf(tokenSheet: TokenSheet): Library.Library<any>[] {
        return [tokenSheet.scope ?? this._library];
    }

    private scheduleWrite(tokenSheet: TokenSheet): void {
        if (tokenSheet.pending) {
            return;
        }
        tokenSheet.pending = true;
        queueMicrotask(() => {
            tokenSheet.pending = false;
            this.write(tokenSheet);
        });
    }

    private write(tokenSheet: TokenSheet): void {
        const css = this.tokenStyles(tokenSheet.selector, tokenSheet.scope);
        if (css !== tokenSheet.css) {
            tokenSheet.css = css;
            tokenSheet.sheet.replaceSync(css);
        }
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
        for (const tokenSheet of this._tokenSheets.values()) {
            this.write(tokenSheet);
        }
    }
}

// A part of a rule is a class name in the templates of this package. The opinion of class names used to be in Adaptive UI, which has none
// now.
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

/**
 * The default {@link DesignSystem} configuration.
 *
 * @public
 */
export const DefaultDesignSystem: DesignSystem = new DesignSystem("adaptive");

/**
 * Configuration options for composing an element definition.
 *
 * @public
 */
export type ComposeOptions<TSource, TStatics extends string = any> = {
    template?: (ds: DesignSystem) => ElementViewTemplate<TSource, any>;
    styles?: ElementStyles | ElementStyles[];
    styleRules?: StyleRules;
    shadowOptions?: Partial<ShadowRootOptions>;
    elementOptions?: ElementDefinitionOptions;
    statics?: Record<TStatics, StaticallyComposableHTML>;
}
