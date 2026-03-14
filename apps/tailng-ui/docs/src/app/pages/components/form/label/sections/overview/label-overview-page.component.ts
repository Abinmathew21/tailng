import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngLabelComponent } from '@tailng-ui/components';
import { TngLabel } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-label-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngLabel,
    TngLabelComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './label-overview-page.component.html',
  styleUrl: './label-overview-page.component.css',
})
export class LabelOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly primitiveImportCode = "import { TngLabel } from '@tailng-ui/primitives';\n";
  protected readonly componentImportCode =
    "import { TngLabelComponent } from '@tailng-ui/components';\n";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'label-overview-headless.component.ts',
      code: this.primitiveImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'label-overview-headless.component.html',
      code: [
        '<section class="label-preview-shell label-preview-shell--headless">',
        '  <label tngLabel for="headless-email">Email address</label>',
        '  <input id="headless-email" type="email" placeholder="hello@tailng.dev" />',
        '',
        '  <label tngLabel [required]="true" for="headless-terms">',
        '    Accept terms',
        '    <span aria-hidden="true">*</span>',
        '  </label>',
        '  <input id="headless-terms" type="checkbox" aria-required="true" />',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'label-overview-headless.component.css',
      code: [
        '.label-preview-shell--headless [data-slot="label"] {',
        '  display: inline-flex;',
        '  gap: 0.35rem;',
        '  font-weight: 600;',
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
      title: 'label-overview-plain-css.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'label-overview-plain-css.component.html',
      code: [
        '<section class="label-preview-shell label-preview-shell--plain">',
        '  <tng-label forId="plain-display-name" [required]="true">Display name</tng-label>',
        '  <input id="plain-display-name" type="text" placeholder="TailNG Team" aria-required="true" />',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'label-overview-plain-css.component.css',
      code: [
        '.label-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.85rem;',
        '  padding: 1rem;',
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
      title: 'label-overview-tailwind.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'label-overview-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div class="grid gap-2">',
        '    <tng-label forId="tailwind-label-email" [required]="true">',
        '      Work email',
        '    </tng-label>',
        '    <input',
        '      id="tailwind-label-email"',
        '      type="email"',
        '      aria-required="true"',
        '      class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"',
        '    />',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'label-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

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
