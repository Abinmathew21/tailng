import { Directive } from '@angular/core';
import { TngBadge as TngBadgePrimitive } from '@tailng-ui/primitives';

@Directive({
  selector: '[tngBadge]',
  exportAs: 'tngBadge',
})
export class TngBadgeComponent extends TngBadgePrimitive {}
