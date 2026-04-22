import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

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
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly contractCss = [
    'tng-copy-button > .tng-copy-button[data-appearance="solid"] {',
    '  background: var(--tng-semantic-accent-brand);',
    '  color: var(--tng-color-white);',
    '}',
    '',
    'tng-copy-button > .tng-copy-button[data-state="copied"] {',
    '  background: var(--tng-semantic-accent-success);',
    '  border-color: transparent;',
    '}',
    '',
    'tng-copy-button > .tng-copy-button[data-state="error"] {',
    '  background: var(--tng-semantic-accent-danger);',
    '  border-color: transparent;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
