import type { TngListboxAction, TngListboxState } from './listbox.types';

type TngListboxStateDraft = {
  readonly disabled: boolean;
  readonly activeId: string | null;
  readonly orderedIds: readonly string[];
  readonly disabledIds: readonly string[];
};

function freezeState(state: TngListboxStateDraft): TngListboxState {
  return Object.freeze({
    disabled: state.disabled,
    activeId: state.activeId,
    orderedIds: Object.freeze([...state.orderedIds]),
    disabledIds: Object.freeze([...state.disabledIds]),
  });
}

export function createInitialListboxState(): TngListboxState {
  return freezeState({
    disabled: false,
    activeId: null,
    orderedIds: Object.freeze([]),
    disabledIds: Object.freeze([]),
  });
}

function clampActiveId(state: TngListboxState): string | null {
  if (state.orderedIds.length === 0) return null;
  if (state.activeId && state.orderedIds.includes(state.activeId) && !state.disabledIds.includes(state.activeId)) {
    return state.activeId;
  }
  // pick first enabled
  for (const id of state.orderedIds) {
    if (!state.disabledIds.includes(id)) return id;
  }
  return null;
}

function reduceSetDisabled(prev: TngListboxState, disabled: boolean): TngListboxState {
  const next = freezeState({
    disabled,
    activeId: prev.activeId,
    orderedIds: prev.orderedIds,
    disabledIds: prev.disabledIds,
  });

  return freezeState({
    ...next,
    activeId: clampActiveId(next),
  });
}

function reduceSetActive(prev: TngListboxState, id: string | null): TngListboxState {
  return freezeState({
    disabled: prev.disabled,
    activeId: id,
    orderedIds: prev.orderedIds,
    disabledIds: prev.disabledIds,
  });
}

function reduceRegisterOption(
  prev: TngListboxState,
  option: Readonly<{ id: string; disabled?: boolean }>,
): TngListboxState {
  const nextOrdered = [...prev.orderedIds, option.id];
  const nextDisabledIds =
    option.disabled && !prev.disabledIds.includes(option.id)
      ? Object.freeze([...prev.disabledIds, option.id])
      : prev.disabledIds;

  const next = freezeState({
    disabled: prev.disabled,
    activeId: prev.activeId,
    orderedIds: Object.freeze(nextOrdered),
    disabledIds: nextDisabledIds,
  });

  return freezeState({
    ...next,
    activeId: clampActiveId(next),
  });
}

function reduceUnregisterOption(prev: TngListboxState, id: string): TngListboxState {
  const nextOrdered = prev.orderedIds.filter((x) => x !== id);
  const nextDisabledIds = Object.freeze(prev.disabledIds.filter((x) => x !== id));

  const next = freezeState({
    disabled: prev.disabled,
    activeId: prev.activeId === id ? null : prev.activeId,
    orderedIds: Object.freeze(nextOrdered),
    disabledIds: nextDisabledIds,
  });

  return freezeState({
    ...next,
    activeId: clampActiveId(next),
  });
}

export function reduceListboxState(
  prev: TngListboxState,
  action: TngListboxAction,
): TngListboxState {
  switch (action.type) {
    case 'set-disabled':
      return reduceSetDisabled(prev, action.disabled);

    case 'set-active':
      return reduceSetActive(prev, action.id);

    case 'register-option':
      return reduceRegisterOption(prev, action.option);

    case 'unregister-option':
      return reduceUnregisterOption(prev, action.id);

    case 'nav':
    case 'click-option':
      // state transitions for these are handled in listbox.ts (needs wrap + skip-disabled logic).
      // reducer stays focused on structural changes; we keep it pure & minimal.
      return prev;

    default:
      return prev;
  }
}
