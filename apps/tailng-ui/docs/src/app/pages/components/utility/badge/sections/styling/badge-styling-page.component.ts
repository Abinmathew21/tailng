import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-badge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './badge-styling-page.component.html',
  styleUrl: './badge-styling-page.component.css',
})
export class BadgeStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly contractCss = [
    '.tng-badge-host {',
    '  position: relative;',
    '}',
    '',
    '.tng-badge[data-tone="success"][data-variant="soft"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-success) 18%, transparent);',
    '  color: var(--tng-semantic-accent-success);',
    '}',
    '',
    '.tng-badge[data-variant="outline"] {',
    '  background: var(--tng-semantic-background-base);',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '}',
    '',
    '.tng-badge[data-dot] {',
    '  min-height: 0.56rem;',
    '  min-width: 0.56rem;',
    '  padding: 0;',
    '}',
    '',
    '.tng-badge[data-position="bottom-start"] {',
    '  transform: translate(-50%, 50%);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
