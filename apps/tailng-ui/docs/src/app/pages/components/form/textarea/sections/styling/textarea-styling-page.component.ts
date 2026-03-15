import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-textarea-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './textarea-styling-page.component.html',
  styleUrl: './textarea-styling-page.component.css',
})
export class TextareaStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly stylingSnippet = [
    '[data-slot="input-group"] {',
    '  align-items: flex-start;',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.85rem;',
    '  min-height: 8rem;',
    '  padding: 0.65rem 0.8rem;',
    '}',
    '',
    '[data-slot="input-group"] [data-slot="input"] {',
    '  border: 0;',
    '  min-height: 6.5rem;',
    '  outline: none;',
    '  resize: vertical;',
    '}',
    '',
    '[data-slot="input-group"][data-focused] {',
    '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 55%, var(--tng-semantic-border-strong));',
    '  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
    '}',
    '',
    '[data-slot="input"][data-resize="none"] {',
    '  resize: none;',
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
