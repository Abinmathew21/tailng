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
      @if (showLeading) {
        <span tngInputLeading>Lead</span>
      }

      <input
        tngInput
        [disabled]="disabled"
        [ariaInvalid]="ariaInvalid"
      />

      @if (showTrailing) {
        <span tngInputTrailing>Trail</span>
      }
    </tng-input>
  `,
})
class StatesHostComponent {
  public disabled = false;
  public ariaInvalid: boolean | null = null;
  public showLeading = false;
  public showTrailing = false;
}

describe('tng-input (styled) — interactive visual state hooks', () => {
  function getGroupEl(fixture: any): HTMLElement {
    // The primitive group is rendered inside <tng-input>
    return fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
  }

  it('disabled projected control causes the group to reflect data-disabled', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const group = getGroupEl(fixture);

    host.disabled = false;
    fixture.detectChanges();
    expect(group.hasAttribute('data-disabled')).toBe(false);

    host.disabled = true;
    fixture.detectChanges();
    expect(group.getAttribute('data-disabled')).toBe('');
  });

  it('invalid projected control (via ariaInvalid=true) causes the group to reflect data-invalid', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const group = getGroupEl(fixture);

    host.ariaInvalid = null;
    fixture.detectChanges();
    expect(group.hasAttribute('data-invalid')).toBe(false);

    host.ariaInvalid = true;
    fixture.detectChanges();
    expect(group.getAttribute('data-invalid')).toBe('');

    host.ariaInvalid = false;
    fixture.detectChanges();
    expect(group.hasAttribute('data-invalid')).toBe(false);
  });

  it('focus entering the projected control sets data-focused on the group and clears on blur leaving the group', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    fixture.detectChanges();

    const group = getGroupEl(fixture);
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(group.hasAttribute('data-focused')).toBe(false);

    // Use focusin to match your HostListener('focusin') on the group
    inputEl.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }));
    fixture.detectChanges();
    expect(group.getAttribute('data-focused')).toBe('');

    // Focus leaves group: relatedTarget is outside
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    inputEl.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }));
    fixture.detectChanges();
    expect(group.hasAttribute('data-focused')).toBe(false);

    outside.remove();
  });

  it('leading slot presence results in data-has-leading on the group and no empty wrapper when absent', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const group = getGroupEl(fixture);

    // Initially absent
    expect(group.hasAttribute('data-has-leading')).toBe(false);
    expect(fixture.debugElement.query(By.css('[data-slot="input-group-leading"]'))).toBeNull();

    // Present
    host.showLeading = true;
    fixture.detectChanges();
    expect(group.getAttribute('data-has-leading')).toBe('');
    expect(fixture.debugElement.query(By.css('[data-slot="input-group-leading"]'))).not.toBeNull();

    // Removed runtime
    host.showLeading = false;
    fixture.detectChanges();
    expect(group.hasAttribute('data-has-leading')).toBe(false);
    expect(fixture.debugElement.query(By.css('[data-slot="input-group-leading"]'))).toBeNull();
  });

  it('trailing slot presence results in data-has-trailing on the group and no empty wrapper when absent', async () => {
    await TestBed.configureTestingModule({ imports: [StatesHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(StatesHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const group = getGroupEl(fixture);

    // Initially absent
    expect(group.hasAttribute('data-has-trailing')).toBe(false);
    expect(fixture.debugElement.query(By.css('[data-slot="input-group-trailing"]'))).toBeNull();

    // Present
    host.showTrailing = true;
    fixture.detectChanges();
    expect(group.getAttribute('data-has-trailing')).toBe('');
    expect(fixture.debugElement.query(By.css('[data-slot="input-group-trailing"]'))).not.toBeNull();

    // Removed runtime
    host.showTrailing = false;
    fixture.detectChanges();
    expect(group.hasAttribute('data-has-trailing')).toBe(false);
    expect(fixture.debugElement.query(By.css('[data-slot="input-group-trailing"]'))).toBeNull();
  });
});