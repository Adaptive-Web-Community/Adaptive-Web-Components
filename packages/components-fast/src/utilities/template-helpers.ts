import {
    type CaptureType,
    type HTMLDirective,
    InlineTemplateDirective,
    type SyntheticViewTemplate,
} from "@microsoft/fast-element";

/**
 * A value that can be statically composed into a template.
 *
 * @remarks
 * A string is not escaped, so it must be safe and not enable an XSS attack.
 *
 * @public
 */
export type StaticallyComposableHTML<TSource = any, TParent = any> =
    | string
    | HTMLDirective
    | SyntheticViewTemplate<TSource, TParent>
    | undefined;

/**
 * Composes a {@link StaticallyComposableHTML} into a template.
 *
 * @public
 */
export function staticallyCompose<TSource = any, TParent = any>(
    item: StaticallyComposableHTML<TSource, TParent>
): CaptureType<TSource, TParent> {
    if (!item) {
        return InlineTemplateDirective.empty;
    }

    if (typeof item === "string") {
        return new InlineTemplateDirective(item);
    }

    if ("inline" in item) {
        return item.inline();
    }

    return item;
}
