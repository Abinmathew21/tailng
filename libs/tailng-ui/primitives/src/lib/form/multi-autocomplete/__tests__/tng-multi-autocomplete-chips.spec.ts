import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteChip } from '../tng-multi-autocomplete.chip';
import { TNG_MULTI_AUTOCOMPLETE_LISTBOX } from '../tng-multi-autocomplete.listbox.tokens';
import type { TngMultiAutocompleteListboxApi } from '../tng-multi-autocomplete.listbox.types';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';

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
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
  template: `
    <section
      tngMultiAutocomplete
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      @for (chip of value(); track chip) {
        <span
          tngMultiAutocompleteChip
          [tngValue]="chip"
          data-testid="chip"
          tabindex="-1"
        >
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

describe('tng-multi-autocomplete input ↔ chips navigation', () => {
  @Component({
    imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
    template: `
      <section tngMultiAutocomplete [value]="value()" (valueChange)="value.set($event)">
        @for (item of value(); track item) {
          <span
            tngMultiAutocompleteChip
            [tngValue]="item"
            attr.data-testid="chip-{{ item }}"
          >
            {{ item }}
          </span>
        }
        <input tngMultiAutocompleteTrigger data-testid="input" />
      </section>
    `,
  })
  class ChipNavHostComponent {
    readonly value = signal<readonly string[]>(['a', 'b', 'c']);
  }

  it('ArrowLeft on input at caret-start focuses last chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipNavHostComponent],
    }).createComponent(ChipNavHostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;
    const chipC = fixture.nativeElement.querySelector('[data-testid="chip-c"]') as HTMLElement;

    focus(input);
    input.value = 'ap';
    input.setSelectionRange(0, 0);
    fixture.detectChanges();

    keydown(input, { key: 'ArrowLeft' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(chipC);
  });

  it('ArrowLeft on input when caret is NOT at start does not move focus', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipNavHostComponent],
    }).createComponent(ChipNavHostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    focus(input);
    input.value = 'ap';
    input.setSelectionRange(1, 1);
    fixture.detectChanges();

    keydown(input, { key: 'ArrowLeft' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(input);
  });

  it('ArrowLeft on input at caret-start does nothing when there are no chips', async () => {
    @Component({
      imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
      template: `
        <section tngMultiAutocomplete [value]="value()" (valueChange)="value.set($event)">
          @for (item of value(); track item) {
            <span
              tngMultiAutocompleteChip
              [tngValue]="item"
              attr.data-testid="chip-{{ item }}"
            >
              {{ item }}
            </span>
          }
          <input tngMultiAutocompleteTrigger data-testid="input" />
        </section>
      `,
    })
    class NoChipHostComponent {
      readonly value = signal<readonly string[]>([]);
    }

    const fixture = TestBed.configureTestingModule({
      imports: [NoChipHostComponent],
    }).createComponent(NoChipHostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    focus(input);
    input.value = 'ap';
    input.setSelectionRange(0, 0);
    fixture.detectChanges();

    keydown(input, { key: 'ArrowLeft' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(input);
  });
});

describe('tng-multi-autocomplete chip Home/End navigation', () => {
  @Component({
    imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
    template: `
      <section tngMultiAutocomplete [value]="value()" (valueChange)="value.set($event)">
        @for (item of value(); track item) {
          <span
            tngMultiAutocompleteChip
            [tngValue]="item"
            attr.data-testid="chip-{{ item }}"
          >
            {{ item }}
          </span>
        }
        <input tngMultiAutocompleteTrigger data-testid="input" />
      </section>
    `,
  })
  class ChipHomeEndHostComponent {
    readonly value = signal<readonly string[]>(['a', 'b', 'c']);
  }

  it('Home focuses first chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipHomeEndHostComponent],
    }).createComponent(ChipHomeEndHostComponent);

    fixture.detectChanges();

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;
    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;

    chipB.focus();
    fixture.detectChanges();

    keydown(chipB, { key: 'Home' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(chipA);
  });

  it('End focuses input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipHomeEndHostComponent],
    }).createComponent(ChipHomeEndHostComponent);

    fixture.detectChanges();

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    chipB.focus();
    fixture.detectChanges();

    keydown(chipB, { key: 'End' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(input);
  });
});

@Component({
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
class InputChipBoundaryHostComponent {
  readonly value = signal<readonly string[]>(['a', 'b', 'c']);
}

describe('tng-multi-autocomplete input - chips boundary', () => {
  it('ArrowLeft on input at caret-start focuses last chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputChipBoundaryHostComponent],
    }).createComponent(InputChipBoundaryHostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;
    const chipC = fixture.nativeElement.querySelector('[data-testid="chip-c"]') as HTMLElement;

    input.focus();
    input.setSelectionRange(0, 0);
    fixture.detectChanges();

    keydown(input, { key: 'ArrowLeft' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(chipC);
  });

  it('ArrowLeft on input when caret not at start does NOT focus chips', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputChipBoundaryHostComponent],
    }).createComponent(InputChipBoundaryHostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    input.focus();
    // caret not at start
    input.value = 'x';
    input.setSelectionRange(1, 1);
    fixture.detectChanges();

    keydown(input, { key: 'ArrowLeft' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(input);
  });

  it('Home on input at caret-start focuses first chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputChipBoundaryHostComponent],
    }).createComponent(InputChipBoundaryHostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;
    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;

    input.focus();
    input.setSelectionRange(0, 0);
    fixture.detectChanges();

    keydown(input, { key: 'Home' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(chipA);
  });

  it('End on input keeps focus on input (caret behavior)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputChipBoundaryHostComponent],
    }).createComponent(InputChipBoundaryHostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    input.focus();
    input.value = 'hello';
    input.setSelectionRange(0, 0);
    fixture.detectChanges();

    keydown(input, { key: 'End' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(input);
  });

});

describe('tng-multi-autocomplete input - chips boundary', () => {
  @Component({
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
        <input tngMultiAutocompleteTrigger [attr.data-testid]="'input'" />
      </section>
    `,
  })
  class InputChipBoundaryHostComponent {
    readonly value = signal<readonly string[]>(['a', 'b', 'c']);
  }

  it('Home on input at caret-start focuses first chip (when closed)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputChipBoundaryHostComponent],
    }).createComponent(InputChipBoundaryHostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;
    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;

    // IMPORTANT: keep closed by not firing focus-open logic.
    // If your trigger opens on focus, use dispatchEvent only (no .focus()) OR set disabled/open binding in host.
    input.dispatchEvent(new FocusEvent('focus'));
    input.setSelectionRange(0, 0);
    fixture.detectChanges();

    keydown(input, { key: 'Home' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(chipA);
  });
  
  it('Home at caret-start focuses first chip and does NOT delegate to listbox (closed)', async () => {
    // Arrange: host with chips + trigger + listbox mock
    const listbox = {
      getHostId: vi.fn(() => 'lb-1'),
      getActiveId: vi.fn(() => 'opt-1'),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    } satisfies TngMultiAutocompleteListboxApi<string>;
  
    @Component({
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
          <input tngMultiAutocompleteTrigger [attr.data-testid]="'input'" />
        </section>
      `,
    })
    class Host {
      readonly value = signal<readonly string[]>(['a', 'b', 'c']);
    }
  
    const fixture = TestBed.configureTestingModule({
      imports: [Host],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(Host);
  
    fixture.detectChanges();
  
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;
    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;
  
    // keep CLOSED: do NOT dispatch FocusEvent('focus')
    input.focus?.();
    input.value = 'x';
    input.setSelectionRange(0, 0);
    fixture.detectChanges();
  
    // Act
    keydown(input, { key: 'Home' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    // Assert
    expect(document.activeElement).toBe(chipA);
    expect(listbox.handleKey).not.toHaveBeenCalled();
  });
});