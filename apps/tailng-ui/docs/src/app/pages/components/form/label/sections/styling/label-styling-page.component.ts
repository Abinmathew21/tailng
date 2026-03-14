import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-label-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './label-styling-page.component.html',
  styleUrl: './label-styling-page.component.css',
})
export class LabelStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

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

    if (computedColorScheme?.includes('dark') === true) {
      return 'github-dark';
    }

    return root.classList.contains('dark') ? 'github-dark' : 'github-light';
  }
}
