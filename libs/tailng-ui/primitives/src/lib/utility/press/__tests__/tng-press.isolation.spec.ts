import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngPress } from '../tng-press';

function dispatchClick(target: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

@Component({
  imports: [TngPress],
  template: `
    <button #firstButton tngPress type="button" [ariaExpanded]="firstExpanded()" [disabled]="firstDisabled()">
      First button
    </button>
    <a #secondAnchor tngPress [ariaExpanded]="secondExpanded()" [disabled]="secondDisabled()">Second anchor</a>
    <button #thirdButton tngPress type="button" [disabled]="thirdDisabled()">Third button</button>
  `,
})
class IsolationHostComponent {
  public readonly firstExpanded = signal<boolean | null>(true);
  public readonly secondExpanded = signal<boolean | null>(null);
  public readonly firstDisabled = signal(false);
  public readonly secondDisabled = signal(false);
  public readonly thirdDisabled = signal(false);

  @ViewChild('firstButton', { static: true })
  public firstButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('secondAnchor', { static: true })
  public secondAnchor!: ElementRef<HTMLAnchorElement>;

  @ViewChild('thirdButton', { static: true })
  public thirdButton!: ElementRef<HTMLButtonElement>;
}

describe('tng-press primitive (block 10: isolation across multiple instances)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('multiple instances do not leak ARIA attributes across hosts', () => {
    const fixture = TestBed.configureTestingModule({ imports: [IsolationHostComponent] }).createComponent(
      IsolationHostComponent,
    );

    fixture.detectChanges();

    const firstButton = fixture.componentInstance.firstButton.nativeElement;
    const secondAnchor = fixture.componentInstance.secondAnchor.nativeElement;
    const thirdButton = fixture.componentInstance.thirdButton.nativeElement;

    expect(firstButton.getAttribute('aria-expanded')).toBe('true');
    expect(secondAnchor.getAttribute('aria-expanded')).toBeNull();
    expect(thirdButton.getAttribute('aria-expanded')).toBeNull();
  });

  it('disabling one instance does not affect click behavior of another', () => {
    const fixture = TestBed.configureTestingModule({ imports: [IsolationHostComponent] }).createComponent(
      IsolationHostComponent,
    );

    fixture.componentInstance.firstDisabled.set(true);
    fixture.componentInstance.secondDisabled.set(false);
    fixture.detectChanges();

    const firstEvent = dispatchClick(fixture.componentInstance.firstButton.nativeElement);
    const secondEvent = dispatchClick(fixture.componentInstance.secondAnchor.nativeElement);

    expect(firstEvent.defaultPrevented).toBe(true);
    expect(secondEvent.defaultPrevented).toBe(false);
  });

  it('generated behavior remains correct when mixed <button> and <a> hosts exist together', () => {
    const fixture = TestBed.configureTestingModule({ imports: [IsolationHostComponent] }).createComponent(
      IsolationHostComponent,
    );

    fixture.detectChanges();

    const firstButton = fixture.componentInstance.firstButton.nativeElement;
    const secondAnchor = fixture.componentInstance.secondAnchor.nativeElement;
    const thirdButton = fixture.componentInstance.thirdButton.nativeElement;

    expect(firstButton.getAttribute('type')).toBe('button');
    expect(secondAnchor.getAttribute('role')).toBe('button');
    expect(secondAnchor.getAttribute('tabindex')).toBe('0');
    expect(thirdButton.getAttribute('type')).toBe('button');
  });
});
