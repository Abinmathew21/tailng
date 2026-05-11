import {
  AfterContentChecked,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  QueryList,
  booleanAttribute,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { TngUniqueIdService } from '@tailng-ui/primitives';

import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from './tng-form-field.control';
import { TngError, TngHint } from './tng-form-field-message';

type NullableBooleanInput = boolean | null | string | undefined;

export type TngFormFieldLabelPosition = 'outline' | 'above' | 'left';
export type TngFormFieldSize = 'sm' | 'md' | 'lg';
export type TngFormFieldSlot =
  | 'root'
  | 'label'
  | 'controlRow'
  | 'control'
  | 'messages'
  | 'hint'
  | 'error'
  | 'requiredMarker'
  | 'prefix'
  | 'suffix';
export type TngFormFieldSlotMap = Partial<Record<TngFormFieldSlot, string>>;

type NativeControlElement = HTMLInputElement | HTMLTextAreaElement;

function coerceNullableBoolean(value: NullableBooleanInput): boolean | null {
  if (value === undefined || value === null) return null;
  if (value === '' || value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return null;
}

function normalizeLabelPosition(value: string | null | undefined): TngFormFieldLabelPosition {
  if (value === 'outline' || value === 'left') return value;
  return 'above';
}

function normalizeSize(value: string | null | undefined): TngFormFieldSize {
  if (value === 'sm' || value === 'lg') return value;
  return 'md';
}

function normalizeId(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function uniqueIds(ids: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const id of ids) {
    const normalized = normalizeId(id);
    if (normalized === null || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

@Component({
  selector: 'tng-form-field',
  templateUrl: './tng-form-field.component.html',
  styleUrl: './tng-form-field.component.css',
})
export class TngFormFieldComponent implements AfterContentChecked {
  private readonly hostElement: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly idService = inject(TngUniqueIdService);
  private readonly generatedControlId = this.idService.nextId('tng-form-field-control');
  private readonly generatedLabelId = this.idService.nextId('tng-form-field-label');
  private readonly nativeDescribedBy = new WeakMap<NativeControlElement, readonly string[]>();
  private lastWarnedControlCount = 0;
  private fieldFocused = false;
  private syncQueued = false;

  public readonly labelPosition = input<TngFormFieldLabelPosition, string | null | undefined>(
    'above',
    {
      transform: normalizeLabelPosition,
    },
  );
  public readonly size = input<TngFormFieldSize, string | null | undefined>('md', {
    transform: normalizeSize,
  });
  public readonly requiredMarker = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly hideHintWhenError = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  /** When true, the field no longer stretches to the full width of its container (default is full width). */
  public readonly inlineWidth = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceNullableBoolean,
  });
  public readonly invalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceNullableBoolean,
  });
  public readonly slot = input<TngFormFieldSlotMap | null>(null);

  @ContentChildren(TNG_FORM_FIELD_CONTROL, { descendants: true })
  protected customControls!: QueryList<TngFormFieldControl>;

  @ContentChildren(TngHint, { descendants: true })
  protected hints!: QueryList<TngHint>;

  @ContentChildren(TngError, { descendants: true })
  protected errors!: QueryList<TngError>;

  public ngAfterContentChecked(): void {
    this.syncField();
    this.queuePostCheckSync();
  }

  @HostBinding('class')
  protected get hostClass(): string {
    return this.classList('tng-form-field', this.slotClass('root'));
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'form-field' as const;

  @HostBinding('attr.data-size')
  protected get dataSize(): TngFormFieldSize {
    return this.size();
  }

  @HostBinding('attr.data-label-position')
  protected get dataLabelPosition(): TngFormFieldLabelPosition {
    return this.labelPosition();
  }

  @HostBinding('attr.data-focused')
  protected get dataFocused(): '' | null {
    return this.isFocused() ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): '' | null {
    return this.isDisabled() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalid(): '' | null {
    return this.isInvalid() ? '' : null;
  }

  @HostBinding('attr.data-required')
  protected get dataRequired(): '' | null {
    return this.isRequired() ? '' : null;
  }

  @HostBinding('attr.data-inline-width')
  protected get dataInlineWidth(): '' | null {
    return this.inlineWidth() ? '' : null;
  }

  @HostListener('focusin')
  protected onFocusIn(): void {
    this.fieldFocused = true;
  }

  @HostListener('focusout', ['$event.relatedTarget'])
  protected onFocusOut(nextTarget: Readonly<EventTarget> | null): void {
    if (nextTarget instanceof Node && this.hostElement.contains(nextTarget)) return;
    this.fieldFocused = false;
  }

  protected classList(...classes: readonly (string | null | undefined)[]): string {
    return classes
      .flatMap((className) => (className ?? '').split(/\s+/u))
      .filter((className) => className.length > 0)
      .join(' ');
  }

  protected slotClass(slotName: TngFormFieldSlot): string {
    return this.slot()?.[slotName] ?? '';
  }

  protected showRequiredMarker(): boolean {
    return this.requiredMarker() && this.isRequired();
  }

  private syncField(): void {
    const nativeControl = this.nativeControlElement();
    const customControl = nativeControl === null ? this.customControl() : null;
    const controlCount = this.nativeControlElements().length + (this.customControls?.length ?? 0);
    this.warnForControlCount(controlCount);

    this.syncLabel(nativeControl, customControl);
    const describedByIds = this.describedByIds();

    if (nativeControl !== null) {
      this.syncNativeControl(nativeControl, describedByIds);
    }

    if (customControl !== null) {
      customControl.setDescribedByIds(describedByIds);
      customControl.setAriaInvalid?.(this.isInvalid());
      customControl.setAriaRequired?.(this.isRequired());
    }
  }

  private queuePostCheckSync(): void {
    if (this.syncQueued) return;

    this.syncQueued = true;
    queueMicrotask(() => {
      this.syncQueued = false;
      this.syncField();
    });
  }

  private syncLabel(
    nativeControl: NativeControlElement | null,
    customControl: TngFormFieldControl | null,
  ): void {
    const label = this.labelElement();
    if (label === null) return;

    if (normalizeId(label.id) === null) {
      label.id = this.generatedLabelId;
    }

    if (nativeControl !== null) {
      const controlId = this.ensureNativeControlId(nativeControl);
      if (normalizeId(label.getAttribute('for')) === null) {
        label.setAttribute('for', controlId);
      }
      return;
    }

    customControl?.setLabelledById?.(label.id);
  }

  private syncNativeControl(control: NativeControlElement, describedByIds: readonly string[]): void {
    this.ensureNativeControlId(control);
    const baseIds = this.initialDescribedByIds(control);
    const mergedIds = uniqueIds([...baseIds, ...describedByIds]);

    if (mergedIds.length > 0) {
      control.setAttribute('aria-describedby', mergedIds.join(' '));
    } else {
      control.removeAttribute('aria-describedby');
    }

    if (this.isInvalid()) {
      control.setAttribute('aria-invalid', 'true');
    } else if (control.getAttribute('aria-invalid') === 'true') {
      control.removeAttribute('aria-invalid');
    }

    if (this.isRequired()) {
      control.setAttribute('aria-required', 'true');
    } else if (!control.hasAttribute('required')) {
      control.removeAttribute('aria-required');
    }
  }

  private describedByIds(): readonly string[] {
    const visibleErrors = this.visibleErrors();
    const shouldHideHints = this.hideHintWhenError() && visibleErrors.length > 0;
    const visibleHints = this.visibleHints(shouldHideHints);

    return uniqueIds([
      ...visibleHints.map((hint) => hint.resolvedId),
      ...visibleErrors.map((error) => error.resolvedId),
    ]);
  }

  private visibleHints(hiddenByField: boolean): readonly TngHint[] {
    const hints = this.hints?.toArray() ?? [];
    for (const hint of hints) {
      hint.setHiddenByField(hiddenByField);
    }

    return hiddenByField ? [] : hints.filter((hint) => hint.isVisible());
  }

  private visibleErrors(): readonly TngError[] {
    return (this.errors?.toArray() ?? []).filter((error) => error.isVisible());
  }

  private ensureNativeControlId(control: NativeControlElement): string {
    const existingId = normalizeId(control.id);
    if (existingId !== null) return existingId;

    control.id = this.generatedControlId;
    return control.id;
  }

  private initialDescribedByIds(control: NativeControlElement): readonly string[] {
    const existing = this.nativeDescribedBy.get(control);
    if (existing !== undefined) return existing;

    const ids = uniqueIds((control.getAttribute('aria-describedby') ?? '').split(/\s+/u));
    this.nativeDescribedBy.set(control, ids);
    return ids;
  }

  private isFocused(): boolean {
    return this.fieldFocused || this.customControl()?.focused === true;
  }

  private isDisabled(): boolean {
    const forced = this.disabled();
    if (forced !== null) return forced;

    const nativeControl = this.nativeControlElement();
    if (nativeControl !== null) return nativeControl.disabled || nativeControl.hasAttribute('disabled');

    return this.customControl()?.disabled === true;
  }

  private isInvalid(): boolean {
    const forced = this.invalid();
    if (forced !== null) return forced;

    if (this.visibleErrors().length > 0) return true;

    const nativeControl = this.nativeControlElement();
    if (nativeControl !== null) {
      if (nativeControl.getAttribute('aria-invalid') === 'true') return true;
      return nativeControl.matches(':invalid');
    }

    return this.customControl()?.invalid === true;
  }

  private isRequired(): boolean {
    const nativeControl = this.nativeControlElement();
    if (nativeControl !== null) return nativeControl.required || nativeControl.hasAttribute('required');

    return this.customControl()?.required === true;
  }

  private labelElement(): HTMLLabelElement | null {
    const element = this.hostElement.querySelector('label[tngLabel], tng-label label');
    return element instanceof HTMLLabelElement ? element : null;
  }

  private nativeControlElement(): NativeControlElement | null {
    return this.nativeControlElements()[0] ?? null;
  }

  private nativeControlElements(): readonly NativeControlElement[] {
    return Array.from(
      this.hostElement.querySelectorAll(
        'input[tngInput], textarea[tngInput], textarea[tngTextarea]',
      ),
    ).filter((element): element is NativeControlElement => {
      return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
    });
  }

  private customControl(): TngFormFieldControl | null {
    return this.customControls?.first ?? null;
  }

  private warnForControlCount(controlCount: number): void {
    if (!isDevMode()) return;
    if (controlCount <= 1 || controlCount === this.lastWarnedControlCount) return;

    this.lastWarnedControlCount = controlCount;
    globalThis.console.warn(
      `[tng-form-field] Expected at most 1 compatible control, but found ${controlCount}.`,
      this.hostElement,
    );
  }
}
