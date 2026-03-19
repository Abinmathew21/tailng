import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import type { TngKeyboardEvent, TngMouseEvent } from '@tailng-ui/cdk';

function normalizeString(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

@Directive({
  selector: '[tngTag]',
  exportAs: 'tngTag',
  standalone: true,
})
export class TngTag {
  public readonly disabled = input<boolean, boolean | string>(false, {
    alias: 'tngTagDisabled',
    transform: booleanAttribute,
  });

  public readonly removable = input<boolean, boolean | string>(false, {
    alias: 'tngTagRemovable',
    transform: booleanAttribute,
  });

  public readonly label = input<string | null>(null, {
    alias: 'tngTagLabel',
  });

  public readonly tngTagRemoved = output<void>();

  public isDisabled(): boolean {
    return this.disabled();
  }

  public isRemovable(): boolean {
    return this.removable() && !this.isDisabled();
  }

  public resolvedLabel(): string {
    return normalizeString(this.label()) ?? 'tag';
  }

  public requestRemove(): boolean {
    if (!this.isRemovable()) {
      return false;
    }

    this.tngTagRemoved.emit();
    return true;
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabledAttr(): 'true' | null {
    return this.isDisabled() ? 'true' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.data-removable')
  protected get dataRemovableAttr(): '' | null {
    return this.removable() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tag' as const;
}

@Directive({
  selector: '[tngTagIcon]',
  exportAs: 'tngTagIcon',
  standalone: true,
})
export class TngTagIcon {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tag-icon' as const;
}

@Directive({
  selector: '[tngTagClose]',
  exportAs: 'tngTagClose',
  standalone: true,
})
export class TngTagClose {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tag = inject(TngTag, { optional: true });

  private focused = false;
  private suppressNextClick = false;

  public readonly ariaLabel = input<string | null>(null, {
    alias: 'tngTagCloseAriaLabel',
  });

  @HostListener('click', ['$event'])
  protected onClick(event: TngMouseEvent): void {
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (!this.requestRemove()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('focusin')
  protected onFocusIn(): void {
    this.focused = true;
  }

  @HostListener('focusout')
  protected onFocusOut(): void {
    this.focused = false;
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngKeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.suppressNextClick = true;
    setTimeout(() => {
      this.suppressNextClick = false;
    });

    this.requestRemove();
  }

  private requestRemove(): boolean {
    return this.tag?.requestRemove() === true;
  }

  private isButtonElement(): boolean {
    return this.elementRef.nativeElement.tagName === 'BUTTON';
  }

  private isDisabled(): boolean {
    return this.tag?.isRemovable() !== true;
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string {
    const explicit = normalizeString(this.ariaLabel());
    if (explicit !== null) {
      return explicit;
    }

    const hostDefined = normalizeString(this.elementRef.nativeElement.getAttribute('aria-label'));
    if (hostDefined !== null) {
      return hostDefined;
    }

    const label = this.tag?.resolvedLabel() ?? 'tag';
    return `Remove ${label}`;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): '' | null {
    return this.focused ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'tag-close' as const;

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    if (!this.isButtonElement()) {
      return null;
    }

    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.role')
  protected get roleAttr(): 'button' | null {
    return this.isButtonElement() ? null : 'button';
  }

  @HostBinding('attr.tabindex')
  protected get tabIndexAttr(): '0' | '-1' | null {
    if (this.isButtonElement()) {
      return null;
    }

    return this.isDisabled() ? '-1' : '0';
  }

  @HostBinding('attr.type')
  protected get typeAttr(): 'button' | null {
    return this.isButtonElement() ? 'button' : null;
  }
}
