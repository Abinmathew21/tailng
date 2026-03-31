import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngCheckbox } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../checkbox.util';

type CreateCodeTabsArgs = {
  readonly baseName: string;
  readonly cssCode: string;
  readonly htmlCode: string;
  readonly tsCode: string;
};

function createCodeTabs({
  baseName,
  cssCode,
  htmlCode,
  tsCode,
}: CreateCodeTabsArgs): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: tsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

@Component({
  selector: 'app-headless-checkbox-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngCheckbox,
  ],
  templateUrl: './headless-checkbox-overview-page.component.html',
  styleUrl: './headless-checkbox-overview-page.component.css',
})
export class HeadlessCheckboxOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly primitiveImportCode =
    "import { TngCheckbox } from '@tailng-ui/primitives';\n";

  protected readonly attachmentCode = ['<input tngCheckbox />', ''].join('\n');

  protected readonly labeledUsageCode = [
    '<label class="headless-checkbox-row">',
    '  <input tngCheckbox [checked]="true" />',
    '  <span>Email release updates</span>',
    '</label>',
    '',
  ].join('\n');

  protected readonly triStateCode = [
    '<label class="headless-checkbox-row">',
    '  <input',
    '    tngCheckbox',
    '    [indeterminate]="true"',
    '    [ariaDescribedBy]="\'selection-help\'"',
    '  />',
    '  <span>Deployment checklist (mixed)</span>',
    '</label>',
    '<p id="selection-help">One or more child checks are still pending.</p>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'headless-checkbox-notification-shell-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngCheckbox } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-checkbox-notification-shell-plain',",
      '  imports: [TngCheckbox],',
      "  templateUrl: './headless-checkbox-notification-shell-plain.component.html',",
      "  styleUrl: './headless-checkbox-notification-shell-plain.component.css',",
      '})',
      'export class HeadlessCheckboxNotificationShellPlainComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="headless-checkbox-notification-shell">',
      '  <label class="headless-checkbox-notification-shell__row">',
      '    <input tngCheckbox [checked]="true" class="headless-checkbox-notification-shell__control" />',
      '    <span>Email release updates</span>',
      '  </label>',
      '  <label class="headless-checkbox-notification-shell__row">',
      '    <input',
      '      tngCheckbox',
      '      [indeterminate]="true"',
      '      class="headless-checkbox-notification-shell__control"',
      '    />',
      '    <span>Weekly digest (mixed)</span>',
      '  </label>',
      '  <label class="headless-checkbox-notification-shell__row headless-checkbox-notification-shell__row--readonly">',
      '    <input',
      '      tngCheckbox',
      '      [readonly]="true"',
      '      [checked]="true"',
      '      class="headless-checkbox-notification-shell__control"',
      '    />',
      '    <span>Legal archive acknowledged (readonly)</span>',
      '  </label>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-checkbox-notification-shell {',
      '  display: grid;',
      '  gap: 0.8rem;',
      '  inline-size: min(100%, 28rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.95rem;',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '}',
      '',
      '.headless-checkbox-notification-shell__row {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.7rem;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-size: 0.95rem;',
      '  font-weight: 500;',
      '}',
      '',
      '.headless-checkbox-notification-shell__row--readonly {',
      '  color: var(--tng-semantic-foreground-secondary, #64748b);',
      '}',
      '',
      '.headless-checkbox-notification-shell__control {',
      '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
      '}',
      '',
      '.headless-checkbox-notification-shell__control[data-focus-visible] {',
      '  outline: 2px solid color-mix(',
      '    in srgb,',
      '    var(--tng-semantic-accent-brand, #2563eb) 70%,',
      '    white',
      '  );',
      '  outline-offset: 2px;',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'headless-checkbox-notification-shell-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngCheckbox } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-checkbox-notification-shell-tailwind',",
      '  imports: [TngCheckbox],',
      "  templateUrl: './headless-checkbox-notification-shell-tailwind.component.html',",
      '})',
      'export class HeadlessCheckboxNotificationShellTailwindComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="grid w-full max-w-[28rem] gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">',
      '    <input',
      '      tngCheckbox',
      '      [checked]="true"',
      '      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '    />',
      '    <span>Email release updates</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">',
      '    <input',
      '      tngCheckbox',
      '      [indeterminate]="true"',
      '      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '    />',
      '    <span>Weekly digest (mixed)</span>',
      '  </label>',
      '  <label class="inline-flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">',
      '    <input',
      '      tngCheckbox',
      '      [readonly]="true"',
      '      [checked]="true"',
      '      class="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-600"',
      '    />',
      '    <span>Legal archive acknowledged (readonly)</span>',
      '  </label>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: '/* Tailwind utilities are applied directly in the template. */',
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
