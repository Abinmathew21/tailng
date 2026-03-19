import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export type TngToastTone = 'danger' | 'neutral' | 'success' | 'warning';

export function resolveTngToastAriaLive(tone: TngToastTone): 'assertive' | 'polite' {
  return tone === 'danger' || tone === 'warning' ? 'assertive' : 'polite';
}

export function resolveTngToastDataState(open: boolean): 'closed' | 'open' {
  return open ? 'open' : 'closed';
}

export function resolveTngToastHidden(open: boolean): '' | null {
  return open ? null : '';
}

export function resolveTngToastRole(tone: TngToastTone): 'alert' | 'status' {
  return tone === 'danger' || tone === 'warning' ? 'alert' : 'status';
}

@Directive({
  selector: '[tngToastViewport]',
  exportAs: 'tngToastViewport',
  standalone: true,
})
export class TngToastViewport {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toast-viewport' as const;
}

@Directive({
  selector: '[tngToastItem]',
  exportAs: 'tngToastItem',
  standalone: true,
})
export class TngToastItem {
  public readonly open = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly tone = input<TngToastTone>('neutral');

  @HostBinding('attr.aria-atomic')
  protected readonly ariaAtomicAttr = 'true' as const;

  @HostBinding('attr.aria-live')
  protected get ariaLiveAttr(): 'assertive' | 'polite' {
    return resolveTngToastAriaLive(this.tone());
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'toast-item' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'closed' | 'open' {
    return resolveTngToastDataState(this.open());
  }

  @HostBinding('attr.data-tone')
  protected get dataToneAttr(): TngToastTone {
    return this.tone();
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return resolveTngToastHidden(this.open());
  }

  @HostBinding('attr.role')
  protected get roleAttr(): 'alert' | 'status' {
    return resolveTngToastRole(this.tone());
  }
}
