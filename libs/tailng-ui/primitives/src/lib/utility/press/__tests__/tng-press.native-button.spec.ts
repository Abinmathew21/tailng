import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngPress, type TngPressType } from '../tng-press';

@Component({
  standalone: true,
  imports: [TngPress],
  template: `
    <button #buttonHost tngPress [type]="buttonType()" [disabled]="buttonDisabled()">Button</button>
    <a #anchorHost tngPress [type]="anchorType()" [disabled]="anchorDisabled()">Anchor</a>
  `,
})
class NativeButtonHostComponent {
  public readonly buttonType = signal<TngPressType>('submit');
  public readonly buttonDisabled = signal(false);
  public readonly anchorType = signal<TngPressType>('reset');
  public readonly anchorDisabled = signal(false);

  @ViewChild('buttonHost', { static: true })
  public buttonHost!: ElementRef<HTMLButtonElement>;

  @ViewChild('anchorHost', { static: true })
  public anchorHost!: ElementRef<HTMLAnchorElement>;
}

describe('tng-press primitive (block 2: native button behavior)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('applies type only when the host is a native <button>', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NativeButtonHostComponent],
    }).createComponent(NativeButtonHostComponent);

    fixture.detectChanges();

    const buttonHost = fixture.componentInstance.buttonHost.nativeElement;
    const anchorHost = fixture.componentInstance.anchorHost.nativeElement;

    expect(buttonHost.getAttribute('type')).toBe('submit');
    expect(anchorHost.getAttribute('type')).toBeNull();
  });

  it('applies native disabled attribute only when the host is a native <button>', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NativeButtonHostComponent],
    }).createComponent(NativeButtonHostComponent);

    fixture.componentInstance.buttonDisabled.set(true);
    fixture.componentInstance.anchorDisabled.set(true);
    fixture.detectChanges();

    const buttonHost = fixture.componentInstance.buttonHost.nativeElement;
    const anchorHost = fixture.componentInstance.anchorHost.nativeElement;

    expect(buttonHost.hasAttribute('disabled')).toBe(true);
    expect(anchorHost.hasAttribute('disabled')).toBe(false);
  });

  it('does not set role="button" on native <button> hosts', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NativeButtonHostComponent],
    }).createComponent(NativeButtonHostComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('role')).toBeNull();
  });

  it('does not set tabindex on native <button> hosts', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NativeButtonHostComponent],
    }).createComponent(NativeButtonHostComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('tabindex')).toBeNull();
  });
});
