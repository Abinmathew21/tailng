import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngSeparatorComponent } from '@tailng-ui/components';
import { TngSeparator as TngSeparatorPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-separator-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSeparatorPrimitive,
    TngSeparatorComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './separator-overview-page.component.html',
  styleUrl: './separator-overview-page.component.css',
})
export class SeparatorOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly primitiveImportCode =
    "import { TngSeparator } from '@tailng-ui/primitives';\n";

  protected readonly componentImportCode =
    "import { TngSeparatorComponent } from '@tailng-ui/components';\n";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'separator-overview-headless.component.ts',
      code: this.primitiveImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'separator-overview-headless.component.html',
      code: [
        '<section class="separator-preview-shell separator-preview-shell--headless">',
        '  <div class="separator-row">',
        '    <span>Profile</span>',
        '    <div tngSeparator orientation="vertical" class="separator-preview-vertical"></div>',
        '    <span>Security</span>',
        '    <div tngSeparator orientation="vertical" class="separator-preview-vertical"></div>',
        '    <span>Billing</span>',
        '  </div>',
        '',
        '  <div tngSeparator></div>',
        '',
        '  <div class="separator-row">',
        '    <span>Semantic divider</span>',
        '    <div tngSeparator [decorative]="false"></div>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'separator-overview-headless.component.css',
      code: [
        '.separator-preview-vertical {',
        '  align-self: stretch;',
        '  min-height: 1rem;',
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
      title: 'separator-overview-plain-css.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'separator-overview-plain-css.component.html',
      code: [
        '<div class="separator-preview-shell separator-preview-shell--plain">',
        '  <div class="separator-row">',
        '    <span>Overview</span>',
        '    <tng-separator orientation="vertical" class="separator-preview-vertical"></tng-separator>',
        '    <span>Incidents</span>',
        '    <tng-separator orientation="vertical" class="separator-preview-vertical"></tng-separator>',
        '    <span>Alerts</span>',
        '  </div>',
        '  <tng-separator></tng-separator>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'separator-overview-plain-css.component.css',
      code: [
        '.separator-preview-shell--plain {',
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
      title: 'separator-overview-tailwind.component.ts',
      code: this.componentImportCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'separator-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">',
        '    <span>Deployments</span>',
        '    <tng-separator orientation="vertical" class="self-stretch min-h-5"></tng-separator>',
        '    <span>Environments</span>',
        '    <tng-separator orientation="vertical" class="self-stretch min-h-5"></tng-separator>',
        '    <span>Audit trail</span>',
        '  </div>',
        '  <tng-separator class="my-3"></tng-separator>',
        '  <p class="m-0 text-sm text-slate-600 dark:text-slate-300">Use separators to divide related information, not as decorative noise.</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'separator-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
