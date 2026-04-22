import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-button-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './button-api-page.component.html',
  styleUrl: './button-api-page.component.css',
})
export class HeadlessButtonApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly selectorCode = [
    '<button tngPress type="button">Press host</button>',
    '<a tngPress>Anchor button host</a>',
    '',
  ].join('\n');

  protected readonly normalizationCode = [
    '<a',
    '  tngPress',
    '  [ariaHasPopup]="\'menu\'"',
    '  [ariaExpanded]="open()"',
    '  [ariaControls]="\'release-actions\'"',
    '  [disabled]="isDisabled()"',
    '>',
    '  Release actions',
    '</a>',
    '',
    '<div id="release-actions" [hidden]="!open()">...</div>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
