import { Component, computed, ElementRef, inject, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';
import {
  normalizeTngOtpLength,
  resolveTngOtpState,
  TngInputOtp as TngInputOtpPrimitive,
} from '@tailng-ui/primitives';

function toSlots(length: number, value: string): readonly string[] {
  const slots = Array.from({ length }, () => '');
  const chars = Array.from(value.slice(0, length));

  for (const [index, char] of chars.entries()) {
    if (index >= length) {
      break;
    }

    slots[index] = char;
  }

  return slots;
}

function sanitizeDigits(value: string): readonly string[] {
  return Array.from(value).filter((char) => /\d/.test(char));
}

@Component({
  selector: 'app-input-otp-playground-page',
  imports: [TngInputOtpPrimitive, TngInputOtpComponent],
  templateUrl: './input-otp-playground-page.component.html',
  styleUrl: './input-otp-playground-page.component.css',
})
export class InputOtpPlaygroundPageComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly length = 6;

  protected readonly headlessValue = signal('');
  protected readonly headlessActiveIndex = signal(0);
  protected readonly headlessSlots = computed(() => toSlots(this.length, this.headlessValue()));
  protected readonly headlessStatus = computed(() =>
    resolveTngOtpState(this.length, this.headlessValue()),
  );

  protected readonly componentValue = signal('');
  protected readonly componentCompletion = signal('');

  protected onHeadlessSlotFocus(index: number): void {
    this.headlessActiveIndex.set(index);
  }

  protected onHeadlessSlotInput(index: number, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const previousLength = this.headlessValue().length;
    const wasCompleteBeforeInput = previousLength >= this.length;
    const wasReplacingExistingCharacter = index < previousLength;
    const chars = sanitizeDigits(target.value);
    if (chars.length === 0) {
      this.removeAt(index);
      return;
    }

    const next = this.applyChars(index, chars);
    this.headlessValue.set(next);
    const nextIndex = this.resolveNextIndex(
      next,
      index,
      chars.length,
      wasCompleteBeforeInput,
      wasReplacingExistingCharacter,
    );
    this.headlessActiveIndex.set(nextIndex);
    this.focusHeadlessSlot(nextIndex, true);
  }

  protected onHeadlessSlotKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const nextIndex = Math.max(0, index - 1);
      this.headlessActiveIndex.set(nextIndex);
      this.focusHeadlessSlot(nextIndex, true);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = Math.min(this.length - 1, index + 1);
      this.headlessActiveIndex.set(nextIndex);
      this.focusHeadlessSlot(nextIndex, true);
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      this.removeAt(index);
      this.focusHeadlessSlot(this.headlessActiveIndex(), true);
    }
  }

  protected onHeadlessPaste(index: number, event: ClipboardEvent): void {
    const previousLength = this.headlessValue().length;
    const wasCompleteBeforeInput = previousLength >= this.length;
    const wasReplacingExistingCharacter = index < previousLength;
    const text = event.clipboardData?.getData('text') ?? '';
    const chars = sanitizeDigits(text);
    if (chars.length === 0) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const next = this.applyChars(index, chars);
    this.headlessValue.set(next);
    const nextIndex = this.resolveNextIndex(
      next,
      index,
      chars.length,
      wasCompleteBeforeInput,
      wasReplacingExistingCharacter,
    );
    this.headlessActiveIndex.set(nextIndex);
    this.focusHeadlessSlot(nextIndex, true);
  }

  protected onComponentValueChange(value: string): void {
    this.componentValue.set(value);
  }

  protected onComponentComplete(value: string): void {
    this.componentCompletion.set(value);
  }

  protected onResetAll(): void {
    this.headlessValue.set('');
    this.headlessActiveIndex.set(0);
    this.componentValue.set('');
    this.componentCompletion.set('');
  }

  private applyChars(index: number, chars: readonly string[]): string {
    const length = normalizeTngOtpLength(this.length);
    const buffer = Array.from(this.headlessValue().slice(0, length));
    let cursor = Math.min(index, buffer.length);

    for (const char of chars) {
      if (cursor >= length) {
        break;
      }

      if (cursor < buffer.length) {
        buffer[cursor] = char;
      } else {
        buffer.push(char);
      }

      cursor += 1;
    }

    return buffer.slice(0, length).join('');
  }

  private removeAt(index: number): void {
    const chars = Array.from(this.headlessValue());
    if (chars.length === 0) {
      return;
    }

    const cursor = Math.max(0, Math.min(index, chars.length - 1));
    chars.splice(cursor, 1);
    this.headlessValue.set(chars.join(''));
    this.headlessActiveIndex.set(Math.max(0, Math.min(cursor, chars.length)));
  }

  private resolveNextIndex(
    value: string,
    index: number,
    consumed: number,
    wasCompleteBeforeInput: boolean,
    wasReplacingExistingCharacter: boolean,
  ): number {
    if (wasCompleteBeforeInput || wasReplacingExistingCharacter) {
      return Math.min(this.length - 1, Math.max(0, index + Math.max(consumed, 1)));
    }

    if (value.length >= this.length) {
      return this.length - 1;
    }

    return Math.min(this.length - 1, Math.max(value.length, index + consumed));
  }

  private focusHeadlessSlot(index: number, select: boolean): void {
    const safeIndex = Math.max(0, Math.min(index, this.length - 1));
    queueMicrotask(() => {
      const headlessRoot = this.hostRef.nativeElement.querySelector<HTMLElement>('[data-headless-otp]');
      if (!(headlessRoot instanceof HTMLElement)) {
        return;
      }

      const slot = headlessRoot.querySelector<HTMLInputElement>(`[data-tng-otp-slot='${safeIndex}']`);
      if (!(slot instanceof HTMLInputElement)) {
        return;
      }

      slot.focus();
      if (select) {
        slot.select();
      }
    });
  }
}
