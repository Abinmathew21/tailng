import { resolveListNavigationKeyAction } from '../list-navigation/list-navigation';
import type {
  TngListNavigationKeyboardEvent,
  TngListNavigationAction,
} from '../list-navigation/list-navigation.types';

import { createSelectionModel } from '../../collections/selection-model/selection-model';
import { createActiveDescendantController } from '../active-descendant/active-descendant';
import type { TngActiveDescendantController } from '../active-descendant/active-descendant.types';
import type { TngSelectionMode } from '../../collections/selection-model/selection-model.types';

export type TngListboxSelectionMode = 'single' | 'multiple';

export type TngListboxOption<T> = Readonly<{
  id: string;
  value: T;
  disabled?: boolean;
}>;

export type TngListboxConfig = Readonly<{
  hostId: string;
  selectionMode?: TngListboxSelectionMode;
  orientation?: 'vertical' | 'horizontal';
  direction?: 'ltr' | 'rtl';
  loop?: boolean;
  disabled?: boolean;
}>;

export type TngListboxController<T> = Readonly<{
  registerOption: (option: TngListboxOption<T>) => void;
  unregisterOption: (id: string) => void;

  setOptionDisabled: (id: string, disabled: boolean) => void;

  // ✅ NEW: force canonical order (DOM order from directive)
  setItemOrder: (ids: readonly string[]) => void;

  handleKeyDown: (event: TngListNavigationKeyboardEvent) => TngListNavigationAction | null;
  handleClick: (id: string, shiftKey?: boolean) => void;

  getActiveId: () => string | null;
  getSelectedValues: () => readonly T[];

  getHostAttributes: () => Readonly<Record<string, string>>;
  getOptionAttributes: (id: string) => Readonly<Record<string, unknown>>;
}>;

function toSelectionMode(mode: TngListboxSelectionMode | undefined): TngSelectionMode {
  return mode === 'multiple' ? 'multiple' : 'single';
}

export function createListboxController<T>(config: TngListboxConfig): TngListboxController<T> {
  const {
    hostId,
    selectionMode: selectionModeInput,
    orientation = 'vertical',
    direction = 'ltr',
    loop = true,
    disabled = false,
  } = config;

  const selectionMode = toSelectionMode(selectionModeInput);

  const selectionModel = createSelectionModel<string>({ mode: selectionMode });

  const focusController: TngActiveDescendantController =
    createActiveDescendantController({ hostId, loop });

  const idToValue = new Map<string, T>();

  let itemIds: string[] = [];
  let disabledIds: string[] = [];

  function syncFocusController(): void {
    focusController.setItemIds(itemIds);
    focusController.setDisabledIds(disabledIds);
  }

  function registerOption(option: TngListboxOption<T>): void {
    idToValue.set(option.id, option.value);

    // ✅ upsert without duplicating order
    if (!itemIds.includes(option.id)) {
      itemIds = [...itemIds, option.id];
    }

    const isDisabled = option.disabled === true;
    const wasDisabled = disabledIds.includes(option.id);

    if (isDisabled && !wasDisabled) {
      disabledIds = [...disabledIds, option.id];
    } else if (!isDisabled && wasDisabled) {
      disabledIds = disabledIds.filter((x) => x !== option.id);
    }

    syncFocusController();
  }

  function unregisterOption(id: string): void {
    idToValue.delete(id);

    itemIds = itemIds.filter((x) => x !== id);
    disabledIds = disabledIds.filter((x) => x !== id);

    if (selectionModel.isSelected(id)) {
      selectionModel.deselect(id);
    }

    syncFocusController();
  }

  function setOptionDisabled(id: string, isDisabled: boolean): void {
    if (!itemIds.includes(id)) return;

    const wasDisabled = disabledIds.includes(id);

    if (isDisabled && !wasDisabled) {
      disabledIds = [...disabledIds, id];
    } else if (!isDisabled && wasDisabled) {
      disabledIds = disabledIds.filter((x) => x !== id);
    } else {
      return;
    }

    // ✅ active-descendant will reconcile if active becomes disabled
    syncFocusController();
  }

  function applyNavigation(action: TngListNavigationAction): void {
    if (disabled) return;

    switch (action.type) {
      case 'move-next': {
        const active = focusController.getActiveId();
        if (active === null) {
          const first = itemIds.find((id) => !disabledIds.includes(id));
          if (first) focusController.setActiveId(first);
        } else {
          focusController.moveNext();
        }
        break;
      }

      case 'move-prev': {
        const active = focusController.getActiveId();
        if (active === null) {
          const first = itemIds.find((id) => !disabledIds.includes(id));
          if (first) focusController.setActiveId(first);
        } else {
          focusController.movePrev();
        }
        break;
      }

      case 'move-first': {
        const first = itemIds.find((id) => !disabledIds.includes(id));
        if (first) focusController.setActiveId(first);
        break;
      }

      case 'move-last': {
        const last = [...itemIds].reverse().find((id) => !disabledIds.includes(id));
        if (last) focusController.setActiveId(last);
        break;
      }

      case 'select-active': {
        const active = focusController.getActiveId();
        if (active !== null && !disabledIds.includes(active)) {
          selectionModel.select(active);
        }
        break;
      }

      case 'toggle-active': {
        const active = focusController.getActiveId();
        if (active !== null && !disabledIds.includes(active)) {
          selectionModel.toggle(active);
        }
        break;
      }

      case 'select-all': {
        if (selectionMode !== 'multiple') return;

        selectionModel.clear();
        for (const id of itemIds) {
          if (!disabledIds.includes(id)) selectionModel.select(id);
        }
        break;
      }

      case 'exit':
      default:
        break;
    }
  }

  function handleKeyDown(event: TngListNavigationKeyboardEvent): TngListNavigationAction | null {
    const action = resolveListNavigationKeyAction(event, {
      orientation,
      direction,
      multiSelect: selectionMode === 'multiple',
      behavior: 'listbox',
    });

    if (!action) return null;

    applyNavigation(action);
    return action;
  }

  function handleClick(id: string, shiftKey?: boolean): void {
    if (disabled) return;
    if (disabledIds.includes(id)) return;

    const anchor = selectionModel.getAnchor() ?? focusController.getActiveId();

    focusController.setActiveId(id);

    if (selectionMode === 'multiple' && shiftKey === true && anchor !== null) {
      const enabledItemIds = itemIds.filter((x) => !disabledIds.includes(x));

      selectionModel.selectRange(anchor, id, {
        orderedValues: enabledItemIds,
        rangeMode: 'merge',
      });
      return;
    }

    if (selectionMode === 'multiple') {
      selectionModel.toggle(id);
      return;
    }

    selectionModel.select(id);
  }

  function getActiveId(): string | null {
    return focusController.getActiveId();
  }

  function getSelectedValues(): readonly T[] {
    return selectionModel
      .getSelected()
      .map((id) => idToValue.get(id))
      .filter((v): v is T => v !== undefined);
  }

  function getHostAttributes(): Readonly<Record<string, string>> {
    return {
      role: 'listbox',
      ...(selectionMode === 'multiple' ? { 'aria-multiselectable': 'true' } : {}),
      ...focusController.getHostAttributes(),
    };
  }

  function getOptionAttributes(id: string): Readonly<Record<string, unknown>> {
    const isSelected = selectionModel.isSelected(id);
    const isDisabled = disabledIds.includes(id);
    const isActive = focusController.getActiveId() === id;

    return {
      role: 'option',
      id,
      'aria-selected': isSelected,
      'aria-disabled': isDisabled || undefined,
      'data-active': isActive || undefined,
      'data-selected': isSelected || undefined,
      'data-disabled': isDisabled || undefined,
    };
  }

  function setItemOrder(ids: readonly string[]): void {
    // keep only known ids and preserve uniqueness in the incoming order
    const next: string[] = [];
    const seen = new Set<string>();
  
    for (const id of ids) {
      if (!id || seen.has(id)) continue;
      if (!idToValue.has(id)) continue; // only options that exist
      seen.add(id);
      next.push(id);
    }
  
    itemIds = next;
    syncFocusController();
  }

  return Object.freeze({
    registerOption,
    unregisterOption,
    setOptionDisabled,
    setItemOrder,
    handleKeyDown,
    handleClick,
    getActiveId,
    getSelectedValues,
    getHostAttributes,
    getOptionAttributes,
  });
}