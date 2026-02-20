import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngSelect]',
  exportAs: 'tngSelect',
})
export class TngSelect {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'select' as const;
}
