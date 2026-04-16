import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import type {
  TngMenuSelectEvent
} from '@tailng-ui/primitives';
import {
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenubar,
  TngMenubarGroup,
  TngMenubarItem
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-menubar-examples-page',
  imports: [
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
  templateUrl: './menubar-examples-page.component.html',
  styleUrls: ['./menubar-examples-page.component.css'],
})
export class MenubarExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly plainCommand = signal('No command yet');
  protected readonly tailwindCommand = signal('No command yet');
  protected readonly cascadeCommand = signal('No command yet');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-examples-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';",
        "import { TngMenuItem, TngMenubarGroup, TngMenubarItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-menubar-examples-plain-css',",
        '  standalone: true,',
        '  imports: [TngMenuComponent, TngMenubarComponent, TngMenuItem, TngMenubarGroup, TngMenubarItem],',
        "  templateUrl: './menubar-examples-plain-css.component.html',",
        "  styleUrl: './menubar-examples-plain-css.component.css',",
        '})',
        'export class MenubarExamplesPlainCssComponent {',
        "readonly menubarExamplesPlainLastCommand = signal('No command yet');",
        '',
        '  onMenubarExamplesPlainMenuSelect(event: TngMenuSelectEvent): void {',
        '    this.menubarExamplesPlainLastCommand.set(String(event.value));',
        '  }',
        '',
        '  onMenubarExamplesPlainLeafSelect(command: string): void {',
        '    this.menubarExamplesPlainLastCommand.set(command);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-examples-plain-css.component.html',
      code: [
        '<tng-menubar ariaLabel="Workspace commands" class="menubar-examples-plain-shell">',
        '  <div tngMenubarGroup class="menubar-examples-plain-item-shell">',
        '    <tng-menu #menubarExamplesPlainFileMenu="tngMenu" ariaLabel="File menu" (tngMenuSelect)="onMenubarExamplesPlainMenuSelect($event)">',
        '      <button type="button" tngMenuItem tngMenuItemValue="Create release">New release</button>',
        '      <button type="button" tngMenuItem [tngMenuItemSubmenu]="menubarExamplesPlainImportMenu" tngMenuItemValue="Import from source">Import from...</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Publish release">Publish</button>',
        '',
        '      <tng-menu #menubarExamplesPlainImportMenu="tngMenu" ariaLabel="Import submenu" (tngMenuSelect)="onMenubarExamplesPlainMenuSelect($event)">',
        '        <button type="button" tngMenuItem tngMenuItemValue="Import from CSV">CSV file</button>',
        '        <button type="button" tngMenuItem tngMenuItemValue="Import from Git">Git repository</button>',
        '      </tng-menu>',
        '    </tng-menu>',
        '    <button type="button" tngMenubarItem [tngMenubarMenu]="menubarExamplesPlainFileMenu">File</button>',
        '  </div>',
        '  <div tngMenubarGroup class="menubar-examples-plain-item-shell">',
        '    <tng-menu #menubarExamplesPlainViewMenu="tngMenu" ariaLabel="View menu" (tngMenuSelect)="onMenubarExamplesPlainMenuSelect($event)">',
        '      <button type="button" tngMenuItem tngMenuItemValue="Toggle sidebar">Toggle sidebar</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Open command palette">Command palette</button>',
        '    </tng-menu>',
        '    <button type="button" tngMenubarItem [tngMenubarMenu]="menubarExamplesPlainViewMenu">View</button>',
        '  </div>',
        '  <button type="button" tngMenubarItem (click)="onMenubarExamplesPlainLeafSelect(\'Help\')">Help</button>',
        '</tng-menubar>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-examples-plain-css.component.css',
      code: [
        '.menubar-examples-plain-shell {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.85rem;',
        '  display: inline-flex;',
        '  gap: 0.35rem;',
        '  padding: 0.35rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-examples-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';",
        "import { TngMenuItem, TngMenubarGroup, TngMenubarItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-menubar-examples-tailwind',",
        '  standalone: true,',
        '  imports: [TngMenuComponent, TngMenubarComponent, TngMenuItem, TngMenubarGroup, TngMenubarItem],',
        "  templateUrl: './menubar-examples-tailwind.component.html',",
        "  styleUrl: './menubar-examples-tailwind.component.css',",
        '})',
        'export class MenubarExamplesTailwindComponent {',
        "readonly menubarExamplesTailwindLastCommand = signal('No command yet');",
        '',
        '  onMenubarExamplesTailwindMenuSelect(event: TngMenuSelectEvent): void {',
        '    this.menubarExamplesTailwindLastCommand.set(String(event.value));',
        '  }',
        '',
        '  onMenubarExamplesTailwindLeafSelect(command: string): void {',
        '    this.menubarExamplesTailwindLastCommand.set(command);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-menubar',
        '    ariaLabel="Workspace commands"',
        '    class="menubar-examples-tailwind-shell inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm"',
        '  >',
        '    <div tngMenubarGroup class="menubar-examples-tailwind-item-shell">',
        '      <tng-menu',
        '        #menubarExamplesTailwindFileMenu="tngMenu"',
        '        ariaLabel="File menu"',
        '        class="menubar-examples-tailwind-menu hidden min-w-48 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xl data-[state=open]:grid"',
        '        (tngMenuSelect)="onMenubarExamplesTailwindMenuSelect($event)"',
        '      >',
        '        <button',
        '          type="button"',
        '          tngMenuItem',
        '          tngMenuItemValue="Create release"',
        '          class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950"',
        '        >New release</button>',
        '        <button',
        '          type="button"',
        '          tngMenuItem',
        '          [tngMenuItemSubmenu]="menubarExamplesTailwindImportMenu"',
        '          tngMenuItemValue="Import from source"',
        '          class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950"',
        '        >Import from...</button>',
        '        <button',
        '          type="button"',
        '          tngMenuItem',
        '          tngMenuItemValue="Publish release"',
        '          class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950"',
        '        >Publish</button>',
        '        <tng-menu',
        '          #menubarExamplesTailwindImportMenu="tngMenu"',
        '          ariaLabel="Import submenu"',
        '          class="hidden min-w-48 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xl data-[state=open]:grid"',
        '          (tngMenuSelect)="onMenubarExamplesTailwindMenuSelect($event)"',
        '        >',
        '          <button type="button" tngMenuItem tngMenuItemValue="Import from CSV" class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950">CSV file</button>',
        '          <button type="button" tngMenuItem tngMenuItemValue="Import from Git" class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950">Git repository</button>',
        '        </tng-menu>',
        '      </tng-menu>',
        '      <button',
        '        type="button"',
        '        tngMenubarItem',
        '        [tngMenubarMenu]="menubarExamplesTailwindFileMenu"',
        '        class="inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-white focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/60 [&[tabindex=\'0\']]:bg-white [&[tabindex=\'0\']]:text-slate-950 [&[tabindex=\'0\']]:shadow-sm [&[aria-expanded=\'true\']]:bg-white [&[aria-expanded=\'true\']]:text-slate-950 [&[aria-expanded=\'true\']]:shadow-sm"',
        '      >File</button>',
        '    </div>',
        '    <div tngMenubarGroup class="menubar-examples-tailwind-item-shell">',
        '      <tng-menu',
        '        #menubarExamplesTailwindViewMenu="tngMenu"',
        '        ariaLabel="View menu"',
        '        class="hidden min-w-48 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xl data-[state=open]:grid"',
        '        (tngMenuSelect)="onMenubarExamplesTailwindMenuSelect($event)"',
        '      >',
        '        <button type="button" tngMenuItem tngMenuItemValue="Toggle sidebar" class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950">Toggle sidebar</button>',
        '        <button type="button" tngMenuItem tngMenuItemValue="Open command palette" class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950">Command palette</button>',
        '      </tng-menu>',
        '      <button',
        '        type="button"',
        '        tngMenubarItem',
        '        [tngMenubarMenu]="menubarExamplesTailwindViewMenu"',
        '        class="inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-white focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/60 [&[tabindex=\'0\']]:bg-white [&[tabindex=\'0\']]:text-slate-950 [&[tabindex=\'0\']]:shadow-sm [&[aria-expanded=\'true\']]:bg-white [&[aria-expanded=\'true\']]:text-slate-950 [&[aria-expanded=\'true\']]:shadow-sm"',
        '      >View</button>',
        '    </div>',
        '    <button type="button" tngMenubarItem (click)="onMenubarExamplesTailwindLeafSelect(\'Help\')" class="inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-white focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/60 [&[tabindex=\'0\']]:bg-white [&[tabindex=\'0\']]:text-slate-950 [&[tabindex=\'0\']]:shadow-sm [&[aria-expanded=\'true\']]:bg-white [&[aria-expanded=\'true\']]:text-slate-950 [&[aria-expanded=\'true\']]:shadow-sm">Help</button>',
        '  </tng-menubar>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainCommandSelect(event: TngMenuSelectEvent): void {
    this.plainCommand.set(String(event.value));
  }

  protected onTailwindCommandSelect(event: TngMenuSelectEvent): void {
    this.tailwindCommand.set(String(event.value));
  }

  protected onCascadeCommandSelect(event: TngMenuSelectEvent): void {
    this.cascadeCommand.set(String(event.value));
  }

}
