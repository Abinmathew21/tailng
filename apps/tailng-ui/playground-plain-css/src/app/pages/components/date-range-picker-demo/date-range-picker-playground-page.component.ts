import type { ElementRef, OnDestroy } from '@angular/core';
import { Component, computed, effect, signal, viewChild } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons';
import {
  createDateRangePickerController,
  defaultDateRangePickerDateAdapter,
  TngDateRangePickerOverlay,
  type TngDateRangePickerOutputs,
  type TngDateRangeValue,
} from '@tailng-ui/primitives';

type CalendarView = 'day' | 'month' | 'year';
type DayCell = TngDateRangePickerOutputs<Date>['cells'][number];
type MonthOption = TngDateRangePickerOutputs<Date>['monthOptions'][number];
type YearOption = TngDateRangePickerOutputs<Date>['yearOptions'][number];
type DateRange = Readonly<{ end: Date; start: Date }>;

const fixedWindowLeftDays = 5;
const fixedWindowRightDays = 4;

function formatRangeDate(date: Date | null): string {
  if (date === null) {
    return 'Not set';
  }

  return defaultDateRangePickerDateAdapter.format(date, 'label', 'en-US');
}

@Component({
  selector: 'app-date-range-picker-playground-page',
  imports: [TngDateRangePickerOverlay, TngIcon],
  templateUrl: './date-range-picker-playground-page.component.html',
  styleUrl: './date-range-picker-playground-page.component.css',
})
export class DateRangePickerPlaygroundPageComponent implements OnDestroy {
  private readonly fixedWindowTriggerRef = viewChild<ElementRef<HTMLElement>>(
    'fixedWindowTriggerButton',
  );
  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('triggerButton');
  private readonly fixedWindowRenderVersion = signal(0);
  private readonly fixedWindowPreviewRange = signal<DateRange | null>(null);
  private readonly renderVersion = signal(0);

  protected readonly controller = createDateRangePickerController<Date>({
    closeOnSelect: true,
    disableDate: (date) => date.getDay() === 0,
    locale: 'en-US',
    maxDate: '2024-07-31',
    minDate: '2024-04-01',
    ownerDocument: document,
    showOutsideDays: true,
    today: new Date(2024, 4, 15),
    trapFocus: true,
    value: {
      end: '2024-05-17',
      start: '2024-05-10',
    },
  });

  protected readonly fixedWindowController = createDateRangePickerController<Date>({
    closeOnSelect: false,
    locale: 'en-US',
    ownerDocument: document,
    showOutsideDays: true,
    today: new Date(2024, 4, 15),
    trapFocus: true,
    value: null,
  });

  private readonly fixedWindowUnsubscribe = this.fixedWindowController.subscribe((event) => {
    if (event.type === 'closed') {
      this.fixedWindowPreviewRange.set(null);
    }

    this.fixedWindowRenderVersion.update((value) => value + 1);
  });
  private readonly unsubscribe = this.controller.subscribe(() => {
    this.renderVersion.update((value) => value + 1);
  });

  protected readonly fixedWindowOutputs = computed(() => {
    this.fixedWindowRenderVersion();
    return this.fixedWindowController.getOutputs();
  });

  protected readonly fixedWindowSummary = computed(() => {
    const value = this.fixedWindowOutputs().value as TngDateRangeValue<Date> | null;
    if (value === null || value.start === null || value.end === null) {
      return 'Hover a date to preview 10 days';
    }

    return `${formatRangeDate(value.start)} - ${formatRangeDate(value.end)}`;
  });

  protected readonly outputs = computed(() => {
    this.renderVersion();
    return this.controller.getOutputs();
  });

  protected readonly rangeSummary = computed(() => {
    const value = this.outputs().value as TngDateRangeValue<Date> | null;
    if (value === null || value.start === null) {
      return 'Choose a start date';
    }

    if (value.end === null) {
      return `${formatRangeDate(value.start)} - choose an end date`;
    }

    return `${formatRangeDate(value.start)} - ${formatRangeDate(value.end)}`;
  });

  protected readonly startSummary = computed(() => formatRangeDate(this.outputs().startDate));
  protected readonly endSummary = computed(() => formatRangeDate(this.outputs().endDate));
  protected readonly previewSummary = computed(() =>
    this.outputs().previewEndDate === null
      ? 'No preview'
      : formatRangeDate(this.outputs().previewEndDate),
  );

  public constructor() {
    effect(() => {
      this.controller.registerTrigger(this.triggerRef()?.nativeElement ?? null);
    });
    effect(() => {
      this.fixedWindowController.registerTrigger(
        this.fixedWindowTriggerRef()?.nativeElement ?? null,
      );
    });
  }

  public ngOnDestroy(): void {
    this.fixedWindowUnsubscribe();
    this.unsubscribe();
    this.fixedWindowController.destroy();
    this.controller.destroy();
  }

  protected clear(): void {
    this.controller.clear();
  }

  protected close(): void {
    this.controller.close();
  }

  protected clearFixedWindow(): void {
    this.fixedWindowPreviewRange.set(null);
    this.fixedWindowController.clear();
  }

  protected closeFixedWindow(): void {
    this.fixedWindowPreviewRange.set(null);
    this.fixedWindowController.close();
  }

  protected isDayView(): boolean {
    return this.outputs().view === 'day';
  }

  protected isMonthView(): boolean {
    return this.outputs().view === 'month';
  }

  protected isPreviewRowEnd(cell: Readonly<DayCell>): boolean {
    return (
      cell.previewRange &&
      (cell.colIndex === 6 || !this.hasPreviewCellAt(cell.rowIndex, cell.colIndex + 1))
    );
  }

  protected isPreviewRowStart(cell: Readonly<DayCell>): boolean {
    return (
      cell.previewRange &&
      (cell.colIndex === 0 || !this.hasPreviewCellAt(cell.rowIndex, cell.colIndex - 1))
    );
  }

  protected isYearView(): boolean {
    return this.outputs().view === 'year';
  }

  protected isFixedWindowPreviewCell(cell: Readonly<DayCell>): boolean {
    return this.fixedWindowPreviewIncludes(cell);
  }

  protected isFixedWindowPreviewRowEnd(cell: Readonly<DayCell>): boolean {
    return (
      this.fixedWindowPreviewIncludes(cell) &&
      (cell.colIndex === 6 ||
        !this.hasFixedWindowPreviewCellAt(cell.rowIndex, cell.colIndex + 1))
    );
  }

  protected isFixedWindowPreviewRowStart(cell: Readonly<DayCell>): boolean {
    return (
      this.fixedWindowPreviewIncludes(cell) &&
      (cell.colIndex === 0 ||
        !this.hasFixedWindowPreviewCellAt(cell.rowIndex, cell.colIndex - 1))
    );
  }

  protected onFixedWindowDayCellClick(cell: Readonly<DayCell>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    const range = this.resolveFixedWindowRange(cell.date);
    this.fixedWindowPreviewRange.set(null);
    this.fixedWindowController.setValue(range);
    this.fixedWindowController.close('select');
  }

  protected onFixedWindowDayCellPointerEnter(cell: Readonly<DayCell>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.fixedWindowPreviewRange.set(this.resolveFixedWindowRange(cell.date));
  }

  protected onFixedWindowGridKeydown(event: KeyboardEvent): void {
    this.fixedWindowController.handleGridKeyDown(event);
  }

  protected onFixedWindowInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && !this.fixedWindowOutputs().open) {
      event.preventDefault();
      this.fixedWindowController.open();
    }
  }

  protected onFixedWindowOverlayKeydown(event: KeyboardEvent): void {
    this.fixedWindowController.handleOverlayKeyDown(event);
  }

  protected onFixedWindowTriggerClick(): void {
    this.fixedWindowController.toggleOpen();
  }

  protected onFixedWindowTriggerKeydown(event: KeyboardEvent): void {
    this.fixedWindowController.handleTriggerKeyDown(event);
  }

  protected pageFixedWindowBackward(): void {
    this.fixedWindowController.prevMonth();
  }

  protected pageFixedWindowForward(): void {
    this.fixedWindowController.nextMonth();
  }

  protected onDayCellClick(cell: Readonly<DayCell>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.controller.handleCellClick(cell.date);
  }

  protected onDayCellPointerEnter(cell: Readonly<DayCell>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.controller.handleCellPointerEnter(cell.date);
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    this.controller.handleGridKeyDown(event);
  }

  protected onInputBlur(): void {
    this.controller.commitInputText();
  }

  protected onInputChange(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.controller.setInputText(target.value);
    }
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.controller.commitInputText();
      return;
    }

    if (event.key === 'ArrowDown' && !this.outputs().open) {
      event.preventDefault();
      this.controller.open();
    }
  }

  protected onMonthKeydown(event: KeyboardEvent): void {
    this.controller.handleMonthGridKeyDown(event);
    if (event.key === 'Enter' || event.key === ' ') {
      this.controller.showDaysPanel();
    }
  }

  protected onMonthOptionClick(option: Readonly<MonthOption>): void {
    if (option.disabled) {
      return;
    }

    this.controller.selectMonth(option.index);
    this.controller.showDaysPanel();
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    this.controller.handleOverlayKeyDown(event);
  }

  protected onTriggerClick(): void {
    this.controller.toggleOpen();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    this.controller.handleTriggerKeyDown(event);
  }

  protected onViewChange(view: CalendarView): void {
    this.controller.setView(view);
  }

  protected onYearKeydown(event: KeyboardEvent): void {
    this.controller.handleYearGridKeyDown(event);
    if (event.key === 'Enter' || event.key === ' ') {
      this.controller.showMonthsPanel();
    }
  }

  protected onYearOptionClick(option: Readonly<YearOption>): void {
    if (option.disabled) {
      return;
    }

    this.controller.selectYear(option.year);
    this.controller.showMonthsPanel();
  }

  protected pageBackward(): void {
    if (this.isDayView()) {
      this.controller.prevMonth();
      return;
    }

    this.controller.prevYear();
  }

  protected pageForward(): void {
    if (this.isDayView()) {
      this.controller.nextMonth();
      return;
    }

    this.controller.nextYear();
  }

  private hasPreviewCellAt(rowIndex: number, colIndex: number): boolean {
    return this.outputs().cells.some(
      (candidate) =>
        candidate.previewRange &&
        candidate.rowIndex === rowIndex &&
        candidate.colIndex === colIndex,
    );
  }

  private fixedWindowPreviewIncludes(cell: Readonly<DayCell>): boolean {
    const range = this.fixedWindowPreviewRange();
    return (
      range !== null &&
      defaultDateRangePickerDateAdapter.compare(range.start, cell.date) <= 0 &&
      defaultDateRangePickerDateAdapter.compare(range.end, cell.date) >= 0
    );
  }

  private hasFixedWindowPreviewCellAt(rowIndex: number, colIndex: number): boolean {
    return this.fixedWindowOutputs().cells.some(
      (candidate) =>
        this.fixedWindowPreviewIncludes(candidate) &&
        candidate.rowIndex === rowIndex &&
        candidate.colIndex === colIndex,
    );
  }

  private resolveFixedWindowRange(date: Date): DateRange {
    return Object.freeze({
      end: defaultDateRangePickerDateAdapter.addDays(date, fixedWindowRightDays),
      start: defaultDateRangePickerDateAdapter.addDays(date, -fixedWindowLeftDays),
    });
  }
}
