import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';
import { afterEach, describe, expect, it } from 'vitest';
import { TngChipComponent } from '../tng-chip.component';
import { TngChipsComponent } from '../tng-chips.component';

function click(element: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  return event;
}

function getByTestId<T extends HTMLElement>(fixture: { nativeElement: HTMLElement }, id: string): T {
  const element = fixture.nativeElement.querySelector<T>(`[data-testid="${id}"]`);
  expect(element).not.toBeNull();
  return element!;
}

@Component({
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
  public readonly ariaLabel = signal('Selected frameworks');
  public readonly disabled = signal(false);
  public readonly selected = signal<readonly string[]>(['Angular', 'Tailwind']);
  public readonly chipRemoveEvents: unknown[] = [];
  public readonly valuesChangeEvents: readonly unknown[][] = [];

  public onValuesChange(nextValues: readonly unknown[]): void {
    this.valuesChangeEvents.push([...nextValues]);
    this.selected.set(nextValues as readonly string[]);
  }
}

@Component({
  imports: [TngChipsComponent, TngChipComponent],
  template: `
    <tng-chips
      data-testid="chips-host"
      [ariaLabel]="'Selected libraries'"
      [values]="selected()"
      (chipRemove)="chipRemoveEvents.push($event)"
      (valuesChange)="onValuesChange($event)"
    >
      @for (item of selected(); track item) {
        <tng-chip
          [value]="item"
          [label]="item"
          [attr.data-testid]="'component-chip-' + item"
          (chipRemove)="componentChipRemoveEvents.push($event)"
        >
          {{ item }}
        </tng-chip>
      }
    </tng-chips>
  `,
})
class StyledChipsComponentHarness {
  public readonly selected = signal<readonly string[]>(['Angular', 'Tailwind']);
  public readonly chipRemoveEvents: unknown[] = [];
  public readonly componentChipRemoveEvents: unknown[] = [];
  public readonly valuesChangeEvents: readonly unknown[][] = [];

  public onValuesChange(nextValues: readonly unknown[]): void {
    this.valuesChangeEvents.push([...nextValues]);
    this.selected.set(nextValues as readonly string[]);
  }
}

@Component({
  imports: [TngChipsComponent, TngChipComponent],
  template: `
    <tng-chips
      [defaultValues]="defaultValues"
      (chipRemove)="chipRemoveEvents.push($event)"
      (valuesChange)="valuesChangeEvents.push($event)"
    >
      <tng-chip value="Angular" label="Angular">Angular</tng-chip>
      <tng-chip value="Tailwind" label="Tailwind">Tailwind</tng-chip>
    </tng-chips>
  `,
})
class UncontrolledStyledChipsComponentHarness {
  public readonly defaultValues = ['Angular', 'Tailwind'];
  public readonly chipRemoveEvents: unknown[] = [];
  public readonly valuesChangeEvents: readonly unknown[][] = [];
}

@Component({
  imports: [TngChipsComponent],
  template: `
    <tng-chips
      [items]="selected()"
      [itemLabel]="formatItemLabel"
      (chipRemove)="chipRemoveEvents.push($event)"
      (valuesChange)="onValuesChange($event)"
    />
  `,
})
class ItemsInputChipsComponentHarness {
  public readonly selected = signal<readonly string[]>(['Angular', 'Tailwind']);
  public readonly chipRemoveEvents: unknown[] = [];
  public readonly valuesChangeEvents: readonly unknown[][] = [];
  public readonly formatItemLabel = (item: unknown): string => `Framework: ${String(item)}`;

  public onValuesChange(nextValues: readonly unknown[]): void {
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

  it('renders tng-chip subcomponents with primitive hooks and component-owned styles', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StyledChipsComponentHarness],
    }).createComponent(StyledChipsComponentHarness);
    fixture.detectChanges();

    const chip = fixture.nativeElement.querySelector('[data-slot="chip"]') as HTMLElement | null;
    const remove = fixture.nativeElement.querySelector('[data-slot="chip-remove"]') as HTMLElement | null;

    expect(chip).not.toBeNull();
    expect(chip?.classList.contains('tng-chip')).toBe(true);
    expect(chip?.getAttribute('role')).toBe('listitem');
    expect(remove).not.toBeNull();
    expect(remove?.classList.contains('tng-chip-remove')).toBe(true);
    expect(remove?.getAttribute('aria-label')).toBe('Remove Angular');
  });

  it('tng-chip remove updates controlled wrapper values once', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StyledChipsComponentHarness],
    }).createComponent(StyledChipsComponentHarness);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const remove = fixture.nativeElement.querySelector(
      '[data-testid="component-chip-Angular"] [data-slot="chip-remove"]',
    ) as HTMLElement;
    click(remove);
    fixture.detectChanges();

    expect(host.componentChipRemoveEvents).toEqual(['Angular']);
    expect(host.chipRemoveEvents).toEqual(['Angular']);
    expect(host.valuesChangeEvents).toEqual([['Tailwind']]);
    expect(fixture.nativeElement.querySelector('[data-testid="component-chip-Angular"]')).toBeNull();
  });

  it('forwards uncontrolled default value removals from the primitive root', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledStyledChipsComponentHarness],
    }).createComponent(UncontrolledStyledChipsComponentHarness);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const remove = fixture.nativeElement.querySelector('[data-slot="chip-remove"]') as HTMLElement;
    click(remove);
    fixture.detectChanges();

    expect(host.chipRemoveEvents).toEqual(['Angular']);
    expect(host.valuesChangeEvents).toEqual([['Tailwind']]);
  });

  it('renders styled chips from an items input array', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ItemsInputChipsComponentHarness],
    }).createComponent(ItemsInputChipsComponentHarness);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const chips = Array.from(nativeElement.querySelectorAll<HTMLElement>('[data-slot="chip"]'));
    expect(chips).toHaveLength(2);
    expect(chips.map((chip) => chip.textContent?.trim())).toEqual([
      'Framework: Angular ×',
      'Framework: Tailwind ×',
    ]);
  });

  it('items input removals emit next item array', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ItemsInputChipsComponentHarness],
    }).createComponent(ItemsInputChipsComponentHarness);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const remove = fixture.nativeElement.querySelector('[data-slot="chip-remove"]') as HTMLElement;
    click(remove);
    fixture.detectChanges();

    expect(host.chipRemoveEvents).toEqual(['Angular']);
    expect(host.valuesChangeEvents).toEqual([['Tailwind']]);
    expect(fixture.nativeElement.querySelectorAll('[data-slot="chip"]')).toHaveLength(1);
  });
});
