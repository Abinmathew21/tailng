// tng-multi-select.object-value.spec.ts
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngMultiSelect } from '../tng-multi-select';
import { TngSelectTrigger, TngSelectValue, TngSelectIcon, TngSelectContent } from '../tng-multi-select.parts';
import { TngSelectOverlay } from '../tng-multi-select.overlay';
import { TngMultiSelectListbox, TngMultiSelectOption } from '../tng-multi-select.listbox';

type Opt = Readonly<{ id: number; label: string; disabled?: boolean }>;

function pointerdown(el: HTMLElement | null, init: Partial<PointerEventInit> = {}) {
  expect(el, 'pointerdown target was null (querySelector failed)').toBeTruthy();

  (el as HTMLElement).dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...init,
    }),
  );
}

@Component({
  imports: [
    TngMultiSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngMultiSelectListbox,
    TngMultiSelectOption,
  ],
  template: `
    <section tngMultiSelect data-testid="root" [value]="value()" (valueChange)="value.set($event)">
      <button tngSelectTrigger type="button" data-testid="trigger">
        <span tngSelectValue data-testid="value">Value</span>
        <span tngSelectIcon aria-hidden="true">▾</span>
      </button>

      <div tngSelectContent data-testid="content">
        <div tngSelectOverlay data-testid="overlay">
          <ul tngMultiSelectListbox [multiple]="true" data-testid="listbox">
            <li tngMultiSelectOption [tngValue]="optA" data-testid="opt-a">{{ optA.label }}</li>
            <li tngMultiSelectOption [tngValue]="optB" data-testid="opt-b">{{ optB.label }}</li>
            <li
              tngMultiSelectOption
              [tngValue]="optC"
              [disabled]="true"
              data-testid="opt-c"
            >
              {{ optC.label }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
class HostComponent {
  readonly optA: Opt = { id: 1, label: 'Comfortable' };
  readonly optB: Opt = { id: 2, label: 'Compact' };
  readonly optC: Opt = { id: 3, label: 'Dense', disabled: true };
  value = signal<readonly Opt[]>([]);
}

describe('tng-multi-select object value (reference equality)', () => {
  it('selects object option (by reference) and adds to value array', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const select = fixture.debugElement
      .query(By.directive(TngMultiSelect))
      .injector.get(TngMultiSelect<Opt>);
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement | null;

    pointerdown(trigger);
    fixture.detectChanges();

    await Promise.resolve();
    fixture.detectChanges();

    const optAInBody = document.body.querySelector('[data-testid="opt-a"]') as HTMLElement | null;
    pointerdown(optAInBody);
    fixture.detectChanges();

    expect(select.value()).toContain(host.optA);
    expect(select.value().length).toBe(1);
  });

  it('toggles second object option and both are in value', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const select = fixture.debugElement
      .query(By.directive(TngMultiSelect))
      .injector.get(TngMultiSelect<Opt>);
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    pointerdown(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const optA = document.body.querySelector('[data-testid="opt-a"]') as HTMLElement;
    pointerdown(optA);
    fixture.detectChanges();

    expect(select.value()).toContain(host.optA);

    const optB = document.body.querySelector('[data-testid="opt-b"]') as HTMLElement;
    pointerdown(optB);
    fixture.detectChanges();

    expect(select.value()).toContain(host.optA);
    expect(select.value()).toContain(host.optB);
    expect(select.value().length).toBe(2);
  });

  it('reopen reflects selected objects via aria-selected=true', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;

    const select = fixture.debugElement
      .query(By.directive(TngMultiSelect))
      .injector.get(TngMultiSelect<Opt>);
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    select.value.set([host.optA]);
    fixture.detectChanges();

    pointerdown(trigger);
    fixture.detectChanges();

    const optAInBody = document.body.querySelector('[data-testid="opt-a"]') as HTMLElement;
    expect(optAInBody).toBeTruthy();

    expect(optAInBody.getAttribute('aria-selected')).toBe('true');
    expect(optAInBody.hasAttribute('data-selected')).toBe(true);
  });
});
