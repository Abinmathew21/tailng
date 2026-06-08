import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { TngFileUploadDirective } from '@tailng-ui/primitives';
import { afterEach, describe, expect, it } from 'vitest';

import {
  StubDocsExampleTabsSectionComponent,
  StubDocsExampleVariantDirective,
  dropFileOutsideAngular,
  makeFile,
} from '../../../../../../shared/testing/docs-fileupload-drag.util';
import { FileUploadExamplesPageComponent } from './fileupload-examples-page.component';

describe('FileUploadExamplesPageComponent', () => {
  let fixture: ComponentFixture<FileUploadExamplesPageComponent>;

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function renderPage(): void {
    TestBed.configureTestingModule({
      imports: [FileUploadExamplesPageComponent],
    });
    TestBed.overrideComponent(FileUploadExamplesPageComponent, {
      set: {
        imports: [
          TngFileUploadDirective,
          StubDocsExampleTabsSectionComponent,
          StubDocsExampleVariantDirective,
        ],
      },
    });

    fixture = TestBed.createComponent(FileUploadExamplesPageComponent);
    fixture.autoDetectChanges(true);
  }

  it('shows the accepted file immediately after an outside-zone drop on the image example', () => {
    renderPage();

    const zone = fixture.nativeElement.querySelector('.image-drop-zone') as HTMLElement | null;
    expect(zone).not.toBeNull();

    dropFileOutsideAngular(zone!, makeFile('docs-image.png', 'image/png'));

    const status = fixture.nativeElement.querySelector('.upload-status');
    expect(status).not.toBeNull();
    expect(status!.textContent).toContain('docs-image.png');
  });

  it('clears data-dragging on the image example after drop', () => {
    renderPage();

    const zone = fixture.nativeElement.querySelector('.image-drop-zone') as HTMLElement | null;
    expect(zone).not.toBeNull();

    dropFileOutsideAngular(zone!, makeFile('docs-image.png', 'image/png'));

    expect(zone!.hasAttribute('data-dragging')).toBe(false);
  });
});
