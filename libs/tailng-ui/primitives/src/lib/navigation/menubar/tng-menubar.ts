import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngMenubar]',
  exportAs: 'tngMenubar',
})
export class TngMenubar {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'menubar' as const;
}
