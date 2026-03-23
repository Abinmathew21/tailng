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
  type TngCalendarView,
  type TngDateCell,
  type TngDateAdapter,
  type TngDatepickerController,
  TngDatepickerOverlay,
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

@Component({
  selector: 'app-datepicker-playground-page',
  imports: [TngDatepickerComponent, TngDatepickerOverlay, TngIcon],
  templateUrl: './datepicker-playground-page.component.html',
  styleUrl: './datepicker-playground-page.component.css',
})
export class DatepickerPlaygroundPageComponent implements OnDestroy {
  private readonly triggerRef = viewChild<ElementRef<HTMLElement>>('triggerButton');
  private readonly renderVersion = signal(0);
  private readonly boundedTriggerRef = viewChild<ElementRef<HTMLElement>>('boundedTriggerButton');
  private readonly boundedRenderVersion = signal(0);
  private readonly displayTriggerRef = viewChild<ElementRef<HTMLElement>>('displayTriggerButton');
  private readonly displayRenderVersion = signal(0);
  private readonly materialTriggerRef = viewChild<ElementRef<HTMLElement>>('materialTriggerButton');
  private readonly materialRenderVersion = signal(0);
  protected readonly wrapperFormatAdapter = wrapperFormatAdapter;

  protected readonly controller = createDatepickerController<Date>({
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

  protected readonly displayController = createDatepickerController<Date>({
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

  protected readonly outputs = computed(() => {
    this.renderVersion();
    return this.controller.getOutputs();
  });

  protected readonly displayOutputs = computed(() => {
    this.displayRenderVersion();
    return this.displayController.getOutputs();
  });

  protected readonly boundedOutputs = computed(() => {
    this.boundedRenderVersion();
    return this.boundedController.getOutputs();
  });

  protected readonly materialOutputs = computed(() => {
    this.materialRenderVersion();
    return this.materialController.getOutputs();
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

  protected readonly displaySelectedSummary = computed(() => {
    const value = this.displayOutputs().value;
    if (value === null || Array.isArray(value) || !(value instanceof Date)) {
      return 'No date selected yet';
    }

    return `${this.displayController.formatDate(value, 'month-year')} ${value.getDate()}`;
  });

  protected readonly displayActiveSummary = computed(() =>
    this.displayController.formatDate(this.displayOutputs().activeDate, 'month-year') +
    ` ${this.displayOutputs().activeDate.getDate()}`,
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

    this.displayController.subscribe(() => {
      this.displayRenderVersion.update((value) => value + 1);
    });

    this.boundedController.subscribe(() => {
      this.boundedRenderVersion.update((value) => value + 1);
    });

    this.materialController.subscribe(() => {
      this.materialRenderVersion.update((value) => value + 1);
    });

    effect(() => {
      const trigger = this.triggerRef()?.nativeElement ?? null;
      this.controller.registerTrigger(trigger);
    });

    effect(() => {
      const trigger = this.displayTriggerRef()?.nativeElement ?? null;
      this.displayController.registerTrigger(trigger);
    });

    effect(() => {
      const trigger = this.boundedTriggerRef()?.nativeElement ?? null;
      this.boundedController.registerTrigger(trigger);
    });

    effect(() => {
      const trigger = this.materialTriggerRef()?.nativeElement ?? null;
      this.materialController.registerTrigger(trigger);
    });
  }

  public ngOnDestroy(): void {
    this.controller.destroy();
    this.boundedController.destroy();
    this.displayController.destroy();
    this.materialController.destroy();
  }

  protected close(): void {
    this.closeFor(this.controller);
  }

  protected clear(): void {
    this.clearFor(this.controller, this.outputs);
  }

  protected commitInput(): void {
    this.commitInputFor(this.controller);
  }

  protected isDayView(): boolean {
    return this.isViewFor(this.outputs, 'day');
  }

  protected isMonthView(): boolean {
    return this.isViewFor(this.outputs, 'month');
  }

  protected isYearView(): boolean {
    return this.isViewFor(this.outputs, 'year');
  }

  protected onDayCellClick(cell: Readonly<TngDateCell<Date>>): void {
    this.onDayCellClickFor(this.controller, cell);
  }

  protected onInputBlur(): void {
    this.onInputBlurFor(this.controller);
  }

  protected onInputChange(event: Event): void {
    this.onInputChangeFor(this.controller, event);
  }

  protected onInputClick(): void {
    this.onInputClickFor(this.controller, this.outputs);
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    this.onInputKeydownFor(this.controller, this.outputs, event);
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    this.onGridKeydownFor(this.controller, this.outputs, event);
  }

  protected onMonthKeydown(event: KeyboardEvent): void {
    this.onMonthKeydownFor(this.controller, this.outputs, event);
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    this.onOverlayKeydownFor(this.controller, event);
  }

  protected onYearKeydown(event: KeyboardEvent): void {
    this.onYearKeydownFor(this.controller, this.outputs, event);
  }

  protected onMonthOptionClick(option: Readonly<TngMonthOption<Date>>): void {
    this.onMonthOptionClickFor(this.controller, this.outputs, option);
  }

  protected onTriggerClick(): void {
    this.onTriggerClickFor(this.controller);
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    this.onTriggerKeydownFor(this.controller, this.outputs, event);
  }

  protected onViewChange(view: TngCalendarView): void {
    this.onViewChangeFor(this.controller, this.outputs, view);
  }

  protected onYearOptionClick(option: Readonly<TngYearOption<Date>>): void {
    this.onYearOptionClickFor(this.controller, this.outputs, option);
  }

  protected pageBackward(): void {
    this.pageBackwardFor(this.controller, this.outputs, this.isYearView());
  }

  protected pageForward(): void {
    this.pageForwardFor(this.controller, this.outputs, this.isYearView());
  }

  protected restoreToday(): void {
    this.restoreTodayFor(this.controller, this.outputs);
  }

  protected closeDisplay(): void {
    this.closeFor(this.displayController);
  }

  protected closeBounded(): void {
    this.closeFor(this.boundedController);
  }

  protected clearDisplay(): void {
    this.clearFor(this.displayController, this.displayOutputs);
  }

  protected clearBounded(): void {
    this.clearFor(this.boundedController, this.boundedOutputs);
  }

  protected commitDisplayInput(): void {
    this.commitInputFor(this.displayController);
  }

  protected commitBoundedInput(): void {
    this.commitInputFor(this.boundedController);
  }

  protected isDisplayDayView(): boolean {
    return this.isViewFor(this.displayOutputs, 'day');
  }

  protected isBoundedDayView(): boolean {
    return this.isViewFor(this.boundedOutputs, 'day');
  }

  protected isDisplayMonthView(): boolean {
    return this.isViewFor(this.displayOutputs, 'month');
  }

  protected isBoundedMonthView(): boolean {
    return this.isViewFor(this.boundedOutputs, 'month');
  }

  protected isDisplayYearView(): boolean {
    return this.isViewFor(this.displayOutputs, 'year');
  }

  protected isBoundedYearView(): boolean {
    return this.isViewFor(this.boundedOutputs, 'year');
  }

  protected onDisplayDayCellClick(cell: Readonly<TngDateCell<Date>>): void {
    this.onDayCellClickFor(this.displayController, cell);
  }

  protected onBoundedDayCellClick(cell: Readonly<TngDateCell<Date>>): void {
    this.onDayCellClickFor(this.boundedController, cell);
  }

  protected onDisplayInputBlur(): void {
    this.onInputBlurFor(this.displayController);
  }

  protected onBoundedInputBlur(): void {
    this.onInputBlurFor(this.boundedController);
  }

  protected onDisplayInputChange(event: Event): void {
    this.onInputChangeFor(this.displayController, event);
  }

  protected onDisplayInputClick(): void {
    this.onInputClickFor(this.displayController, this.displayOutputs);
  }

  protected onBoundedInputChange(event: Event): void {
    this.onInputChangeFor(this.boundedController, event);
  }

  protected onBoundedInputClick(): void {
    this.onInputClickFor(this.boundedController, this.boundedOutputs);
  }

  protected onDisplayInputKeydown(event: KeyboardEvent): void {
    this.onInputKeydownFor(this.displayController, this.displayOutputs, event);
  }

  protected onBoundedInputKeydown(event: KeyboardEvent): void {
    this.onInputKeydownFor(this.boundedController, this.boundedOutputs, event);
  }

  protected onDisplayGridKeydown(event: KeyboardEvent): void {
    this.onGridKeydownFor(this.displayController, this.displayOutputs, event);
  }

  protected onBoundedGridKeydown(event: KeyboardEvent): void {
    this.onGridKeydownFor(this.boundedController, this.boundedOutputs, event);
  }

  protected onDisplayMonthKeydown(event: KeyboardEvent): void {
    this.onMonthKeydownFor(this.displayController, this.displayOutputs, event);
  }

  protected onBoundedMonthKeydown(event: KeyboardEvent): void {
    this.onMonthKeydownFor(this.boundedController, this.boundedOutputs, event);
  }

  protected onDisplayOverlayKeydown(event: KeyboardEvent): void {
    this.onOverlayKeydownFor(this.displayController, event);
  }

  protected onBoundedOverlayKeydown(event: KeyboardEvent): void {
    this.onOverlayKeydownFor(this.boundedController, event);
  }

  protected onDisplayYearKeydown(event: KeyboardEvent): void {
    this.onYearKeydownFor(this.displayController, this.displayOutputs, event);
  }

  protected onBoundedYearKeydown(event: KeyboardEvent): void {
    this.onYearKeydownFor(this.boundedController, this.boundedOutputs, event);
  }

  protected onDisplayMonthOptionClick(option: Readonly<TngMonthOption<Date>>): void {
    this.onMonthOptionClickFor(this.displayController, this.displayOutputs, option);
  }

  protected onBoundedMonthOptionClick(option: Readonly<TngMonthOption<Date>>): void {
    this.onMonthOptionClickFor(this.boundedController, this.boundedOutputs, option);
  }

  protected onDisplayTriggerClick(): void {
    this.onTriggerClickFor(this.displayController);
  }

  protected onBoundedTriggerClick(): void {
    this.onTriggerClickFor(this.boundedController);
  }

  protected onDisplayTriggerKeydown(event: KeyboardEvent): void {
    this.onTriggerKeydownFor(this.displayController, this.displayOutputs, event);
  }

  protected onBoundedTriggerKeydown(event: KeyboardEvent): void {
    this.onTriggerKeydownFor(this.boundedController, this.boundedOutputs, event);
  }

  protected onDisplayViewChange(view: TngCalendarView): void {
    this.onViewChangeFor(this.displayController, this.displayOutputs, view);
  }

  protected onBoundedViewChange(view: TngCalendarView): void {
    this.onViewChangeFor(this.boundedController, this.boundedOutputs, view);
  }

  protected onDisplayYearOptionClick(option: Readonly<TngYearOption<Date>>): void {
    this.onYearOptionClickFor(this.displayController, this.displayOutputs, option);
  }

  protected onBoundedYearOptionClick(option: Readonly<TngYearOption<Date>>): void {
    this.onYearOptionClickFor(this.boundedController, this.boundedOutputs, option);
  }

  protected displayPageBackward(): void {
    this.pageBackwardFor(this.displayController, this.displayOutputs, this.isDisplayYearView());
  }

  protected boundedPageBackward(): void {
    this.pageBackwardFor(this.boundedController, this.boundedOutputs, this.isBoundedYearView());
  }

  protected displayPageForward(): void {
    this.pageForwardFor(this.displayController, this.displayOutputs, this.isDisplayYearView());
  }

  protected boundedPageForward(): void {
    this.pageForwardFor(this.boundedController, this.boundedOutputs, this.isBoundedYearView());
  }

  protected restoreDisplayToday(): void {
    this.restoreTodayFor(this.displayController, this.displayOutputs);
  }

  protected restoreBoundedToday(): void {
    this.restoreTodayFor(this.boundedController, this.boundedOutputs);
  }

  protected closeMaterial(): void {
    this.materialController.close();
  }

  protected clearMaterial(): void {
    this.materialController.clear();
    this.materialController.showDaysPanel();
    this.queueOverlayFocusSync(this.materialOutputs);
  }

  protected isMaterialDayView(): boolean {
    return this.materialOutputs().view === 'day';
  }

  protected isMaterialMonthView(): boolean {
    return this.materialOutputs().view === 'month';
  }

  protected isMaterialYearView(): boolean {
    return this.materialOutputs().view === 'year';
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

  protected onMaterialHeaderPeriodClick(): void {
    this.materialController.showYearsPanel();
    this.queueOverlayFocusSync(this.materialOutputs);
  }

  protected onMaterialInputBlur(): void {
    this.materialController.commitInputText();
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

  protected onMaterialInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.materialOutputs().open) {
        this.materialController.open();
        this.queueOverlayFocusSync(this.materialOutputs);
        return;
      }

      this.materialController.commitInputText();
      return;
    }
  }

  protected onMaterialGridKeydown(event: KeyboardEvent): void {
    this.materialController.handleGridKeyDown(event);
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(this.materialOutputs);
    }
  }

  protected onMaterialMonthKeydown(event: KeyboardEvent): void {
    this.materialController.handleMonthGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      this.materialController.showDaysPanel();
    }
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(this.materialOutputs);
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

  protected onMaterialOverlayKeydown(event: KeyboardEvent): void {
    this.materialController.handleOverlayKeyDown(event);
  }

  protected onMaterialTriggerClick(): void {
    const wasOpen = this.materialOutputs().open;
    this.materialController.toggleOpen();
    if (!wasOpen && this.materialOutputs().open) {
      this.queueOverlayFocusSync(this.materialOutputs);
    }
  }

  protected onMaterialTriggerKeydown(event: KeyboardEvent): void {
    const wasOpen = this.materialOutputs().open;
    this.materialController.handleTriggerKeyDown(event);
    if (!wasOpen && this.materialOutputs().open) {
      this.queueOverlayFocusSync(this.materialOutputs);
    }
  }

  protected onMaterialYearKeydown(event: KeyboardEvent): void {
    this.materialController.handleYearGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      this.materialController.showMonthsPanel();
    }
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(this.materialOutputs);
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

  protected restoreMaterialToday(): void {
    this.materialController.selectDate(new Date(2024, 3, 18));
    this.materialController.showDaysPanel();
    this.queueOverlayFocusSync(this.materialOutputs);
  }

  private queueOverlayFocusSync(outputsAccessor: () => TngDatepickerOutputs<Date>): void {
    queueMicrotask(() => {
      const focusActiveTarget = (): void => {
        const outputs = outputsAccessor();
        if (!outputs.open) {
          return;
        }

        const targetId = this.resolveCurrentFocusTargetId(outputs);
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

  private closeFor(controller: TngDatepickerController<Date>): void {
    controller.close();
  }

  private clearFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
  ): void {
    controller.clear();
    this.queueOverlayFocusSync(outputsAccessor);
  }

  private commitInputFor(controller: TngDatepickerController<Date>): void {
    controller.commitInputText();
  }

  private isViewFor(
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    view: TngCalendarView,
  ): boolean {
    return outputsAccessor().view === view;
  }

  private onDayCellClickFor(controller: TngDatepickerController<Date>, cell: Readonly<TngDateCell<Date>>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    controller.handleCellClick(cell.date);
  }

  private onInputBlurFor(controller: TngDatepickerController<Date>): void {
    controller.commitInputText();
  }

  private onInputChangeFor(controller: TngDatepickerController<Date>, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    controller.setInputText(target.value);
  }

  private onInputClickFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
  ): void {
    if (outputsAccessor().open) {
      return;
    }

    controller.open();
    this.queueOverlayFocusSync(outputsAccessor);
  }

  private onInputKeydownFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    event: KeyboardEvent,
  ): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!outputsAccessor().open) {
        controller.open();
        this.queueOverlayFocusSync(outputsAccessor);
        return;
      }

      controller.commitInputText();
    }
  }

  private onGridKeydownFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    event: KeyboardEvent,
  ): void {
    controller.handleGridKeyDown(event);
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(outputsAccessor);
    }
  }

  private onMonthKeydownFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    event: KeyboardEvent,
  ): void {
    controller.handleMonthGridKeyDown(event);
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(outputsAccessor);
    }
  }

  private onOverlayKeydownFor(controller: TngDatepickerController<Date>, event: KeyboardEvent): void {
    controller.handleOverlayKeyDown(event);
  }

  private onYearKeydownFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    event: KeyboardEvent,
  ): void {
    controller.handleYearGridKeyDown(event);
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync(outputsAccessor);
    }
  }

  private onMonthOptionClickFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    option: Readonly<TngMonthOption<Date>>,
  ): void {
    if (option.disabled) {
      return;
    }

    controller.selectMonth(option.index);
    this.queueOverlayFocusSync(outputsAccessor);
  }

  private onTriggerClickFor(controller: TngDatepickerController<Date>): void {
    const wasOpen = controller.getOutputs().open;
    controller.toggleOpen();
    if (!wasOpen && controller.getOutputs().open) {
      this.queueOverlayFocusSync(() => controller.getOutputs());
    }
  }

  private onTriggerKeydownFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    event: KeyboardEvent,
  ): void {
    const wasOpen = outputsAccessor().open;
    controller.handleTriggerKeyDown(event);
    if (!wasOpen && outputsAccessor().open) {
      this.queueOverlayFocusSync(outputsAccessor);
    }
  }

  private onViewChangeFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    view: TngCalendarView,
  ): void {
    controller.setView(view);
    this.queueOverlayFocusSync(outputsAccessor);
  }

  private onYearOptionClickFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    option: Readonly<TngYearOption<Date>>,
  ): void {
    if (option.disabled) {
      return;
    }

    controller.selectYear(option.year);
    this.queueOverlayFocusSync(outputsAccessor);
  }

  private pageBackwardFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    yearView: boolean,
  ): void {
    if (yearView) {
      controller.prevYear();
      this.queueOverlayFocusSync(outputsAccessor);
      return;
    }

    controller.prevMonth();
    this.queueOverlayFocusSync(outputsAccessor);
  }

  private pageForwardFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
    yearView: boolean,
  ): void {
    if (yearView) {
      controller.nextYear();
      this.queueOverlayFocusSync(outputsAccessor);
      return;
    }

    controller.nextMonth();
    this.queueOverlayFocusSync(outputsAccessor);
  }

  private restoreTodayFor(
    controller: TngDatepickerController<Date>,
    outputsAccessor: () => TngDatepickerOutputs<Date>,
  ): void {
    controller.selectDate(new Date(2024, 3, 18));
    this.queueOverlayFocusSync(outputsAccessor);
  }

  private resolveCurrentFocusTargetId(outputs: TngDatepickerOutputs<Date>): string | null {
    if (outputs.view === 'day') {
      const gridAttributes = outputs.getGridAttributes();
      if (gridAttributes['aria-activedescendant'] !== undefined) {
        return gridAttributes.id ?? null;
      }

      return outputs.cells.find((cell) => cell.active)?.id ?? null;
    }

    if (outputs.view === 'month') {
      return outputs.monthOptions.find((option) => option.active)?.id ?? null;
    }

    if (outputs.view === 'year') {
      return outputs.yearOptions.find((option) => option.active)?.id ?? null;
    }

    return null;
  }

  private shouldSyncOverlayFocusAfterPickerKey(key: string): boolean {
    return (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End' ||
      key === 'PageUp' ||
      key === 'PageDown' ||
      key === 'Enter' ||
      key === ' ' ||
      key === 'Escape'
    );
  }

  private isPickerActivationKey(key: string): boolean {
    return key === 'Enter' || key === ' ';
  }
}
