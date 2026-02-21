import { expect, it, vi } from 'vitest';
import { createOverlayBackdropController } from './backdrop';
import { createPortalManager } from '../portal/portal';
import type {
  TngPortalContainerElement,
  TngPortalDocument,
  TngPortalNode,
} from '../portal/portal.types';

function createContainerSpy(): Readonly<{
  appendSpy: ReturnType<typeof vi.fn>;
  appended: readonly TngPortalNode[];
  container: TngPortalContainerElement;
  removeSpy: ReturnType<typeof vi.fn>;
}> {
  const appendedNodes: TngPortalNode[] = [];
  const appendSpy = vi.fn((node: TngPortalNode): void => {
    appendedNodes.push(node);
  });
  const removeSpy = vi.fn((node: TngPortalNode): void => {
    const index = appendedNodes.indexOf(node);
    if (index >= 0) {
      appendedNodes.splice(index, 1);
    }
  });

  return {
    appendSpy,
    appended: appendedNodes,
    container: {
      appendChild: appendSpy,
      removeChild: removeSpy,
    },
    removeSpy,
  };
}

function createBackdropFixture(): Readonly<{
  appended: readonly TngPortalNode[];
  backdrop: ReturnType<typeof createOverlayBackdropController>;
  body: Readonly<{
    appendSpy: ReturnType<typeof vi.fn>;
    removeSpy: ReturnType<typeof vi.fn>;
  }>;
}> {
  const body = createContainerSpy();
  const documentRef: TngPortalDocument = {
    body: body.container,
    getElementById: () => null,
  };
  const portal = createPortalManager({ documentRef, isBrowser: true });
  const backdrop = createOverlayBackdropController({ portal });

  return {
    appended: body.appended,
    backdrop,
    body: {
      appendSpy: body.appendSpy,
      removeSpy: body.removeSpy,
    },
  };
}

it('shows and hides a backdrop through the portal manager', () => {
  const fixture = createBackdropFixture();
  const node = { id: 'backdrop-1' };

  expect(fixture.backdrop.show({ backdropId: 'dialog', node })).toBe(true);
  expect(fixture.backdrop.isShown('dialog')).toBe(true);
  expect(fixture.backdrop.getTopBackdropId()).toBe('dialog');
  expect(fixture.body.appendSpy).toHaveBeenCalledWith(node);

  fixture.backdrop.hide('dialog');
  expect(fixture.backdrop.isShown('dialog')).toBe(false);
  expect(fixture.body.removeSpy).toHaveBeenCalledWith(node);
  expect(fixture.appended).toEqual([]);
});

it('orders top backdrop by priority and registration order', () => {
  const fixture = createBackdropFixture();

  fixture.backdrop.show({ backdropId: 'a', node: { id: 'a' }, priority: 0 });
  fixture.backdrop.show({ backdropId: 'b', node: { id: 'b' }, priority: 1 });
  fixture.backdrop.show({ backdropId: 'c', node: { id: 'c' }, priority: 1 });

  expect(fixture.backdrop.getBackdropIds()).toEqual(['a', 'b', 'c']);
  expect(fixture.backdrop.getTopBackdropId()).toBe('c');
});

it('handles pointer down only for the top backdrop', () => {
  const fixture = createBackdropFixture();
  const onDismiss = vi.fn();

  fixture.backdrop.show({ backdropId: 'a', node: { id: 'a' } });
  fixture.backdrop.show({ backdropId: 'b', node: { id: 'b' }, onDismiss });

  expect(fixture.backdrop.handlePointerDown('a')).toBe(false);
  expect(fixture.backdrop.handlePointerDown('b')).toBe(true);
  expect(onDismiss).toHaveBeenCalledWith('backdrop-pointer');
});

it('respects dismissOnPointerDown false on top backdrop', () => {
  const fixture = createBackdropFixture();
  const onDismiss = vi.fn();

  fixture.backdrop.show({
    backdropId: 'dialog',
    dismissOnPointerDown: false,
    node: { id: 'dialog' },
    onDismiss,
  });

  expect(fixture.backdrop.handlePointerDown('dialog')).toBe(false);
  expect(onDismiss).not.toHaveBeenCalled();
});

it('falls back to hiding top backdrop when dismiss callback is not provided', () => {
  const fixture = createBackdropFixture();

  fixture.backdrop.show({ backdropId: 'sheet', node: { id: 'sheet' } });
  fixture.backdrop.dismissTop('programmatic');

  expect(fixture.backdrop.getBackdropIds()).toEqual([]);
  expect(fixture.appended).toEqual([]);
});

it('fails gracefully when portal target is missing', () => {
  const fixture = createBackdropFixture();

  expect(
    fixture.backdrop.show({
      backdropId: 'dialog',
      node: { id: 'dialog' },
      target: { elementId: 'missing-target' },
    }),
  ).toBe(false);
  expect(fixture.backdrop.getBackdropIds()).toEqual([]);
});

it('clear removes all mounted backdrops', () => {
  const fixture = createBackdropFixture();

  fixture.backdrop.show({ backdropId: 'a', node: { id: 'a' } });
  fixture.backdrop.show({ backdropId: 'b', node: { id: 'b' } });
  fixture.backdrop.clear();

  expect(fixture.backdrop.getBackdropIds()).toEqual([]);
  expect(fixture.appended).toEqual([]);
});
