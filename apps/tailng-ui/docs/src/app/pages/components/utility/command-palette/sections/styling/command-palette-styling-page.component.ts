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
    'tng-command-palette {',
    '  --tng-command-palette-width: min(44rem, calc(100vw - 2rem));',
    '  --tng-command-palette-max-height: min(38rem, calc(100vh - 4rem));',
    '  --tng-command-palette-list-max-height: 24rem;',
    '}',
    '',
    'tng-command-palette .tng-command-palette-option[data-active] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);',
    '}',
    '',
    'tng-command-palette .tng-command-palette-footer {',
    '  font-size: 0.8rem;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
