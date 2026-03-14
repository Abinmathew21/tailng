import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-progress-spinner-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './progress-spinner-styling-page.component.html',
  styleUrl: './progress-spinner-styling-page.component.css',
})
export class ProgressSpinnerStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

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
