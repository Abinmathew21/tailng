import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
  TngMenubar,
  TngMenubarItem,
} from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../menubar.util';

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

const plainCssStarter = [
  '.headless-menubar-shell {',
  '  display: inline-flex;',
  '  gap: 0.45rem;',
  '  min-height: 2.7rem;',
  '  padding: 0.32rem;',
  '  border: 1px solid #cbd5e1;',
  '  border-radius: 0.95rem;',
  '  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);',
  '}',
  '.headless-menubar-item-shell { position: relative; }',
  '.headless-menubar-menu[hidden] { display: none !important; }',
  '.headless-menubar-menu[data-state="open"] {',
  '  display: grid;',
  '  gap: 0.24rem;',
  '}',
  '',
].join('\n');

@Component({
  selector: 'app-headless-menubar-examples-page',
  imports: [
    TngMenu,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    TngMenubar,
    TngMenubarItem,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './menubar-examples-page.component.html',
  styleUrls: ['./menubar-examples-page.component.css'],
})
export class HeadlessMenubarExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly workspacePlainCommand = signal('No command yet');
  protected readonly workspaceTailwindCommand = signal('No command yet');
  protected readonly cascadePlainCommand = signal('No cascaded command yet');
  protected readonly cascadeTailwindCommand = signal('No cascaded command yet');

  protected readonly workspacePlainCodeTabs = createCodeTabs(
    'headless-menubar-workspace-plain',
    [
      "import { Component, signal } from '@angular/core';",
      'import {',
      '  TngMenu,',
      '  TngMenuGroupLabel,',
      '  TngMenuItem,',
      '  TngMenuSelectEvent,',
      '  TngMenuSeparator,',
      '  TngMenubar,',
      '  TngMenubarItem,',
      "} from '@tailng-ui/primitives';",
      '',
      'export class HeadlessMenubarWorkspacePlainComponent {',
      "  protected readonly lastCommand = signal('No command yet');",
      '',
      '  protected onCommandSelect(event: TngMenuSelectEvent): void {',
      '    this.lastCommand.set(String(event.value));',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="headless-menubar-stage headless-menubar-stage--short">',
      '  <div tngMenubar aria-label="Workspace commands" class="headless-menubar-shell">',
      '    <div class="headless-menubar-item-shell">',
      '      <div tngMenu #fileMenu="tngMenu" aria-label="File menu" class="headless-menubar-menu" (tngMenuSelect)="onCommandSelect($event)">',
      '        <div tngMenuGroupLabel class="headless-menubar-group">File</div>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Create release">New release</button>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Publish release">Publish</button>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
      '    </div>',
      '',
      '    <div class="headless-menubar-item-shell">',
      '      <div tngMenu #viewMenu="tngMenu" aria-label="View menu" class="headless-menubar-menu" (tngMenuSelect)="onCommandSelect($event)">',
      '        <button type="button" tngMenuItem tngMenuItemValue="Toggle sidebar">Toggle sidebar</button>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Open command palette">Command palette</button>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="viewMenu">View</button>',
      '    </div>',
      '',
      '    <button type="button" tngMenubarItem>Help</button>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    [
      plainCssStarter,
      '.headless-menubar-stage--short { min-height: 14.5rem; }',
      '.headless-menubar-shell [tngMenubarItem] {',
      '  min-width: 3.3rem;',
      '  min-height: 2.05rem;',
      '  padding: 0.46rem 0.9rem;',
      '  border: 0;',
      '  border-radius: 0.62rem;',
      '  background: transparent;',
      '  color: #0f172a;',
      '  font: inherit;',
      '  font-size: 0.95rem;',
      '  font-weight: 600;',
      '}',
      '.headless-menubar-menu {',
      '  position: absolute;',
      '  top: calc(100% + 0.45rem);',
      '  left: 0;',
      '  min-width: 13.8rem;',
      '  padding: 0.45rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.82rem;',
      '  background: #ffffff;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly workspaceTailwindCodeTabs = createCodeTabs(
    'headless-menubar-workspace-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngMenu, TngMenuGroupLabel, TngMenuItem, TngMenuSelectEvent, TngMenubar, TngMenubarItem } from '@tailng-ui/primitives';",
      '',
      'export class HeadlessMenubarWorkspaceTailwindComponent {',
      "  protected readonly lastCommand = signal('No command yet');",
      '',
      '  protected onCommandSelect(event: TngMenuSelectEvent): void {',
      '    this.lastCommand.set(String(event.value));',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="relative grid min-h-[14.5rem] justify-items-start content-start">',
      '  <div tngMenubar aria-label="Workspace commands" class="inline-flex min-h-[2.7rem] gap-[0.45rem] rounded-[0.95rem] border border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-[0.32rem] shadow-[0_8px_22px_-18px_rgba(15,23,42,0.26),0_10px_32px_-24px_rgba(15,23,42,0.18)]">',
      '    <div class="relative">',
      '      <div tngMenu #fileMenu="tngMenu" aria-label="File menu" class="absolute left-0 top-[calc(100%+0.45rem)] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-slate-300 bg-white p-[0.45rem] data-[state=open]:grid data-[state=open]:gap-[0.24rem]" (tngMenuSelect)="onCommandSelect($event)">',
      '        <div tngMenuGroupLabel class="px-[0.45rem] py-[0.25rem] text-[0.72rem] font-bold uppercase tracking-[0.08em] text-slate-500">File</div>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Create release" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">New release</button>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Publish release" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">Publish</button>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu" class="min-h-[2.05rem] min-w-[3.3rem] rounded-[0.62rem] px-[0.9rem] py-[0.46rem] text-[0.95rem] font-semibold text-slate-900 transition hover:bg-blue-50 focus-visible:bg-blue-50">File</button>',
      '    </div>',
      '',
      '    <div class="relative">',
      '      <div tngMenu #toolsMenu="tngMenu" aria-label="Tools menu" class="absolute left-0 top-[calc(100%+0.45rem)] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-slate-300 bg-white p-[0.45rem] data-[state=open]:grid data-[state=open]:gap-[0.24rem]" (tngMenuSelect)="onCommandSelect($event)">',
      '        <button type="button" tngMenuItem tngMenuItemValue="Run lint" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">Run lint</button>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Run tests" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">Run tests</button>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="toolsMenu" class="min-h-[2.05rem] min-w-[3.3rem] rounded-[0.62rem] px-[0.9rem] py-[0.46rem] text-[0.95rem] font-semibold text-slate-900 transition hover:bg-blue-50 focus-visible:bg-blue-50">Tools</button>',
      '    </div>',
      '',
      '    <button type="button" tngMenubarItem class="min-h-[2.05rem] min-w-[3.3rem] rounded-[0.62rem] px-[0.9rem] py-[0.46rem] text-[0.95rem] font-semibold text-slate-900 transition hover:bg-blue-50 focus-visible:bg-blue-50">Help</button>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */\n',
  );

  protected readonly cascadePlainCodeTabs = createCodeTabs(
    'headless-menubar-cascade-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngMenu, TngMenuItem, TngMenuSelectEvent, TngMenuSeparator, TngMenubar, TngMenubarItem } from '@tailng-ui/primitives';",
      '',
      'export class HeadlessMenubarCascadePlainComponent {',
      "  protected readonly lastCommand = signal('No cascaded command yet');",
      '',
      '  protected onCommandSelect(event: TngMenuSelectEvent): void {',
      '    this.lastCommand.set(String(event.value));',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="headless-menubar-stage headless-menubar-stage--cascade">',
      '  <div tngMenubar aria-label="Cascaded command bar" class="headless-menubar-shell">',
      '    <div class="headless-menubar-item-shell">',
      '      <div tngMenu #fileMenu="tngMenu" aria-label="File menu" class="headless-menubar-menu" (tngMenuSelect)="onCommandSelect($event)">',
      '        <button type="button" tngMenuItem tngMenuItemValue="Create project">Create project</button>',
      '        <button type="button" tngMenuItem [tngMenuItemSubmenu]="importMenu" tngMenuItemValue="Import from source">Import from…</button>',
      '        <div tngMenuSeparator class="headless-menubar-separator"></div>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Archive project">Archive project</button>',
      '',
      '        <div tngMenu #importMenu="tngMenu" aria-label="Import submenu" class="headless-menubar-menu headless-menubar-menu--submenu headless-menubar-menu--level-1" (tngMenuSelect)="onCommandSelect($event)">',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from CSV">CSV file</button>',
      '          <button type="button" tngMenuItem [tngMenuItemSubmenu]="gitMenu" tngMenuItemValue="Import from git">Git repository</button>',
      '        </div>',
      '',
      '        <div tngMenu #gitMenu="tngMenu" aria-label="Git provider submenu" class="headless-menubar-menu headless-menubar-menu--submenu headless-menubar-menu--level-2" (tngMenuSelect)="onCommandSelect($event)">',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub">GitHub</button>',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab">GitLab</button>',
      '        </div>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
      '    </div>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    [
      plainCssStarter,
      '.headless-menubar-stage--cascade { min-height: 22rem; }',
      '.headless-menubar-menu {',
      '  position: absolute;',
      '  left: 0;',
      '  top: calc(100% + 0.45rem);',
      '  min-width: 13.8rem;',
      '  padding: 0.45rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.82rem;',
      '  background: #ffffff;',
      '}',
      '.headless-menubar-menu--submenu { left: calc(100% + 0.42rem); }',
      '.headless-menubar-menu--level-1 { top: 2.7rem; }',
      '.headless-menubar-menu--level-2 { top: 5.5rem; }',
      '',
    ].join('\n'),
  );

  protected readonly cascadeTailwindCodeTabs = createCodeTabs(
    'headless-menubar-cascade-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngMenu, TngMenuItem, TngMenuSelectEvent, TngMenuSeparator, TngMenubar, TngMenubarItem } from '@tailng-ui/primitives';",
      '',
      'export class HeadlessMenubarCascadeTailwindComponent {',
      "  protected readonly lastCommand = signal('No cascaded command yet');",
      '',
      '  protected onCommandSelect(event: TngMenuSelectEvent): void {',
      '    this.lastCommand.set(String(event.value));',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="relative grid min-h-[22rem] justify-items-start content-start">',
      '  <div tngMenubar aria-label="Cascaded command bar" class="inline-flex min-h-[2.7rem] gap-[0.45rem] rounded-[0.95rem] border border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-[0.32rem] shadow-[0_8px_22px_-18px_rgba(15,23,42,0.26),0_10px_32px_-24px_rgba(15,23,42,0.18)]">',
      '    <div class="relative">',
      '      <div tngMenu #fileMenu="tngMenu" aria-label="File menu" class="absolute left-0 top-[calc(100%+0.45rem)] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-slate-300 bg-white p-[0.45rem] data-[state=open]:grid data-[state=open]:gap-[0.24rem]" (tngMenuSelect)="onCommandSelect($event)">',
      '        <button type="button" tngMenuItem tngMenuItemValue="Create project" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">Create project</button>',
      '        <button type="button" tngMenuItem [tngMenuItemSubmenu]="importMenu" tngMenuItemValue="Import from source" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">Import from…</button>',
      '        <div tngMenuSeparator class="mx-[0.35rem] my-[0.2rem] h-px bg-slate-200"></div>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Archive project" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">Archive project</button>',
      '',
      '        <div tngMenu #importMenu="tngMenu" aria-label="Import submenu" class="absolute left-[calc(100%+0.42rem)] top-[2.7rem] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-slate-300 bg-white p-[0.45rem] data-[state=open]:grid data-[state=open]:gap-[0.24rem]" (tngMenuSelect)="onCommandSelect($event)">',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from CSV" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">CSV file</button>',
      '          <button type="button" tngMenuItem [tngMenuItemSubmenu]="gitMenu" tngMenuItemValue="Import from git" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">Git repository</button>',
      '        </div>',
      '',
      '        <div tngMenu #gitMenu="tngMenu" aria-label="Git provider submenu" class="absolute left-[calc(100%+0.42rem)] top-[5.5rem] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-slate-300 bg-white p-[0.45rem] data-[state=open]:grid data-[state=open]:gap-[0.24rem]" (tngMenuSelect)="onCommandSelect($event)">',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">GitHub</button>',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab" class="rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 transition hover:bg-slate-100 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700">GitLab</button>',
      '        </div>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu" class="min-h-[2.05rem] min-w-[3.3rem] rounded-[0.62rem] px-[0.9rem] py-[0.46rem] text-[0.95rem] font-semibold text-slate-900 transition hover:bg-blue-50 focus-visible:bg-blue-50">File</button>',
      '    </div>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */\n',
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onWorkspacePlainCommandSelect(event: TngMenuSelectEvent): void {
    this.workspacePlainCommand.set(String(event.value));
  }

  protected onWorkspaceTailwindCommandSelect(event: TngMenuSelectEvent): void {
    this.workspaceTailwindCommand.set(String(event.value));
  }

  protected onCascadePlainCommandSelect(event: TngMenuSelectEvent): void {
    this.cascadePlainCommand.set(String(event.value));
  }

  protected onCascadeTailwindCommandSelect(event: TngMenuSelectEvent): void {
    this.cascadeTailwindCommand.set(String(event.value));
  }
}
