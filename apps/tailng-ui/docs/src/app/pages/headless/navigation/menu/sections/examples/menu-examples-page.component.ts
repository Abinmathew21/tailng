import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
  TngMenuTrigger,
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../menu.util';

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

function createMenuExamplePlainStarter(prefix: string, withSubmenu: boolean): string {
  const p = prefix;
  const lines: string[] = [
    '.' + p + '-shell { position: relative; display: inline-block; }',
    '.' + p + "-shell [data-slot='menu-trigger'] {",
    '  min-height: 2.05rem;',
    '  padding: 0.46rem 0.9rem;',
    '  border: 1px solid var(--tng-semantic-border-strong, #94a3b8);',
    '  border-radius: 0.62rem;',
    '  background: color-mix(in srgb, var(--tng-semantic-background-surface, #f8fafc) 90%, transparent);',
    '  box-shadow: 0 1px 2px color-mix(in srgb, var(--tng-semantic-foreground-primary, #0f172a) 8%, transparent);',
    '  color: var(--tng-semantic-foreground-primary, #0f172a);',
    '  font: inherit;',
    '  font-size: 0.95rem;',
    '  font-weight: 600;',
    '  line-height: 1.15;',
    '  cursor: pointer;',
    '  transition:',
    '    background-color 130ms ease,',
    '    border-color 130ms ease,',
    '    color 130ms ease,',
    '    box-shadow 130ms ease;',
    '}',
    '.' + p + "-shell [data-slot='menu-trigger']:hover {",
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 14%, var(--tng-semantic-background-surface, #f8fafc));',
    '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 45%, var(--tng-semantic-border-strong, #94a3b8));',
    '}',
    '.' + p + "-shell [data-slot='menu-trigger']:focus-visible {",
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 14%, var(--tng-semantic-background-surface, #f8fafc));',
    '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 45%, var(--tng-semantic-border-strong, #94a3b8));',
    '  outline: 2px solid var(--tng-semantic-focus-ring, #93c5fd);',
    '  outline-offset: 2px;',
    '}',
    '.' + p + "-shell [data-slot='menu-trigger'][aria-expanded='true'] {",
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 22%, var(--tng-semantic-background-surface, #f8fafc));',
    '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 55%, var(--tng-semantic-border-strong, #94a3b8));',
    '  color: var(--tng-semantic-accent-brand, #2563eb);',
    '  box-shadow:',
    '    0 1px 2px color-mix(in srgb, var(--tng-semantic-foreground-primary, #0f172a) 8%, transparent),',
    '    inset 0 0 0 1px color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 35%, transparent);',
    '}',
    '.' + p + '-menu[hidden] { display: none !important; }',
    '.' + p + "-menu[data-state='open'] {",
    '  display: grid;',
    '  gap: 0.24rem;',
    '}',
    '.' + p + '-menu {',
    '  position: absolute;',
    '  left: 0;',
    '  top: calc(100% + 0.45rem);',
    '  z-index: 30;',
    '  min-width: 13.8rem;',
    '  padding: 0.45rem;',
    '  border: 1px solid var(--tng-semantic-border-strong, #94a3b8);',
    '  border-radius: 0.82rem;',
    '  background: var(--tng-semantic-background-canvas, #ffffff);',
    '  box-shadow: 0 16px 30px -22px color-mix(in srgb, var(--tng-semantic-foreground-primary, #0f172a) 35%, transparent);',
    '}',
    '.' + p + '-group {',
    '  padding: 0.25rem 0.45rem;',
    '  color: var(--tng-semantic-foreground-secondary, #64748b);',
    '  font-size: 0.72rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.08em;',
    '  text-transform: uppercase;',
    '}',
    '.' + p + '-separator {',
    '  height: 1px;',
    '  margin: 0.2rem 0.35rem;',
    '  background: var(--tng-semantic-border-subtle, #cbd5e1);',
    '}',
    '.' + p + '-menu [tngMenuItem] {',
    '  display: flex;',
    '  justify-content: space-between;',
    '  min-height: 2rem;',
    '  padding: 0.4rem 0.62rem;',
    '  border: 0;',
    '  border-radius: 0.58rem;',
    '  background: transparent;',
    '  color: var(--tng-semantic-foreground-primary, #0f172a);',
    '  font: inherit;',
    '  font-size: 0.86rem;',
    '  font-weight: 550;',
    '  text-align: left;',
    '  cursor: pointer;',
    '}',
    '.' + p + '-menu [tngMenuItem]:hover {',
    '  background: color-mix(in srgb, var(--tng-semantic-foreground-primary, #0f172a) 8%, transparent);',
    '}',
    '.' + p + '-menu [tngMenuItem]:focus-visible {',
    '  outline: 2px solid var(--tng-semantic-focus-ring, #93c5fd);',
    '  outline-offset: 2px;',
    '}',
    '.' + p + '-menu [tngMenuItem][data-active],',
    '.' + p + "-menu [tngMenuItem][aria-expanded='true'] {",
    '  color: var(--tng-semantic-accent-brand, #2563eb);',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 22%, transparent);',
    '}',
    '',
  ];

  if (withSubmenu) {
    lines.push(
      '.' + p + '-menu--submenu { left: calc(100% + 0.42rem); }',
      '.' + p + '-menu--level-1 { top: 2.7rem; }',
      '.' + p + '-menu--level-2 { top: 5.5rem; }',
      '',
    );
  }

  return lines.join('\n');
}

@Component({
  selector: 'app-headless-menu-examples-page',
  imports: [
    RouterLink,
    TngMenu,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    TngMenuTrigger,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './menu-examples-page.component.html',
  styleUrls: ['./menu-examples-page.component.css'],
})
export class HeadlessMenuExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly dropdownPlainCommand = signal('No action yet');
  protected readonly dropdownTailwindCommand = signal('No action yet');
  protected readonly nestedPlainCommand = signal('No command yet');
  protected readonly nestedTailwindCommand = signal('No command yet');

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly dropdownPlainCodeTabs = createCodeTabs(
    'headless-menu-example-drop-plain',
    [
      "import { Component, signal } from '@angular/core';",
      'import {',
      '  TngMenu,',
      '  TngMenuGroupLabel,',
      '  TngMenuItem,',
      '  TngMenuSelectEvent,',
      '  TngMenuTrigger,',
      "} from '@tailng-ui/primitives';",
      '',
      '@Component({',
      '  standalone: true,',
      '  imports: [TngMenu, TngMenuGroupLabel, TngMenuItem, TngMenuTrigger],',
      "  templateUrl: './headless-menu-example-drop-plain.component.html',",
      "  styleUrl: './headless-menu-example-drop-plain.component.css',",
      '})',
      'export class HeadlessMenuExampleDropPlainComponent {',
      "  protected readonly dropdownPlainLastAction = signal('No action yet');",
      '',
      '  protected onDropdownPlainActionSelect(event: TngMenuSelectEvent): void {',
      '    this.dropdownPlainLastAction.set(String(event.value));',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="headless-menu-example-drop-plain-stage">',
      '  <div class="headless-menu-example-drop-plain-shell">',
      '    <button type="button" [tngMenuTrigger]="dropdownPlainActionsMenu">Open actions</button>',
      '    <div',
      '      tngMenu',
      '      #dropdownPlainActionsMenu="tngMenu"',
      '      aria-label="Quick actions"',
      '      class="headless-menu-example-drop-plain-menu"',
      '      (tngMenuSelect)="onDropdownPlainActionSelect($event)"',
      '    >',
      '      <div tngMenuGroupLabel class="headless-menu-example-drop-plain-group">Recent</div>',
      '      <button type="button" tngMenuItem tngMenuItemValue="copy">Copy</button>',
      '      <button type="button" tngMenuItem tngMenuItemValue="paste">Paste</button>',
      '    </div>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    createMenuExamplePlainStarter('headless-menu-example-drop-plain', false),
  );

  protected readonly dropdownTailwindCodeTabs = createCodeTabs(
    'headless-menu-example-drop-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngMenu, TngMenuGroupLabel, TngMenuItem, TngMenuSelectEvent, TngMenuTrigger } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      '  standalone: true,',
      '  imports: [TngMenu, TngMenuGroupLabel, TngMenuItem, TngMenuTrigger],',
      "  templateUrl: './headless-menu-example-drop-tailwind.component.html',",
      '})',
      'export class HeadlessMenuExampleDropTailwindComponent {',
      "  protected readonly dropdownTailwindLastAction = signal('No action yet');",
      '',
      '  protected onDropdownTailwindActionSelect(event: TngMenuSelectEvent): void {',
      '    this.dropdownTailwindLastAction.set(String(event.value));',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="relative grid justify-items-start content-start">',
      '  <div class="relative inline-block">',
      '    <button',
      '      type="button"',
      '      [tngMenuTrigger]="dropdownTailwindActionsMenu"',
      '      class="min-h-[2.05rem] rounded-[0.62rem] border border-[color:var(--tng-semantic-border-strong,#94a3b8)] bg-[color:color-mix(in_srgb,var(--tng-semantic-background-surface,#f8fafc)_90%,transparent)] px-[0.9rem] py-[0.46rem] text-[0.95rem] font-semibold text-[color:var(--tng-semantic-foreground-primary,#0f172a)] shadow-[0_1px_2px_color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] transition hover:border-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_45%,var(--tng-semantic-border-strong,#94a3b8))] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_14%,var(--tng-semantic-background-surface,#f8fafc))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] aria-expanded:border-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_55%,var(--tng-semantic-border-strong,#94a3b8))] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,var(--tng-semantic-background-surface,#f8fafc))] aria-expanded:text-[color:var(--tng-semantic-accent-brand,#2563eb)] aria-expanded:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_35%,transparent),0_1px_2px_color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)]"',
      '    >',
      '      Open actions',
      '    </button>',
      '    <div',
      '      tngMenu',
      '      #dropdownTailwindActionsMenu="tngMenu"',
      '      aria-label="Quick actions"',
      '      class="absolute left-0 top-[calc(100%+0.45rem)] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-[color:var(--tng-semantic-border-strong,#94a3b8)] bg-[color:var(--tng-semantic-background-canvas,#ffffff)] p-[0.45rem] shadow-[0_16px_30px_-22px_color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_35%,transparent)] data-[state=open]:grid data-[state=open]:gap-[0.24rem]"',
      '      (tngMenuSelect)="onDropdownTailwindActionSelect($event)"',
      '    >',
      '      <div tngMenuGroupLabel class="px-[0.45rem] py-[0.25rem] text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[color:var(--tng-semantic-foreground-secondary,#64748b)]">Recent</div>',
      '      <button type="button" tngMenuItem tngMenuItemValue="copy" class="flex min-h-[2rem] cursor-pointer justify-between rounded-[0.58rem] border-0 bg-transparent px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-[550] text-[color:var(--tng-semantic-foreground-primary,#0f172a)] outline-none transition-[background-color,color] duration-[120ms] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] data-[active]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] data-[active]:text-[color:var(--tng-semantic-accent-brand,#2563eb)]">Copy</button>',
      '      <button type="button" tngMenuItem tngMenuItemValue="paste" class="flex min-h-[2rem] cursor-pointer justify-between rounded-[0.58rem] border-0 bg-transparent px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-[550] text-[color:var(--tng-semantic-foreground-primary,#0f172a)] outline-none transition-[background-color,color] duration-[120ms] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] data-[active]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] data-[active]:text-[color:var(--tng-semantic-accent-brand,#2563eb)]">Paste</button>',
      '    </div>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    '/* No custom CSS required. Tailwind utilities own the trigger, panel, and item styling. */\n',
  );

  protected readonly nestedPlainCodeTabs = createCodeTabs(
    'headless-menu-example-nested-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngMenu, TngMenuItem, TngMenuSelectEvent, TngMenuSeparator, TngMenuTrigger } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      '  standalone: true,',
      '  imports: [TngMenu, TngMenuItem, TngMenuSeparator, TngMenuTrigger],',
      "  templateUrl: './headless-menu-example-nested-plain.component.html',",
      "  styleUrl: './headless-menu-example-nested-plain.component.css',",
      '})',
      'export class HeadlessMenuExampleNestedPlainComponent {',
      "  protected readonly nestedPlainLastCommand = signal('No command yet');",
      '',
      '  protected onNestedPlainCommandSelect(event: TngMenuSelectEvent): void {',
      '    this.nestedPlainLastCommand.set(String(event.value));',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="headless-menu-example-nested-plain-stage">',
      '  <div class="headless-menu-example-nested-plain-shell">',
      '    <button type="button" [tngMenuTrigger]="nestedPlainFileMenu">File</button>',
      '    <div',
      '      tngMenu',
      '      #nestedPlainFileMenu="tngMenu"',
      '      aria-label="File menu"',
      '      class="headless-menu-example-nested-plain-menu"',
      '      (tngMenuSelect)="onNestedPlainCommandSelect($event)"',
      '    >',
      '      <button type="button" tngMenuItem tngMenuItemValue="new-notebook">New notebook</button>',
      '      <button type="button" tngMenuItem [tngMenuItemSubmenu]="nestedPlainImportMenu" tngMenuItemValue="import">Import…</button>',
      '      <div tngMenuSeparator class="headless-menu-example-nested-plain-separator"></div>',
      '      <button type="button" tngMenuItem tngMenuItemValue="close">Close</button>',
      '',
      '      <div',
      '        tngMenu',
      '        #nestedPlainImportMenu="tngMenu"',
      '        aria-label="Import sources"',
      '        class="headless-menu-example-nested-plain-menu headless-menu-example-nested-plain-menu--submenu headless-menu-example-nested-plain-menu--level-1"',
      '        (tngMenuSelect)="onNestedPlainCommandSelect($event)"',
      '      >',
      '        <button type="button" tngMenuItem tngMenuItemValue="csv">CSV file</button>',
      '        <button type="button" tngMenuItem [tngMenuItemSubmenu]="nestedPlainGitMenu" tngMenuItemValue="git">Git repository</button>',
      '      </div>',
      '',
      '      <div',
      '        tngMenu',
      '        #nestedPlainGitMenu="tngMenu"',
      '        aria-label="Git hosts"',
      '        class="headless-menu-example-nested-plain-menu headless-menu-example-nested-plain-menu--submenu headless-menu-example-nested-plain-menu--level-2"',
      '        (tngMenuSelect)="onNestedPlainCommandSelect($event)"',
      '      >',
      '        <button type="button" tngMenuItem tngMenuItemValue="github">GitHub</button>',
      '        <button type="button" tngMenuItem tngMenuItemValue="gitlab">GitLab</button>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    createMenuExamplePlainStarter('headless-menu-example-nested-plain', true),
  );

  protected readonly nestedTailwindCodeTabs = createCodeTabs(
    'headless-menu-example-nested-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngMenu, TngMenuItem, TngMenuSelectEvent, TngMenuSeparator, TngMenuTrigger } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      '  standalone: true,',
      '  imports: [TngMenu, TngMenuItem, TngMenuSeparator, TngMenuTrigger],',
      "  templateUrl: './headless-menu-example-nested-tailwind.component.html',",
      '})',
      'export class HeadlessMenuExampleNestedTailwindComponent {',
      "  protected readonly nestedTailwindLastCommand = signal('No command yet');",
      '',
      '  protected onNestedTailwindCommandSelect(event: TngMenuSelectEvent): void {',
      '    this.nestedTailwindLastCommand.set(String(event.value));',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<div class="relative grid justify-items-start content-start">',
      '  <div class="relative inline-block">',
      '    <button',
      '      type="button"',
      '      [tngMenuTrigger]="nestedTailwindFileMenu"',
      '      class="min-h-[2.05rem] rounded-[0.62rem] border border-[color:var(--tng-semantic-border-strong,#94a3b8)] bg-[color:color-mix(in_srgb,var(--tng-semantic-background-surface,#f8fafc)_90%,transparent)] px-[0.9rem] py-[0.46rem] text-[0.95rem] font-semibold text-[color:var(--tng-semantic-foreground-primary,#0f172a)] shadow-[0_1px_2px_color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] transition hover:border-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_45%,var(--tng-semantic-border-strong,#94a3b8))] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_14%,var(--tng-semantic-background-surface,#f8fafc))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] aria-expanded:border-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_55%,var(--tng-semantic-border-strong,#94a3b8))] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,var(--tng-semantic-background-surface,#f8fafc))] aria-expanded:text-[color:var(--tng-semantic-accent-brand,#2563eb)] aria-expanded:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_35%,transparent),0_1px_2px_color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)]"',
      '    >',
      '      File',
      '    </button>',
      '    <div',
      '      tngMenu',
      '      #nestedTailwindFileMenu="tngMenu"',
      '      aria-label="File menu"',
      '      class="absolute left-0 top-[calc(100%+0.45rem)] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-[color:var(--tng-semantic-border-strong,#94a3b8)] bg-[color:var(--tng-semantic-background-canvas,#ffffff)] p-[0.45rem] shadow-[0_16px_30px_-22px_color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_35%,transparent)] data-[state=open]:grid data-[state=open]:gap-[0.24rem]"',
      '      (tngMenuSelect)="onNestedTailwindCommandSelect($event)"',
      '    >',
      '      <button type="button" tngMenuItem tngMenuItemValue="new-notebook" class="flex min-h-[2rem] cursor-pointer justify-between rounded-[0.58rem] border-0 bg-transparent px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-[550] text-[color:var(--tng-semantic-foreground-primary,#0f172a)] outline-none transition-[background-color,color] duration-[120ms] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] data-[active]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] data-[active]:text-[color:var(--tng-semantic-accent-brand,#2563eb)] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] aria-expanded:text-[color:var(--tng-semantic-accent-brand,#2563eb)]">New notebook</button>',
      '      <button type="button" tngMenuItem [tngMenuItemSubmenu]="nestedTailwindImportMenu" tngMenuItemValue="import" class="flex min-h-[2rem] cursor-pointer justify-between rounded-[0.58rem] border-0 bg-transparent px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-[550] text-[color:var(--tng-semantic-foreground-primary,#0f172a)] outline-none transition-[background-color,color] duration-[120ms] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] data-[active]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] data-[active]:text-[color:var(--tng-semantic-accent-brand,#2563eb)] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] aria-expanded:text-[color:var(--tng-semantic-accent-brand,#2563eb)]">Import…</button>',
      '      <div tngMenuSeparator class="mx-[0.35rem] my-[0.2rem] h-px bg-[color:var(--tng-semantic-border-subtle,#cbd5e1)]"></div>',
      '      <button type="button" tngMenuItem tngMenuItemValue="close" class="flex min-h-[2rem] cursor-pointer justify-between rounded-[0.58rem] border-0 bg-transparent px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-[550] text-[color:var(--tng-semantic-foreground-primary,#0f172a)] outline-none transition-[background-color,color] duration-[120ms] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] data-[active]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] data-[active]:text-[color:var(--tng-semantic-accent-brand,#2563eb)] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] aria-expanded:text-[color:var(--tng-semantic-accent-brand,#2563eb)]">Close</button>',
      '',
      '      <div',
      '        tngMenu',
      '        #nestedTailwindImportMenu="tngMenu"',
      '        aria-label="Import sources"',
      '        class="absolute left-[calc(100%+0.42rem)] top-[2.7rem] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-[color:var(--tng-semantic-border-strong,#94a3b8)] bg-[color:var(--tng-semantic-background-canvas,#ffffff)] p-[0.45rem] shadow-[0_16px_30px_-22px_color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_35%,transparent)] data-[state=open]:grid data-[state=open]:gap-[0.24rem]"',
      '        (tngMenuSelect)="onNestedTailwindCommandSelect($event)"',
      '      >',
      '        <button type="button" tngMenuItem tngMenuItemValue="csv" class="flex min-h-[2rem] cursor-pointer justify-between rounded-[0.58rem] border-0 bg-transparent px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-[550] text-[color:var(--tng-semantic-foreground-primary,#0f172a)] outline-none transition-[background-color,color] duration-[120ms] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] data-[active]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] data-[active]:text-[color:var(--tng-semantic-accent-brand,#2563eb)] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] aria-expanded:text-[color:var(--tng-semantic-accent-brand,#2563eb)]">CSV file</button>',
      '        <button type="button" tngMenuItem [tngMenuItemSubmenu]="nestedTailwindGitMenu" tngMenuItemValue="git" class="flex min-h-[2rem] cursor-pointer justify-between rounded-[0.58rem] border-0 bg-transparent px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-[550] text-[color:var(--tng-semantic-foreground-primary,#0f172a)] outline-none transition-[background-color,color] duration-[120ms] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] data-[active]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] data-[active]:text-[color:var(--tng-semantic-accent-brand,#2563eb)] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] aria-expanded:text-[color:var(--tng-semantic-accent-brand,#2563eb)]">Git repository</button>',
      '      </div>',
      '',
      '      <div',
      '        tngMenu',
      '        #nestedTailwindGitMenu="tngMenu"',
      '        aria-label="Git hosts"',
      '        class="absolute left-[calc(100%+0.42rem)] top-[5.5rem] z-30 hidden min-w-[13.8rem] rounded-[0.82rem] border border-[color:var(--tng-semantic-border-strong,#94a3b8)] bg-[color:var(--tng-semantic-background-canvas,#ffffff)] p-[0.45rem] shadow-[0_16px_30px_-22px_color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_35%,transparent)] data-[state=open]:grid data-[state=open]:gap-[0.24rem]"',
      '        (tngMenuSelect)="onNestedTailwindCommandSelect($event)"',
      '      >',
      '        <button type="button" tngMenuItem tngMenuItemValue="github" class="flex min-h-[2rem] cursor-pointer justify-between rounded-[0.58rem] border-0 bg-transparent px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-[550] text-[color:var(--tng-semantic-foreground-primary,#0f172a)] outline-none transition-[background-color,color] duration-[120ms] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] data-[active]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] data-[active]:text-[color:var(--tng-semantic-accent-brand,#2563eb)] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] aria-expanded:text-[color:var(--tng-semantic-accent-brand,#2563eb)]">GitHub</button>',
      '        <button type="button" tngMenuItem tngMenuItemValue="gitlab" class="flex min-h-[2rem] cursor-pointer justify-between rounded-[0.58rem] border-0 bg-transparent px-[0.62rem] py-[0.4rem] text-left text-[0.86rem] font-[550] text-[color:var(--tng-semantic-foreground-primary,#0f172a)] outline-none transition-[background-color,color] duration-[120ms] hover:bg-[color:color-mix(in_srgb,var(--tng-semantic-foreground-primary,#0f172a)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--tng-semantic-focus-ring,#93c5fd)] data-[active]:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] data-[active]:text-[color:var(--tng-semantic-accent-brand,#2563eb)] aria-expanded:bg-[color:color-mix(in_srgb,var(--tng-semantic-accent-brand,#2563eb)_22%,transparent)] aria-expanded:text-[color:var(--tng-semantic-accent-brand,#2563eb)]">GitLab</button>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    '/* No custom CSS required. Tailwind utilities own the trigger, panel, and item styling. */\n',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onDropdownPlainSelect(event: TngMenuSelectEvent): void {
    this.dropdownPlainCommand.set(String(event.value));
  }

  protected onDropdownTailwindSelect(event: TngMenuSelectEvent): void {
    this.dropdownTailwindCommand.set(String(event.value));
  }

  protected onNestedPlainSelect(event: TngMenuSelectEvent): void {
    this.nestedPlainCommand.set(String(event.value));
  }

  protected onNestedTailwindSelect(event: TngMenuSelectEvent): void {
    this.nestedTailwindCommand.set(String(event.value));
  }
}
