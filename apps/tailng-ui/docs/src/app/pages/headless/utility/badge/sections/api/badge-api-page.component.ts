import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-badge-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './badge-api-page.component.html',
  styleUrl: './badge-api-page.component.css',
})
export class HeadlessBadgeApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly selectorCode = '<button type="button" [tngBadge]="5">Inbox</button>';
  protected readonly runtimeCode = [
    '.tng-badge {',
    '  --tng-badge-anchor-width: 0px;',
    '  --tng-badge-anchor-height: 0px;',
    '  --tng-badge-self-width: 0px;',
    '  --tng-badge-self-height: 0px;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
