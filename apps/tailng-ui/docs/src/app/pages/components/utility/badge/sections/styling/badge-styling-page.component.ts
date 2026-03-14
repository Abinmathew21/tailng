import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-badge-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './badge-styling-page.component.html',
  styleUrl: './badge-styling-page.component.css',
})
export class BadgeStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly contractCss = [
    '.tng-badge-host {',
    '  position: relative;',
    '}',
    '',
    '.tng-badge[data-tone="success"][data-variant="soft"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-success) 18%, transparent);',
    '  color: var(--tng-semantic-accent-success);',
    '}',
    '',
    '.tng-badge[data-variant="outline"] {',
    '  background: var(--tng-semantic-background-base);',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '}',
    '',
    '.tng-badge[data-dot] {',
    '  min-height: 0.56rem;',
    '  min-width: 0.56rem;',
    '  padding: 0;',
    '}',
    '',
    '.tng-badge[data-position="bottom-start"] {',
    '  transform: translate(-50%, 50%);',
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
