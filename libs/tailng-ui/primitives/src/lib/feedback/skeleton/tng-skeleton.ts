import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngSkeletonDataAnimated(animated: boolean): 'false' | 'true' {
  return animated ? 'true' : 'false';
}

export function resolveTngSkeletonDataRounded(rounded: boolean): 'false' | 'true' {
  return rounded ? 'true' : 'false';
}

@Directive({
  selector: '[tngSkeleton]',
  exportAs: 'tngSkeleton',
})
export class TngSkeleton {
  public readonly animated = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly rounded = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-hidden')
  protected readonly ariaHiddenAttr = 'true' as const;

  @HostBinding('attr.data-animated')
  protected get dataAnimatedAttr(): 'false' | 'true' {
    return resolveTngSkeletonDataAnimated(this.animated());
  }

  @HostBinding('attr.data-rounded')
  protected get dataRoundedAttr(): 'false' | 'true' {
    return resolveTngSkeletonDataRounded(this.rounded());
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'skeleton' as const;
}
