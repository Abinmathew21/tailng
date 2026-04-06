import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';

function dispatchFocus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus?.();
}

function inputText(el: HTMLInputElement, value: string) {
  el.value = value;
  el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
}

function pasteText(el: HTMLInputElement, value: string) {
  // In jsdom, the easiest reliable thing: set value then fire input
  el.value = value;
  el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertFromPaste' }));
}

@Component({
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
  template: `
    <section
      tngMultiAutocomplete
      [open]="open()"
      (openChange)="open.set($event)"
      (queryChange)="onQuery($event)"
    >
      <input tngMultiAutocompleteTrigger [attr.data-testid]="'trigger'" />
    </section>
  `,
})
class QueryEdgeHostComponent {
  readonly open = signal(false);
  readonly queries: string[] = [];
  onQuery(q: string) {
    this.queries.push(q);
  }
}

describe('tng-multi-autocomplete query edge behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('typing emits queryChange with typed value and does not auto-open overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [QueryEdgeHostComponent],
    }).createComponent(QueryEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    expect(host.open()).toBe(false);

    inputText(trigger, 'ap');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.queries.at(-1)).toBe('ap');
    expect(host.open()).toBe(false);
  });

  it('pasting emits queryChange once with the final pasted value', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [QueryEdgeHostComponent],
    }).createComponent(QueryEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    pasteText(trigger, 'banana');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.queries.length).toBe(1);
    expect(host.queries[0]).toBe('banana');
  });

  it('Escape when open closes but does not emit queryChange (no side effects)', async () => {
    @Component({
      imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
      template: `
        <section
          tngMultiAutocomplete
          [open]="open()"
          (openChange)="open.set($event)"
          (queryChange)="onQuery($event)"
        >
          <input tngMultiAutocompleteTrigger [attr.data-testid]="'trigger'" />
        </section>
      `,
    })
    class EscapeHost {
      readonly open = signal(true);
      readonly queries: string[] = [];
      onQuery(q: string) {
        this.queries.push(q);
      }
    }

    const fixture = TestBed.configureTestingModule({
      imports: [EscapeHost],
    }).createComponent(EscapeHost);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    // ensure open
    expect(host.open()).toBe(true);

    // press escape
    const e = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' });
    trigger.dispatchEvent(e);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(host.queries.length).toBe(0);
  });

  it('open-on-focus emits current query; for prefilled input value it emits the input.value', async () => {
    @Component({
      imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
      template: `
        <section
          tngMultiAutocomplete
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

    dispatchFocus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.queries.length).toBe(1);
    expect(host.queries[0]).toBe('Prefilled');
  });
});
