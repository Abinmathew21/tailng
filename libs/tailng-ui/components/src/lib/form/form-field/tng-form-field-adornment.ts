import { Directive, ElementRef, HostBinding, inject } from '@angular/core';

@Directive({
  selector: '[tngFormFieldPrefix]',
  exportAs: 'tngFormFieldPrefix',
})
export class TngFormFieldPrefix {
  public readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'form-field-prefix' as const;
}

@Directive({
  selector: '[tngFormFieldSuffix]',
  exportAs: 'tngFormFieldSuffix',
})
export class TngFormFieldSuffix {
  public readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'form-field-suffix' as const;
}
