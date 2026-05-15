import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createOverlayRuntime, type TngOverlayRuntime } from '@tailng-ui/cdk';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  TngDateRangePickerComponent,
  type TngDateRangePickerSelectionInput,
  type TngDateRangePickerValue,
} from '../tng-date-range-picker.component';

function keydown(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  target.dispatchEvent(event);
  return event;
}

async function settle(fixture: {
  detectChanges(): void;
  whenStable(): Promise<unknown>;
}): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

async function waitForAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function getRequired<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  selector: string,
): T {
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
    width: 320,
    height: bottom - top,
    top,
    right: 320,
    bottom,
    left: 0,
    toJSON: () => ({}),
  } as DOMRect;
}

function dateKey(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

type FixtureLike = {
  detectChanges(): void;
  nativeElement: HTMLElement;
  whenStable(): Promise<unknown>;
};

async function openOverlay(fixture: FixtureLike): Promise<void> {
  getRequired<HTMLButtonElement>(fixture, '[data-slot="date-range-picker-trigger"]').click();
  await settle(fixture);
  await waitForAnimationFrame();
  await settle(fixture);
}

function getDayButton(root: ParentNode, dayLabel: string): HTMLButtonElement {
  const target = Array.from(root.querySelectorAll('[data-slot="date-range-picker-cell"]')).find(
    (element) =>
      (element as HTMLButtonElement).disabled === false &&
      (element as HTMLElement).textContent?.trim() === dayLabel,
  ) as HTMLButtonElement | undefined;

  if (target === undefined) {
    throw new Error(`Expected day cell ${dayLabel} to exist.`);
  }

  return target;
}

function expectRangeValue(value: unknown, start: string, end: string | null): void {
  const range = value as TngDateRangePickerValue<Date>;
  expect(range).not.toBeNull();
  if (range === null) {
    return;
  }

  expect(range.start).toBeInstanceOf(Date);
  expect(range.start === null ? null : dateKey(range.start)).toBe(start);
  if (end === null) {
    expect(range.end).toBeNull();
    return;
  }

  expect(range.end).toBeInstanceOf(Date);
  expect(range.end === null ? null : dateKey(range.end)).toBe(end);
}

async function expectInputCommitReopensSelectedRange(
  hostComponent: Type<unknown>,
  nextInputValue: string,
  expectedHeader: string,
  expectedStartLabel: string,
  expectedEndLabel: string | null,
): Promise<void> {
  const fixture = TestBed.configureTestingModule({
    imports: [hostComponent],
  }).createComponent(hostComponent);

  await settle(fixture);

  const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
  input.value = nextInputValue;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await settle(fixture);

  keydown(input, 'Enter');
  await settle(fixture);
  expect(input.value).toBe(nextInputValue);

  await openOverlay(fixture);

  expect(
    getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="date-range-picker-period-button"]',
    ).textContent?.includes(expectedHeader),
  ).toBe(true);
  expect(getDayButton(document.body, expectedStartLabel).getAttribute('data-range-start')).toBe(
    'true',
  );
  if (expectedEndLabel !== null) {
    expect(getDayButton(document.body, expectedEndLabel).getAttribute('data-range-end')).toBe(
      'true',
    );
  }
}

@Component({
  imports: [TngDateRangePickerComponent],
  template: `
    <tng-date-range-picker
      [closeOnSelect]="closeOnSelect()"
      [defaultValue]="defaultValue()"
      [defaultOpen]="defaultOpen()"
      [minDate]="minDate()"
      [maxDate]="maxDate()"
      [placement]="placement()"
      [today]="today()"
      (openChange)="openChanges.push($event)"
      (previewEndDateChange)="previewChanges.push($event)"
      (valueChange)="valueChanges.push($event)"
    />
  `,
})
class UncontrolledDateRangePickerHostComponent {
  public readonly closeOnSelect = signal(true);
  public readonly defaultOpen = signal(false);
  public readonly defaultValue = signal<TngDateRangePickerSelectionInput<Date> | undefined>({
    start: '2024-04-22',
    end: '2024-04-24',
  });
  public readonly minDate = signal<string | null>(null);
  public readonly maxDate = signal<string | null>(null);
  public readonly placement = signal<'auto' | 'bottom' | 'top'>('auto');
  public readonly today = signal('2024-04-18');
  public readonly openChanges: boolean[] = [];
  public readonly previewChanges: Date[] = [];
  public readonly valueChanges: unknown[] = [];
}

@Component({
  imports: [TngDateRangePickerComponent],
  template: `
    <tng-date-range-picker
      aria-label="Styled Date Range Picker"
      style="
        --tng-date-range-picker-surface: #f8fafc;
        --tng-date-range-picker-border: #d8e2ef;
        --tng-date-range-picker-fg: #0f172a;
        --tng-date-range-picker-brand: #2563eb;
        --tng-date-range-picker-nav-size: 2.8rem;
        --tng-semantic-background-surface: #f8fafc;
        --tng-semantic-border-subtle: #d8e2ef;
        --tng-semantic-foreground-primary: #0f172a;
        --tng-semantic-accent-brand: #2563eb;
        --tng-date-range-picker-z-overlay: 2;
        color-scheme: light;
      "
    />
  `,
})
class StyledDateRangePickerHostComponent {}

@Component({
  imports: [TngDateRangePickerComponent],
  template: `
    <tng-date-range-picker
      aria-label="Runtime Date Range Picker"
      [overlayRuntime]="overlayRuntime()"
    />
  `,
})
class CustomRuntimeDateRangePickerHostComponent {
  public readonly overlayRuntime = signal<TngOverlayRuntime | null>(
    createOverlayRuntime({ documentRef: document }),
  );
}

describe('tng-date-range-picker component behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
    document.body.querySelectorAll('[data-slot="date-range-picker-overlay"]').forEach((element) => {
      element.remove();
    });
  });

  it('exports the date range picker component', () => {
    expect(typeof TngDateRangePickerComponent).toBe('function');
  });

  it('renders the default range value in the editable input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
    expect(input.value).toBe('04-22-2024 – 04-24-2024');
  });

  it('keeps the overlay hidden by default until the trigger opens it', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);

    await settle(fixture);

    const overlay = getRequired<HTMLElement>(fixture, '[data-slot="date-range-picker-overlay"]');
    expect(overlay.getAttribute('hidden')).toBe('');
    expect(overlay.style.display).toBe('none');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('opens the overlay from the trigger and emits openChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);

    await settle(fixture);
    await openOverlay(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    const overlay = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="date-range-picker-overlay"]',
    );
    expect(overlay.parentNode).toBe(document.body);
    expect(overlay.style.position).toBe('fixed');
    expect(overlay.style.zIndex).toBe(
      'var(--tng-date-range-picker-z-overlay, var(--tng-z-overlay, 1000))',
    );
    expect((document.activeElement as HTMLElement | null)?.getAttribute('data-slot')).toBe(
      'date-range-picker-cell',
    );
  });

  it('keeps host-scoped theme vars on the portalled overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StyledDateRangePickerHostComponent],
    }).createComponent(StyledDateRangePickerHostComponent);

    await settle(fixture);
    await openOverlay(fixture);

    const overlay = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="date-range-picker-overlay"]',
    );
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-surface').trim()).toBe(
      '#f8fafc',
    );
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-border').trim()).toBe('#d8e2ef');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-fg').trim()).toBe('#0f172a');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-brand').trim()).toBe('#2563eb');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-nav-size').trim()).toBe(
      '2.8rem',
    );
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-z-overlay').trim()).toBe('2');
    expect(overlay.style.colorScheme).toBe('light');

    getRequired<HTMLButtonElement>(fixture, '[data-slot="date-range-picker-trigger"]').click();
    await settle(fixture);

    expect(overlay.style.getPropertyValue('--tng-date-range-picker-surface').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-nav-size').trim()).toBe('');
    expect(overlay.style.getPropertyValue('--tng-date-range-picker-z-overlay').trim()).toBe('');
    expect(overlay.style.zIndex).toBe('');
    expect(overlay.style.colorScheme).toBe('');
  });

  it('registers overlay layers on a provided overlay runtime', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CustomRuntimeDateRangePickerHostComponent],
    }).createComponent(CustomRuntimeDateRangePickerHostComponent);

    await settle(fixture);

    const runtime = fixture.componentInstance.overlayRuntime();
    expect(runtime).not.toBeNull();
    expect(runtime?.getLayerIds()).toEqual([]);

    await openOverlay(fixture);
    expect(runtime?.getLayerIds().length).toBe(1);

    getRequired<HTMLButtonElement>(fixture, '[data-slot="date-range-picker-trigger"]').click();
    await settle(fixture);
    expect(runtime?.getLayerIds()).toEqual([]);
  });

  it('commits manual input with Enter as a partial range start and emits valueChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]');
    input.value = '05-10-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);

    keydown(input, 'Enter');
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-05-10', null);
    expect(input.value).toBe('05-10-2024');
  });

  it('reopens with the partial range start typed into the input selected in the overlay', async () => {
    await expectInputCommitReopensSelectedRange(
      UncontrolledDateRangePickerHostComponent,
      '09-20-2024',
      'September 2024',
      '20',
      null,
    );
  });

  it('selects start and end dates while marking the range cells', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);
    fixture.componentInstance.closeOnSelect.set(false);

    await settle(fixture);
    await openOverlay(fixture);

    getDayButton(document.body, '20').click();
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-04-20', null);
    expect(
      getRequired<HTMLInputElement>(fixture, '[data-slot="date-range-picker-input"]').value,
    ).toBe('04-20-2024');

    getDayButton(document.body, '24').click();
    await settle(fixture);

    expectRangeValue(fixture.componentInstance.valueChanges.at(-1), '2024-04-20', '2024-04-24');
    expect(getDayButton(document.body, '20').getAttribute('data-range-start')).toBe('true');
    expect(getDayButton(document.body, '22').getAttribute('data-in-range')).toBe('true');
    expect(getDayButton(document.body, '24').getAttribute('data-range-end')).toBe('true');
  });

  it('emits preview changes and marks preview range cells while choosing the end date', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultValue.set(undefined);
    fixture.componentInstance.closeOnSelect.set(false);

    await settle(fixture);
    await openOverlay(fixture);

    getDayButton(document.body, '4').click();
    await settle(fixture);

    const day14 = getDayButton(document.body, '14');
    day14.dispatchEvent(new Event('pointerenter'));
    await settle(fixture);

    expect(dateKey(fixture.componentInstance.previewChanges.at(-1)!)).toBe('2024-04-14');
    expect(getDayButton(document.body, '4').getAttribute('data-preview-range')).toBe('true');
    expect(getDayButton(document.body, '10').getAttribute('data-preview-range')).toBe('true');
    expect(day14.getAttribute('data-preview-range')).toBe('true');
    expect(day14.getAttribute('data-preview-end')).toBe('true');
  });

  it('opens the year panel from the period button and drills down to months then days', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    getRequiredFromRoot<HTMLButtonElement>(
      document.body,
      '[data-slot="date-range-picker-period-button"]',
    ).click();
    await settle(fixture);

    expect(
      document.body.querySelectorAll('[data-slot="date-range-picker-year"]').length,
    ).toBeGreaterThan(0);

    const yearButton = Array.from(
      document.body.querySelectorAll('[data-slot="date-range-picker-year"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === '2024') as
      | HTMLButtonElement
      | undefined;
    yearButton?.click();
    await settle(fixture);

    expect(
      document.body.querySelectorAll('[data-slot="date-range-picker-month"]').length,
    ).toBeGreaterThan(0);

    const monthButton = Array.from(
      document.body.querySelectorAll('[data-slot="date-range-picker-month"]'),
    ).find((element) => (element as HTMLElement).textContent?.trim() === 'Apr') as
      | HTMLButtonElement
      | undefined;
    monthButton?.click();
    await settle(fixture);

    expect(
      document.body.querySelectorAll('[data-slot="date-range-picker-cell"]').length,
    ).toBeGreaterThan(0);
  });

  it('flips the overlay above the trigger when auto placement has more space above', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledDateRangePickerHostComponent],
    }).createComponent(UncontrolledDateRangePickerHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    const anchor = getRequired<HTMLElement>(fixture, '[data-slot="date-range-picker-input-shell"]');
    const overlay = getRequiredFromRoot<HTMLElement>(
      document.body,
      '[data-slot="date-range-picker-overlay"]',
    );
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

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: originalInnerHeight,
    });
  });
});
