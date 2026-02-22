import type { TngListboxAction, TngListboxState } from './listbox.types';

function freezeState(state: Omit<TngListboxState, 'disabledIds'> & { disabledIds: ReadonlySet<string> }): TngListboxState {
  return Object.freeze({
    disabled: state.disabled,
    activeId: state.activeId,
    orderedIds: Object.freeze([...state.orderedIds]),
    disabledIds: state.disabledIds,
  });
}

export function createInitialListboxState(): TngListboxState {
  return freezeState({
    disabled: false,
    activeId: null,
    orderedIds: Object.freeze([]),
    disabledIds: new Set<string>(),
  });
}

function clampActiveId(state: TngListboxState): string | null {
  if (state.orderedIds.length === 0) return null;
  if (state.activeId && state.orderedIds.includes(state.activeId) && !state.disabledIds.has(state.activeId)) {
    return state.activeId;
  }
  // pick first enabled
  for (const id of state.orderedIds) {
    if (!state.disabledIds.has(id)) return id;
  }
  return null;
}

export function reduceListboxState(
  prev: TngListboxState,
  action: TngListboxAction,
): TngListboxState {
  switch (action.type) {
    case 'set-disabled': {
      const next = freezeState({
        disabled: action.disabled,
        activeId: prev.activeId,
        orderedIds: prev.orderedIds,
        disabledIds: prev.disabledIds,
      });
      return freezeState({
        ...next,
        activeId: clampActiveId(next),
      });
    }

    case 'set-active': {
      return freezeState({
        disabled: prev.disabled,
        activeId: action.id,
        orderedIds: prev.orderedIds,
        disabledIds: prev.disabledIds,
      });
    }

    case 'register-option': {
      const nextOrdered = [...prev.orderedIds, action.option.id];
      const nextDisabledIds = new Set(prev.disabledIds);
      if (action.option.disabled) nextDisabledIds.add(action.option.id);

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

    case 'unregister-option': {
      const nextOrdered = prev.orderedIds.filter((x) => x !== action.id);
      const nextDisabledIds = new Set(prev.disabledIds);
      nextDisabledIds.delete(action.id);

      const next = freezeState({
        disabled: prev.disabled,
        activeId: prev.activeId === action.id ? null : prev.activeId,
        orderedIds: Object.freeze(nextOrdered),
        disabledIds: nextDisabledIds,
      });

      return freezeState({
        ...next,
        activeId: clampActiveId(next),
      });
    }

    case 'nav':
    case 'click-option': {
      // state transitions for these are handled in listbox.ts (needs wrap + skip-disabled logic).
      // reducer stays focused on structural changes; we keep it pure & minimal.
      return prev;
    }

    default:
      return prev;
  }
}
