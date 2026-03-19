import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngMultiselect]',
  exportAs: 'tngMultiselect',
  standalone: true,
})
export class TngMultiselect {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multiselect' as const;
}
