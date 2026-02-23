import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngToggleGroup]',
  exportAs: 'tngToggleGroup',
})
export class TngToggleGroup {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toggle-group' as const;
}
