import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-progress-spinner-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './progress-spinner-styling-page.component.html',
  styleUrl: './progress-spinner-styling-page.component.css',
})
export class HeadlessProgressSpinnerStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly cssStarterCode = [
    '[data-slot="progress-spinner"] {',
    '  display: inline-flex;',
    '  height: 2.5rem;',
    '  width: 2.5rem;',
    '}',
    '',
    '.progress-spinner-svg {',
    '  display: block;',
    '  height: 100%;',
    '  width: 100%;',
    '}',
    '',
    '.progress-spinner-track,',
    '.progress-spinner-indicator {',
    '  fill: none;',
    '  stroke-linecap: round;',
    '  stroke-width: 4;',
    '}',
    '',
    '.progress-spinner-track {',
    '  stroke: var(--tng-semantic-border-subtle);',
    '}',
    '',
    '.progress-spinner-indicator {',
    '  stroke: var(--tng-semantic-accent-brand);',
    '  transform: rotate(-90deg);',
    '  transform-origin: center;',
    '}',
    '',
    '.progress-spinner-indicator--indeterminate {',
    '  animation: tng-progress-spinner-indeterminate 1s linear infinite;',
    '  stroke-dasharray: 70;',
    '  stroke-dashoffset: 20;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
