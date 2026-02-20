import { expect, it } from 'vitest';
import { createOverlayBackdropController } from './backdrop/backdrop';
import { createOverlayFocusHandoffController } from './focus-handoff/focus-handoff';
import { createOverlayLayerStack } from './layer-stack/layer-stack';
import { createModalIsolationManager } from './modal-isolation/modal-isolation';
import type { TngModalIsolationElement } from './modal-isolation/modal-isolation.types';
import { createOverlayInteractionController } from './outside-interaction/outside-interaction';
import { createPortalManager } from './portal/portal';
import type { TngPortalDocument, TngPortalNode } from './portal/portal.types';
import { computeOverlayPosition } from './positioning/positioning';
import { createScrollLockManager } from './scroll-lock/scroll-lock';

class FakeIsolationElement implements TngModalIsolationElement {
  private readonly attributes = new Map<'aria-hidden' | 'inert', string>();

  public contains(_element: TngModalIsolationElement): boolean {
    return false;
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

type TngLifecycleFixture = Readonly<{
  appRoot: FakeIsolationElement;
  getDismissReason: () => string | null;
  getRestoreTarget: () => string | null;
  interaction: ReturnType<typeof createOverlayInteractionController>;
  modalRoot: FakeIsolationElement;
  scrollLock: ReturnType<typeof createScrollLockManager>;
}>;

type TngDialogHandlersContext = Readonly<{
  containsTarget: (target: unknown) => boolean;
  focus: ReturnType<typeof createOverlayFocusHandoffController>;
  isolation: ReturnType<typeof createModalIsolationManager>;
  scrollLock: ReturnType<typeof createScrollLockManager>;
  stack: ReturnType<typeof createOverlayLayerStack>;
}>;

function registerDialogHandlers(
  context: TngDialogHandlersContext,
): Readonly<{
  getDismissReason: () => string | null;
  getRestoreTarget: () => string | null;
}> {
  const { containsTarget, focus, isolation, scrollLock, stack } = context;
  let dismissReason: string | null = null;
  let restoreTarget: string | null = null;

  focus.registerLayer({
    initialFocusId: 'dialog-field',
    layerId: 'dialog',
    members: ['dialog-field'],
    restoreFocus: true,
    trapFocus: true,
  });
  stack.register({
    containsTarget,
    id: 'dialog',
    modal: true,
    onDismiss: (reason): void => {
      dismissReason = reason;
      stack.unregister('dialog');
      scrollLock.release('dialog');
      isolation.deactivate('dialog');
      restoreTarget = focus.deactivateLayer('dialog');
    },
  });

  return {
    getDismissReason: () => dismissReason,
    getRestoreTarget: () => restoreTarget,
  };
}

function createModalLifecycleFixture(): TngLifecycleFixture {
  const stack = createOverlayLayerStack();
  const interaction = createOverlayInteractionController({ layerStack: stack });
  const focus = createOverlayFocusHandoffController();
  const scrollLock = createScrollLockManager({
    documentRef: { body: { style: {} } },
    getScrollbarWidth: () => 0,
  });
  const appRoot = new FakeIsolationElement();
  const modalRoot = new FakeIsolationElement();
  const isolation = createModalIsolationManager({
    documentRef: { body: { children: [appRoot, modalRoot] } },
  });
  const lifecycle = registerDialogHandlers({
    containsTarget: (target): boolean => target === modalRoot,
    focus,
    isolation,
    scrollLock,
    stack,
  });

  scrollLock.acquire('dialog');
  isolation.activate('dialog', modalRoot);
  expect(focus.activateLayer('dialog', 'trigger')).toBe('dialog-field');

  return {
    appRoot,
    getDismissReason: lifecycle.getDismissReason,
    getRestoreTarget: lifecycle.getRestoreTarget,
    interaction,
    modalRoot,
    scrollLock,
  };
}

function createPortalDocument(): Readonly<{
  appendedNodes: readonly TngPortalNode[];
  documentRef: TngPortalDocument;
}> {
  const appendedNodes: TngPortalNode[] = [];
  const body = {
    appendChild: (node: TngPortalNode): void => {
      appendedNodes.push(node);
    },
    removeChild: (node: TngPortalNode): void => {
      const index = appendedNodes.indexOf(node);
      if (index >= 0) {
        appendedNodes.splice(index, 1);
      }
    },
  };

  return {
    appendedNodes,
    documentRef: {
      body,
      getElementById: () => null,
    },
  };
}

it('coordinates modal overlay lifecycle across interaction, focus and isolation', () => {
  const fixture = createModalLifecycleFixture();

  expect(fixture.appRoot.getAttribute('aria-hidden')).toBe('true');
  expect(fixture.scrollLock.isLocked()).toBe(true);

  fixture.interaction.handleKeydown({ key: 'Escape' });
  expect(fixture.getDismissReason()).toBe('escape-key');
  expect(fixture.getRestoreTarget()).toBe('trigger');
  expect(fixture.scrollLock.isLocked()).toBe(false);
  expect(fixture.appRoot.getAttribute('aria-hidden')).toBeNull();
});

it('dismisses only top layer on outside pointer and keeps parent until next event', () => {
  const stack = createOverlayLayerStack();
  const interaction = createOverlayInteractionController({ layerStack: stack });
  let parentDismissCount = 0;
  let childDismissCount = 0;
  const parentElement = { id: 'parent' };
  const childElement = { id: 'child' };

  stack.register({
    containsTarget: (target) => target === parentElement || target === childElement,
    id: 'parent',
    onDismiss: (): void => {
      parentDismissCount += 1;
      stack.unregister('parent');
    },
  });
  stack.register({
    containsTarget: (target) => target === childElement,
    id: 'child',
    onDismiss: (): void => {
      childDismissCount += 1;
      stack.unregister('child');
    },
  });

  interaction.handlePointerDown({ target: childElement });
  interaction.handlePointerDown({ target: 'outside' });
  interaction.handlePointerDown({ target: 'outside' });

  expect(childDismissCount).toBe(1);
  expect(parentDismissCount).toBe(1);
});

it('supports positioning and portal mounting together for overlay content', () => {
  const portalDocument = createPortalDocument();
  const portal = createPortalManager({
    documentRef: portalDocument.documentRef,
    isBrowser: true,
  });
  const node = { id: 'overlay-node' };
  const position = computeOverlayPosition({
    anchorRect: { height: 24, left: 80, top: 60, width: 80 },
    overlayRect: { height: 100, left: 0, top: 0, width: 140 },
    placement: { side: 'bottom' },
    viewportRect: { height: 600, left: 0, top: 0, width: 800 },
  });

  expect(position.side).toBe('bottom');
  expect(portal.mount({ node, portalId: 'popover' })).toBe(true);
  expect(portalDocument.appendedNodes).toEqual([node]);
  portal.unmount('popover');
  expect(portalDocument.appendedNodes).toEqual([]);
});

it('coordinates backdrop pointer interaction with top-layer dismissal', () => {
  const portalDocument = createPortalDocument();
  const portal = createPortalManager({
    documentRef: portalDocument.documentRef,
    isBrowser: true,
  });
  const backdrop = createOverlayBackdropController({ portal });
  const stack = createOverlayLayerStack();
  const backdropNode = { id: 'dialog-backdrop' };
  let dismissReason: string | null = null;

  stack.register({
    id: 'dialog',
    onDismiss: (reason): void => {
      dismissReason = reason;
      stack.unregister('dialog');
      backdrop.hide('dialog');
    },
  });
  backdrop.show({
    backdropId: 'dialog',
    node: backdropNode,
    onDismiss: (): void => {
      stack.dismissTop('outside-pointer');
    },
  });

  expect(portalDocument.appendedNodes).toEqual([backdropNode]);
  expect(backdrop.handlePointerDown('dialog')).toBe(true);
  expect(dismissReason).toBe('outside-pointer');
  expect(portalDocument.appendedNodes).toEqual([]);
});
