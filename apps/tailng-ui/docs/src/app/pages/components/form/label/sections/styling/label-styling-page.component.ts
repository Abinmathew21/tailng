import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-label-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './label-styling-page.component.html',
  styleUrl: './label-styling-page.component.css',
})
export class LabelStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stylingSnippet = [
    '[data-slot="label"] {',
    '  display: inline-flex;',
    '  gap: 0.4rem;',
    '  font-weight: 600;',
    '}',
    '',
    '[data-slot="label"][data-required]::after {',
    '  color: var(--tng-semantic-accent-danger);',
    '  content: "*";',
    '}',
    '',
    '[data-slot="label"][data-disabled] {',
    '  opacity: 0.6;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
