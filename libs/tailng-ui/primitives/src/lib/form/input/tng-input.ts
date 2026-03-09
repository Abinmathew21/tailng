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

@Directive({
  selector: 'input[tngInput], textarea[tngInput]',
  exportAs: 'tngInput',
  standalone: true,
})
export class TngInput {
  private readonly elementRef = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);
  private readonly idService = inject(TngUniqueIdService);

  public readonly hostElement = this.elementRef.nativeElement;

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
    return normalizeStringValue(this.ariaLabel());
  }

  @HostBinding('attr.aria-labelledby')
  protected get ariaLabelledbyAttr(): string | null {
    return normalizeStringValue(this.ariaLabelledby());
  }

  /**
   * If the consumer provided a native `aria-describedby` and the input is not set,
   * preserve it (do not clobber).
   */
  @HostBinding('attr.aria-describedby')
  protected get ariaDescribedByAttr(): string | null {
    const provided = normalizeStringValue(this.ariaDescribedBy());
    if (provided) return provided;

    return normalizeStringValue(this.hostElement.getAttribute('aria-describedby'));
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
  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-leading' as const;
}

@Directive({
  selector: '[tngInputTrailing]',
  exportAs: 'tngInputTrailing',
  standalone: true,
})
export class TngInputTrailing {
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
        <ng-content select="[tngInputLeading]"></ng-content>
      </span>
    }

    <span class="tng-input-group-control" data-slot="input-group-control">
      <ng-content select="input[tngInput], textarea[tngInput]"></ng-content>
    </span>

    @if (hasTrailingSlot()) {
      <span class="tng-input-group-trailing" data-slot="input-group-trailing">
        <ng-content select="[tngInputTrailing]"></ng-content>
      </span>
    }
  `,
})
export class TngInputGroup implements AfterContentInit, OnDestroy {
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
    if (!this.controls) return; // prevents early/noisy run

    const count = this.controls?.length ?? 0;
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
    return this.hasLeadingSlot() ? '' : null;
  }

  @HostBinding('attr.data-has-trailing')
  protected get dataHasTrailing(): '' | null {
    return this.hasTrailingSlot() ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): '' | null {
    return this.primaryControl()?.disabled() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalid(): '' | null {
    return this.primaryControl()?.isInvalid() ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonly(): '' | null {
    return this.primaryControl()?.readonly() ? '' : null;
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
    return (this.leadingSlots?.length ?? 0) > 0;
  }

  protected hasTrailingSlot(): boolean {
    return (this.trailingSlots?.length ?? 0) > 0;
  }

  protected primaryControl(): TngInput | null {
    const controls = this.controls?.toArray() ?? [];
    return controls[0] ?? null;
  }
}