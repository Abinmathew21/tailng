import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';
import { TngMultiAutocompleteChip } from '../tng-multi-autocomplete.chip';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus'));
  el.focus?.();
}

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit>) {
  el.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      ...init,
    }),
  );
}

@Component({
  standalone: true,
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
  template: `
    <section
      tngMultiAutocomplete
      #m="tngMultiAutocomplete"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <input tngMultiAutocompleteTrigger data-testid="input" />
    </section>
  `,
})
class HostComponent {
  readonly value = signal<readonly string[]>(['a', 'b']);
}

@Component({
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteChip,
  ],
  template: `
    <section
      tngMultiAutocomplete
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      @for (chip of value(); track chip) {
        <span tngMultiAutocompleteChip data-testid="chip">
          {{ chip }}
        </span>
      }

      <input
        tngMultiAutocompleteTrigger
        data-testid="trigger"
        type="text"
      />
    </section>
  `,
})
class ChipNavHostComponent {
  readonly value = signal<readonly string[]>(['A', 'B', 'C']);
}


@Component({
  standalone: true,
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
  template: `
    <section tngMultiAutocomplete [value]="value()" (valueChange)="value.set($event)">
      @for (item of value(); track item) {
        <span
          tngMultiAutocompleteChip
          [tngValue]="item"
          [attr.data-testid]="'chip-' + item"
        >
          {{ item }}
        </span>
      }

      <input tngMultiAutocompleteTrigger data-testid="input" />
    </section>
  `,
})
class ChipHostComponent {
  readonly value = signal<readonly string[]>(['a', 'b', 'c']);
}

@Component({
  standalone: true,
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
  template: `
    <section
      tngMultiAutocomplete
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <div>
        @for (item of value(); track item) {
          <span
            tngMultiAutocompleteChip
            [tngValue]="item"
            [attr.data-testid]="'chip-' + item"
          >
            {{ item }}
          </span>
        }
      </div>

      <input tngMultiAutocompleteTrigger data-testid="input" />
    </section>
  `,
})
class ChipRemoveHostComponent {
  readonly value = signal<readonly string[]>(['a', 'b', 'c']);
}

describe('tng-multi-autocomplete chips UX', () => {
  it('Backspace removes last selected item when input is empty', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    input.value = ''; // empty

    keydown(input, { key: 'Backspace' });
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['a']);
  });
});

describe('multi-autocomplete chip navigation', () => {
  it('ArrowLeft from input focuses last chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipNavHostComponent],
    }).createComponent(ChipNavHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]'
    ) as HTMLInputElement;

    trigger.focus();
    keydown(trigger, { key: 'ArrowLeft' });
    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll(
      '[data-testid="chip"]'
    );

    expect(document.activeElement).toBe(chips[2]);
  });

  it('ArrowRight on last chip focuses input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipNavHostComponent],
    }).createComponent(ChipNavHostComponent);

    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll(
      '[data-testid="chip"]'
    );

    (chips[2] as HTMLElement).focus();
    keydown(chips[2], { key: 'ArrowRight' });
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]'
    );

    expect(document.activeElement).toBe(trigger);
  });
});

describe('tng-multi-autocomplete chip directive', () => {
  it('Delete removes focused chip and focuses previous chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipHostComponent],
    }).createComponent(ChipHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;
    focus(chipB);

    keydown(chipB, { key: 'Delete' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['a', 'c']);

    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;
    expect(document.activeElement).toBe(chipA);
  });

  it('Backspace removes first chip and focuses next chip when no previous exists', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipHostComponent],
    }).createComponent(ChipHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;

    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;
    focus(chipA);

    keydown(chipA, { key: 'Backspace' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['b', 'c']);

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;
    expect(document.activeElement).toBe(chipB);
  });

  it('Deleting the last remaining chip focuses the input trigger', async () => {
    @Component({
      standalone: true,
      imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
      template: `
        <section tngMultiAutocomplete [value]="value()" (valueChange)="value.set($event)">
          @for (item of value(); track item) {
            <span tngMultiAutocompleteChip [tngValue]="item" data-testid="chip">{{ item }}</span>
          }
          <input tngMultiAutocompleteTrigger data-testid="input" />
        </section>
      `,
    })
    class SingleChipHost {
      readonly value = signal<readonly string[]>(['x']);
    }

    const fixture = TestBed.configureTestingModule({
      imports: [SingleChipHost],
    }).createComponent(SingleChipHost);

    fixture.detectChanges();

    const host = fixture.componentInstance;

    const chip = fixture.nativeElement.querySelector('[data-testid="chip"]') as HTMLElement;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    focus(chip);

    keydown(chip, { key: 'Delete' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual([]);
    expect(document.activeElement).toBe(input);
  });

  it('ArrowRight on last chip moves focus to input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipHostComponent],
    }).createComponent(ChipHostComponent);

    fixture.detectChanges();

    const chipC = fixture.nativeElement.querySelector('[data-testid="chip-c"]') as HTMLElement;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    focus(chipC);
    keydown(chipC, { key: 'ArrowRight' });
    fixture.detectChanges();

    expect(document.activeElement).toBe(input);
  });
});

describe('tng-multi-autocomplete chip remove keys', () => {
  it('Delete removes focused chip and focuses previous chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipRemoveHostComponent],
    }).createComponent(ChipRemoveHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;
    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;

    focus(chipB);
    fixture.detectChanges();

    keydown(chipB, { key: 'Delete' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['a', 'c']);
    expect(document.activeElement).toBe(chipA);
  });

  it('Backspace removes focused chip and focuses previous chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipRemoveHostComponent],
    }).createComponent(ChipRemoveHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const chipC = fixture.nativeElement.querySelector('[data-testid="chip-c"]') as HTMLElement;
    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;

    focus(chipC);
    fixture.detectChanges();

    keydown(chipC, { key: 'Backspace' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['a', 'b']);
    expect(document.activeElement).toBe(chipB);
  });

  it('Delete on last remaining chip focuses input', async () => {
    @Component({
      standalone: true,
      imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
      template: `
        <section
          tngMultiAutocomplete
          [value]="value()"
          (valueChange)="value.set($event)"
        >
          @for (item of value(); track item) {
            <span
              tngMultiAutocompleteChip
              [tngValue]="item"
              [attr.data-testid]="'chip-' + item"
            >
              {{ item }}
            </span>
          }
          <input tngMultiAutocompleteTrigger data-testid="input" />
        </section>
      `,
    })
    class OneChipHost {
      readonly value = signal<readonly string[]>(['a']);
    }

    const fixture = TestBed.configureTestingModule({
      imports: [OneChipHost],
    }).createComponent(OneChipHost);

    fixture.detectChanges();

    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    focus(chipA);
    fixture.detectChanges();

    keydown(chipA, { key: 'Delete' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual([]);
    expect(document.activeElement).toBe(input);
  });


  it('Delete does nothing when disabled', async () => {
    @Component({
      standalone: true,
      imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
      template: `
        <section
          tngMultiAutocomplete
          [disabled]="true"
          [value]="value()"
          (valueChange)="value.set($event)"
        >
          @for (item of value(); track item) {
            <span
              tngMultiAutocompleteChip
              [tngValue]="item"
              [attr.data-testid]="'chip-' + item"
            >
              {{ item }}
            </span>
          }
          <input tngMultiAutocompleteTrigger data-testid="input" />
        </section>
      `,
    })
    class DisabledChipHost {
      readonly value = signal<readonly string[]>(['a', 'b']);
    }

    const fixture = TestBed.configureTestingModule({
      imports: [DisabledChipHost],
    }).createComponent(DisabledChipHost);

    fixture.detectChanges();

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;

    focus(chipB);
    fixture.detectChanges();

    keydown(chipB, { key: 'Delete' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['a', 'b']);
  });
});