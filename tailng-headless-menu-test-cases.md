# TailNG Headless Menu Primitives — Test Cases (TDD) v2

This revision **locks deterministic contracts** so the checklist is executable as TDD.

Headless primitives under test:
- **MenuBar**
- **Menu**
- **MenuTrigger** (button trigger)
- **ContextMenuTrigger** (right-click + keyboard)
- **MenuItem**

Target behavior:
- **Arrow keys** navigate items
- **Tab / Shift+Tab** exits (closes) and browser focus moves naturally to next/previous focusable
- Default focus strategy: **active-descendant** (Angular/ARIA-like)

---

## 0) Shared fixture (for most tests)

DOM order in the test harness:

1. Focusable element **before** the trigger (e.g., `<button data-testid="before">Before</button>`)
2. **Button trigger** (e.g., `<button data-testid="btn-trigger">Actions</button>`)
3. Focusable element **after** the trigger (e.g., `<input data-testid="after" />`)
4. **Menu panel** with 4 items:
   - Item A (enabled) id=`mi-a` value=`"a"`
   - Item B (enabled) id=`mi-b` value=`"b"`
   - Item C (disabled) id=`mi-c` value=`"c"`
   - Item D (enabled) id=`mi-d` value=`"d"`
5. **Context target** focusable (e.g., `<div tabindex="0" data-testid="context-target">`)
6. **Context menu panel** with at least 2 enabled items

Stable IDs:
- Menu panel has stable `id` (used by `aria-controls`)
- Each MenuItem has stable `id` (used by `aria-activedescendant`)

---

## 1) Public API contracts (P1 — MUST LOCK)

### 1.1 Selection API (CANONICAL)
Selection is emitted **from Menu only**.

**Contract**
- Menu emits a single event: `tngMenuSelect`
- Payload: `{ value: unknown, itemId: string, trigger: "keyboard" | "pointer" }`
- Default close behavior: menu closes after emitting (unless `closeOnSelect=false` at menu-level)

**Not part of public contract**
- MenuItem may have internal callbacks, but tests should only rely on **Menu** event emission.

**Tests**
- [X] Selecting an enabled item emits exactly one `tngMenuSelect` from Menu
- [X] Payload includes correct `value`, `itemId`, and `trigger`
- [X] Default: selection closes menu
- [X] If `closeOnSelect=false`, selection does **not** close menu
- [X] Disabled item never emits `tngMenuSelect` (click or Enter)

### 1.2 Context menu focus restore (DETERMINISTIC)
On **context menu close**:
- Close reason = `Escape` or outside click → focus returns to the **context target element**
- Close reason = `Tab/Shift+Tab` → do **not** restore focus; allow browser to move focus naturally

**Tests**
- [X] Context menu `Escape` closes and focus returns to context target
- [X] Context menu outside click closes and focus returns to context target
- [X] Context menu closes on Tab and browser moves focus naturally (no forced restore)

---

## 2) ARIA + roles (contract)

### 2.1 Button trigger
- `aria-haspopup="menu"`
- `aria-expanded="true|false"` toggles with open state
- `aria-controls="<menuId>"`

**Tests**
- [X] Trigger has `aria-haspopup="menu"` and `aria-controls`
- [X] On open: `aria-expanded="true"`
- [X] On close: `aria-expanded="false"`

### 2.2 Menu panel
- `role="menu"`
- Focusable when open (`tabindex="0"` OR `tabindex="-1"` + programmatic focus)
- Active-descendant mode uses `aria-activedescendant="<itemId>"`

**Tests**
- [X] Panel has `role="menu"`
- [X] On open, focus is on the panel
- [X] Panel updates `aria-activedescendant` during arrow navigation

### 2.3 Menu items
- `role="menuitem"`
- Stable `id`
- Disabled item has `aria-disabled="true"`

**Tests**
- [X] Items have `role="menuitem"` and stable IDs
- [X] Disabled item has `aria-disabled="true"`

---

## 3) Open / Close — Button trigger

### 3.1 Open interactions
**Tests**
- [X] Click trigger opens menu
- [X] Trigger + `Enter` opens menu
- [X] Trigger + `Space` opens menu
- [X] Trigger + `ArrowDown` opens menu
- [X] (Optional) Trigger + `ArrowUp` opens menu and sets last enabled active

### 3.2 Close interactions
**Tests**
- [X] `Escape` closes menu and focus returns to trigger
- [X] Outside click closes menu
- [X] Item click selects and closes menu (default)
- [X] Enter selects active item and closes menu (default)

---

## 4) Focus + navigation (active-descendant default)

### 4.1 Focus on open
**Tests**
- [X] On open, `document.activeElement` is menu panel
- [X] Menu items are not tabbable in default mode (no roving tabindex)

### 4.2 ArrowDown navigation (forward)
**Tests**
- [X] First `ArrowDown` sets active to first enabled item (A)
- [X] Next `ArrowDown` sets active to next enabled item (B)
- [X] Next `ArrowDown` skips disabled item (C) and activates (D)

### 4.3 ArrowUp navigation (reverse) **(P2 FIX)**
**Tests**
- [X] From first enabled item (A), `ArrowUp` wraps to last enabled (D) **if wrapping enabled**
- [X] From (D), `ArrowUp` skips disabled (C) and activates (B)
- [X] From (B), `ArrowUp` activates (A)

> If you choose **no wrapping**, adjust the first reverse test:
> - From (A), `ArrowUp` keeps active on (A)

### 4.4 Home/End (optional but recommended)
**Tests**
- [X] `Home` activates first enabled item
- [X] `End` activates last enabled item

---

## 5) Tab behavior — Exit (do NOT trap) **(P2 FIX: assert not prevented)**

Requirement:
- Tab exits the menu; menu closes; browser moves focus naturally
- Implementation must **not** call `preventDefault()` for Tab handling

**Tests**
- [X] With menu open, pressing `Tab` closes menu
- [X] With menu open, pressing `Shift+Tab` closes menu
- [X] After `Tab`, focus is on the next focusable element (e.g., input after trigger)
- [X] After `Shift+Tab`, focus is on the previous focusable element (e.g., button before trigger)

**Non-preventDefault assertion options (pick one, but make it explicit)**
- Option A (preferred): Spy on `KeyboardEvent.prototype.preventDefault` during the Tab keydown and assert it was **not called**
- Option B: In the keydown handler test, dispatch a cancelable event and assert `event.defaultPrevented === false`

**Tests**
- [X] Tab keydown does **not** result in `preventDefault()` (spy or `defaultPrevented` check)
- [X] Shift+Tab keydown does **not** result in `preventDefault()` (spy or `defaultPrevented` check)

**Focus restore rule**
- [X] Closing via Tab does **not** restore focus to trigger (browser handles it)

---

## 6) Selection (locked)

### 6.1 Click selection
**Tests**
- [X] Click enabled item emits `tngMenuSelect` with `trigger="pointer"`
- [X] Payload includes correct `value` and `itemId`
- [X] Menu closes after event unless `closeOnSelect=false`

### 6.2 Keyboard selection
**Tests**
- [X] Enter on active item emits `tngMenuSelect` with `trigger="keyboard"`
- [X] Space on active item (optional) behaves same as Enter
- [X] Disabled item cannot be selected via Enter/Space

---

## 7) Context menu trigger (right-click + keyboard) **(P2 FIX: add keyboard path)**

### 7.1 Pointer invocation
**Tests**
- [X] `contextmenu` on target opens context menu
- [X] Native context menu is prevented (`event.defaultPrevented === true`)
- [X] On open, focus is on context menu panel

### 7.2 Keyboard invocation (accessibility)
Support at least one:
- `Shift+F10`
- `ContextMenu` key (where available)

**Tests**
- [X] Focus context target + `Shift+F10` opens context menu
- [X] Focus context target + `ContextMenu` key opens context menu (if test environment supports it)
- [X] On open, focus is on context menu panel

### 7.3 Close + restore focus (locked)
**Tests**
- [X] Context menu `Escape` closes and focus returns to context target
- [X] Outside click closes and focus returns to context target
- [X] Tab closes and browser moves focus naturally (no forced restore)

### 7.4 Anchor capture (headless)
Anchor strategy is **pointer** for context menu:
- Store `{ x: clientX, y: clientY }` on open

**Tests**
- [X] On pointer open, controller stores anchor type `"pointer"` and last `{x,y}`
- [X] On keyboard open, controller stores anchor type `"element"` (context target element)

---

## 8) Menubar (navigation surface) **(P1 FIX: define top-level item ARIA)**

### 8.1 Roles + item contract
Menubar container:
- `role="menubar"`

Menubar items are distinct primitives: `MenuBarItem` (top-level triggers)
- `role="menuitem"` (top-level items are menu items in a menubar)
- `aria-haspopup="menu"` when the item opens a menu
- `aria-expanded` toggles while its menu is open
- `aria-controls="<menuId>"`

**Tests**
- [X] Menubar container has `role="menubar"`
- [X] Each MenuBarItem has `role="menuitem"`
- [X] Each MenuBarItem that owns a menu has `aria-haspopup="menu"`, `aria-controls`, and toggling `aria-expanded`

### 8.2 Keyboard behavior
**Tests**
- [X] `ArrowRight` moves focus to next MenuBarItem
- [X] `ArrowLeft` moves focus to previous MenuBarItem
- [X] Focus wraps (optional): last → first, first → last
- [X] `Enter` opens the focused MenuBarItem’s menu
- [X] `Space` opens the focused MenuBarItem’s menu
- [X] `ArrowDown` opens the focused MenuBarItem’s menu
- [X] When a menubar menu is open, `Escape` closes it and focuses owning MenuBarItem
- [X] `Tab` leaves menubar (do not trap) and closes any open menubar menu

---

## 9) Disabled + edge cases

**Tests**
- [X] If all items disabled, Arrow navigation does not set active descendant
- [X] On open, if first item disabled, active becomes first enabled
- [X] Clicking disabled item does nothing (no select, no close)
- [X] Programmatic open sets correct ARIA + focus state
- [X] Rapid open/close does not leave stale `aria-expanded=true`
- [X] If you enforce single-open rule: opening menu B closes menu A

---

## 10) Future: nested menus (submenus) — deterministic placeholders

When you add submenus, lock these before implementing:
- Submenu opens on `ArrowRight` from submenu-trigger item
- Submenu closes on `ArrowLeft`
- Escape closes submenu first, then parent on second Escape (stack)

**Tests**
- [X] `ArrowRight` opens submenu for active submenu-trigger item
- [X] `ArrowLeft` closes submenu and returns control to parent menu
- [X] `Escape` closes submenu only (first press)
- [X] Second `Escape` closes parent menu and returns focus to trigger

---

## Implementation milestones (suggested TDD order)

1. **Menu + MenuItem + button trigger** (open/close, focus, ArrowDown+ArrowUp skip, Tab exit, select event)
2. **Dismiss** (outside click)
3. **Context menu** (contextmenu + Shift+F10 + anchor capture + restore focus rule)
4. **Menubar** (roles + Left/Right + open + Tab exit)
5. Optional: typeahead
6. Optional: submenus


## Menubar possible test cases
- [X] Exports the menubar primitive
- [X] Applies role="menubar" on the menubar host
- [X] Applies role="menuitem" on each top-level menubar item
- [X] Sets unique, stable IDs on top-level menubar items (generated when missing)
- [X] Does not assign duplicate IDs across menubar items
- [X] Applies aria-orientation="horizontal" on the menubar host (if implemented)
- [X] Uses correct tabindex strategy so only one menubar item is tabbable at a time
- [X] Focus enters the menubar on the expected first/last/previously-focused item (per contract)
- [X] Focus leaves the menubar with Tab without being trapped
- [X] Focus leaves the menubar with Shift+Tab without being trapped
- [X] Tab keydown on a menubar item does not call preventDefault()
- [X] Shift+Tab keydown on a menubar item does not call preventDefault()
- [X] Moves focus to the next top-level item on ArrowRight
- [X] Moves focus to the previous top-level item on ArrowLeft
- [X] Wraps focus from last to first item on ArrowRight (if wrap enabled)
- [X] Wraps focus from first to last item on ArrowLeft (if wrap enabled)
- [X] Does not wrap focus at ends on ArrowRight/ArrowLeft (if wrap disabled)
- [X] Moves focus to the first item on Home
- [X] Moves focus to the last item on End
- [X] Skips disabled top-level items when navigating with arrow keys
- [X] Does not focus a disabled top-level item when clicked or navigated to
- [X] Reflects disabled state on top-level item with aria-disabled="true"
- [X] Disabled top-level item cannot open its menu
- [X] Top-level item with submenu sets aria-haspopup="menu"
- [X] Top-level item links to its menu via aria-controls="<menuId>"
- [X] Top-level item toggles aria-expanded to true when its menu opens
- [X] Top-level item toggles aria-expanded to false when its menu closes
- [X] Pressing Enter on a focused top-level item opens its menu
- [X] Pressing Space on a focused top-level item opens its menu
- [X] Pressing ArrowDown on a focused top-level item opens its menu
- [X] Pressing ArrowUp on a focused top-level item opens its menu (if supported)
- [X] Clicking a top-level item opens its menu
- [X] Clicking a focused top-level item toggles its menu (open → close) (if supported)
- [X] Opening a menu from one top-level item closes any previously open menubar menu (single-open rule)
- [X] Opening a menu sets focus to the opened menu panel
- [X] Closing a menubar-opened menu restores focus to the owning top-level item
- [X] Pressing Escape while a menubar menu is open closes the menu and focuses the owning item
- [X] Pressing Escape when no menu is open does not change focus or state
- [X] Clicking outside while a menubar menu is open closes the menu and focuses the owning item (per contract)
- [X] Tab while a menubar menu is open closes the menu and allows native focus movement
- [X] Shift+Tab while a menubar menu is open closes the menu and allows native focus movement
- [X] Tab while a menubar menu is open does not call preventDefault()
- [X] Shift+Tab while a menubar menu is open does not call preventDefault()
- [X] After closing via Tab, focus moves to the next focusable element outside menubar
- [X] After closing via Shift+Tab, focus moves to the previous focusable element outside menubar
- [X] When a menu is open, ArrowRight switches to the next top-level item and opens its menu (if “menubar cycling” enabled)
- [X] When a menu is open, ArrowLeft switches to the previous top-level item and opens its menu (if “menubar cycling” enabled)
- [X] When a menu is open, switching top-level items preserves “single open menu” invariant
- [X] Menubar supports typeahead: typing focuses the next item starting with the typed character(s) (if implemented)
- [X] Typeahead cycles through matches on repeated key presses (if implemented)
- [X] Typeahead buffer resets after timeout (if implemented)
- [X] Hovering a top-level item updates the “current item” without stealing focus (if implemented)
- [X] Hovering a different top-level item while a menu is open switches the open menu (if implemented)
- [X] Pointer down on a top-level item focuses it before opening (if implemented)
- [X] Mouse click on disabled item does not focus or open menu
- [X] Menubar works with nested focusable content inside items (if you allow custom templates)
- [X] Menubar does not break when items are added or removed dynamically
- [X] Menubar recalculates roving tabindex correctly when items are added/removed dynamically
- [X] Menubar preserves last-focused item after rerender (if implemented)
- [X] Menubar cleans up event listeners on destroy (no global listeners leaked)
- [X] Multiple menubars on the same page operate independently
- [X] Focus navigation does not jump between different menubars
- [X] Menubar supports RTL: ArrowLeft/ArrowRight behavior mirrors in RTL (if implemented)
- [X] Menubar exposes no console errors/warnings for missing optional menus
- [X] Menubar top-level items without menus do not set aria-haspopup or aria-controls
- [X] Menubar prevents opening a menu if the menu reference is missing/undefined (fails safely)
- [X] Menubar does not emit selection events itself; selection is delegated to Menu (if that’s your contract)
- [X] Menubar state resets correctly after rapid open/close interactions
- [X] Menubar does not leave stale aria-expanded="true" after menu unmounts unexpectedly


## Menu possible test cases
- [X] Exports the menu primitive
- [X] Renders a menu panel with role="menu" on the host
- [X] Applies a stable id on the menu panel (generated when missing)
- [X] Links trigger and menu via aria-controls when opened through a trigger
- [X] Sets aria-labelledby on the menu panel from the trigger (if implemented)
- [X] Makes the menu panel focusable when open (tabindex contract)
- [X] Moves focus to the menu panel immediately on open
- [X] Does not move focus to the menu panel when opening is prevented/blocked
- [X] Restores focus to the trigger on close via Escape
- [X] Does not forcibly restore focus to the trigger on close via Tab
- [X] Closes when Escape is pressed
- [X] Closes when clicking outside the menu panel
- [X] Does not close when clicking inside the menu panel (non-select area)
- [X] Closes when the trigger toggles closed (if toggle supported)
- [X] Closes when the trigger is destroyed/unmounted (fails safely)
- [X] Closes when the menu panel is destroyed/unmounted (cleans up state)
- [X] Supports programmatic open() and close() APIs (if provided)
- [X] Programmatic open sets correct ARIA state on the trigger (if wired)
- [X] Programmatic close resets correct ARIA state on the trigger (if wired)
- [X] Emits “opened” lifecycle event/state when menu becomes open (if implemented)
- [X] Emits “closed” lifecycle event/state when menu becomes closed (if implemented)
- [X] Does not emit duplicate open/close events on redundant calls
- [X] Uses active-descendant navigation by default
- [X] Keeps DOM focus on the menu panel during arrow navigation (active-descendant)
- [X] Updates aria-activedescendant when an item becomes active
- [X] Clears aria-activedescendant when there is no active item
- [X] Sets first enabled item active on initial ArrowDown
- [X] Sets last enabled item active on initial ArrowUp (if supported)
- [X] Moves active item to next enabled item on ArrowDown
- [X] Moves active item to previous enabled item on ArrowUp
- [X] Skips disabled items while navigating forward
- [X] Skips disabled items while navigating backward
- [X] Wraps active item from last → first on ArrowDown (if wrap enabled)
- [X] Wraps active item from first → last on ArrowUp (if wrap enabled)
- [X] Does not wrap at ends (if wrap disabled)
- [X] Moves active item to first enabled on Home
- [X] Moves active item to last enabled on End
- [X] Ignores arrow navigation when all items are disabled
- [X] Does not set an active item if there are zero items
- [X] Maintains correct active item when items are added dynamically
- [X] Maintains correct active item when items are removed dynamically
- [X] If the active item is removed, moves active to the next enabled item
- [X] If the active item becomes disabled, moves active to the next enabled item
- [X] Tab closes the menu and allows native focus movement
- [X] Shift+Tab closes the menu and allows native focus movement
- [X] Tab keydown does not call preventDefault()
- [X] Shift+Tab keydown does not call preventDefault()
- [X] After Tab-close, focus moves to the next focusable element outside the menu
- [X] After Shift+Tab-close, focus moves to the previous focusable element outside the menu
- [X] Closing by Tab does not restore focus to trigger (browser handles it)
- [X] Closing by Shift+Tab does not restore focus to trigger (browser handles it)
- [X] Enter selects the active item and closes the menu (default)
- [X] Space selects the active item and closes the menu (if supported)
- [X] Click selects an enabled item and closes the menu (default)
- [X] Disabled item cannot be selected by click
- [X] Disabled item cannot be selected by Enter/Space
- [X] Emits a single tngMenuSelect event from Menu on selection (canonical surface)
- [X] Selection payload includes correct value
- [X] Selection payload includes correct itemId
- [X] Selection payload includes correct trigger (keyboard vs pointer)
- [X] Default selection closes the menu after emitting event
- [X] closeOnSelect=false keeps menu open after selection
- [X] Selection does not fire when clicking menu padding/background
- [X] Selection does not fire when active item is null
- [X] Selection fires only once even on rapid double click
- [X] Selection does not fire twice due to click + key events on same action
- [X] Supports “dismiss on outside click” configuration (if implemented)
- [X] When dismissOnOutsideClick=false, outside click does not close the menu
- [X] Supports “dismiss on focusout” configuration (if implemented)
- [X] Does not close on focusout when focus remains inside menu panel
- [X] Closes on focusout when focus moves outside (if implemented)
- [X] Supports backdrop dismiss when backdrop is enabled (if implemented)
- [X] Backdrop click closes menu when backdrop enabled (if implemented)
- [X] Menu item registration preserves DOM order for navigation
- [X] Menu item registration updates correctly when items reorder
- [X] Menu ignores unregistered items for navigation
- [X] Menu skips items marked as hidden/inert (if implemented)
- [X] Menu supports groups/separators without treating them as items (if implemented)
- [X] Separator elements are not focusable and not selectable (if implemented)
- [X] Group labels are not focusable and not selectable (if implemented)
- [X] Typeahead: typing focuses next matching item (if implemented)
- [X] Typeahead cycles through matches on repeated key presses (if implemented)
- [X] Typeahead buffer resets after timeout (if implemented)
- [X] Typeahead ignores disabled items (if implemented)
- [X] Typeahead ignores separators/groups (if implemented)
Context-menu-specific open/close/anchor behavior is tracked under `ContextMenuTrigger possible test cases`.
- [X] Nested menus: ArrowRight opens submenu for active submenu trigger (if implemented)
- [X] Nested menus: ArrowLeft closes submenu and returns control to parent (if implemented)
- [X] Nested menus: first Escape closes submenu only (if implemented)
- [X] Nested menus: second Escape closes parent menu (if implemented)
- [X] Nested menus: moving parent active item closes previously open submenu (if implemented)
- [X] Multiple menus on the page operate independently
- [X] Opening one menu closes another (single-open global policy) if that’s your design
- [X] Menu cleans up global event listeners on destroy (no leaks)
- [X] Menu does not leave stale aria-expanded="true" on trigger after teardown
- [X] Menu remains stable under rapid open/close sequences
- [X] Menu does not throw when opened without a trigger (programmatic usage)
- [X] Menu fails safely when trigger/menu linkage is missing or invalid


## MenuTrigger possible test cases
- [X] Exports the menu-trigger primitive
- [X] Attaches aria-haspopup="menu" to the trigger host
- [X] Attaches aria-controls="<menuId>" when a menu is linked
- [X] Sets aria-expanded="false" when menu is closed
- [X] Sets aria-expanded="true" when menu is open
- [X] Does not set aria-controls when no menu is linked (fails safely)
- [X] Does not throw when linked menu reference is missing/undefined
- [X] Updates aria-controls if the linked menu id changes dynamically
- [X] Preserves any user-provided aria-* attributes without overwriting incorrectly
- [X] Click on trigger opens the linked menu
- [X] Second click toggles menu closed (if toggle behavior enabled)
- [X] Click does not open menu when trigger is disabled
- [X] Click does not open menu when linked menu is disabled (if supported)
- [X] Click on trigger while another menu is open closes the other menu first (if single-open policy)
- [X] Trigger prevents default click behavior only if explicitly required (otherwise does not)
- [X] Enter on focused trigger opens the linked menu
- [X] Space on focused trigger opens the linked menu
- [X] ArrowDown on focused trigger opens the linked menu
- [X] ArrowUp on focused trigger opens the linked menu (if supported)
- [X] Keyboard open does not call preventDefault() unless required by contract
- [X] When opened by keyboard, menu receives focus (panel focus contract)
- [X] When opened by keyboard, first active item is set according to menu contract (if applicable)
- [X] Escape on trigger closes the linked menu if it is open
- [X] Escape on trigger does nothing if menu is already closed
- [X] Closing via Escape restores focus to trigger (if focus was inside menu)
- [X] Trigger does not steal focus when closing due to outside click (unless contract says it should)
- [X] Trigger sets correct open state when menu opens programmatically
- [X] Trigger updates ARIA state when menu closes programmatically
- [X] Trigger remains consistent if menu is opened/closed by another trigger/controller
- [X] Trigger updates anchor reference if trigger element re-renders/replaces (if applicable)
- [X] Trigger closes the menu on outside click via shared dismiss logic (if trigger owns dismiss)
- [X] Trigger does not close the menu on inside click (unless selection occurs)
- [X] Trigger closes the menu when the trigger is destroyed (cleanup)
- [X] Trigger closes the menu when the menu is destroyed (cleanup)
- [X] Trigger removes all global listeners on destroy (no leaks)
- [X] Trigger supports multiple independent instances on the same page
- [X] Trigger does not interfere with other triggers linked to other menus
- [X] Trigger enforces single-open invariant across triggers (if global policy enabled)
- [X] Trigger does not leave stale aria-expanded="true" after rapid open/close
- [X] Trigger ignores repeated open requests when already open (idempotent open)
- [X] Trigger ignores repeated close requests when already closed (idempotent close)
Overlay placement, resize/scroll policies, hover-open modes, and menubar-shared trigger behavior are not part of the current `TngMenuTrigger` API and should be tracked separately if introduced later.


## ContextMenuTrigger possible test cases
- [X] Exports the context-menu-trigger primitive
- [X] Binds a menu reference successfully to the context trigger host
- [X] Does not throw when linked menu reference is missing/undefined (fails safely)
- [X] Applies aria-haspopup="menu" on the context target (if you expose it)
- [X] Applies aria-controls="<menuId>" on the context target (if you expose it)
- [X] Toggles aria-expanded="true|false" on open/close (if you expose it)
- [X] Does not overwrite user-provided aria-* attributes incorrectly
- [X] contextmenu (right click) on target opens the linked context menu
- [X] contextmenu open calls preventDefault() (native context menu suppressed)
- [X] Context menu opens even when target is not a button (generic element support)
- [X] Context menu does not open when context target is disabled (if supported)
- [X] Context menu does not open when linked menu is disabled (if supported)
- [X] Stores pointer anchor {x,y} from contextmenu event (clientX/clientY)
- [X] Uses correct coordinate source consistently (locks one: client vs page)
- [X] Updates stored pointer anchor on every new contextmenu invocation
- [ ] Clears stored anchor on close (if your controller does that)
- [X] Focuses the menu panel immediately after context menu opens
- [X] Does not focus the menu panel if open was prevented/blocked
- [ ] Sets initial active item according to Menu contract (ArrowDown/first enabled) if applicable
- [X] Keyboard navigation inside the opened context menu works (delegated to Menu)
- [X] Focus target + Shift+F10 opens the context menu (keyboard accessibility)
- [X] Focus target + ContextMenu key opens the context menu (if environment supports)
- [X] Keyboard-open uses element anchor (target element) instead of pointer coords (if that’s your contract)
- [X] Keyboard-open does not call preventDefault() unnecessarily (only where required)
- [X] Escape closes the open context menu
- [X] Closing via Escape restores focus to the context target (if locked contract)
- [X] Outside click closes the open context menu
- [X] Closing via outside click restores focus to the context target (if locked contract)
- [X] Tab closes the context menu and allows native focus movement (no trap)
- [X] Shift+Tab closes the context menu and allows native focus movement (no trap)
- [X] Tab keydown does not call preventDefault()
- [X] Shift+Tab keydown does not call preventDefault()
- [X] Closing via Tab does not forcibly restore focus to the context target (browser handles it)
- [X] Selecting an enabled item emits the canonical Menu selection event (tngMenuSelect)
- [X] Selection payload trigger="pointer" for right-click + click selection path
- [X] Selection payload trigger="keyboard" for Shift+F10 open + Enter selection path
- [X] Disabled items cannot be selected and never emit selection events
- [X] Default selection closes the context menu after emitting
- [X] closeOnSelect=false keeps the context menu open after selection (if supported)
- [X] Re-opening context menu while already open repositions to new pointer anchor (if supported)
- [X] Re-opening context menu while already open closes then reopens cleanly (no stale state)
- [X] Re-opening context menu updates focus/active state deterministically
- [X] Multiple context targets on the same page operate independently
- [X] Context menu trigger does not interfere with regular MenuTrigger instances
- [X] Single-open policy: opening a context menu closes any other open menu (if global invariant)
- [X] Context menu closes when the context target is destroyed/unmounted (cleanup)
- [X] Context menu closes when the linked menu is destroyed/unmounted (cleanup)
- [X] Context menu trigger removes global listeners on destroy (no leaks)
- [X] Context menu trigger does not leave stale aria-expanded="true" after teardown
- [X] Context menu trigger remains stable under rapid open/close sequences
Current `TngContextMenuTrigger` locks a client-coordinate anchor contract (`clientX/clientY`). Page-coordinate, anchor-clearing, initial-active-item, and overlay positioning/scroll policies are not part of the current headless primitive and should be tracked separately if introduced later.


## MenuItem possible test cases
- [X] Exports the menu-item primitive
- [X] Applies role="menuitem" on the item host
- [X] Generates a stable id when none is provided
- [X] Preserves a user-provided id without overriding it
- [X] Does not generate duplicate IDs across multiple items
- [X] Reflects disabled state with aria-disabled="true"
- [X] Does not set aria-disabled when enabled
- [X] Prevents pointer interaction when disabled (no click selection)
- [X] Prevents keyboard selection when disabled (Enter/Space)
- [X] Supports a value input and exposes it to the Menu selection payload
- [X] Registers itself with the nearest parent Menu on init
- [X] Unregisters itself from the parent Menu on destroy
- [X] Registration preserves DOM order for navigation
- [X] Registration updates correctly when items reorder dynamically
- [X] Does not register when not placed inside a Menu (fails safely)
- [ ] Throws a clear error/warning when used outside Menu (only if you choose to)
- [X] When clicked (enabled), requests selection via Menu (does not emit its own canonical select)
- [X] Click on enabled item results in Menu emitting tngMenuSelect with trigger="pointer"
- [X] Click does not select when click is on a nested disabled control (if you allow nested controls)
- [X] Click on disabled item does nothing (no select, no close)
- [X] Click selection closes menu by default (menu-level closeOnSelect=true)
- [X] Click selection does not close menu when menu-level closeOnSelect=false
- [X] When item is the active descendant, it is referenced by menu aria-activedescendant
- [X] Active state updates correctly when menu moves active item with arrow keys
- [X] Disabled item is never set as active descendant
- [X] If item becomes disabled while active, menu moves active to next enabled item
- [X] Keyboard selection on active item (Enter) results in Menu emitting tngMenuSelect with trigger="keyboard"
- [X] Keyboard selection on active item (Space) behaves like Enter (if supported)
- [X] Enter/Space on inactive item does not select (selection is driven by active item)
- [X] Enter/Space on disabled item does not select
- [X] Rapid repeated Enter does not emit duplicate selection events (debounce/idempotent if desired)
- [X] Item participates in typeahead matching using its label text (if implemented)
- [X] Typeahead ignores disabled items even if label matches
- [X] Typeahead ignores separators/groups (if item can be those variants)
- [X] Item provides a normalized label (trim/casefold) for matching (if implemented)
- [X] Item supports role="menuitemcheckbox" variant (if implemented)
- [X] Checkbox item reflects checked state with aria-checked="true|false" (if implemented)
- [X] Checkbox item toggles checked state on selection (if implemented)
- [X] Item supports role="menuitemradio" variant (if implemented)
- [X] Radio item reflects selected state with aria-checked="true|false" (if implemented)
- [X] Radio group enforces single selection across sibling radio items (if implemented)
- [X] Item can act as a submenu trigger with aria-haspopup="menu" (if implemented)
- [X] Submenu trigger links submenu via aria-controls="<submenuId>" (if implemented)
- [X] Submenu trigger toggles aria-expanded when submenu opens/closes (if implemented)
- [X] Submenu trigger opens submenu on ArrowRight (if implemented)
- [X] Submenu trigger closes submenu on ArrowLeft (if implemented)
- [X] Item remains stable under rapid enable/disable toggles
- [X] Multiple menus with items on the page do not interfere with each other
- [X] Item works correctly when projected content includes icons/slots (click still selects correctly)
- [X] Item does not break when it contains nested elements/spans (event target handling)
Per-item default-value derivation, per-item closeOnSelect overrides, explicit registration metadata snapshots, visual active-state markers, and per-item global cleanup hooks are not part of the current `TngMenuItem` API and should be tracked separately if introduced later.

### Next Steps
- [X] Cleanup And Teardown
- [X] Focus Traversal Assertions
- [X] Context Menu Selection Integration
- [X] Global Single-Open Coordination
- [X] Typeahead
- [X] Submenus
- [X] Advanced Pointer/Hover Behavior
- [X] Dynamic Menubar Lifecycle
- [X] RTL Keyboard Semantics
- [X] Optional Item Variants (checkbox/radio)
