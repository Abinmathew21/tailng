import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngListboxDirective } from '../listbox.directive';
import { TngOptionDirective } from '../option.directive';

function dispatchFocusIn(el: HTMLElement): void {
  el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
}

function dispatchKey(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

@Component({
  imports: [TngListboxDirective, TngOptionDirective],
  template: `
    <ul tngListbox data-testid="listbox">
      <li tngOption [tngValue]="'albania'">Albania</li>
      <li tngOption [tngValue]="'canada'">Canada</li>
      <li tngOption [tngValue]="'denmark'">Denmark</li>
    </ul>
  `,
})
class TypeaheadDefaultHostComponent {}

@Component({
  imports: [TngListboxDirective, TngOptionDirective],
  template: `
    <ul tngListbox [typeahead]="false" data-testid="listbox">
      <li tngOption [tngValue]="'albania'">Albania</li>
      <li tngOption [tngValue]="'canada'">Canada</li>
      <li tngOption [tngValue]="'denmark'">Denmark</li>
    </ul>
  `,
})
class TypeaheadDisabledHostComponent {}

@Component({
  imports: [TngListboxDirective, TngOptionDirective],
  template: `
    <ul tngListbox data-testid="lb">
      <li tngOption [tngValue]="'a'">Apple</li>
      <li tngOption [tngValue]="'b'">Banana</li>
      <li tngOption [tngValue]="'c'">Cherry</li>
    </ul>
  `,
})
class TypeaheadEnabledHost {}

@Component({
  imports: [TngListboxDirective, TngOptionDirective],
  template: `
    <ul tngListbox [typeahead]="false" data-testid="lb">
      <li tngOption [tngValue]="'a'">Apple</li>
      <li tngOption [tngValue]="'b'">Banana</li>
      <li tngOption [tngValue]="'c'">Cherry</li>
    </ul>
  `,
})
class TypeaheadDisabledHost {}

describe('tng-listbox typeahead toggle', () => {
  it('default (typeahead=true): printable key moves active option', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TypeaheadDefaultHostComponent],
    }).createComponent(TypeaheadDefaultHostComponent);

    fixture.detectChanges();

    const listbox = fixture.nativeElement.querySelector(
      '[data-testid="listbox"]',
    ) as HTMLElement;

    // ensure it has an active option (focusin triggers ensureActive -> Home)
    dispatchFocusIn(listbox);
    fixture.detectChanges();

    const options = Array.from(
      fixture.nativeElement.querySelectorAll('[role="option"][id]'),
    ) as HTMLElement[];

    const canada = options.find((el) =>
      (el.textContent ?? '').trim().toLowerCase().startsWith('canada'),
    );
    expect(canada).toBeTruthy();

    dispatchKey(listbox, 'c');
    fixture.detectChanges();

    expect(listbox.getAttribute('aria-activedescendant')).toBe(canada!.id);
  });

  it('typeahead=false: printable key does NOT move active option', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TypeaheadDisabledHostComponent],
    }).createComponent(TypeaheadDisabledHostComponent);

    fixture.detectChanges();

    const listbox = fixture.nativeElement.querySelector(
      '[data-testid="listbox"]',
    ) as HTMLElement;

    // focus to establish initial active
    dispatchFocusIn(listbox);
    fixture.detectChanges();

    const before = listbox.getAttribute('aria-activedescendant');

    dispatchKey(listbox, 'c');
    fixture.detectChanges();

    const after = listbox.getAttribute('aria-activedescendant');
    expect(after).toBe(before);
  });

  it('typeahead=true (default) moves active on printable key', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TypeaheadEnabledHost],
    }).createComponent(TypeaheadEnabledHost);

    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const lbDe = fixture.debugElement.query(By.directive(TngListboxDirective));
    const lb = lbDe.injector.get(TngListboxDirective<string>);
    const hostEl = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;

    // Ensure active is set (focusin path)
    hostEl.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();

    // Press "b" -> should typeahead to "Banana"
    dispatchKey(hostEl, 'b');
    fixture.detectChanges();

    const activeId = lb.getActiveId();
    expect(activeId).toBeTruthy();

    const activeEl = activeId
      ? (fixture.nativeElement.querySelector(`#${activeId}`) as HTMLElement | null)
      : null;

    expect(activeEl?.textContent?.trim()).toBe('Banana');
  });

  it('typeahead=false does NOT move active on printable key', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TypeaheadDisabledHost],
    }).createComponent(TypeaheadDisabledHost);

    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const lbDe = fixture.debugElement.query(By.directive(TngListboxDirective));
    const lb = lbDe.injector.get(TngListboxDirective<string>);
    const hostEl = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;

    // Ensure active is set (focusin selects first enabled => Apple)
    hostEl.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();

    const beforeId = lb.getActiveId();
    const beforeEl = beforeId
      ? (fixture.nativeElement.querySelector(`#${beforeId}`) as HTMLElement | null)
      : null;

    expect(beforeEl?.textContent?.trim()).toBe('Apple');

    // Press "b" -> must NOT typeahead to Banana
    dispatchKey(hostEl, 'b');
    fixture.detectChanges();

    const afterId = lb.getActiveId();
    const afterEl = afterId
      ? (fixture.nativeElement.querySelector(`#${afterId}`) as HTMLElement | null)
      : null;

    expect(afterEl?.textContent?.trim()).toBe('Apple');
  });
});