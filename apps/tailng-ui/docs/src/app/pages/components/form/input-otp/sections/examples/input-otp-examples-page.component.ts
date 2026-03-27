import { DOCUMENT } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngInputOtpComponent } from '@tailng-ui/components';
import { normalizeTngOtpLength, TngInputOtp as TngInputOtpPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

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
  selector: 'app-input-otp-examples-page',
  imports: [
    TngInputOtpPrimitive,
    TngInputOtpComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './input-otp-examples-page.component.html',
  styleUrl: './input-otp-examples-page.component.css',
})
export class InputOtpExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly length = 6;
  protected readonly headlessValue = signal('');
  protected readonly headlessActiveIndex = signal(0);
  protected readonly headlessSlots = computed(() => toSlots(this.length, this.headlessValue()));

  protected readonly plainValue = signal('73');
  protected readonly plainComplete = signal('');
  protected readonly tailwindValue = signal('915');
  protected readonly tailwindComplete = signal('');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'input-otp-examples-headless.component.ts',
      code: [
        "readonly value = signal('');",
        'readonly activeIndex = signal(0);',
        'readonly slots = computed(() => toSlots(6, this.value()));',
        '',
        'onSlotInput(index: number, event: Event): void {',
        '  const chars = sanitizeDigits((event.target as HTMLInputElement).value);',
        '  this.value.set(applyChars(this.value(), index, chars));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'input-otp-examples-headless.component.html',
      code: [
        '<div tngInputOtp [length]="6" [value]="value()" [activeIndex]="activeIndex()">',
        '  @for (slot of slots(); track $index) {',
        '    <input',
        '      [value]="slot"',
        '      maxlength="1"',
        '      inputmode="numeric"',
        '      (focus)="activeIndex.set($index)"',
        '      (input)="onSlotInput($index, $event)"',
        '      (paste)="onSlotPaste($index, $event)"',
        '    />',
        '  }',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'input-otp-examples-headless.component.css',
      code: '.otp-example-headless { display: inline-flex; gap: 0.5rem; }',
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'input-otp-examples-plain-css.component.ts',
      code: [
        "readonly otpValue = signal('73');",
        "readonly completion = signal('');",
        '',
        'onValueChange(value: string): void {',
        '  this.otpValue.set(value);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'input-otp-examples-plain-css.component.html',
      code: [
        '<div class="otp-example-shell otp-example-shell--plain">',
        '  <tng-input-otp',
        '    [length]="6"',
        '    [value]="otpValue()"',
        '    (valueChange)="onValueChange($event)"',
        '    (complete)="completion.set($event)"',
        '  ></tng-input-otp>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'input-otp-examples-plain-css.component.css',
      code: [
        '.otp-example-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'input-otp-examples-tailwind.component.ts',
      code: [
        "readonly otpValue = signal('915');",
        '',
        'onValueChange(value: string): void {',
        '  this.otpValue.set(value);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'input-otp-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-input-otp',
        '    [length]="6"',
        '    [value]="otpValue()"',
        '    [mask]="true"',
        '    (valueChange)="onValueChange($event)"',
        '  ></tng-input-otp>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'input-otp-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

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

  protected onPlainValueChange(value: string): void {
    this.plainValue.set(value);
  }

  protected onPlainComplete(value: string): void {
    this.plainComplete.set(value);
  }

  protected onTailwindValueChange(value: string): void {
    this.tailwindValue.set(value);
  }

  protected onTailwindComplete(value: string): void {
    this.tailwindComplete.set(value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
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
