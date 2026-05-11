import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTabs as TngTabsRoot } from '@tailng-ui/components';
import {
  TngTab,
  TngTabList,
  TngTabPanel,
  TngTabsScrollButtonNext,
  TngTabsScrollButtonPrev,
  type TngTabsValue,
} from '@tailng-ui/primitives';
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
  imports: [
    TngTabsRoot,
    TngTabList,
    TngTab,
    TngTabPanel,
    TngTabsScrollButtonPrev,
    TngTabsScrollButtonNext,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
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

  protected readonly scrollButtonsTabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'setup', label: 'Setup' },
    { value: 'usage', label: 'Usage' },
    { value: 'patterns', label: 'Patterns' },
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'performance', label: 'Performance' },
    { value: 'testing', label: 'Testing' },
    { value: 'migration', label: 'Migration' },
    { value: 'faq', label: 'FAQ' },
    { value: 'roadmap', label: 'Roadmap' },
  ] as const;

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
      '  <tng-tabs ariaLabel="Settings categories" orientation="vertical" activation="manual" defaultValue="account">',
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

  protected readonly scrollButtonsPlainCodeTabs = createCodeTabs(
    'tabs-scroll-buttons-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import {",
      '  TngTab,',
      '  TngTabList,',
      '  TngTabPanel,',
      '  TngTabsScrollButtonNext,',
      '  TngTabsScrollButtonPrev,',
      "} from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-scroll-buttons-plain-css',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel, TngTabsScrollButtonPrev, TngTabsScrollButtonNext],',
      "  templateUrl: './tabs-scroll-buttons-plain-css.component.html',",
      "  styleUrl: './tabs-scroll-buttons-plain-css.component.css',",
      '})',
      'export class TabsScrollButtonsPlainCssComponent {',
      '  protected readonly tabs = [',
      "    { value: 'overview', label: 'Overview' },",
      "    { value: 'setup', label: 'Setup' },",
      "    { value: 'usage', label: 'Usage' },",
      "    { value: 'patterns', label: 'Patterns' },",
      "    { value: 'accessibility', label: 'Accessibility' },",
      "    { value: 'performance', label: 'Performance' },",
      "    { value: 'testing', label: 'Testing' },",
      "    { value: 'migration', label: 'Migration' },",
      "    { value: 'faq', label: 'FAQ' },",
      "    { value: 'roadmap', label: 'Roadmap' },",
      '  ] as const;',
      '}',
    ].join('\n'),
    [
      '<tng-tabs ariaLabel="Documentation sections" scrollButtons="auto" defaultValue="overview" class="tabs-overflow">',
      '  <div class="tabs-strip">',
      '    <button type="button" tngTabsScrollButtonPrev class="tabs-scroll-control" aria-label="Scroll tabs left">',
      '      &#x2039;',
      '    </button>',
      '    <div tngTabList class="tabs-list tabs-list--overflow" ariaLabel="Documentation sections">',
      '      @for (item of tabs; track item.value) {',
      '        <button type="button" tngTab [value]="item.value" class="tabs-trigger">{{ item.label }}</button>',
      '      }',
      '    </div>',
      '    <button type="button" tngTabsScrollButtonNext class="tabs-scroll-control" aria-label="Scroll tabs right">',
      '      &#x203A;',
      '    </button>',
      '  </div>',
      '',
      '  @for (item of tabs; track item.value) {',
      '    <section tngTabPanel [value]="item.value" class="tabs-panel">{{ item.label }} content.</section>',
      '  }',
      '</tng-tabs>',
      '',
    ].join('\n'),
    [
      '.tabs-panel[hidden] { display: none !important; }',
      '',
      '.tabs-overflow {',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  min-width: 0;',
      '}',
      '',
      '.tabs-strip {',
      '  align-items: center;',
      '  display: grid;',
      '  gap: 0.45rem;',
      '  grid-template-columns: auto minmax(0, 1fr) auto;',
      '  min-width: 0;',
      '}',
      '',
      '.tabs-list--overflow {',
      '  border-bottom: 0;',
      '  flex-wrap: nowrap;',
      '  margin-bottom: 0;',
      '  overflow-x: auto;',
      '  overflow-y: hidden;',
      '  padding-bottom: 0;',
      '  -ms-overflow-style: none;',
      '  scrollbar-width: none;',
      '  width: 100%;',
      '}',
      '',
      '.tabs-list--overflow::-webkit-scrollbar {',
      '  display: none;',
      '}',
      '',
      '.tabs-overflow .tabs-trigger {',
      '  white-space: nowrap;',
      '}',
      '',
      '[data-slot="tabs-scroll-button-prev"],',
      '[data-slot="tabs-scroll-button-next"] {',
      '  align-items: center;',
      '  background: var(--tng-semantic-background-canvas);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 999px;',
      '  color: var(--tng-semantic-foreground-primary);',
      '  cursor: pointer;',
      '  display: inline-flex;',
      '  flex-shrink: 0;',
      '  height: 1.8rem;',
      '  justify-content: center;',
      '  line-height: 1;',
      '  padding: 0;',
      '  width: 1.8rem;',
      '}',
      '',
      '[data-slot="tabs-scroll-button-prev"]:disabled,',
      '[data-slot="tabs-scroll-button-next"]:disabled {',
      '  cursor: default;',
      '  opacity: 0.45;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly scrollButtonsTailwindCodeTabs = createCodeTabs(
    'tabs-scroll-buttons-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngTabs } from '@tailng-ui/components';",
      "import {",
      '  TngTab,',
      '  TngTabList,',
      '  TngTabPanel,',
      '  TngTabsScrollButtonNext,',
      '  TngTabsScrollButtonPrev,',
      "} from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tabs-scroll-buttons-tailwind',",
      '  standalone: true,',
      '  imports: [TngTabs, TngTabList, TngTab, TngTabPanel, TngTabsScrollButtonPrev, TngTabsScrollButtonNext],',
      "  templateUrl: './tabs-scroll-buttons-tailwind.component.html',",
      "  styleUrl: './tabs-scroll-buttons-tailwind.component.css',",
      '})',
      'export class TabsScrollButtonsTailwindComponent {',
      '  protected readonly tabs = [',
      "    { value: 'overview', label: 'Overview' },",
      "    { value: 'setup', label: 'Setup' },",
      "    { value: 'usage', label: 'Usage' },",
      "    { value: 'patterns', label: 'Patterns' },",
      "    { value: 'accessibility', label: 'Accessibility' },",
      "    { value: 'performance', label: 'Performance' },",
      "    { value: 'testing', label: 'Testing' },",
      "    { value: 'migration', label: 'Migration' },",
      "    { value: 'faq', label: 'FAQ' },",
      "    { value: 'roadmap', label: 'Roadmap' },",
      '  ] as const;',
      '}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <tng-tabs ariaLabel="Documentation sections" scrollButtons="on" defaultValue="overview" class="grid min-w-0 gap-3">',
      '    <div class="flex min-w-0 items-center gap-2">',
      '      <button type="button" tngTabsScrollButtonPrev aria-label="Scroll tabs left" class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tng-border-subtle bg-tng-bg-canvas text-xl leading-none text-tng-fg-primary transition-colors hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_8%,var(--tng-semantic-background-canvas))] disabled:cursor-not-allowed disabled:opacity-50">&#x2039;</button>',
      '      <div tngTabList class="flex min-w-0 flex-1 gap-2 overflow-x-auto whitespace-nowrap rounded-xl border border-tng-border-subtle p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" ariaLabel="Documentation sections">',
      '        @for (item of tabs; track item.value) {',
      '          <button type="button" tngTab [value]="item.value" class="inline-flex min-h-9 shrink-0 items-center rounded-xl border border-tng-border-subtle bg-tng-bg-canvas px-3.5 py-2 text-sm font-semibold leading-tight text-tng-fg-primary transition-colors hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_8%,var(--tng-semantic-background-canvas))] focus-visible:outline-none data-[selected=true]:border-tng-accent-brand data-[selected=true]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_14%,var(--tng-semantic-background-canvas))] data-[focused=true]:ring-2 data-[focused=true]:ring-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_32%,transparent)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50">{{ item.label }}</button>',
      '        }',
      '      </div>',
      '      <button type="button" tngTabsScrollButtonNext aria-label="Scroll tabs right" class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tng-border-subtle bg-tng-bg-canvas text-xl leading-none text-tng-fg-primary transition-colors hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_8%,var(--tng-semantic-background-canvas))] disabled:cursor-not-allowed disabled:opacity-50">&#x203A;</button>',
      '    </div>',
      '',
      '    @for (item of tabs; track item.value) {',
      '      <section tngTabPanel [value]="item.value" class="rounded-xl border border-tng-border-subtle bg-tng-bg-base p-4 text-sm text-tng-fg-secondary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_40%,transparent)]">{{ item.label }} content.</section>',
      '    }',
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
