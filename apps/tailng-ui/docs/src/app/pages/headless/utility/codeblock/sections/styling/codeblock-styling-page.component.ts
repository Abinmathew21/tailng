import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-codeblock-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './codeblock-styling-page.component.html',
  styleUrl: './codeblock-styling-page.component.css',
})
export class HeadlessCodeblockStylingPageComponent implements OnDestroy {
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
    '  border-radius: 0.85rem;',
    '  overflow: hidden;',
    '}',
    '',
    '[data-slot="code-block-header"] {',
    '  display: flex;',
    '  justify-content: space-between;',
    '}',
    '',
    '[data-slot="code-block-body"] {',
    '  display: grid;',
    '  grid-template-columns: auto minmax(0, 1fr);',
    '}',
    '',
    '[data-slot="code-block-code"] {',
    "  font-family: 'IBM Plex Mono', 'Fira Code', monospace;",
    '}',
    '',
  ].join('\n');

  protected readonly starterCode = [
    '.docs-codeblock[data-slot="code-block"] {',
    '  background: var(--tng-semantic-background-base);',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '}',
    '',
    '.docs-codeblock [data-slot="code-block-gutter"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-background-surface) 82%, transparent);',
    '  color: var(--tng-semantic-foreground-muted);',
    '  min-width: 3rem;',
    '}',
    '',
    '.docs-codeblock__line {',
    '  display: block;',
    '  line-height: 1.6;',
    '  white-space: pre;',
    '}',
    '',
  ].join('\n');

  protected readonly tokenCode = [
    '.docs-codeblock__line--highlight {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 14%, transparent);',
    '  border-radius: 0.35rem;',
    '  padding-inline: 0.25rem;',
    '}',
    '',
    '.docs-codeblock__line--dim {',
    '  opacity: 0.55;',
    '}',
    '',
    '.docs-codeblock__token--keyword { color: #c084fc; }',
    '.docs-codeblock__token--string { color: #34d399; }',
    '.docs-codeblock__token--variable { color: #38bdf8; }',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
