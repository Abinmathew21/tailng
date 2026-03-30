import type {
  AfterViewInit, OnDestroy } from '@angular/core';
import {
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  Renderer2,
  signal,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import type { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  clampTngOtpValue,
  normalizeTngOtpLength,
  resolveTngOtpState,
  TngInputOtp as TngInputOtpPrimitive,
} from '@tailng-ui/primitives';

export type TngInputOtpType = 'numeric' | 'alphanumeric' | 'custom';
export type TngInputOtpInputMode = 'numeric' | 'text' | 'tel' | 'decimal';

const tngOtpDigitPattern = /^\d$/;
const tngOtpAlphanumericPattern = /^[a-zA-Z0-9]$/;

let tngInputOtpInstanceCounter = 0;

function toNonGlobalRegex(pattern: RegExp): RegExp {
  const flags = pattern.flags.replace(/g/g, '');
  return new RegExp(pattern.source, flags);
}

export function sanitizeTngOtpCharacters(
  value: string,
  mode: TngInputOtpType,
  pattern: string | RegExp | null,
): readonly string[] {
  const compiledPattern =
    mode !== 'custom'
      ? null
      : typeof pattern === 'string'
        ? new RegExp(pattern)
        : pattern === null
          ? null
          : toNonGlobalRegex(pattern);

  const acceptedChars: string[] = [];
  for (const char of Array.from(value)) {
    if (mode === 'numeric' && !tngOtpDigitPattern.test(char)) {
      continue;
    }

    if (mode === 'alphanumeric' && !tngOtpAlphanumericPattern.test(char)) {
      continue;
    }

    if (compiledPattern && !compiledPattern.test(char)) {
      continue;
    }

    acceptedChars.push(char);
  }

  return acceptedChars;
}

export function toTngOtpSlots(length: number, value: string): readonly string[] {
  const safeLength = normalizeTngOtpLength(length);
  const slots = Array.from({ length: safeLength }, () => '');
  const chars = Array.from(clampTngOtpValue(value, safeLength));

  for (const [index, char] of chars.entries()) {
    if (index >= safeLength) {
      break;
    }

    slots[index] = char;
  }

  return slots;
}

export function applyTngOtpCharacters(
  value: string,
  startIndex: number,
  characters: readonly string[],
  maxLength: number,
): string {
  const safeLength = normalizeTngOtpLength(maxLength);
  const nextChars = Array.from(clampTngOtpValue(value, safeLength));
  const safeStart = Math.max(0, Math.min(startIndex, safeLength - 1));

  let cursor = nextChars.length < safeLength ? Math.min(safeStart, nextChars.length) : safeStart;
  for (const char of characters) {
    if (cursor >= safeLength) {
      break;
    }

    if (cursor < nextChars.length) {
      nextChars[cursor] = char;
    } else {
      nextChars.push(char);
    }

    cursor += 1;
  }

  return nextChars.slice(0, safeLength).join('');
}

export function removeTngOtpCharacter(value: string, index: number): string {
  const chars = Array.from(value);
  if (index < 0 || index >= chars.length) {
    return value;
  }

  chars.splice(index, 1);
  return chars.join('');
}

export function resolveTngOtpEntryIndex(value: string, length: number): number {
  const safeLength = normalizeTngOtpLength(length);
  const safeValue = clampTngOtpValue(value, safeLength);
  if (safeValue.length >= safeLength) {
    return safeLength - 1;
  }

  return safeValue.length;
}

export function resolveTngOtpEndIndex(value: string, length: number): number {
  const safeLength = normalizeTngOtpLength(length);
  const safeValue = clampTngOtpValue(value, safeLength);
  if (safeValue.length === 0) {
    return safeLength - 1;
  }

  return Math.max(0, safeValue.length - 1);
}

function clampOtpIndex(index: number, length: number): number {
  const safeLength = normalizeTngOtpLength(length);
  if (!Number.isFinite(index)) {
    return 0;
  }

  if (index < 0) {
    return 0;
  }

  if (index >= safeLength) {
    return safeLength - 1;
  }

  return Math.trunc(index);
}

@Component({
  selector: 'tng-input-otp',
  imports: [TngInputOtpPrimitive],
  templateUrl: './tng-input-otp.component.html',
  styleUrl: './tng-input-otp.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngInputOtpComponent),
      multi: true,
    },
  ],
})
export class TngInputOtpComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  private readonly generatedId = `tng-input-otp-${++tngInputOtpInstanceCounter}`;
  private resetUnlisten: (() => void) | null = null;
  private hasInitializedUncontrolled = false;

  private onChangeCallback: (value: string) => void = () => undefined;
  private onTouchedCallback: () => void = () => undefined;

  private readonly uncontrolledValue = signal('');
  private readonly formsDisabled = signal(false);
  private readonly focusedState = signal(false);
  private readonly focusVisibleState = signal(false);
  private readonly keyboardInteraction = signal(false);
  private readonly activeIndexState = signal(0);

  public readonly length = input<number, number | string>(6, {
    transform: (value: number | string): number =>
      normalizeTngOtpLength(typeof value === 'number' ? value : Number(value)),
  });
  public readonly valueInput = input<string | null | undefined>(undefined, { alias: 'value' });
  public readonly defaultValue = input<string>('');
  public readonly type = input<TngInputOtpType>('numeric');
  public readonly pattern = input<string | RegExp | null>(null);

  public readonly mask = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabledInput = input<boolean, boolean | string>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly autoFocus = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly selectOnFocus = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  public readonly placeholderChar = input<string>('');
  public readonly name = input<string | null>(null);
  public readonly id = input<string | null>(null);
  public readonly form = input<string | null>(null);
  public readonly autocomplete = input<string>('one-time-code');
  public readonly inputMode = input<TngInputOtpInputMode | null>(null);
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaDescribedby = input<string | null>(null);

  public readonly valueChange = output<string>();
  public readonly complete = output<string>();

  protected readonly disabled = computed(() => this.disabledInput() || this.formsDisabled());
  protected readonly focused = computed(() => this.focusedState());
  protected readonly focusVisible = computed(() => this.focusVisibleState());
  protected readonly activeIndex = computed(() => clampOtpIndex(this.activeIndexState(), this.length()));
  protected readonly rootId = computed(() => this.id() ?? this.generatedId);

  protected readonly currentValue = computed(() => {
    const controlled = this.valueInput();
    if (controlled !== undefined) {
      return this.normalizeAndClamp(controlled ?? '');
    }

    return this.normalizeAndClamp(this.uncontrolledValue());
  });

  protected readonly slots = computed(() => toTngOtpSlots(this.length(), this.currentValue()));
  protected readonly completionState = computed(() => resolveTngOtpState(this.length(), this.currentValue()));

  protected readonly resolvedInputMode = computed<TngInputOtpInputMode>(() => {
    const explicit = this.inputMode();
    if (explicit !== null) {
      return explicit;
    }

    return this.type() === 'numeric' ? 'numeric' : 'text';
  });

  protected readonly slotInputType = computed<'password' | 'text'>(() =>
    this.mask() ? 'password' : 'text',
  );

  private readonly syncUncontrolledState = effect(
    () => {
      const controlled = this.valueInput();
      const length = this.length();
      this.type();
      this.pattern();

      if (controlled !== undefined) {
        if (!this.focusedState()) {
          this.activeIndexState.set(
            resolveTngOtpEntryIndex(this.normalizeAndClamp(controlled ?? ''), length),
          );
        }

        return;
      }

      const normalizedDefault = this.normalizeAndClamp(this.defaultValue());
      if (!this.hasInitializedUncontrolled) {
        this.hasInitializedUncontrolled = true;
        this.uncontrolledValue.set(normalizedDefault);
        this.activeIndexState.set(resolveTngOtpEntryIndex(normalizedDefault, length));
        return;
      }

      const normalizedCurrent = this.normalizeAndClamp(this.uncontrolledValue());
      if (normalizedCurrent !== this.uncontrolledValue()) {
        this.uncontrolledValue.set(normalizedCurrent);
      }

      this.activeIndexState.update((index) => clampOtpIndex(index, length));
    },
  );

  public ngAfterViewInit(): void {
    this.attachFormResetListener();

    if (!this.autoFocus() || this.disabled()) {
      return;
    }

    queueMicrotask(() => {
      if (this.disabled()) {
        return;
      }

      this.focusSlot(resolveTngOtpEntryIndex(this.currentValue(), this.length()), this.selectOnFocus());
    });
  }

  public ngOnDestroy(): void {
    this.resetUnlisten?.();
    this.resetUnlisten = null;
  }

  public writeValue(value: string | null): void {
    const normalized = this.normalizeAndClamp(value ?? '');
    this.hasInitializedUncontrolled = true;
    this.uncontrolledValue.set(normalized);

    if (!this.focusedState()) {
      this.activeIndexState.set(resolveTngOtpEntryIndex(normalized, this.length()));
    }
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.formsDisabled.set(isDisabled);
  }

  protected onSlotPointerDown(): void {
    this.keyboardInteraction.set(false);
  }

  protected onSlotFocus(index: number, event: FocusEvent): void {
    const target = event.target;
    const nextIndex = this.resolveEditableIndex(index);
    this.activeIndexState.set(nextIndex);
    this.focusedState.set(true);

    if (target instanceof HTMLElement && target.matches(':focus-visible')) {
      this.focusVisibleState.set(true);
    } else {
      this.focusVisibleState.set(this.keyboardInteraction());
    }

    if (this.selectOnFocus() && target instanceof HTMLInputElement) {
      target.select();
    }
  }

  protected onSlotBlur(event: FocusEvent): void {
    const host = this.hostRef.nativeElement;
    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && host.contains(relatedTarget)) {
      return;
    }

    queueMicrotask(() => {
      if (this.isFocusWithinHost()) {
        return;
      }

      this.focusedState.set(false);
      this.focusVisibleState.set(false);
      this.onTouchedCallback();
    });
  }

  protected onSlotKeydown(index: number, event: KeyboardEvent): void {
    this.keyboardInteraction.set(true);

    const editableIndex = this.resolveEditableIndex(index);
    const total = this.length();

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusSlot(Math.max(0, editableIndex - 1), true);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusSlot(Math.min(total - 1, editableIndex + 1), true);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.focusSlot(0, true);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.focusSlot(resolveTngOtpEndIndex(this.currentValue(), total), true);
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      this.handleBackspace(editableIndex);
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      this.handleDelete(editableIndex);
      return;
    }

    if ((this.disabled() || this.readonly()) && event.key.length === 1) {
      event.preventDefault();
    }
  }

  protected onSlotInput(index: number, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (this.disabled() || this.readonly()) {
      target.value = this.slotValue(this.resolveEditableIndex(index));
      return;
    }

    const chars = sanitizeTngOtpCharacters(target.value, this.type(), this.pattern());
    if (chars.length === 0) {
      const nextValue = removeTngOtpCharacter(this.currentValue(), this.resolveEditableIndex(index));
      this.commitValue(nextValue, this.resolveEditableIndex(index));
      return;
    }

    const previousValue = this.currentValue();
    const totalLength = this.length();
    const editableIndex = this.resolveEditableIndex(index);
    const wasCompleteBeforeInput = previousValue.length >= totalLength;
    const wasReplacingExistingCharacter = editableIndex < previousValue.length;
    const nextValue = applyTngOtpCharacters(previousValue, editableIndex, chars, totalLength);
    const nextFocus =
      wasCompleteBeforeInput || wasReplacingExistingCharacter
        ? Math.min(totalLength - 1, editableIndex + chars.length)
        : nextValue.length >= totalLength
          ? totalLength - 1
          : Math.min(totalLength - 1, Math.max(editableIndex + chars.length, nextValue.length));

    this.commitValue(nextValue, nextFocus);
  }

  protected onSlotPaste(index: number, event: ClipboardEvent): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const clipboardValue = event.clipboardData?.getData('text') ?? '';
    const chars = sanitizeTngOtpCharacters(clipboardValue, this.type(), this.pattern());
    if (chars.length === 0) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const editableIndex = this.resolveEditableIndex(index);
    const nextValue = applyTngOtpCharacters(this.currentValue(), editableIndex, chars, this.length());
    const nextFocus =
      nextValue.length >= this.length()
        ? this.length() - 1
        : Math.min(this.length() - 1, nextValue.length);

    this.commitValue(nextValue, nextFocus);
  }

  protected slotValue(index: number): string {
    const slot = this.slots()[index];
    return slot ?? '';
  }

  protected slotPlaceholder(index: number): string | null {
    if (this.placeholderChar().length === 0) {
      return null;
    }

    return this.slotValue(index) === '' ? this.placeholderChar() : null;
  }

  protected slotAriaLabel(index: number): string {
    const prefix = this.ariaLabel();
    const base = prefix?.trim() ? `${prefix.trim()} - ` : '';
    return `${base}Character ${index + 1} of ${this.length()}`;
  }

  protected isSlotTabbable(index: number): boolean {
    return this.activeIndex() === index;
  }

  private handleBackspace(index: number): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const currentValue = this.currentValue();
    if (currentValue.length === 0) {
      return;
    }

    if (index < currentValue.length) {
      const nextValue = removeTngOtpCharacter(currentValue, index);
      const nextFocus = Math.min(index, Math.max(0, nextValue.length));
      this.commitValue(nextValue, nextFocus);
      return;
    }

    const previousIndex = Math.max(0, currentValue.length - 1);
    const nextValue = removeTngOtpCharacter(currentValue, previousIndex);
    this.commitValue(nextValue, Math.max(0, previousIndex));
  }

  private handleDelete(index: number): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    if (index >= this.currentValue().length) {
      return;
    }

    const nextValue = removeTngOtpCharacter(this.currentValue(), index);
    this.commitValue(nextValue, index);
  }

  private commitValue(nextValue: string, nextFocusIndex: number): void {
    const previousValue = this.currentValue();
    const normalized = this.normalizeAndClamp(nextValue);
    const didChange = normalized !== previousValue;

    if (this.valueInput() === undefined) {
      this.uncontrolledValue.set(normalized);
    }

    this.activeIndexState.set(clampOtpIndex(nextFocusIndex, this.length()));

    if (didChange) {
      this.valueChange.emit(normalized);
      this.onChangeCallback(normalized);

      if (resolveTngOtpState(this.length(), normalized) === 'complete') {
        this.complete.emit(normalized);
      }
    }

    queueMicrotask(() => {
      this.syncSlotInputValues();
      if (!this.focusedState() && !this.isFocusWithinHost()) {
        return;
      }

      this.focusSlot(this.activeIndex(), this.selectOnFocus());
    });
  }

  private resolveEditableIndex(index: number): number {
    const safeIndex = clampOtpIndex(index, this.length());
    const currentValueLength = this.currentValue().length;

    if (currentValueLength >= this.length()) {
      return safeIndex;
    }

    return Math.min(safeIndex, currentValueLength);
  }

  private focusSlot(index: number, select: boolean): void {
    const safeIndex = clampOtpIndex(index, this.length());
    const slot = this.hostRef.nativeElement.querySelector<HTMLInputElement>(
      `[data-tng-otp-slot='${safeIndex}']`,
    );

    if (!(slot instanceof HTMLInputElement)) {
      return;
    }

    slot.focus();
    if (select) {
      slot.select();
    }

    this.activeIndexState.set(safeIndex);
  }

  private syncSlotInputValues(): void {
    const slotValues = this.slots();
    const slotInputs = this.hostRef.nativeElement.querySelectorAll<HTMLInputElement>('.tng-input-otp-slot');
    slotInputs.forEach((slotInput, index) => {
      slotInput.value = slotValues[index] ?? '';
    });
  }

  private isFocusWithinHost(): boolean {
    const ownerDocument = this.hostRef.nativeElement.ownerDocument;
    const activeElement = ownerDocument?.activeElement;
    return activeElement instanceof Node && this.hostRef.nativeElement.contains(activeElement);
  }

  private normalizeAndClamp(value: string): string {
    const chars = sanitizeTngOtpCharacters(value, this.type(), this.pattern());
    const safeLength = this.length();
    return chars.slice(0, safeLength).join('');
  }

  private attachFormResetListener(): void {
    const formId = this.form();
    const ownerForm =
      formId !== null
        ? this.hostRef.nativeElement.ownerDocument?.getElementById(formId)
        : this.hostRef.nativeElement.closest('form');

    if (!(ownerForm instanceof HTMLFormElement)) {
      return;
    }

    this.resetUnlisten?.();
    this.resetUnlisten = this.renderer.listen(ownerForm, 'reset', () => {
      if (this.valueInput() !== undefined) {
        return;
      }

      const resetValue = this.normalizeAndClamp(this.defaultValue());
      this.uncontrolledValue.set(resetValue);
      this.activeIndexState.set(resolveTngOtpEntryIndex(resetValue, this.length()));
      this.valueChange.emit(resetValue);
      this.onChangeCallback(resetValue);
    });
  }
}
