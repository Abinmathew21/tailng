import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngContextMenuComponent } from '@tailng-ui/components';
import {
  TngContextMenuTrigger,
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
    TngContextMenuComponent,
    TngContextMenuTrigger,
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
    '<div class="context-menu-shell context-menu-shell--anchored">',
    '  <div tabindex="0" [tngContextMenuTrigger]="assetMenu">Right-click target</div>',
    '  <div tngMenu tngContextMenu #assetMenu="tngContextMenu">',
    '    <button type="button" tngMenuItem tngMenuItemValue="Rename">Rename</button>',
    '    <button type="button" tngMenuItem tngMenuItemValue="Archive">Archive</button>',
    '  </div>',
    '</div>',
    '<!-- Use assetMenu.getAnchorType() / getPointerAnchor() if you want cursor-relative placement. -->',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<div class="context-menu-shell context-menu-shell--anchored">',
    '  <div tabindex="0" [tngContextMenuTrigger]="assetMenu">Right-click target</div>',
    '  <tng-context-menu #assetMenu="tngContextMenu" ariaLabel="Asset actions">',
    '    <button type="button" tngMenuItem tngMenuItemValue="Rename">Rename</button>',
    '    <button type="button" tngMenuItem tngMenuItemValue="Archive">Archive</button>',
    '  </tng-context-menu>',
    '</div>',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'context-menu-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngContextMenuComponent } from '@tailng-ui/components';",
        "import {",
        "  TngContextMenuTrigger,",
        "  TngMenuGroupLabel,",
        "  TngMenuItem,",
        "  TngMenuSeparator,",
        "  type TngMenuSelectEvent,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-context-menu-overview-plain-css',",
        '  standalone: true,',
        '  imports: [',
        '    TngContextMenuComponent,',
        '    TngContextMenuTrigger,',
        '    TngMenuGroupLabel,',
        '    TngMenuItem,',
        '    TngMenuSeparator,',
        '  ],',
        "  templateUrl: './context-menu-overview-plain-css.component.html',",
        "  styleUrl: './context-menu-overview-plain-css.component.css',",
        '})',
        'export class ContextMenuOverviewPlainCssComponent {',
        "  readonly lastAction = signal('No command yet');",
        '',
        'onSelect(event: TngMenuSelectEvent): void {',
        '  this.lastAction.set(String(event.value));',
        '}',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'context-menu-overview-plain-css.component.html',
      code: [
        '<div class="context-menu-shell context-menu-shell--anchored">',
        '  <div tabindex="0" [tngContextMenuTrigger]="menu">Right-click release row</div>',
        '  <tng-context-menu',
        '    #menu="tngContextMenu"',
        '    ariaLabel="Release actions"',
        '    (tngMenuSelect)="onSelect($event)"',
        '  >',
        '    <div tngMenuGroupLabel>Release</div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Promote">Promote</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Rollback">Rollback</button>',
        '    <div tngMenuSeparator></div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Delete release">Delete</button>',
        '  </tng-context-menu>',
        '</div>',
        '<p>last command: {{ lastAction() }}</p>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'context-menu-overview-plain-css.component.css',
      code: [
        '.context-menu-shell {',
        '  position: relative;',
        '}',
        '',
        '.context-menu-shell [data-slot="menu"] {',
        '  position: absolute;',
        '  left: 0;',
        '  top: calc(100% + 0.42rem);',
        '}',
        '',
        '.context-menu-shell [data-slot="menu-item"] {',
        '  min-height: 2rem;',
        '  padding: 0.42rem 0.66rem;',
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
        "import { Component, signal } from '@angular/core';",
        "import { TngContextMenuComponent } from '@tailng-ui/components';",
        "import { TngContextMenuTrigger, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-context-menu-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngContextMenuComponent, TngContextMenuTrigger, TngMenuItem],',
        "  templateUrl: './context-menu-overview-tailwind.component.html',",
        "  styleUrl: './context-menu-overview-tailwind.component.css',",
        '})',
        'export class ContextMenuOverviewTailwindComponent {',
        "  readonly lastAction = signal('No command yet');",
        '',
        'onSelect(event: TngMenuSelectEvent): void {',
        '  this.lastAction.set(String(event.value));',
        '}',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'context-menu-overview-tailwind.component.html',
      code: [
        '<div class="relative grid gap-3 [&_[data-slot=menu]]:absolute [&_[data-slot=menu]]:left-0 [&_[data-slot=menu]]:top-[calc(100%+0.42rem)] [&_[data-slot=menu]]:shadow-lg [&_[data-slot=menu-item]]:w-full [&_[data-slot=menu-item]]:rounded-lg [&_[data-slot=menu-item]]:px-3 [&_[data-slot=menu-item]]:py-2 [&_[data-slot=menu-item][data-active]]:bg-sky-100">',
        '  <div class="rounded-xl border px-4 py-3" tabindex="0" [tngContextMenuTrigger]="menu">',
        '    Right-click target',
        '  </div>',
        '  <tng-context-menu',
        '    #menu="tngContextMenu"',
        '    ariaLabel="Asset actions"',
        '    (tngMenuSelect)="onSelect($event)"',
        '  >',
        '    <button type="button" tngMenuItem tngMenuItemValue="Open">Open</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Copy link">Copy link</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Share asset">Share</button>',
        '  </tng-context-menu>',
        '</div>',
        '<p>last command: {{ lastAction() }}</p>',
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

  protected onPlainSelect(event: TngMenuSelectEvent): void {
    this.plainCommand.set(String(event.value));
  }

  protected onTailwindSelect(event: TngMenuSelectEvent): void {
    this.tailwindCommand.set(String(event.value));
  }

}
