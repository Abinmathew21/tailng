import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TngPress } from '../tng-press';

function dispatchClick(target: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

function dispatchKeydown(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

@Component({
  imports: [TngPress],
  template: `
    <section #container (click)="parentClickCount.set(parentClickCount() + 1)">
      <a #anchorHost tngPress [disabled]="anchorDisabled()" (click)="anchorClickCount.set(anchorClickCount() + 1)">
        Anchor
      </a>
      <button
        #buttonHost
        type="button"
        tngPress
        [disabled]="buttonDisabled()"
        (click)="buttonClickCount.set(buttonClickCount() + 1)"
      >
        Button
      </button>
    </section>
  `,
})
class DisabledInteractionHostComponent {
  public readonly anchorDisabled = signal(false);
  public readonly buttonDisabled = signal(false);
  public readonly anchorClickCount = signal(0);
  public readonly buttonClickCount = signal(0);
  public readonly parentClickCount = signal(0);

  @ViewChild('anchorHost', { static: true })
  public anchorHost!: ElementRef<HTMLAnchorElement>;

  @ViewChild('buttonHost', { static: true })
  public buttonHost!: ElementRef<HTMLButtonElement>;

  @ViewChild('container', { static: true })
  public container!: ElementRef<HTMLElement>;
}

describe('tng-press primitive (block 4: disabled interaction blocking)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('prevents default and stops propagation on click when disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledInteractionHostComponent],
    }).createComponent(DisabledInteractionHostComponent);

    fixture.componentInstance.anchorDisabled.set(true);
    fixture.detectChanges();

    const anchorHost = fixture.componentInstance.anchorHost.nativeElement;
    const siblingListener = vi.fn();
    anchorHost.addEventListener('click', siblingListener);

    const clickEvent = dispatchClick(anchorHost);

    expect(clickEvent.defaultPrevented).toBe(true);
    expect(siblingListener).not.toHaveBeenCalled();
    expect(fixture.componentInstance.parentClickCount()).toBe(0);
  });

  it('does not prevent default click when enabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledInteractionHostComponent],
    }).createComponent(DisabledInteractionHostComponent);

    fixture.componentInstance.anchorDisabled.set(false);
    fixture.detectChanges();

    const clickEvent = dispatchClick(fixture.componentInstance.anchorHost.nativeElement);

    expect(clickEvent.defaultPrevented).toBe(false);
  });

  it('disabled anchor does not activate when Enter is pressed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledInteractionHostComponent],
    }).createComponent(DisabledInteractionHostComponent);

    fixture.componentInstance.anchorDisabled.set(true);
    fixture.detectChanges();

    const keyEvent = dispatchKeydown(fixture.componentInstance.anchorHost.nativeElement, 'Enter');

    expect(keyEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.anchorClickCount()).toBe(0);
  });

  it('disabled anchor does not activate when Space is pressed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledInteractionHostComponent],
    }).createComponent(DisabledInteractionHostComponent);

    fixture.componentInstance.anchorDisabled.set(true);
    fixture.detectChanges();

    const keyEvent = dispatchKeydown(fixture.componentInstance.anchorHost.nativeElement, ' ');

    expect(keyEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.anchorClickCount()).toBe(0);
  });

  it('disabled native button does not emit click events (native behavior preserved)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledInteractionHostComponent],
    }).createComponent(DisabledInteractionHostComponent);

    fixture.componentInstance.buttonDisabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.buttonHost.nativeElement.click();

    expect(fixture.componentInstance.buttonClickCount()).toBe(0);
  });
});
