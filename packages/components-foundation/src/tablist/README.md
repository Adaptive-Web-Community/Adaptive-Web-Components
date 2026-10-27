# Tablist, Tab, and Tab Panel

A tablist is a strip of tabs, one of them selected, and the tab panels they show, which are in another element, together and in the order
of the tabs: the [ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), with the tab selected when the focus moves to it.
The strip and the panels are laid out apart, so the strip can be in a header, or sticky, and the panels elsewhere.

- Contract: `TablistElement` (`tablist.ts`), `TabElement`, `TabParts`, and `tabAria` (`../tab/tab.ts`), `TabPanelElement` and
  `tabPanelAria` (`../tab-panel/tab-panel.ts`).
- Behavior: `TablistController` (the `tablist` role, one tab selected, the panels shown, the tabs and panels paired as the panels' element's
  children change, the keyboard, with the `RovingFocusController`), and `selectTab` for the click of a tab.
- A tab selects itself, and the tablist reacts when a tab's `selected` changes, by the user or by code, which its binding observes, as an
  accordion reacts to its items.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Elements | Tabs, with tabs and panels as children, in one box; Tab; Tab Panel | A tablist, the host with the role, with only the tabs, so the strip and the panels are laid out apart |
| Pairing a tab and its panel | By order, with generated ids for `aria-controls` and `aria-labelledby` (`tab-1`, `panel-1`) | FAST's order, in one element of the panels that the tablist references (`panels`, an id, or `panelsElement`, as a button's `commandfor`): one id instead of one per tab. ARIA element reflection (`ariaControlsElements`, `ariaLabelledByElements`) through each one's `ElementInternals`: nothing is generated, and the ids stay the author's |
| The tablist | A `role="tablist"` element in the shadow root, around the `tab` slot | The host, through `ElementInternals`, with `aria-orientation` |
| The selected tab | `activeid`, the id of the tab | A `selected` attribute on the tab, reflected, as an accordion item's `expanded`: of several, the last; with none, or a disabled one, the first that isn't disabled |
| Panels not shown | `hidden` | `hidden`, set by the tablist |
| Panels that change | `slotted` | The tablist observes its panels' element's children, and waits for the panels that aren't defined yet. A panels' element later in the document is looked for again once the document is parsed |
| Keyboard | Arrows of the orientation, wrapping, Home and End | The `RovingFocusController`: the arrows of the orientation (Left and Right swapped right to left), wrapping, reaching disabled tabs, Home and End |
| Activation | When the focus moves | The same, as the ARIA pattern recommends when a panel shows at once |
| Disabled tab | `disabled`, as `aria-disabled`; the focus skips it | `disabled`, as `aria-disabled` through `ElementInternals`: the arrows reach it, as the ARIA practices ask of tabs, and it isn't selected or the tab stop |
| Events | The tabs' `change`, with the active tab as the detail | The tab's `change`, which bubbles through the tablist, as an accordion item's |
| Start and end slots | Around the tablist | Not taken: in a tablist, they would be children of the `tablist` role that aren't tabs |
| Children | `slotted` per slot | By their class: the tabs among the tablist's children, and the panels among its panels' element's, waiting for those not defined yet |

Considered and not taken:

- FAST's Tabs, one box with the tabs and the panels: the strip and the panels can't be laid out apart.
- A reference from each tab to its panel: panels anywhere and in any order, at the cost of an id per tab. The panels sit together
  and in order in practice.
- Activation by Enter or Space only (manual activation), for panels that are slow to show: add it on the first real use.
- A tab panel in the tab order (`tabindex="0"`) when its content has nothing focusable, which the ARIA pattern suggests: the author's, since
  only the content knows.
- A disabled tablist: add it on the first real use.
