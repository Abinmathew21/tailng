import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-skeleton-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './skeleton-styling-page.component.html',
  styleUrl: './skeleton-styling-page.component.css',
})
export class SkeletonStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly cssContractCode = [
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

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
