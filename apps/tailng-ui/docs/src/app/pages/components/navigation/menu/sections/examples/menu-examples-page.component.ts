import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
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
  selector: 'app-menu-examples-page',
  imports: [
    TngMenuComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuTriggerFor,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './menu-examples-page.component.html',
  styleUrls: ['./menu-examples-page.component.css'],
})
export class MenuExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly plainCommand = signal('No command yet');
  protected readonly tailwindCommand = signal('No command yet');
  protected readonly cascadePlainCommand = signal('No command yet');
  protected readonly cascadeTailwindCommand = signal('No command yet');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-examples-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';",
        "import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-menu-examples-plain-css-example',",
        '  standalone: true,',
        '  imports: [TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],',
        "  templateUrl: './menu-examples-plain-css.component.html',",
        "  styleUrl: './menu-examples-plain-css.component.css',",
        '})',
        'export class MenuExamplesPlainCssExampleComponent {',
        "  protected readonly menuExamplesPlainLastCommand = signal('No command yet');",
        '',
        '  protected onMenuExamplesPlainSelect(event: TngMenuSelectEvent): void {',
        '    this.menuExamplesPlainLastCommand.set(String(event.value));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-examples-plain-css.component.html',
      code: [
        '<div class="menu-example-trigger-shell">',
        '  <button type="button" [tngMenuTriggerFor]="menuExamplesPlainMenu" class="menu-example-trigger">',
        '    Options',
        '  </button>',
        '  <tng-menu',
        '    #menuExamplesPlainMenu="tngMenu"',
        '    ariaLabel="Options menu"',
        '    class="menu-example-panel"',
        '    (tngMenuSelect)="onMenuExamplesPlainSelect($event)"',
        '  >',
        '    <div tngMenuGroupLabel class="menu-example-group-label">Options</div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Pin item">Pin</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Mute notifications">Mute</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Remove item">Remove</button>',
        '  </tng-menu>',
        '</div>',
        '<p class="menu-example-state">last command: {{ menuExamplesPlainLastCommand() }}</p>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menu-examples-plain-css.component.css',
      code: [
        '.menu-example-trigger {',
        '  border-radius: 0.7rem;',
        '  padding: 0.45rem 0.9rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-examples-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';",
        "import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-menu-examples-tailwind-example',",
        '  standalone: true,',
        '  imports: [TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],',
        "  templateUrl: './menu-examples-tailwind.component.html',",
        '})',
        'export class MenuExamplesTailwindExampleComponent {',
        "  protected readonly menuExamplesTailwindLastCommand = signal('No command yet');",
        '',
        '  protected onMenuExamplesTailwindSelect(event: TngMenuSelectEvent): void {',
        '    this.menuExamplesTailwindLastCommand.set(String(event.value));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <button',
        '    type="button"',
        '    [tngMenuTriggerFor]="menuExamplesTailwindMenu"',
        '    class="min-h-[2.15rem] rounded-[0.72rem] border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_86%,transparent)] px-[0.9rem] py-[0.45rem] text-[0.92rem] font-semibold text-[var(--tng-semantic-foreground-primary)] transition hover:border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_38%,var(--tng-semantic-border-subtle))] hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_10%,transparent)] focus-visible:outline-none aria-expanded:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_15%,transparent)] aria-expanded:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_74%,var(--tng-semantic-foreground-primary))]"',
        '  >',
        '    Open menu',
        '  </button>',
        '  <tng-menu',
        '    #menuExamplesTailwindMenu="tngMenu"',
        '    ariaLabel="Tailwind actions menu"',
        '    class="hidden min-w-[14.2rem] gap-[0.22rem] rounded-[0.82rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-canvas)] p-[0.48rem] shadow-[0_16px_30px_-22px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_35%,transparent)] data-[state=open]:grid"',
        '    (tngMenuSelect)="onMenuExamplesTailwindSelect($event)"',
        '  >',
        '    <div tngMenuGroupLabel class="px-[0.45rem] py-[0.2rem] text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--tng-semantic-foreground-secondary)]">Actions</div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Export report" class="min-h-[2rem] rounded-[0.6rem] bg-transparent px-[0.68rem] py-[0.42rem] text-left text-[0.88rem] font-[550] text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)] focus-visible:outline-none [&[data-active]]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))]">Export report</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Share link" class="min-h-[2rem] rounded-[0.6rem] bg-transparent px-[0.68rem] py-[0.42rem] text-left text-[0.88rem] font-[550] text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)] focus-visible:outline-none [&[data-active]]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))]">Share link</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Copy path" class="min-h-[2rem] rounded-[0.6rem] bg-transparent px-[0.68rem] py-[0.42rem] text-left text-[0.88rem] font-[550] text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)] focus-visible:outline-none [&[data-active]]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))]">Copy path</button>',
        '  </tng-menu>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menu-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);


  protected readonly cascadePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-examples-cascade-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';",
        "import { TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-menu-examples-cascade-plain-css-example',",
        '  standalone: true,',
        '  imports: [TngMenuComponent, TngMenuTriggerFor, TngMenuItem],',
        "  templateUrl: './menu-examples-cascade-plain-css.component.html',",
        "  styleUrl: './menu-examples-cascade-plain-css.component.css',",
        '})',
        'export class MenuExamplesCascadePlainCssExampleComponent {',
        "  protected readonly menuExamplesCascadePlainLastCommand = signal('No command yet');",
        '',
        '  protected onMenuExamplesCascadePlainSelect(event: TngMenuSelectEvent): void {',
        '    this.menuExamplesCascadePlainLastCommand.set(String(event.value));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-examples-cascade-plain-css.component.html',
      code: [
        '<div class="menu-example-trigger-shell">',
        '  <button',
        '    type="button"',
        '    [tngMenuTriggerFor]="menuExamplesCascadePlainRootMenu"',
        '    class="menu-example-trigger"',
        '  >',
        '    Import',
        '  </button>',
        '  <tng-menu',
        '    #menuExamplesCascadePlainRootMenu="tngMenu"',
        '    ariaLabel="Import root menu"',
        '    class="menu-example-panel"',
        '    (tngMenuSelect)="onMenuExamplesCascadePlainSelect($event)"',
        '  >',
        '    <button type="button" tngMenuItem tngMenuItemValue="Import from CSV">CSV file</button>',
        '    <button',
        '      type="button"',
        '      tngMenuItem',
        '      [tngMenuItemSubmenu]="menuExamplesCascadePlainGitMenu"',
        '      tngMenuItemValue="Import from git"',
        '    >',
        '      Git repository',
        '    </button>',
        '',
        '    <tng-menu',
        '      #menuExamplesCascadePlainGitMenu="tngMenu"',
        '      ariaLabel="Git submenu"',
        '      class="menu-example-panel menu-example-panel--submenu menu-example-panel--level-1"',
        '      (tngMenuSelect)="onMenuExamplesCascadePlainSelect($event)"',
        '    >',
        '      <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub">GitHub</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab">GitLab</button>',
        '    </tng-menu>',
        '  </tng-menu>',
        '</div>',
        '<p class="menu-example-state">last cascaded command: {{ menuExamplesCascadePlainLastCommand() }}</p>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menu-examples-cascade-plain-css.component.css',
      code: [
        '.menu-example-trigger {',
        '  border-radius: 0.72rem;',
        '  padding: 0.45rem 0.9rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly cascadeTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-examples-cascade-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';",
        "import { TngMenuGroupLabel, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-menu-examples-cascade-tailwind-example',",
        '  standalone: true,',
        '  imports: [TngMenuComponent, TngMenuTriggerFor, TngMenuGroupLabel, TngMenuItem],',
        "  templateUrl: './menu-examples-cascade-tailwind.component.html',",
        '})',
        'export class MenuExamplesCascadeTailwindExampleComponent {',
        "  protected readonly menuExamplesCascadeTailwindLastCommand = signal('No command yet');",
        '',
        '  protected onMenuExamplesCascadeTailwindSelect(event: TngMenuSelectEvent): void {',
        '    this.menuExamplesCascadeTailwindLastCommand.set(String(event.value));',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-examples-cascade-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <button',
        '    type="button"',
        '    [tngMenuTriggerFor]="menuExamplesCascadeTailwindRootMenu"',
        '    class="min-h-[2.15rem] rounded-[0.72rem] border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_86%,transparent)] px-[0.9rem] py-[0.45rem] text-[0.92rem] font-semibold text-[var(--tng-semantic-foreground-primary)] transition hover:border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_38%,var(--tng-semantic-border-subtle))] hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_10%,transparent)] focus-visible:outline-none aria-expanded:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_15%,transparent)] aria-expanded:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_74%,var(--tng-semantic-foreground-primary))]"',
        '  >',
        '    Import',
        '  </button>',
        '  <tng-menu',
        '    #menuExamplesCascadeTailwindRootMenu="tngMenu"',
        '    ariaLabel="Import root menu"',
        '    class="hidden min-w-[14.2rem] gap-[0.22rem] rounded-[0.82rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-canvas)] p-[0.48rem] shadow-[0_16px_30px_-22px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_35%,transparent)] data-[state=open]:grid"',
        '    (tngMenuSelect)="onMenuExamplesCascadeTailwindSelect($event)"',
        '  >',
        '    <div tngMenuGroupLabel class="px-[0.45rem] py-[0.2rem] text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--tng-semantic-foreground-secondary)]">Import</div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Import from CSV" class="min-h-[2rem] rounded-[0.6rem] bg-transparent px-[0.68rem] py-[0.42rem] text-left text-[0.88rem] font-[550] text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)] focus-visible:outline-none data-[active]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] data-[active]:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))] aria-expanded:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] aria-expanded:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))]">CSV file</button>',
        '    <button type="button" tngMenuItem [tngMenuItemSubmenu]="menuExamplesCascadeTailwindGitMenu" tngMenuItemValue="Import from git" class="min-h-[2rem] rounded-[0.6rem] bg-transparent px-[0.68rem] py-[0.42rem] text-left text-[0.88rem] font-[550] text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)] focus-visible:outline-none data-[active]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] data-[active]:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))] aria-expanded:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] aria-expanded:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))]">Git repository</button>',
        '    <tng-menu',
        '      #menuExamplesCascadeTailwindGitMenu="tngMenu"',
        '      ariaLabel="Git submenu"',
        '      class="hidden min-w-[14.2rem] gap-[0.22rem] rounded-[0.82rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-canvas)] p-[0.48rem] shadow-[0_16px_30px_-22px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_35%,transparent)] data-[state=open]:grid"',
        '      (tngMenuSelect)="onMenuExamplesCascadeTailwindSelect($event)"',
        '    >',
        '      <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub" class="min-h-[2rem] rounded-[0.6rem] bg-transparent px-[0.68rem] py-[0.42rem] text-left text-[0.88rem] font-[550] text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)] focus-visible:outline-none [&[data-active]]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))]">GitHub</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab" class="min-h-[2rem] rounded-[0.6rem] bg-transparent px-[0.68rem] py-[0.42rem] text-left text-[0.88rem] font-[550] text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_8%,transparent)] focus-visible:outline-none [&[data-active]]:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] [&[data-active]]:text-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_72%,var(--tng-semantic-foreground-primary))]">GitLab</button>',
        '    </tng-menu>',
        '  </tng-menu>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menu-examples-cascade-tailwind.component.css',
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

  protected onCascadePlainSelect(event: TngMenuSelectEvent): void {
    this.cascadePlainCommand.set(String(event.value));
  }

  protected onCascadeTailwindSelect(event: TngMenuSelectEvent): void {
    this.cascadeTailwindCommand.set(String(event.value));
  }

}
