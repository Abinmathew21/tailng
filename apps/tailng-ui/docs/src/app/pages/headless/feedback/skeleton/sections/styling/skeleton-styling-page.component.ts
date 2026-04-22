import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-skeleton-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './skeleton-styling-page.component.html',
  styleUrl: './skeleton-styling-page.component.css',
})
export class HeadlessSkeletonStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly cssStarterCode = [
    '[data-slot="skeleton"] {',
    '  background: linear-gradient(',
    '    90deg,',
    '    var(--tng-semantic-foreground-secondary) 0%,',
    '    var(--tng-semantic-border-subtle) 50%,',
    '    var(--tng-semantic-foreground-secondary) 100%',
    '  );',
    '  background-size: 220% 100%;',
    '}',
    '',
    '[data-slot="skeleton"][data-rounded="true"] {',
    '  border-radius: 0.6rem;',
    '}',
    '',
    '[data-slot="skeleton"][data-rounded="false"] {',
    '  border-radius: 0;',
    '}',
    '',
    '[data-slot="skeleton"][data-animated="true"] {',
    '  animation: tng-skeleton-shimmer 1.3s linear infinite;',
    '}',
    '',
    '@keyframes tng-skeleton-shimmer {',
    '  0% { background-position: 200% 0; }',
    '  100% { background-position: -20% 0; }',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
