import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-copybutton-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './copybutton-styling-page.component.html',
  styleUrl: './copybutton-styling-page.component.css',
})
export class HeadlessCopybuttonStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly hostStateCode = [
    '[data-copy-disabled]',
    '[aria-disabled="true"]',
    '[disabled]',
    '',
  ].join('\n');

  protected readonly starterCode = [
    '.docs-copy-trigger {',
    '  align-items: center;',
    '  appearance: none;',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.65rem;',
    '  display: inline-flex;',
    '  font: inherit;',
    '  font-weight: 600;',
    '  gap: 0.45rem;',
    '  min-height: 2.5rem;',
    '  padding: 0 0.95rem;',
    '}',
    '',
    '.docs-copy-trigger:focus-visible {',
    '  box-shadow: 0 0 0 3px var(--tng-semantic-focus-ring);',
    '  outline: none;',
    '}',
    '',
    '.docs-copy-trigger[data-copy-disabled],',
    '.docs-copy-trigger[aria-disabled="true"],',
    '.docs-copy-trigger:disabled {',
    '  cursor: not-allowed;',
    '  opacity: 0.55;',
    '}',
    '',
  ].join('\n');

  protected readonly announcementCode = [
    '<button',
    '  type="button"',
    '  tngCopy',
    '  class="docs-copy-trigger"',
    '  [tngCopyText]="payload"',
    '  tngCopyButtonAnnounce="true"',
    '  (tngCopyAnnounced)="announcement.set($event)"',
    '>',
    '  Copy payload',
    '</button>',
    '',
    '<p class="sr-only" aria-live="polite">{{ announcement() }}</p>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
