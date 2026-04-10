import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  booleanAttribute,
  inject,
  input,
  model,
  output,
} from '@angular/core';

export function normalizeTngOtpLength(value: number): number {
  if (!Number.isFinite(value)) {
    return 6;
  }

  const rounded = Math.trunc(value);
  if (rounded < 1) {
    return 1;
  }

  return rounded > 12 ? 12 : rounded;
}

export type TngOtpCompletionState = 'complete' | 'empty' | 'partial';

export function normalizeTngOtpValue(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value;
}

export function clampTngOtpValue(value: string, length: number): string {
  return Array.from(value).slice(0, length).join('');
}

export type TngInputOtpType = 'numeric' | 'alphanumeric' | 'custom';

const tngOtpDigitPattern = /^\d$/;
const tngOtpAlphanumericPattern = /^[a-zA-Z0-9]$/;

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

export type TngOtpBackspaceResult = Readonly<{
  focusIndex: number;
  value: string;
}>;

export function resolveTngOtpState(length: number, value: string): TngOtpCompletionState {
  const normalizedLength = normalizeTngOtpLength(length);
  const clampedValue = clampTngOtpValue(normalizeTngOtpValue(value), normalizedLength);

  if (clampedValue.length === 0) {
    return 'empty';
  }

  return clampedValue.length >= normalizedLength ? 'complete' : 'partial';
}

export function resolveTngOtpBackspaceResult(
  value: string,
  index: number,
  length: number,
): TngOtpBackspaceResult | null {
  const normalizedLength = normalizeTngOtpLength(length);
  const normalizedValue = clampTngOtpValue(normalizeTngOtpValue(value), normalizedLength);
  if (normalizedValue.length === 0) {
    return null;
  }

  const boundedIndex = Number.isFinite(index)
    ? Math.max(0, Math.min(Math.trunc(index), normalizedLength - 1))
    : 0;
  const nextChars = Array.from(normalizedValue);

  if (boundedIndex < normalizedValue.length) {
    nextChars.splice(boundedIndex, 1);
    return {
      focusIndex: Math.max(0, boundedIndex - 1),
      value: nextChars.join(''),
    };
  }

  const previousIndex = Math.max(0, normalizedValue.length - 1);
  nextChars.splice(previousIndex, 1);
  return {
    focusIndex: Math.max(0, previousIndex),
    value: nextChars.join(''),
  };
}

@Directive({
  selector: '[tngInputOtp]',
  exportAs: 'tngInputOtp',
})
export class TngInputOtp {
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  public readonly length = input<number, number | string>(6, {
    transform: (value: number | string): number =>
      normalizeTngOtpLength(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = model<string>('');
  public readonly disabled = input<boolean, boolean | string>(false, {
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
  public readonly focused = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly focusVisible = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly activeIndex = model<number | null>(null);
  public readonly type = input<TngInputOtpType>('numeric');
  public readonly pattern = input<string | RegExp | null>(null);
  public readonly selectOnFocus = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  public readonly complete = output<string>();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-otp' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'group' as const;

  @HostBinding('attr.data-empty')
  protected get dataEmptyAttr(): '' | null {
    return resolveTngOtpState(this.length(), this.normalizedValue()) === 'empty' ? '' : null;
  }

  @HostBinding('attr.data-partial')
  protected get dataPartialAttr(): '' | null {
    return resolveTngOtpState(this.length(), this.normalizedValue()) === 'partial' ? '' : null;
  }

  @HostBinding('attr.data-complete')
  protected get dataCompleteAttr(): '' | null {
    return resolveTngOtpState(this.length(), this.normalizedValue()) === 'complete' ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.data-required')
  protected get dataRequiredAttr(): '' | null {
    return this.required() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return this.invalid() ? '' : null;
  }

  @HostBinding('attr.data-focused')
  protected get dataFocusedAttr(): '' | null {
    return this.focused() ? '' : null;
  }

  @HostBinding('attr.data-focus-visible')
  protected get dataFocusVisibleAttr(): '' | null {
    return this.focusVisible() ? '' : null;
  }

  @HostBinding('attr.data-active')
  protected get dataActiveAttr(): string | null {
    const index = this.activeIndex();
    if (typeof index !== 'number' || !Number.isFinite(index)) {
      return null;
    }

    if (index < 0 || index >= this.length()) {
      return null;
    }

    return String(clampOtpIndex(index, this.length()));
  }

  @HostListener('focusout', ['$event'])
  protected onFocusOut(event: FocusEvent): void {
    this.handleGroupFocusOut(event);
  }

  public slotValue(index: number): string {
    const slot = toTngOtpSlots(this.length(), this.normalizedValue())[index];
    return slot ?? '';
  }

  public isSlotTabbable(index: number): boolean {
    return this.resolvedActiveIndex() === index;
  }

  public handleSlotFocus(index: number, target: HTMLInputElement | null): void {
    const nextIndex = this.resolveEditableIndex(index);
    this.activeIndex.set(nextIndex);

    if (this.selectOnFocus() && target instanceof HTMLInputElement) {
      target.select();
    }
  }

  public handleSlotKeydown(index: number, event: KeyboardEvent): void {
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
      this.focusSlot(resolveTngOtpEndIndex(this.normalizedValue(), total), true);
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

  public handleGroupFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && this.hostElement.contains(nextTarget)) {
      return;
    }

    this.activeIndex.set(null);
  }

  public handleSlotInput(index: number, target: HTMLInputElement | null): void {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (this.disabled() || this.readonly()) {
      target.value = this.slotValue(this.resolveEditableIndex(index));
      return;
    }

    const chars = sanitizeTngOtpCharacters(target.value, this.type(), this.pattern());
    if (chars.length === 0) {
      const nextValue = removeTngOtpCharacter(this.normalizedValue(), this.resolveEditableIndex(index));
      this.commitValue(nextValue, this.resolveEditableIndex(index));
      return;
    }

    const previousValue = this.normalizedValue();
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

  public handleSlotPaste(index: number, event: ClipboardEvent): void {
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
    const nextValue = applyTngOtpCharacters(this.normalizedValue(), editableIndex, chars, this.length());
    const nextFocus =
      nextValue.length >= this.length()
        ? this.length() - 1
        : Math.min(this.length() - 1, nextValue.length);

    this.commitValue(nextValue, nextFocus);
  }

  private normalizedValue(): string {
    const chars = sanitizeTngOtpCharacters(normalizeTngOtpValue(this.value()), this.type(), this.pattern());
    return chars.slice(0, this.length()).join('');
  }

  private resolvedActiveIndex(): number {
    const current = this.activeIndex();
    if (typeof current === 'number' && Number.isFinite(current)) {
      return clampOtpIndex(current, this.length());
    }

    return resolveTngOtpEntryIndex(this.normalizedValue(), this.length());
  }

  private resolveEditableIndex(index: number): number {
    const safeIndex = clampOtpIndex(index, this.length());
    const currentValueLength = this.normalizedValue().length;

    if (currentValueLength >= this.length()) {
      return safeIndex;
    }

    return Math.min(safeIndex, currentValueLength);
  }

  private handleBackspace(index: number): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const nextState = resolveTngOtpBackspaceResult(this.normalizedValue(), index, this.length());
    if (nextState === null) {
      return;
    }

    this.commitValue(nextState.value, nextState.focusIndex);
  }

  private handleDelete(index: number): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    if (index >= this.normalizedValue().length) {
      return;
    }

    const nextValue = removeTngOtpCharacter(this.normalizedValue(), index);
    this.commitValue(nextValue, index);
  }

  private commitValue(nextValue: string, nextFocusIndex: number): void {
    const previousValue = this.normalizedValue();
    const normalized = clampTngOtpValue(
      sanitizeTngOtpCharacters(nextValue, this.type(), this.pattern()).join(''),
      this.length(),
    );
    const didChange = normalized !== previousValue;

    this.value.set(normalized);
    this.activeIndex.set(clampOtpIndex(nextFocusIndex, this.length()));

    if (didChange && resolveTngOtpState(this.length(), normalized) === 'complete') {
      this.complete.emit(normalized);
    }

    queueMicrotask(() => {
      this.syncSlotInputValues();
      this.focusSlot(this.resolvedActiveIndex(), this.selectOnFocus());
    });
  }

  private focusSlot(index: number, select: boolean): void {
    const safeIndex = clampOtpIndex(index, this.length());
    const slot = this.hostElement.querySelector(
      `[data-tng-otp-slot='${safeIndex}']`,
    ) as HTMLInputElement | null;

    if (!(slot instanceof HTMLInputElement)) {
      return;
    }

    slot.focus();
    if (select) {
      slot.select();
    }

    this.activeIndex.set(safeIndex);
  }

  private syncSlotInputValues(): void {
    const slotInputs = this.hostElement.querySelectorAll('[data-tng-otp-slot]');
    slotInputs.forEach((slotInput: Element) => {
      if (!(slotInput instanceof HTMLInputElement)) {
        return;
      }

      const slotIndex = Number(slotInput.getAttribute('data-tng-otp-slot'));
      if (!Number.isFinite(slotIndex)) {
        return;
      }

      slotInput.value = this.slotValue(slotIndex);
    });
  }
}

@Directive({
  selector: 'input[tngInputOtpSlot]',
  exportAs: 'tngInputOtpSlot',
})
export class TngInputOtpSlot {
  private readonly otp = inject(TngInputOtp);
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  public readonly index = input<number, number | string>(0, {
    alias: 'tngInputOtpSlot',
    transform: (value: number | string): number =>
      Number.isFinite(typeof value === 'number' ? value : Number(value))
        ? Math.trunc(typeof value === 'number' ? value : Number(value))
        : 0,
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-otp-slot' as const;

  @HostBinding('attr.data-tng-otp-slot')
  protected get dataIndexAttr(): string {
    return String(this.index());
  }

  @HostBinding('value')
  protected get valueProp(): string {
    return this.otp.slotValue(this.index());
  }

  @HostBinding('tabIndex')
  protected get tabIndexProp(): number {
    return this.otp.isSlotTabbable(this.index()) ? 0 : -1;
  }

  @HostListener('focus')
  protected onFocus(): void {
    this.otp.handleSlotFocus(this.index(), this.elementRef.nativeElement);
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    this.otp.handleSlotKeydown(this.index(), event);
  }

  @HostListener('input')
  protected onInput(): void {
    this.otp.handleSlotInput(this.index(), this.elementRef.nativeElement);
  }

  @HostListener('paste', ['$event'])
  protected onPaste(event: ClipboardEvent): void {
    this.otp.handleSlotPaste(this.index(), event);
  }
}
