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
import type { ElementRef as NgElementRef } from '@angular/core';

type TngCopyElementRef = Readonly<NgElementRef<HTMLElement>>;
type TngCopySourceElement = Readonly<HTMLElement>;

export type TngCopyFromTarget =
  | TngCopyElementRef
  | TngCopySourceElement
  | string
  | null
  | undefined;
export type TngCopyIgnoreSelectorsInput = readonly string[] | string | null | undefined;

export const defaultTngCopyIgnoreSelectors: readonly string[] = Object.freeze([
  '[data-copy-ignore]',
  '.line-no',
  '.line-number',
  '.line-numbers',
]);

function hasNonEmptyText(value: string): boolean {
  return value.trim().length > 0;
}

function dedupeSelectors(selectors: readonly string[]): readonly string[] {
  return [...new Set(selectors)];
}

function normalizeSelectorFromArray(value: readonly string[]): readonly string[] {
  return dedupeSelectors(
    value.map((selector) => selector.trim()).filter((selector) => selector.length > 0),
  );
}

function normalizeSelectorFromString(value: string): readonly string[] {
  return dedupeSelectors(
    value
      .split(',')
      .map((selector) => selector.trim())
      .filter((selector) => selector.length > 0),
  );
}

function toCopyError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('Copy failed.');
}

function isHtmlElement(value: unknown): value is HTMLElement {
  return typeof HTMLElement !== 'undefined' && value instanceof HTMLElement;
}

function isDocument(value: unknown): value is Document {
  return typeof Document !== 'undefined' && value instanceof Document;
}

function isElementRefTarget(value: unknown): value is TngCopyElementRef {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('nativeElement' in value)) {
    return false;
  }

  const candidate = value as { nativeElement: unknown };
  return isHtmlElement(candidate.nativeElement);
}

function resolveSourceElement(source: unknown, ownerDocument: unknown): HTMLElement | null {
  if (!isDocument(ownerDocument)) {
    return null;
  }

  if (source === null || source === undefined) {
    return null;
  }

  if (typeof source === 'string') {
    const normalizedSelector = source.trim();
    if (normalizedSelector.length === 0) {
      return null;
    }

    return ownerDocument.querySelector<HTMLElement>(normalizedSelector);
  }

  if (isHtmlElement(source)) {
    return source;
  }

  if (isElementRefTarget(source)) {
    return source.nativeElement;
  }

  return null;
}

function removeIgnoredNodes(root: unknown, ignoreSelectors: readonly string[]): void {
  if (!isHtmlElement(root)) {
    return;
  }

  for (const selector of ignoreSelectors) {
    try {
      const ignoredNodes: readonly Element[] = Array.from(root.querySelectorAll(selector));
      for (const node of ignoredNodes) {
        node.remove();
      }
    } catch {
      continue;
    }
  }
}

function isTextInputElement(
  sourceElement: unknown,
): sourceElement is HTMLInputElement | HTMLTextAreaElement {
  const isInputElement =
    typeof HTMLInputElement !== 'undefined' && sourceElement instanceof HTMLInputElement;
  if (isInputElement) {
    return true;
  }

  return typeof HTMLTextAreaElement !== 'undefined' && sourceElement instanceof HTMLTextAreaElement;
}

function extractTextFromSourceElement(
  sourceElement: unknown,
  ignoreSelectors: readonly string[],
): string {
  if (!isHtmlElement(sourceElement)) {
    return '';
  }

  if (isTextInputElement(sourceElement)) {
    return sourceElement.value;
  }

  if (ignoreSelectors.length === 0) {
    return sourceElement.textContent ?? '';
  }

  const clone = sourceElement.cloneNode(true) as HTMLElement;
  removeIgnoredNodes(clone, ignoreSelectors);
  return clone.textContent ?? '';
}

function copyWithExecCommand(text: string, ownerDocument: unknown): boolean {
  if (!isDocument(ownerDocument)) {
    return false;
  }

  if (typeof ownerDocument.execCommand !== 'function') {
    return false;
  }

  const body = ownerDocument.body;
  if (body === null) {
    return false;
  }

  const textarea = ownerDocument.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.inset = '0';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  textarea.style.position = 'fixed';

  body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return ownerDocument.execCommand('copy');
  } finally {
    body.removeChild(textarea);
  }
}

export function normalizeTngCopyIgnoreSelectors(
  value: TngCopyIgnoreSelectorsInput,
): readonly string[] {
  if (value === undefined || value === null) {
    return defaultTngCopyIgnoreSelectors;
  }

  if (typeof value === 'string') {
    return normalizeSelectorFromString(value);
  }

  return normalizeSelectorFromArray(value);
}

export function resolveTngCopyPayload(
  directText: string | null | undefined,
  sourceText: string | null,
): string | null {
  if (directText !== null && directText !== undefined && hasNonEmptyText(directText)) {
    return directText;
  }

  if (sourceText !== null && hasNonEmptyText(sourceText)) {
    return sourceText;
  }

  return null;
}

export async function writeTngClipboardText(text: string, ownerDocument: unknown): Promise<void> {
  const clipboardApi = globalThis.navigator?.clipboard;
  if (clipboardApi !== undefined && typeof clipboardApi.writeText === 'function') {
    await clipboardApi.writeText(text);
    return;
  }

  const didCopy = copyWithExecCommand(text, ownerDocument);
  if (didCopy) {
    return;
  }

  throw new Error('Clipboard API is not available in this environment.');
}

@Directive({
  selector: '[tngCopy]',
  exportAs: 'tngCopy',
})
export class TngCopy {
  public readonly tngCopy = input<string | null | undefined>(undefined);
  public readonly tngCopyDisabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly tngCopied = output<string>();
  public readonly tngCopyError = output<Error>();
  public readonly tngCopyFrom = input<TngCopyFromTarget>(null);
  public readonly tngCopyIgnoreSelectors = input<readonly string[], TngCopyIgnoreSelectorsInput>(
    defaultTngCopyIgnoreSelectors,
    {
      transform: normalizeTngCopyIgnoreSelectors,
    },
  );
  public readonly tngCopyText = input<string | null | undefined>(undefined);

  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  @HostBinding('attr.data-copy-disabled')
  protected get dataCopyDisabledAttr(): '' | null {
    return this.tngCopyDisabled() ? '' : null;
  }

  @HostListener('click', ['$event'])
  protected onHostClick(...args: readonly unknown[]): void {
    const [event] = args;
    if (!(event instanceof Event)) {
      return;
    }

    if (this.tngCopyDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    void this.copy();
  }

  public async copy(): Promise<boolean> {
    if (this.tngCopyDisabled()) {
      return false;
    }

    const payload = this.resolvePayload();
    if (payload === null) {
      this.tngCopyError.emit(
        new Error('No copy payload found. Provide tngCopyText or tngCopyFrom.'),
      );
      return false;
    }

    try {
      await writeTngClipboardText(payload, this.hostElement.ownerDocument);
      this.tngCopied.emit(payload);
      return true;
    } catch (error) {
      this.tngCopyError.emit(toCopyError(error));
      return false;
    }
  }

  private resolvePayload(): string | null {
    const sourceElement = resolveSourceElement(this.tngCopyFrom(), this.hostElement.ownerDocument);
    const sourceText =
      sourceElement === null
        ? null
        : extractTextFromSourceElement(sourceElement, this.tngCopyIgnoreSelectors());

    const inputText = this.tngCopyText() ?? this.tngCopy();
    return resolveTngCopyPayload(inputText, sourceText);
  }
}
