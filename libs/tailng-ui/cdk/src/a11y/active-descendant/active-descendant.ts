import {
  type TngActiveDescendantController,
  type TngActiveDescendantOptions,
} from './active-descendant.types';

export function createActiveDescendantController(
  options: TngActiveDescendantOptions,
): TngActiveDescendantController {
  let activeId = options.initialActiveId ?? null;

  const getActiveId = (): string | null => activeId;

  const setActiveId = (id: string | null): string | null => {
    activeId = id;
    return activeId;
  };

  const clear = (): void => {
    activeId = null;
  };

  const getHostAttributes = (): Readonly<Record<string, string>> => {
    const attributes: Record<string, string> = { id: options.hostId };
    if (activeId !== null) {
      attributes['aria-activedescendant'] = activeId;
    }

    return Object.freeze(attributes);
  };

  return Object.freeze({ clear, getActiveId, getHostAttributes, setActiveId });
}
