import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-copybutton-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './copybutton-api-page.component.html',
  styleUrl: './copybutton-api-page.component.css',
})
export class HeadlessCopybuttonApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly selectorCode = [
    '<button',
    '  type="button"',
    '  tngCopy',
    '  [tngCopyText]="payload"',
    '  (tngCopied)="onCopied($event)"',
    '></button>',
    '',
  ].join('\n');

  protected readonly runtimeCode = [
    '<button',
    '  type="button"',
    '  tngCopy',
    '  #copy="tngCopy"',
    '  [tngCopyText]="payload"',
    '>',
    '  Copy payload',
    '</button>',
    '',
    '@if (copy.status() === "success") {',
    '  <p>Copied {{ copy.lastCopiedText() }}</p>',
    '}',
    '',
    'await copy.copy();',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
