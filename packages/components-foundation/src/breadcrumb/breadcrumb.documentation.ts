import { defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link BreadcrumbElement}.
 *
 * @public
 */
export const breadcrumbDocumentation = defineDocumentation({
    id: "breadcrumb",
    definition:
        'A **Breadcrumb** is a navigation landmark (`role="navigation"`) with the path to the current page, which is the last item.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The `list` part wraps the default slot items (`role=\"list\"`).",
        parts: {
            list: {
                description: "The list of breadcrumb items.",
            },
        },
    },
    contract: {
        properties: [],
        slots: [
            {
                id: "default",
                description: "Breadcrumb items.",
            },
            {
                id: "start",
                description: "Optional content before the list.",
            },
            {
                id: "end",
                description: "Optional content after the list.",
            },
        ],
    },
});
