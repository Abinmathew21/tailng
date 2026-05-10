import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngInputFieldPrefix } from '../tng-adornment';
import { TngInputFieldSuffix } from '../tng-adornment';
import { TngInput } from '../tng-input';
import { TngInputGroup } from '../tng-input-group';

@Component({
  imports: [TngInputGroup, TngInput, TngInputFieldPrefix, TngInputFieldSuffix],
  template: `
    <tng-input-group>
      @if (showLeading) {
        <span tngInputFieldPrefix>Leading</span>
      }

      <input tngInput />

      @if (showTrailing) {
        <span tngInputFieldSuffix>Trailing</span>
      }
    </tng-input-group>
  `,
})
class GroupSlotsHostComponent {
  public showLeading = false;
  public showTrailing = false;
}

@Component({
  imports: [TngInputGroup, TngInput, TngInputFieldPrefix, TngInputFieldSuffix],
  template: `
    <tng-input-group>
      <span tngInputLeading>Leading</span>
      <input tngInput />
      <span tngInputTrailing>Trailing</span>
    </tng-input-group>
  `,
})
class LegacyGroupSlotsHostComponent {}

describe('tngInputGroup primitive — slot markers', () => {
  it('exports the tngInputFieldPrefix directive', async () => {
    expect(TngInputFieldPrefix).toBeTruthy();
  });

  it('exports the tngInputFieldSuffix directive', async () => {
    expect(TngInputFieldSuffix).toBeTruthy();
  });

  it('keeps the legacy directive exports available during the rename', async () => {
    expect(TngInputFieldPrefix).toBeTruthy();
    expect(TngInputFieldSuffix).toBeTruthy();
  });

  it('still accepts the legacy leading and trailing selectors', async () => {
    await TestBed.configureTestingModule({ imports: [LegacyGroupSlotsHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(LegacyGroupSlotsHostComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;

    expect(host.getAttribute('data-has-leading')).toBe('');
    expect(host.getAttribute('data-has-trailing')).toBe('');
    expect(host.querySelector('[data-slot="input-group-leading"]')).toBeTruthy();
    expect(host.querySelector('[data-slot="input-group-trailing"]')).toBeTruthy();
  });

  it('detects presence of a leading slot and sets data-has-leading on the group', async () => {
    await TestBed.configureTestingModule({ imports: [GroupSlotsHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(GroupSlotsHostComponent);
    fixture.componentInstance.showLeading = true;
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;

    expect(host.getAttribute('data-has-leading')).toBe('');
    expect(host.querySelector('[data-slot="input-group-leading"]')).toBeTruthy();
    expect(host.querySelector('[data-slot="input-leading"]')).toBeTruthy();
  });

  it('detects presence of a trailing slot and sets data-has-trailing on the group', async () => {
    await TestBed.configureTestingModule({ imports: [GroupSlotsHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(GroupSlotsHostComponent);
    fixture.componentInstance.showTrailing = true;
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;

    expect(host.getAttribute('data-has-trailing')).toBe('');
    expect(host.querySelector('[data-slot="input-group-trailing"]')).toBeTruthy();
    expect(host.querySelector('[data-slot="input-trailing"]')).toBeTruthy();
  });

  it('removing leading content at runtime clears data-has-leading', async () => {
    await TestBed.configureTestingModule({ imports: [GroupSlotsHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(GroupSlotsHostComponent);
    fixture.componentInstance.showLeading = true;
    fixture.detectChanges();

    let host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
    expect(host.getAttribute('data-has-leading')).toBe('');

    fixture.componentInstance.showLeading = false;
    fixture.changeDetectorRef.detectChanges(); // avoids NG0100 in some setups

    host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
    expect(host.hasAttribute('data-has-leading')).toBe(false);
    expect(host.querySelector('[data-slot="input-group-leading"]')).toBeNull();
  });

  it('removing trailing content at runtime clears data-has-trailing', async () => {
    await TestBed.configureTestingModule({ imports: [GroupSlotsHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(GroupSlotsHostComponent);
    fixture.componentInstance.showTrailing = true;
    fixture.detectChanges();

    let host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
    expect(host.getAttribute('data-has-trailing')).toBe('');

    fixture.componentInstance.showTrailing = false;
    fixture.changeDetectorRef.detectChanges();

    host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
    expect(host.hasAttribute('data-has-trailing')).toBe(false);
    expect(host.querySelector('[data-slot="input-group-trailing"]')).toBeNull();
  });
});
