import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-progress-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './progress-bar-styling-page.component.html',
  styleUrl: './progress-bar-styling-page.component.css',
})
export class HeadlessProgressBarStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly cssStarterCode = [
    '[data-slot="progress-bar"] {',
    '  background: var(--tng-semantic-background-surface);',
    '  border-radius: 9999px;',
    '  height: 0.625rem;',
    '  overflow: hidden;',
    '}',
    '',
    '[data-slot="progress-bar-indicator"] {',
    '  background: var(--tng-semantic-accent-brand);',
    '  border-radius: inherit;',
    '  display: block;',
    '  height: 100%;',
    '}',
    '',
    '[data-slot="progress-bar-indicator"][data-indeterminate] {',
    '  animation: tng-progress-bar-indeterminate 1.1s ease-in-out infinite;',
    '  width: 40%;',
    '}',
    '',
    '@keyframes tng-progress-bar-indeterminate {',
    '  0% { transform: translateX(-100%); }',
    '  100% { transform: translateX(250%); }',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
