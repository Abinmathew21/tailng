import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-tag-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './tag-styling-page.component.html',
  styleUrl: './tag-styling-page.component.css',
})
export class TagStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly contractCss = [
    '.tag-chip[data-slot="tag"] {',
    '  border-radius: 9999px;',
    '  display: inline-flex;',
    '  gap: 0.35rem;',
    '}',
    '',
    '.tng-tag[data-tone="success"][data-appearance="soft"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-success) 18%, transparent);',
    '  color: var(--tng-semantic-accent-success);',
    '}',
    '',
    '.tng-tag[data-appearance="outline"] {',
    '  background: var(--tng-semantic-background-base);',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '}',
    '',
    '.tng-tag [data-slot="tag-close"] {',
    '  border-radius: 9999px;',
    '  inline-size: 1rem;',
    '  block-size: 1rem;',
    '}',
    '',
    '.tng-tag[data-disabled] {',
    '  opacity: 0.62;',
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
