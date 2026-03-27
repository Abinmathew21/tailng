import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-tag-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './tag-styling-page.component.html',
  styleUrl: './tag-styling-page.component.css',
})
export class TagStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly contractCss = [
    '.tag-chip[data-slot="tag"] {',
    '  border-radius: 9999px;',
    '  display: inline-flex;',
    '  gap: 0.35rem;',
    '}',
    '',
    '.tng-tag[data-tone="success"][data-appearance="soft"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-success) 18%, transparent);',
    '  color: var(--tng-semantic-accent-success);',
    '}',
    '',
    '.tng-tag[data-appearance="outline"] {',
    '  background: var(--tng-semantic-background-base);',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '}',
    '',
    '.tng-tag [data-slot="tag-close"] {',
    '  border-radius: 9999px;',
    '  inline-size: 1rem;',
    '  block-size: 1rem;',
    '}',
    '',
    '.tng-tag[data-disabled] {',
    '  opacity: 0.62;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
