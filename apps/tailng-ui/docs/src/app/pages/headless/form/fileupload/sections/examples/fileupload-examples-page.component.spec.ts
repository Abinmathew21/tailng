import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { TngFileUploadDirective } from '@tailng-ui/primitives';
import { afterEach, describe, expect, it } from 'vitest';

import {
  StubDocsExampleTabsSectionComponent,
  StubDocsExampleVariantDirective,
  dropFileOutsideAngular,
  makeFile,
} from '../../../../../../shared/testing/docs-fileupload-drag.util';
import { HeadlessFileuploadExamplesPageComponent } from './fileupload-examples-page.component';

describe('HeadlessFileuploadExamplesPageComponent', () => {
  let fixture: ComponentFixture<HeadlessFileuploadExamplesPageComponent>;

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function renderPage(): void {
    TestBed.configureTestingModule({
      imports: [HeadlessFileuploadExamplesPageComponent],
    });
    TestBed.overrideComponent(HeadlessFileuploadExamplesPageComponent, {
      set: {
        imports: [
          TngFileUploadDirective,
          StubDocsExampleTabsSectionComponent,
          StubDocsExampleVariantDirective,
        ],
      },
    });

    fixture = TestBed.createComponent(HeadlessFileuploadExamplesPageComponent);
    fixture.autoDetectChanges(true);
  }

  it('lists the accepted file immediately after an outside-zone drop on the basic example', () => {
    renderPage();

    const zone = fixture.nativeElement.querySelector(
      '.headless-fileupload-zone',
    ) as HTMLElement | null;
    expect(zone).not.toBeNull();

    dropFileOutsideAngular(zone!, makeFile('docs-basic.txt', 'text/plain'));

    const items = Array.from(
      fixture.nativeElement.querySelectorAll('.headless-fileupload-list li'),
    );
    expect(items).toHaveLength(1);
    expect(items[0]?.textContent).toContain('docs-basic.txt');
  });

  it('clears data-dragging on the basic example after drop', () => {
    renderPage();

    const zone = fixture.nativeElement.querySelector(
      '.headless-fileupload-zone',
    ) as HTMLElement | null;
    expect(zone).not.toBeNull();

    dropFileOutsideAngular(zone!, makeFile('docs-basic.txt', 'text/plain'));

    expect(zone!.hasAttribute('data-dragging')).toBe(false);
  });
});
