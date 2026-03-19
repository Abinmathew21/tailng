import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngNavigationMenu]',
  exportAs: 'tngNavigationMenu',
  standalone: true,
})
export class TngNavigationMenu {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'navigation-menu' as const;
}
