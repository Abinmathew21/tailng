import { expect, it, vi } from 'vitest';
import { createPortalManager } from './portal';
import type {
  TngPortalContainerElement,
  TngPortalDocument,
  TngPortalNode,
} from './portal.types';

function createContainerSpy(): Readonly<{
  container: TngPortalContainerElement;
  appended: readonly TngPortalNode[];
  appendSpy: ReturnType<typeof vi.fn>;
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
    appended: appendedNodes,
    appendSpy,
    container: {
      appendChild: appendSpy,
      removeChild: removeSpy,
    },
    removeSpy,
  };
}

it('mounts into body container by default', () => {
  const body = createContainerSpy();
  const documentRef: TngPortalDocument = {
    body: body.container,
    getElementById: () => null,
  };
  const manager = createPortalManager({ documentRef, isBrowser: true });
  const node = { id: 'portal-node' };

  expect(manager.mount({ node, portalId: 'portal-1' })).toBe(true);
  expect(body.appendSpy).toHaveBeenCalledWith(node);
  expect(manager.getMountedPortalIds()).toEqual(['portal-1']);
});

it('mounts into explicit target container when available', () => {
  const body = createContainerSpy();
  const custom = createContainerSpy();
  const documentRef: TngPortalDocument = {
    body: body.container,
    getElementById: (id: string) => (id === 'overlay-root' ? custom.container : null),
  };
  const manager = createPortalManager({ documentRef, isBrowser: true });
  const node = { id: 'targeted-node' };

  expect(
    manager.mount({
      node,
      portalId: 'portal-1',
      target: { elementId: 'overlay-root' },
    }),
  ).toBe(true);
  expect(custom.appendSpy).toHaveBeenCalledWith(node);
  expect(body.appendSpy).not.toHaveBeenCalled();
});

it('unmounts and clears portals', () => {
  const body = createContainerSpy();
  const documentRef: TngPortalDocument = {
    body: body.container,
    getElementById: () => null,
  };
  const manager = createPortalManager({ documentRef, isBrowser: true });
  const firstNode = { id: 'one' };
  const secondNode = { id: 'two' };

  manager.mount({ node: firstNode, portalId: 'portal-1' });
  manager.mount({ node: secondNode, portalId: 'portal-2' });
  manager.unmount('portal-1');
  expect(body.removeSpy).toHaveBeenCalledWith(firstNode);
  expect(manager.getMountedPortalIds()).toEqual(['portal-2']);

  manager.clear();
  expect(body.removeSpy).toHaveBeenCalledWith(secondNode);
  expect(manager.getMountedPortalIds()).toEqual([]);
});

it('fails safely in non-browser mode or missing target', () => {
  const body = createContainerSpy();
  const documentRef: TngPortalDocument = {
    body: body.container,
    getElementById: () => null,
  };
  const node = { id: 'node' };
  const disabledManager = createPortalManager({ documentRef, isBrowser: false });
  const manager = createPortalManager({ documentRef, isBrowser: true });

  expect(disabledManager.mount({ node, portalId: 'portal-1' })).toBe(false);
  expect(
    manager.mount({
      node,
      portalId: 'portal-1',
      target: { elementId: 'missing' },
    }),
  ).toBe(false);
});
