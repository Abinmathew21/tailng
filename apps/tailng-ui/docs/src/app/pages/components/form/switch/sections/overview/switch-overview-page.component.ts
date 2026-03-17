import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngSwitchComponent } from '@tailng-ui/components';
import { TngSwitch as TngSwitchPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-switch-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSwitchComponent,
    TngSwitchPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './switch-overview-page.component.html',
  styleUrl: './switch-overview-page.component.css',
})
export class SwitchOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly primitiveImportCode = "import { TngSwitch } from '@tailng-ui/primitives';";

  protected readonly componentImportCode =
    "import { TngSwitchComponent } from '@tailng-ui/components';";

  public readonly headlessChecked = signal(false);
  public readonly plainCssChecked = signal(true);
  public readonly tailwindChecked = signal(false);

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'switch-overview-headless.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngSwitch } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        '  standalone: true,',
        '  imports: [TngSwitch],',
        "  templateUrl: './switch-overview-headless.component.html',",
        "  styleUrl: './switch-overview-headless.component.css',",
        '})',
        'export class SwitchOverviewHeadlessComponent {',
        '  readonly checked = signal(false);',
        '',
        '  onToggle(): void {',
        '    this.checked.update((v) => !v);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'switch-overview-headless.component.html',
      code: [
        '<div class="switch-row">',
        '  <button',
        '    tngSwitch',
        '    class="switch-track"',
        '    [checked]="checked()"',
        '    ariaLabel="Enable notifications"',
        '    (click)="onToggle()"',
        '  >',
        '    <span class="switch-thumb"></span>',
        '  </button>',
        '  <span>Enable notifications</span>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'switch-overview-headless.component.css',
      code: [
        '.switch-track {',
        '  background: var(--tng-semantic-border-subtle);',
        '  border: 0;',
        '  border-radius: 999px;',
        '  cursor: pointer;',
        '  height: 1.5rem;',
        '  padding: 0.125rem;',
        '  width: 2.65rem;',
        '}',
        '.switch-track[data-state="checked"] {',
        '  background: var(--tng-semantic-accent-brand);',
        '}',
        '.switch-thumb {',
        '  background: white;',
        '  border-radius: 999px;',
        '  display: block;',
        '  height: 1.25rem;',
        '  transform: translateX(0);',
        '  transition: transform 150ms ease;',
        '  width: 1.25rem;',
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
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'switch-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngSwitchComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        '  standalone: true,',
        '  imports: [TngSwitchComponent],',
        "  templateUrl: './switch-overview-plain-css.component.html',",
        '})',
        'export class SwitchOverviewPlainCssComponent {',
        '  readonly checked = signal(true);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'switch-overview-plain-css.component.html',
      code: [
        '<div class="switch-preview-shell">',
        '  <tng-switch',
        '    [checked]="checked()"',
        '    (checkedChange)="checked.set($event)"',
        '  >',
        '    Dark mode',
        '  </tng-switch>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'switch-overview-plain-css.component.css',
      code: [
        '.switch-preview-shell {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'switch-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngSwitchComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        '  standalone: true,',
        '  imports: [TngSwitchComponent],',
        "  templateUrl: './switch-overview-tailwind.component.html',",
        '})',
        'export class SwitchOverviewTailwindComponent {',
        '  readonly checked = signal(false);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'switch-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-switch',
        '    [checked]="checked()"',
        '    (checkedChange)="checked.set($event)"',
        '  >',
        '    Auto-deploy',
        '  </tng-switch>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'switch-overview-tailwind.component.css',
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
