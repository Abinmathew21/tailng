import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-button-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './button-styling-page.component.html',
  styleUrl: './button-styling-page.component.css',
})
export class ButtonStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly contractCss = [
    'tng-button > .tng-button[data-appearance="outline"] {',
    '  border-color: var(--tng-semantic-border-strong);',
    '}',
    '',
    'tng-button > .tng-button[data-tone="danger"][data-appearance="solid"] {',
    '  background: var(--tng-semantic-accent-danger);',
    '  color: var(--tng-color-white);',
    '}',
    '',
    'tng-button > .tng-button[data-disabled] {',
    '  opacity: 0.55;',
    '  cursor: not-allowed;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
