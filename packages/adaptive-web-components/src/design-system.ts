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
import { type Library, pathOf, refs, toCSS } from "design-token-library";
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

type ComponentStatics =
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
 * @beta
 */
export type PartialDesignSystem = Partial<DesignSystem>;

/**
 * @beta
 */
export type ElementStaticMap = Map<ComponentStatics, StaticallyComposableHTML>;

// The token of the color context, which a value on a fill is made in the context of. A library of a design system has the shape of the
// reference library.
const colorContext = refs<ReferenceLibraryTokens>().color.context;

/**
 * Represents metadata configuration for a custom element.
 *
 * @remarks
 * The styles of the components are rendered with the token library of the design system: the rules refer to the custom properties of its
 * tokens, which {@link DesignSystem.adoptTokenStyles} writes. See `docs/decisions/0017-a-design-system-renders-the-styles-with-its-library.md`.
 *
 * @beta
 */
export class DesignSystem {
    // The values on a fill of the components composed with this design system, for the token styles.
    private readonly _onFills = new Map<string, OnFillWithFill>();
    // The sheets of the token styles, with the selector of each.
    private readonly _tokenSheets = new Map<CSSStyleSheet, string>();
    private readonly _libraryChanged = { onChange: () => this.updateTokenStyles() };

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
     * @beta
     */
    public configure(options: PartialDesignSystem): this {
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
     * 
     * @beta
     */
    public withPrefix(prefix: string): this {
        this._prefix = prefix;
        return this;
    }

    /**
     * Defines a set of components using the prefix and registry defined with the DesignSystem
     * 
     * @beta
     */
    public defineComponents(components: Record<string, ((ds: DesignSystem) => FASTElementDefinition) | FASTElementDefinition>) {
        for (const key in components) {
            let definition = components[key];

            if (typeof definition === 'function') {
                definition(this).define();
            } else if (definition instanceof FASTElementDefinition) {
                const elementNameParts = definition.name.split('-');
                const prefix = elementNameParts.shift();

                if (prefix !== this._prefix) {
                    const newDefinition = {
                        ...(definition as unknown as PartialFASTElementDefinition),
                        name: `${this._prefix}-${elementNameParts.join('-')}`
                    };

                    definition = FASTElementDefinition.compose(definition.type, newDefinition);
                }

                definition.define(this._registry);
            }
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
     * @param options - The component options, using `styles` and `styleModules`.
     * @returns The collection of desired styles.
     *
     * @beta
     */
    public assembleStyles(
        defaultStyles: ComposableStyles[], anatomy?: ComponentAnatomy<any, any>, options?: ComposeOptions<any>
    ): ElementStyles {
        const componentStyles: ComposableStyles[] = options?.styles ?
            (Array.isArray(options.styles) ? options.styles : [options.styles]) :
            defaultStyles;

        const rules = (options?.styleModules ?? []).map(classPartsOfRule);
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

        return new ElementStyles([...componentStyles, css]);
    }

    /**
     * Writes the tokens of the library as custom properties of a document or a shadow root, with the values on a fill of the components
     * composed with this design system, and keeps them up to date as the library changes and components are composed.
     *
     * @param target - The document, whose `:root` has the properties, or a shadow root, whose `:host` has them.
     *
     * @beta
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
     *
     * @beta
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
 * @beta
 */
export const DefaultDesignSystem: DesignSystem = new DesignSystem("adaptive");

/**
 * Configuration options for composing an element definition.
 * 
 * @internal
 */
export type ComposeOptions<TSource, TStatics extends string = any> = {
    template?: (ds: DesignSystem) => ElementViewTemplate<TSource, any>;
    styles?: ElementStyles | ElementStyles[];
    styleModules?: StyleRules;
    shadowOptions?: Partial<ShadowRootOptions>;
    elementOptions?: ElementDefinitionOptions;
    statics?: Record<TStatics, StaticallyComposableHTML>;
}
