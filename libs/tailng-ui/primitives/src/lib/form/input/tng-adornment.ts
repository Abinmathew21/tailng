import { Directive, ElementRef, HostBinding, inject } from '@angular/core';

@Directive({
  selector: '[tngPrefix], [tngInputLeading]',
  exportAs: 'tngPrefix',
})
export class TngPrefix {
  public readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-leading' as const;
}

@Directive({
  selector: '[tngSuffix], [tngInputTrailing]',
  exportAs: 'tngSuffix',
})
export class TngSuffix {
  public readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-trailing' as const;
}
