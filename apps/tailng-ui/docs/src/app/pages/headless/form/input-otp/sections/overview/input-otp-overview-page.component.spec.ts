import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Directive, Input, TemplateRef, contentChildren, inject } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
} from '../../../../../../../../../../../libs/tailng-ui/primitives/src/lib/form/input-otp/tng-input-otp';
import { HeadlessInputOtpOverviewPageComponent } from './input-otp-overview-page.component';

@Component({
  selector: 'tng-code-block',
  standalone: true,
  template: '',
})
class StubCodeBlockComponent {
  @Input() public adapter = '';
  @Input() public code = '';
  @Input() public language = '';
  @Input() public title = '';
  @Input() public theme: unknown;
  @Input() public lineNumbers = false;
  @Input() public wrap = false;
  @Input() public sanitizeHtml = false;
}

@Directive({
  selector: 'ng-template[appDocsExampleVariant]',
  standalone: true,
})
class StubDocsExampleVariantDirective {
  @Input() public value = '';
  @Input() public label = '';
  @Input() public panelTitle = '';
  @Input() public codeTabs: readonly unknown[] = [];
  @Input() public stackblitzUrl: string | null = null;

  public readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'app-docs-example-tabs-section',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  template: `
    @if (variants()[0]; as variant) {
      <ng-container [ngTemplateOutlet]="variant.templateRef" />
    }
  `,
})
class StubDocsExampleTabsSectionComponent {
  @Input() public heading = '';
  @Input() public description = '';
  @Input() public ariaLabel = '';
  @Input() public tabListAriaLabel = '';
  @Input() public defaultValue: string | null = null;
  @Input() public codeBlockTheme: 'github-dark' | 'github-light' = 'github-light';
  @Input() public stackblitzUrl: string | null = null;

  protected readonly variants = contentChildren(StubDocsExampleVariantDirective);
}

function queryPlainSlots(fixture: ComponentFixture<HeadlessInputOtpOverviewPageComponent>): HTMLInputElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll<HTMLInputElement>(
      '.docs-headless-input-otp-overview-plain-slot',
    ),
  );
}

function inputText(target: HTMLInputElement, value: string): void {
  target.value = value;
  target.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

describe('HeadlessInputOtpOverviewPageComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('moves focus to the next textbox after typing one character in the plain example', async () => {
    TestBed.configureTestingModule({
      imports: [HeadlessInputOtpOverviewPageComponent],
    });
    TestBed.overrideComponent(HeadlessInputOtpOverviewPageComponent, {
      set: {
        imports: [
          StubCodeBlockComponent,
          TngInputOtpPrimitive,
          TngInputOtpSlot,
          StubDocsExampleTabsSectionComponent,
          StubDocsExampleVariantDirective,
        ],
      },
    });

    const fixture = TestBed.createComponent(HeadlessInputOtpOverviewPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const slots = queryPlainSlots(fixture);
    expect(slots.length).toBeGreaterThan(1);

    slots[0]!.focus();
    fixture.detectChanges();

    inputText(slots[0]!, '9');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.activeElement).toBe(slots[1]);
  });
});
