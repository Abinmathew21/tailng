import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngDrawer]',
  exportAs: 'tngDrawer',
})
export class TngDrawer {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'drawer' as const;
}
