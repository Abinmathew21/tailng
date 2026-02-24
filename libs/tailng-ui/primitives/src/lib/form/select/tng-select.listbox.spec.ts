import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngSelect } from './tng-select';
import { TngSelectListbox, TngSelectOption } from './tng-select.listbox';
import { TngSelectContent, TngSelectTrigger } from './tng-select.parts';

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

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

@Component({
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectContent,
    TngSelectListbox,
    TngSelectOption,
  ],
  template: `
    <button
      tngSelect
      #api="tngSelect"
      [disabled]="disabled()"
      [value]="value()"
      data-testid="select"
      (valueChange)="value.set($event)"
    >
      <span tngSelectTrigger data-testid="trigger">Trigger</span>

      <div tngSelectContent data-testid="content">
        <div
          tngSelectListbox
          [disabled]="false"
          [value]="value()"
          data-testid="listbox"
        >
          <div tngSelectOption [tngValue]="'a'" data-testid="opt-a">A</div>
          <div tngSelectOption [tngValue]="'b'" data-testid="opt-b">B</div>
          <div tngSelectOption [tngValue]="'c'" data-testid="opt-c">C</div>
        </div>
      </div>
    </button>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngSelect<string>;

  open = signal(false);
  disabled = signal(false);
  value = signal<string | null>(null);

}

describe('tngSelectListbox primitive', () => {

  // ─────────────────────────────────────────────
  // Wiring
  // ─────────────────────────────────────────────
  describe('wiring', () => {
    it('host harness is correctly wired', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();
      const root = fixture.nativeElement as HTMLElement;

      expect(root.querySelector('[data-testid="select"]')).toBeTruthy();
      expect(root.querySelector('[data-testid="trigger"]')).toBeTruthy();
      expect(root.querySelector('[data-testid="content"]')).toBeTruthy();
      expect(root.querySelector('[data-testid="listbox"]')).toBeTruthy();
      expect(root.querySelector('[data-testid="opt-a"]')).toBeTruthy();
      expect(root.querySelector('[data-testid="opt-b"]')).toBeTruthy();
    });
  });

  // ─────────────────────────────────────────────
  // Open / Close behavior
  // ─────────────────────────────────────────────
  describe('open / close behavior', () => {

    it('opens via trigger and reflects aria state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
    
      fixture.detectChanges();
    
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
    
      expect(host.api.open()).toBe(false);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(content.hasAttribute('hidden')).toBe(true);
    
      pointerdown(trigger);
      fixture.detectChanges();
    
      expect(host.api.open()).toBe(true);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(content.hasAttribute('hidden')).toBe(false);

      expect(trigger.getAttribute('role')).toBe('combobox');
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('does not close when clicking inside content (non-option)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      pointerdown(trigger);
      fixture.detectChanges();

      pointerdown(content);
      fixture.detectChanges();

      expect(host.api.open()).toBe(true);
      expect(content.hasAttribute('hidden')).toBe(false);
    });

  });

  // ─────────────────────────────────────────────
  // Selection behavior
  // ─────────────────────────────────────────────
  describe('selection behavior', () => {

    it('selecting an option updates value and closes', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      pointerdown(trigger);
      fixture.detectChanges();

      const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
      pointerdown(optB);
      fixture.detectChanges();

      expect(host.value()).toBe('b');
      expect(host.api.open()).toBe(false);
      expect(content.hasAttribute('hidden')).toBe(true);
    });

    it('keyboard: Enter selects active option and closes', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
      const listbox = fixture.nativeElement.querySelector('[data-testid="listbox"]') as HTMLElement;

      pointerdown(trigger);
      fixture.detectChanges();

      keydown(listbox, 'Home');
      keydown(listbox, 'ArrowDown');
      fixture.detectChanges();

      keydown(listbox, 'Enter');
      fixture.detectChanges();

      expect(host.value()).toBe('b');
      expect(host.api.open()).toBe(false);
      expect(content.hasAttribute('hidden')).toBe(true);
    });

  });

  // ─────────────────────────────────────────────
  // Controlled value behavior
  // ─────────────────────────────────────────────
  describe('controlled value behavior', () => {

    it('programmatic value change while closed does not open', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;

      host.value.set('a');
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.api.open()).toBe(false);
    });

    it('programmatic clear while open does NOT close', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      pointerdown(trigger);
      fixture.detectChanges();

      host.value.set(null);
      fixture.detectChanges();

      expect(host.api.open()).toBe(true);
      expect(content.hasAttribute('hidden')).toBe(false);
    });

  });

  // ─────────────────────────────────────────────
  // Disabled behavior
  // ─────────────────────────────────────────────
  describe('disabled behavior', () => {

    it('cannot open when disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

      host.disabled.set(true);
      fixture.detectChanges();

      pointerdown(trigger);
      fixture.detectChanges();

      expect(host.api.open()).toBe(false);
    });

    it('ignores listbox selection when disabled and stays open', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      pointerdown(trigger);
      fixture.detectChanges();

      host.disabled.set(true);
      fixture.detectChanges();

      const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
      pointerdown(optB);
      fixture.detectChanges();

      expect(host.value()).toBeNull();
      expect(host.api.open()).toBe(true);
      expect(content.hasAttribute('hidden')).toBe(false);
    });

  });

  // ─────────────────────────────────────────────
  // Styling hooks
  // ─────────────────────────────────────────────
  describe('styling hooks', () => {

    it('adds data-slot="select-listbox"', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const listbox = fixture.nativeElement.querySelector('[data-testid="listbox"]') as HTMLElement;
      expect(listbox.getAttribute('data-slot')).toBe('select-listbox');
    });

    it('adds data-slot="select-option"', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
      expect(optA.getAttribute('data-slot')).toBe('select-option');
    });

    it('adds styling hook data-slot="select-option" on ALL options', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
    
      fixture.detectChanges();
    
      const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
      const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
      const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
    
      expect(optA.getAttribute('data-slot')).toBe('select-option');
      expect(optB.getAttribute('data-slot')).toBe('select-option');
      expect(optC.getAttribute('data-slot')).toBe('select-option');
    });

  });

});