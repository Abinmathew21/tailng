import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngPress, type TngPressAriaHasPopup } from '../tng-press';

function dispatchClick(target: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

@Component({
  imports: [TngPress],
  template: `
    <a
      #anchorHost
      tngPress
      [ariaExpanded]="ariaExpanded()"
      [ariaPressed]="ariaPressed()"
      [ariaHasPopup]="ariaHasPopup()"
      [disabled]="disabled()"
      (click)="clickCount.set(clickCount() + 1)"
    >
      Dynamic anchor
    </a>
  `,
})
class DynamicHostComponent {
  public readonly ariaExpanded = signal<boolean | null>(null);
  public readonly ariaPressed = signal<boolean | null>(null);
  public readonly ariaHasPopup = signal<TngPressAriaHasPopup | null>(null);
  public readonly disabled = signal(false);
  public readonly clickCount = signal(0);

  @ViewChild('anchorHost', { static: true })
  public anchorHost!: ElementRef<HTMLAnchorElement>;
}

describe('tng-press primitive (block 9: runtime updates)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('updates aria-expanded when ariaExpanded input changes at runtime', () => {
    const fixture = TestBed.configureTestingModule({ imports: [DynamicHostComponent] }).createComponent(
      DynamicHostComponent,
    );

    fixture.componentInstance.ariaExpanded.set(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('aria-expanded')).toBe('true');

    fixture.componentInstance.ariaExpanded.set(false);
    fixture.detectChanges();
    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('aria-expanded')).toBe('false');
  });

  it('updates aria-pressed when ariaPressed input changes at runtime', () => {
    const fixture = TestBed.configureTestingModule({ imports: [DynamicHostComponent] }).createComponent(
      DynamicHostComponent,
    );

    fixture.componentInstance.ariaPressed.set(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('aria-pressed')).toBe('true');

    fixture.componentInstance.ariaPressed.set(false);
    fixture.detectChanges();
    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('aria-pressed')).toBe('false');
  });

  it('updates aria-haspopup when ariaHasPopup input changes at runtime', () => {
    const fixture = TestBed.configureTestingModule({ imports: [DynamicHostComponent] }).createComponent(
      DynamicHostComponent,
    );

    fixture.componentInstance.ariaHasPopup.set('menu');
    fixture.detectChanges();
    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('aria-haspopup')).toBe('menu');

    fixture.componentInstance.ariaHasPopup.set('dialog');
    fixture.detectChanges();
    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('updates disabled behavior when disabled toggles at runtime', () => {
    const fixture = TestBed.configureTestingModule({ imports: [DynamicHostComponent] }).createComponent(
      DynamicHostComponent,
    );

    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();
    const enabledEvent = dispatchClick(fixture.componentInstance.anchorHost.nativeElement);
    expect(enabledEvent.defaultPrevented).toBe(false);

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const disabledEvent = dispatchClick(fixture.componentInstance.anchorHost.nativeElement);
    expect(disabledEvent.defaultPrevented).toBe(true);
  });

  it('updates anchor tabindex correctly when disabled toggles at runtime', () => {
    const fixture = TestBed.configureTestingModule({ imports: [DynamicHostComponent] }).createComponent(
      DynamicHostComponent,
    );

    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();
    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('tabindex')).toBe('0');

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('tabindex')).toBe('-1');

    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();
    expect(fixture.componentInstance.anchorHost.nativeElement.getAttribute('tabindex')).toBe('0');
  });
});
