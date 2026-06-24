import type {
  ElementRef,
  OnDestroy,
} from '@angular/core';
import {
  Component,
  computed,
  effect,
  signal,
  viewChild,
} from '@angular/core';
import { TngDatepickerComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  createDatepickerController,
  defaultDatepickerDateAdapter,
  TngDatepickerOverlay,
  type TngCalendarView,
  type TngDateAdapter,
  type TngDateCell,
  type TngDatepickerOutputs,
  type TngMonthOption,
  type TngYearOption,
} from '@tailng-ui/primitives';

const displayMonthYearAdapter: TngDateAdapter<Date> = Object.freeze({
  ...defaultDatepickerDateAdapter,
  format: (date, format, locale) => {
    if (format === 'month-year') {
      const month = defaultDatepickerDateAdapter.format(date, 'month-short', locale).toUpperCase();
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${month} • ${year}`;
    }

    return defaultDatepickerDateAdapter.format(date, format, locale);
  },
});

const wrapperFormatAdapter: TngDateAdapter<Date> = Object.freeze({
  ...defaultDatepickerDateAdapter,
  format: (date, format, locale) => {
    if (format === 'input') {
      const day = defaultDatepickerDateAdapter.getDate(date).toString().padStart(2, '0');
      const month = (defaultDatepickerDateAdapter.getMonth(date) + 1).toString().padStart(2, '0');
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${day}.${month}.${year}`;
    }

    if (format === 'month-year') {
      const month = defaultDatepickerDateAdapter.format(date, 'month-short', locale).toUpperCase();
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${year} · ${month}`;
    }

    return defaultDatepickerDateAdapter.format(date, format, locale);
  },
  parse: (text, locale) => {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text.trim());
    if (match !== null) {
      const day = Number(match[1]);
      const month = Number(match[2]) - 1;
      const year = Number(match[3]);
      const date = defaultDatepickerDateAdapter.createDate(year, month, day);
      return defaultDatepickerDateAdapter.isValid(date) &&
        defaultDatepickerDateAdapter.getYear(date) === year &&
        defaultDatepickerDateAdapter.getMonth(date) === month &&
        defaultDatepickerDateAdapter.getDate(date) === day
        ? date
        : null;
    }

    return defaultDatepickerDateAdapter.parse(text, locale);
  },
});

const OVERLAY_FOCUS_SYNC_KEYS: ReadonlySet<string> = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Enter',
  ' ',
  'Escape',
]);

function resolveDayViewFocusTargetId(outputs: TngDatepickerOutputs<Date>): string | null {
  const gridAttributes = outputs.getGridAttributes();
  if (gridAttributes['aria-activedescendant'] !== undefined) {
    return gridAttributes.id ?? null;
  }

  return outputs.cells.find((cell) => cell.active)?.id ?? null;
}

function resolveMonthViewFocusTargetId(outputs: TngDatepickerOutputs<Date>): string | null {
  return outputs.monthOptions.find((option) => option.active)?.id ?? null;
}

function resolveYearViewFocusTargetId(outputs: TngDatepickerOutputs<Date>): string | null {
  return outputs.yearOptions.find((option) => option.active)?.id ?? null;
}

function resolveCurrentFocusTargetId(outputs: TngDatepickerOutputs<Date>): string | null {
  switch (outputs.view) {
    case 'day':
      return resolveDayViewFocusTargetId(outputs);
    case 'month':
      return resolveMonthViewFocusTargetId(outputs);
    case 'year':
      return resolveYearViewFocusTargetId(outputs);
    default:
      return null;
  }
}

function shouldSyncOverlayFocusAfterPickerKey(key: string): boolean {
  return OVERLAY_FOCUS_SYNC_KEYS.has(key);
}

@Component({
  selector: 'app-datepicker-playground-page',
  imports: [TngDatepickerComponent, TngDatepickerOverlay, TngIcon],
  templateUrl: './datepicker-playground-page.component.html',
  host: {
    class: 'block',
  },
})
export class DatepickerPlaygroundPageComponent implements OnDestroy {
  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('triggerButton');
  private readonly renderVersion = signal(0);
  private readonly boundedTriggerRef = viewChild<ElementRef<HTMLElement>>('boundedTriggerButton');
  private readonly boundedRenderVersion = signal(0);
  private readonly materialTriggerRef = viewChild<ElementRef<HTMLElement>>('materialTriggerButton');
  private readonly materialRenderVersion = signal(0);
  protected readonly wrapperFormatAdapter = wrapperFormatAdapter;

  protected readonly controller = createDatepickerController<Date>({
    adapter: displayMonthYearAdapter,
    closeOnSelect: true,
    disableDate: (date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    },
    locale: 'en-US',
    ownerDocument: document,
    showOutsideDays: true,
    today: new Date(2024, 3, 18),
    trapFocus: true,
    value: '2024-04-22',
  });

  protected readonly materialController = createDatepickerController<Date>({
    autoCommitView: false,
    closeOnSelect: true,
    disableDate: (date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    },
    locale: 'en-US',
    ownerDocument: document,
    showOutsideDays: true,
    today: new Date(2024, 3, 18),
    trapFocus: true,
    value: '2024-04-22',
  });

  protected readonly boundedController = createDatepickerController<Date>({
    closeOnSelect: true,
    locale: 'en-US',
    maxDate: '2025-04-25',
    minDate: '2023-04-10',
    ownerDocument: document,
    showOutsideDays: true,
    today: new Date(2024, 3, 18),
    trapFocus: true,
    value: '2024-04-18',
  });

  protected readonly outputs = computed(() => {
    this.renderVersion();
    return this.controller.getOutputs();
  });

  protected readonly materialOutputs = computed(() => {
    this.materialRenderVersion();
    return this.materialController.getOutputs();
  });

  protected readonly boundedOutputs = computed(() => {
    this.boundedRenderVersion();
    return this.boundedController.getOutputs();
  });

  protected readonly selectedSummary = computed(() => {
    const value = this.outputs().value;
    if (value === null || Array.isArray(value) || !(value instanceof Date)) {
      return 'No date selected yet';
    }

    return `${this.controller.formatDate(value, 'month-year')} ${value.getDate()}`;
  });

  protected readonly activeSummary = computed(() =>
    this.controller.formatDate(this.outputs().activeDate, 'month-year') + ` ${this.outputs().activeDate.getDate()}`,
  );

  protected readonly materialSelectedSummary = computed(() => {
    const value = this.materialOutputs().value;
    if (value === null || Array.isArray(value) || !(value instanceof Date)) {
      return 'No date selected yet';
    }

    return `${this.materialController.formatDate(value, 'month-year')} ${value.getDate()}`;
  });

  protected readonly materialActiveSummary = computed(() =>
    this.materialController.formatDate(this.materialOutputs().activeDate, 'month-year') +
    ` ${this.materialOutputs().activeDate.getDate()}`,
  );

  protected readonly boundedSelectedSummary = computed(() => {
    const value = this.boundedOutputs().value;
    if (value === null || Array.isArray(value) || !(value instanceof Date)) {
      return 'No date selected yet';
    }

    return `${this.boundedController.formatDate(value, 'month-year')} ${value.getDate()}`;
  });

  protected readonly boundedActiveSummary = computed(() =>
    this.boundedController.formatDate(this.boundedOutputs().activeDate, 'month-year') +
    ` ${this.boundedOutputs().activeDate.getDate()}`,
  );

  protected readonly materialPeriodEyebrow = computed(() => {
    const view = this.materialOutputs().view;
    if (view === 'year') {
      return 'Choose year';
    }

    if (view === 'month') {
      return 'Choose month';
    }

    return 'Selected period';
  });

  protected readonly materialPeriodLabel = computed(() => {
    const outputs = this.materialOutputs();
    if (outputs.view === 'year') {
      const years = outputs.yearOptions;
      const startYear = years[0]?.year;
      const endYear = years[years.length - 1]?.year;
      return startYear !== undefined && endYear !== undefined ? `${startYear} - ${endYear}` : outputs.labelMonthYear;
    }

    if (outputs.view === 'month') {
      return this.materialController.formatDate(outputs.visibleMonth, 'year-label');
    }

    return outputs.labelMonthYear;
  });

  public constructor() {
    this.controller.subscribe(() => {
      this.renderVersion.update((value) => value + 1);
    });

    this.materialController.subscribe(() => {
      this.materialRenderVersion.update((value) => value + 1);
    });

    this.boundedController.subscribe(() => {
      this.boundedRenderVersion.update((value) => value + 1);
    });

    effect(() => {
      const trigger = this.triggerRef()?.nativeElement ?? null;
      this.controller.registerTrigger(trigger);
    });

    effect(() => {
      const trigger = this.materialTriggerRef()?.nativeElement ?? null;
      this.materialController.registerTrigger(trigger);
    });

    effect(() => {
      const trigger = this.boundedTriggerRef()?.nativeElement ?? null;
      this.boundedController.registerTrigger(trigger);
    });
  }

  public ngOnDestroy(): void {
    this.controller.destroy();
    this.materialController.destroy();
    this.boundedController.destroy();
  }

  protected close(): void {
    this.controller.close();
  }

  protected clear(): void {
    this.controller.clear();
    this.queueOverlayFocusSync();
  }

  protected commitInput(): void {
    this.controller.commitInputText();
  }

  protected isDayView(): boolean {
    return this.outputs().view === 'day';
  }

  protected isMonthView(): boolean {
    return this.outputs().view === 'month';
  }

  protected isYearView(): boolean {
    return this.outputs().view === 'year';
  }

  protected onDayCellClick(cell: Readonly<TngDateCell<Date>>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.controller.handleCellClick(cell.date);
  }

  protected onInputBlur(): void {
    this.controller.commitInputText();
  }

  protected onInputChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.controller.setInputText(target.value);
  }

  protected onInputClick(): void {
    if (this.outputs().open) {
      return;
    }

    this.controller.open();
    this.queueOverlayFocusSync();
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.outputs().open) {
        this.controller.open();
        this.queueOverlayFocusSync();
        return;
      }

      this.controller.commitInputText();
    }
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    this.controller.handleGridKeyDown(event);
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onMonthKeydown(event: KeyboardEvent): void {
    this.controller.handleMonthGridKeyDown(event);
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    this.controller.handleOverlayKeyDown(event);
  }

  protected onYearKeydown(event: KeyboardEvent): void {
    this.controller.handleYearGridKeyDown(event);
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onMonthOptionClick(option: Readonly<TngMonthOption<Date>>): void {
    if (option.disabled) {
      return;
    }

    this.controller.selectMonth(option.index);
    this.queueOverlayFocusSync();
  }

  protected onTriggerClick(): void {
    const wasOpen = this.outputs().open;
    this.controller.toggleOpen();
    if (!wasOpen && this.outputs().open) {
      this.queueOverlayFocusSync();
    }
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    const wasOpen = this.outputs().open;
    this.controller.handleTriggerKeyDown(event);
    if (!wasOpen && this.outputs().open) {
      this.queueOverlayFocusSync();
    }
  }

  protected onViewChange(view: TngCalendarView): void {
    this.controller.setView(view);
    this.queueOverlayFocusSync();
  }

  protected onYearOptionClick(option: Readonly<TngYearOption<Date>>): void {
    if (option.disabled) {
      return;
    }

    this.controller.selectYear(option.year);
    this.queueOverlayFocusSync();
  }

  protected pageBackward(): void {
    if (this.isYearView()) {
      this.controller.prevYear();
      this.queueOverlayFocusSync();
      return;
    }

    this.controller.prevMonth();
    this.queueOverlayFocusSync();
  }

  protected pageForward(): void {
    if (this.isYearView()) {
      this.controller.nextYear();
      this.queueOverlayFocusSync();
      return;
    }

    this.controller.nextMonth();
    this.queueOverlayFocusSync();
  }

  protected restoreToday(): void {
    this.controller.selectDate(new Date(2024, 3, 18));
    this.queueOverlayFocusSync();
  }

  protected closeMaterial(): void {
    this.materialController.close();
  }

  protected closeBounded(): void {
    this.boundedController.close();
  }

  protected clearMaterial(): void {
    this.materialController.clear();
    this.materialController.showDaysPanel();
    this.queueOverlayFocusSync(this.materialOutputs);
  }

  protected clearBounded(): void {
    this.boundedController.clear();
    this.queueOverlayFocusSync(this.boundedOutputs);
  }

  protected isMaterialDayView(): boolean {
    return this.materialOutputs().view === 'day';
  }

  protected isBoundedDayView(): boolean {
    return this.boundedOutputs().view === 'day';
  }

  protected isMaterialMonthView(): boolean {
    return this.materialOutputs().view === 'month';
  }

  protected isBoundedMonthView(): boolean {
    return this.boundedOutputs().view === 'month';
  }

  protected isMaterialYearView(): boolean {
    return this.materialOutputs().view === 'year';
  }

  protected isBoundedYearView(): boolean {
    return this.boundedOutputs().view === 'year';
  }

  protected materialPageBackward(): void {
    if (this.isMaterialDayView()) {
      this.materialController.prevMonth();
    } else {
      this.materialController.prevYear();
    }

    this.queueOverlayFocusSync(this.materialOutputs);
  }

  protected materialPageForward(): void {
    if (this.isMaterialDayView()) {
      this.materialController.nextMonth();
    } else {
      this.materialController.nextYear();
    }

    this.queueOverlayFocusSync(this.materialOutputs);
  }

  protected onMaterialDayCellClick(cell: Readonly<TngDateCell<Date>>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.materialController.handleCellClick(cell.date);
  }

  protected onBoundedDayCellClick(cell: Readonly<TngDateCell<Date>>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.boundedController.handleCellClick(cell.date);
  }

  protected onMaterialHeaderPeriodClick(): void {
    this.materialController.showYearsPanel();
    this.queueOverlayFocusSync(this.materialOutputs);
  }

  protected onMaterialInputBlur(): void {
    this.materialController.commitInputText();
  }

  protected onBoundedInputBlur(): void {
    this.boundedController.commitInputText();
  }

  protected onMaterialInputChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.materialController.setInputText(target.value);
  }

  protected onMaterialInputClick(): void {
    if (this.materialOutputs().open) {
      return;
    }

    this.materialController.open();
    this.queueOverlayFocusSync(this.materialOutputs);
  }

  protected onBoundedInputChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.boundedController.setInputText(target.value);
  }

  protected onBoundedInputClick(): void {
    if (this.boundedOutputs().open) {
      return;
    }

    this.boundedController.open();
    this.queueOverlayFocusSync(this.boundedOutputs);
  }

  protected onMaterialInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.materialOutputs().open) {
        this.materialController.open();
        this.queueOverlayFocusSync(this.materialOutputs);
        return;
      }

      this.materialController.commitInputText();
    }
  }

  protected onBoundedInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.boundedOutputs().open) {
        this.boundedController.open();
        this.queueOverlayFocusSync(this.boundedOutputs);
        return;
      }

      this.boundedController.commitInputText();
    }
  }

  protected onMaterialGridKeydown(event: KeyboardEvent): void {
    this.materialController.handleGridKeyDown(event);
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(this.materialOutputs);
    }
  }

  protected onBoundedGridKeydown(event: KeyboardEvent): void {
    this.boundedController.handleGridKeyDown(event);
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(this.boundedOutputs);
    }
  }

  protected onMaterialMonthKeydown(event: KeyboardEvent): void {
    this.materialController.handleMonthGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      this.materialController.showDaysPanel();
    }
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(this.materialOutputs);
    }
  }

  protected onBoundedMonthKeydown(event: KeyboardEvent): void {
    this.boundedController.handleMonthGridKeyDown(event);
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(this.boundedOutputs);
    }
  }

  protected onMaterialMonthOptionClick(option: Readonly<TngMonthOption<Date>>): void {
    if (option.disabled) {
      return;
    }

    this.materialController.selectMonth(option.index);
    this.materialController.showDaysPanel();
    this.queueOverlayFocusSync(this.materialOutputs);
  }

  protected onBoundedMonthOptionClick(option: Readonly<TngMonthOption<Date>>): void {
    if (option.disabled) {
      return;
    }

    this.boundedController.selectMonth(option.index);
    this.queueOverlayFocusSync(this.boundedOutputs);
  }

  protected onMaterialOverlayKeydown(event: KeyboardEvent): void {
    this.materialController.handleOverlayKeyDown(event);
  }

  protected onBoundedOverlayKeydown(event: KeyboardEvent): void {
    this.boundedController.handleOverlayKeyDown(event);
  }

  protected onMaterialTriggerClick(): void {
    const wasOpen = this.materialOutputs().open;
    this.materialController.toggleOpen();
    if (!wasOpen && this.materialOutputs().open) {
      this.queueOverlayFocusSync(this.materialOutputs);
    }
  }

  protected onBoundedTriggerClick(): void {
    const wasOpen = this.boundedOutputs().open;
    this.boundedController.toggleOpen();
    if (!wasOpen && this.boundedOutputs().open) {
      this.queueOverlayFocusSync(this.boundedOutputs);
    }
  }

  protected onMaterialTriggerKeydown(event: KeyboardEvent): void {
    const wasOpen = this.materialOutputs().open;
    this.materialController.handleTriggerKeyDown(event);
    if (!wasOpen && this.materialOutputs().open) {
      this.queueOverlayFocusSync(this.materialOutputs);
    }
  }

  protected onBoundedTriggerKeydown(event: KeyboardEvent): void {
    const wasOpen = this.boundedOutputs().open;
    this.boundedController.handleTriggerKeyDown(event);
    if (!wasOpen && this.boundedOutputs().open) {
      this.queueOverlayFocusSync(this.boundedOutputs);
    }
  }

  protected onMaterialYearKeydown(event: KeyboardEvent): void {
    this.materialController.handleYearGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      this.materialController.showMonthsPanel();
    }
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(this.materialOutputs);
    }
  }

  protected onBoundedYearKeydown(event: KeyboardEvent): void {
    this.boundedController.handleYearGridKeyDown(event);
    if (shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(this.boundedOutputs);
    }
  }

  protected onMaterialYearOptionClick(option: Readonly<TngYearOption<Date>>): void {
    if (option.disabled) {
      return;
    }

    this.materialController.selectYear(option.year);
    this.materialController.showMonthsPanel();
    this.queueOverlayFocusSync(this.materialOutputs);
  }

  protected onBoundedYearOptionClick(option: Readonly<TngYearOption<Date>>): void {
    if (option.disabled) {
      return;
    }

    this.boundedController.selectYear(option.year);
    this.queueOverlayFocusSync(this.boundedOutputs);
  }

  protected restoreMaterialToday(): void {
    this.materialController.selectDate(new Date(2024, 3, 18));
    this.materialController.showDaysPanel();
    this.queueOverlayFocusSync(this.materialOutputs);
  }

  protected onBoundedViewChange(view: TngCalendarView): void {
    this.boundedController.setView(view);
    this.queueOverlayFocusSync(this.boundedOutputs);
  }

  protected boundedPageBackward(): void {
    if (this.isBoundedYearView()) {
      this.boundedController.prevYear();
      this.queueOverlayFocusSync(this.boundedOutputs);
      return;
    }

    this.boundedController.prevMonth();
    this.queueOverlayFocusSync(this.boundedOutputs);
  }

  protected boundedPageForward(): void {
    if (this.isBoundedYearView()) {
      this.boundedController.nextYear();
      this.queueOverlayFocusSync(this.boundedOutputs);
      return;
    }

    this.boundedController.nextMonth();
    this.queueOverlayFocusSync(this.boundedOutputs);
  }

  protected restoreBoundedToday(): void {
    this.boundedController.selectDate(new Date(2024, 3, 18));
    this.queueOverlayFocusSync(this.boundedOutputs);
  }

  private queueOverlayFocusSync(outputsAccessor: () => TngDatepickerOutputs<Date> = this.outputs): void {
    queueMicrotask(() => {
      const focusActiveTarget = (): void => {
        const outputs = outputsAccessor();
        if (!outputs.open) {
          return;
        }

        const targetId = resolveCurrentFocusTargetId(outputs);
        if (targetId === null) {
          return;
        }

        const target = document.getElementById(targetId);
        if (!(target instanceof HTMLElement)) {
          return;
        }

        target.focus();
      };

      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
          focusActiveTarget();
        });
        return;
      }

      setTimeout(() => {
        focusActiveTarget();
      }, 0);
    });
  }

  private isPickerActivationKey(key: string): boolean {
    return key === 'Enter' || key === ' ';
  }
}
