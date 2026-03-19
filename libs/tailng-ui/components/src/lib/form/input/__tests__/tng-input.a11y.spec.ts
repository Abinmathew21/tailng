import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngInputComponent } from '../tng-input.component';
import { TngInput, TngInputLeading, TngInputTrailing } from '@tailng-ui/primitives';

@Component({
  // Only import TngInputComponent here.
  // It already imports TngInputGroup internally.
  // We only need primitives for the projected content.
  imports: [TngInputComponent, TngInput, TngInputLeading, TngInputTrailing],
  template: `
    <tng-input>
      <span tngInputLeading>Lead</span>
      <input tngInput />
      <span tngInputTrailing>Trail</span>
    </tng-input>
  `,
})
class A11yHostComponent {}

describe('tng-input (styled) — accessibility basics', () => {
  it('does not introduce extra tab stops beyond the actual input control', async () => {
    await TestBed.configureTestingModule({ imports: [A11yHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(A11yHostComponent);
    fixture.detectChanges();
    await fixture.whenStable?.();
    fixture.detectChanges();

    const hostDe = fixture.debugElement.query(By.css('tng-input'));
    const groupDe = fixture.debugElement.query(By.css('tng-input-group'));

    expect(hostDe).not.toBeNull();
    expect(groupDe).not.toBeNull();

    const host = hostDe!.nativeElement as HTMLElement;
    const group = groupDe!.nativeElement as HTMLElement;

    // ✅ Query wrappers created by the primitive group.
    const leadingWrapDe = groupDe!.query(By.css('[data-slot="input-group-leading"]'));
    const controlWrapDe = groupDe!.query(By.css('[data-slot="input-group-control"]'));
    const trailingWrapDe = groupDe!.query(By.css('[data-slot="input-group-trailing"]'));

    expect(leadingWrapDe).not.toBeNull();
    expect(controlWrapDe).not.toBeNull();
    expect(trailingWrapDe).not.toBeNull();

    const leadingWrap = leadingWrapDe!.nativeElement as HTMLElement;
    const controlWrap = controlWrapDe!.nativeElement as HTMLElement;
    const trailingWrap = trailingWrapDe!.nativeElement as HTMLElement;

    // No tabindex attributes injected
    expect(host.hasAttribute('tabindex')).toBe(false);
    expect(group.hasAttribute('tabindex')).toBe(false);
    expect(controlWrap.hasAttribute('tabindex')).toBe(false);
    expect(leadingWrap.hasAttribute('tabindex')).toBe(false);
    expect(trailingWrap.hasAttribute('tabindex')).toBe(false);

    // These wrappers should not be tabbable
    expect(group.tabIndex).toBe(-1);
    expect(controlWrap.tabIndex).toBe(-1);
    expect(leadingWrap.tabIndex).toBe(-1);
    expect(trailingWrap.tabIndex).toBe(-1);

    // Only input should be tabbable in this host (since leading/trailing are spans)
    const root = fixture.nativeElement as HTMLElement;
    const tabbables = Array.from(
      root.querySelectorAll(
        'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
      ) as NodeListOf<HTMLElement>,
    ).filter((el) => !el.hasAttribute('disabled'));

    expect(tabbables).toHaveLength(1);
    expect(tabbables[0].tagName).toBe('INPUT');
  });

  it('leading/trailing wrappers are not focusable unless consumer provides focusable content', async () => {
    await TestBed.configureTestingModule({ imports: [A11yHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(A11yHostComponent);
    fixture.detectChanges(false);
    await fixture.whenStable?.();
    fixture.detectChanges(false);

    const leadingWrap = fixture.debugElement.query(By.css('[data-slot="input-group-leading"]')).nativeElement as HTMLElement;
    const trailingWrap = fixture.debugElement.query(By.css('[data-slot="input-group-trailing"]')).nativeElement as HTMLElement;

    // wrappers should not be made focusable by the component
    expect(leadingWrap.getAttribute('tabindex')).toBeNull();
    expect(trailingWrap.getAttribute('tabindex')).toBeNull();
  });

  it('does not apply aria-live or announcements by default', async () => {
    await TestBed.configureTestingModule({ imports: [A11yHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(A11yHostComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    const group = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;

    expect(host.hasAttribute('aria-live')).toBe(false);
    expect(group.hasAttribute('aria-live')).toBe(false);
  });

  it('does not override ARIA attributes on the projected control by default', async () => {
    @Component({
      imports: [TngInputComponent, TngInput],
      template: `
        <tng-input>
          <input tngInput aria-label="Custom Label" aria-describedby="a b" />
        </tng-input>
      `,
    })
    class ControlAriaHostComponent {}

    await TestBed.configureTestingModule({ imports: [ControlAriaHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ControlAriaHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(inputEl.getAttribute('aria-label')).toBe('Custom Label');
    expect(inputEl.getAttribute('aria-describedby')).toBe('a b');
  });
});
