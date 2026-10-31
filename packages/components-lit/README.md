# Adaptive Web Components for Lit

The Adaptive web components, bound with [Lit](https://lit.dev). They are the same elements as
[`@adaptive-web/components-fast`](../components-fast/): the contract, the behavior, and the styles of each component are in
[`@adaptive-web/components-foundation`](../components-foundation/), and this package has its Lit element, its template, and what composes
them with a design system.

Only the button, the accordion, and the accordion item are here so far.

## Use

```ts
import { AdaptiveDesignSystem } from "@adaptive-web/components-lit";
import { AllComponents } from "@adaptive-web/components-lit/all-components";

AdaptiveDesignSystem.adoptTokenStyles();
AdaptiveDesignSystem.defineComponents(AllComponents);
```

Or define a component by importing it, with the default design system:

```ts
import { AdaptiveDesignSystem } from "@adaptive-web/components-lit";
import "@adaptive-web/components-lit/button/define";

AdaptiveDesignSystem.adoptTokenStyles();
```

A component is composed with a design system by its `compose<Name>`, which makes a class of the element with the styles of the design
system, and can take its own template, styles, style rules, and shadow root options:

```ts
import { buttonStyleRules } from "@adaptive-web/components-foundation";
import { composeButton, DesignSystem } from "@adaptive-web/components-lit";

new DesignSystem("my").defineComponents({ button: ds => composeButton(ds, { styleRules: buttonStyleRules }) });
```

## Development

- `npm run build` compiles, writes the custom elements manifest (`dist/custom-elements.json`), and updates the API report.
- `npm start` runs Storybook, whose controls are inferred from the manifest.
- `npm run test:conformance` runs the conformance tests of the foundation for the elements of this package in Chromium, and
  `npm run test:stories` runs axe on each story.
