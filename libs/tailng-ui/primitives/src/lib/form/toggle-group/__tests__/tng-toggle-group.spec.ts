import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngToggle } from '../../toggle/tng-toggle';
import { TngToggleGroup } from '../tng-toggle-group';

@Component({
  imports: [TngToggleGroup, TngToggle],
  template: `
    <section
      tngToggleGroup
      data-testid="group"
      [ariaLabel]="ariaLabel()"
      [orientation]="orientation()"
      [selectionMode]="selectionMode()"
      [disabled]="disabled()"
      [value]="value()"
      [values]="values()"
      [defaultValue]="defaultValue()"
      [defaultValues]="defaultValues()"
      (valueChange)="onValueChange($event)"
      (valuesChange)="onValuesChange($event)"
    >
      <button tngToggle data-testid="bold" tngToggleValue="bold" [disabled]="boldDisabled()">
        Bold
      </button>
      <button tngToggle data-testid="italic" tngToggleValue="italic">Italic</button>
      <button tngToggle data-testid="underline" tngToggleValue="underline">Underline</button>
    </section>
  `,
})
class ToggleGroupHostComponent {
  public readonly ariaLabel = signal('Text formatting');
  public readonly orientation = signal<'horizontal' | 'vertical'>('vertical');
  public readonly selectionMode = signal<'multiple' | 'single'>('multiple');
  public readonly disabled = signal(false);
  public readonly boldDisabled = signal(false);
  public readonly value = signal<string | null | undefined>(undefined);
  public readonly values = signal<readonly string[] | undefined>(undefined);
  public readonly defaultValue = signal<string | null>(null);
  public readonly defaultValues = signal<readonly string[]>([]);

  public readonly valueChanges: Array<string | null> = [];
  public readonly valuesChanges: Array<readonly string[]> = [];
  public autoSyncSingle = false;
  public autoSyncMultiple = false;

  public onValueChange(nextValue: string | null): void {
    this.valueChanges.push(nextValue);
    if (this.autoSyncSingle) {
      this.value.set(nextValue);
    }
  }

  public onValuesChange(nextValues: readonly string[]): void {
    this.valuesChanges.push(nextValues);
    if (this.autoSyncMultiple) {
      this.values.set([...nextValues]);
    }
  }
}

function queryElement(
  fixture: ReturnType<typeof TestBed.createComponent>,
  selector: string,
): HTMLElement {
  const element = fixture.nativeElement.querySelector(selector);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Expected element for selector "${selector}".`);
  }

  return element;
}

function click(element: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 });
  element.dispatchEvent(event);
  return event;
}

describe('tngToggleGroup primitive', () => {
  it('applies role group, shared labeling, orientation, and selection mode attrs', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleGroupHostComponent],
    }).createComponent(ToggleGroupHostComponent);

    fixture.componentInstance.selectionMode.set('single');
    fixture.detectChanges();
    const group = queryElement(fixture, '[data-testid="group"]');

    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Text formatting');
    expect(group.getAttribute('data-slot')).toBe('toggle-group');
    expect(group.getAttribute('data-orientation')).toBe('vertical');
    expect(group.getAttribute('data-selection-mode')).toBe('single');
  });

  it('updates selected value correctly in single mode (uncontrolled)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleGroupHostComponent],
    }).createComponent(ToggleGroupHostComponent);

    const host = fixture.componentInstance;
    host.selectionMode.set('single');
    fixture.detectChanges();

    const bold = queryElement(fixture, '[data-testid="bold"]') as HTMLButtonElement;
    const italic = queryElement(fixture, '[data-testid="italic"]') as HTMLButtonElement;

    click(bold);
    fixture.detectChanges();
    expect(host.valueChanges).toEqual(['bold']);
    expect(bold.getAttribute('aria-pressed')).toBe('true');
    expect(italic.getAttribute('aria-pressed')).toBe('false');

    click(bold);
    fixture.detectChanges();
    expect(host.valueChanges).toEqual(['bold', null]);
    expect(bold.getAttribute('aria-pressed')).toBe('false');
  });

  it('supports controlled single selection without visual mutation until host sync', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleGroupHostComponent],
    }).createComponent(ToggleGroupHostComponent);

    const host = fixture.componentInstance;
    host.selectionMode.set('single');
    host.value.set('bold');
    host.autoSyncSingle = false;
    fixture.detectChanges();

    const bold = queryElement(fixture, '[data-testid="bold"]') as HTMLButtonElement;
    const italic = queryElement(fixture, '[data-testid="italic"]') as HTMLButtonElement;

    click(italic);
    fixture.detectChanges();
    expect(host.valueChanges).toEqual(['italic']);
    expect(bold.getAttribute('aria-pressed')).toBe('true');
    expect(italic.getAttribute('aria-pressed')).toBe('false');

    host.value.set('italic');
    fixture.detectChanges();
    expect(bold.getAttribute('aria-pressed')).toBe('false');
    expect(italic.getAttribute('aria-pressed')).toBe('true');
  });

  it('updates selected values correctly in multiple mode (uncontrolled)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleGroupHostComponent],
    }).createComponent(ToggleGroupHostComponent);

    const host = fixture.componentInstance;
    host.selectionMode.set('multiple');
    fixture.detectChanges();

    const bold = queryElement(fixture, '[data-testid="bold"]') as HTMLButtonElement;
    const italic = queryElement(fixture, '[data-testid="italic"]') as HTMLButtonElement;

    click(bold);
    fixture.detectChanges();
    click(italic);
    fixture.detectChanges();

    expect(host.valuesChanges.at(-1)).toEqual(['bold', 'italic']);
    expect(bold.getAttribute('aria-pressed')).toBe('true');
    expect(italic.getAttribute('aria-pressed')).toBe('true');

    click(bold);
    fixture.detectChanges();
    expect(host.valuesChanges.at(-1)).toEqual(['italic']);
    expect(bold.getAttribute('aria-pressed')).toBe('false');
  });

  it('respects disabled group state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleGroupHostComponent],
    }).createComponent(ToggleGroupHostComponent);

    const host = fixture.componentInstance;
    host.selectionMode.set('single');
    host.disabled.set(true);
    fixture.detectChanges();

    const group = queryElement(fixture, '[data-testid="group"]');
    const bold = queryElement(fixture, '[data-testid="bold"]') as HTMLButtonElement;
    const italic = queryElement(fixture, '[data-testid="italic"]') as HTMLButtonElement;

    click(bold);
    click(italic);
    fixture.detectChanges();

    expect(group.hasAttribute('data-disabled')).toBe(true);
    expect(bold.disabled).toBe(true);
    expect(italic.disabled).toBe(true);
    expect(host.valueChanges).toEqual([]);
    expect(bold.getAttribute('aria-pressed')).toBe('false');
    expect(italic.getAttribute('aria-pressed')).toBe('false');
  });

  it('respects disabled item state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleGroupHostComponent],
    }).createComponent(ToggleGroupHostComponent);

    const host = fixture.componentInstance;
    host.selectionMode.set('single');
    host.boldDisabled.set(true);
    fixture.detectChanges();

    const bold = queryElement(fixture, '[data-testid="bold"]') as HTMLButtonElement;
    const italic = queryElement(fixture, '[data-testid="italic"]') as HTMLButtonElement;

    click(bold);
    fixture.detectChanges();
    expect(host.valueChanges).toEqual([]);
    expect(bold.getAttribute('aria-pressed')).toBe('false');

    click(italic);
    fixture.detectChanges();
    expect(host.valueChanges).toEqual(['italic']);
    expect(italic.getAttribute('aria-pressed')).toBe('true');
  });
});
