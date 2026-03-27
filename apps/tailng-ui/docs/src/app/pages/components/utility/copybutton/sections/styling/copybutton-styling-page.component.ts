import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-copybutton-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './copybutton-styling-page.component.html',
  styleUrl: './copybutton-styling-page.component.css',
})
export class CopybuttonStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly contractCss = [
    '.docs-copy-button[data-appearance="solid"] {',
    '  background: var(--tng-semantic-accent-brand);',
    '  color: var(--tng-color-white);',
    '}',
    '',
    '.docs-copy-button[data-state="copied"] {',
    '  background: var(--tng-semantic-accent-success);',
    '}',
    '',
    '.docs-copy-button[data-state="error"] {',
    '  background: var(--tng-semantic-accent-danger);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
