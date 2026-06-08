import { ApplicationRef, NgZone } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Component, Directive, Input, TemplateRef, contentChildren, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  dispatchDrag,
  makeFile,
} from '../../../../../../../libs/tailng-ui/primitives/src/lib/form/file-upload/__tests__/tng-file-upload.test-helpers';

export { dispatchDrag, makeFile };

@Component({
  selector: 'tng-code-block',
  standalone: true,
  template: '',
})
export class StubCodeBlockComponent {
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
export class StubDocsExampleVariantDirective {
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
  imports: [NgTemplateOutlet],
  template: `
    @if (variants()[0]; as variant) {
      <ng-container [ngTemplateOutlet]="variant.templateRef" />
    }
  `,
})
export class StubDocsExampleTabsSectionComponent {
  @Input() public heading = '';
  @Input() public description = '';
  @Input() public ariaLabel = '';
  @Input() public tabListAriaLabel = '';
  @Input() public defaultValue: string | null = null;
  @Input() public codeBlockTheme: 'github-dark' | 'github-light' = 'github-light';
  @Input() public stackblitzUrl: string | null = null;

  protected readonly variants = contentChildren(StubDocsExampleVariantDirective);
}

/** Simulates a native OS file drop that may run outside Angular's zone. */
export function dropFileOutsideAngular(element: HTMLElement, file: File): void {
  const ngZone = TestBed.inject(NgZone);
  const appRef = TestBed.inject(ApplicationRef);

  ngZone.runOutsideAngular(() => {
    dispatchDrag(element, 'dragenter', [file]);
    dispatchDrag(element, 'drop', [file]);
  });

  appRef.tick();
}
