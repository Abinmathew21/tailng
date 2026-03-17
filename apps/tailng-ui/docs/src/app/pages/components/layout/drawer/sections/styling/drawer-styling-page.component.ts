import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-drawer-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './drawer-styling-page.component.html',
  styleUrl: './drawer-styling-page.component.css',
})
export class DrawerStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly starterCss = [
    '/* Drawer container layout */',
    '[data-slot="drawer-container"] {',
    '  display: flex;',
    '  min-height: 100vh;',
    '  position: relative;',
    '}',
    '',
    '/* Drawer panel */',
    '[data-slot="drawer"] {',
    '  background: var(--tng-semantic-background-surface);',
    '  border-right: 1px solid var(--tng-semantic-border-subtle);',
    '  min-width: 16rem;',
    '  padding: 1rem;',
    '  transition: transform 0.3s ease;',
    '}',
    '',
    '[data-slot="drawer"][data-state="closed"] {',
    '  display: none;',
    '}',
    '',
    '[data-slot="drawer"][data-position="end"] {',
    '  border-left: 1px solid var(--tng-semantic-border-subtle);',
    '  border-right: none;',
    '}',
    '',
    '/* Drawer content */',
    '[data-slot="drawer-content"] {',
    '  flex: 1;',
    '  padding: 1rem;',
    '  transition: margin 0.3s ease;',
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
