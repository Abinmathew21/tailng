import { Directive, ElementRef, HostBinding, inject } from "@angular/core";

@Directive({
  selector: '[tngPrefix], [tngInputLeading]',
  exportAs: 'tngPrefix',
})
export class TngPrefix {
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-leading' as const;
}

@Directive({
  selector: '[tngSuffix], [tngInputTrailing]',
  exportAs: 'tngSuffix',
})
export class TngSuffix {
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-trailing' as const;
}

