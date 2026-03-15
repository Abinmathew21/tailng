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

function createContainer(candidates: readonly unknown[]) {
  return {
    querySelectorAll: (_selector: string): readonly unknown[] => candidates,
  };
}

function canUseDom(): boolean {
  return typeof document !== 'undefined' && typeof HTMLElement !== 'undefined';
}

describe('focusable utility', () => {
  it('returns an empty list for non-HTMLElement containers', () => {
    expect(resolveFocusableElements(null)).toEqual([]);
    expect(resolveFocusableElements({})).toEqual([]);
  });

  it('returns focusable elements and filters disabled candidates', () => {
    if (canUseDom()) {
      const host = document.createElement('div');
      host.innerHTML = `
        <button id="enabled-button" type="button">Enabled</button>
        <button id="disabled-button" type="button" disabled>Disabled</button>
        <a id="link" href="#">Link</a>
        <div id="tabbable" tabindex="0">Tabbable</div>
      `;

      const elements = resolveFocusableElements(host);
      expect(elements.map((element) => element.id)).toEqual([
        'enabled-button',
        'link',
        'tabbable',
      ]);
      return;
    }

    const elements = resolveFocusableElements(createContainer([
      createFocusable('enabled-button'),
      createFocusable('disabled-button', true),
      createFocusable('link'),
      'not-an-element',
      createFocusable('tabbable'),
    ]));
    expect(elements.map((element) => (element as FakeFocusableElement).id)).toEqual(['enabled-button', 'link', 'tabbable']);
  });

  it('returns the first focusable element or null when absent', () => {
    if (canUseDom()) {
      const host = document.createElement('div');
      host.innerHTML = `
        <div>Plain</div>
        <input id="first-input" />
        <button id="second-button" type="button">Second</button>
      `;

      expect(resolveFirstFocusableElement(host)?.id).toBe('first-input');
      expect(resolveFirstFocusableElement(document.createElement('div'))).toBeNull();
      return;
    }

    const container = createContainer([createFocusable('first-input'), createFocusable('second-button')]);
    expect((resolveFirstFocusableElement(container) as FakeFocusableElement | null)?.id).toBe('first-input');
    expect(resolveFirstFocusableElement(createContainer([]))).toBeNull();
  });
});
