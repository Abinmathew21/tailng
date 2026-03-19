import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngPress } from '../tng-press';

@Component({
  imports: [TngPress],
  template: `
    <a #anchorNoHref tngPress [disabled]="anchorNoHrefDisabled()">No href</a>
    <a #anchorWithHref tngPress href="/docs" [disabled]="anchorWithHrefDisabled()">With href</a>
    <a #anchorDisabled tngPress [disabled]="anchorDisabledDisabled()">Disabled</a>
  `,
})
class AnchorSemanticsHostComponent {
  public readonly anchorNoHrefDisabled = signal(false);
  public readonly anchorWithHrefDisabled = signal(false);
  public readonly anchorDisabledDisabled = signal(true);

  @ViewChild('anchorNoHref', { static: true })
  public anchorNoHref!: ElementRef<HTMLAnchorElement>;

  @ViewChild('anchorWithHref', { static: true })
  public anchorWithHref!: ElementRef<HTMLAnchorElement>;

  @ViewChild('anchorDisabled', { static: true })
  public anchorDisabled!: ElementRef<HTMLAnchorElement>;
}

describe('tng-press primitive (block 3: anchor semantics)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('sets role="button" on <a tngPress> when it has no href', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AnchorSemanticsHostComponent] }).createComponent(
      AnchorSemanticsHostComponent,
    );

    fixture.detectChanges();

    expect(fixture.componentInstance.anchorNoHref.nativeElement.getAttribute('role')).toBe('button');
  });

  it('does not set role="button" on <a tngPress href="...">', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AnchorSemanticsHostComponent] }).createComponent(
      AnchorSemanticsHostComponent,
    );

    fixture.detectChanges();

    expect(fixture.componentInstance.anchorWithHref.nativeElement.getAttribute('role')).toBeNull();
  });

  it('sets tabindex="0" on <a tngPress> when it has no href and is enabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AnchorSemanticsHostComponent] }).createComponent(
      AnchorSemanticsHostComponent,
    );

    fixture.componentInstance.anchorNoHrefDisabled.set(false);
    fixture.detectChanges();

    expect(fixture.componentInstance.anchorNoHref.nativeElement.getAttribute('tabindex')).toBe('0');
  });

  it('leaves tabindex unset on <a tngPress href="..."> when enabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AnchorSemanticsHostComponent] }).createComponent(
      AnchorSemanticsHostComponent,
    );

    fixture.componentInstance.anchorWithHrefDisabled.set(false);
    fixture.detectChanges();

    expect(fixture.componentInstance.anchorWithHref.nativeElement.getAttribute('tabindex')).toBeNull();
  });

  it('sets tabindex="-1" on <a tngPress> when disabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AnchorSemanticsHostComponent] }).createComponent(
      AnchorSemanticsHostComponent,
    );

    fixture.componentInstance.anchorDisabledDisabled.set(true);
    fixture.detectChanges();

    expect(fixture.componentInstance.anchorDisabled.nativeElement.getAttribute('tabindex')).toBe('-1');
  });
});
