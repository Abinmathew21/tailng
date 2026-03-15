const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

type QueryableContainer = Readonly<{
  querySelectorAll: (selector: string) => ArrayLike<unknown>;
}>;

type DisabledAwareElement = Readonly<{
  hasAttribute: (name: string) => boolean;
}>;

function isQueryableContainer(value: unknown): value is QueryableContainer {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  return typeof (value as { querySelectorAll?: unknown }).querySelectorAll === 'function';
}

function isDisabledAwareElement(value: unknown): value is DisabledAwareElement {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  return typeof (value as { hasAttribute?: unknown }).hasAttribute === 'function';
}

function isFocusableElement(value: unknown): value is HTMLElement {
  if (typeof HTMLElement !== 'undefined') {
    return value instanceof HTMLElement;
  }

  return isDisabledAwareElement(value);
}

export function resolveFocusableElements(container: unknown): readonly HTMLElement[] {
  if (!isQueryableContainer(container)) {
    return [];
  }

  const candidates = Array.from(container.querySelectorAll(focusableSelector)).filter(isFocusableElement);
  const focusableElements: HTMLElement[] = [];
  for (const candidate of candidates) {
    if (candidate.hasAttribute('disabled')) {
      continue;
    }

    focusableElements.push(candidate);
  }

  return focusableElements;
}

export function resolveFirstFocusableElement(container: unknown): HTMLElement | null {
  return resolveFocusableElements(container)[0] ?? null;
}
