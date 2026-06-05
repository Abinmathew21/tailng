import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-fileupload-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './fileupload-api-page.component.html',
  styleUrl: './fileupload-api-page.component.css',
})
export class HeadlessFileuploadApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly selectorCode = [
    '<div',
    '  tngFileUpload',
    '  [accept]="\'image/*,.pdf\'"',
    '  [maxSize]="5 * 1024 * 1024"',
    '  (filesSelected)="onFilesSelected($event)"',
    '></div>',
    '',
  ].join('\n');

  protected readonly validationCode = [
    '// filesSelected → { files: File[]; source: "drop" | "input" }',
    '// filesRejected → { rejected: TngFileUploadRejectedFile[]; accepted: File[]; source }',
    '',
    'protected onFilesRejected(event: TngFileUploadRejectedEvent): void {',
    '  for (const item of event.rejected) {',
    '    // item.reason: "type" | "size" | "multiple" | "disabled" | "empty"',
    '    console.warn(item.reason, item.message, item.file.name);',
    '  }',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
