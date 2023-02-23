/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck 
import { FASTTooltip } from '@microsoft/fast-foundation';

/**
 * workaround until https://github.com/microsoft/fast/pull/6649 is merged and published
 * 
 * adding no-check to this file since we need to call things that are private to FASTTooltip.
 */
export class AdaptiveTooltip extends FASTTooltip {
	protected anchorChanged(prev: string | undefined, next: string): void {
			if (next) {
				
				this.removeListeners();

				this.removeAnchorAriaDescribedBy(this.id);

				this.anchorElement = this.getAnchorElement(next);

				this.addAnchorAriaDescribedBy();

				if (!this.controlledVisibility) {
						this.addListeners();
				}
			}
	}
}