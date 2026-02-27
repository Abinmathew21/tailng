import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMultiSelect } from '../tng-multi-select';
import { TngMultiSelectListbox, TngMultiSelectOption } from '../tng-multi-select.listbox';
import { TngSelectContent, TngSelectTrigger } from '../tng-multi-select.parts';

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
    TngMultiSelect,
    TngSelectTrigger,
    TngSelectContent,
    TngMultiSelectListbox,
    TngMultiSelectOption,
  ],
  template: `
    <div
      tngMultiSelect
      #api="tngMultiSelect"
      [disabled]="disabled()"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="multi-select"
    >
      <span tngSelectTrigger data-testid="trigger">Trigger</span>

      <div tngSelectContent data-testid="content">
        <ul tngMultiSelectListbox [multiple]="true" data-testid="listbox">
          <li tngMultiSelectOption [tngValue]="'a'" data-testid="opt-a">A</li>
          <li tngMultiSelectOption [tngValue]="'b'" data-testid="opt-b">B</li>
          <li tngMultiSelectOption [tngValue]="'c'" data-testid="opt-c">C</li>
        </ul>
      </div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngMultiSelect<string>;

  open = signal(false);
  disabled = signal(false);
  value = signal<readonly string[]>([]);
}

describe('tngMultiSelectListbox primitive', () => {
  describe('wiring', () => {
    it('host harness is correctly wired', () => {
      const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;

      expect(root.querySelector('[data-testid="multi-select"]')).toBeTruthy();
      expect(root.querySelector('[data-testid="trigger"]')).toBeTruthy();
      expect(root.querySelector('[data-testid="content"]')).toBeTruthy();
      expect(root.querySelector('[data-testid="listbox"]')).toBeTruthy();
      expect(root.querySelector('[data-testid="opt-a"]')).toBeTruthy();
      expect(root.querySelector('[data-testid="opt-b"]')).toBeTruthy();
    });
  });

  describe('open / close behavior', () => {
    it('opens via trigger and reflects aria state', () => {
      const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
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
    });

    it('does not close when clicking inside content (non-option)', () => {
      const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
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

  describe('selection behavior (multi)', () => {
    it('selecting an option updates value and overlay STAYS OPEN', () => {
      const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      pointerdown(trigger);
      fixture.detectChanges();

      const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
      pointerdown(optB);
      fixture.detectChanges();

      expect(host.value()).toEqual(['b']);
      expect(host.api.open()).toBe(true);
      expect(content.hasAttribute('hidden')).toBe(false);
    });

    it('keyboard: Enter toggles active option and overlay stays open', () => {
      const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
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

      expect(host.value()).toEqual(['b']);
      expect(host.api.open()).toBe(true);
      expect(content.hasAttribute('hidden')).toBe(false);
    });

    it('clicking already-selected option toggles it off (multi mode)', () => {
      const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      host.value.set(['b']);
      fixture.detectChanges();

      pointerdown(trigger);
      fixture.detectChanges();
      expect(host.api.open()).toBe(true);

      const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
      pointerdown(optB);
      fixture.detectChanges();

      expect(host.value()).toEqual([]);
      expect(host.api.open()).toBe(true);
      expect(content.hasAttribute('hidden')).toBe(false);
    });
  });

  describe('controlled value behavior', () => {
    it('programmatic value change while closed does not open', () => {
      const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;

      host.value.set(['a']);
      fixture.detectChanges();

      expect(host.value()).toEqual(['a']);
      expect(host.api.open()).toBe(false);
    });

    it('programmatic clear while open does NOT close', () => {
      const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

      pointerdown(trigger);
      fixture.detectChanges();

      host.value.set([]);
      fixture.detectChanges();

      expect(host.api.open()).toBe(true);
      expect(content.hasAttribute('hidden')).toBe(false);
    });
  });

  describe('styling hooks', () => {
    it('adds data-slot="multi-select-listbox"', () => {
      const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
      fixture.detectChanges();

      const listbox = fixture.nativeElement.querySelector('[data-testid="listbox"]') as HTMLElement;
      expect(listbox.getAttribute('data-slot')).toBe('multi-select-listbox');
    });

    it('adds data-slot="multi-select-option"', () => {
      const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
      fixture.detectChanges();

      const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
      expect(optA.getAttribute('data-slot')).toBe('multi-select-option');
    });
  });
});
