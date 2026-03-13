import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
import {
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
  TngMenuTrigger,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-menu-examples-page',
  imports: [
    TngMenu,
    TngMenuComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    TngMenuTrigger,
    TngMenuTriggerFor,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './menu-examples-page.component.html',
  styleUrls: ['./menu-examples-page.component.css'],
})
export class MenuExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly headlessCommand = signal('No command yet');
  protected readonly plainCommand = signal('No command yet');
  protected readonly tailwindCommand = signal('No command yet');
  protected readonly cascadeHeadlessCommand = signal('No command yet');
  protected readonly cascadePlainCommand = signal('No command yet');
  protected readonly cascadeTailwindCommand = signal('No command yet');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-examples-headless.component.ts',
      code: [
        "readonly lastCommand = signal('No command yet');",
        '',
        'onSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-examples-headless.component.html',
      code: [
        '<button type="button" [tngMenuTrigger]="menu">Actions</button>',
        '<div tngMenu #menu="tngMenu">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Duplicate">Duplicate</button>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menu-examples-headless.component.css',
      code: '.menu-example-stage { min-height: 12rem; position: relative; }',
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-examples-plain-css.component.ts',
      code: [
        "readonly lastCommand = signal('No command yet');",
        '',
        'onSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-examples-plain-css.component.html',
      code: [
        '<button type="button" [tngMenuTriggerFor]="menu">Options</button>',
        '<tng-menu #menu="tngMenu" ariaLabel="Options menu">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Pin">Pin</button>',
        '</tng-menu>',
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
        "readonly lastCommand = signal('No command yet');",
        '',
        'onSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-examples-tailwind.component.html',
      code: [
        '<button class="rounded-lg border px-3 py-2" [tngMenuTriggerFor]="menu">Actions</button>',
        '<tng-menu #menu="tngMenu" ariaLabel="Tailwind actions menu">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Export">Export</button>',
        '</tng-menu>',
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

  protected readonly cascadeHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-examples-cascade-headless.component.ts',
      code: [
        "readonly lastCommand = signal('No command yet');",
        '',
        'onCascadeSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-examples-cascade-headless.component.html',
      code: [
        '<button type="button" [tngMenuTrigger]="rootMenu">Import</button>',
        '<div tngMenu #rootMenu="tngMenu">',
        '  <button type="button" tngMenuItem [tngMenuItemSubmenu]="gitMenu">Git repository</button>',
        '  <div tngMenu #gitMenu="tngMenu">',
        '    <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub">GitHub</button>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menu-examples-cascade-headless.component.css',
      code: '.menu-example-panel--submenu { left: calc(100% + 0.45rem); }',
    },
  ]);

  protected readonly cascadePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-examples-cascade-plain-css.component.ts',
      code: [
        "readonly lastCommand = signal('No command yet');",
        '',
        'onCascadeSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-examples-cascade-plain-css.component.html',
      code: [
        '<button type="button" [tngMenuTriggerFor]="rootMenu">Import</button>',
        '<tng-menu #rootMenu="tngMenu">',
        '  <button type="button" tngMenuItem [tngMenuItemSubmenu]="gitMenu">Git repository</button>',
        '  <tng-menu #gitMenu="tngMenu">',
        '    <button type="button" tngMenuItem tngMenuItemValue="Import from GitLab">GitLab</button>',
        '  </tng-menu>',
        '</tng-menu>',
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
        "readonly lastCommand = signal('No command yet');",
        '',
        'onCascadeSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menu-examples-cascade-tailwind.component.html',
      code: [
        '<button class="rounded-lg border px-3 py-2" [tngMenuTriggerFor]="rootMenu">Import</button>',
        '<tng-menu #rootMenu="tngMenu">',
        '  <button type="button" tngMenuItem [tngMenuItemSubmenu]="gitMenu">Git repository</button>',
        '  <tng-menu #gitMenu="tngMenu">',
        '    <button type="button" tngMenuItem tngMenuItemValue="Import from GitHub">GitHub</button>',
        '  </tng-menu>',
        '</tng-menu>',
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

  protected onHeadlessSelect(event: TngMenuSelectEvent): void {
    this.headlessCommand.set(String(event.value));
  }

  protected onPlainSelect(event: TngMenuSelectEvent): void {
    this.plainCommand.set(String(event.value));
  }

  protected onTailwindSelect(event: TngMenuSelectEvent): void {
    this.tailwindCommand.set(String(event.value));
  }

  protected onCascadeHeadlessSelect(event: TngMenuSelectEvent): void {
    this.cascadeHeadlessCommand.set(String(event.value));
  }

  protected onCascadePlainSelect(event: TngMenuSelectEvent): void {
    this.cascadePlainCommand.set(String(event.value));
  }

  protected onCascadeTailwindSelect(event: TngMenuSelectEvent): void {
    this.cascadeTailwindCommand.set(String(event.value));
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
