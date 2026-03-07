import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngPress, type TngPressAriaHasPopup } from '../tng-press';

@Component({
  standalone: true,
  imports: [TngPress],
  template: `
    <button
      #buttonHost
      tngPress
      [ariaControls]="ariaControls()"
      [ariaExpanded]="ariaExpanded()"
      [ariaPressed]="ariaPressed()"
      [ariaHasPopup]="ariaHasPopup()"
      type="button"
    >
      Trigger
    </button>
  `,
})
class AriaHostComponent {
  public readonly ariaControls = signal<string | null>(null);
  public readonly ariaExpanded = signal<boolean | null>(null);
  public readonly ariaPressed = signal<boolean | null>(null);
  public readonly ariaHasPopup = signal<TngPressAriaHasPopup | string | boolean | null>(null);

  @ViewChild('buttonHost', { static: true })
  public buttonHost!: ElementRef<HTMLButtonElement>;
}

describe('tng-press primitive (block 6: ARIA bindings)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('reflects ariaControls as aria-controls when a non-empty string is provided', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AriaHostComponent] }).createComponent(
      AriaHostComponent,
    );

    fixture.componentInstance.ariaControls.set('menu-panel');
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-controls')).toBe('menu-panel');
  });

  it('omits aria-controls when value is empty/whitespace', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AriaHostComponent] }).createComponent(
      AriaHostComponent,
    );

    fixture.componentInstance.ariaControls.set('   ');
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-controls')).toBeNull();
  });

  it('reflects ariaExpanded=true as aria-expanded="true"', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AriaHostComponent] }).createComponent(
      AriaHostComponent,
    );

    fixture.componentInstance.ariaExpanded.set(true);
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-expanded')).toBe('true');
  });

  it('reflects ariaExpanded=false as aria-expanded="false"', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AriaHostComponent] }).createComponent(
      AriaHostComponent,
    );

    fixture.componentInstance.ariaExpanded.set(false);
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-expanded')).toBe('false');
  });

  it('omits aria-expanded when input is null', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AriaHostComponent] }).createComponent(
      AriaHostComponent,
    );

    fixture.componentInstance.ariaExpanded.set(null);
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-expanded')).toBeNull();
  });

  it('reflects ariaPressed=true as aria-pressed="true"', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AriaHostComponent] }).createComponent(
      AriaHostComponent,
    );

    fixture.componentInstance.ariaPressed.set(true);
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-pressed')).toBe('true');
  });

  it('reflects ariaPressed=false as aria-pressed="false"', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AriaHostComponent] }).createComponent(
      AriaHostComponent,
    );

    fixture.componentInstance.ariaPressed.set(false);
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-pressed')).toBe('false');
  });

  it('omits aria-pressed when input is null', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AriaHostComponent] }).createComponent(
      AriaHostComponent,
    );

    fixture.componentInstance.ariaPressed.set(null);
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-pressed')).toBeNull();
  });

  it('reflects ariaHasPopup with allowed tokens only and omits invalid values', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AriaHostComponent] }).createComponent(
      AriaHostComponent,
    );

    fixture.componentInstance.ariaHasPopup.set('menu');
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-haspopup')).toBe('menu');

    fixture.componentInstance.ariaHasPopup.set('invalid-token');
    fixture.detectChanges();
    expect(fixture.componentInstance.buttonHost.nativeElement.getAttribute('aria-haspopup')).toBeNull();
  });
});
