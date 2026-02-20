import {
  type TngRovingFocusController,
  type TngRovingFocusOptions,
} from './roving-focus.types';

function findEnabledIds(
  itemIds: readonly string[],
  disabledIds: readonly string[],
): readonly string[] {
  return itemIds.filter((id) => !disabledIds.includes(id));
}

export function createRovingFocusController(
  options: TngRovingFocusOptions,
): TngRovingFocusController {
  const enabledIds = findEnabledIds(options.itemIds, options.disabledIds ?? []);
  const loop = options.loop ?? true;
  let activeId = options.initialActiveId ?? enabledIds[0] ?? null;

  const getActiveId = (): string | null => activeId;

  const home = (): string | null => {
    activeId = enabledIds[0] ?? null;
    return activeId;
  };

  const end = (): string | null => {
    activeId = enabledIds.at(-1) ?? null;
    return activeId;
  };

  const moveBy = (delta: number): string | null => {
    if (enabledIds.length === 0 || activeId === null) {
      return activeId;
    }

    const currentIndex = enabledIds.indexOf(activeId);
    const nextIndex = currentIndex + delta;

    if (nextIndex >= 0 && nextIndex < enabledIds.length) {
      activeId = enabledIds[nextIndex] ?? null;
      return activeId;
    }

    if (loop) {
      activeId = delta > 0 ? enabledIds[0] ?? null : enabledIds.at(-1) ?? null;
    }

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
