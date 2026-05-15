# TailNG Date Range Picker Implementation Plan

## Goal

Create a separate headless `date-range-picker` primitive by copying the current `datepicker` implementation and simplifying it for range selection only.

The new component should not try to support both single-date and range selection. It should have its own state, types, parts, overlay, tests, and public API.

---

## Recommended Folder Structure

```txt
libs/tailng-ui/primitives/src/lib/form/
  datepicker/
    __tests__/
    datepicker.adapters.ts
    datepicker.state.ts
    datepicker.types.ts
    datepicker.utils.ts
    index.ts
    tng-datepicker.overlay.ts
    tng-datepicker.parts.ts
    tng-datepicker.ts

  date-range-picker/
    __tests__/
      tng-date-range-picker.a11y-attrs.spec.ts
      tng-date-range-picker.constraints.spec.ts
      tng-date-range-picker.controller.spec.ts
      tng-date-range-picker.input.spec.ts
      tng-date-range-picker.keyboard.spec.ts
      tng-date-range-picker.overlay.spec.ts
      tng-date-range-picker.parts.spec.ts
      tng-date-range-picker.popup-integration.spec.ts
      tng-date-range-picker.test-helpers.ts

    date-range-picker.adapters.ts
    date-range-picker.state.ts
    date-range-picker.types.ts
    date-range-picker.utils.ts
    index.ts
    tng-date-range-picker.overlay.ts
    tng-date-range-picker.parts.ts
    tng-date-range-picker.ts
```

---

## Naming Rules

Use these names consistently:

| Existing Datepicker   | New Date Range Picker        |
| --------------------- | ---------------------------- |
| `Datepicker`          | `DateRangePicker`            |
| `datepicker`          | `dateRangePicker`            |
| `tngDatepicker`       | `tngDateRangePicker`         |
| `TngDatepicker`       | `TngDateRangePicker`         |
| `TngDatepickerState`  | `TngDateRangePickerState`    |
| `datepicker.types.ts` | `date-range-picker.types.ts` |
| `datepicker.state.ts` | `date-range-picker.state.ts` |
| `datepicker.utils.ts` | `date-range-picker.utils.ts` |

---

## Public API Proposal

### Value Type

```ts
export interface TngDateRangeValue {
  start: Date | null;
  end: Date | null;
}
```

### Component Inputs

```ts
value = input<TngDateRangeValue | null>(null);
min = input<Date | null>(null);
max = input<Date | null>(null);
disabled = input(false);
readonly = input(false);
required = input(false);
placeholder = input('Select date range');
disabledDate = input<((date: Date) => boolean) | null>(null);
numberOfMonths = input(2);
```

### Component Outputs

```ts
valueChange = output<TngDateRangeValue>();
openedChange = output<boolean>();
startDateChange = output<Date | null>();
endDateChange = output<Date | null>();
```

For the first version, `valueChange` alone is enough. Add `startDateChange` and `endDateChange` only if needed.

---

## State Model

Create `date-range-picker.state.ts`.

```ts
export interface TngDateRangePickerState {
  readonly open: boolean;
  readonly activeDate: Date;
  readonly focusedDate: Date | null;
  readonly startDate: Date | null;
  readonly endDate: Date | null;
  readonly previewEndDate: Date | null;
}
```

### State Meaning

| State            | Meaning                                                     |
| ---------------- | ----------------------------------------------------------- |
| `open`           | Whether the popup/overlay is open                           |
| `activeDate`     | Month/date currently used for calendar view                 |
| `focusedDate`    | Date currently focused by keyboard navigation               |
| `startDate`      | Selected range start                                        |
| `endDate`        | Selected range end                                          |
| `previewEndDate` | Temporary hover/focus date used before end date is selected |

---

## Utility Functions

Create or update `date-range-picker.utils.ts`.

```ts
export function isSameDate(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) {
    return false;
  }

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isDateBefore(a: Date, b: Date): boolean {
  return startOfDate(a).getTime() < startOfDate(b).getTime();
}

export function isDateAfter(a: Date, b: Date): boolean {
  return startOfDate(a).getTime() > startOfDate(b).getTime();
}

export function isDateBetween(date: Date, start: Date, end: Date): boolean {
  const valueTime = startOfDate(date).getTime();
  const startTime = startOfDate(start).getTime();
  const endTime = startOfDate(end).getTime();

  return valueTime > startTime && valueTime < endTime;
}

export function normalizeDateRange(start: Date, end: Date): { start: Date; end: Date } {
  return isDateBefore(end, start) ? { start: end, end: start } : { start, end };
}

export function hasCompleteRange(value: TngDateRangeValue | null | undefined): boolean {
  return !!value?.start && !!value?.end;
}

export function hasPartialRange(value: TngDateRangeValue | null | undefined): boolean {
  return !!value?.start && !value?.end;
}
```

---

## Selection Behavior

### Expected Behavior

| Current State   | User Action             | Result                           |
| --------------- | ----------------------- | -------------------------------- |
| Empty range     | Click date              | Set `startDate`, clear `endDate` |
| Start only      | Click date after start  | Set `endDate`                    |
| Start only      | Click date before start | Reorder and set `{ start, end }` |
| Complete range  | Click date              | Start a new range                |
| Start only      | Hover/focus date        | Set `previewEndDate`             |
| Complete range  | Hover/focus date        | Do not update preview            |
| Disabled date   | Click date              | Ignore                           |
| Date before min | Click date              | Ignore                           |
| Date after max  | Click date              | Ignore                           |

### Selection Method

```ts
protected selectDate(date: Date): void {
  if (this.isDateDisabled(date)) {
    return;
  }

  const startDate = this.startDate();
  const endDate = this.endDate();

  if (!startDate || endDate) {
    this.startDate.set(date);
    this.endDate.set(null);
    this.previewEndDate.set(null);

    this.valueChange.emit({
      start: date,
      end: null,
    });

    return;
  }

  const range = normalizeDateRange(startDate, date);

  this.startDate.set(range.start);
  this.endDate.set(range.end);
  this.previewEndDate.set(null);

  this.valueChange.emit({
    start: range.start,
    end: range.end,
  });
}
```

---

## Preview Behavior

```ts
protected previewDate(date: Date): void {
  if (this.isDateDisabled(date)) {
    return;
  }

  if (!this.startDate() || this.endDate()) {
    return;
  }

  this.previewEndDate.set(date);
}

protected clearPreviewDate(): void {
  this.previewEndDate.set(null);
}
```

---

## Cell State Helpers

```ts
protected isRangeStart(date: Date): boolean {
  return isSameDate(date, this.startDate());
}

protected isRangeEnd(date: Date): boolean {
  return isSameDate(date, this.endDate());
}

protected isInRange(date: Date): boolean {
  const startDate = this.startDate();
  const endDate = this.endDate();

  if (!startDate || !endDate) {
    return false;
  }

  return isDateBetween(date, startDate, endDate);
}

protected isInPreviewRange(date: Date): boolean {
  const startDate = this.startDate();
  const previewEndDate = this.previewEndDate();

  if (!startDate || !previewEndDate || this.endDate()) {
    return false;
  }

  const range = normalizeDateRange(startDate, previewEndDate);

  return isDateBetween(date, range.start, range.end);
}
```

---

## Headless Data Attributes

Add these attributes to date cells through `tng-date-range-picker.parts.ts`.

```html
[attr.data-range-start]="isRangeStart(date) ? '' : null" [attr.data-range-end]="isRangeEnd(date) ?
'' : null" [attr.data-in-range]="isInRange(date) ? '' : null"
[attr.data-preview-range]="isInPreviewRange(date) ? '' : null"
```

### Recommended Attributes

| Attribute            | Meaning                                  |
| -------------------- | ---------------------------------------- |
| `data-range-start`   | Cell is selected range start             |
| `data-range-end`     | Cell is selected range end               |
| `data-in-range`      | Cell is between selected start and end   |
| `data-preview-range` | Cell is inside hover/focus preview range |
| `data-today`         | Cell is today                            |
| `data-disabled`      | Cell is disabled                         |
| `data-outside-month` | Cell belongs to previous/next month      |
| `data-focused`       | Cell is keyboard-focused                 |
| `data-active`        | Cell is active in keyboard navigation    |

---

## ARIA Guidance

Use the existing datepicker ARIA pattern as the baseline.

Recommended behavior:

| Element                | ARIA                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| Trigger                | `aria-haspopup="dialog"`                                            |
| Trigger                | `aria-expanded` reflects popup state                                |
| Trigger                | `aria-controls` points to popup id                                  |
| Popup                  | `role="dialog"` or existing datepicker popup role                   |
| Calendar grid          | `role="grid"`                                                       |
| Weekday row            | `role="row"`                                                        |
| Day cell wrapper       | `role="gridcell"`                                                   |
| Day button             | `aria-label` with full date                                         |
| Disabled day           | `aria-disabled="true"`                                              |
| Selected start/end     | `aria-selected="true"`                                              |
| In-range middle dates  | Usually not `aria-selected`, but can include descriptive label text |
| Required input/trigger | `aria-required="true"` where applicable                             |
| Invalid state          | `aria-invalid="true"` where applicable                              |

For range dates, prefer useful labels such as:

```txt
May 10, 2026, selected start date
May 15, 2026, selected end date
May 12, 2026, in selected range
```

---

## Keyboard Behavior

Start simple and match the existing datepicker as much as possible.

| Key                | Behavior                                                           |
| ------------------ | ------------------------------------------------------------------ |
| `Enter`            | Select focused date                                                |
| `Space`            | Select focused date                                                |
| `Escape`           | Close popup                                                        |
| `Tab`              | Allow native tab movement and close if existing datepicker does so |
| `ArrowLeft`        | Move focus one day back                                            |
| `ArrowRight`       | Move focus one day forward                                         |
| `ArrowUp`          | Move focus one week back                                           |
| `ArrowDown`        | Move focus one week forward                                        |
| `Home`             | Move focus to start of week                                        |
| `End`              | Move focus to end of week                                          |
| `PageUp`           | Move focus to previous month                                       |
| `PageDown`         | Move focus to next month                                           |
| `Shift + PageUp`   | Move focus to previous year                                        |
| `Shift + PageDown` | Move focus to next year                                            |

Range-specific keyboard behavior:

| State          | Key Action                      | Behavior                      |
| -------------- | ------------------------------- | ----------------------------- |
| Empty          | `Enter`/`Space`                 | Select start date             |
| Start only     | Arrow navigation                | Update preview range by focus |
| Start only     | `Enter`/`Space`                 | Select end date               |
| Complete range | `Enter`/`Space` on another date | Start a new range             |

---

## Overlay Behavior

Reuse the existing datepicker overlay pattern.

Recommended behavior:

| Behavior                           | Recommendation                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| Opens from trigger                 | Yes                                                                             |
| Closes on outside click            | Yes                                                                             |
| Closes on Escape                   | Yes                                                                             |
| Repositions on scroll              | Same as existing datepicker                                                     |
| Blocks scroll                      | No, unless existing datepicker does                                             |
| Restores focus to trigger on close | Yes                                                                             |
| Supports disabled trigger          | Yes                                                                             |
| Supports readonly trigger          | Should not open or should open without selection depending on existing behavior |
| Supports programmatic open/close   | Match existing datepicker                                                       |

---

## Implementation Steps

### Step 1: Copy Folder

Copy `datepicker` folder to `date-range-picker`.

```txt
datepicker → date-range-picker
```

### Step 2: Rename Files

Rename files from:

```txt
datepicker.* → date-range-picker.*
tng-datepicker.* → tng-date-range-picker.*
```

### Step 3: Rename Symbols

Rename classes, directives, tokens, selectors, ids, and test helpers.

Examples:

```txt
TngDatepicker → TngDateRangePicker
tngDatepicker → tngDateRangePicker
[tngDatepicker] → [tngDateRangePicker]
tng-datepicker → tng-date-range-picker
```

### Step 4: Replace Single Date Value

Replace `Date | null` selection state with:

```ts
TngDateRangeValue | null;
```

Internally use:

```ts
startDate: Date | null;
endDate: Date | null;
previewEndDate: Date | null;
```

### Step 5: Add Range Selection Logic

Implement `selectDate`, `previewDate`, and `clearPreviewDate`.

### Step 6: Add Cell Range Helpers

Implement `isRangeStart`, `isRangeEnd`, `isInRange`, and `isInPreviewRange`.

### Step 7: Add Headless Attributes

Expose range state through `data-*` attributes.

### Step 8: Add Tests

Start with controller and parts tests. Then add constraints, keyboard, overlay, and a11y tests.

### Step 9: Export Component

Create `date-range-picker/index.ts`.

```ts
export * from './date-range-picker.adapters';
export * from './date-range-picker.state';
export * from './date-range-picker.types';
export * from './date-range-picker.utils';
export * from './tng-date-range-picker';
export * from './tng-date-range-picker.overlay';
export * from './tng-date-range-picker.parts';
```

Then export from the nearest package-level barrel file.

### Step 10: Add Playground Example

Create a small example showing:

```html
<tng-date-range-picker [value]="range()" (valueChange)="range.set($event)" />
```

---

# Test Cases

## Types and Public API

- [x] should expose `TngDateRangeValue` with `start` and `end` fields.
- [x] should allow `start` to be `null`.
- [x] should allow `end` to be `null`.
- [x] should allow both `start` and `end` to be `null`.
- [x] should accept `value` as `null`.
- [x] should accept `value` as a partial range.
- [x] should accept `value` as a complete range.
- [x] should emit `valueChange` with partial range after selecting start date.
- [x] should emit `valueChange` with complete range after selecting end date.
- [x] should not emit invalid range values.
- [x] should preserve strict TypeScript typing for range value.
- [x] should export public types from `date-range-picker/index.ts`.
- should export public component from `date-range-picker/index.ts`.
- [x] should export public parts from `date-range-picker/index.ts`.
- [x] should not require datepicker imports to use date range picker.

## Initial State

- [x] should initialize with popup closed.
- [x] should initialize with no start date when value is null.
- [x] should initialize with no end date when value is null.
- [x] should initialize with no preview end date.
- [x] should initialize start date from external value.
- [x] should initialize end date from external value.
- [x] should initialize active date from start date when value has start date.
- [x] should initialize active date from current date when value is null.
- [x] should support initial partial range.
- [x] should support initial complete range.
- [x] should clear preview state on initialization.
- [x] should not mutate the external value object during initialization.

## External Value Synchronization

- [x] should update internal start date when external value changes.
- [x] should update internal end date when external value changes.
- [x] should clear internal range when external value becomes null.
- [x] should update from partial external range.
- [x] should update from complete external range.
- [x] should preserve popup state when external value changes.
- [x] should preserve active month when external value changes unless current implementation intentionally resets it.
- should not emit valueChange when only external value input changes.
- [x] should handle external value where start is null and end is not null by normalizing or ignoring invalid end.
- [x] should handle external value where start is after end by normalizing if normalization is part of the contract.
- [x] should not throw when external value changes rapidly.
- [x] should not mutate external Date instances.

## Range Selection

- [x] should select start date when no range exists.
- [x] should clear end date when selecting a new start date.
- [x] should clear preview end date when selecting a new start date.
- [x] should select end date when start date exists.
- [x] should emit partial range after first click.
- [x] should emit complete range after second click.
- [x] should reorder start and end when second selected date is before start date.
- [x] should allow same-day range when clicking the same date twice.
- [x] should start a new range when clicking after a completed range.
- [x] should replace previous completed range with new partial range on next click.
- [x] should not preserve old end date when starting a new range.
- [x] should select range across month boundary.
- [x] should select range across year boundary.
- [x] should select range across leap day.
- [x] should select range at end of month.
- [x] should select range at start of month.
- [x] should select range from Dec 31 to Jan 1.
- [x] should support selecting dates in reverse order across month boundary.
- [x] should support selecting dates in reverse order across year boundary.
- [x] should not select disabled date as start date.
- [x] should not select disabled date as end date.
- [x] should not complete range when end date is disabled.
- [x] should allow a range to span disabled dates between valid endpoints.
- [x] should preserve existing start date when disabled end date is clicked.
- [x] should preserve existing completed range when disabled date is clicked after range completion if that is the chosen behavior.
- [x] should clear old completed range when valid date is clicked after range completion.
- [x] should not emit valueChange when disabled date is clicked.
- [x] should not emit duplicate valueChange for a single click.
- [x] should not throw when selecting date while popup is closed.
- [x] should not select date when component is disabled.
- should not select date when component is readonly if readonly blocks selection.
- [x] should not select outside min/max constraints.

## Preview Range

- [x] should set preview end date on hover when only start date exists.
- [x] should set preview end date on focus when only start date exists.
- [x] should not set preview end date when no start date exists.
- [x] should not set preview end date when range is complete.
- [x] should clear preview end date after range is completed.
- [x] should clear preview end date when starting a new range.
- [x] should clear preview end date when popup closes.
- should clear preview end date when mouse leaves calendar if that behavior is implemented.
- [x] should preview range after start date when hovered date is after start.
- [x] should preview range before start date when hovered date is before start.
- [x] should preview same-day range when hovered date equals start date.
- [x] should not preview disabled dates.
- [x] should not preview dates before min.
- [x] should not preview dates after max.
- [x] should update preview range when hovering different dates.
- [x] should notify subscription-bound renderers when pointer hover updates preview.
- [x] should update preview range when keyboard focus moves.
- [x] should not emit valueChange during preview.
- [x] should not mark preview as selected range.
- [x] should not keep stale preview after external value changes.

## Cell State

- [x] should mark start date with `data-range-start`.
- [x] should mark end date with `data-range-end`.
- [x] should mark dates between start and end with `data-in-range`.
- [x] should not mark start date as `data-in-range`.
- [x] should not mark end date as `data-in-range`.
- [x] should mark dates from start through preview end with `data-preview-range`.
- [x] should mark start date as `data-preview-range` while previewing.
- [x] should mark preview end date as both `data-preview-range` and `data-preview-end`.
- [x] should remove `data-preview-range` after range is completed.
- [x] should remove `data-in-range` when range is cleared.
- [x] should remove `data-range-start` when range is cleared.
- [x] should remove `data-range-end` when range is cleared.
- [x] should mark same-day range as both range start and range end if same-day range is allowed.
- [x] should mark today with existing today attribute.
- [x] should mark disabled dates with existing disabled attribute.
- [x] should mark outside-month dates with existing outside-month attribute.
- [x] should preserve existing datepicker cell attributes where applicable.
- should not apply range attributes to disabled dates unless disabled selected values are externally provided and supported.
- [x] should update cell states when external value changes.
- [x] should update cell states when navigating months.
- [x] should update cell states when preview date changes.

## Constraints

- [x] should disable dates before `min`.
- [x] should disable dates after `max`.
- [x] should allow dates equal to `min`.
- [x] should allow dates equal to `max`.
- [x] should apply custom disabledDate callback.
- [x] should combine min constraint with custom disabledDate callback.
- [x] should combine max constraint with custom disabledDate callback.
- [x] should not select start date before min.
- [x] should not select start date after max.
- [x] should not select end date before min.
- [x] should not select end date after max.
- [x] should not preview date before min.
- [x] should not preview date after max.
- [x] should not focus disabled date if existing datepicker skips disabled dates.
- [x] should not navigate active focus outside allowed date range if existing datepicker clamps focus.
- [x] should handle min and max in different months.
- [x] should handle min and max in different years.
- [x] should handle min equal max.
- [x] should allow same-day range when min equals max and date is selected twice.
- [x] should handle invalid min greater than max gracefully.
- [x] should update disabled states when min changes.
- [x] should update disabled states when max changes.
- [x] should update disabled states when disabledDate callback changes.
- [x] should not throw if disabledDate callback throws if existing contract catches errors, otherwise should surface error consistently.

## Input and Display Value

- [x] should display placeholder when range is empty.
- [x] should display only start date for partial range.
- [x] should display start and end date for complete range.
- [x] should update display value after selecting start date.
- [x] should update display value after selecting end date.
- [x] should clear display value when value becomes null.
- [x] should use configured date format if date formatting input exists.
- [x] should display normalized range order.
- [x] should not show stale end date after starting new range.
- [x] should set trigger disabled state when disabled input is true.
- should set trigger readonly behavior when readonly input is true.
- should apply required state when required input is true.
- should expose invalid state when validation support exists.
- [x] should not open popup from disabled trigger.
- should follow existing datepicker input behavior for focus and blur.
- [x] should support programmatic value updates while popup is open.
- [x] should support programmatic value updates while popup is closed.

## Overlay and Popup

- [x] should open popup when trigger is clicked.
- [x] should close popup when trigger is clicked again if existing behavior toggles.
- [x] should close popup on outside click.
- [x] should close popup on Escape.
- [x] should restore focus to trigger after closing with Escape.
- [x] should keep focus behavior consistent with existing datepicker.
- [x] should not open popup when disabled.
- should not open popup when readonly if readonly blocks open.
- [x] should emit openedChange when popup opens.
- [x] should emit openedChange when popup closes.
- [x] should not emit duplicate openedChange values.
- should create overlay only when opened if existing datepicker lazily creates overlay.
- should destroy or detach overlay when closed if existing datepicker does so.
- should position popup relative to trigger.
- should reposition popup on scroll if existing datepicker does so.
- should preserve popup alignment with trigger.
- should support viewport collision handling if existing datepicker supports it.
- [x] should close popup after complete range selection if auto-close is enabled.
- [x] should keep popup open after selecting start date.
- [x] should keep popup open during preview.
- [x] should clear preview when popup closes.
- [x] should preserve selected range when popup closes.
- [x] should preserve selected range when popup reopens.
- [x] should focus selected start date on open when partial range exists.
- [x] should focus start date or active date on open when complete range exists.
- [x] should focus today on open when no range exists if existing datepicker does so.

## Theme and Overlay Modes

- [x] should preserve date-range-picker theme CSS variables when the overlay is portalled.
- [x] should preserve light or dark `color-scheme` when the overlay is portalled.
- [x] should clear portalled theme variables when the overlay closes.
- [x] should compute overlay layout mode without shifting host layout.
- [x] should compute push mode width and offset.
- [x] should compute side mode width and RTL-aware offset.

## Keyboard Navigation

- [x] should open popup with Enter on trigger.
- [x] should open popup with Space on trigger.
- [x] should close popup with Escape.
- [x] should allow Tab to move focus naturally.
- [x] should not preventDefault for Tab if existing datepicker allows native traversal.
- [x] should select focused date with Enter.
- [x] should select focused date with Space.
- [x] should select start date with keyboard when range is empty.
- [x] should select end date with keyboard when start date exists.
- [x] should start a new range with keyboard when range is complete.
- [x] should update preview range when focused date changes after selecting start.
- [x] should move focus one day back with ArrowLeft in LTR.
- [x] should move focus one day forward with ArrowRight in LTR.
- [x] should move focus one day forward with ArrowLeft in RTL if existing datepicker supports RTL.
- [x] should move focus one day back with ArrowRight in RTL if existing datepicker supports RTL.
- [x] should move focus one week back with ArrowUp.
- [x] should move focus one week forward with ArrowDown.
- [x] should move focus to week start with Home.
- [x] should move focus to week end with End.
- [x] should move focus to previous month with PageUp.
- [x] should move focus to next month with PageDown.
- [x] should move focus to previous year with Shift+PageUp.
- [x] should move focus to next year with Shift+PageDown.
- [x] should skip disabled dates during keyboard navigation if existing datepicker skips disabled dates.
- [x] should clamp keyboard navigation to min date if existing datepicker clamps.
- [x] should clamp keyboard navigation to max date if existing datepicker clamps.
- [x] should update active month when keyboard focus moves to previous month.
- [x] should update active month when keyboard focus moves to next month.
- [x] should maintain preview range across keyboard month navigation.
- [x] should not emit valueChange from focus movement alone.
- [x] should not throw when keyboard event is fired without focused date.

## Accessibility Attributes

- [x] should set `aria-haspopup` on trigger.
- [x] should set `aria-expanded` to true when popup is open.
- [x] should set `aria-expanded` to false when popup is closed.
- [x] should set `aria-controls` on trigger when popup exists.
- [x] should remove or update `aria-controls` when popup is destroyed depending on existing behavior.
- should set accessible label on trigger.
- [x] should support custom aria-label if existing datepicker supports it.
- should support aria-labelledby if existing datepicker supports it.
- [x] should set popup role consistently with existing datepicker.
- [x] should set calendar grid role consistently with existing datepicker.
- should set weekday row roles consistently with existing datepicker.
- [x] should set day cell roles consistently with existing datepicker.
- [x] should set `aria-disabled` on disabled dates.
- [x] should set `aria-selected` on range start.
- [x] should set `aria-selected` on range end.
- [x] should not set `aria-selected` on middle in-range dates unless that is the chosen ARIA contract.
- [x] should include “selected start date” in start date accessible label.
- [x] should include “selected end date” in end date accessible label.
- [x] should include “in selected range” in middle date accessible label if descriptive labels are implemented.
- [x] should include “preview range” in preview date labels if descriptive preview labels are implemented.
- should expose required state if required input exists.
- should expose invalid state if validation support exists.
- [x] should not duplicate ids.
- [x] should generate stable ids where existing datepicker requires stable ids.
- [x] should update ARIA labels when range changes.
- [x] should update ARIA labels when preview changes.
- [x] should update ARIA attributes when disabled state changes.

## Parts and Directives

- [x] should create trigger directive or component with correct selector.
- [x] should create popup directive or component with correct selector.
- [x] should create calendar directive or component with correct selector.
- [x] should create cell directive or component with correct selector.
- should register range picker parts through DI if existing datepicker uses DI.
- [x] should allow cell parts to access parent range picker controller.
- should gracefully no-op when a part is used without a parent if existing datepicker does so.
- should clean up part registration on destroy.
- should keep cell order based on DOM order if existing datepicker uses registration.
- should support dynamic cell creation.
- should support dynamic cell removal.
- should not leak registered cells after destroy.
- [x] should expose data attributes from parts.
- [x] should support custom class styling through host attributes.
- [x] should preserve headless usage without mandatory CSS.

## Multi-Month View

- should render one month when numberOfMonths is 1.
- should render two months when numberOfMonths is 2.
- should render configured number of months.
- should show consecutive months.
- should navigate both visible months together.
- should support selecting start date in first visible month and end date in second visible month.
- should support selecting start date in second visible month and end date in first visible month.
- should mark in-range dates across visible months.
- should mark preview range across visible months.
- should not duplicate date ids across multiple months.
- should correctly mark outside-month dates in each month.
- should preserve range selection when navigating months.
- should focus correct date when month navigation changes.
- should avoid rendering invalid month indexes across year boundary.
- should render December and January together correctly.
- should render February in leap year correctly.
- should render February in non-leap year correctly.

## Month and Year Navigation

- [x] should navigate to previous month.
- [x] should navigate to next month.
- [x] should navigate to previous year.
- [x] should navigate to next year.
- should disable previous navigation when all previous dates are before min if existing behavior supports it.
- should disable next navigation when all next dates are after max if existing behavior supports it.
- [x] should preserve selected range during month navigation.
- [x] should preserve preview range during month navigation if still relevant.
- should clear preview range on month navigation if that is the chosen behavior.
- [x] should update calendar heading after month navigation.
- [x] should update focused date after month navigation.
- [x] should not emit valueChange on month navigation.
- [x] should not close popup on month navigation.
- [x] should handle navigation across year boundary.
- [x] should handle navigation from January to December previous year.
- [x] should handle navigation from December to January next year.

## Form Integration

- should work with Angular template-driven form if supported by existing datepicker.
- should work with Angular reactive form if ControlValueAccessor is implemented.
- should write value from form control.
- should emit value to form control after start selection.
- should emit value to form control after end selection.
- should mark control as touched on blur or close according to existing datepicker behavior.
- should set disabled state from form control.
- should reset range when form control resets.
- should support validators for required range.
- should support validators for complete range if required by API.
- should not mark valid complete range as invalid.
- should mark null range invalid when required.
- should mark partial range invalid when complete range is required.
- should preserve partial range if partial values are allowed.
- should not emit form value changes from preview.
- should not mutate form value object.

## Clear and Reset Behavior

- [x] should clear start date when clear action is called.
- [x] should clear end date when clear action is called.
- [x] should clear preview end date when clear action is called.
- [x] should emit null or `{ start: null, end: null }` according to the chosen public contract.
- [x] should update display value after clear.
- [x] should update cell state after clear.
- [x] should preserve popup open state after clear if clear button is inside popup and that is expected.
- should close popup after clear if clear button is intended to close.
- should restore focus after clear according to existing focus behavior.
- [x] should not throw when clear is called with empty range.
- should clear external form value when used with forms.
- should clear invalid state when validators allow empty value.

## Apply and Cancel Behavior, If Added Later

- should keep temporary draft range before Apply is clicked.
- should emit valueChange only when Apply is clicked if apply mode is enabled.
- should restore previous committed range when Cancel is clicked.
- should close popup after Apply.
- should close popup after Cancel.
- should keep popup open after selecting start date in apply mode.
- should keep popup open after selecting end date in apply mode.
- should disable Apply until complete range exists if complete range is required.
- should allow Apply for partial range if partial range is allowed.
- should clear draft preview after Apply.
- should clear draft preview after Cancel.

## Presets, If Added Later

- should render configured presets.
- should apply preset range when preset is clicked.
- should emit valueChange after preset is clicked.
- should normalize preset range if start is after end.
- should ignore disabled preset if preset disabled support exists.
- should mark selected preset when range matches preset.
- should close popup after preset selection if auto-close is enabled.
- should keep popup open after preset selection if auto-close is disabled.
- should support Today preset.
- should support Last 7 Days preset.
- should support This Month preset.
- should support custom preset labels.
- should not mutate preset range objects.

## Internationalization and Formatting

- [x] should format display value using configured adapter or formatter.
- [x] should format accessible labels using configured locale if supported.
- [x] should render weekdays using configured locale if existing datepicker supports it.
- [x] should support first day of week configuration if existing datepicker supports it.
- [x] should correctly calculate range when first day of week changes.
- [x] should not change selected value when locale changes.
- [x] should update visible labels when locale changes.
- [x] should support RTL direction if existing datepicker supports it.
- [x] should update keyboard horizontal navigation in RTL.
- [x] should support non-US date formats.
- [x] should support ISO-like date formatting if configured.
- [x] should not parse invalid typed values if text input parsing is not supported.

## Date Adapter

- [x] should use copied date adapter from datepicker.
- [x] should compare dates through adapter where applicable.
- [x] should create dates through adapter where applicable.
- [x] should not depend directly on native Date if adapter abstraction is intended.
- [x] should support custom adapter if existing datepicker supports it.
- [x] should preserve timezone behavior from existing datepicker.
- [x] should avoid time-of-day affecting date comparisons.
- [x] should normalize dates to start of day for comparison.
- [x] should handle daylight saving time boundaries where applicable.
- [x] should handle leap years correctly.
- [x] should handle invalid Date objects gracefully if existing datepicker does.

## Disabled and Readonly Component State

- [x] should not open when disabled.
- [x] should not select date when disabled.
- [x] should add disabled attribute to trigger when disabled.
- [x] should add disabled data attribute to root when disabled.
- should not focus disabled trigger.
- [x] should preserve existing value when disabled changes to true.
- [x] should allow programmatic value changes while disabled.
- should not select date when readonly if readonly blocks selection.
- should not emit valueChange from user action while readonly.
- should expose readonly state on trigger if applicable.
- should preserve existing value when readonly changes to true.
- should allow popup open in readonly mode only if chosen behavior allows inspection.
- should not show clear button in readonly mode if clear button exists.

## Edge Cases

- [x] should handle null value.
- [x] should handle undefined value if API receives it accidentally.
- [x] should handle invalid Date value gracefully.
- [x] should handle start date without end date.
- [x] should handle end date without start date according to chosen normalization behavior.
- [x] should handle start date after end date according to chosen normalization behavior.
- [x] should handle same start and end date.
- [x] should handle dates with non-midnight time.
- [x] should handle month with 28 days.
- [x] should handle month with 29 days.
- [x] should handle month with 30 days.
- [x] should handle month with 31 days.
- [x] should handle leap day.
- [x] should handle year boundary.
- [x] should handle very old dates if min allows them.
- [x] should handle very future dates if max allows them.
- [x] should not throw when component is destroyed while popup is open.
- [x] should not throw when external value changes after component destroy.
- [x] should not leak event listeners after destroy.
- should not leak overlay references after destroy.
- [x] should not mutate input Date objects.
- [x] should not rely on object reference equality for date comparisons.
- [x] should not break existing datepicker tests.

## Regression Tests Against Existing Datepicker

- [x] should not change existing datepicker public API.
- [x] should not change existing datepicker selection behavior.
- [x] should not change existing datepicker overlay behavior.
- [x] should not change existing datepicker keyboard behavior.
- [x] should not change existing datepicker ARIA attributes.
- [x] should not change existing datepicker exported symbols.
- [x] should not require datepicker users to import date range picker.
- should not introduce circular imports between datepicker and date range picker.
- should not duplicate package-level export names.
- should not break package build.
- should not break lint.
- [x] should not break existing test helpers.

---

## Suggested First PR Scope

Keep the first PR small and practical.

### Include

- New `date-range-picker` folder.
- Copied and renamed files.
- Range value type.
- Range state.
- Range utility functions.
- Basic range selection.
- Basic preview behavior.
- Cell data attributes.
- Controller tests.
- Parts tests.
- Export from barrel file.

### Exclude From First PR

- Presets.
- Apply/Cancel flow.
- Advanced form validation.
- Advanced typed input parsing.
- Complex locale changes.
- Complex date adapter refactor.
- Shared `date-core` extraction.

---

## Suggested First PR Test Minimum

For the first PR, at least cover these:

- [x] should select start date when no range exists.
- [x] should select end date when start date exists.
- [x] should reorder range when end date is before start date.
- [x] should start a new range when clicking after completed range.
- [x] should emit partial range after first click.
- [x] should emit complete range after second click.
- [x] should set preview date on hover when only start date exists.
- [x] should clear preview date after completing range.
- [x] should mark start date with `data-range-start`.
- [x] should mark end date with `data-range-end`.
- [x] should mark middle dates with `data-in-range`.
- [x] should mark preview dates with `data-preview-range`.
- [x] should ignore disabled dates.
- [x] should respect min date.
- [x] should respect max date.
- [x] should open and close popup.
- [x] should close popup on Escape.
- [x] should select focused date with Enter.
- [x] should not break existing datepicker tests.

---

## Final Recommendation

Because this is intended to stay simple, keep `date-range-picker` fully separate for now.

Avoid extracting shared code during the first implementation. Once both `datepicker` and `date-range-picker` are stable, shared pieces can be moved into a small internal date core.

Suggested later shared folder:

```txt
date-core/
  date-adapter.ts
  date-utils.ts
  calendar-grid.ts
  keyboard-utils.ts
  a11y-label-utils.ts
```

For now, duplication is acceptable because it keeps the range picker implementation easier to reason about, easier to test, and safer for the existing datepicker.
