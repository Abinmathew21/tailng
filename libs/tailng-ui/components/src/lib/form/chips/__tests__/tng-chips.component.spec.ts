import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';
import { TngChipsComponent } from '../tng-chips.component';

function click(element: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

function getByTestId<T extends HTMLElement>(fixture: { nativeElement: HTMLElement }, id: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${id}"]`) as T | null;
  expect(element).not.toBeNull();
  return element as T;
}

@Component({
  standalone: true,
  imports: [TngChipsComponent, TngChip, TngChipRemove],
  template: `
    <tng-chips
      data-testid="chips-host"
      [ariaLabel]="ariaLabel()"
      [disabled]="disabled()"
      [values]="selected()"
      (chipRemove)="chipRemoveEvents.push($event)"
      (valuesChange)="onValuesChange($event)"
    >
      @for (item of selected(); track item) {
        <span tngChip [tngChipValue]="item" [tngChipLabel]="item" [attr.data-testid]="'chip-' + item">
          <span>{{ item }}</span>
          <button type="button" tngChipRemove [attr.data-testid]="'remove-' + item"></button>
        </span>
      }
    </tng-chips>
  `,
})
class ChipsComponentHarness {
  readonly ariaLabel = signal('Selected frameworks');
  readonly disabled = signal(false);
  readonly selected = signal<readonly string[]>(['Angular', 'Tailwind']);
  readonly chipRemoveEvents: unknown[] = [];
  readonly valuesChangeEvents: Array<readonly unknown[]> = [];

  onValuesChange(nextValues: readonly unknown[]): void {
    this.valuesChangeEvents.push([...nextValues]);
    this.selected.set(nextValues as readonly string[]);
  }
}

describe('tng-chips component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the component symbol', () => {
    expect(typeof TngChipsComponent).toBe('function');
  });

  it('renders projected chips inside the primitive root with forwarded aria label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipsComponentHarness],
    }).createComponent(ChipsComponentHarness);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('[data-slot="chips"]') as HTMLElement | null;
    expect(root).not.toBeNull();
    expect(root?.getAttribute('aria-label')).toBe('Selected frameworks');
    expect(root?.getAttribute('role')).toBe('list');
    expect(fixture.nativeElement.querySelectorAll('[data-slot="chip"]')).toHaveLength(2);
  });

  it('clicking remove emits wrapper outputs and updates controlled host values', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipsComponentHarness],
    }).createComponent(ChipsComponentHarness);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    click(getByTestId<HTMLElement>(fixture, 'remove-Angular'));
    fixture.detectChanges();

    expect(host.chipRemoveEvents).toEqual(['Angular']);
    expect(host.valuesChangeEvents).toEqual([['Tailwind']]);
    expect(fixture.nativeElement.querySelector('[data-testid="chip-Angular"]')).toBeNull();
    expect(getByTestId<HTMLElement>(fixture, 'chip-Tailwind')).not.toBeNull();
  });

  it('disabled wrapper blocks remove interactions and applies disabled state hook', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipsComponentHarness],
    }).createComponent(ChipsComponentHarness);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    host.disabled.set(true);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('[data-slot="chips"]') as HTMLElement | null;
    expect(root?.hasAttribute('data-disabled')).toBe(true);

    click(getByTestId<HTMLElement>(fixture, 'remove-Angular'));
    fixture.detectChanges();

    expect(host.chipRemoveEvents).toEqual([]);
    expect(host.valuesChangeEvents).toEqual([]);
    expect(getByTestId<HTMLElement>(fixture, 'chip-Angular')).not.toBeNull();
  });
});
