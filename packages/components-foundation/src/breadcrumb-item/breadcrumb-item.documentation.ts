import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { anchorDocumentation } from "../anchor/anchor.documentation.js";

/**
 * Typed component documentation for {@link BreadcrumbItemElement}.
 *
 * @public
 */
export const breadcrumbItemDocumentation = defineDocumentation({
    id: "breadcrumbItem",
    definition:
        'A **Breadcrumb Item** is a page on the path (`role="listitem"`): a link and a separator, with `aria-current="page"` on the last item.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "Like an anchor, with a `separator` part after the link.",
        interactive: true,
        indicatesFocus: true,
        parts: {
            control: {
                description: "The native `<a>`.",
                interactive: true,
                indicatesFocus: true,
            },
            content: {
                description: "The link label between optional `start` and `end` slots.",
            },
            separator: {
                description: "The separator after the link, hidden for the current item.",
            },
        },
    },
    contract: {
        include: [anchorDocumentation],
        properties: [
            {
                id: "current",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is the current page: the last item in its breadcrumb.",
            },
        ],
        slots: [
            {
                id: "separator",
                description: "Replaces the default separator after the link.",
            },
        ],
    },
});
