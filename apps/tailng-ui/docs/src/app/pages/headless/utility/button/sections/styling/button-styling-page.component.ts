import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-button-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './button-styling-page.component.html',
  styleUrl: './button-styling-page.component.css',
})
export class HeadlessButtonStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly hostStateCode = [
    '[data-disabled]',
    '[aria-disabled="true"]',
    '[aria-pressed="true"]',
    '[aria-expanded="true"]',
    '[aria-haspopup="menu"]',
    '[role="button"]',
    '',
  ].join('\n');

  protected readonly starterCode = [
    '.docs-press-host {',
    '  align-items: center;',
    '  appearance: none;',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.6rem;',
    '  display: inline-flex;',
    '  font: inherit;',
    '  font-weight: 600;',
    '  justify-content: center;',
    '  min-height: 2.5rem;',
    '  padding: 0 1rem;',
    '  text-decoration: none;',
    '}',
    '',
    '.docs-press-host:focus-visible {',
    '  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring);',
    '  outline: none;',
    '}',
    '',
    '.docs-press-host[data-disabled],',
    '.docs-press-host[aria-disabled="true"],',
    '.docs-press-host:disabled {',
    '  cursor: not-allowed;',
    '  opacity: 0.55;',
    '}',
    '',
  ].join('\n');

  protected readonly anchorCode = [
    'a.docs-press-host[role="button"] {',
    '  cursor: pointer;',
    '}',
    '',
    'a.docs-press-host[aria-disabled="true"] {',
    '  pointer-events: none;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
