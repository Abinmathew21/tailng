import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngCombobox]',
  exportAs: 'tngCombobox',
  standalone: true,
})
export class TngCombobox {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'combobox' as const;
}
