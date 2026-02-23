import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngContextMenu]',
  exportAs: 'tngContextMenu',
})
export class TngContextMenu {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'context-menu' as const;
}
