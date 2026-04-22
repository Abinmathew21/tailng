import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngTabs as TngTabsRoot } from '@tailng-ui/components';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
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
  selector: 'app-tabs-overview-page',
  imports: [
    TngTabsRoot,
    TngTabList,
    TngTab,
    TngTabPanel,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tabs-overview-page.component.html',
  styleUrl: './tabs-overview-page.component.css',
})
export class TabsOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = "import { TngTabs } from '@tailng-ui/components';";
  protected readonly primitivePartsImportCode =
    "import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';";
  protected readonly structureCode = [
    '<tng-tabs ariaLabel="Project sections" defaultValue="overview">',
    '  <div tngTabList ariaLabel="Project sections">',
    '    <button type="button" tngTab value="overview">Overview</button>',
    '    <button type="button" tngTab value="activity">Activity</button>',
    '  </div>',
    '',
    '  <section tngTabPanel value="overview">Overview content</section>',
    '  <section tngTabPanel value="activity">Activity content</section>',
    '</tng-tabs>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'tabs-overview-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-overview-plain-css',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-overview-plain-css.component.html',",
      "  styleUrl: './tabs-overview-plain-css.component.css',",
      '})',
      'export class TabsOverviewPlainCssComponent {}',
    ].join('\n'),
    [
      '<tng-tabs ariaLabel="Workspace sections" defaultValue="overview">',
      '  <div tngTabList class="tabs-list" ariaLabel="Workspace sections">',
      '    <button type="button" tngTab value="overview" class="tabs-trigger">Overview</button>',
      '    <button type="button" tngTab value="activity" class="tabs-trigger">Activity</button>',
      '    <button type="button" tngTab value="settings" class="tabs-trigger">Settings</button>',
      '  </div>',
      '',
      '  <section tngTabPanel value="overview" class="tabs-panel">Overview content</section>',
      '  <section tngTabPanel value="activity" class="tabs-panel">Activity content</section>',
      '  <section tngTabPanel value="settings" class="tabs-panel">Settings content</section>',
      '</tng-tabs>',
      '',
    ].join('\n'),
    [
      '.tabs-list {',
      '  display: flex;',
      '  gap: 0.5rem;',
      '  padding-bottom: 0.6rem;',
      '}',
      '',
      '.tabs-trigger[data-selected="true"] {',
      '  background: var(--tng-semantic-background-surface);',
      '  border-color: var(--tng-semantic-border-subtle);',
      '}',
      '',
      '.tabs-panel[hidden] {',
      '  display: none !important;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'tabs-overview-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-overview-tailwind.component.html',",
      "  styleUrl: './tabs-overview-tailwind.component.css',",
      '})',
      'export class TabsOverviewTailwindComponent {}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <tng-tabs ariaLabel="Workspace sections" defaultValue="overview" class="grid gap-3">',
      '    <div tngTabList class="flex flex-wrap gap-2 border-b border-tng-border-subtle pb-3" ariaLabel="Workspace sections">',
      '      <button type="button" tngTab value="overview" class="rounded-lg border border-transparent px-3 py-2 text-sm font-semibold text-tng-fg-secondary transition data-[selected=true]:border-[var(--tng-semantic-border-default)] data-[selected=true]:bg-tng-bg-base data-[selected=true]:text-tng-fg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface">Overview</button>',
      '      <button type="button" tngTab value="activity" class="rounded-lg border border-transparent px-3 py-2 text-sm font-semibold text-tng-fg-secondary transition data-[selected=true]:border-[var(--tng-semantic-border-default)] data-[selected=true]:bg-tng-bg-base data-[selected=true]:text-tng-fg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface">Activity</button>',
      '      <button type="button" tngTab value="settings" class="rounded-lg border border-transparent px-3 py-2 text-sm font-semibold text-tng-fg-secondary transition data-[selected=true]:border-[var(--tng-semantic-border-default)] data-[selected=true]:bg-tng-bg-base data-[selected=true]:text-tng-fg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface">Settings</button>',
      '    </div>',
      '',
      '    <section tngTabPanel value="overview" class="rounded-xl border border-tng-border-subtle bg-tng-bg-base p-4 text-sm text-tng-fg-secondary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_40%,transparent)]">Overview content</section>',
      '    <section tngTabPanel value="activity" class="rounded-xl border border-tng-border-subtle bg-tng-bg-base p-4 text-sm text-tng-fg-secondary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_40%,transparent)]">Activity content</section>',
      '    <section tngTabPanel value="settings" class="rounded-xl border border-tng-border-subtle bg-tng-bg-base p-4 text-sm text-tng-fg-secondary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_40%,transparent)]">Settings content</section>',
      '  </tng-tabs>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
