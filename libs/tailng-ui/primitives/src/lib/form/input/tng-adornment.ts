import { Directive, ElementRef, HostBinding, inject } from '@angular/core';

@Directive({
  selector: '[tngInputFieldPrefix], [tngInputLeading]',
  exportAs: 'tngInputFieldPrefix',
})
export class TngInputFieldPrefix {
  public readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-leading' as const;
}

@Directive({
  selector: '[tngInputFieldSuffix], [tngInputTrailing]',
  exportAs: 'tngInputFieldSuffix',
})
export class TngInputFieldSuffix {
  public readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-trailing' as const;
}
