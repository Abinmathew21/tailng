import { vi } from 'vitest';
import {
  createDatepickerController,
  defaultDatepickerDateAdapter,
  type TngDateAdapter,
  type TngDatepickerConfig,
  type TngDatepickerController,
  type TngDatepickerEvent,
} from '../tng-datepicker';

export function d(value: string): Date {
  const parsed = defaultDatepickerDateAdapter.parse(value, 'en-US');
  if (parsed === null) {
    throw new Error(`Unable to parse date: ${value}`);
  }
  return parsed;
}

export function dateKey(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createController(
  config: Partial<TngDatepickerConfig<Date>> = {},
): TngDatepickerController<Date> {
  return createDatepickerController<Date>({
    closeOnSelect: false,
    locale: 'en-US',
    showOutsideDays: true,
    today: d('2024-04-18'),
    ...config,
  });
}

export function collectEvents(controller: TngDatepickerController<Date>): readonly TngDatepickerEvent<Date>[] {
  const events: TngDatepickerEvent<Date>[] = [];
  controller.subscribe((event) => {
    events.push(event);
  });
  return events;
}

export function keyboardEvent(
  key: string,
  overrides: Partial<Readonly<{
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
  }>> = {},
): Readonly<{
  altKey: boolean;
  ctrlKey: boolean;
  key: string;
  metaKey: boolean;
  preventDefault: ReturnType<typeof vi.fn>;
  shiftKey: boolean;
}> {
  return {
    altKey: overrides.altKey ?? false,
    ctrlKey: overrides.ctrlKey ?? false,
    key,
    metaKey: overrides.metaKey ?? false,
    preventDefault: vi.fn(),
    shiftKey: overrides.shiftKey ?? false,
  };
}

export function appendFocusable(tagName = 'button'): HTMLElement {
  const element = document.createElement(tagName);
  element.tabIndex = 0;
  document.body.appendChild(element);
  return element;
}

export function cleanupDom(): void {
  document.body.innerHTML = '';
}

export function createCalendarSystemAdapter(): TngDateAdapter<Date> {
  return Object.freeze({
    ...defaultDatepickerDateAdapter,
    format: (date, format, locale) => {
      if (format === 'year-label') {
        return String(defaultDatepickerDateAdapter.getYear(date) + 543);
      }
      return defaultDatepickerDateAdapter.format(date, format, locale);
    },
  });
}

export function createSlashInputAdapter(): TngDateAdapter<Date> {
  return Object.freeze({
    ...defaultDatepickerDateAdapter,
    format: (date, format, locale) => {
      if (format === 'input') {
        const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
        const month = (defaultDatepickerDateAdapter.getMonth(date) + 1).toString().padStart(2, '0');
        const day = defaultDatepickerDateAdapter.getDate(date).toString().padStart(2, '0');
        return `${year}/${month}/${day}`;
      }

      return defaultDatepickerDateAdapter.format(date, format, locale);
    },
    parse: (text, locale) => {
      const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(text.trim());
      if (match !== null) {
        const year = Number(match[1]);
        const month = Number(match[2]) - 1;
        const day = Number(match[3]);
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
}

export function createOverlayMonthYearAdapter(): TngDateAdapter<Date> {
  return Object.freeze({
    ...defaultDatepickerDateAdapter,
    format: (date, format, locale) => {
      if (format === 'month-year') {
        const month = (defaultDatepickerDateAdapter.getMonth(date) + 1).toString().padStart(2, '0');
        const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
        return `${month}/${year}`;
      }

      return defaultDatepickerDateAdapter.format(date, format, locale);
    },
  });
}
