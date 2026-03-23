# Datepicker (Headless) — Plan

> TailNG goal: a **headless** datepicker primitive that can power multiple UIs:
> 1) “Classic” datepicker (days view; month/year via controls)
> 2) “All-in-one” view (month + day + year visible at once)
>
> This doc is a **design plan** (APIs + architecture + behaviors). No styling assumptions.

---

## 0) Scope

### In scope
- Single-date selection (MVP)
- Optional range selection (Phase 2)
- Optional time selection (Phase 3 / separate primitive)
- Keyboard + ARIA behavior for:
  - Popup calendar attached to an input
  - Inline calendar (no popup)
- Internationalization hooks: locale, week start, month/day names
- Min/max, disabled dates, “today”, “outside days”
- Controlled/uncontrolled patterns

### Out of scope (for v1)
- Swipe gestures
- Complex recurrence rules
- Fully-featured timezone conversion UI (but allow adapter)

---

## 1) Mental model

The datepicker is composed of:
- **Model** (pure): date math + constraints
- **State machine**: view mode + focus (active date/month/year) + open/close
- **UI adapters** (headless): output attributes + events to bind into DOM
- **Integrations**: overlay/positioning/focus trap (via your CDK overlay)

Key principle:
- The datepicker **does not render** markup.
- It exposes **attributes, ids, and event handlers** so any UI can be built.

---

## 2) Packages + entrypoints

### `@tailng-ui/cdk`
- Already provides: overlay, outside-interaction, focus-scope, list/grid nav, id, etc.

### `@tailng-ui/primitives`
Proposed folder:
- `libs/tailng-ui/primitives/src/lib/form/datepicker/`
  - `datepicker.ts` (controller factory)
  - `datepicker.types.ts`
  - `datepicker.utils.ts` (pure helpers)
  - `datepicker.adapters.ts` (optional)
  - `datepicker.state.ts` (reducer-style pure transitions)

Angular bindings (headless directives/components):
- `tngDatepicker` (controller host directive)
- `tngDatepickerTrigger` (button/input trigger)
- `tngDatepickerOverlay` (overlay panel host)
- `tngDatepickerGrid` (days grid host; uses your grid controller)
- `tngDatepickerCell` (day cell directive)
- `tngDatepickerMonthGrid` / `YearGrid` (optional, phase-based)
- `tngDatepickerInput` (optional convenience directive: input ↔ controller)

> You can start with fewer directives (see “MVP composition”).

---

## 3) Terminology

- **Value**: the selected date (or range) in a canonical internal type.
- **Active**: the “roving” date cell the keyboard is on (focus target).
- **View**: which panel is visible (days | months | years).
- **Open**: whether popup is open (for overlay-based variant).
- **Anchor**: for range selection (start point).

---

## 4) Date representation

### Recommendation
Use a **value adapter** to avoid locking into JS `Date` everywhere.

#### `TngDateAdapter<TDate>`
- `today(): TDate`
- `isValid(date: TDate): boolean`
- `compare(a: TDate, b: TDate): -1 | 0 | 1`
- `addDays(date: TDate, n: number): TDate`
- `addMonths(date: TDate, n: number): TDate`
- `addYears(date: TDate, n: number): TDate`
- `startOfMonth(date: TDate): TDate`
- `endOfMonth(date: TDate): TDate`
- `startOfWeek(date: TDate, weekStartsOn: 0..6): TDate`
- `getYear(date: TDate): number`
- `getMonth(date: TDate): number` (0-11)
- `getDate(date: TDate): number` (1-31)
- `format(date: TDate, fmt: 'input' | 'label' | string, locale?: string): string`
- `parse(text: string, locale?: string): TDate | null`

**Default adapter**: JS `Date` (local time, midday normalization to avoid DST edges).

---

## 5) Config

### `TngDatepickerConfig<TDate>`
- `selectionMode?: 'single' | 'range'` *(v1: single)*
- `locale?: string`
- `weekStartsOn?: 0|1|2|3|4|5|6`
- `min?: TDate | null`
- `max?: TDate | null`
- `disableDate?: (date: TDate) => boolean` *(business rules)*
- `showOutsideDays?: boolean` *(grid includes prev/next month days)*
- `fixedWeeks?: boolean` *(6 rows always)*
- `closeOnSelect?: boolean` *(popup mode)*
- `allowManualInput?: boolean` *(input parsing)*
- `direction?: 'ltr' | 'rtl'`
- `adapter?: TngDateAdapter<TDate>` *(required or default)*
- `id?: string` *(stable host id base)*

---

## 6) State

### Core state (`TngDatepickerState<TDate>`)
- `open: boolean`
- `view: 'days' | 'months' | 'years'`
- `value: TDate | null` *(or range)*
- `activeDate: TDate` *(always valid; defaults to value or today)*
- `visibleMonth: TDate` *(a date within the month being shown; usually first-of-month)*
- `hoverDate?: TDate | null` *(range preview; phase 2)*
- `disabled: boolean`

---

## 7) Grid model

### `TngDateCell<TDate>`
- `id: string`
- `date: TDate`
- `inMonth: boolean`
- `disabled: boolean`
- `today: boolean`
- `selected: boolean`
- `active: boolean`
- `rangeStart?: boolean` *(phase 2)*
- `rangeEnd?: boolean` *(phase 2)*
- `inRange?: boolean` *(phase 2)*

### Building the month grid
- Compute first visible day:
  - Start from `startOfMonth(visibleMonth)`
  - Back up to `startOfWeek(...)` based on `weekStartsOn`
- Generate 35 or 42 cells based on `fixedWeeks`
- Mark `inMonth` by month comparison

---

## 8) Public controller API (framework-agnostic)

### Factory
- `createDatepickerController<TDate>(config: TngDatepickerConfig<TDate>): TngDatepickerController<TDate>`

### Controller (`TngDatepickerController<TDate>`)
State getters:
- `getState(): TngDatepickerState<TDate>`
- `getOutputs(): TngDatepickerOutputs<TDate>`

Commands:
- `setOpen(open: boolean): void`
- `toggleOpen(): void`
- `setView(view: 'days'|'months'|'years'): void`
- `nextMonth(): void` / `prevMonth(): void`
- `nextYear(): void` / `prevYear(): void`
- `setVisibleMonth(dateInMonth: TDate): void`
- `setActiveDate(date: TDate): void`
- `selectDate(date: TDate): void` *(obeys constraints)*
- `clear(): void`
- `setDisabled(disabled: boolean): void`

Event handlers:
- `handleGridKeyDown(event): void` *(delegates to your grid controller rules)*
- `handleTriggerKeyDown(event): void`
- `handleCellClick(date: TDate): void`
- `handleCellPointerEnter?(date: TDate): void` *(range preview)*

---

## 9) Outputs for UI binding

### `TngDatepickerOutputs<TDate>`
- `open: boolean`
- `view: 'days'|'months'|'years'`
- `value: TDate | null`
- `activeDate: TDate`
- `visibleMonth: TDate`
- `labelMonthYear: string`
- `weekdayLabels: readonly string[]`
- `cells: readonly TngDateCell<TDate>[]`

Attribute maps (headless-friendly):
- `getHostAttributes()`
- `getTriggerAttributes()`
- `getOverlayAttributes()`
- `getGridAttributes()`
- `getCellAttributes(cellIdOrDate)`

---

## 10) ARIA + roles

Popup pattern:
- Trigger: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`
- Overlay: `role="dialog"`, labelable, not modal unless you trap focus
- Grid: `role="grid"`, month label wired via `aria-labelledby`
- Cells: `role="gridcell"`, `aria-selected`, `aria-disabled`

Focus strategy:
- Prefer **active-descendant** (single tab stop) for a clean tab order.

---

## 11) Keyboard behavior

Trigger:
- **Enter/Space/ArrowDown**: open + focus grid
Overlay:
- **Escape**: close + restore focus
Days grid:
- Arrows: +/-1 or +/-7
- Home/End: start/end of row
- PageUp/PageDown: month
- Shift+PageUp/PageDown: year
- Enter/Space: select active date

---

## 12) Slots contract (theme-friendly)

Slots (`data-slot`):
- `datepicker`, `datepicker-trigger`, `datepicker-overlay`
- `datepicker-header`, `datepicker-month-label`
- `datepicker-nav-prev`, `datepicker-nav-next`
- `datepicker-grid`, `datepicker-row`, `datepicker-cell`
- `datepicker-footer`, `datepicker-today`, `datepicker-clear`

State attrs:
- `data-open`
- `data-view="days|months|years"`
- `data-disabled`
- `data-invalid` *(optional integration)*

Cell attrs:
- `data-in-month`, `data-today`, `data-selected`, `data-active`, `data-disabled`

---

## 13) Test plan (high level)

- Controller init (value/today), min/max, disableDate
- Grid generation (weekStartsOn, fixedWeeks, outside days)
- Keyboard (arrows, page up/down, enter selection)
- Overlay integration (outside click, escape, focus restore)
- A11y smoke (aria-* wiring, single tab stop in grid)

---

## 14) Roadmap

- v1: single date + days grid + popup/inline
- v1.1: months/years views
- v2: range selection + preview
- v3: time selection as separate primitive + composition

---

## Links
- Playground route suggestion: `/datepicker`

# TailNG Datepicker (Headless) — Categorized Test Cases

> One-line, feature-based test names + descriptions for the **headless datepicker** primitives/controllers.
> Assumes a headless architecture that supports **multiple UI shells** (calendar-first vs month+year+day composite).

---

## A) Package exports & attachment

- [x] **A1 — Exports controller factory** — `createDatepickerController` is exported and callable.
- [x] **A2 — Exports types** — public types compile: `TngDatepickerConfig`, `TngDateValue`, `TngCalendarView`, etc.
- [x] **A3 — No DOM requirement** — controller can be created with `ownerDocument=null` without throwing.
- [x] **A4 — Deterministic initial state** — default config produces stable initial outputs (today/focus anchor rules).

---

## B) Value model & parsing/formatting

- [x] **B1 — Single value set/get** — setting `value` returns the same normalized value from outputs.
- [x] **B2 — Range value set/get** — setting `range.start/end` returns normalized range with correct ordering.
- [x] **B3 — Multi value set/get** — setting multiple selected dates preserves uniqueness & stable ordering contract.
- [x] **B4 — Normalize incoming values** — accepts Date/ISO/adapter date and normalizes to adapter date.
- [x] **B5 — Reject invalid date inputs** — invalid inputs are ignored or surfaced as `validationError` per contract.
- [x] **B6 — Format round-trip** — `format(parse(text))` yields canonical formatted output for valid dates.
- [x] **B7 — Partial text editing** — partial input does not commit selection until parse success (unless configured).
- [x] **B8 — Timezone boundary safety** — adapter conversion doesn’t shift day across timezones (date-only).

---

## C) Selection modes & behavior

- [x] **C1 — Single click selects** — clicking an enabled day selects it in `mode=single`.
- [x] **C2 — Single re-click behavior** — clicking selected day toggles/keeps based on `allowDeselect`.
- [x] **C3 — Range start then end** — first click sets `start`, second click sets `end` in `mode=range`.
- [x] **C4 — Range ordering fixup** — end < start auto-swaps or clamps per contract.
- [x] **C5 — Range same day** — selecting same day as start sets a 1-day range (start=end) if allowed.
- [x] **C6 — Range extend via keyboard** — shift+arrow extends range when `enableRangeSelection=true`.
- [x] **C7 — Multi toggle** — click toggles membership in `mode=multiple`.
- [x] **C8 — Multi with range** — shift+click selects contiguous range in multiple mode when enabled.
- [x] **C9 — Max selection count** — multi selection respects `maxSelections` and rejects extras.
- [x] **C10 — Clear selection** — `clear()` removes selection and restores default focus rules.

---

## D) Constraints: min/max/disabled/filter

- [x] **D1 — Min boundary disabled** — dates before `min` are disabled and not selectable.
- [x] **D2 — Max boundary disabled** — dates after `max` are disabled and not selectable.
- [x] **D3 — Custom disable predicate** — `isDateDisabled(date)` disables dates and prevents selection.
- [x] **D4 — Disabled date keyboard skip** — arrow navigation skips disabled dates (when skip-enabled contract).
- [x] **D5 — Disabled date click no-op** — clicking disabled date does not change selection or active date.
- [x] **D6 — Range cannot include disabled** — range selection clamps/splits/rejects based on contract.
- [x] **D7 — Month navigation respects bounds** — cannot navigate to months fully outside min/max.
- [x] **D8 — Year navigation respects bounds** — cannot navigate to years fully outside min/max.
- [x] **D9 — Dynamic bounds update** — changing min/max at runtime revalidates selection and view.

---

## E) View state & navigation (calendar-first UI)

- [x] **E1 — Default view is day grid** — initial view is `day` when `initialView=day`.
- [x] **E2 — Next month** — `goToNextMonth()` updates visible month and keeps focus rule.
- [x] **E3 — Prev month** — `goToPrevMonth()` updates visible month and keeps focus rule.
- [x] **E4 — Jump to month** — `setVisibleMonth(year, month)` renders correct grid.
- [x] **E5 — Jump to year** — `setVisibleYear(year)` updates year-dependent views.
- [x] **E6 — Open month picker** — `setView('month')` switches view without losing selection.
- [x] **E7 — Open year picker** — `setView('year')` switches view without losing selection.
- [x] **E8 — Return to day view** — choosing month/year returns to day view if `autoCommitView=true`.
- [x] **E9 — Preserve view on open/close** — open/close does not reset view unless configured.

---

## F) Composite UI support (month+day+year visible together)

- [x] **F1 — Independent sub-view focus** — focus can move between month/day/year sections via keyboard.
- [x] **F2 — Month section changes day grid** — selecting month updates day grid immediately.
- [x] **F3 — Year section changes month/day** — selecting year updates month/day immediately.
- [x] **F4 — Composite commit rules** — selection commit occurs only on day choice (or per config).
- [x] **F5 — Composite constraints** — month/year lists disable items outside min/max span.

---

## G) Keyboard interaction: day grid (roving focus)

- [x] **G1 — ArrowRight moves focus** — moves active day by +1, skipping disabled if configured.
- [x] **G2 — ArrowLeft moves focus** — moves active day by -1, skipping disabled if configured.
- [x] **G3 — ArrowDown moves focus** — moves active day by +7.
- [x] **G4 — ArrowUp moves focus** — moves active day by -7.
- [x] **G5 — Home/End** — moves focus to start/end of current week.
- [x] **G6 — PageUp/PageDown** — moves focus to prev/next month maintaining day-of-month where possible.
- [x] **G7 — Ctrl+PageUp/PageDown** — moves focus to prev/next year where supported.
- [x] **G8 — Enter selects focused** — Enter selects active date per selection mode.
- [x] **G9 — Space selects focused** — Space selects active date (and does not scroll page in UI shells).
- [x] **G10 — Tab exits widget** — Tab does not trap focus (unless configured in popup mode).
- [x] **G11 — Typeahead (optional)** — typing digits jumps to matching day if enabled.

---

## H) Keyboard interaction: month/year pickers

- [x] **H1 — Month grid arrow nav** — arrow keys move active month tile.
- [x] **H2 — Month Enter selects** — Enter selects month and updates visible month.
- [x] **H3 — Year grid arrow nav** — arrow keys move active year tile.
- [x] **H4 — Year Enter selects** — Enter selects year and updates visible year.
- [x] **H5 — Escape closes picker** — Escape returns to previous view or closes popup per contract.

---

## I) Focus management & restore

- [x] **I1 — Initial focus target** — on open, focuses selected date, else today, else first enabled.
- [x] **I2 — Focus stays within view** — navigating months preserves focus on a valid day.
- [x] **I3 — Focus restore on close** — closing popup restores focus to trigger when present.
- [x] **I4 — Trigger destroyed restore** — if trigger is removed, close does not throw and picks safe fallback.
- [x] **I5 — Runtime dir change ltr↔rtl** — arrow semantics and start/end positions update live.
- [x] **I6 — RTL start/end correctness** — `position='start'/'end'` and navigation respects RTL mapping.

---

## J) Popup/overlay integration (if used)

- [x] **J1 — Open/close state** — `open()` sets `isOpen=true` and `opened` event fires.
- [x] **J2 — Close reason** — `close(reason)` passes correct reason: `escape`, `outside`, `select`, `programmatic`.
- [x] **J3 — Outside click uses pointerdown+click** — outside dismiss is triggered by real pointerdown path.
- [x] **J4 — closeOnOutsideClick=false** — backdrop remains but outside clicks don’t close.
- [x] **J5 — Open above content overlay** — overlay mode does not shift layout (UI shell contract).
- [x] **J6 — Push/side mode** — push mode emits layout width/offset values for host shell.
- [x] **J7 — Animated event order (open)** — `openStart → opened` ordering is correct.
- [x] **J8 — Animated event order (close)** — `closeStart → closed` ordering is correct.
- [x] **J9 — Close while opening** — re-entrant close produces consistent final state.
- [x] **J10 — Two datepickers closeOthersOnOpen** — opening one closes the other when enabled.

---

## K) Accessibility outputs (ARIA attribute contracts)

- [x] **K1 — Host attributes** — `getHostAttributes()` includes role/labels per mode (dialog/grid where applicable).
- [x] **K2 — Grid attributes** — day grid exposes `role="grid"`/`gridcell` mapping when configured.
- [x] **K3 — Active-descendant strategy** — when enabled, emits `aria-activedescendant` id for host.
- [x] **K4 — Roving tabindex strategy** — when enabled, only active cell gets `tabindex=0`.
- [x] **K5 — Selected state attrs** — option/cell attributes include `aria-selected` (and `aria-current` for today).
- [x] **K6 — Disabled state attrs** — disabled dates include `aria-disabled` and are not selectable.
- [x] **K7 — Range semantics** — range mode emits start/end markers via attrs or data markers.
- [x] **K8 — Labeling & describedby** — supports `ariaLabel`, `ariaLabelledby`, `ariaDescribedBy` pass-through.

---

## L) Events & emissions

- [x] **L1 — valueChange fires** — fires once per committed selection change.
- [x] **L2 — activeChange fires** — fires when active date changes via keyboard/navigation.
- [x] **L3 — viewChange fires** — fires on view transitions (day/month/year).
- [x] **L4 — monthChange fires** — fires when visible month changes.
- [x] **L5 — yearChange fires** — fires when visible year changes.
- [x] **L6 — No duplicate emits** — repeated selection of same value does not emit (unless configured).
- [x] **L7 — Batch updates** — programmatic `setState` emits in documented order or single batch.

---

## M) Internationalization (i18n) & localization

- [x] **M1 — Locale weekday order** — weekday headers reflect locale first-day-of-week.
- [x] **M2 — Localized month names** — month labels match locale.
- [x] **M3 — Localized numerals** — day numbers format per locale when formatter supports it.
- [x] **M4 — Calendar system (optional)** — adapter can support non-Gregorian calendars without breaking invariants.

---

## N) Performance & stability

- [x] **N1 — No unnecessary allocations** — month grid generation caches/reuses where documented.
- [x] **N2 — Large year range performance** — year picker virtualizes/paginates without lag (if supported).
- [x] **N3 — Deterministic ids** — generated ids are stable per instance and unique across instances.
- [x] **N4 — Cleanup on destroy** — timers/subscriptions are released and controller becomes inert.

---

## O) Edge cases

- [x] **O1 — DST boundary date** — selecting DST transition dates remains stable (date-only).
- [x] **O2 — Leap day** — Feb 29 works and month navigation clamps (e.g., Mar 31 → Feb 28/29).
- [x] **O3 — Min/max equals** — single allowed day behaves correctly across views.
- [x] **O4 — Disabled all days** — navigation does not infinite-loop; selection prevented gracefully.
- [x] **O5 — Programmatic set to out-of-range** — clamps/rejects per contract and reports invalid state.

---

## Suggested file names (Vitest)

- [x] `libs/tailng-ui/primitives/src/lib/form/datepicker/__tests__/tng-datepicker.controller.spec.ts`
- [x] `libs/tailng-ui/primitives/src/lib/form/datepicker/__tests__/tng-datepicker.keyboard.spec.ts`
- [x] `libs/tailng-ui/primitives/src/lib/form/datepicker/__tests__/tng-datepicker.constraints.spec.ts`
- [x] `libs/tailng-ui/primitives/src/lib/form/datepicker/__tests__/tng-datepicker.a11y-attrs.spec.ts`
- [x] `libs/tailng-ui/primitives/src/lib/form/datepicker/__tests__/tng-datepicker.popup-integration.spec.ts` (only if popup adapter exists)


