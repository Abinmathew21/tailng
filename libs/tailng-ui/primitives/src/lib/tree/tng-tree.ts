import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngTree]',
  exportAs: 'tngTree',
})
export class TngTree {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tree' as const;
}
