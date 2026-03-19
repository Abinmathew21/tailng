import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngToolbar]',
  exportAs: 'tngToolbar',
  standalone: true,
})
export class TngToolbar {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toolbar' as const;
}
