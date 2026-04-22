import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-badge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './badge-styling-page.component.html',
  styleUrl: './badge-styling-page.component.css',
})
export class HeadlessBadgeStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly starterCode = [
    '.notification-host {',
    '  align-items: center;',
    '  appearance: none;',
    '  background: var(--tng-semantic-background-surface);',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.65rem;',
    '  display: inline-flex;',
    '  min-height: 2.5rem;',
    '  padding-inline: 1rem;',
    '}',
    '',
    '.notification-host .tng-badge {',
    '  background: var(--tng-badge-bg, #dc2626);',
    '  color: var(--tng-badge-fg, #ffffff);',
    '}',
    '',
  ].join('\n');

  protected readonly hostCode = [
    '.notification-host {',
    '  position: relative;',
    '}',
    '',
    '.notification-host[data-tng-badge-host] .tng-badge[data-position="bottom-start"] {',
    '  transform: translate(-50%, 50%);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
