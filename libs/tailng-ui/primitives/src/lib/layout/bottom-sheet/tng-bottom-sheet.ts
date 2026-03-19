import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngBottomSheet]',
  exportAs: 'tngBottomSheet',
  standalone: true,
})
export class TngBottomSheet {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'bottom-sheet' as const;
}
