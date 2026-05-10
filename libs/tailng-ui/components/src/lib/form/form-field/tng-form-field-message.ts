import { Directive, ElementRef, HostBinding, booleanAttribute, inject, input } from '@angular/core';
import { TngUniqueIdService } from '@tailng-ui/primitives';

export type TngFormFieldMessageAlign = 'start' | 'end';

function normalizeMessageAlign(value: string | null | undefined): TngFormFieldMessageAlign {
  return value === 'end' ? 'end' : 'start';
}

function normalizeId(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

@Directive({
  selector: '[tngHint], tng-hint',
  exportAs: 'tngHint',
})
export class TngHint {
  private readonly idService = inject(TngUniqueIdService);
  private readonly generatedId = this.idService.nextId('tng-hint');

  public readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  public readonly id = input<string | null>(null);
  public readonly align = input<TngFormFieldMessageAlign, string | null | undefined>('start', {
    transform: normalizeMessageAlign,
  });

  public get resolvedId(): string {
    return normalizeId(this.id()) ?? this.generatedId;
  }

  public setHiddenByField(hidden: boolean): void {
    if (hidden) {
      this.hostElement.setAttribute('hidden', '');
    } else {
      this.hostElement.removeAttribute('hidden');
    }
  }

  public isVisible(): boolean {
    return !this.hostElement.hasAttribute('hidden');
  }

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'form-field-hint' as const;

  @HostBinding('attr.data-align')
  protected get dataAlign(): TngFormFieldMessageAlign {
    return this.align();
  }
}

@Directive({
  selector: '[tngError], tng-error',
  exportAs: 'tngError',
})
export class TngError {
  private readonly idService = inject(TngUniqueIdService);
  private readonly generatedId = this.idService.nextId('tng-error');

  public readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  public readonly id = input<string | null>(null);
  public readonly show = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly align = input<TngFormFieldMessageAlign, string | null | undefined>('start', {
    transform: normalizeMessageAlign,
  });

  public get resolvedId(): string {
    return normalizeId(this.id()) ?? this.generatedId;
  }

  public isVisible(): boolean {
    return this.show();
  }

  @HostBinding('attr.id')
  protected get idAttr(): string {
    return this.resolvedId;
  }

  @HostBinding('attr.hidden')
  protected get hiddenAttr(): '' | null {
    return this.show() ? null : '';
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'form-field-error' as const;

  @HostBinding('attr.data-align')
  protected get dataAlign(): TngFormFieldMessageAlign {
    return this.align();
  }
}
