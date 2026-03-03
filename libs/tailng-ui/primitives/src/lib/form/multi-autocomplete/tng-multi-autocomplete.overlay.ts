import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngMultiAutocompleteOverlay]',
  exportAs: 'tngMultiAutocompleteOverlay',
  standalone: true,
})
export class TngMultiAutocompleteOverlay {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-overlay' as const;
}