import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngContextMenuComponent } from '@tailng-ui/components';
import {
  TngContextMenu,
  TngContextMenuTrigger,
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-context-menu-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngContextMenu,
    TngContextMenuComponent,
    TngContextMenuTrigger,
    TngMenu,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './context-menu-overview-page.component.html',
  styleUrls: ['./context-menu-overview-page.component.css'],
})
export class ContextMenuOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessCommand = signal('No command yet');
  protected readonly plainCommand = signal('No command yet');
  protected readonly tailwindCommand = signal('No command yet');

  protected readonly primitiveImportCode = [
    'import {',
    '  TngContextMenu,',
    '  TngContextMenuTrigger,',
    '  TngMenu,',
    '  TngMenuItem,',
    "} from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngContextMenuComponent } from '@tailng-ui/components';",
    "import { TngContextMenuTrigger, TngMenuItem } from '@tailng-ui/primitives';",
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<div tabindex="0" [tngContextMenuTrigger]="assetMenu">Right-click target</div>',
    '<div tngMenu tngContextMenu #assetMenu="tngContextMenu">',
    '  <button type="button" tngMenuItem tngMenuItemValue="Rename">Rename</button>',
    '  <button type="button" tngMenuItem tngMenuItemValue="Archive">Archive</button>',
    '</div>',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<div tabindex="0" [tngContextMenuTrigger]="assetMenu">Right-click target</div>',
    '<tng-context-menu #assetMenu="tngContextMenu" ariaLabel="Asset actions">',
    '  <button type="button" tngMenuItem tngMenuItemValue="Rename">Rename</button>',
    '  <button type="button" tngMenuItem tngMenuItemValue="Archive">Archive</button>',
    '</tng-context-menu>',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'context-menu-overview-headless.component.ts',
      code: [
        "readonly lastAction = signal('No command yet');",
        '',
        'onSelect(event: TngMenuSelectEvent): void {',
        '  this.lastAction.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'context-menu-overview-headless.component.html',
      code: [
        '<div tabindex="0" [tngContextMenuTrigger]="menu">Right-click row</div>',
        '<div tngMenu tngContextMenu #menu="tngContextMenu" (tngMenuSelect)="onSelect($event)">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Duplicate">Duplicate</button>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'context-menu-overview-headless.component.css',
      code: [
        '.context-target {',
        '  cursor: context-menu;',
        '  min-height: 3rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'context-menu-overview-plain-css.component.ts',
      code: [
        "readonly lastAction = signal('No command yet');",
        '',
        'onSelect(event: TngMenuSelectEvent): void {',
        '  this.lastAction.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'context-menu-overview-plain-css.component.html',
      code: [
        '<div tabindex="0" [tngContextMenuTrigger]="menu">Right-click release row</div>',
        '<tng-context-menu #menu="tngContextMenu" ariaLabel="Release actions">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Promote">Promote</button>',
        '  <button type="button" tngMenuItem tngMenuItemValue="Rollback">Rollback</button>',
        '</tng-context-menu>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'context-menu-overview-plain-css.component.css',
      code: [
        '.context-panel {',
        '  border-radius: 0.75rem;',
        '  min-width: 15rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'context-menu-overview-tailwind.component.ts',
      code: [
        "readonly lastAction = signal('No command yet');",
        '',
        'onSelect(event: TngMenuSelectEvent): void {',
        '  this.lastAction.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'context-menu-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border px-4 py-3" tabindex="0" [tngContextMenuTrigger]="menu">',
        '  Right-click target',
        '</div>',
        '<tng-context-menu #menu="tngContextMenu" class="absolute left-0 top-full mt-2 shadow-lg">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Open">Open</button>',
        '</tng-context-menu>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'context-menu-overview-tailwind.component.css',
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

}
