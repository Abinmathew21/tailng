import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngPress } from '../tng-press';

@Component({
  imports: [TngPress],
  template: `
    <a #anchorHost tngPress [disabled]="anchorDisabled()">Anchor</a>
    <button #buttonHost type="button" tngPress [disabled]="buttonDisabled()">Button</button>
  `,
})
class AriaDisabledHostComponent {
  public readonly anchorDisabled = signal(false);
  public readonly buttonDisabled = signal(false);

  @ViewChild('anchorHost', { static: true })
  public anchorHost!: ElementRef<HTMLAnchorElement>;

  @ViewChild('buttonHost', { static: true })
  public buttonHost!: ElementRef<HTMLButtonElement>;
}

describe('tng-press primitive (block 7: ARIA disabled semantics)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('sets aria-disabled="true" on disabled anchor hosts', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AriaDisabledHostComponent],
    }).createComponent(AriaDisabledHostComponent);

    fixture.componentInstance.anchorDisabled.set(true);
    fixture.detectChanges();

    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('aria-disabled')).toBe('true');
  });

  it('omits aria-disabled on enabled anchor hosts', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AriaDisabledHostComponent],
    }).createComponent(AriaDisabledHostComponent);

    fixture.componentInstance.anchorDisabled.set(false);
    fixture.detectChanges();

    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('aria-disabled')).toBeNull();
  });

  it('never sets aria-disabled on native <button> hosts (uses native disabled)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AriaDisabledHostComponent],
    }).createComponent(AriaDisabledHostComponent);

    fixture.componentInstance.buttonDisabled.set(true);
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-disabled')).toBeNull();
    expect(fixture.componentInstance.buttonHost.nativeElement.hasAttribute('disabled')).toBe(true);
  });
});
