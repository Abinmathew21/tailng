import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
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
  selector: 'app-menubar-overview-page',
  imports: [
    TngCodeBlockComponent,
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
  templateUrl: './menubar-overview-page.component.html',
  styleUrls: ['./menubar-overview-page.component.css'],
})
export class MenubarOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessCommand = signal('No command yet');
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

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-overview-headless.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenubar, TngMenubarItem, TngMenu, TngMenuItem } from '@tailng-ui/primitives';",
        '',
        'export class MenubarOverviewHeadlessComponent {',
        "  protected readonly lastCommand = signal('No command yet');",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-overview-headless.component.html',
      code: [
        '<div tngMenubar aria-label="Workspace commands">',
        '  <div tngMenu #fileMenu="tngMenu" (tngMenuSelect)="onCommandSelect($event)">',
        '    <button type="button" tngMenuItem tngMenuItemValue="Create document">New</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Open document">Open</button>',
        '  </div>',
        '  <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-overview-headless.component.css',
      code: [
        '.menubar-stage { position: relative; min-height: 14rem; }',
        '.menubar-item-shell { position: relative; }',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';",
        '',
        'export class MenubarOverviewPlainComponent {',
        "  protected readonly lastCommand = signal('No command yet');",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-overview-plain-css.component.html',
      code: [
        '<tng-menubar ariaLabel="Workspace commands">',
        '  <tng-menu #fileMenu="tngMenu" ariaLabel="File menu" (tngMenuSelect)="onCommandSelect($event)">',
        '    <button type="button" tngMenuItem tngMenuItemValue="Create document">New</button>',
        '  </tng-menu>',
        '  <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
        '</tng-menubar>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-overview-plain-css.component.css',
      code: [
        '.menubar-stage {',
        '  min-height: 14rem;',
        '  position: relative;',
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
        '',
        'export class MenubarOverviewTailwindComponent {',
        "  protected readonly lastCommand = signal('No command yet');",
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
        '  <tng-menubar ariaLabel="Workspace commands">',
        '    <tng-menu #fileMenu="tngMenu" ariaLabel="File menu">',
        '      <button type="button" tngMenuItem tngMenuItemValue="Create document">New</button>',
        '    </tng-menu>',
        '    <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
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

}
