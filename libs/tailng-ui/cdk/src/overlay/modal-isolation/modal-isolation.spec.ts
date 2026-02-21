import { expect, it } from 'vitest';
import { createModalIsolationManager } from './modal-isolation';
import type {
  TngModalIsolationDocument,
  TngModalIsolationElement,
} from './modal-isolation.types';

class FakeElement implements TngModalIsolationElement {
  private readonly attributes = new Map<'aria-hidden' | 'inert', string>();
  private readonly children = new Set<TngModalIsolationElement>();

  public addChild(child: Readonly<FakeElement>): void {
    this.children.add(child);
  }

  public contains(element: TngModalIsolationElement): boolean {
    return this.children.has(element);
  }

  public getAttribute(name: 'aria-hidden' | 'inert'): string | null {
    return this.attributes.get(name) ?? null;
  }

  public removeAttribute(name: 'aria-hidden' | 'inert'): void {
    this.attributes.delete(name);
  }

  public setAttribute(name: 'aria-hidden' | 'inert', value: string): void {
    this.attributes.set(name, value);
  }
}

function createDocument(
  children: readonly Readonly<FakeElement>[],
): TngModalIsolationDocument {
  return {
    body: {
      children,
    },
  };
}

it('isolates siblings when modal is active', () => {
  const appRoot = new FakeElement();
  const modalRoot = new FakeElement();
  const manager = createModalIsolationManager({
    documentRef: createDocument([appRoot, modalRoot]),
  });

  manager.activate('modal-1', modalRoot);

  expect(appRoot.getAttribute('aria-hidden')).toBe('true');
  expect(appRoot.getAttribute('inert')).toBe('');
  expect(modalRoot.getAttribute('aria-hidden')).toBeNull();
});

it('restores attributes after modal deactivation', () => {
  const appRoot = new FakeElement();
  appRoot.setAttribute('aria-hidden', 'false');
  const modalRoot = new FakeElement();
  const manager = createModalIsolationManager({
    documentRef: createDocument([appRoot, modalRoot]),
  });

  manager.activate('modal-1', modalRoot);
  manager.deactivate('modal-1');

  expect(appRoot.getAttribute('aria-hidden')).toBe('false');
  expect(appRoot.getAttribute('inert')).toBeNull();
});

it('supports nested modal activation order', () => {
  const appRoot = new FakeElement();
  const firstModal = new FakeElement();
  const secondModal = new FakeElement();
  const manager = createModalIsolationManager({
    documentRef: createDocument([appRoot, firstModal, secondModal]),
  });

  manager.activate('modal-1', firstModal);
  manager.activate('modal-2', secondModal);
  expect(manager.getActiveModalIds()).toEqual(['modal-1', 'modal-2']);

  manager.deactivate('modal-2');
  expect(manager.getActiveModalIds()).toEqual(['modal-1']);
  expect(appRoot.getAttribute('aria-hidden')).toBe('true');
  expect(secondModal.getAttribute('aria-hidden')).toBe('true');
});

it('does not isolate ancestor that contains modal element', () => {
  const appRoot = new FakeElement();
  const modalRoot = new FakeElement();
  appRoot.addChild(modalRoot);
  const manager = createModalIsolationManager({
    documentRef: createDocument([appRoot]),
  });

  manager.activate('modal-1', modalRoot);
  expect(appRoot.getAttribute('aria-hidden')).toBeNull();
});

it('clear removes active modal tracking and restores state', () => {
  const appRoot = new FakeElement();
  const modalRoot = new FakeElement();
  const manager = createModalIsolationManager({
    documentRef: createDocument([appRoot, modalRoot]),
  });

  manager.activate('modal-1', modalRoot);
  manager.clear();

  expect(manager.getActiveModalIds()).toEqual([]);
  expect(appRoot.getAttribute('aria-hidden')).toBeNull();
});
