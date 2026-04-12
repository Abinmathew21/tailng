import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { createDatepickerController, type TngDatepickerOutputs } from '../tng-datepicker';
import { TngDatepickerOverlay } from '../tng-datepicker.overlay';
import {
  bindTngDatepicker,
  TngDatepickerDayCell,
  TngDatepickerDayGrid,
  TngDatepickerHost,
  TngDatepickerInput,
  TngDatepickerMonthGrid,
  TngDatepickerMonthOption,
  TngDatepickerNextButton,
  TngDatepickerPeriodButton,
  TngDatepickerPrevButton,
  TngDatepickerTrigger,
  TngDatepickerYearOption,
  TngDatepickerYearGrid,
} from '../tng-datepicker.parts';
import { dateKey } from './tng-datepicker.test-helpers';

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector) as T | null;
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element;
}

function dispatchKeyboardEvent(target: Element, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key }));
}

function dispatchTabLikeBrowser(target: HTMLElement, shiftKey = false): void {
  target.focus();

  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: 'Tab',
    shiftKey,
  });
  target.dispatchEvent(event);

  if (event.defaultPrevented) {
    return;
  }

  const overlay = target.closest<HTMLElement>('[data-testid="overlay"]');
  if (overlay === null) {
    return;
  }

  const focusableElements = Array.from(
    overlay.querySelectorAll<HTMLElement>(
      [
        'a[href]:not([tabindex="-1"])',
        'button:not([disabled]):not([tabindex="-1"])',
        'input:not([disabled]):not([tabindex="-1"])',
        'select:not([disabled]):not([tabindex="-1"])',
        'textarea:not([disabled]):not([tabindex="-1"])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(','),
    ),
  );
  const currentIndex = focusableElements.indexOf(target);
  if (currentIndex === -1) {
    return;
  }

  const nextTarget = shiftKey
    ? focusableElements[currentIndex - 1]
    : focusableElements[currentIndex + 1];

  nextTarget?.focus();
}

function settle(fixture: { detectChanges(): void; whenStable(): Promise<unknown> }): Promise<unknown> {
  fixture.detectChanges();
  return fixture.whenStable();
}

@Component({
  standalone: true,
  imports: [
    TngDatepickerHost,
    TngDatepickerInput,
    TngDatepickerTrigger,
    TngDatepickerPrevButton,
    TngDatepickerPeriodButton,
    TngDatepickerNextButton,
    TngDatepickerDayGrid,
    TngDatepickerDayCell,
    TngDatepickerMonthGrid,
    TngDatepickerMonthOption,
    TngDatepickerYearGrid,
    TngDatepickerYearOption,
  ],
  template: `
    <div data-testid="host" [tngDatepickerHost]="controller">
      <input data-testid="input" [tngDatepickerInput]="controller" />
      <button data-testid="trigger" type="button" [tngDatepickerTrigger]="controller">Open</button>
      <button data-testid="prev" type="button" [tngDatepickerPrevButton]="controller">Prev</button>
      <button data-testid="period" type="button" [tngDatepickerPeriodButton]="controller">
        {{ datepicker.periodLabel() }}
      </button>
      <button data-testid="next" type="button" [tngDatepickerNextButton]="controller">Next</button>

      <div data-testid="day-grid" [tngDatepickerDayGrid]="controller">
        @for (cell of outputs().cells; track cell.id) {
          <button type="button" [tngDatepickerDayCell]="cell">
            {{ cell.label }}
          </button>
        }
      </div>

      <div data-testid="month-grid" [tngDatepickerMonthGrid]="controller">
        @for (option of outputs().monthOptions; track option.id) {
          <button type="button" [tngDatepickerMonthOption]="option">
            {{ option.label }}
          </button>
        }
      </div>

      <div data-testid="year-grid" [tngDatepickerYearGrid]="controller">
        @for (option of outputs().yearOptions; track option.id) {
          <button type="button" [tngDatepickerYearOption]="option">
            {{ option.label }}
          </button>
        }
      </div>
    </div>
  `,
})
class DatepickerPartsHostComponent {
  public readonly controller = createDatepickerController<Date>({
    closeOnSelect: false,
    ownerDocument: document,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: '2024-04-22',
  });
  public readonly datepicker = bindTngDatepicker(this.controller);

  public outputs(): TngDatepickerOutputs<Date> {
    return this.controller.getOutputs();
  }
}

@Component({
  standalone: true,
  imports: [
    TngDatepickerHost,
    TngDatepickerInput,
    TngDatepickerTrigger,
    TngDatepickerOverlay,
    TngDatepickerPrevButton,
    TngDatepickerPeriodButton,
    TngDatepickerNextButton,
    TngDatepickerDayGrid,
    TngDatepickerDayCell,
    TngDatepickerMonthGrid,
    TngDatepickerMonthOption,
    TngDatepickerYearGrid,
    TngDatepickerYearOption,
  ],
  template: `
    <div data-testid="host" [tngDatepickerHost]="controller">
      <div #anchor data-testid="anchor">
        <input data-testid="input" [tngDatepickerInput]="controller" />
        <button data-testid="trigger" type="button" [tngDatepickerTrigger]="controller">Open</button>
      </div>

      <section
        data-testid="overlay"
        [tngDatepickerOverlay]="controller"
        [tngDatepickerOverlayAnchor]="anchor"
      >
        <header>
          <button data-testid="prev" type="button" [tngDatepickerPrevButton]="controller">Prev</button>
          <button data-testid="period" type="button" [tngDatepickerPeriodButton]="controller">
            {{ datepicker.periodLabel() }}
          </button>
          <button data-testid="next" type="button" [tngDatepickerNextButton]="controller">Next</button>
        </header>

        @if (outputs().view === 'day') {
          <div data-testid="day-grid" [tngDatepickerDayGrid]="controller">
            @for (cell of outputs().cells; track cell.id) {
              <button type="button" [tngDatepickerDayCell]="cell">{{ cell.label }}</button>
            }
          </div>
        } @else if (outputs().view === 'month') {
          <div data-testid="month-grid" [tngDatepickerMonthGrid]="controller">
            @for (option of outputs().monthOptions; track option.id) {
              <button type="button" [tngDatepickerMonthOption]="option">{{ option.label }}</button>
            }
          </div>
        } @else {
          <div data-testid="year-grid" [tngDatepickerYearGrid]="controller">
            @for (option of outputs().yearOptions; track option.id) {
              <button type="button" [tngDatepickerYearOption]="option">{{ option.label }}</button>
            }
          </div>
        }
      </section>
    </div>
  `,
})
class DatepickerOverlayPartsHostComponent {
  public readonly controller = createDatepickerController<Date>({
    closeOnSelect: false,
    ownerDocument: document,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: '2024-04-22',
  });
  public readonly datepicker = bindTngDatepicker(this.controller);

  public outputs(): TngDatepickerOutputs<Date> {
    return this.controller.getOutputs();
  }
}

describe('tng-datepicker primitive parts', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.innerHTML = '';
  });

  it('syncs input text through the input directive and opens on ArrowDown', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerPartsHostComponent],
    }).createComponent(DatepickerPartsHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture.nativeElement, '[data-testid="input"]');
    input.value = '04-24-2024';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.controller.getOutputs().inputText).toBe('04-24-2024');

    dispatchKeyboardEvent(input, 'ArrowDown');
    fixture.detectChanges();

    expect(fixture.componentInstance.controller.getOutputs().open).toBe(true);
  });

  it('opens from the input directive when the field is clicked', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerPartsHostComponent],
    }).createComponent(DatepickerPartsHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture.nativeElement, '[data-testid="input"]');
    input.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.controller.getOutputs().open).toBe(true);
  });

  it('toggles open state from the trigger directive and keeps aria-expanded in sync', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerPartsHostComponent],
    }).createComponent(DatepickerPartsHostComponent);

    await settle(fixture);

    const trigger = getRequired<HTMLButtonElement>(fixture.nativeElement, '[data-testid="trigger"]');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.controller.getOutputs().open).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('binds host attrs and period label through the primitive host binding helper', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerPartsHostComponent],
    }).createComponent(DatepickerPartsHostComponent);

    await settle(fixture);

    const host = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="host"]');
    const period = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="period"]');

    expect(host.getAttribute('data-slot')).toBe('datepicker');
    expect(host.getAttribute('data-view')).toBe('day');
    expect(period.textContent?.trim()).toContain('April');
  });

  it('selects a date through the primitive day-cell directive', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerPartsHostComponent],
    }).createComponent(DatepickerPartsHostComponent);

    await settle(fixture);

    const dayCells = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>('[data-slot="datepicker-cell"]'),
    );
    const day24 = dayCells.find((cell) => cell.textContent?.trim() === '24');
    if (day24 === undefined) {
      throw new Error('Expected day 24 cell to exist.');
    }

    day24.click();
    fixture.detectChanges();

    expect(dateKey(fixture.componentInstance.controller.getOutputs().value as Date)).toBe('2024-04-24');
  });

  it('pages backward from the primitive nav directive', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerPartsHostComponent],
    }).createComponent(DatepickerPartsHostComponent);

    await settle(fixture);

    const prev = getRequired<HTMLButtonElement>(fixture.nativeElement, '[data-testid="prev"]');
    prev.click();
    fixture.detectChanges();

    expect(
      fixture.componentInstance.controller.formatDate(
        fixture.componentInstance.controller.getOutputs().visibleMonth,
        'month-year',
      ),
    ).toBe('March 2024');
  });

  it('routes day-grid keydown through the primitive day-grid directive', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerPartsHostComponent],
    }).createComponent(DatepickerPartsHostComponent);

    await settle(fixture);

    const grid = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="day-grid"]');
    dispatchKeyboardEvent(grid, 'ArrowRight');
    fixture.detectChanges();

    expect(dateKey(fixture.componentInstance.controller.getOutputs().activeDate)).toBe('2024-04-23');
  });

  it('drills from the month grid back into the day view through the primitive month-grid directive', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerPartsHostComponent],
    }).createComponent(DatepickerPartsHostComponent);

    await settle(fixture);

    fixture.componentInstance.controller.showMonthsPanel();
    fixture.detectChanges();

    const grid = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="month-grid"]');
    dispatchKeyboardEvent(grid, 'Enter');
    fixture.detectChanges();

    expect(fixture.componentInstance.controller.getOutputs().view).toBe('day');
  });

  it('drills from the year grid into the month view through the primitive year-grid directive', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerPartsHostComponent],
    }).createComponent(DatepickerPartsHostComponent);

    await settle(fixture);

    fixture.componentInstance.controller.showYearsPanel();
    fixture.detectChanges();

    const grid = getRequired<HTMLElement>(fixture.nativeElement, '[data-testid="year-grid"]');
    dispatchKeyboardEvent(grid, 'Enter');
    fixture.detectChanges();

    expect(fixture.componentInstance.controller.getOutputs().view).toBe('month');
  });

  it('moves Tab focus from the overlay header into the active day, month, and year panels in headless usage', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerOverlayPartsHostComponent],
    }).createComponent(DatepickerOverlayPartsHostComponent);

    await settle(fixture);

    const trigger = getRequired<HTMLButtonElement>(fixture.nativeElement, '[data-testid="trigger"]');
    trigger.click();
    await settle(fixture);

    let overlay = getRequired<HTMLElement>(document.body, '[data-testid="overlay"]');
    let next = getRequired<HTMLButtonElement>(overlay, '[data-testid="next"]');
    dispatchTabLikeBrowser(next);

    const activeDay = fixture.componentInstance.controller.getOutputs().cells.find((cell) => cell.active);
    expect(document.activeElement?.id).toBe(activeDay?.id);
    expect((document.activeElement as HTMLElement | null)?.getAttribute('data-slot')).toBe(
      'datepicker-cell',
    );

    fixture.componentInstance.controller.showMonthsPanel();
    await settle(fixture);

    overlay = getRequired<HTMLElement>(document.body, '[data-testid="overlay"]');
    next = getRequired<HTMLButtonElement>(overlay, '[data-testid="next"]');
    dispatchTabLikeBrowser(next);

    const activeMonth = fixture.componentInstance.controller
      .getOutputs()
      .monthOptions.find((option) => option.active);
    expect(document.activeElement?.id).toBe(activeMonth?.id);
    expect((document.activeElement as HTMLElement | null)?.getAttribute('data-slot')).toBe(
      'datepicker-month',
    );

    fixture.componentInstance.controller.showYearsPanel();
    await settle(fixture);

    overlay = getRequired<HTMLElement>(document.body, '[data-testid="overlay"]');
    next = getRequired<HTMLButtonElement>(overlay, '[data-testid="next"]');
    dispatchTabLikeBrowser(next);

    const activeYear = fixture.componentInstance.controller
      .getOutputs()
      .yearOptions.find((option) => option.active);
    expect(document.activeElement?.id).toBe(activeYear?.id);
    expect((document.activeElement as HTMLElement | null)?.getAttribute('data-slot')).toBe(
      'datepicker-year',
    );
  });

  it('traps focus inside the overlay by wrapping Tab and Shift+Tab between the last and first focusable members', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DatepickerOverlayPartsHostComponent],
    }).createComponent(DatepickerOverlayPartsHostComponent);

    await settle(fixture);

    const trigger = getRequired<HTMLButtonElement>(fixture.nativeElement, '[data-testid="trigger"]');
    trigger.click();
    await settle(fixture);

    const overlay = getRequired<HTMLElement>(document.body, '[data-testid="overlay"]');
    const focusableMembers = Array.from(
      overlay.querySelectorAll<HTMLElement>(
        [
          'a[href]:not([tabindex="-1"])',
          'button:not([disabled]):not([tabindex="-1"])',
          'input:not([disabled]):not([tabindex="-1"])',
          'select:not([disabled]):not([tabindex="-1"])',
          'textarea:not([disabled]):not([tabindex="-1"])',
          '[tabindex]:not([tabindex="-1"])',
        ].join(','),
      ),
    );
    const firstMember = focusableMembers[0];
    const lastMember = focusableMembers[focusableMembers.length - 1];

    if (firstMember === undefined || lastMember === undefined) {
      throw new Error('Expected overlay focusable members to exist.');
    }

    dispatchTabLikeBrowser(lastMember);
    expect(document.activeElement).toBe(firstMember);

    dispatchTabLikeBrowser(firstMember, true);
    expect(document.activeElement).toBe(lastMember);
  });
});
