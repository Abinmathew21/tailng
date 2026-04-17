import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import {
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-menu-overview-page',
  imports: [
    RouterLink,
    TngCodeBlockComponent,
    TngMenuComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuTriggerFor,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './menu-overview-page.component.html',
  styleUrls: ['./menu-overview-page.component.css'],
})
export class MenuOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly plainCommand = signal('No command yet');
  protected readonly tailwindCommand = signal('No command yet');

  protected readonly componentImportCode = [
    "import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';",
    "import { TngMenuGroupLabel, TngMenuItem, TngMenuSeparator } from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly componentUsageCode = [
    '<button type="button" [tngMenuTriggerFor]="actionsMenu">Open menu</button>',
    '<tng-menu #actionsMenu="tngMenu" ariaLabel="Actions menu">',
    '  <div tngMenuGroupLabel>Actions</div>',
    '  <button type="button" tngMenuItem tngMenuItemValue="Export report">Export report</button>',
    '  <div tngMenuSeparator></div>',
    '  <button type="button" tngMenuItem tngMenuItemValue="Copy path">Copy path</button>',
    '</tng-menu>',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';",
        "import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-menu-overview-plain-example',",
        '  standalone: true,',
        '  imports: [TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],',
        "  templateUrl: './menu-overview-plain-css.component.html',",
        "  styleUrl: './menu-overview-plain-css.component.css',",
        '})',
        'export class MenuOverviewPlainExampleComponent {',
        "  protected readonly menuOverviewPlainLastCommand = signal('No command yet');",
        '',
        '  protected onMenuOverviewPlainSelect(event: TngMenuSelectEvent): void {',
        '    this.menuOverviewPlainLastCommand.set(String(event.value));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-overview-plain-css.component.html',
      code: [
        '<div class="menu-trigger-shell">',
        '  <button type="button" [tngMenuTriggerFor]="menuOverviewPlainMenu" class="menu-trigger">Options</button>',
        '  <tng-menu',
        '    #menuOverviewPlainMenu="tngMenu"',
        '    ariaLabel="Options menu"',
        '    class="menu-panel"',
        '    (tngMenuSelect)="onMenuOverviewPlainSelect($event)"',
        '  >',
        '    <div tngMenuGroupLabel class="menu-group-label">Options</div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Pin item">Pin</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Mute notifications">Mute</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Remove item">Remove</button>',
        '</tng-menu>',
        '</div>',
        '<p class="menu-overview-state">last command: {{ menuOverviewPlainLastCommand() }}</p>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menu-overview-plain-css.component.css',
      code: [
        ':host {',
        '  --menu-overview-plain-bg: #ffffff;',
        '  --menu-overview-plain-surface: #f8fafc;',
        '  --menu-overview-plain-fg: #0f172a;',
        '  --menu-overview-plain-muted: #64748b;',
        '  --menu-overview-plain-border: #cbd5e1;',
        '  --menu-overview-plain-brand: #2563eb;',
        '  display: block;',
        '}',
        '',
        '.menu-trigger-shell {',
        '  display: inline-grid;',
        '  justify-items: start;',
        '  position: relative;',
        '}',
        '',
        '.menu-trigger {',
        '  background: color-mix(in srgb, var(--menu-overview-plain-surface) 86%, transparent);',
        '  border: 1px solid var(--menu-overview-plain-border);',
        '  border-radius: 0.65rem;',
        '  color: var(--menu-overview-plain-fg);',
        '  cursor: pointer;',
        '  font-size: 0.92rem;',
        '  font-weight: 600;',
        '  min-height: 2.15rem;',
        '  transition:',
        '    background-color 130ms ease,',
        '    border-color 130ms ease,',
        '    color 130ms ease;',
        '  padding: 0.45rem 0.85rem;',
        '}',
        '',
        '.menu-trigger:is(:hover, :focus-visible) {',
        '  background: color-mix(in srgb, var(--menu-overview-plain-brand) 10%, transparent);',
        '  border-color: color-mix(in srgb, var(--menu-overview-plain-brand) 38%, var(--menu-overview-plain-border));',
        '  outline: none;',
        '}',
        '',
        '.menu-trigger[aria-expanded="true"] {',
        '  background: color-mix(in srgb, var(--menu-overview-plain-brand) 15%, transparent);',
        '  color: color-mix(in srgb, var(--menu-overview-plain-brand) 74%, var(--menu-overview-plain-fg));',
        '}',
        '',
        '.menu-panel {',
        '  background: var(--menu-overview-plain-bg);',
        '  border: 1px solid var(--menu-overview-plain-border);',
        '  border-radius: 0.82rem;',
        '  box-shadow: 0 16px 30px -22px rgba(15, 23, 42, 0.35);',
        '  min-width: 14.2rem;',
        '  padding: 0.48rem;',
        '}',
        '',
        '.menu-panel[data-state="open"] {',
        '  display: grid;',
        '  gap: 0.22rem;',
        '}',
        '',
        '.menu-panel[hidden] {',
        '  display: none !important;',
        '}',
        '',
        '.menu-panel [tngMenuItem] {',
        '  background: transparent;',
        '  border: 0;',
        '  border-radius: 0.6rem;',
        '  color: var(--menu-overview-plain-fg);',
        '  cursor: pointer;',
        '  font-size: 0.88rem;',
        '  font-weight: 550;',
        '  min-height: 2rem;',
        '  padding: 0.42rem 0.68rem;',
        '  text-align: left;',
        '  transition:',
        '    background-color 120ms ease,',
        '    color 120ms ease;',
        '}',
        '',
        '.menu-panel [tngMenuItem]:hover {',
        '  background: color-mix(in srgb, var(--menu-overview-plain-fg) 8%, transparent);',
        '}',
        '',
        '.menu-panel [tngMenuItem][data-active],',
        '.menu-panel [tngMenuItem][aria-expanded="true"] {',
        '  background: color-mix(in srgb, var(--menu-overview-plain-brand) 16%, transparent);',
        '  color: color-mix(in srgb, var(--menu-overview-plain-brand) 72%, var(--menu-overview-plain-fg));',
        '}',
        '',
        '.menu-group-label {',
        '  color: var(--menu-overview-plain-muted);',
        '  font-size: 0.72rem;',
        '  font-weight: 700;',
        '  letter-spacing: 0.08em;',
        '  padding: 0.2rem 0.45rem;',
        '  text-transform: uppercase;',
        '}',
        '',
        '.menu-overview-state {',
        '  color: var(--menu-overview-plain-muted);',
        '  font-size: 0.9rem;',
        '  margin: 0.68rem 0 0;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';",
        "import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-menu-overview-tailwind-example',",
        '  standalone: true,',
        '  imports: [TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],',
        "  templateUrl: './menu-overview-tailwind.component.html',",
        '})',
        'export class MenuOverviewTailwindExampleComponent {',
        "  protected readonly menuOverviewTailwindLastCommand = signal('No command yet');",
        '',
        '  protected onMenuOverviewTailwindSelect(event: TngMenuSelectEvent): void {',
        '    this.menuOverviewTailwindLastCommand.set(String(event.value));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <button',
        '    type="button"',
        '    [tngMenuTriggerFor]="menuOverviewTailwindMenu"',
        '    class="min-h-[2.15rem] rounded-[0.72rem] border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_86%,transparent)] px-[0.9rem] py-[0.45rem] text-[0.92rem] font-semibold text-[var(--tng-semantic-foreground-primary)] transition hover:border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_38%,var(--tng-semantic-border-subtle))] hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_10%,transparent)] focus-visible:outline-none aria-expanded:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_15%,transparent)] aria-expanded:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_74%,var(--tng-semantic-foreground-primary))]"',
        '  >',
        '    Open menu',
        '  </button>',
        '  <tng-menu',
        '    #menuOverviewTailwindMenu="tngMenu"',
        '    ariaLabel="Tailwind menu"',
        '    class="hidden min-w-[14.2rem] gap-[0.22rem] rounded-[0.82rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-canvas)] p-[0.48rem] shadow-[0_16px_30px_-22px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_35%,transparent)] data-[state=open]:grid"',
        '    (tngMenuSelect)="onMenuOverviewTailwindSelect($event)"',
        '  >',
        '    <div tngMenuGroupLabel class="px-[0.45rem] py-[0.2rem] text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--tng-semantic-foreground-secondary)]">Actions</div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Export report" class="min-h-[2rem] rounded-[0.6rem] bg-transparent px-[0.68rem] py-[0.42rem] text-left text-[0.88rem] font-[550] text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)] focus-visible:outline-none [&[data-active]]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))]">Export report</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Share link" class="min-h-[2rem] rounded-[0.6rem] bg-transparent px-[0.68rem] py-[0.42rem] text-left text-[0.88rem] font-[550] text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)] focus-visible:outline-none [&[data-active]]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))]">Share link</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Copy path" class="min-h-[2rem] rounded-[0.6rem] bg-transparent px-[0.68rem] py-[0.42rem] text-left text-[0.88rem] font-[550] text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)] focus-visible:outline-none [&[data-active]]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))]">Copy path</button>',
        '  </tng-menu>',
        '</div>',
        '<p class="text-[0.9rem] text-[var(--tng-semantic-foreground-secondary)]">last command: {{ menuOverviewTailwindLastCommand() }}</p>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menu-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainSelect(event: TngMenuSelectEvent): void {
    this.plainCommand.set(String(event.value));
  }

  protected onTailwindSelect(event: TngMenuSelectEvent): void {
    this.tailwindCommand.set(String(event.value));
  }
}
