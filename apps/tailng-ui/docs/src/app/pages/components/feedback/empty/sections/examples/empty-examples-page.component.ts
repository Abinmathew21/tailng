import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import {
  TngEmptyActionsComponent,
  TngEmptyComponent,
  TngEmptyDescriptionComponent,
  TngEmptyIconComponent,
  TngEmptyTitleComponent,
} from '@tailng-ui/components';
import {
  TngEmpty as TngEmptyPrimitive,
  TngEmptyActions as TngEmptyActionsPrimitive,
  TngEmptyDescription as TngEmptyDescriptionPrimitive,
  TngEmptyIcon as TngEmptyIconPrimitive,
  TngEmptyTitle as TngEmptyTitlePrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-empty-examples-page',
  imports: [
    TngEmptyPrimitive,
    TngEmptyIconPrimitive,
    TngEmptyTitlePrimitive,
    TngEmptyDescriptionPrimitive,
    TngEmptyActionsPrimitive,
    TngEmptyComponent,
    TngEmptyIconComponent,
    TngEmptyTitleComponent,
    TngEmptyDescriptionComponent,
    TngEmptyActionsComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './empty-examples-page.component.html',
  styleUrl: './empty-examples-page.component.css',
})
export class EmptyExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly noResultsHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'empty-examples-no-results-headless.component.ts',
      code: "import { TngEmpty, TngEmptyIcon, TngEmptyTitle, TngEmptyDescription, TngEmptyActions } from '@tailng-ui/primitives';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-examples-no-results-headless.component.html',
      code: [
        '<section tngEmpty class="empty-example empty-example--headless">',
        '  <div tngEmptyIcon>🔎</div>',
        '  <h3 tngEmptyTitle>No search results</h3>',
        '  <p tngEmptyDescription>Try broader keywords or remove a few filters.</p>',
        '  <div tngEmptyActions>',
        '    <button type="button">Reset search</button>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'empty-examples-no-results-headless.component.css',
      code: [
        '.empty-example--headless {',
        '  border: 1px dashed var(--tng-semantic-border-strong);',
        '  border-radius: 1rem;',
        '  justify-items: center;',
        '  text-align: center;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly noResultsPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'empty-examples-no-results-plain-css.component.ts',
      code: "import { TngEmptyComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-examples-no-results-plain-css.component.html',
      code: [
        '<tng-empty align="start">',
        '  <tng-empty-icon>🧭</tng-empty-icon>',
        '  <tng-empty-title>No environments selected</tng-empty-title>',
        '  <tng-empty-description>Select one or more environments to continue.</tng-empty-description>',
        '  <tng-empty-actions>',
        '    <button type="button">Select environments</button>',
        '  </tng-empty-actions>',
        '</tng-empty>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'empty-examples-no-results-plain-css.component.css',
      code: [
        'tng-empty {',
        '  max-width: 34rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly noResultsTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'empty-examples-no-results-tailwind.component.ts',
      code: "import { TngEmptyComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-examples-no-results-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-empty>',
        '    <tng-empty-icon>🛰️</tng-empty-icon>',
        '    <tng-empty-title>No telemetry yet</tng-empty-title>',
        '    <tng-empty-description>Connect your first agent to stream runtime metrics.</tng-empty-description>',
        '    <tng-empty-actions>',
        '      <button type="button" class="rounded-md border border-slate-400 px-3 py-1 text-sm">Connect agent</button>',
        '    </tng-empty-actions>',
        '  </tng-empty>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'empty-examples-no-results-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly onboardingHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'empty-examples-onboarding-headless.component.ts',
      code: "import { TngEmpty, TngEmptyIcon, TngEmptyTitle, TngEmptyDescription, TngEmptyActions } from '@tailng-ui/primitives';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-examples-onboarding-headless.component.html',
      code: [
        '<section tngEmpty class="empty-example empty-example--headless">',
        '  <div tngEmptyIcon>✨</div>',
        '  <h3 tngEmptyTitle>Welcome to workspace setup</h3>',
        '  <p tngEmptyDescription>Create your first pipeline to activate deployments.</p>',
        '  <div tngEmptyActions>',
        '    <button type="button">Start onboarding</button>',
        '    <button type="button">View docs</button>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'empty-examples-onboarding-headless.component.css',
      code: [
        '.empty-example button {',
        '  border-radius: 0.5rem;',
        '  min-height: 2rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly onboardingPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'empty-examples-onboarding-plain-css.component.ts',
      code: "import { TngEmptyComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-examples-onboarding-plain-css.component.html',
      code: [
        '<tng-empty>',
        '  <tng-empty-icon>📁</tng-empty-icon>',
        '  <tng-empty-title>No documents uploaded</tng-empty-title>',
        '  <tng-empty-description>Drop files here or choose upload to start indexing.</tng-empty-description>',
        '  <tng-empty-actions>',
        '    <button type="button">Upload files</button>',
        '    <button type="button">Use template</button>',
        '  </tng-empty-actions>',
        '</tng-empty>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'empty-examples-onboarding-plain-css.component.css',
      code: [
        '.upload-empty {',
        '  margin-inline: auto;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly onboardingTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'empty-examples-onboarding-tailwind.component.ts',
      code: "import { TngEmptyComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'empty-examples-onboarding-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-empty align="start">',
        '    <tng-empty-icon>📦</tng-empty-icon>',
        '    <tng-empty-title>No release artifacts</tng-empty-title>',
        '    <tng-empty-description>Build your project to publish the first release bundle.</tng-empty-description>',
        '    <tng-empty-actions>',
        '      <button type="button" class="rounded-md border border-slate-400 px-3 py-1 text-sm">Run build</button>',
        '      <button type="button" class="rounded-md border border-slate-400 px-3 py-1 text-sm">Open pipeline</button>',
        '    </tng-empty-actions>',
        '  </tng-empty>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'empty-examples-onboarding-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
