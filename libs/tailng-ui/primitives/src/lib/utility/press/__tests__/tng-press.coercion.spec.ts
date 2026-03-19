import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  coerceTngPressAriaHasPopup,
  coerceTngPressNullableBoolean,
  TngPress,
} from '../tng-press';

@Component({
  imports: [TngPress],
  template: `<button tngPress disabled="" type="button">Coercion host</button>`,
})
class CoercionDisabledHostComponent {
  @ViewChild(TngPress, { static: true })
  public press!: TngPress;
}

describe('tng-press primitive (block 8: input coercion / transforms)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('coerces empty string aria boolean inputs to true for ariaExpanded', () => {
    expect(coerceTngPressNullableBoolean('')).toBe(true);
  });

  it('coerces string "true" / "false" to booleans for ariaPressed', () => {
    expect(coerceTngPressNullableBoolean('true')).toBe(true);
    expect(coerceTngPressNullableBoolean('false')).toBe(false);
  });

  it('coerces ariaHasPopup=true to "true" and false to "false"', () => {
    expect(coerceTngPressAriaHasPopup(true)).toBe('true');
    expect(coerceTngPressAriaHasPopup(false)).toBe('false');
  });

  it('returns null for invalid ariaHasPopup tokens', () => {
    expect(coerceTngPressAriaHasPopup('not-a-token')).toBeNull();
  });

  it('coerces disabled="" to true via booleanAttribute', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CoercionDisabledHostComponent],
    }).createComponent(CoercionDisabledHostComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.press.disabled()).toBe(true);
  });
});
