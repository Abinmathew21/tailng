import {
  AfterContentInit,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  QueryList,
  booleanAttribute,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TngUniqueIdService } from '../_shared/id';

type NullableBooleanInput = boolean | null | string | undefined;

export type TngInputType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

export function coerceTngInputNullableBoolean(value: NullableBooleanInput): boolean | null {
  if (value === undefined || value === null) return null;

  if (value === '' || value === true || value === 'true') return true;

  if (value === false || value === 'false') return false;

  return null;
}

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toAriaBoolean(value: boolean | null): 'false' | 'true' | null {
  if (value === null) return null;
  return value ? 'true' : 'false';
}

function hasProjectedContent(element: HTMLElement): boolean {
  return Array.from(element.childNodes).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim().length > 0;
    }

    return false;
  });
}

@Directive({
  selector: 'input[tngInput], textarea[tngInput]',
  exportAs: 'tngInput',
  standalone: true,
})
export class TngInput {
  private readonly elementRef = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);
  private readonly idService = inject(TngUniqueIdService);

  public readonly hostElement = this.elementRef.nativeElement;
  private readonly initialAriaLabel = normalizeStringValue(this.hostElement.getAttribute('aria-label'));
  private readonly initialAriaLabelledby = normalizeStringValue(this.hostElement.getAttribute('aria-labelledby'));
  private readonly initialAriaDescribedBy = normalizeStringValue(
    this.hostElement.getAttribute('aria-describedby'),
  );

  private readonly generatedId = this.idService.nextId('tng-input');

  /** Canonical API for aria-describedby (whitespace normalized). */
  public readonly ariaDescribedBy = input<string | null>(null);

  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);

  /** If non-null, this value overrides native validity in `isInvalid()`. */
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });

  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });

  public readonly disabled = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  public readonly readonly = input<boolean, boolean | string>(false, { transform: booleanAttribute });
  public readonly required = input<boolean, boolean | string>(false, { transform: booleanAttribute });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input' as const;

  @HostBinding('attr.id')
  protected get idAttr(): string {
    const nativeId = normalizeStringValue(this.hostElement.getAttribute('id'));
    return nativeId ?? this.generatedId;
  }

  @HostBinding('attr.aria-label')
  protected get ariaLabelAttr(): string | null {
    const provided = normalizeStringValue(this.ariaLabel());
    if (provided !== null) return provided;

    return this.initialAriaLabel;
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledbyAttr(): string | null {
    const provided = normalizeStringValue(this.ariaLabelledby());
    if (provided !== null) return provided;

    return this.initialAriaLabelledby;
  }

  /**
   * If the consumer provided a native `aria-describedby` and the input is not set,
   * preserve it (do not clobber).
   */
  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    const provided = normalizeStringValue(this.ariaDescribedBy());
    if (provided !== null) return provided;

    return this.initialAriaDescribedBy;
  }

  /**
   * Omit `aria-invalid` unless invalid. (Avoids noisy aria-invalid="false" and
   * makes unit tests + bindings more stable.)
   */
  @HostBinding('attr.aria-invalid')
  protected get ariaInvalidAttr(): 'true' | null {
    return this.isInvalid() ? 'true' : null;
  }

  @HostBinding('attr.aria-required')
  protected get ariaRequiredAttr(): 'false' | 'true' | null {
    if (this.required()) return 'true';
    return toAriaBoolean(this.ariaRequired());
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return this.isInvalid() ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.readonly')
  protected get readonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.required')
  protected get requiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  public isInvalid(): boolean {
    const override = this.ariaInvalid();
    if (override !== null) return override;

    // jsdom may not fully implement validity; this is still correct for browsers.
    return this.hostElement.matches(':invalid');
  }
}

@Directive({
  selector: '[tngInputLeading]',
  exportAs: 'tngInputLeading',
  standalone: true,
})
export class TngInputLeading {
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-leading' as const;
}

@Directive({
  selector: '[tngInputTrailing]',
  exportAs: 'tngInputTrailing',
  standalone: true,
})
export class TngInputTrailing {
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-trailing' as const;
}

@Component({
  selector: 'tng-input-group, [tngInputGroup]',
  exportAs: 'tngInputGroup',
  standalone: true,
  template: `
    @if (hasLeadingSlot()) {
      <span class="tng-input-group-leading" data-slot="input-group-leading">
        <ng-content select="[tngInputLeading], [data-tng-input-leading-proxy]"></ng-content>
      </span>
    }

    <span class="tng-input-group-control" data-slot="input-group-control">
      <ng-content select="input[tngInput], textarea[tngInput], [data-tng-input-control-proxy]"></ng-content>
    </span>

    @if (hasTrailingSlot()) {
      <span class="tng-input-group-trailing" data-slot="input-group-trailing">
        <ng-content select="[tngInputTrailing], [data-tng-input-trailing-proxy]"></ng-content>
      </span>
    }
  `,
})
export class TngInputGroup implements AfterContentInit, OnDestroy {
  public readonly hasLeading = input<boolean | null>(null);
  public readonly hasTrailing = input<boolean | null>(null);
  public readonly disabled = input<boolean | null>(null);
  public readonly invalid = input<boolean | null>(null);
  public readonly readonly = input<boolean | null>(null);
  public readonly controlCount = input<number | null>(null);

  @ContentChildren(TngInput, { descendants: true })
  protected controls!: QueryList<TngInput>;

  @ContentChildren(TngInputLeading, { descendants: true })
  protected leadingSlots!: QueryList<TngInputLeading>;

  @ContentChildren(TngInputTrailing, { descendants: true })
  protected trailingSlots!: QueryList<TngInputTrailing>;

  private readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  private focused = false;

  private readonly destroyed$ = new Subject<void>();

  private validateSingleControl(): void {
    if (!isDevMode()) return;
    if (!this.controls) return;

    const queriedCount = this.controls.length;
    const domCount = this.hostElement.querySelectorAll(
      '[data-tng-input-control-proxy] input, [data-tng-input-control-proxy] textarea, input[tngInput], textarea[tngInput]',
    ).length;
    const count = this.controlCount() ?? (queriedCount > 0 ? queriedCount : domCount);
    if (count !== 1) {
      console.warn(
        `[tngInputGroup] Expected exactly 1 control (input/textarea with tngInput), but found ${count}.`,
        this.hostElement,
      );
    }
  }

  public ngAfterContentInit(): void {
    queueMicrotask(() => this.validateSingleControl());

    this.controls.changes
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.validateSingleControl());
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-group' as const;

  @HostBinding('attr.data-has-leading')
  protected get dataHasLeading(): '' | null {
    return this.effectiveHasLeading() ? '' : null;
  }

  @HostBinding('attr.data-has-trailing')
  protected get dataHasTrailing(): '' | null {
    return this.effectiveHasTrailing() ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): '' | null {
    const override = this.disabled();
    if (override !== null) return override ? '' : null;

    const control = this.primaryControl();
    if (control !== null) return control.disabled() ? '' : null;

    const element = this.primaryControlElement();
    if (element === null) return null;
    return element.hasAttribute('disabled') ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalid(): '' | null {
    const override = this.invalid();
    if (override !== null) return override ? '' : null;

    const control = this.primaryControl();
    if (control !== null) return control.isInvalid() ? '' : null;

    const element = this.primaryControlElement();
    if (element === null) return null;
    if (element.getAttribute('aria-invalid') === 'true') return '';
    return element.matches(':invalid') ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonly(): '' | null {
    const override = this.readonly();
    if (override !== null) return override ? '' : null;

    const control = this.primaryControl();
    if (control !== null) return control.readonly() ? '' : null;

    const element = this.primaryControlElement();
    if (element === null) return null;
    return element.hasAttribute('readonly') ? '' : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocused(): '' | null {
    return this.focused ? '' : null;
  }

  @HostListener('focusin')
  protected onFocusIn(): void {
    this.focused = true;
  }

  @HostListener('focusout', ['$event'])
  protected onFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && this.hostElement.contains(nextTarget)) return;

    this.focused = false;
  }

  protected hasLeadingSlot(): boolean {
    const proxy = this.hostElement.querySelector('[data-tng-input-leading-proxy]');
    if (proxy instanceof HTMLElement) return hasProjectedContent(proxy);

    const slots = this.leadingSlots?.toArray() ?? [];
    return slots.some((slot) => hasProjectedContent(slot.hostElement));
  }

  protected hasTrailingSlot(): boolean {
    const proxy = this.hostElement.querySelector('[data-tng-input-trailing-proxy]');
    if (proxy instanceof HTMLElement) return hasProjectedContent(proxy);

    const slots = this.trailingSlots?.toArray() ?? [];
    return slots.some((slot) => hasProjectedContent(slot.hostElement));
  }

  protected effectiveHasLeading(): boolean {
    const override = this.hasLeading();
    if (override !== null) return override;
    return this.hasLeadingSlot();
  }

  protected effectiveHasTrailing(): boolean {
    const override = this.hasTrailing();
    if (override !== null) return override;
    return this.hasTrailingSlot();
  }

  protected primaryControl(): TngInput | null {
    const controls = this.controls?.toArray() ?? [];
    return controls[0] ?? null;
  }

  protected primaryControlElement(): HTMLInputElement | HTMLTextAreaElement | null {
    const element = this.hostElement.querySelector(
      '[data-tng-input-control-proxy] input, [data-tng-input-control-proxy] textarea, input[tngInput], textarea[tngInput]',
    );
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      return element;
    }

    return null;
  }
}
