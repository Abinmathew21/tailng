import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngToolbar]',
  exportAs: 'tngToolbar',
})
export class TngToolbar {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toolbar' as const;
}
