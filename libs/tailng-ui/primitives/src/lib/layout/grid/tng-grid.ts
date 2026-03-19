import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngGrid]',
  exportAs: 'tngGrid',
  standalone: true,
})
export class TngGrid {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'grid' as const;
}
