import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-codeblock-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './codeblock-api-page.component.html',
  styleUrl: './codeblock-api-page.component.css',
})
export class HeadlessCodeblockApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly slotAttachmentCode = [
    '<section tngCodeBlock>',
    '  <header tngCodeBlockHeader>...</header>',
    '  <div tngCodeBlockBody>',
    '    <ol tngCodeBlockGutter aria-hidden="true"></ol>',
    '    <pre><code tngCodeBlockCode>...</code></pre>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly contractCode = [
    '[data-slot="code-block"]',
    '[data-slot="code-block-header"]',
    '[data-slot="code-block-body"]',
    '[data-slot="code-block-gutter"]',
    '[data-slot="code-block-code"]',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
