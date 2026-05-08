import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-command-palette-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './command-palette-styling-page.component.html',
  styleUrl: './command-palette-styling-page.component.css',
})
export class CommandPaletteStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly contractCss = [
    '.docs-command-palette {',
    '  --tng-command-palette-width: min(44rem, calc(100vw - 2rem));',
    '  --tng-command-palette-max-height: min(38rem, calc(100vh - 4rem));',
    '  --tng-command-palette-list-max-height: 24rem;',
    '  --tng-z-overlay: 1200;',
    '}',
    '',
    '.docs-command-palette .tng-command-palette-backdrop {',
    '  background: color-mix(in srgb, #020617 55%, transparent);',
    '}',
    '',
    '.docs-command-palette .tng-command-palette-panel {',
    '  border-radius: 1rem;',
    '  box-shadow: 0 2rem 4rem color-mix(in srgb, #000 35%, transparent);',
    '}',
    '',
    '.docs-command-palette .tng-command-palette-search {',
    '  padding: 1rem;',
    '}',
    '',
    '.docs-command-palette .tng-command-palette-option[data-active] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);',
    '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 40%, transparent);',
    '}',
    '',
    '.docs-command-palette .tng-command-palette-footer {',
    '  font-size: 0.8rem;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
