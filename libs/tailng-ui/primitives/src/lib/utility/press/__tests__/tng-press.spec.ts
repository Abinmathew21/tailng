import { Component, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngPress } from '../tng-press';

@Component({
  standalone: true,
  imports: [TngPress],
  template: `
    <button #buttonHost tngPress class="consumer-btn alpha" data-track="button">Button</button>
    <a #anchorHost tngPress class="consumer-link beta" data-track="anchor">Anchor</a>
  `,
})
class SmokeHostComponent {
  @ViewChild('buttonHost', { static: true })
  public buttonHost!: ElementRef<HTMLButtonElement>;

  @ViewChild('anchorHost', { static: true })
  public anchorHost!: ElementRef<HTMLAnchorElement>;

  @ViewChildren(TngPress)
  public presses!: { length: number };
}

describe('tng-press primitive (block 1: smoke + exports)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the tngPress primitive directive', () => {
    expect(typeof TngPress).toBe('function');
  });

  it('attaches to a native <button tngPress> host without errors', () => {
    const fixture = TestBed.configureTestingModule({ imports: [SmokeHostComponent] }).createComponent(
      SmokeHostComponent,
    );

    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.tagName).toBe('BUTTON');
    expect(fixture.componentInstance.presses.length).toBe(2);
  });

  it('attaches to an <a tngPress> host without errors', () => {
    const fixture = TestBed.configureTestingModule({ imports: [SmokeHostComponent] }).createComponent(
      SmokeHostComponent,
    );

    fixture.detectChanges();

    expect(fixture.componentInstance.anchorHost.nativeElement.tagName).toBe('A');
    expect(fixture.componentInstance.presses.length).toBe(2);
  });

  it('preserves consumer-provided classes and unrelated attributes on the host', () => {
    const fixture = TestBed.configureTestingModule({ imports: [SmokeHostComponent] }).createComponent(
      SmokeHostComponent,
    );

    fixture.detectChanges();

    const buttonHost = fixture.componentInstance.buttonHost.nativeElement;
    const anchorHost = fixture.componentInstance.anchorHost.nativeElement;

    expect(buttonHost.classList.contains('consumer-btn')).toBe(true);
    expect(buttonHost.classList.contains('alpha')).toBe(true);
    expect(buttonHost.getAttribute('data-track')).toBe('button');

    expect(anchorHost.classList.contains('consumer-link')).toBe(true);
    expect(anchorHost.classList.contains('beta')).toBe(true);
    expect(anchorHost.getAttribute('data-track')).toBe('anchor');
  });
});
