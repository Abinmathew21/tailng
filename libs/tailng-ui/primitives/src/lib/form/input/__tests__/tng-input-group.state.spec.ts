import { Component, isDevMode } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngInput, TngInputGroup } from '../tng-input';

@Component({
  standalone: true,
  imports: [TngInputGroup, TngInput],
  template: `
    <tng-input-group>
      <input
        tngInput
        [disabled]="disabled"
        [ariaInvalid]="ariaInvalid"
      />
    </tng-input-group>
  `,
})
class GroupStateHostComponent {
  public disabled = false;
  public ariaInvalid: boolean | null = null;
}

@Component({
  standalone: true,
  imports: [TngInputGroup, TngInput],
  template: `
    <tng-input-group>
      <input tngInput />
      <input tngInput />
    </tng-input-group>
  `,
})
class GroupMultipleControlsHostComponent {}

describe('tngInputGroup primitive — group state hooks derived from the control', () => {
  it('when the projected tngInput is disabled, group reflects data-disabled', async () => {
    await TestBed.configureTestingModule({ imports: [GroupStateHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(GroupStateHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
    expect(host.getAttribute('data-disabled')).toBe('');
  });

  it('when the projected tngInput is enabled, group omits data-disabled', async () => {
    await TestBed.configureTestingModule({ imports: [GroupStateHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(GroupStateHostComponent);
    fixture.componentInstance.disabled = false;
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
    expect(host.hasAttribute('data-disabled')).toBe(false);
  });

  it('when the projected tngInput is invalid, group reflects data-invalid (ariaInvalid override path)', async () => {
    await TestBed.configureTestingModule({ imports: [GroupStateHostComponent] }).compileComponents();
  
    const fixture = TestBed.createComponent(GroupStateHostComponent);
    fixture.detectChanges();
  
    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
  
    fixture.componentInstance.ariaInvalid = true;
    fixture.changeDetectorRef.detectChanges();
  
    expect(host.getAttribute('data-invalid')).toBe('');
  });

  it('when the projected tngInput is valid, group omits data-invalid (ariaInvalid override path)', async () => {
    await TestBed.configureTestingModule({ imports: [GroupStateHostComponent] }).compileComponents();
  
    const fixture = TestBed.createComponent(GroupStateHostComponent);
    fixture.detectChanges();
  
    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
  
    fixture.componentInstance.ariaInvalid = false;
    fixture.changeDetectorRef.detectChanges();
  
    expect(host.hasAttribute('data-invalid')).toBe(false);
  });

  it('group updates state hooks when the input state changes at runtime', async () => {
    await TestBed.configureTestingModule({ imports: [GroupStateHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(GroupStateHostComponent);
    fixture.detectChanges();

    const host = () =>
      fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;

    fixture.componentInstance.disabled = true;
    fixture.changeDetectorRef.detectChanges();
    expect(host().getAttribute('data-disabled')).toBe('');

    fixture.componentInstance.disabled = false;
    fixture.changeDetectorRef.detectChanges();
    expect(host().hasAttribute('data-disabled')).toBe(false);
  });


  it('group remains stable when multiple inputs are projected (fails safely or enforces single control per contract)', async () => {
    await TestBed.configureTestingModule({ imports: [GroupMultipleControlsHostComponent] }).compileComponents();

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const fixture = TestBed.createComponent(GroupMultipleControlsHostComponent);

    expect(() => fixture.detectChanges()).not.toThrow();

    // If your validation runs after projection settles (microtask), wait for it.
    await fixture.whenStable();
    // optional extra microtask flush in case you used queueMicrotask()
    await Promise.resolve();

    if (isDevMode()) {
      expect(warnSpy).toHaveBeenCalled();
    } else {
      // In prod mode, your code intentionally doesn't warn.
      expect(warnSpy).not.toHaveBeenCalled();
    }

    warnSpy.mockRestore();
  });
});