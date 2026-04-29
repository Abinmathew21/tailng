import { Component, computed, input, output, signal, viewChild } from '@angular/core';
import {
  defaultDatepickerDateAdapter,
  type TngDateAdapter,
} from '@tailng-ui/primitives';
import { TngDatepickerComponent } from '../datepicker/tng-datepicker.component';

function currentYear(): number {
  return new Date().getFullYear();
}

function normalizeYear(value: number | string): number {
  return Math.trunc(typeof value === 'number' ? value : Number(value));
}

function normalizeMonth(value: number | string): number {
  return Math.max(0, Math.min(11, Math.trunc(typeof value === 'number' ? value : Number(value))));
}

function normalizeDay(value: number | string): number {
  return Math.max(1, Math.min(31, Math.trunc(typeof value === 'number' ? value : Number(value))));
}

function createFixedYearDate(year: number, month: number, day: number): Date {
  return defaultDatepickerDateAdapter.createDate(year, month, day);
}

function createYearAdapter(month: number, day: number): TngDateAdapter<Date> {
  return {
    ...defaultDatepickerDateAdapter,
    format: (date, format, locale) => {
      if (format === 'input') {
        return String(defaultDatepickerDateAdapter.getYear(date));
      }

      return defaultDatepickerDateAdapter.format(date, format, locale);
    },
    parse: (text, locale) => {
      const trimmed = text.trim();
      if (/^\d{4}$/.test(trimmed)) {
        return createFixedYearDate(Number(trimmed), month, day);
      }

      return defaultDatepickerDateAdapter.parse(text, locale);
    },
  };
}

@Component({
  selector: 'tng-yearpicker',
  imports: [TngDatepickerComponent],
  template: `
    <tng-datepicker
      #datepicker
      [adapter]="adapter()"
      [allowManualInput]="allowManualInput()"
      [autoCommitView]="false"
      [defaultOpen]="defaultOpen()"
      [disabled]="disabled()"
      [fullWidth]="fullWidth()"
      [maxDate]="maxDate()"
      [minDate]="minDate()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [restoreFocus]="restoreFocus()"
      [value]="selectedDate()"
      [yearPageSize]="yearPageSize()"
      (openChange)="handleOpenChange($event)"
      (viewChange)="handleViewChange($event)"
      (yearChange)="handleYearChange($event)"
    />
  `,
})
export class TngYearpickerComponent {
  private readonly datepicker = viewChild<TngDatepickerComponent<Date>>('datepicker');
  private readonly internalYear = signal<number | undefined>(undefined);
  private pendingYear: number | null = null;

  public readonly value = input<number | undefined, number | string | undefined>(undefined, {
    transform: (value) => (value === undefined ? undefined : normalizeYear(value)),
  });
  public readonly defaultValue = input<number, number | string>(currentYear(), {
    transform: normalizeYear,
  });
  public readonly fixedMonth = input<number, number | string>(0, {
    transform: normalizeMonth,
  });
  public readonly fixedDay = input<number, number | string>(1, {
    transform: normalizeDay,
  });
  public readonly minYear = input<number | undefined, number | string | undefined>(undefined, {
    transform: (value) => (value === undefined ? undefined : normalizeYear(value)),
  });
  public readonly maxYear = input<number | undefined, number | string | undefined>(undefined, {
    transform: (value) => (value === undefined ? undefined : normalizeYear(value)),
  });
  public readonly allowManualInput = input<boolean>(true);
  public readonly defaultOpen = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly fullWidth = input<boolean>(true);
  public readonly placeholder = input<string>('YYYY');
  public readonly readonly = input<boolean>(false);
  public readonly restoreFocus = input<boolean>(true);
  public readonly yearPageSize = input<number, number | string>(24, {
    transform: (value) => Math.max(4, Math.trunc(typeof value === 'number' ? value : Number(value))),
  });

  public readonly valueChange = output<number>();
  public readonly openChange = output<boolean>();

  protected readonly selectedYear = computed(() => this.value() ?? this.internalYear() ?? this.defaultValue());
  protected readonly selectedDate = computed(() =>
    createFixedYearDate(this.selectedYear(), this.fixedMonth(), this.fixedDay()),
  );
  protected readonly minDate = computed(() => {
    const year = this.minYear();
    return year === undefined ? undefined : createFixedYearDate(year, this.fixedMonth(), this.fixedDay());
  });
  protected readonly maxDate = computed(() => {
    const year = this.maxYear();
    return year === undefined ? undefined : createFixedYearDate(year, this.fixedMonth(), this.fixedDay());
  });
  protected readonly adapter = computed(() => createYearAdapter(this.fixedMonth(), this.fixedDay()));

  protected handleOpenChange(open: boolean): void {
    this.openChange.emit(open);
    if (!open) {
      this.pendingYear = null;
      return;
    }

    queueMicrotask(() => {
      this.datepicker()?.showYearsPanel();
    });
  }

  protected handleYearChange(year: number): void {
    this.pendingYear = year;
  }

  protected handleViewChange(view: string): void {
    if (view !== 'month' || this.pendingYear === null) {
      return;
    }

    const nextYear = this.pendingYear;
    this.pendingYear = null;
    this.internalYear.set(nextYear);
    this.valueChange.emit(nextYear);
    this.datepicker()?.close();
  }

}
