/**
 * Reduces extra spaces in HTML tagged templates.
 *
 * The minifier of `rollup-plugin-fast-tagged-templates` can't parse a binding as the name of an element (`<${cell}>`), which a template
 * of FAST may have, so the HTML is only collapsed.
 *
 * @param {string} data - the fragment value
 * @returns string
 */
export function transformHTMLFragment(data) {
    data = data.replace(/\s*([<>])\s*/g, "$1"); // remove spaces before and after angle brackets
    return data.replace(/\s{2,}/g, " "); // Collapse all sequences to 1 space
}
