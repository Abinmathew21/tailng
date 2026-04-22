import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTabs as TngTabsRoot } from '@tailng-ui/components';
import { TngTab, TngTabList, TngTabPanel, type TngTabsValue } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type DemoVariant = 'plain' | 'tailwind';
type ControlledTabValue = 'overview' | 'activity' | 'settings';

function isControlledTabValue(value: TngTabsValue | null): value is ControlledTabValue {
  return value === 'overview' || value === 'activity' || value === 'settings';
}

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
  selector: 'app-tabs-examples-page',
  imports: [TngTabsRoot, TngTabList, TngTab, TngTabPanel, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './tabs-examples-page.component.html',
  styleUrl: './tabs-examples-page.component.css',
})
export class TabsExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainControlledValue = signal<ControlledTabValue>('overview');
  protected readonly tailwindControlledValue = signal<ControlledTabValue>('overview');

  protected readonly controlledPlainCodeTabs = createCodeTabs(
    'tabs-controlled-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel, type TngTabsValue } from '@tailng-ui/primitives';",
      '',
      "type WorkspaceTab = 'overview' | 'activity' | 'settings';",
      '',
      'function isWorkspaceTab(value: TngTabsValue | null): value is WorkspaceTab {',
      "  return value === 'overview' || value === 'activity' || value === 'settings';",
      '}',
      '',
      '@Component({',
      "  selector: 'app-tabs-controlled-plain-css',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-controlled-plain-css.component.html',",
      "  styleUrl: './tabs-controlled-plain-css.component.css',",
      '})',
      'export class TabsControlledPlainCssComponent {',
      "  protected readonly current = signal<WorkspaceTab>('overview');",
      '',
      '  protected onValueChange(value: TngTabsValue | null): void {',
      '    if (isWorkspaceTab(value)) {',
      '      this.current.set(value);',
      '    }',
      '  }',
      '}',
    ].join('\n'),
    [
      '<tng-tabs ariaLabel="Workspace sections" [value]="current()" (valueChange)="onValueChange($event)">',
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
    '.tabs-panel[hidden] { display: none !important; }',
  );

  protected readonly controlledTailwindCodeTabs = createCodeTabs(
    'tabs-controlled-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel, type TngTabsValue } from '@tailng-ui/primitives';",
      '',
      "type WorkspaceTab = 'overview' | 'activity' | 'settings';",
      '',
      'function isWorkspaceTab(value: TngTabsValue | null): value is WorkspaceTab {',
      "  return value === 'overview' || value === 'activity' || value === 'settings';",
      '}',
      '',
      '@Component({',
      "  selector: 'app-tabs-controlled-tailwind',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-controlled-tailwind.component.html',",
      "  styleUrl: './tabs-controlled-tailwind.component.css',",
      '})',
      'export class TabsControlledTailwindComponent {',
      "  protected readonly current = signal<WorkspaceTab>('overview');",
      '',
      '  protected onValueChange(value: TngTabsValue | null): void {',
      '    if (isWorkspaceTab(value)) {',
      '      this.current.set(value);',
      '    }',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <tng-tabs ariaLabel="Workspace sections" [value]="current()" (valueChange)="onValueChange($event)" class="grid gap-3">',
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
      '  <p class="m-0 text-sm text-tng-fg-secondary">Current value: {{ current() }}</p>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly verticalPlainCodeTabs = createCodeTabs(
    'tabs-vertical-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-vertical-plain-css',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-vertical-plain-css.component.html',",
      "  styleUrl: './tabs-vertical-plain-css.component.css',",
      '})',
      'export class TabsVerticalPlainCssComponent {}',
    ].join('\n'),
    [
      '<tng-tabs ariaLabel="Settings categories" orientation="vertical" activation="manual" defaultValue="account">',
      '  <div tngTabList class="tabs-list tabs-list--vertical" ariaLabel="Settings categories">',
      '    <button type="button" tngTab value="account" class="tabs-trigger">Account</button>',
      '    <button type="button" tngTab value="team" class="tabs-trigger">Team</button>',
      '    <button type="button" tngTab value="security" class="tabs-trigger">Security</button>',
      '  </div>',
      '',
      '  <section tngTabPanel value="account" class="tabs-panel">Account panel</section>',
      '  <section tngTabPanel value="team" class="tabs-panel">Team panel</section>',
      '  <section tngTabPanel value="security" class="tabs-panel">Security panel</section>',
      '</tng-tabs>',
      '',
    ].join('\n'),
    '.tabs-list--vertical { flex-direction: column; }',
  );

  protected readonly verticalTailwindCodeTabs = createCodeTabs(
    'tabs-vertical-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-vertical-tailwind',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel],',
      "  templateUrl: './tabs-vertical-tailwind.component.html',",
      "  styleUrl: './tabs-vertical-tailwind.component.css',",
      '})',
      'export class TabsVerticalTailwindComponent {}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <tng-tabs ariaLabel="Settings categories" orientation="vertical" activation="manual" defaultValue="account" class="grid gap-4 md:grid-cols-[13rem_minmax(0,1fr)]">',
      '    <div tngTabList class="flex flex-col gap-2 md:border-r md:border-tng-border-subtle md:pr-4" ariaLabel="Settings categories">',
      '      <button type="button" tngTab value="account" class="rounded-lg border border-transparent px-3 py-2 text-left text-sm font-semibold text-tng-fg-secondary transition data-[selected=true]:border-[var(--tng-semantic-border-default)] data-[selected=true]:bg-tng-bg-base data-[selected=true]:text-tng-fg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface">Account</button>',
      '      <button type="button" tngTab value="team" class="rounded-lg border border-transparent px-3 py-2 text-left text-sm font-semibold text-tng-fg-secondary transition data-[selected=true]:border-[var(--tng-semantic-border-default)] data-[selected=true]:bg-tng-bg-base data-[selected=true]:text-tng-fg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface">Team</button>',
      '      <button type="button" tngTab value="security" class="rounded-lg border border-transparent px-3 py-2 text-left text-sm font-semibold text-tng-fg-secondary transition data-[selected=true]:border-[var(--tng-semantic-border-default)] data-[selected=true]:bg-tng-bg-base data-[selected=true]:text-tng-fg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface">Security</button>',
      '    </div>',
      '',
      '    <section tngTabPanel value="account" class="rounded-xl border border-tng-border-subtle bg-tng-bg-base p-4 text-sm text-tng-fg-secondary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_40%,transparent)]">Account panel</section>',
      '    <section tngTabPanel value="team" class="rounded-xl border border-tng-border-subtle bg-tng-bg-base p-4 text-sm text-tng-fg-secondary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_40%,transparent)]">Team panel</section>',
      '    <section tngTabPanel value="security" class="rounded-xl border border-tng-border-subtle bg-tng-bg-base p-4 text-sm text-tng-fg-secondary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_40%,transparent)]">Security panel</section>',
      '  </tng-tabs>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onValueChange(scope: DemoVariant, value: TngTabsValue | null): void {
    if (!isControlledTabValue(value)) {
      return;
    }

    if (scope === 'plain') {
      this.plainControlledValue.set(value);
      return;
    }

    this.tailwindControlledValue.set(value);
  }

  protected currentValue(scope: DemoVariant): ControlledTabValue {
    return scope === 'plain' ? this.plainControlledValue() : this.tailwindControlledValue();
  }
}
