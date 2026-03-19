import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import * as primitives from '../../../../index';
import { TngChip, TngChipRemove, TngChips } from '../tng-chips';

interface ChipItem {
  readonly disabled?: boolean;
  readonly id: string;
  readonly label: string;
}

function click(element: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

function keydown(element: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  element.dispatchEvent(event);
  return event;
}

function getByTestId<T extends HTMLElement>(fixture: { nativeElement: HTMLElement }, id: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as T | null;
  expect(element).not.toBeNull();
  return element as T;
}

@Component({
  imports: [TngChips, TngChip, TngChipRemove],
  template: `
    <div
      tngChips
      data-testid="chips-root"
      [tngChipsAriaLabel]="'Selected tags'"
      [tngChipsValues]="selectedValues()"
      [tngChipsDisabled]="groupDisabled()"
      (chipRemove)="removedByRoot.push($event)"
      (valuesChange)="onValuesChange($event)"
    >
      @for (chip of chips(); track chip.id) {
        <span
          tngChip
          tabindex="0"
          [attr.data-testid]="'chip-' + chip.id"
          [tngChipValue]="chip.id"
          [tngChipLabel]="chip.label"
          [tngChipDisabled]="chip.disabled ?? false"
          (chipRemove)="removedByChip.push($event)"
        >
          <span>{{ chip.label }}</span>
          <button type="button" tngChipRemove [attr.data-testid]="'remove-' + chip.id"></button>
        </span>
      }
    </div>
  `,
})
class ChipsHarnessComponent {
  readonly chips = signal<readonly ChipItem[]>([
    { id: 'angular', label: 'Angular' },
    { id: 'cdk', label: 'CDK', disabled: true },
    { id: 'a11y', label: 'A11y' },
  ]);
  readonly groupDisabled = signal(false);
  readonly selectedValues = computed(() => this.chips().map((chip) => chip.id));

  readonly removedByRoot: unknown[] = [];
  readonly removedByChip: unknown[] = [];
  readonly valuesChangeEvents: Array<readonly unknown[]> = [];

  onValuesChange(nextValues: readonly unknown[]): void {
    this.valuesChangeEvents.push([...nextValues]);
    const nextSet = new Set(nextValues as readonly string[]);
    this.chips.update((items) => items.filter((item) => nextSet.has(item.id)));
  }
}

describe('tng-chips primitive', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports chips primitives (root, item, remove)', () => {
    const exported = primitives as Record<string, unknown>;
    expect(typeof exported['TngChips']).toBe('function');
    expect(typeof exported['TngChip']).toBe('function');
    expect(typeof exported['TngChipRemove']).toBe('function');
  });

  it('renders chip list and chips with expected data attributes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipsHarnessComponent],
    }).createComponent(ChipsHarnessComponent);
    fixture.detectChanges();

    const root = getByTestId<HTMLElement>(fixture, 'chips-root');
    const chips = Array.from(fixture.nativeElement.querySelectorAll('[data-slot="chip"]')) as HTMLElement[];
    const removes = Array.from(
      fixture.nativeElement.querySelectorAll('[data-slot="chip-remove"]'),
    ) as HTMLElement[];

    expect(root.getAttribute('role')).toBe('list');
    expect(root.getAttribute('aria-label')).toBe('Selected tags');
    expect(root.getAttribute('data-slot')).toBe('chips');
    expect(chips).toHaveLength(3);
    expect(removes).toHaveLength(3);
    expect(getByTestId<HTMLElement>(fixture, 'chip-angular').getAttribute('data-value')).toBe('angular');
    expect(getByTestId<HTMLElement>(fixture, 'chip-cdk').hasAttribute('data-disabled')).toBe(true);
    expect(getByTestId<HTMLElement>(fixture, 'remove-cdk').hasAttribute('data-disabled')).toBe(true);
  });

  it('uses accessible remove labels and keeps remove buttons focusable in DOM order', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipsHarnessComponent],
    }).createComponent(ChipsHarnessComponent);
    fixture.detectChanges();

    const removeAngular = getByTestId<HTMLButtonElement>(fixture, 'remove-angular');
    const removeA11y = getByTestId<HTMLButtonElement>(fixture, 'remove-a11y');
    const removeButtons = Array.from(
      fixture.nativeElement.querySelectorAll('[data-slot="chip-remove"]'),
    ) as HTMLButtonElement[];

    expect(removeAngular.getAttribute('aria-label')).toBe('Remove Angular');
    expect(removeA11y.getAttribute('aria-label')).toBe('Remove A11y');
    expect(removeAngular.tabIndex).toBe(0);
    expect(removeA11y.tabIndex).toBe(0);
    expect(removeButtons.map((button) => button.getAttribute('data-testid'))).toEqual([
      'remove-angular',
      'remove-cdk',
      'remove-a11y',
    ]);
  });

  it('click remove emits events and updates controlled host values', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipsHarnessComponent],
    }).createComponent(ChipsHarnessComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    click(getByTestId<HTMLElement>(fixture, 'remove-angular'));
    fixture.detectChanges();

    expect(host.removedByRoot).toEqual(['angular']);
    expect(host.removedByChip).toEqual(['angular']);
    expect(host.valuesChangeEvents).toEqual([['cdk', 'a11y']]);
    expect(fixture.nativeElement.querySelector('[data-testid="chip-angular"]')).toBeNull();
  });

  it('Enter and Space on remove button remove chips', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipsHarnessComponent],
    }).createComponent(ChipsHarnessComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const removeA11y = getByTestId<HTMLElement>(fixture, 'remove-a11y');

    keydown(removeA11y, 'Enter');
    fixture.detectChanges();

    expect(host.removedByRoot).toContain('a11y');
    expect(fixture.nativeElement.querySelector('[data-testid="chip-a11y"]')).toBeNull();

    keydown(getByTestId<HTMLElement>(fixture, 'remove-cdk'), ' ');
    fixture.detectChanges();

    // cdk is disabled, so keyboard action must not remove it.
    expect(host.removedByRoot.filter((value) => value === 'cdk')).toHaveLength(0);
    expect(getByTestId<HTMLElement>(fixture, 'chip-cdk')).not.toBeNull();
  });

  it('Delete and Backspace on focused chip remove when chip is removable', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipsHarnessComponent],
    }).createComponent(ChipsHarnessComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const chipAngular = getByTestId<HTMLElement>(fixture, 'chip-angular');
    const chipA11y = getByTestId<HTMLElement>(fixture, 'chip-a11y');

    keydown(chipAngular, 'Delete');
    fixture.detectChanges();
    keydown(chipA11y, 'Backspace');
    fixture.detectChanges();

    expect(host.removedByRoot).toEqual(['angular', 'a11y']);
    expect(fixture.nativeElement.querySelector('[data-testid="chip-angular"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="chip-a11y"]')).toBeNull();
  });

  it('disabled chip and disabled group block remove actions', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipsHarnessComponent],
    }).createComponent(ChipsHarnessComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;

    click(getByTestId<HTMLElement>(fixture, 'remove-cdk'));
    keydown(getByTestId<HTMLElement>(fixture, 'chip-cdk'), 'Delete');
    fixture.detectChanges();

    expect(host.removedByRoot).toEqual([]);
    expect(getByTestId<HTMLElement>(fixture, 'chip-cdk')).not.toBeNull();

    host.groupDisabled.set(true);
    fixture.detectChanges();

    const root = getByTestId<HTMLElement>(fixture, 'chips-root');
    expect(root.hasAttribute('data-disabled')).toBe(true);

    click(getByTestId<HTMLElement>(fixture, 'remove-a11y'));
    fixture.detectChanges();

    expect(host.removedByRoot).toEqual([]);
    expect(getByTestId<HTMLElement>(fixture, 'chip-a11y')).not.toBeNull();
  });

  it('sets and clears data-focused on remove button focus transitions', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipsHarnessComponent],
    }).createComponent(ChipsHarnessComponent);
    fixture.detectChanges();

    const removeAngular = getByTestId<HTMLElement>(fixture, 'remove-angular');

    removeAngular.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
    expect(removeAngular.hasAttribute('data-focused')).toBe(true);

    removeAngular.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();
    expect(removeAngular.hasAttribute('data-focused')).toBe(false);
  });
});
