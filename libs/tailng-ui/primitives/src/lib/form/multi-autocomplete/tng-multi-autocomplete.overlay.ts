import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngMultiAutocompleteOverlay]',
  exportAs: 'tngMultiAutocompleteOverlay',
})
export class TngMultiAutocompleteOverlay {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-overlay' as const;
}