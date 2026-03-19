import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[tngStepper]',
  exportAs: 'tngStepper',
})
export class TngStepper {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'stepper' as const;
}
