/**
 * Calendar date on documentation records (governance, changelog, and other dated fields).
 *
 * @remarks
 * Use ISO 8601 calendar dates (`YYYY-MM-DD`) without a time or time zone.
 *
 * @public
 */
export type DocDate = string;

/**
 * The readable label of an id, from its camelCase words (`textField` is `Text Field`).
 *
 * @param id - A stable camelCase id
 * @returns The label
 *
 * @public
 */
export function labelFromId(id: string): string {
    const spaced = id.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * The label of something with an id, the label it gives or the one made from its id.
 *
 * @param item - An id, and a label if it has its own
 * @returns The label
 *
 * @public
 */
export function labelOf(item: { readonly id: string; readonly label?: string }): string {
    return item.label ?? labelFromId(item.id);
}
