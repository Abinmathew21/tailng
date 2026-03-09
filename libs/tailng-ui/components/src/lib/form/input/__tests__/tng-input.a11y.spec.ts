import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngInputComponent } from '../tng-input.component';
import { TngInput, TngInputLeading, TngInputTrailing } from '@tailng-ui/primitives';

@Component({
  standalone: true,
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
    await fixture.whenStable?.(); // safe even if not needed
    fixture.detectChanges();
  
    const hostDe = fixture.debugElement.query(By.css('tng-input'));
    const groupDe = fixture.debugElement.query(By.css('tng-input-group'));
  
    expect(hostDe).not.toBeNull();
    expect(groupDe).not.toBeNull();
  
    const host = hostDe!.nativeElement as HTMLElement;
    const group = groupDe!.nativeElement as HTMLElement;
  
    // Scope slot queries to the group
    const controlWrapDe = groupDe!.query(By.css('[data-slot="input-group-control"]'));
    const leadingWrapDe = groupDe!.query(By.css('[data-slot="input-group-leading"]'));
    const trailingWrapDe = groupDe!.query(By.css('[data-slot="input-group-trailing"]'));
  
    expect(controlWrapDe).not.toBeNull();
    expect(leadingWrapDe).not.toBeNull();
    expect(trailingWrapDe).not.toBeNull();
  
    const controlWrap = controlWrapDe!.nativeElement as HTMLElement;
    const leadingWrap = leadingWrapDe!.nativeElement as HTMLElement;
    const trailingWrap = trailingWrapDe!.nativeElement as HTMLElement;
  
    // Quick smoke check: no tabindex attributes injected
    expect(host.hasAttribute('tabindex')).toBe(false);
    expect(group.hasAttribute('tabindex')).toBe(false);
    expect(controlWrap.hasAttribute('tabindex')).toBe(false);
    expect(leadingWrap.hasAttribute('tabindex')).toBe(false);
    expect(trailingWrap.hasAttribute('tabindex')).toBe(false);
  
    // Stronger check: these wrappers are not in tab order
    expect(group.tabIndex).toBe(-1);
    expect(controlWrap.tabIndex).toBe(-1);
    expect(leadingWrap.tabIndex).toBe(-1);
    expect(trailingWrap.tabIndex).toBe(-1);
    const root = fixture.nativeElement as HTMLElement;

    const tabbables = Array.from(
      root.querySelectorAll(
        'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
      ) as NodeListOf<HTMLElement>,
    ).filter((el) => !el.hasAttribute('disabled'));
  
    // Expect exactly 1 tabbable: the input
    expect(tabbables.length).toBe(1);
    expect(tabbables[0].tagName).toBe('INPUT');
  });
});