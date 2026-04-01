import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngLabel } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../label.util';

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
  selector: 'app-headless-label-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngLabel,
  ],
  templateUrl: './headless-label-overview-page.component.html',
  styleUrl: './headless-label-overview-page.component.css',
})
export class HeadlessLabelOverviewPageComponent implements OnDestroy {
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

  protected readonly primitiveImportCode = "import { TngLabel } from '@tailng-ui/primitives';\n";
  protected readonly attachmentCode = [
    '<label tngLabel for="workspace-name">Workspace name</label>',
    '<input id="workspace-name" type="text" />',
    '',
  ].join('\n');
  protected readonly groupedUsageCode = [
    '<label tngLabel>',
    '  <input type="checkbox" />',
    '  Send release alerts',
    '</label>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs({
    baseName: 'headless-label-overview-plain',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngLabel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-label-overview-plain',",
      '  imports: [TngLabel],',
      "  templateUrl: './headless-label-overview-plain.component.html',",
      "  styleUrl: './headless-label-overview-plain.component.css',",
      '})',
      'export class HeadlessLabelOverviewPlainComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="headless-label-overview-card">',
      '  <div class="headless-label-overview-card__field">',
      '    <label tngLabel [required]="true" for="headless-label-plain-workspace">',
      '      Workspace name',
      '    </label>',
      '    <input',
      '      id="headless-label-plain-workspace"',
      '      class="headless-label-overview-card__input"',
      '      type="text"',
      '      placeholder="North Star"',
      '      aria-required="true"',
      '    />',
      '  </div>',
      '  <label tngLabel class="headless-label-overview-card__consent">',
      '    <input class="headless-label-overview-card__checkbox" type="checkbox" />',
      '    <span>Send the release announcement to Slack</span>',
      '  </label>',
      '</section>',
      '',
    ].join('\n'),
    cssCode: [
      '.headless-label-overview-card {',
      '  display: grid;',
      '  gap: 1rem;',
      '  inline-size: min(100%, 34rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-base, #ffffff);',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '}',
      '',
      '.headless-label-overview-card__field {',
      '  display: grid;',
      '  gap: 0.55rem;',
      '}',
      '',
      '.headless-label-overview-card [data-slot="label"] {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.35rem;',
      '  color: var(--tng-semantic-foreground-primary, #0f172a);',
      '  font-size: 0.9rem;',
      '  font-weight: 600;',
      '}',
      '',
      '.headless-label-overview-card [data-slot="label"][data-required]::after {',
      '  content: "*";',
      '  color: var(--tng-semantic-accent-danger, #dc2626);',
      '}',
      '',
      '.headless-label-overview-card__input {',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  min-block-size: 2.75rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
      '  border-radius: 0.8rem;',
      '  padding: 0.65rem 0.8rem;',
      '  font: inherit;',
      '}',
      '',
      '.headless-label-overview-card__input::placeholder {',
      '  color: #94a3b8;',
      '}',
      '',
      '.headless-label-overview-card__consent {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 0.7rem;',
      '}',
      '',
      '.headless-label-overview-card__checkbox {',
      '  accent-color: var(--tng-semantic-accent-brand, #2563eb);',
      '}',
      '',
    ].join('\n'),
  });

  protected readonly tailwindCodeTabs = createCodeTabs({
    baseName: 'headless-label-overview-tailwind',
    tsCode: [
      "import { Component } from '@angular/core';",
      "import { TngLabel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-label-overview-tailwind',",
      '  imports: [TngLabel],',
      "  templateUrl: './headless-label-overview-tailwind.component.html',",
      '})',
      'export class HeadlessLabelOverviewTailwindComponent {}',
      '',
    ].join('\n'),
    htmlCode: [
      '<section class="grid w-full max-w-[34rem] gap-4 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
      '  <div class="grid gap-2">',
      '    <label',
      '      tngLabel',
      '      [required]="true"',
      '      for="headless-label-tailwind-workspace"',
      "      class=\"inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 [&[data-required]]:after:text-rose-600 [&[data-required]]:after:content-['*']\"",
      '    >',
      '      Workspace name',
      '    </label>',
      '    <input',
      '      id="headless-label-tailwind-workspace"',
      '      type="text"',
      '      placeholder="North Star"',
      '      aria-required="true"',
      '      class="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"',
      '    />',
      '  </div>',
      '  <label tngLabel class="inline-flex items-center gap-3 text-sm font-medium text-slate-700">',
      '    <input type="checkbox" class="h-4 w-4 accent-blue-600" />',
      '    <span>Send the release announcement to Slack</span>',
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
