import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngDropdownMenu]',
  exportAs: 'tngDropdownMenu',
  standalone: true,
})
export class TngDropdownMenu {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'dropdown-menu' as const;
}
