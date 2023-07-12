import { DefaultDesignSystem } from "../../design-system.js";
import { composeSortableColumnHeader } from "./sortable-column-header.compose.js";
import { styleModules } from "./sortable-column-header.styles.modules.js";

/**
 * The Patient Search custom element definition.
 *
 * @remarks
 * HTML Element: \<sortable-column-header\>
 *
 * @public
 */
export const sortableColumnHeaderDefinition = composeSortableColumnHeader(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
