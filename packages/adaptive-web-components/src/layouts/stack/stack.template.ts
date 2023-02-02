import { ElementViewTemplate, html } from '@microsoft/fast-element';
import type { DesignSystem } from '../../design-system.js';
import type { Stack } from './stack.js';

export const template: (ds: DesignSystem) => ElementViewTemplate<Stack> =
    (ds: DesignSystem) => {
        return html<Stack>`<slot></slot>`;
    }