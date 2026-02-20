import { booleanAttribute, Directive, HostBinding, input } from '@angular/core';

export type TngSeparatorOrientation = 'horizontal' | 'vertical';

@Directive({
  selector: '[tngSeparator]',
  exportAs: 'tngSeparator',
})
export class TngSeparator {
  public readonly decorative = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly orientation = input<TngSeparatorOrientation>('horizontal');

  @HostBinding('attr.aria-hidden')
  protected get ariaHiddenAttr(): 'true' | null {
    return this.decorative() ? 'true' : null;
  }

  @HostBinding('attr.aria-orientation')
  protected get ariaOrientationAttr(): TngSeparatorOrientation | null {
    if (this.decorative()) {
      return null;
    }

    return this.orientation();
  }

  @HostBinding('attr.data-orientation')
  protected get dataOrientationAttr(): TngSeparatorOrientation {
    return this.orientation();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'separator' as const;

  @HostBinding('attr.role')
  protected get roleAttr(): 'separator' | null {
    return this.decorative() ? null : 'separator';
  }
}
