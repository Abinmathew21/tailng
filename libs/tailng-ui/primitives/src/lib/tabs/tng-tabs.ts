import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngTabs]',
  exportAs: 'tngTabs',
})
export class TngTabs {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tabs' as const;
}
