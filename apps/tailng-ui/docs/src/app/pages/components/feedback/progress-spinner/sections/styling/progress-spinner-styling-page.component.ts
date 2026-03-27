import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-spinner-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './progress-spinner-styling-page.component.html',
  styleUrl: './progress-spinner-styling-page.component.css',
})
export class ProgressSpinnerStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly cssContractCode = [
    '[data-slot="progress-spinner"] {',
    '  --tng-progress-spinner-size: 40px;',
    '  --tng-progress-spinner-stroke-width: 4px;',
    '}',
    '',
    '.tng-progress-spinner-track {',
    '  stroke: var(--tng-semantic-border-subtle);',
    '}',
    '',
    '.tng-progress-spinner-indicator {',
    '  stroke: var(--tng-semantic-accent-brand);',
    '  transition: stroke-dashoffset 180ms ease;',
    '}',
    '',
    '.tng-progress-spinner-indicator[data-indeterminate] {',
    '  animation: tng-progress-spinner-indeterminate 1s linear infinite;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
