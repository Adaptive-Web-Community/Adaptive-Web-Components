# Design Tokens

This directory defines a specific set of design tokens that are generally useful for building components and experiences. Token values can be updated to reflect your visual design. We've found you can get a long way with these foundational tokens, but they don't provide for every possible visual design you might have.

These predefined tokens exist both because they are a good foundation, as well as they have already been published and are in use by consuming design systems. This package is evolving to provide more control in defining your complete token needs.

## Color

Color has specific requirements for accessibility. The updated color token model is designed to provide the flexibility you need in crafting your visual design, while ensuring that design will always meet contrast requirements. As a bonus, it adds automatic support for increased contrast preferences.

Most color tokens come as an interactive set for rest, hover, active, and focus states.

### Usage behavior

Color tokens are named for semantic use cases:

#### Stealth

Has no color at rest, typically a subtle color on hover or active.

Has no accessibility configuration relative to its context.

#### Safety

A special use case that can be thought of as a placeholder for increased contrast scenarios. Primarily intended for a stroke that's transparent until someone prefers increased contrast.

#### Subtle

Has a subtle color at rest, typically with a slight increase or decrease on hover or active.

Has no accessibility configuration relative to its context.

#### Perceivable

Considered to be perceivable from a contrast perspective. Intended for use as a component bounding outline or for large text.

Meets accessibility requirements for 3:1 contrast relative to its context in AA mode. Increases to 4.5:1 in AAA mode.

#### Readable

Considered to be readable from a contrast perspective. Safe for use on small text, though probably reads more like "hint" or "placeholder" text.

Meets accessibility requirements for 4.5:1 contrast relative to its context in AA mode. Increases to 7:1 in AAA mode.

#### Strong

Considered to be readable from a contrast perspective. Intended for use on small text, with more contrast than "Readable".

### Application

Color tokens based on the above usage behaviors are split by intended application:

#### Fill

Fills are intended to cover large areas. Because of the large coverage area, it takes less of a change for hover or active state to notice.

#### Stroke (and temporarily Foreground)

Strokes are intended for lines, icons, or text. Because of the smaller coverage area, it takes more of a change for hover or active states to notice.

### Availability

The combinations of recipes currently implemented:

|                    | Safety | Stealth | Subtle | Perceivable (3:1) | Readable (4.5:1) | Strong |
| ------------------ | ------ | ------- | ------ | ----------------- | ---------------- | ------ |
| Neutral fill       | -      | ✓       | ✓      | ✓                | o                | -      |
| Neutral stroke     | o      | o       | ✓      | ✓                | *                | *      |
| Neutral foreground | -      | -       | -      | -                 | ✓ *              | ✓ *    |
| Accent fill        | -      | o       | o      | o                 | ✓                | -      |
| Accent stroke      | o      | o       | o      | o                 | *                | -      |
| Accent foreground  | -      | -       | -      | -                 | ✓ *              | -      |

✓ = implemented

o = coming soon

\- = not applicable

\* "Foreground" recipes will be migrating to "Stroke"