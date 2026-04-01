import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-label-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './headless-label-api-page.component.html',
  styleUrl: './headless-label-api-page.component.css',
})
export class HeadlessLabelApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly attachmentCode = ['<label tngLabel for="release-owner">Release owner</label>', ''].join('\n');
  protected readonly wrappedUsageCode = [
    '<label tngLabel>',
    '  <input type="checkbox" />',
    '  Notify the release channel',
    '</label>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
