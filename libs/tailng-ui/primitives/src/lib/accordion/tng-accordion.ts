import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngAccordion]',
  exportAs: 'tngAccordion',
})
export class TngAccordion {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'accordion' as const;
}
