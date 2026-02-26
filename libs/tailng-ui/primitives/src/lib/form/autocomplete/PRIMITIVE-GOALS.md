# Autocomplete Primitive — Goals (Locked)

Defines what the Autocomplete primitive **owns** vs. what it **delegates** to the consumer.

---

## ✅ Primitive OWNS

### Open/close state + focus management
- `open` model (boolean)
- Open on input focus / ArrowDown / ArrowUp / click
- Close on Escape, outside click, selection commit
- Focus management: trigger owns focus; return focus to input when closing

### Combobox ARIA wiring
- `role="combobox"` on the input (trigger)
- `aria-controls` → listbox/content id when open
- `aria-activedescendant` → active option id when open
- `aria-expanded` → open state
- `aria-haspopup="listbox"`

### Keyboard behavior mapping
- **Closed**: ArrowDown/ArrowUp/Backspace/Delete → open + ensure active (first/last)
- **Open**: Escape → close; Enter → commit active; Space → inserts into input (typing, e.g. "United St")
- **Open**: Arrow keys, Home, End → `handleKey` (listbox), sync activeDescendant
- **Open**: Tab → close + move focus (or per spec)
- Typeahead routing: optionally route single chars to listbox or leave to input (configurable)

### Overlay positioning + min-width strategy
- Overlay anchored to trigger (input)
- Min-width = trigger width (allow wider if content needs it)
- Positioning logic reused from Select overlay where possible

### Bridge to Listbox
- `ensureActive(pref?: 'first' | 'last')`
- `handleKey(key, shiftKey)` for arrows, Home, End
- `typeahead(key)` — optional; Autocomplete may disable and let input handle typing
- `commitActive()` — select active option, close, sync value to input
- Uses shared `ComboboxListboxApi` / `handleComboboxKeydown`

---

## ❌ Primitive does NOT own

### Filtering logic
- Consumer owns filtering (via `options` input, computed list, or async)
- Primitive renders whatever options it receives; no filter-by-query logic

### Fetching
- Consumer fetches data; primitive does not perform network requests
- Primitive may expose `loading` input and render loading state
- Consumer passes options + loading state; primitive displays them

---

## Summary

| Concern                    | Owner        |
|---------------------------|-------------|
| Open/close, focus         | Primitive   |
| ARIA (combobox wiring)    | Primitive   |
| Keyboard mapping          | Primitive   |
| Overlay positioning       | Primitive   |
| Listbox bridge (API)      | Primitive   |
| Filtering                 | Consumer    |
| Fetching / async data     | Consumer    |
