import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngNavigationMenu]',
  exportAs: 'tngNavigationMenu',
})
export class TngNavigationMenu {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'navigation-menu' as const;
}
