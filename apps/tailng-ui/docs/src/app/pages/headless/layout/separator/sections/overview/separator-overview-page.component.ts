import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngSeparator } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-separator-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSeparator,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './separator-overview-page.component.html',
  styleUrl: './separator-overview-page.component.css',
})
export class HeadlessSeparatorOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly importCode =
    "import { TngSeparator } from '@tailng-ui/primitives';\n";

  protected readonly usageCode = [
    '<section class="toolbar">',
    '  <span>Profile</span>',
    '  <div tngSeparator orientation="vertical"></div>',
    '  <span>Security</span>',
    '</section>',
    '',
    '<div tngSeparator [decorative]="false"></div>',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-separator-overview-plain.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSeparator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-separator-overview-plain',",
        '  standalone: true,',
        '  imports: [TngSeparator],',
        "  templateUrl: './headless-separator-overview-plain.component.html',",
        "  styleUrl: './headless-separator-overview-plain.component.css',",
        '})',
        'export class HeadlessSeparatorOverviewPlainComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-separator-overview-plain.component.html',
      code: [
        '<section class="headless-separator-preview-shell">',
        '  <div class="headless-separator-row">',
        '    <span>Profile</span>',
        '    <div tngSeparator orientation="vertical" class="headless-separator-preview-vertical"></div>',
        '    <span>Security</span>',
        '    <div tngSeparator orientation="vertical" class="headless-separator-preview-vertical"></div>',
        '    <span>Billing</span>',
        '  </div>',
        '  <div tngSeparator class="headless-separator-preview-horizontal"></div>',
        '  <p class="headless-separator-preview-text">Use semantic separators only when the break carries meaning.</p>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-separator-overview-plain.component.css',
      code: [
        '.headless-separator-preview-shell {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  display: grid;',
        '  gap: 0.85rem;',
        '  padding: 1rem;',
        '}',
        '',
        '.headless-separator-preview-vertical {',
        '  align-self: stretch;',
        '  min-height: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-separator-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngSeparator } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-separator-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngSeparator],',
        "  templateUrl: './headless-separator-overview-tailwind.component.html',",
        "  styleUrl: './headless-separator-overview-tailwind.component.css',",
        '})',
        'export class HeadlessSeparatorOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-separator-overview-tailwind.component.html',
      code: [
        '<section class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">',
        '    <span>Deployments</span>',
        '    <div tngSeparator orientation="vertical" class="self-stretch min-h-5"></div>',
        '    <span>Environments</span>',
        '    <div tngSeparator orientation="vertical" class="self-stretch min-h-5"></div>',
        '    <span>Audit trail</span>',
        '  </div>',
        '  <div tngSeparator class="my-3"></div>',
        '  <p class="m-0 text-sm text-slate-600 dark:text-slate-300">Tailwind handles shell spacing while the primitive keeps divider semantics stable.</p>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-separator-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
