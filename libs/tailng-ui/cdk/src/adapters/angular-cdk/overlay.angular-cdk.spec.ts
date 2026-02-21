import { expect, it, vi } from 'vitest';
import {
  createAngularCdkOverlayDelegates,
  type TngAngularCdkOverlayLike,
} from './overlay.angular-cdk';
import {
  computeOverlayPosition,
  type TngOverlayPositionOptions,
  type TngPortalManager,
  type TngPortalNode,
  type TngScrollLockManager,
} from '../../overlay';

type TngPositionStrategyStub = Readonly<{
  withPositions: ReturnType<
    typeof vi.fn<
      (positions: readonly Readonly<Record<string, unknown>>[]) => TngPositionStrategyStub
    >
  >;
  withPush: ReturnType<typeof vi.fn<(push: boolean) => TngPositionStrategyStub>>;
  withViewportMargin: ReturnType<typeof vi.fn<(margin: number) => TngPositionStrategyStub>>;
}>;

type TngOverlayRefStub = Readonly<{
  appendChildSpy: ReturnType<typeof vi.fn<(node: unknown) => void>>;
  disposeSpy: ReturnType<typeof vi.fn<() => void>>;
  removeChildSpy: ReturnType<typeof vi.fn<(node: unknown) => void>>;
  updatePositionSpy: ReturnType<typeof vi.fn<() => void>>;
}>;

type TngPositionOverlayFixture = Readonly<{
  createSpy: TngPositionCreateSpy;
  flexibleConnectedToSpy: ReturnType<typeof vi.fn<(origin: unknown) => TngPositionStrategyStub>>;
  overlay: TngAngularCdkOverlayLike;
  overlayRef: TngOverlayRefStub;
  strategy: TngPositionStrategyStub;
}>;

type TngPositionCreateSpy = ReturnType<
  typeof vi.fn<
    (config: Readonly<Record<string, unknown>>) => Readonly<{
      dispose: () => void;
      overlayElement: Readonly<{
        appendChild: (node: unknown) => void;
        getBoundingClientRect?: () => Readonly<{ left: number; top: number }>;
        removeChild: (node: unknown) => void;
      }>;
      updatePosition: () => void;
    }>
  >
>;

type TngPortalOverlayFixture = Readonly<{
  createSpy: ReturnType<
    typeof vi.fn<
      (config: Readonly<Record<string, unknown>>) => Readonly<{
        dispose: () => void;
        overlayElement?: Readonly<{
          appendChild: (node: unknown) => void;
          removeChild: (node: unknown) => void;
        }>;
      }>
    >
  >;
  instances: readonly TngOverlayRefStub[];
  overlay: TngAngularCdkOverlayLike;
}>;

type TngScrollStrategyFixture = Readonly<{
  disableSpy: ReturnType<typeof vi.fn<() => void>>;
  enableSpy: ReturnType<typeof vi.fn<() => void>>;
  overlay: TngAngularCdkOverlayLike;
}>;

function createPositionOptions(): TngOverlayPositionOptions {
  return {
    anchorRect: { height: 24, left: 80, top: 100, width: 44 },
    collision: { flip: true, padding: 12, shift: false },
    direction: 'rtl',
    offset: { align: 6, side: 10 },
    overlayRect: { height: 28, left: 0, top: 0, width: 60 },
    placement: { align: 'end', side: 'left' },
    viewportRect: { height: 600, left: 0, top: 0, width: 800 },
  };
}

function createPositionStrategyStub(): TngPositionStrategyStub {
  const strategy = {} as {
    withPositions: (
      positions: readonly Readonly<Record<string, unknown>>[],
    ) => TngPositionStrategyStub;
    withPush: (push: boolean) => TngPositionStrategyStub;
    withViewportMargin: (margin: number) => TngPositionStrategyStub;
  };

  strategy.withPositions = vi.fn(() => strategy);
  strategy.withPush = vi.fn(() => strategy);
  strategy.withViewportMargin = vi.fn(() => strategy);
  return strategy;
}

function createOverlayRefStub(): TngOverlayRefStub {
  return {
    appendChildSpy: vi.fn<(node: unknown) => void>(() => undefined),
    disposeSpy: vi.fn<() => void>(() => undefined),
    removeChildSpy: vi.fn<(node: unknown) => void>(() => undefined),
    updatePositionSpy: vi.fn<() => void>(() => undefined),
  };
}

function createOverlayElement(
  appendChild: (node: unknown) => void,
  removeChild: (node: unknown) => void,
  overlayPosition: Readonly<{ left: number; top: number }> | null,
): Readonly<{
  appendChild: (node: unknown) => void;
  getBoundingClientRect?: () => Readonly<{ left: number; top: number }>;
  removeChild: (node: unknown) => void;
}> {
  if (overlayPosition === null) {
    return {
      appendChild,
      removeChild,
    };
  }

  return {
    appendChild,
    getBoundingClientRect: (): Readonly<{ left: number; top: number }> => overlayPosition,
    removeChild,
  };
}

function createPositionCreateSpy(
  overlayElement: Readonly<{
    appendChild: (node: unknown) => void;
    getBoundingClientRect?: () => Readonly<{ left: number; top: number }>;
    removeChild: (node: unknown) => void;
  }>,
  dispose: () => void,
  updatePosition: () => void,
): TngPositionCreateSpy {
  return vi.fn<
    (config: Readonly<Record<string, unknown>>) => {
      dispose: () => void;
      overlayElement: Readonly<{
        appendChild: (node: unknown) => void;
        getBoundingClientRect?: () => Readonly<{ left: number; top: number }>;
        removeChild: (node: unknown) => void;
      }>;
      updatePosition: () => void;
    }
  >(() => ({
    dispose,
    overlayElement,
    updatePosition,
  }));
}

function createPositionOverlayFixture(
  overlayPosition: Readonly<{ left: number; top: number }> | null,
): TngPositionOverlayFixture {
  const strategy = createPositionStrategyStub();
  const flexibleConnectedToSpy = vi.fn<(origin: unknown) => TngPositionStrategyStub>(
    () => strategy,
  );
  const overlayRef = createOverlayRefStub();
  const overlayElement = createOverlayElement(
    overlayRef.appendChildSpy,
    overlayRef.removeChildSpy,
    overlayPosition,
  );
  const createSpy = createPositionCreateSpy(
    overlayElement,
    overlayRef.disposeSpy,
    overlayRef.updatePositionSpy,
  );

  return {
    createSpy,
    flexibleConnectedToSpy,
    overlay: {
      create: createSpy,
      position: () => ({ flexibleConnectedTo: flexibleConnectedToSpy }),
    },
    overlayRef,
    strategy,
  };
}

function createPortalOverlayFixture(includeContainer: boolean): TngPortalOverlayFixture {
  const mutableInstances: TngOverlayRefStub[] = [];
  const createSpy = vi.fn<
    (config: Readonly<Record<string, unknown>>) => {
      dispose: () => void;
      overlayElement?: Readonly<{
        appendChild: (node: unknown) => void;
        removeChild: (node: unknown) => void;
      }>;
    }
  >(() => {
    const appendChildSpy = vi.fn<(node: unknown) => void>(() => undefined);
    const removeChildSpy = vi.fn<(node: unknown) => void>(() => undefined);
    const updatePositionSpy = vi.fn<() => void>(() => undefined);
    const disposeSpy = vi.fn<() => void>(() => undefined);
    const overlayRef = { appendChildSpy, disposeSpy, removeChildSpy, updatePositionSpy };
    mutableInstances.push(overlayRef);

    if (!includeContainer) {
      return { dispose: disposeSpy };
    }

    return {
      dispose: disposeSpy,
      overlayElement: {
        appendChild: appendChildSpy,
        removeChild: removeChildSpy,
      },
    };
  });

  return {
    createSpy,
    instances: mutableInstances,
    overlay: {
      create: createSpy,
      position: () => ({
        flexibleConnectedTo: () => createPositionStrategyStub(),
      }),
    },
  };
}

function createScrollStrategyFixture(hasBlockStrategy: boolean): TngScrollStrategyFixture {
  const enableSpy = vi.fn<() => void>(() => undefined);
  const disableSpy = vi.fn<() => void>(() => undefined);
  const overlay: TngAngularCdkOverlayLike = {
    create: () => ({
      dispose: () => undefined,
      overlayElement: {
        appendChild: () => undefined,
        removeChild: () => undefined,
      },
    }),
    position: () => ({
      flexibleConnectedTo: () => createPositionStrategyStub(),
    }),
    scrollStrategies: hasBlockStrategy
      ? {
          block: () => ({
            disable: disableSpy,
            enable: enableSpy,
          }),
        }
      : undefined,
  };

  return { disableSpy, enableSpy, overlay };
}

function getPortalManager(overlay: TngAngularCdkOverlayLike): TngPortalManager {
  const delegates = createAngularCdkOverlayDelegates({ overlay });
  const portalFactory = delegates.createPortalManager;
  if (portalFactory === undefined) {
    throw new Error('Expected createPortalManager delegate.');
  }

  return portalFactory({});
}

function getScrollLockManager(overlay: TngAngularCdkOverlayLike): TngScrollLockManager {
  const delegates = createAngularCdkOverlayDelegates({ overlay });
  const scrollLockFactory = delegates.createScrollLockManager;
  if (scrollLockFactory === undefined) {
    throw new Error('Expected createScrollLockManager delegate.');
  }

  return scrollLockFactory({});
}

it('returns undefined delegates when overlay dependency is not provided', () => {
  const delegates = createAngularCdkOverlayDelegates({ overlay: null });
  expect(delegates.computePosition).toBeUndefined();
  expect(delegates.createPortalManager).toBeUndefined();
  expect(delegates.createScrollLockManager).toBeUndefined();
  expect(delegates.createBackdropController).toBeUndefined();
  expect(delegates.createInteractionController).toBeUndefined();
});

it('computes position using overlay strategy and returns measured coordinates', () => {
  const options = createPositionOptions();
  const fixture = createPositionOverlayFixture({ left: 320, top: 180 });
  const delegates = createAngularCdkOverlayDelegates({ overlay: fixture.overlay });
  const computePosition = delegates.computePosition;
  if (computePosition === undefined) {
    throw new Error('Expected computePosition delegate.');
  }

  const result = computePosition(options);
  const firstCall = fixture.createSpy.mock.calls[0];
  if (firstCall === undefined) {
    throw new Error('Expected overlay.create to be called once.');
  }

  const config = firstCall[0];
  expect(result).toEqual({ align: 'end', side: 'left', x: 320, y: 180 });
  expect(config.width).toBe(options.overlayRect.width);
  expect(config.height).toBe(options.overlayRect.height);
  expect(fixture.flexibleConnectedToSpy).toHaveBeenCalledWith({
    height: options.anchorRect.height,
    width: options.anchorRect.width,
    x: options.anchorRect.left,
    y: options.anchorRect.top,
  });
  expect(fixture.strategy.withPositions).toHaveBeenCalledWith([
    {
      offsetX: -10,
      offsetY: 6,
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'bottom',
    },
  ]);
  expect(fixture.strategy.withPush).toHaveBeenCalledWith(false);
  expect(fixture.strategy.withViewportMargin).toHaveBeenCalledWith(12);
  expect(fixture.overlayRef.updatePositionSpy).toHaveBeenCalledOnce();
  expect(fixture.overlayRef.disposeSpy).toHaveBeenCalledOnce();
});

it('falls back to tailng positioning when overlay measurement is unavailable', () => {
  const options = createPositionOptions();
  const expected = computeOverlayPosition(options);
  const fixture = createPositionOverlayFixture(null);
  const delegates = createAngularCdkOverlayDelegates({ overlay: fixture.overlay });
  const computePosition = delegates.computePosition;
  if (computePosition === undefined) {
    throw new Error('Expected computePosition delegate.');
  }

  const result = computePosition(options);
  expect(result).toEqual(expected);
  expect(fixture.overlayRef.updatePositionSpy).toHaveBeenCalledOnce();
  expect(fixture.overlayRef.disposeSpy).toHaveBeenCalledOnce();
});

it('mounts and unmounts portals through overlay-created containers', () => {
  const fixture = createPortalOverlayFixture(true);
  const manager = getPortalManager(fixture.overlay);
  const firstNode: TngPortalNode = { id: 'first' };
  const secondNode: TngPortalNode = { id: 'second' };

  expect(manager.mount({ node: firstNode, portalId: 'menu' })).toBe(true);
  expect(manager.isMounted('menu')).toBe(true);
  expect(manager.getMountedPortalIds()).toEqual(['menu']);
  expect(fixture.instances[0]?.appendChildSpy).toHaveBeenCalledWith(firstNode);

  expect(manager.mount({ node: secondNode, portalId: 'menu' })).toBe(true);
  expect(fixture.instances[0]?.removeChildSpy).toHaveBeenCalledWith(firstNode);
  expect(fixture.instances[0]?.disposeSpy).toHaveBeenCalledOnce();

  manager.unmount('menu');
  expect(fixture.instances[1]?.removeChildSpy).toHaveBeenCalledWith(secondNode);
  expect(fixture.instances[1]?.disposeSpy).toHaveBeenCalledOnce();
  expect(manager.getMountedPortalIds()).toEqual([]);
});

it('fails portal mount when overlay container is unavailable', () => {
  const fixture = createPortalOverlayFixture(false);
  const manager = getPortalManager(fixture.overlay);
  const node: TngPortalNode = { id: 'missing-container' };

  expect(manager.mount({ node, portalId: 'dialog' })).toBe(false);
  expect(manager.getMountedPortalIds()).toEqual([]);
  expect(fixture.instances[0]?.disposeSpy).toHaveBeenCalledOnce();
});

it('uses block scroll strategy with lock-id reference counting', () => {
  const fixture = createScrollStrategyFixture(true);
  const manager = getScrollLockManager(fixture.overlay);
  manager.acquire('overlay-a');
  manager.acquire('overlay-a');
  manager.acquire('overlay-b');
  manager.release('overlay-a');
  expect(manager.isLocked()).toBe(true);
  manager.release('overlay-b');
  expect(manager.isLocked()).toBe(false);

  expect(fixture.enableSpy).toHaveBeenCalledOnce();
  expect(fixture.disableSpy).toHaveBeenCalledOnce();
});

it('falls back to tailng scroll lock manager when block strategy is missing', () => {
  const fixture = createScrollStrategyFixture(false);
  const manager = getScrollLockManager(fixture.overlay);
  manager.acquire('sheet');
  expect(manager.isLocked()).toBe(true);
  manager.release('sheet');
  expect(manager.isLocked()).toBe(false);
});
