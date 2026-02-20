import { expect, it } from 'vitest';
import { createScrollLockManager } from './scroll-lock';
import type { TngScrollLockDocument } from './scroll-lock.types';

function createDocumentRef(): TngScrollLockDocument {
  return {
    body: {
      style: {},
    },
  };
}

it('applies lock styles on first acquire and restores on last release', () => {
  const documentRef = createDocumentRef();
  const manager = createScrollLockManager({
    documentRef,
    getScrollbarWidth: () => 12,
  });

  manager.acquire('overlay-a');
  expect(manager.isLocked()).toBe(true);
  expect(documentRef.body.style.overflow).toBe('hidden');
  expect(documentRef.body.style.paddingRight).toBe('12px');

  manager.release('overlay-a');
  expect(manager.isLocked()).toBe(false);
  expect(documentRef.body.style.overflow).toBeUndefined();
  expect(documentRef.body.style.paddingRight).toBeUndefined();
});

it('keeps lock until all ids are released', () => {
  const documentRef = createDocumentRef();
  const manager = createScrollLockManager({ documentRef });

  manager.acquire('a');
  manager.acquire('b');
  manager.release('a');
  expect(manager.isLocked()).toBe(true);
  expect(documentRef.body.style.overflow).toBe('hidden');

  manager.release('b');
  expect(manager.isLocked()).toBe(false);
  expect(documentRef.body.style.overflow).toBeUndefined();
});

it('restores original body style values', () => {
  const documentRef = createDocumentRef();
  documentRef.body.style.overflow = 'clip';
  documentRef.body.style.paddingRight = '4px';
  const manager = createScrollLockManager({
    documentRef,
    getScrollbarWidth: () => 10,
  });

  manager.acquire('a');
  manager.release('a');

  expect(documentRef.body.style.overflow).toBe('clip');
  expect(documentRef.body.style.paddingRight).toBe('4px');
});

it('clear removes all locks and restores styles', () => {
  const documentRef = createDocumentRef();
  const manager = createScrollLockManager({ documentRef });

  manager.acquire('a');
  manager.acquire('b');
  manager.clear();

  expect(manager.getLockIds()).toEqual([]);
  expect(manager.isLocked()).toBe(false);
  expect(documentRef.body.style.overflow).toBeUndefined();
});

it('is no-op when browser mode is unavailable', () => {
  const manager = createScrollLockManager({ documentRef: null });
  manager.acquire('a');
  manager.release('a');

  expect(manager.isLocked()).toBe(false);
});
