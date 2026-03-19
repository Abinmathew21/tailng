import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMultiSelect } from '../tng-multi-select';
import { TngSelectContent, TngSelectTrigger } from '../tng-multi-select.parts';
import { TngMultiSelectListbox, TngMultiSelectOption } from '../tng-multi-select.listbox';

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
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="multi-select"
      [disabled]="disabled()"
    >
      <button tngSelectTrigger data-testid="trigger">Trigger</button>

      <div tngSelectContent data-testid="content">
        <ul tngMultiSelectListbox [multiple]="true" data-testid="listbox">
          <li tngMultiSelectOption [tngValue]="'a'" data-testid="opt-a">A</li>
          <li tngMultiSelectOption [tngValue]="'b'" [disabled]="optBDisabled()" data-testid="opt-b">B</li>
          <li tngMultiSelectOption [tngValue]="'c'" data-testid="opt-c">C</li>
        </ul>
      </div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngMultiSelect<string>;
  open = signal(false);
  value = signal<readonly string[]>([]);
  disabled = signal(false);
  optBDisabled = signal(false);
}

describe('tng-multi-select value primitive', () => {
  it('selecting an option adds to value and overlay stays open', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    host.optBDisabled.set(false);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);

    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    pointerdown(optB);
    fixture.detectChanges();

    expect(host.value()).toEqual(['b']);
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('clicking second option adds to selection (toggle add)', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    host.value.set(['b']);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    pointerdown(trigger);
    fixture.detectChanges();

    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    pointerdown(optA);
    fixture.detectChanges();

    expect(host.value()).toEqual(expect.arrayContaining(['a', 'b']));
    expect(host.value().length).toBe(2);
  });

  it('clicking already-selected option toggles it off (multi mode)', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    host.value.set(['b']);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
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

  it('does NOT auto-open when value changes programmatically while closed', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);

    host.value.set(['c']);
    fixture.detectChanges();

    expect(host.value()).toEqual(['c']);
    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  it('programmatic clear (value -> []) while open keeps the list open', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

    pointerdown(trigger);
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);

    host.value.set([]);
    fixture.detectChanges();

    expect(host.value()).toEqual([]);
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('does not select a disabled option and keeps overlay open', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    host.optBDisabled.set(true);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.open()).toBe(true);

    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    pointerdown(optB);
    fixture.detectChanges();

    expect(host.value()).toEqual([]);
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('does not open via trigger pointerdown when disabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

    host.disabled.set(true);
    fixture.detectChanges();

    pointerdown(trigger);
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);
  });
});
