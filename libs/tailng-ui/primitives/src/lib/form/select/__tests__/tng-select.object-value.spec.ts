// libs/tailng-ui/primitives/src/lib/form/select/tng-select.object-value.spec.ts
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngSelect } from '../tng-select';
import { TngSelectTrigger, TngSelectValue, TngSelectIcon, TngSelectContent } from '../tng-select.parts';
import { TngSelectOverlay } from '../tng-select.overlay';
import { TngSelectListbox, TngSelectOption } from '../tng-select.listbox';

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
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  template: `
    <section tngSelect data-testid="root">
      <button tngSelectTrigger type="button" data-testid="trigger">
        <span tngSelectValue data-testid="value">Value</span>
        <span tngSelectIcon aria-hidden="true">▾</span>
      </button>

      <div tngSelectContent data-testid="content">
        <div tngSelectOverlay data-testid="overlay">
          <ul tngSelectListbox data-testid="listbox">
            <li tngSelectOption [tngValue]="optA" data-testid="opt-a">{{ optA.label }}</li>
            <li tngSelectOption [tngValue]="optB" data-testid="opt-b">{{ optB.label }}</li>
            <li
              tngSelectOption
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
  // IMPORTANT: stable object references
  readonly optA: Opt = { id: 1, label: 'Comfortable' };
  readonly optB: Opt = { id: 2, label: 'Compact' };
  readonly optC: Opt = { id: 3, label: 'Dense', disabled: true };
}

describe('tng-select object value (reference equality)', () => {
  it('selects object option (by reference) and updates select.value()', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const select = fixture.debugElement.query(By.directive(TngSelect)).injector.get(TngSelect<Opt>);
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement | null;
  
    // open
    pointerdown(trigger);
    fixture.detectChanges();
  
    // let overlay portal + position microtask run
    await Promise.resolve();
    fixture.detectChanges();
  
    // click option in BODY (portaled)
    const optAInBody = document.body.querySelector('[data-testid="opt-a"]') as HTMLElement | null;
    pointerdown(optAInBody);
    fixture.detectChanges();
  
    expect(select.value()).toBe(host.optA);
  });

  it('reopen reflects selected object via aria-selected=true', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;

    const select = fixture.debugElement.query(By.directive(TngSelect)).injector.get(TngSelect<Opt>);
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    // set selection programmatically (controlled-style)
    select.value.set(host.optA);
    fixture.detectChanges();

    // open
    pointerdown(trigger);
    fixture.detectChanges();

    // overlay is portaled; query from document
    const optAInBody = document.body.querySelector('[data-testid="opt-a"]') as HTMLElement;
    expect(optAInBody).toBeTruthy();

    expect(optAInBody.getAttribute('aria-selected')).toBe('true');
    expect(optAInBody.hasAttribute('data-selected')).toBe(true);
  });
});