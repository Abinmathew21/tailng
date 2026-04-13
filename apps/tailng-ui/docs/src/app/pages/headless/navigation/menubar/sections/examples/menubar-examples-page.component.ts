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

function createPlainCssStarter(prefix: string): string {
  return [
    `.${prefix}-shell {`,
    '  display: inline-flex;',
    '  gap: 0.45rem;',
    '  min-height: 2.7rem;',
    '  padding: 0.32rem;',
    '  border: 1px solid #cbd5e1;',
    '  border-radius: 0.95rem;',
    '  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);',
    '  box-shadow: 0 8px 22px -18px rgba(15, 23, 42, 0.26), 0 10px 32px -24px rgba(15, 23, 42, 0.18);',
    '}',
    `.${prefix}-item-shell { position: relative; }`,
    `.${prefix}-shell [tngMenubarItem] {`,
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
    '  line-height: 1.15;',
    '  cursor: pointer;',
    '  transition: background-color 130ms ease, color 130ms ease, box-shadow 130ms ease;',
    '}',
    `.${prefix}-shell [tngMenubarItem]:is(:hover, :focus-visible) {`,
    '  outline: none;',
    '  background: rgba(37, 99, 235, 0.1);',
    '}',
    `.${prefix}-shell [tngMenubarItem][tabindex="0"] {`,
    '  color: #1d4ed8;',
    '  background: rgba(37, 99, 235, 0.16);',
    '  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.22);',
    '  outline: none;',
    '}',
    `.${prefix}-shell [tngMenubarItem][aria-expanded="true"] {`,
    '  color: #1d4ed8;',
    '  background: rgba(37, 99, 235, 0.16);',
    '}',
    `.${prefix}-menu[hidden] { display: none !important; }`,
    `.${prefix}-menu[data-state="open"] {`,
    '  display: grid;',
    '  gap: 0.24rem;',
    '}',
    `.${prefix}-menu {`,
    '  z-index: 30;',
    '  box-shadow: 0 16px 30px -22px rgba(15, 23, 42, 0.35);',
    '}',
    `.${prefix}-menu [tngMenuItem] {`,
    '  display: flex;',
    '  justify-content: space-between;',
    '  min-height: 2rem;',
    '  padding: 0.4rem 0.62rem;',
    '  border: 0;',
    '  border-radius: 0.58rem;',
    '  background: transparent;',
    '  color: #0f172a;',
    '  font: inherit;',
    '  font-size: 0.86rem;',
    '  font-weight: 550;',
    '  text-align: left;',
    '  cursor: pointer;',
    '  transition: background-color 120ms ease, color 120ms ease;',
    '}',
    `.${prefix}-menu [tngMenuItem]:hover {`,
    '  background: rgba(15, 23, 42, 0.06);',
    '}',
    `.${prefix}-menu [tngMenuItem][data-active],`,
    `.${prefix}-menu [tngMenuItem][aria-expanded="true"] {`,
    '  color: #1d4ed8;',
    '  background: rgba(37, 99, 235, 0.16);',
    '}',
    '',
  ].join('\n');
}

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
      "  protected readonly workspacePlainLastCommand = signal('No command yet');",
      '',
      '  protected onWorkspacePlainCommandSelect(event: TngMenuSelectEvent): void {',
      '    this.workspacePlainLastCommand.set(String(event.value));',
      '  }',
      '',
      '  protected onWorkspacePlainLeafCommandSelect(value: string): void {',
      '    this.workspacePlainLastCommand.set(value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="headless-menubar-workspace-plain-stage headless-menubar-workspace-plain-stage--short">',
      '  <div tngMenubar aria-label="Workspace commands" class="headless-menubar-workspace-plain-shell">',
      '    <div class="headless-menubar-workspace-plain-item-shell">',
      '      <div tngMenu #workspacePlainSnippetFileMenu="tngMenu" aria-label="File menu" class="headless-menubar-workspace-plain-menu" (tngMenuSelect)="onWorkspacePlainCommandSelect($event)">',
      '        <div tngMenuGroupLabel class="headless-menubar-workspace-plain-group">File</div>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Create release">New release</button>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Publish release">Publish</button>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="workspacePlainSnippetFileMenu">File</button>',
      '    </div>',
      '',
      '    <div class="headless-menubar-workspace-plain-item-shell">',
      '      <div tngMenu #workspacePlainSnippetViewMenu="tngMenu" aria-label="View menu" class="headless-menubar-workspace-plain-menu" (tngMenuSelect)="onWorkspacePlainCommandSelect($event)">',
      '        <button type="button" tngMenuItem tngMenuItemValue="Toggle sidebar">Toggle sidebar</button>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Open command palette">Command palette</button>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="workspacePlainSnippetViewMenu">View</button>',
      '    </div>',
      '',
      '    <button type="button" tngMenubarItem (click)="onWorkspacePlainLeafCommandSelect(\'Help\')">Help</button>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    [
      createPlainCssStarter('headless-menubar-workspace-plain'),
      '.headless-menubar-workspace-plain-shell [tngMenubarItem] {',
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
      '.headless-menubar-workspace-plain-menu {',
      '  position: absolute;',
      '  top: calc(100% + 0.45rem);',
      '  left: 0;',
      '  min-width: 13.8rem;',
      '  padding: 0.45rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.82rem;',
      '  background: #ffffff;',
      '}',
      '.headless-menubar-workspace-plain-group {',
      '  padding: 0.25rem 0.45rem;',
      '  color: #64748b;',
      '  font-size: 0.72rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.08em;',
      '  text-transform: uppercase;',
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
      "  protected readonly workspaceTailwindLastCommand = signal('No command yet');",
      '',
      '  protected onWorkspaceTailwindCommandSelect(event: TngMenuSelectEvent): void {',
      '    this.workspaceTailwindLastCommand.set(String(event.value));',
      '  }',
      '',
      '  protected onWorkspaceTailwindLeafCommandSelect(value: string): void {',
      '    this.workspaceTailwindLastCommand.set(value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="relative grid justify-items-start content-start">',
      '  <div tngMenubar aria-label="Workspace commands" class="inline-flex min-h-[2.7rem] gap-[0.45rem] rounded-[0.95rem] border border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-[0.32rem] shadow-[0_8px_22px_-18px_rgba(15,23,42,0.26),0_10px_32px_-24px_rgba(15,23,42,0.18)]">',
      '    <div class="relative">',
      '      <div tngMenu #workspaceTailwindSnippetFileMenu="tngMenu" aria-label="File menu" class="absolute left-0 top-[calc(100%+0.45rem)] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-slate-300 bg-white p-[0.45rem] shadow-[0_16px_30px_-22px_rgba(15,23,42,0.35)] data-[state=open]:grid data-[state=open]:gap-[0.24rem]" (tngMenuSelect)="onWorkspaceTailwindCommandSelect($event)">',
      '        <div tngMenuGroupLabel class="px-[0.45rem] py-[0.25rem] text-[0.72rem] font-bold uppercase tracking-[0.08em] text-slate-500">File</div>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Create release" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">New release</button>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Publish release" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">Publish</button>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="workspaceTailwindSnippetFileMenu" class="headless-menubar-workspace-tailwind-item min-h-[2.05rem] min-w-[3.3rem] rounded-[0.62rem] px-[0.9rem] py-[0.46rem] text-[0.95rem] font-semibold text-slate-900 outline-none transition hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700 focus:shadow-[inset_0_0_0_1px_rgba(37,99,235,0.22)] focus-visible:ring-2 focus-visible:ring-blue-400/40 aria-[expanded=true]:bg-blue-100 aria-[expanded=true]:text-blue-700 aria-[expanded=true]:shadow-[inset_0_0_0_1px_rgba(37,99,235,0.22)]">File</button>',
      '    </div>',
      '',
      '    <div class="relative">',
      '      <div tngMenu #workspaceTailwindSnippetToolsMenu="tngMenu" aria-label="Tools menu" class="absolute left-0 top-[calc(100%+0.45rem)] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-slate-300 bg-white p-[0.45rem] shadow-[0_16px_30px_-22px_rgba(15,23,42,0.35)] data-[state=open]:grid data-[state=open]:gap-[0.24rem]" (tngMenuSelect)="onWorkspaceTailwindCommandSelect($event)">',
      '        <button type="button" tngMenuItem tngMenuItemValue="Run lint" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">Run lint</button>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Run tests" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">Run tests</button>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="workspaceTailwindSnippetToolsMenu" class="headless-menubar-workspace-tailwind-item min-h-[2.05rem] min-w-[3.3rem] rounded-[0.62rem] px-[0.9rem] py-[0.46rem] text-[0.95rem] font-semibold text-slate-900 outline-none transition hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700 focus:shadow-[inset_0_0_0_1px_rgba(37,99,235,0.22)] focus-visible:ring-2 focus-visible:ring-blue-400/40 aria-[expanded=true]:bg-blue-100 aria-[expanded=true]:text-blue-700 aria-[expanded=true]:shadow-[inset_0_0_0_1px_rgba(37,99,235,0.22)]">Tools</button>',
      '    </div>',
      '',
      '    <button type="button" tngMenubarItem (click)="onWorkspaceTailwindLeafCommandSelect(\'Help\')" class="headless-menubar-workspace-tailwind-item min-h-[2.05rem] min-w-[3.3rem] rounded-[0.62rem] px-[0.9rem] py-[0.46rem] text-[0.95rem] font-semibold text-slate-900 outline-none transition hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700 focus:shadow-[inset_0_0_0_1px_rgba(37,99,235,0.22)] focus-visible:ring-2 focus-visible:ring-blue-400/40">Help</button>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    [
      ".headless-menubar-workspace-tailwind-item[tabindex='0'] {",
      '  background: rgba(37, 99, 235, 0.16);',
      '  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.22);',
      '  color: #1d4ed8;',
      '  outline: none;',
      '}',
      '',
      ".headless-menubar-workspace-tailwind-item[aria-expanded='true'] {",
      '  background: rgba(37, 99, 235, 0.16);',
      '  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.22);',
      '  color: #1d4ed8;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly cascadePlainCodeTabs = createCodeTabs(
    'headless-menubar-cascade-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngMenu, TngMenuItem, TngMenuSelectEvent, TngMenuSeparator, TngMenubar, TngMenubarItem } from '@tailng-ui/primitives';",
      '',
      'export class HeadlessMenubarCascadePlainComponent {',
      "  protected readonly cascadePlainLastCommand = signal('No cascaded command yet');",
      '',
      '  protected onCascadePlainCommandSelect(event: TngMenuSelectEvent): void {',
      '    this.cascadePlainLastCommand.set(String(event.value));',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="headless-menubar-cascade-plain-stage headless-menubar-cascade-plain-stage--cascade">',
      '  <div tngMenubar aria-label="Cascaded command bar" class="headless-menubar-cascade-plain-shell">',
      '    <div class="headless-menubar-cascade-plain-item-shell">',
      '      <div tngMenu #cascadePlainSnippetFileMenu="tngMenu" aria-label="File menu" class="headless-menubar-cascade-plain-menu" (tngMenuSelect)="onCascadePlainCommandSelect($event)">',
      '        <button type="button" tngMenuItem tngMenuItemValue="Create project">Create project</button>',
      '        <button type="button" tngMenuItem [tngMenuItemSubmenu]="cascadePlainSnippetImportMenu" tngMenuItemValue="Import from source">Import from…</button>',
      '        <div tngMenuSeparator class="headless-menubar-cascade-plain-separator"></div>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Archive project">Archive project</button>',
      '',
      '        <div tngMenu #cascadePlainSnippetImportMenu="tngMenu" aria-label="Import submenu" class="headless-menubar-cascade-plain-menu headless-menubar-cascade-plain-menu--submenu headless-menubar-cascade-plain-menu--level-1" (tngMenuSelect)="onCascadePlainCommandSelect($event)">',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from CSV">CSV file</button>',
      '          <button type="button" tngMenuItem [tngMenuItemSubmenu]="cascadePlainSnippetGitMenu" tngMenuItemValue="Import from git">Git repository</button>',
      '        </div>',
      '',
      '        <div tngMenu #cascadePlainSnippetGitMenu="tngMenu" aria-label="Git provider submenu" class="headless-menubar-cascade-plain-menu headless-menubar-cascade-plain-menu--submenu headless-menubar-cascade-plain-menu--level-2" (tngMenuSelect)="onCascadePlainCommandSelect($event)">',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub">GitHub</button>',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab">GitLab</button>',
      '        </div>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="cascadePlainSnippetFileMenu">File</button>',
      '    </div>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    [
      createPlainCssStarter('headless-menubar-cascade-plain'),
      '.headless-menubar-cascade-plain-menu {',
      '  position: absolute;',
      '  left: 0;',
      '  top: calc(100% + 0.45rem);',
      '  min-width: 13.8rem;',
      '  padding: 0.45rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 0.82rem;',
      '  background: #ffffff;',
      '}',
      '.headless-menubar-cascade-plain-separator {',
      '  height: 1px;',
      '  margin: 0.2rem 0.35rem;',
      '  background: rgba(148, 163, 184, 0.45);',
      '}',
      '.headless-menubar-cascade-plain-menu--submenu { left: calc(100% + 0.42rem); }',
      '.headless-menubar-cascade-plain-menu--level-1 { top: 2.7rem; }',
      '.headless-menubar-cascade-plain-menu--level-2 { top: 5.5rem; }',
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
      "  protected readonly cascadeTailwindLastCommand = signal('No cascaded command yet');",
      '',
      '  protected onCascadeTailwindCommandSelect(event: TngMenuSelectEvent): void {',
      '    this.cascadeTailwindLastCommand.set(String(event.value));',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="relative grid justify-items-start content-start">',
      '  <div tngMenubar aria-label="Cascaded command bar" class="inline-flex min-h-[2.7rem] gap-[0.45rem] rounded-[0.95rem] border border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-[0.32rem] shadow-[0_8px_22px_-18px_rgba(15,23,42,0.26),0_10px_32px_-24px_rgba(15,23,42,0.18)]">',
      '    <div class="relative">',
      '      <div tngMenu #cascadeTailwindSnippetFileMenu="tngMenu" aria-label="File menu" class="absolute left-0 top-[calc(100%+0.45rem)] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-slate-300 bg-white p-[0.45rem] shadow-[0_16px_30px_-22px_rgba(15,23,42,0.35)] data-[state=open]:grid data-[state=open]:gap-[0.24rem]" (tngMenuSelect)="onCascadeTailwindCommandSelect($event)">',
      '        <button type="button" tngMenuItem tngMenuItemValue="Create project" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">Create project</button>',
      '        <button type="button" tngMenuItem [tngMenuItemSubmenu]="cascadeTailwindSnippetImportMenu" tngMenuItemValue="Import from source" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">Import from…</button>',
      '        <div tngMenuSeparator class="mx-[0.35rem] my-[0.2rem] h-px bg-slate-200"></div>',
      '        <button type="button" tngMenuItem tngMenuItemValue="Archive project" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">Archive project</button>',
      '',
      '        <div tngMenu #cascadeTailwindSnippetImportMenu="tngMenu" aria-label="Import submenu" class="absolute left-[calc(100%+0.42rem)] top-[2.7rem] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-slate-300 bg-white p-[0.45rem] shadow-[0_16px_30px_-22px_rgba(15,23,42,0.35)] data-[state=open]:grid data-[state=open]:gap-[0.24rem]" (tngMenuSelect)="onCascadeTailwindCommandSelect($event)">',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from CSV" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">CSV file</button>',
      '          <button type="button" tngMenuItem [tngMenuItemSubmenu]="cascadeTailwindSnippetGitMenu" tngMenuItemValue="Import from git" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">Git repository</button>',
      '        </div>',
      '',
      '        <div tngMenu #cascadeTailwindSnippetGitMenu="tngMenu" aria-label="Git provider submenu" class="absolute left-[calc(100%+0.42rem)] top-[5.5rem] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-slate-300 bg-white p-[0.45rem] shadow-[0_16px_30px_-22px_rgba(15,23,42,0.35)] data-[state=open]:grid data-[state=open]:gap-[0.24rem]" (tngMenuSelect)="onCascadeTailwindCommandSelect($event)">',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">GitHub</button>',
      '          <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab" class="flex min-h-[2rem] justify-between rounded-[0.58rem] px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-medium text-slate-900 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus:bg-blue-100 focus:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400/40 [&[data-active]]:bg-blue-100 [&[data-active]]:text-blue-700">GitLab</button>',
      '        </div>',
      '      </div>',
      '      <button type="button" tngMenubarItem [tngMenubarMenu]="cascadeTailwindSnippetFileMenu" class="headless-menubar-cascade-tailwind-item min-h-[2.05rem] min-w-[3.3rem] rounded-[0.62rem] px-[0.9rem] py-[0.46rem] text-[0.95rem] font-semibold text-slate-900 outline-none transition hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700 focus:shadow-[inset_0_0_0_1px_rgba(37,99,235,0.22)] focus-visible:ring-2 focus-visible:ring-blue-400/40 aria-[expanded=true]:bg-blue-100 aria-[expanded=true]:text-blue-700 aria-[expanded=true]:shadow-[inset_0_0_0_1px_rgba(37,99,235,0.22)]">File</button>',
      '    </div>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    [
      ".headless-menubar-cascade-tailwind-item[tabindex='0'] {",
      '  background: rgba(37, 99, 235, 0.16);',
      '  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.22);',
      '  color: #1d4ed8;',
      '  outline: none;',
      '}',
      '',
      ".headless-menubar-cascade-tailwind-item[aria-expanded='true'] {",
      '  background: rgba(37, 99, 235, 0.16);',
      '  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.22);',
      '  color: #1d4ed8;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onWorkspacePlainCommandSelect(event: TngMenuSelectEvent): void {
    this.workspacePlainCommand.set(String(event.value));
  }

  protected onWorkspacePlainLeafCommandSelect(value: string): void {
    this.workspacePlainCommand.set(value);
  }

  protected onWorkspaceTailwindCommandSelect(event: TngMenuSelectEvent): void {
    this.workspaceTailwindCommand.set(String(event.value));
  }

  protected onWorkspaceTailwindLeafCommandSelect(value: string): void {
    this.workspaceTailwindCommand.set(value);
  }

  protected onCascadePlainCommandSelect(event: TngMenuSelectEvent): void {
    this.cascadePlainCommand.set(String(event.value));
  }

  protected onCascadeTailwindCommandSelect(event: TngMenuSelectEvent): void {
    this.cascadeTailwindCommand.set(String(event.value));
  }
}
