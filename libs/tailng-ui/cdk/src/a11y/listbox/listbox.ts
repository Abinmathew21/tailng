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
  // for typeahead
  text?: string;
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

  setItemOrder: (ids: readonly string[]) => void;

  setActiveId: (id: string | null) => void;
  typeahead: (key: string) => boolean;

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

  const idToText = new Map<string, string>();

  let typeaheadBuffer = '';
  let typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

  function normalizeText(s: string): string {
    return s.trim().toLowerCase();
  }

  function isEnabled(id: string): boolean {
    return !disabledIds.includes(id);
  }

  function findTypeaheadMatch(prefix: string): string | null {
    const p = normalizeText(prefix);
    if (!p) return null;

    // Start searching from the item after current active, then wrap.
    const active = focusController.getActiveId();
    const startIndex = active ? itemIds.indexOf(active) : -1;

    const ordered = [
      ...itemIds.slice(startIndex + 1),
      ...itemIds.slice(0, Math.max(0, startIndex + 1)),
    ];

    for (const id of ordered) {
      if (!isEnabled(id)) continue;
      const text = idToText.get(id);
      if (!text) continue;
      if (normalizeText(text).startsWith(p)) return id;
    }

    return null;
  }

  function syncFocusController(): void {
    focusController.setItemIds(itemIds);
    focusController.setDisabledIds(disabledIds);
  }

  function registerOption(option: TngListboxOption<T>): void {
    idToValue.set(option.id, option.value);

    // capture label text for typeahead
    if (typeof option.text === 'string') {
      idToText.set(option.id, option.text);
    }

    // upsert without duplicating order
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

  function resolveNextActiveAfterRemoval(options: {
    removedIndex: number;
    itemIds: readonly string[];
    disabledIds: readonly string[];
    loop: boolean;
  }): string | null {
    const { removedIndex, itemIds, disabledIds, loop } = options;
  
    if (itemIds.length === 0) return null;
  
    const isEnabled = (id: string) => !disabledIds.includes(id);
  
    // If we don't know where it was, just go to first enabled.
    if (removedIndex < 0) {
      return itemIds.find(isEnabled) ?? null;
    }
  
    // Prefer "next" in the same position (since array shrank).
    for (let i = removedIndex; i < itemIds.length; i++) {
      const id = itemIds[i]!;
      if (isEnabled(id)) return id;
    }
  
    // If loop, wrap to start.
    if (loop) {
      for (let i = 0; i < removedIndex; i++) {
        const id = itemIds[i]!;
        if (isEnabled(id)) return id;
      }
    }
  
    // Fallback: previous enabled
    for (let i = Math.min(removedIndex - 1, itemIds.length - 1); i >= 0; i--) {
      const id = itemIds[i]!;
      if (isEnabled(id)) return id;
    }
  
    return null;
  }

  function unregisterOption(id: string): void {
    idToValue.delete(id);
    idToText.delete(id);
  
    const prevActive = focusController.getActiveId();
    const wasActive = prevActive === id;
  
    // capture position in the *old* order (before removal)
    const removedIndex = itemIds.indexOf(id);
  
    // remove from state
    itemIds = itemIds.filter((x) => x !== id);
    disabledIds = disabledIds.filter((x) => x !== id);
  
    if (selectionModel.isSelected(id)) {
      selectionModel.deselect(id);
    }
  
    // sync first (this may clear active if it points to removed id)
    syncFocusController();
  
    // ✅ if the removed option was active, pick next enabled
    if (wasActive) {
      const nextActive = resolveNextActiveAfterRemoval({
        removedIndex,
        itemIds,
        disabledIds,
        loop,
      });
  
      focusController.setActiveId(nextActive);
    }
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

  function extendRangeToActive(previousActive: string | null): void {
    if (selectionMode !== 'multiple') return;
  
    const active = focusController.getActiveId();
    if (active === null) return;
    if (disabledIds.includes(active)) return;
  
    const enabledItemIds = itemIds.filter((x) => !disabledIds.includes(x));
  
    const anchor =
      selectionModel.getAnchor() ??
      previousActive ??
      active;
  
    selectionModel.selectRange(anchor, active, {
      orderedValues: enabledItemIds,
      rangeMode: 'merge',
    });
  }

  function applyNavigation(action: TngListNavigationAction): void {
    if (disabled) return;
    const prevActive = focusController.getActiveId();

    switch (action.type) {
      case 'move-next': {
        const active = focusController.getActiveId();
        if (active === null) {
          const first = itemIds.find((id) => !disabledIds.includes(id));
          if (first) focusController.setActiveId(first);
        } else {
          focusController.moveNext();
        }
  
        if (action.extendSelection) {
          extendRangeToActive(prevActive);
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
  
        if (action.extendSelection) {
          extendRangeToActive(prevActive);
        }
        break;
      }
  
      case 'move-first': {
        const first = itemIds.find((id) => !disabledIds.includes(id));
        if (first) focusController.setActiveId(first);
  
        if (action.extendSelection) {
          extendRangeToActive(prevActive);
        }
        break;
      }
  
      case 'move-last': {
        const last = [...itemIds].reverse().find((id) => !disabledIds.includes(id));
        if (last) focusController.setActiveId(last);
  
        if (action.extendSelection) {
          extendRangeToActive(prevActive);
        }
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
    // reorder only registered itemIds; keep uniqueness; preserve leftovers
    const registered = new Set(itemIds);
  
    const next: string[] = [];
    const seen = new Set<string>();
  
    for (const id of ids) {
      if (!id || seen.has(id)) continue;
      if (!registered.has(id)) continue;
      seen.add(id);
      next.push(id);
    }
  
    // append any registered ids not present in DOM query result
    for (const id of itemIds) {
      if (!seen.has(id)) next.push(id);
    }
  
    itemIds = next;
    syncFocusController();
  }

  function setActiveId(id: string | null): void {
    focusController.setActiveId(id);
  }
  
  function typeahead(key: string): boolean {
    // only single printable chars
    if (!key || key.length !== 1) return false;
  
    // reset timer / buffer
    if (typeaheadTimer) clearTimeout(typeaheadTimer);
    typeaheadBuffer += key;
    typeaheadTimer = setTimeout(() => {
      typeaheadBuffer = '';
      typeaheadTimer = null;
    }, 500);
  
    const match = findTypeaheadMatch(typeaheadBuffer);
    if (!match) return false;
  
    focusController.setActiveId(match);
    return true;
  }

  return Object.freeze({
    registerOption,
    unregisterOption,
    setOptionDisabled,
    setItemOrder,
    setActiveId,
    typeahead,
    handleKeyDown,
    handleClick,
    getActiveId,
    getSelectedValues,
    getHostAttributes,
    getOptionAttributes,
  });
}