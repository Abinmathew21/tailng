/**
 * Shared combobox keyboard "brain" for Select and AutoComplete.
 * Handles closed-state keys, open-state keys, typeahead, and activeDescendant sync.
 */

import { ensureActiveAndSync, syncActiveDescendant } from './combobox.active';
import type { ComboboxListboxApi } from './combobox.listbox-api';
export type { ComboboxListboxApi } from './combobox.listbox-api';

/** Context passed to the combobox keyboard handler. */
export interface ComboboxKeyboardContext {
  disabled: boolean;
  open: boolean;
  /** Open the popup and prepare for interaction (e.g. Select opens list, AutoComplete opens + may filter). */
  openSelect: () => void;
  close: () => void;
  listbox: ComboboxListboxApi | null;
  /** Sync aria-activedescendant on the trigger (who owns it). */
  setActiveDescendantId: (id: string | null) => void;
}

/** Options to customize keyboard behavior (e.g. AutoComplete may disable typeahead). */
export interface ComboboxKeyboardOptions {
  /** Enable typeahead when open. Default true. AutoComplete may set false and handle in input. */
  enableTypeahead?: boolean;
  /** Keys that open when closed. Default: ArrowDown, ArrowUp, Enter, Space. */
  keysToOpen?: readonly string[];
  /** Keys that open when closed but must NOT preventDefault (e.g. Backspace/Delete so input can delete). */
  keysToOpenNoPreventDefault?: readonly string[];
}

const DEFAULT_KEYS_TO_OPEN = [
  'ArrowDown',
  'ArrowUp',
  'Enter',
  ' ',
  'Spacebar',
] as const;

/**
 * Handles combobox keyboard events. Call from the trigger's keydown handler.
 * Mutates `event` (preventDefault/stopPropagation) when the key is handled.
 */
export function handleComboboxKeydown(
  event: KeyboardEvent,
  context: ComboboxKeyboardContext,
  options: ComboboxKeyboardOptions = {}
): void {
  if (context.disabled) return;

  const {
    enableTypeahead = true,
    keysToOpen = DEFAULT_KEYS_TO_OPEN,
    keysToOpenNoPreventDefault = [],
  } = options;

  // --- Closed state: ArrowDown/ArrowUp/Enter/Space open + set active ---
  if (!context.open) {
    if (keysToOpen.includes(event.key)) {
      const noPrevent = keysToOpenNoPreventDefault.includes(event.key);
      if (!noPrevent) {
        event.preventDefault();
      }
      context.openSelect();
      ensureActiveAndSync(
        context.listbox,
        context.setActiveDescendantId,
        event.key === 'ArrowUp' ? 'last' : 'first'
      );
    }
    return;
  }

  // --- Open state ---

  // Tab: close and allow browser to move focus (do not preventDefault)
  if (event.key === 'Tab') {
    context.close();
    return;
  }

  // Escape: close
  if (event.key === 'Escape') {
    if (!event.defaultPrevented) {
      event.preventDefault();
      event.stopPropagation();
      context.close();
    }
    return;
  }

  // Space: commit active (like Enter)
  if (event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    context.listbox?.commitActive();
    return;
  }

  // Typeahead: single char (exclude Space, modifiers) → route to listbox or ignore
  if (
    enableTypeahead &&
    event.key.length === 1 &&
    event.key !== ' ' &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  ) {
    const moved = context.listbox?.typeahead(event.key) ?? false;
    if (moved) {
      syncActiveDescendant(context.listbox, context.setActiveDescendantId);
      event.preventDefault();
    }
    return;
  }

  // Arrow keys, Home, End, etc.
  const moved = context.listbox?.handleKey(event.key, event.shiftKey) ?? false;
  if (moved) {
    syncActiveDescendant(context.listbox, context.setActiveDescendantId);
    event.preventDefault();
    return;
  }

  // Enter (or Space fallback): commit active
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    context.listbox?.commitActive();
  }
}
