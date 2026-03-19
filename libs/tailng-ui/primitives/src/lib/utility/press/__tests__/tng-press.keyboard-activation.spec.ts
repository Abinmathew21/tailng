import type { ElementRef} from '@angular/core';
import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngPress } from '../tng-press';

function dispatchKeydown(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

@Component({
  imports: [TngPress],
  template: `
    <a #anchorNoHref tngPress (click)="anchorNoHrefClicks.set(anchorNoHrefClicks() + 1)"
    (keydown)="void 0"
    tabindex="0"
    >No href</a>
    <a #anchorWithHref href="/docs" tngPress (click)="anchorWithHrefClicks.set(anchorWithHrefClicks() + 1)">
      With href
    </a>
  `,
})
class KeyboardActivationHostComponent {
  public readonly anchorNoHrefClicks = signal(0);
  public readonly anchorWithHrefClicks = signal(0);

  @ViewChild('anchorNoHref', { static: true })
  public anchorNoHref!: ElementRef<HTMLAnchorElement>;

  @ViewChild('anchorWithHref', { static: true })
  public anchorWithHref!: ElementRef<HTMLAnchorElement>;
}

describe('tng-press primitive (block 5: keyboard activation normalization)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('pressing Enter on <a tngPress> without href triggers a click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KeyboardActivationHostComponent],
    }).createComponent(KeyboardActivationHostComponent);

    fixture.detectChanges();

    dispatchKeydown(fixture.componentInstance.anchorNoHref.nativeElement, 'Enter');

    expect(fixture.componentInstance.anchorNoHrefClicks()).toBe(1);
  });

  it('pressing Space on <a tngPress> without href triggers a click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KeyboardActivationHostComponent],
    }).createComponent(KeyboardActivationHostComponent);

    fixture.detectChanges();

    dispatchKeydown(fixture.componentInstance.anchorNoHref.nativeElement, ' ');

    expect(fixture.componentInstance.anchorNoHrefClicks()).toBe(1);
  });

  it('prevents default on Space/Enter for anchor-without-href activation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KeyboardActivationHostComponent],
    }).createComponent(KeyboardActivationHostComponent);

    fixture.detectChanges();

    const enterEvent = dispatchKeydown(fixture.componentInstance.anchorNoHref.nativeElement, 'Enter');
    const spaceEvent = dispatchKeydown(fixture.componentInstance.anchorNoHref.nativeElement, ' ');

    expect(enterEvent.defaultPrevented).toBe(true);
    expect(spaceEvent.defaultPrevented).toBe(true);
  });

  it('does not react to non-activation keys on anchor-without-href', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KeyboardActivationHostComponent],
    }).createComponent(KeyboardActivationHostComponent);

    fixture.detectChanges();

    const keyEvent = dispatchKeydown(fixture.componentInstance.anchorNoHref.nativeElement, 'ArrowDown');

    expect(keyEvent.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.anchorNoHrefClicks()).toBe(0);
  });

  it('does not synthesize clicks for <a tngPress href="...">', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [KeyboardActivationHostComponent],
    }).createComponent(KeyboardActivationHostComponent);

    fixture.detectChanges();

    const enterEvent = dispatchKeydown(fixture.componentInstance.anchorWithHref.nativeElement, 'Enter');
    const spaceEvent = dispatchKeydown(fixture.componentInstance.anchorWithHref.nativeElement, ' ');

    expect(enterEvent.defaultPrevented).toBe(false);
    expect(spaceEvent.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.anchorWithHrefClicks()).toBe(0);
  });
});
