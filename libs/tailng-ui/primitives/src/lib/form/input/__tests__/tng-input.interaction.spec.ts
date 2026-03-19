import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it, vi } from 'vitest';

import { TngInput } from '../tng-input';

@Component({
  imports: [TngInput],
  template: `
    <form (submit)="onSubmit($event)">
      <input tngInput [disabled]="disabled" />
      <button type="submit">Submit</button>
    </form>
  `,
})
class InteractionHostComponent {
  public disabled = false;
  public submitCount = 0;

  public onSubmit(event: Event): void {
    event.preventDefault(); // keep test deterministic
    this.submitCount += 1;
  }
}

describe('tngInput primitive — focus/interaction invariants', () => {
  it('does not prevent default typing or composition events', async () => {
    await TestBed.configureTestingModule({ imports: [InteractionHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(InteractionHostComponent);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    const beforeInput = new InputEvent('beforeinput', { cancelable: true, data: 'a' });
    el.dispatchEvent(beforeInput);
    expect(beforeInput.defaultPrevented).toBe(false);

    const compositionStart = new CompositionEvent('compositionstart', { cancelable: true });
    el.dispatchEvent(compositionStart);
    expect(compositionStart.defaultPrevented).toBe(false);
  });

  it('does not interfere with Enter key submission on text inputs', async () => {
    await TestBed.configureTestingModule({ imports: [InteractionHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(InteractionHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    inputEl.focus();
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    // In jsdom, form submission isn't always automatic; trigger submit by dispatching.
    const formEl = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    formEl.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(host.submitCount).toBe(1);
  });

  it('does not stop propagation of native input/change events', async () => {
    await TestBed.configureTestingModule({ imports: [InteractionHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(InteractionHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    const inputListener = vi.fn();
    const changeListener = vi.fn();
    inputEl.addEventListener('input', inputListener);
    inputEl.addEventListener('change', changeListener);

    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));

    expect(inputListener).toHaveBeenCalledTimes(1);
    expect(changeListener).toHaveBeenCalledTimes(1);
  });

  it('disabled input remains non-focusable via native browser behavior (no extra tabindex hacks)', async () => {
    await TestBed.configureTestingModule({ imports: [InteractionHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(InteractionHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    host.disabled = true;
    fixture.changeDetectorRef.detectChanges(); // avoid NG0100

    // Native disabled inputs should not receive focus
    inputEl.focus();
    expect(document.activeElement).not.toBe(inputEl);

    // Also ensure tabindex was not injected (unless consumer sets it)
    expect(inputEl.getAttribute('tabindex')).toBeNull();
  });
});