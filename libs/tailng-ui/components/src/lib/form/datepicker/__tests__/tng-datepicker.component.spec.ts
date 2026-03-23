import { Component, LOCALE_ID, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { defaultDatepickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TngDatepickerComponent } from '../tng-datepicker.component';

function keydown(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  target.dispatchEvent(event);
  return event;
}

async function settle(fixture: { detectChanges(): void; whenStable(): Promise<unknown> }): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

async function waitForAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function getRequired<T extends Element>(fixture: { nativeElement: HTMLElement }, selector: string): T {
  const element = fixture.nativeElement.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element;
}

function getRequiredFromRoot<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element;
}

function createRect(top: number, bottom: number): DOMRect {
  return {
    x: 0,
    y: top,
    width: 240,
    height: bottom - top,
    top,
    right: 240,
    bottom,
    left: 0,
    toJSON: () => ({}),
  } as DOMRect;
}

const customFormatAdapter: TngDateAdapter<Date> = Object.freeze({
  ...defaultDatepickerDateAdapter,
  format: (date, format, locale) => {
    if (format === 'input') {
      const day = defaultDatepickerDateAdapter.getDate(date).toString().padStart(2, '0');
      const month = (defaultDatepickerDateAdapter.getMonth(date) + 1).toString().padStart(2, '0');
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${day}.${month}.${year}`;
    }

    if (format === 'month-year') {
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      const month = defaultDatepickerDateAdapter.format(date, 'month-short', locale).toUpperCase();
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

type FixtureLike = {
  detectChanges(): void;
  nativeElement: HTMLElement;
  whenStable(): Promise<unknown>;
};

async function openOverlay(fixture: FixtureLike): Promise<void> {
  getRequired<HTMLButtonElement>(fixture, '[data-slot="datepicker-trigger"]').click();
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);
}

async function selectOverlayDay(fixture: FixtureLike, dayLabel: string): Promise<void> {
  await openOverlay(fixture);

  const target = Array.from(document.body.querySelectorAll('[data-slot="datepicker-cell"]')).find(
    (element) =>
      (element as HTMLButtonElement).disabled === false &&
      (element as HTMLElement).textContent?.trim() === dayLabel,
  ) as HTMLButtonElement | undefined;

  if (target === undefined) {
    throw new Error(`Expected day cell ${dayLabel} to exist.`);
  }

  target.click();
  await settle(fixture);
}

function getSelectedDayCell(): HTMLButtonElement {
  return getRequiredFromRoot<HTMLButtonElement>(document.body, '[data-slot="datepicker-cell"][data-selected="true"]');
}

async function expectInputCommitReopensSelectedDate(
  hostComponent: Type<unknown>,
  initialInputValue: string,
  nextInputValue: string,
  expectedHeader: string,
  expectedDayLabel: string,
): Promise<void> {
  const fixture = TestBed.configureTestingModule({
    imports: [hostComponent],
  }).createComponent(hostComponent);

  await settle(fixture);
  await selectOverlayDay(fixture, '24');

  const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
  expect(input.value).toBe(initialInputValue);

  input.value = nextInputValue;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await settle(fixture);

  keydown(input, 'Enter');
  await settle(fixture);
  expect(input.value).toBe(nextInputValue);

  await openOverlay(fixture);

  expect(
    getRequiredFromRoot<HTMLButtonElement>(document.body, '[data-slot="datepicker-period-button"]').textContent?.includes(expectedHeader),
  ).toBe(true);
  expect(getSelectedDayCell().textContent?.trim()).toBe(expectedDayLabel);
}

@Component({
  imports: [TngDatepickerComponent],
  template: `
    <tng-datepicker
      [defaultValue]="defaultValue()"
      [defaultOpen]="defaultOpen()"
      [minDate]="minDate()"
      [maxDate]="maxDate()"
      [placement]="placement()"
      (openChange)="openChanges.push($event)"
      (valueChange)="valueChanges.push($event)"
    />
  `,
})
class UncontrolledDatepickerHostComponent {
  public readonly defaultOpen = signal(false);
  public readonly defaultValue = signal('2024-04-22');
  public readonly minDate = signal<string | null>(null);
  public readonly maxDate = signal<string | null>(null);
  public readonly placement = signal<'auto' | 'bottom' | 'top'>('auto');
  public readonly openChanges: boolean[] = [];
  public readonly valueChanges: unknown[] = [];
}

@Component({
  imports: [TngDatepickerComponent],
  template: `
    <tng-datepicker
      [adapter]="adapter"
      [defaultValue]="defaultValue()"
      [defaultOpen]="defaultOpen()"
      [minDate]="minDate()"
      [maxDate]="maxDate()"
      [placement]="placement()"
      (openChange)="openChanges.push($event)"
      (valueChange)="valueChanges.push($event)"
    />
  `,
})
class CustomFormatDatepickerHostComponent {
  public readonly adapter = customFormatAdapter;
  public readonly defaultOpen = signal(false);
  public readonly defaultValue = signal('2024-04-22');
  public readonly minDate = signal<string | null>(null);
  public readonly maxDate = signal<string | null>(null);
  public readonly placement = signal<'auto' | 'bottom' | 'top'>('auto');
  public readonly openChanges: boolean[] = [];
  public readonly valueChanges: unknown[] = [];
}

describe('tng-datepicker component behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('exports the datepicker component', () => {
    expect(typeof TngDatepickerComponent).toBe('function');
  });

  it('renders the default value in the editable input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
    expect(input.value).toBe('04-22-2024');
  });

  it('opens the overlay from the trigger and emits openChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    getRequired<HTMLButtonElement>(fixture, '[data-slot="datepicker-trigger"]').click();
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    const overlay = getRequiredFromRoot<HTMLElement>(document.body, '[data-slot="datepicker-overlay"]');
    expect(overlay.parentNode).toBe(document.body);
    expect(overlay.style.position).toBe('fixed');
    expect((document.activeElement as HTMLElement | null)?.getAttribute('data-slot')).toBe('datepicker-cell');
  });

  it('commits manual input with Enter and emits valueChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
    input.value = '04-24-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    keydown(input, 'Enter');
    await settle(fixture);

    const lastValue = fixture.componentInstance.valueChanges.at(-1);
    expect(lastValue).toBeInstanceOf(Date);
    expect((lastValue as Date).getFullYear()).toBe(2024);
    expect((lastValue as Date).getMonth()).toBe(3);
    expect((lastValue as Date).getDate()).toBe(24);
    expect(input.value).toBe('04-24-2024');
  });

  it('reopens with the year typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      UncontrolledDatepickerHostComponent,
      '04-24-2024',
      '04-24-2025',
      defaultDatepickerDateAdapter.format(new Date(2025, 3, 24), 'month-year', 'en-US'),
      '24',
    );
  });

  it('reopens with the month typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      UncontrolledDatepickerHostComponent,
      '04-24-2024',
      '09-24-2024',
      defaultDatepickerDateAdapter.format(new Date(2024, 8, 24), 'month-year', 'en-US'),
      '24',
    );
  });

  it('reopens with the day typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      UncontrolledDatepickerHostComponent,
      '04-24-2024',
      '04-12-2024',
      defaultDatepickerDateAdapter.format(new Date(2024, 3, 12), 'month-year', 'en-US'),
      '12',
    );
  });

  it('reopens with the custom-format year typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      CustomFormatDatepickerHostComponent,
      '24.04.2024',
      '24.04.2025',
      customFormatAdapter.format(new Date(2025, 3, 24), 'month-year', 'en-US'),
      '24',
    );
  });

  it('reopens with the custom-format month typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      CustomFormatDatepickerHostComponent,
      '24.04.2024',
      '24.09.2024',
      customFormatAdapter.format(new Date(2024, 8, 24), 'month-year', 'en-US'),
      '24',
    );
  });

  it('reopens with the custom-format day typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedDate(
      CustomFormatDatepickerHostComponent,
      '24.04.2024',
      '12.04.2024',
      customFormatAdapter.format(new Date(2024, 3, 12), 'month-year', 'en-US'),
      '12',
    );
  });

  it('keeps the last valid selection and marks the custom-format input invalid when the typed date exceeds maxDate', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CustomFormatDatepickerHostComponent],
    }).createComponent(CustomFormatDatepickerHostComponent);
    fixture.componentInstance.maxDate.set('2026-03-31');

    await settle(fixture);
    await selectOverlayDay(fixture, '24');

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="datepicker-input"]');
    input.value = '22.04.2027';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    keydown(input, 'Enter');
    await settle(fixture);

    expect(getRequired<HTMLElement>(fixture, '[data-slot="datepicker-input-shell"]').getAttribute('data-invalid')).toBe('true');

    await openOverlay(fixture);

    expect(
      getRequiredFromRoot<HTMLButtonElement>(document.body, '[data-slot="datepicker-period-button"]').textContent?.includes(
        customFormatAdapter.format(new Date(2024, 3, 24), 'month-year', 'en-US'),
      ),
    ).toBe(true);
    expect(getSelectedDayCell().textContent?.trim()).toBe('24');
  });

  it('opens the year panel from the period button and drills down to months then days', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    getRequiredFromRoot<HTMLButtonElement>(document.body, '[data-slot="datepicker-period-button"]').click();
    await settle(fixture);

    expect(document.body.querySelectorAll('[data-slot="datepicker-year"]').length).toBeGreaterThan(0);

    const yearButton = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-year"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === '2024') as HTMLButtonElement | undefined;
    yearButton?.click();
    await settle(fixture);

    expect(document.body.querySelectorAll('[data-slot="datepicker-month"]').length).toBeGreaterThan(0);

    const monthButton = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-month"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === 'Apr') as HTMLButtonElement | undefined;
    monthButton?.click();
    await settle(fixture);

    expect(document.body.querySelectorAll('[data-slot="datepicker-cell"]').length).toBeGreaterThan(0);
  });

  it('omits footer actions in the default wrapper overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    expect(document.body.querySelector('[data-slot="datepicker-footer"]')).toBeNull();
    expect(
      Array.from(document.body.querySelectorAll('button')).some(
        (button) => ['Today', 'Clear', 'Done'].includes((button).textContent?.trim() ?? ''),
      ),
    ).toBe(false);
  });

  it('disables out-of-range months after entering the month panel through material flow', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);
    fixture.componentInstance.defaultValue.set('2026-02-23');
    fixture.componentInstance.minDate.set('2024-04-01');
    fixture.componentInstance.maxDate.set('2026-03-31');

    await settle(fixture);

    getRequiredFromRoot<HTMLButtonElement>(document.body, '[data-slot="datepicker-period-button"]').click();
    await settle(fixture);

    const yearButton = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-year"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === '2026') as HTMLButtonElement | undefined;
    yearButton?.click();
    await settle(fixture);

    const monthButtons = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-month"]'),
    );
    const march = monthButtons.find((button) => button.textContent?.trim() === 'Mar');
    const april = monthButtons.find((button) => button.textContent?.trim() === 'Apr');

    expect(march?.disabled).toBe(false);
    expect(april?.disabled).toBe(true);
  });

  it('uses Angular LOCALE_ID for month labels when no locale input is provided', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    const expectedHeader = defaultDatepickerDateAdapter.format(new Date(2024, 3, 22), 'month-year', 'fr-FR');
    expect(
      getRequiredFromRoot<HTMLButtonElement>(document.body, '[data-slot="datepicker-period-button"]').textContent?.includes(expectedHeader),
    ).toBe(true);

    getRequiredFromRoot<HTMLButtonElement>(document.body, '[data-slot="datepicker-period-button"]').click();
    await settle(fixture);

    const yearButton = Array.from(
      document.body.querySelectorAll('[data-slot="datepicker-year"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === '2024') as HTMLButtonElement | undefined;
    yearButton?.click();
    await settle(fixture);

    const expectedApril = defaultDatepickerDateAdapter.format(new Date(2024, 3, 1), 'month-short', 'fr-FR');
    expect(
      Array.from(document.body.querySelectorAll('[data-slot="datepicker-month"]')).some(
        (element) => (element as HTMLElement).textContent?.trim() === expectedApril,
      ),
    ).toBe(true);
  });

  it('flips the overlay above the trigger when auto placement has more space above', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDatepickerHostComponent],
    }).createComponent(UncontrolledDatepickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    const anchor = getRequired<HTMLElement>(fixture, '[data-slot="datepicker-input-shell"]');
    const overlay = getRequiredFromRoot<HTMLElement>(document.body, '[data-slot="datepicker-overlay"]');
    const originalInnerHeight = window.innerHeight;

    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(createRect(700, 740));
    vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue(createRect(0, 320));
    Object.defineProperty(overlay, 'scrollHeight', { configurable: true, value: 320 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 760 });

    window.dispatchEvent(new Event('resize'));
    await waitForAnimationFrame();
    await settle(fixture);

    expect(overlay.getAttribute('data-placement')).toBe('top');
    expect(overlay.style.maxHeight).not.toBe('');

    Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight });
  });
});
