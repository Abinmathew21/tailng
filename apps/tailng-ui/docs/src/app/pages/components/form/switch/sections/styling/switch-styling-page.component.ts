import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngSwitchComponent } from '@tailng-ui/components';
import { TngSwitch as TngSwitchPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-switch-styling-page',
  imports: [
    TngSwitchComponent,
    TngSwitchPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './switch-styling-page.component.html',
  styleUrl: './switch-styling-page.component.css',
})
export class SwitchStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly headlessChecked = signal(true);
  public readonly plainCssChecked = signal(true);
  public readonly tailwindChecked = signal(true);

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'switch-styles-headless.component.html',
      code: [
        '<div class="switch-row">',
        '  <button tngSwitch class="switch-track" [checked]="checked()" ariaLabel="Notifications" (click)="onToggle()">',
        '    <span class="switch-thumb"></span>',
        '  </button>',
        '  <span>Notifications</span>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'switch-styles-headless.component.css',
      code: [
        '.switch-track {',
        '  background: var(--tng-semantic-border-subtle);',
        '  border: 0; border-radius: 999px;',
        '  height: 1.5rem; width: 2.65rem; padding: 0.125rem;',
        '}',
        '.switch-track[data-state="checked"] {',
        '  background: var(--tng-semantic-accent-brand);',
        '}',
        '.switch-thumb {',
        '  background: white; border-radius: 999px;',
        '  height: 1.25rem; width: 1.25rem;',
        '  transform: translateX(0); transition: transform 150ms ease;',
        '}',
        '.switch-track[data-state="checked"] .switch-thumb {',
        '  transform: translateX(1.15rem);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'switch-styles-plain.component.html',
      code: [
        '<div class="settings-panel">',
        '  <tng-switch [checked]="true">Release notifications</tng-switch>',
        '  <tng-switch [checked]="false" [disabled]="true">Disabled switch</tng-switch>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'switch-styles-plain.component.css',
      code: [
        '.settings-panel {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  display: grid;',
        '  gap: 0.75rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'switch-styles-tailwind.component.html',
      code: [
        '<div class="grid gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-switch [checked]="true">Release notifications</tng-switch>',
        '  <tng-switch [checked]="false" [disabled]="true">Disabled switch</tng-switch>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'switch-styles-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public onHeadlessToggle(): void {
    this.headlessChecked.update((v) => !v);
  }

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
