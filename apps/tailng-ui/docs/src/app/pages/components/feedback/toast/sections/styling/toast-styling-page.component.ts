import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-toast-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './toast-styling-page.component.html',
  styleUrl: './toast-styling-page.component.css',
})
export class ToastStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly cssContractCode = [
    '[data-slot="toast-viewport"] {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  pointer-events: none;',
    '  position: fixed;',
    '}',
    '',
    '[data-slot="toast-item"] {',
    '  background: var(--tng-semantic-background-surface);',
    '  border: 1px solid var(--tng-semantic-border-default);',
    '  border-radius: 0.85rem;',
    '  color: var(--tng-semantic-foreground-primary);',
    '  display: grid;',
    '  gap: 0.6rem;',
    '  grid-template-columns: 1fr auto;',
    '  pointer-events: auto;',
    '}',
    '',
    '[data-slot="toast-item"][data-tone="success"] {',
    '  border-color: var(--tng-semantic-accent-success);',
    '}',
    '',
    '[data-slot="toast-item"][data-tone="warning"] {',
    '  border-color: var(--tng-semantic-accent-warning);',
    '}',
    '',
    '[data-slot="toast-item"][data-tone="danger"] {',
    '  border-color: var(--tng-semantic-accent-danger);',
    '}',
    '',
    '[data-slot="toast-item"][data-state="closed"] {',
    '  opacity: 0;',
    '  pointer-events: none;',
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
