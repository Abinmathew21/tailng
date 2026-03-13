import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';
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
  selector: 'app-menu-overview-page',
  imports: [
    TngCodeBlockComponent,
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
  templateUrl: './menu-overview-page.component.html',
  styleUrls: ['./menu-overview-page.component.css'],
})
export class MenuOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly headlessCommand = signal('No command yet');
  protected readonly plainCommand = signal('No command yet');
  protected readonly tailwindCommand = signal('No command yet');

  protected readonly primitiveImportCode = [
    "import { TngMenu, TngMenuItem, TngMenuTrigger } from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngMenuComponent, TngMenuTriggerFor } from '@tailng-ui/components';",
    "import { TngMenuItem } from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<button type="button" [tngMenuTrigger]="actionsMenu">Actions</button>',
    '<div tngMenu #actionsMenu="tngMenu" (tngMenuSelect)="onSelect($event)">',
    '  <button type="button" tngMenuItem tngMenuItemValue="Duplicate">Duplicate</button>',
    '  <button type="button" tngMenuItem tngMenuItemValue="Archive">Archive</button>',
    '</div>',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<button type="button" [tngMenuTriggerFor]="actionsMenu">Actions</button>',
    '<tng-menu #actionsMenu="tngMenu" ariaLabel="Actions menu">',
    '  <button type="button" tngMenuItem tngMenuItemValue="Duplicate">Duplicate</button>',
    '</tng-menu>',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-overview-headless.component.ts',
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
      title: 'menu-overview-headless.component.html',
      code: [
        '<button type="button" [tngMenuTrigger]="headlessMenu">Actions</button>',
        '<div tngMenu #headlessMenu="tngMenu" (tngMenuSelect)="onSelect($event)">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Duplicate">Duplicate</button>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menu-overview-headless.component.css',
      code: '.menu-stage { min-height: 12rem; position: relative; }',
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menu-overview-plain-css.component.ts',
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
      title: 'menu-overview-plain-css.component.html',
      code: [
        '<button type="button" [tngMenuTriggerFor]="plainMenu">Options</button>',
        '<tng-menu #plainMenu="tngMenu" ariaLabel="Options menu">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Pin">Pin item</button>',
        '</tng-menu>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menu-overview-plain-css.component.css',
      code: [
        '.menu-trigger {',
        '  border-radius: 0.65rem;',
        '  padding: 0.45rem 0.85rem;',
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
      title: 'menu-overview-tailwind.component.html',
      code: [
        '<button class="rounded-lg border px-3 py-2" [tngMenuTriggerFor]="tailwindMenu">Open menu</button>',
        '<tng-menu #tailwindMenu="tngMenu" ariaLabel="Tailwind menu">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Export">Export</button>',
        '</tng-menu>',
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

  protected onHeadlessSelect(event: TngMenuSelectEvent): void {
    this.headlessCommand.set(String(event.value));
  }

  protected onPlainSelect(event: TngMenuSelectEvent): void {
    this.plainCommand.set(String(event.value));
  }

  protected onTailwindSelect(event: TngMenuSelectEvent): void {
    this.tailwindCommand.set(String(event.value));
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
