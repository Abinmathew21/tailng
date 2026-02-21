import { Component, computed, input, output } from '@angular/core';
import { normalizeTngOtpLength, TngInputOtp as TngInputOtpPrimitive } from '@tailng-ui/primitives';

function toOtpSlots(length: number, value: string): string[] {
  const slots = Array.from({ length }, () => '');

  for (const [index, char] of Array.from(value).entries()) {
    if (index >= length) {
      break;
    }

    slots[index] = char;
  }

  return slots;
}

function joinOtpSlots(slots: readonly string[]): string {
  return slots.join('');
}

export function sanitizeTngOtpValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

export function applyTngOtpSlotValue(
  slots: readonly string[],
  index: number,
  nextValue: string,
): readonly string[] {
  if (index < 0 || index >= slots.length) {
    return slots;
  }

  const nextSlots = [...slots];
  nextSlots[index] = sanitizeTngOtpValue(nextValue).slice(0, 1);
  return nextSlots;
}

function isFilledOtp(slots: readonly string[]): boolean {
  return slots.every((slot) => slot.length === 1);
}

function focusOtpInput(index: number): void {
  const target = document.querySelector<HTMLInputElement>(`[data-tng-otp-slot='${index}']`);
  target?.focus();
  target?.select();
}

function readInputValue(event: unknown): string | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return target.value;
}

function readClipboardText(event: unknown): string | null {
  if (!(event instanceof ClipboardEvent)) {
    return null;
  }

  return event.clipboardData?.getData('text') ?? null;
}

function handleOtpArrowNavigation(index: number, key: string, total: number): boolean {
  if (key === 'ArrowLeft' && index > 0) {
    focusOtpInput(index - 1);
    return true;
  }

  if (key === 'ArrowRight' && index < total - 1) {
    focusOtpInput(index + 1);
    return true;
  }

  return false;
}

function shouldMoveBackForDelete(slots: readonly string[], index: number, key: string): boolean {
  if (key !== 'Backspace') {
    return false;
  }

  if (index === 0) {
    return false;
  }

  return slots[index] === '';
}

@Component({
  selector: 'tng-input-otp',
  imports: [TngInputOtpPrimitive],
  templateUrl: './tng-input-otp.component.html',
  styleUrl: './tng-input-otp.component.css',
})
export class TngInputOtp {
  public readonly length = input<number, number | string>(6, {
    transform: (value: number | string): number =>
      normalizeTngOtpLength(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<string>('');

  public readonly valueChange = output<string>();
  public readonly complete = output<string>();

  protected readonly slots = computed<readonly string[]>(() =>
    toOtpSlots(this.length(), sanitizeTngOtpValue(this.value())),
  );

  protected onSlotInput(index: number, event: unknown): void {
    const value = readInputValue(event);
    if (value === null) {
      return;
    }

    const nextSlots = applyTngOtpSlotValue(this.slots(), index, value);
    const nextValue = joinOtpSlots(nextSlots);
    this.valueChange.emit(nextValue);

    if (nextSlots[index] !== '' && index < nextSlots.length - 1) {
      focusOtpInput(index + 1);
    }

    if (isFilledOtp(nextSlots)) {
      this.complete.emit(nextValue);
    }
  }

  protected onSlotKeydown(index: number, event: unknown): void {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (handleOtpArrowNavigation(index, event.key, this.slots().length)) {
      event.preventDefault();
      return;
    }

    if (!shouldMoveBackForDelete(this.slots(), index, event.key)) {
      return;
    }

    event.preventDefault();
    const nextSlots = applyTngOtpSlotValue(this.slots(), index - 1, '');
    this.valueChange.emit(joinOtpSlots(nextSlots));
    focusOtpInput(index - 1);
  }

  protected onSlotsPaste(event: unknown): void {
    const clipboardValue = readClipboardText(event);
    if (clipboardValue === null) {
      return;
    }

    const cleanedValue = sanitizeTngOtpValue(clipboardValue).slice(0, this.length());
    if (cleanedValue.length === 0) {
      return;
    }

    if (event instanceof ClipboardEvent) {
      event.preventDefault();
    }

    this.valueChange.emit(cleanedValue);

    if (cleanedValue.length >= this.length()) {
      this.complete.emit(cleanedValue);
    }
  }
}
