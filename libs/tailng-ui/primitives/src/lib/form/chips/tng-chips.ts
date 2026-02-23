import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngChips]',
  exportAs: 'tngChips',
})
export class TngChips {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'chips' as const;
}
