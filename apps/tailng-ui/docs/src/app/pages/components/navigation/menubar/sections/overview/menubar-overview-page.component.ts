import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import type {
  TngMenuSelectEvent} from '@tailng-ui/primitives';
import {
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenubar,
  TngMenubarGroup,
  TngMenubarItem,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../menubar.util';

@Component({
  selector: 'app-menubar-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngMenu,
    TngMenuComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenubar,
    TngMenubarGroup,
    TngMenubarComponent,
    TngMenubarItem,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './menubar-overview-page.component.html',
  styleUrls: ['./menubar-overview-page.component.css'],
})
export class MenubarOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly plainCommand = signal('No command yet');
  protected readonly tailwindCommand = signal('No command yet');

  protected readonly primitiveImportCode = [
    "import {",
    '  TngMenubar,',
    '  TngMenubarItem,',
    '  TngMenu,',
    '  TngMenuItem,',
    "} from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngMenubarComponent, TngMenuComponent } from '@tailng-ui/components';",
    "import { TngMenubarItem, TngMenuItem } from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<div tngMenubar aria-label="Workspace commands">',
    '  <div tngMenu #fileMenu="tngMenu">',
    '    <button type="button" tngMenuItem tngMenuItemValue="New file">New</button>',
    '  </div>',
    '  <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
    '</div>',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-menubar ariaLabel="Workspace commands">',
    '  <tng-menu #fileMenu="tngMenu" ariaLabel="File menu">',
    '    <button type="button" tngMenuItem tngMenuItemValue="New file">New</button>',
    '  </tng-menu>',
    '  <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
    '</tng-menubar>',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';",
        "import { TngMenuItem, TngMenubarGroup, TngMenubarItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-menubar-overview-plain-example',",
        '  standalone: true,',
        '  imports: [TngMenuComponent, TngMenubarComponent, TngMenuItem, TngMenubarGroup, TngMenubarItem],',
        "  templateUrl: './menubar-overview-plain-css.component.html',",
        "  styleUrl: './menubar-overview-plain-css.component.css',",
        '})',
        'export class MenubarOverviewPlainComponent {',
        "  protected readonly menubarOverviewPlainLastCommand = signal('No command yet');",
        '',
        '  protected onMenubarOverviewPlainCommandSelect(event: TngMenuSelectEvent): void {',
        '    this.menubarOverviewPlainLastCommand.set(String(event.value));',
        '  }',
        '',
        '  protected onMenubarOverviewPlainLeafSelect(command: string): void {',
        '    this.menubarOverviewPlainLastCommand.set(command);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-overview-plain-css.component.html',
      code: [
        '<tng-menubar ariaLabel="Workspace commands" class="menubar-overview-plain-shell">',
        '  <div tngMenubarGroup>',
        '    <tng-menu #menubarOverviewPlainFileMenu="tngMenu" ariaLabel="File menu" (tngMenuSelect)="onMenubarOverviewPlainCommandSelect($event)">',
        '      <button type="button" tngMenuItem tngMenuItemValue="Create document">New</button>',
        '      <button type="button" tngMenuItem [tngMenuItemSubmenu]="menubarOverviewPlainImportMenu" tngMenuItemValue="Import from source">Import from...</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Open document">Open</button>',
        '',
        '      <tng-menu #menubarOverviewPlainImportMenu="tngMenu" ariaLabel="Import submenu" (tngMenuSelect)="onMenubarOverviewPlainCommandSelect($event)">',
        '        <button type="button" tngMenuItem tngMenuItemValue="Import from CSV">CSV file</button>',
        '        <button type="button" tngMenuItem tngMenuItemValue="Import from Git">Git repository</button>',
        '      </tng-menu>',
        '    </tng-menu>',
        '    <button type="button" tngMenubarItem [tngMenubarMenu]="menubarOverviewPlainFileMenu">File</button>',
        '  </div>',
        '  <div tngMenubarGroup>',
        '    <tng-menu #menubarOverviewPlainViewMenu="tngMenu" ariaLabel="View menu" (tngMenuSelect)="onMenubarOverviewPlainCommandSelect($event)">',
        '      <button type="button" tngMenuItem tngMenuItemValue="Toggle sidebar">Toggle sidebar</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Open command palette">Command palette</button>',
        '    </tng-menu>',
        '    <button type="button" tngMenubarItem [tngMenubarMenu]="menubarOverviewPlainViewMenu">View</button>',
        '  </div>',
        '  <button type="button" tngMenubarItem (click)="onMenubarOverviewPlainLeafSelect(\'Help\')">Help</button>',
        '</tng-menubar>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-overview-plain-css.component.css',
      code: [
        '.menubar-overview-plain-shell {',
        '  align-items: center;',
        '  background: color-mix(in srgb, var(--tng-semantic-background-surface) 88%, transparent);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  display: inline-flex;',
        '  gap: 0.45rem;',
        '  min-height: 2.7rem;',
        '  padding: 0.32rem;',
        '  position: relative;',
        '}',
        '',
        '',
        '.menubar-overview-plain-shell [tngMenubarItem] {',
        '  background: transparent;',
        '  border: 0;',
        '  border-radius: 0.62rem;',
        '  color: var(--tng-semantic-foreground-primary);',
        '  cursor: pointer;',
        '  font-size: 0.95rem;',
        '  font-weight: 600;',
        '  line-height: 1.15;',
        '  min-height: 2.05rem;',
        '  min-width: 3.3rem;',
        '  padding: 0.46rem 0.9rem;',
        '  transition:',
        '    background-color 130ms ease,',
        '    color 130ms ease,',
        '    box-shadow 130ms ease;',
        '}',
        '',
        '.menubar-overview-plain-shell [tngMenubarItem]:is(:hover, :focus-visible) {',
        '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);',
        '  outline: none;',
        '}',
        '',
        ".menubar-overview-plain-shell [tngMenubarItem][tabindex='0'] {",
        '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 13%, transparent);',
        '  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tng-semantic-accent-brand) 42%, transparent);',
        '  color: color-mix(in srgb, var(--tng-semantic-accent-brand) 72%, var(--tng-semantic-foreground-primary));',
        '}',
        '',
        ".menubar-overview-plain-shell [tngMenubarItem][aria-expanded='true'] {",
        '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);',
        '  color: color-mix(in srgb, var(--tng-semantic-accent-brand) 74%, var(--tng-semantic-foreground-primary));',
        '}',
        '',
        ".menubar-overview-plain-shell [tngMenu][data-state='open'] {",
        '  background: var(--tng-semantic-background-canvas);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.82rem;',
        '  box-shadow: 0 16px 30px -22px color-mix(in srgb, var(--tng-semantic-foreground-primary) 35%, transparent);',
        '  display: grid;',
        '  gap: 0.24rem;',
        '  min-width: 13.5rem;',
        '  padding: 0.48rem;',
        '}',
        '',
        '.menubar-overview-plain-shell [tngMenu][hidden] {',
        '  display: none !important;',
        '}',
        '',
        '.menubar-overview-plain-shell [tngMenuGroupLabel] {',
        '  color: var(--tng-semantic-foreground-secondary);',
        '  font-size: 0.72rem;',
        '  font-weight: 700;',
        '  letter-spacing: 0.08em;',
        '  padding: 0.32rem 0.68rem 0.2rem;',
        '  text-transform: uppercase;',
        '  user-select: none;',
        '}',
        '',
        '.menubar-overview-plain-shell [tngMenuSeparator] {',
        '  background: color-mix(in srgb, var(--tng-semantic-border-subtle) 84%, transparent);',
        '  height: 1px;',
        '  margin: 0.2rem 0.35rem;',
        '}',
        '',
        '.menubar-overview-plain-shell [tngMenuItem] {',
        '  background: transparent;',
        '  border: 0;',
        '  border-radius: 0.62rem;',
        '  color: var(--tng-semantic-foreground-primary);',
        '  cursor: pointer;',
        '  font-size: 0.92rem;',
        '  font-weight: 550;',
        '  min-height: 2.05rem;',
        '  padding: 0.45rem 0.68rem;',
        '  text-align: left;',
        '  transition:',
        '    background-color 120ms ease,',
        '    color 120ms ease;',
        '}',
        '',
        '.menubar-overview-plain-shell [tngMenuItem]:hover {',
        '  background: color-mix(in srgb, var(--tng-semantic-foreground-primary) 8%, transparent);',
        '}',
        '',
        ".menubar-overview-plain-shell [tngMenuItem][data-active], .menubar-overview-plain-shell [tngMenuItem][aria-expanded='true'] {",
        '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);',
        '  color: color-mix(in srgb, var(--tng-semantic-accent-brand) 72%, var(--tng-semantic-foreground-primary));',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';",
        "import { TngMenuItem, TngMenubarGroup, TngMenubarItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-menubar-overview-tailwind-example',",
        '  standalone: true,',
        '  imports: [TngMenuComponent, TngMenubarComponent, TngMenuItem, TngMenubarGroup, TngMenubarItem],',
        "  templateUrl: './menubar-overview-tailwind.component.html',",
        "  styleUrl: './menubar-overview-tailwind.component.css',",
        '})',
        'export class MenubarOverviewTailwindComponent {',
        "  protected readonly menubarOverviewTailwindLastCommand = signal('No command yet');",
        '',
        '  protected onMenubarOverviewTailwindCommandSelect(event: TngMenuSelectEvent): void {',
        '    this.menubarOverviewTailwindLastCommand.set(String(event.value));',
        '  }',
        '',
        '  protected onMenubarOverviewTailwindLeafSelect(command: string): void {',
        '    this.menubarOverviewTailwindLastCommand.set(command);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-menubar',
        '    ariaLabel="Workspace commands"',
        '    class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm"',
        '  >',
        '    <div tngMenubarGroup>',
        '      <tng-menu',
        '        #menubarOverviewTailwindFileMenu="tngMenu"',
        '        ariaLabel="File menu"',
        '        class="hidden min-w-48 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xl data-[state=open]:grid"',
        '        (tngMenuSelect)="onMenubarOverviewTailwindCommandSelect($event)"',
        '      >',
        '      <button',
        '        type="button"',
        '        tngMenuItem',
        '        tngMenuItemValue="Create document"',
        '        class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950"',
        '      >New</button>',
        '      <button',
        '        type="button"',
        '        tngMenuItem',
        '        [tngMenuItemSubmenu]="menubarOverviewTailwindImportMenu"',
        '        tngMenuItemValue="Import from source"',
        '        class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950"',
        '      >Import from...</button>',
        '      <button',
        '        type="button"',
        '        tngMenuItem',
        '        tngMenuItemValue="Publish release"',
        '        class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950"',
        '      >Publish</button>',
        '        <tng-menu',
        '          #menubarOverviewTailwindImportMenu="tngMenu"',
        '          ariaLabel="Import submenu"',
        '          class="hidden min-w-48 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xl data-[state=open]:grid"',
        '          (tngMenuSelect)="onMenubarOverviewTailwindCommandSelect($event)"',
        '        >',
        '        <button type="button" tngMenuItem tngMenuItemValue="Import from CSV" class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950">CSV file</button>',
        '        <button type="button" tngMenuItem tngMenuItemValue="Import from Git" class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950">Git repository</button>',
        '        </tng-menu>',
        '      </tng-menu>',
        '      <button',
        '        type="button"',
        '        tngMenubarItem',
        '        [tngMenubarMenu]="menubarOverviewTailwindFileMenu"',
        '        class="inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-white focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/60 [&[tabindex=\'0\']]:bg-white [&[tabindex=\'0\']]:text-slate-950 [&[tabindex=\'0\']]:shadow-sm [&[aria-expanded=\'true\']]:bg-white [&[aria-expanded=\'true\']]:text-slate-950 [&[aria-expanded=\'true\']]:shadow-sm"',
        '      >File</button>',
        '    </div>',
        '    <div tngMenubarGroup>',
        '      <tng-menu',
        '        #menubarOverviewTailwindViewMenu="tngMenu"',
        '        ariaLabel="View menu"',
        '        class="hidden min-w-48 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xl data-[state=open]:grid"',
        '        (tngMenuSelect)="onMenubarOverviewTailwindCommandSelect($event)"',
        '      >',
        '      <button type="button" tngMenuItem tngMenuItemValue="Toggle sidebar" class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950">Toggle sidebar</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Open command palette" class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950">Command palette</button>',
        '      </tng-menu>',
        '      <button type="button" tngMenubarItem [tngMenubarMenu]="menubarOverviewTailwindViewMenu" class="inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-white focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/60 [&[tabindex=\'0\']]:bg-white [&[tabindex=\'0\']]:text-slate-950 [&[tabindex=\'0\']]:shadow-sm [&[aria-expanded=\'true\']]:bg-white [&[aria-expanded=\'true\']]:text-slate-950 [&[aria-expanded=\'true\']]:shadow-sm">View</button>',
        '    </div>',
        '    <button type="button" tngMenubarItem (click)="onMenubarOverviewTailwindLeafSelect(\'Help\')" class="inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-white focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/60 [&[tabindex=\'0\']]:bg-white [&[tabindex=\'0\']]:text-slate-950 [&[tabindex=\'0\']]:shadow-sm [&[aria-expanded=\'true\']]:bg-white [&[aria-expanded=\'true\']]:text-slate-950 [&[aria-expanded=\'true\']]:shadow-sm">Help</button>',
        '  </tng-menubar>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainCommandSelect(event: TngMenuSelectEvent): void {
    this.plainCommand.set(String(event.value));
  }

  protected onPlainLeafCommandSelect(command: string): void {
    this.plainCommand.set(command);
  }

  protected onTailwindCommandSelect(event: TngMenuSelectEvent): void {
    this.tailwindCommand.set(String(event.value));
  }

  protected onTailwindLeafCommandSelect(command: string): void {
    this.tailwindCommand.set(command);
  }

}
