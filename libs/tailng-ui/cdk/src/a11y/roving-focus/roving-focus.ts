import {
  type TngRovingFocusController,
  type TngRovingFocusOptions,
} from './roving-focus.types';

type TngMoveOptions = Readonly<{
  activeId: string | null;
  delta: -1 | 1;
  enabledIds: readonly string[];
  loop: boolean;
}>;

function findEnabledIds(
  itemIds: readonly string[],
  disabledIds: readonly string[],
): readonly string[] {
  return itemIds.filter((id) => !disabledIds.includes(id));
}

function firstEnabledId(enabledIds: readonly string[]): string | null {
  return enabledIds[0] ?? null;
}

function lastEnabledId(enabledIds: readonly string[]): string | null {
  return enabledIds.length > 0 ? enabledIds[enabledIds.length - 1] ?? null : null;
}

function resolveBoundaryActiveId(options: TngMoveOptions): string | null {
  return options.delta > 0
    ? firstEnabledId(options.enabledIds)
    : lastEnabledId(options.enabledIds);
}

function resolveNextActiveId(options: TngMoveOptions): string | null {
  if (options.activeId === null || options.enabledIds.length === 0) {
    return options.activeId;
  }

  const currentIndex = options.enabledIds.indexOf(options.activeId);
  if (currentIndex < 0) {
    return resolveBoundaryActiveId(options);
  }

  const nextIndex = currentIndex + options.delta;
  if (nextIndex >= 0 && nextIndex < options.enabledIds.length) {
    return options.enabledIds[nextIndex] ?? null;
  }

  if (!options.loop) {
    return options.activeId;
  }

  return resolveBoundaryActiveId(options);
}

export function createRovingFocusController(
  options: TngRovingFocusOptions,
): TngRovingFocusController {
  const enabledIds = findEnabledIds(options.itemIds, options.disabledIds ?? []);
  const loop = options.loop ?? true;
  let activeId = options.initialActiveId ?? enabledIds[0] ?? null;

  const getActiveId = (): string | null => activeId;

  const home = (): string | null => {
    activeId = firstEnabledId(enabledIds);
    return activeId;
  };

  const end = (): string | null => {
    activeId = lastEnabledId(enabledIds);
    return activeId;
  };

  const moveBy = (delta: -1 | 1): string | null => {
    activeId = resolveNextActiveId({
      activeId,
      delta,
      enabledIds,
      loop,
    });
    return activeId;
  };

  const moveNext = (): string | null => moveBy(1);
  const movePrev = (): string | null => moveBy(-1);

  const setActiveId = (id: string | null): string | null => {
    if (id === null || enabledIds.includes(id)) {
      activeId = id;
    }

    return activeId;
  };

  return Object.freeze({ end, getActiveId, home, moveNext, movePrev, setActiveId });
}
