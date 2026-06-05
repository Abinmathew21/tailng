import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-fileupload-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './fileupload-styling-page.component.html',
  styleUrl: './fileupload-styling-page.component.css',
})
export class FileUploadStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly contractCss = [
    '/* Base drop zone */\n',
    '[tngFileUpload] {',
    '  border: 2px dashed var(--tng-semantic-border-default);',
    '  border-radius: 0.75rem;',
    '  padding: 2rem;',
    '  transition: border-color 0.15s, background 0.15s;',
    '}',
    '',
    '/* Active drag state */\n',
    '[tngFileUpload][data-dragging] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-primary) 8%, transparent);',
    '  border-color: var(--tng-semantic-accent-primary);',
    '}',
    '',
    '/* Disabled state */\n',
    '[tngFileUpload][data-disabled] {',
    '  cursor: not-allowed;',
    '  opacity: 0.55;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
