import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngTag]',
  exportAs: 'tngTag',
})
export class TngTag {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tag' as const;
}
