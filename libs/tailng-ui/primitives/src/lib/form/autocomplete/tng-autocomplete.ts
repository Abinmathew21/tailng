import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngAutocomplete]',
  exportAs: 'tngAutocomplete',
})
export class TngAutocomplete {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete' as const;
}
