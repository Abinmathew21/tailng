import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  TngMultiAutocomplete,
  TngMultiAutocompleteTrigger,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
} from '@tailng-ui/primitives';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus'));
}

function inputText(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

function keydown(el: HTMLElement, key: string) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

@Component({
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <section
      tngMultiAutocomplete
      #m="tngMultiAutocomplete"
      [value]="value()"
      (valueChange)="value.set($event)"
      (queryChange)="onQueryChange($event)"
    >
      <input
        tngMultiAutocompleteTrigger
        data-testid="trigger"
        type="text"
        autocomplete="off"
      />

      <ul tngMultiAutocompleteListbox data-testid="listbox">
        <li tngMultiAutocompleteOption [tngValue]="'Apple'">Apple</li>
        <li tngMultiAutocompleteOption [tngValue]="'Banana'">Banana</li>
      </ul>
    </section>
  `,
})
class MultiQueryHostComponent {
  readonly value = signal<readonly string[]>([]);
  readonly queries: string[] = [];

  onQueryChange(q: string) {
    this.queries.push(q);
  }
}

describe('tng-multi-autocomplete query behavior', () => {
  it('focus opens and emits queryChange with empty string', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiQueryHostComponent],
    }).createComponent(MultiQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    expect(host.queries.length).toBe(0);

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.queries.length).toBe(1);
    expect(host.queries[0]).toBe('');
  });

  it('typing updates query and emits queryChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiQueryHostComponent],
    }).createComponent(MultiQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'ap');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.queries.at(-1)).toBe('ap');
  });

  it('selection clears query and emits empty string', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiQueryHostComponent],
    }).createComponent(MultiQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const opt = fixture.nativeElement.querySelector('li') as HTMLElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'ap');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    opt.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['Apple']);
    expect(host.queries.at(-1)).toBe('');
  });

  it('selection does NOT close overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiQueryHostComponent],
    }).createComponent(MultiQueryHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const opt = fixture.nativeElement.querySelector('li') as HTMLElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    opt.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const multi = fixture.debugElement.children[0].injector.get(TngMultiAutocomplete);

    expect(multi.open()).toBe(true);
  });

  it('open-on-focus emits current query (prefilled)', async () => {
    @Component({
      standalone: true,
      imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
      template: `
        <section
          tngMultiAutocomplete
          [open]="open()"
          (openChange)="open.set($event)"
          (queryChange)="onQuery($event)"
        >
          <input tngMultiAutocompleteTrigger [attr.data-testid]="'trigger'" value="Prefilled" />
        </section>
      `,
    })
    class PrefilledHost {
      readonly open = signal(false);
      readonly queries: string[] = [];
      onQuery(q: string) {
        this.queries.push(q);
      }
    }
  
    const fixture = TestBed.configureTestingModule({
      imports: [PrefilledHost],
    }).createComponent(PrefilledHost);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
  
    trigger.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(host.queries.length).toBe(1);
    expect(host.queries[0]).toBe('Prefilled');
  });
  
  it('open-on-focus does NOT emit queryChange when disabled (prefilled)', async () => {
    @Component({
      standalone: true,
      imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
      template: `
        <section
          tngMultiAutocomplete
          [disabled]="true"
          [open]="open()"
          (openChange)="open.set($event)"
          (queryChange)="onQuery($event)"
        >
          <input
            tngMultiAutocompleteTrigger
            [attr.data-testid]="'trigger'"
            value="Prefilled"
          />
        </section>
      `,
    })
    class DisabledPrefilledHost {
      readonly open = signal(false);
      readonly queries: string[] = [];
      onQuery(q: string) {
        this.queries.push(q);
      }
    }
  
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledPrefilledHost],
    }).createComponent(DisabledPrefilledHost);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;
  
    trigger.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(host.open()).toBe(false);
    expect(host.queries.length).toBe(0);
  });
});