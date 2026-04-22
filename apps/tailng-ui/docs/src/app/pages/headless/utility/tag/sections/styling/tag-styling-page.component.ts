import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-tag-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './tag-styling-page.component.html',
})
export class HeadlessTagStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly contractCss = [
    '[data-slot="tag"] {',
    '  align-items: center;',
    '  border-radius: 9999px;',
    '  display: inline-flex;',
    '  gap: 0.35rem;',
    '}',
    '',
    '[data-slot="tag-close"][data-focused] {',
    '  box-shadow: 0 0 0 2px var(--tng-semantic-focus-ring);',
    '}',
    '',
    '[data-slot="tag"][data-disabled] {',
    '  opacity: 0.62;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
