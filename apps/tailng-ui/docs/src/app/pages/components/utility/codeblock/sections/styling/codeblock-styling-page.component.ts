import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-codeblock-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './codeblock-styling-page.component.html',
  styleUrl: './codeblock-styling-page.component.css',
})
export class CodeblockStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly slotContractCode = [
    '[data-slot="code-block"] {',
    '  --tng-code-block-radius: 0.9rem;',
    '  --tng-code-block-border: color-mix(in srgb, var(--tng-semantic-border-subtle) 75%, #fff);',
    '}',
    '',
    '[data-slot="line-numbers"] {',
    '  min-width: 3.25rem;',
    '}',
    '',
    '[data-slot="copy-button"] {',
    '  border-radius: 999px;',
    '}',
    '',
  ].join('\n');

  protected readonly ownerCssCode = [
    '.docs-codeblock [data-slot="line"].tng-code-block__line--highlight {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);',
    '}',
    '',
    '.docs-codeblock [data-slot="code"] {',
    "  font-family: 'IBM Plex Mono', 'Fira Code', monospace;",
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
