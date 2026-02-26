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
  /** When true (multiselect), Enter toggles options; we must not call commitActive again when handleKey already ran. */
  multiSelect?: boolean;
}

/** Options to customize keyboard behavior (e.g. AutoComplete may disable typeahead). */
export interface ComboboxKeyboardOptions {
  /** Enable typeahead when open. Default true. AutoComplete may set false and handle in input. */
  enableTypeahead?: boolean;
  /** Keys that open when closed. Default: ArrowDown, ArrowUp, Enter, Space. */
  keysToOpen?: readonly string[];
  /** Keys that open when closed but must NOT preventDefault (e.g. Backspace/Delete so input can delete). */
  keysToOpenNoPreventDefault?: readonly string[];
  /**
   * When true (default), Space commits the active option when open (Select behavior).
   * When false (AutoComplete), Space inserts into input like normal typing (e.g. "United St" for filtering).
   */
  spaceCommits?: boolean;
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
    spaceCommits = true,
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

  // Space: when spaceCommits (Select) → commit; when !spaceCommits (AutoComplete) → return so input receives it
  if (event.key === ' ' || event.key === 'Spacebar') {
    if (spaceCommits) {
      event.preventDefault();
      context.listbox?.commitActive();
    }
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
    // Single-select: listbox did select-active. Still need commitActive to close overlay.
    // Multi-select: listbox did toggle-active. Do NOT call commitActive—it would toggle again.
    if (event.key === 'Enter' && !context.multiSelect) {
      context.listbox?.commitActive();
    }
    return;
  }

  // Enter: listbox did not handle it (no active). Fallback: close if we have a selection.
  if (event.key === 'Enter') {
    event.preventDefault();
    context.listbox?.commitActive();
  }
}
