import { describe, expect, it } from 'vitest';
import { resolveFirstFocusableElement, resolveFocusableElements } from './focusable';

type FakeFocusableElement = {
  id: string;
  hasAttribute: (name: string) => boolean;
};

function createFocusable(id: string, disabled = false): FakeFocusableElement {
  return {
    hasAttribute: (name: string): boolean => {
      return name === 'disabled' && disabled;
    },
    id,
  };
}

function createContainer(candidates: readonly unknown[]): { querySelectorAll: (_selector: string) => readonly unknown[] } {
  return {
    querySelectorAll: (_selector: string): readonly unknown[] => candidates,
  };
}

function canUseDom(): boolean {
  return typeof document !== 'undefined' && typeof HTMLElement !== 'undefined';
}

type HasId = Readonly<{ id: string }>;

function getIdsFromDom(elements: readonly HasId[]): string[] {
  const ids: string[] = [];
  for (const el of elements) {
    ids.push(el.id);
  }
  return ids;
}

function getIdsFromFake(elements: readonly unknown[]): string[] {
  const ids: string[] = [];
  for (const el of elements) {
    if (typeof el === 'object' && el !== null && 'id' in el) {
      ids.push((el as FakeFocusableElement).id);
    }
  }
  return ids;
}

function createDomHostForFocusableTest(): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <button id="enabled-button" type="button">Enabled</button>
    <button id="disabled-button" type="button" disabled>Disabled</button>
    <a id="link" href="#">Link</a>
    <div id="tabbable" tabindex="0">Tabbable</div>
  `;
  return host;
}

function createDomHostForFirstFocusableTest(): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <div>Plain</div>
    <input id="first-input" />
    <button id="second-button" type="button">Second</button>
  `;
  return host;
}

describe('focusable utility', () => {
  it('returns an empty list for non-HTMLElement containers', () => {
    expect(resolveFocusableElements(null)).toEqual([]);
    expect(resolveFocusableElements({})).toEqual([]);
  });

  it('returns focusable elements and filters disabled candidates', () => {
    if (canUseDom()) {
      const host = createDomHostForFocusableTest();
      const elements = resolveFocusableElements(host);
      expect(getIdsFromDom(elements)).toEqual(['enabled-button', 'link', 'tabbable']);
      return;
    }

    const elements = resolveFocusableElements(
      createContainer([
        createFocusable('enabled-button'),
        createFocusable('disabled-button', true),
        createFocusable('link'),
        'not-an-element',
        createFocusable('tabbable'),
      ]),
    );

    expect(getIdsFromFake(elements)).toEqual(['enabled-button', 'link', 'tabbable']);
  });

  it('returns the first focusable element or null when absent', () => {
    if (canUseDom()) {
      const host = createDomHostForFirstFocusableTest();
      const first = resolveFirstFocusableElement(host);
      expect(first ? first.id : null).toBe('first-input');

      const emptyHost = document.createElement('div');
      expect(resolveFirstFocusableElement(emptyHost)).toBeNull();
      return;
    }

    const container = createContainer([createFocusable('first-input'), createFocusable('second-button')]);
    {
      const first = resolveFirstFocusableElement(container) as FakeFocusableElement | null;
      expect(first ? first.id : null).toBe('first-input');
    }
    expect(resolveFirstFocusableElement(createContainer([]))).toBeNull();
  });
});
