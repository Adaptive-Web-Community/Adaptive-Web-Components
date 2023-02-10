# Using Adaptive Components

Web components can be used in plain html with any framework just like native platform elements (button, input, etc.).

## Key features

- Register components and use in plain html
- Set component attributes and handle events in plain JavaScript
- Set design token values to change the visual treatment

## Details

### Importing

Unlike native platform elements, each component you want to use needs to be registered with the browser. Here we've imported
all the necessary components except one to illustrate what that looks like. After you've run the sample, go to `index.ts` and
uncomment the `text-area` import.

### Light and dark mode

Adaptive UI does light and dark mode differently than any other design system. This example contains the minimum setup to
use the layering system that forms the basis of the adaptive color system.

Because this is an html only example (and not your own web component for your app), you'll notice `background-color: var(--fill-color);`
in the `html` selector in css. This applies the value from the `fillColor` design token to the page. In the setup code
that token's default value is set to `layerFillFixedBase`, which is the primary (`Base`) level in the layering system.

With the layering system setup, we can now change from light to dark mode by setting the `layerFillBaseLuminance` design token
value. There are a couple constant values defined for convenience, but this value can be any decimal number between 0 and 1,
indicating the luminosity of the `Base` layer.

The last portion of this example illustrates adjusting the accent color. We've chosen three colors presented as radio options,
but you can use any hex color value. Notice how the accent color adjusts in light or dark mode (or your own custom luminosity)
to feel balanced and always meet contrast requirements.
