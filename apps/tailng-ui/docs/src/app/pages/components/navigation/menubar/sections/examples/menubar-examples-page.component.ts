import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import {
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
  TngMenubar,
  TngMenubarItem,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-menubar-examples-page',
  imports: [
    TngMenu,
    TngMenuComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    TngMenubar,
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

  protected readonly headlessCommand = signal('No command yet');
  protected readonly plainCommand = signal('No command yet');
  protected readonly tailwindCommand = signal('No command yet');
  protected readonly cascadeCommand = signal('No command yet');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-examples-headless.component.ts',
      code: [
        "readonly lastCommand = signal('No command yet');",
        '',
        'onMenuSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-examples-headless.component.html',
      code: [
        '<div tngMenubar aria-label="Workspace commands">',
        '  <div class="menubar-item-shell">',
        '    <div tngMenu #fileMenu="tngMenu" (tngMenuSelect)="onMenuSelect($event)">',
        '      <button type="button" tngMenuItem tngMenuItemValue="Create document">New</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Open document">Open</button>',
        '    </div>',
        '    <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-examples-headless.component.css',
      code: '.menubar-item-shell { position: relative; }',
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-examples-plain-css.component.ts',
      code: [
        "readonly lastCommand = signal('No command yet');",
        '',
        'onMenuSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-examples-plain-css.component.html',
      code: [
        '<tng-menubar ariaLabel="Workspace commands">',
        '  <div class="menubar-item-shell">',
        '    <tng-menu #fileMenu="tngMenu" ariaLabel="File menu" (tngMenuSelect)="onMenuSelect($event)">',
        '      <button type="button" tngMenuItem tngMenuItemValue="Create document">New</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Open document">Open</button>',
        '    </tng-menu>',
        '    <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
        '  </div>',
        '</tng-menubar>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-examples-plain-css.component.css',
      code: [
        '.menubar-shell {',
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
        "readonly lastCommand = signal('No command yet');",
        '',
        'onMenuSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
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
        '    class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm"',
        '  >',
        '    <div class="menubar-item-shell">',
        '      <tng-menu',
        '        #fileMenu="tngMenu"',
        '        ariaLabel="File menu"',
        '        class="grid min-w-48 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xl"',
        '      >',
        '        <button',
        '          type="button"',
        '          tngMenuItem',
        '          tngMenuItemValue="Create document"',
        '          class="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 outline-none transition hover:bg-sky-50 hover:text-slate-950 focus-visible:bg-sky-50 focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/50 [&[data-active]]:bg-sky-50 [&[data-active]]:text-slate-950"',
        '        >New</button>',
        '      </tng-menu>',
        '      <button',
        '        type="button"',
        '        tngMenubarItem',
        '        [tngMenubarMenu]="fileMenu"',
        '        class="inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-white focus-visible:text-slate-950 focus-visible:ring-2 focus-visible:ring-sky-400/60 [&[tabindex=\'0\']]:bg-white [&[tabindex=\'0\']]:text-slate-950 [&[tabindex=\'0\']]:shadow-sm [&[aria-expanded=\'true\']]:bg-white [&[aria-expanded=\'true\']]:text-slate-950 [&[aria-expanded=\'true\']]:shadow-sm"',
        '      >File</button>',
        '    </div>',
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

  protected onHeadlessCommandSelect(event: TngMenuSelectEvent): void {
    this.headlessCommand.set(String(event.value));
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
