// libs/tailng-ui/primitives/src/lib/form/select/tng-select.overlay.focus.spec.ts
import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngSelect } from '../tng-select';
import { TngSelectTrigger, TngSelectContent } from '../tng-select.parts';
import { TngSelectOverlay } from '../tng-select.overlay';

function pointerdown(el: HTMLElement, init: Partial<PointerEventInit> = {}): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...init,
    }),
  );
}

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> = {}): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      ...init,
    }),
  );
}

@Component({
  imports: [TngSelect, TngSelectTrigger, TngSelectContent, TngSelectOverlay],
  template: `
    <button data-testid="outside">Outside</button>

    <button
      tngSelect
      #api="tngSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="select"
    >
      <span tngSelectTrigger data-testid="trigger">Trigger</span>

      <!-- overlay wraps content; overlay portals to body when open -->
      <div tngSelectOverlay data-testid="overlay">
        <div tngSelectContent data-testid="content">
          <button data-testid="inside" type="button">Inside</button>
        </div>
      </div>
    </button>
  `,
})
class FocusHostComponent {
  @ViewChild('api', { static: true }) api!: TngSelect<string>;
  open = signal(false);
  value = signal<string | null>(null);
}

describe('tng-select overlay focus restoration', () => {
  it('restores focus to trigger when closing while focus is inside overlay', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [FocusHostComponent] }).createComponent(
      FocusHostComponent,
    );
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    // open
    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.api.open()).toBe(true);

    // overlay is portaled; query from document
    const inside = document.body.querySelector('[data-testid="inside"]') as HTMLButtonElement;
    expect(inside).toBeTruthy();

    // focus something inside overlay
    inside.focus();
    expect(document.activeElement).toBe(inside);

    // close via Escape (handled by trigger)
    keydown(trigger, { key: 'Escape' });
    fixture.detectChanges();

    expect(host.api.open()).toBe(false);

    // focus should be restored
    expect(document.activeElement).toBe(trigger);
  });

  it('does not steal focus when closing if focus is outside overlay', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [FocusHostComponent] }).createComponent(
      FocusHostComponent,
    );
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;

    // open
    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.api.open()).toBe(true);

    // focus outside (simulate user clicked elsewhere)
    outside.focus();
    expect(document.activeElement).toBe(outside);

    // close programmatically (controlled)
    host.open.set(false);
    fixture.detectChanges();

    expect(host.api.open()).toBe(false);

    // focus should remain outside
    expect(document.activeElement).toBe(outside);
  });
});