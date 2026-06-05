import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-fileupload-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './fileupload-styling-page.component.html',
  styleUrl: './fileupload-styling-page.component.css',
})
export class HeadlessFileuploadStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly hostStateCode = [
    '[data-file-upload]',
    '[data-dragging]',
    '[data-disabled]',
    '[data-rejected]',
    '',
  ].join('\n');

  protected readonly starterCode = [
    '.docs-dropzone {',
    '  border: 2px dashed var(--tng-semantic-border-strong);',
    '  border-radius: 0.85rem;',
    '  padding: 1.5rem;',
    '  text-align: center;',
    '  transition: background 0.15s ease, border-color 0.15s ease;',
    '}',
    '',
    '.docs-dropzone[data-dragging] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);',
    '  border-color: var(--tng-semantic-accent-brand);',
    '}',
    '',
    '.docs-dropzone[data-disabled] {',
    '  cursor: not-allowed;',
    '  opacity: 0.55;',
    '}',
    '',
  ].join('\n');

  protected readonly statusCode = [
    '<div',
    '  tngFileUpload',
    '  class="docs-dropzone"',
    '  [accept]="\'image/*\'"',
    '  (filesSelected)="onFilesSelected($event)"',
    '  (filesRejected)="onFilesRejected($event)"',
    '></div>',
    '',
    '<p aria-live="polite">{{ statusMessage() }}</p>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
