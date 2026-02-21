import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export type TngTooltipSide = 'bottom' | 'left' | 'right' | 'top';

export function resolveTngTooltipAriaDescribedBy(
  open: boolean,
  tooltipId: string | null,
): string | null {
  if (!open) {
    return null;
  }

  return tooltipId === null || tooltipId.trim().length === 0 ? null : tooltipId;
}

export function resolveTngTooltipDataState(open: boolean): 'closed' | 'open' {
  return open ? 'open' : 'closed';
}

export function resolveTngTooltipHidden(open: boolean): '' | null {
  return open ? null : '';
}

@Directive({
  selector: '[tngTooltipTrigger]',
  exportAs: 'tngTooltipTrigger',
})
export class TngTooltipTrigger {
  public readonly describedBy = input<string | null>(null);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    return resolveTngTooltipAriaDescribedBy(this.open(), this.describedBy());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tooltip-trigger' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngTooltipDataState(this.open());
  }
}

@Directive({
  selector: '[tngTooltipContent]',
  exportAs: 'tngTooltipContent',
})
export class TngTooltipContent {
  public readonly id = input.required<string>();
  public readonly open = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly side = input<TngTooltipSide>('top');

  @HostBinding('attr.data-side')
  protected get dataSideAttr(): TngTooltipSide {
    return this.side();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tooltip-content' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngTooltipDataState(this.open());
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return resolveTngTooltipHidden(this.open());
  }

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.id();
  }

  @HostBinding('attr.role')
  protected readonly roleAttr = 'tooltip' as const;
}
