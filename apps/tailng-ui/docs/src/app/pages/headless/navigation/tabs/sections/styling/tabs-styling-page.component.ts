import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-tabs-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './tabs-styling-page.component.html',
})
export class HeadlessTabsStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly contractCss = [
    '[data-slot="tabs"] {',
    '  display: grid;',
    '  gap: 0.75rem;',
    '}',
    '',
    '[data-slot="tab-list"] {',
    '  display: flex;',
    '  gap: 0.5rem;',
    '}',
    '',
    '[data-slot="tab"][data-selected="true"] {',
    '  background: var(--tng-semantic-background-surface);',
    '}',
    '',
    '[data-slot="tab-panel"][hidden] {',
    '  display: none !important;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
