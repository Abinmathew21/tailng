import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngContextMenu,
  TngContextMenuTrigger,
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
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

@Component({
  selector: 'app-headless-context-menu-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngContextMenu,
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
export class HeadlessContextMenuOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainCommand = signal('No command yet');
  protected readonly tailwindCommand = signal('No command yet');

  protected readonly importCode = [
    'import {',
    '  TngContextMenu,',
    '  TngContextMenuTrigger,',
    '  TngMenu,',
    '  TngMenuGroupLabel,',
    '  TngMenuItem,',
    '  TngMenuSeparator,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly usageCode = [
    '<div class="context-shell">',
    '  <div tabindex="0" [tngContextMenuTrigger]="assetMenu">Right-click target</div>',
    '  <div tngMenu tngContextMenu #assetMenu="tngContextMenu" aria-label="Asset actions">',
    '    <button type="button" tngMenuItem tngMenuItemValue="rename">Rename</button>',
    '    <button type="button" tngMenuItem tngMenuItemValue="archive">Archive</button>',
    '  </div>',
    '</div>',
    '<!-- Read assetMenu.getAnchorType() / getPointerAnchor() when you want cursor placement. -->',
    '',
  ].join('\n');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-context-menu-overview-plain.component.ts',
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
      title: 'headless-context-menu-overview-plain.component.html',
      code: [
        '<div class="context-menu-shell context-menu-shell--anchored context-menu-shell--headless">',
        '  <div tabindex="0" [tngContextMenuTrigger]="menu">Right-click release row</div>',
        '  <div',
        '    tngMenu',
        '    tngContextMenu',
        '    #menu="tngContextMenu"',
        '    aria-label="Release actions"',
        '    (tngMenuSelect)="onSelect($event)"',
        '  >',
        '    <div tngMenuGroupLabel>Release</div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="promote">Promote</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="rollback">Rollback</button>',
        '    <div tngMenuSeparator></div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="delete">Delete</button>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-context-menu-overview-plain.component.css',
      code: [
        '.context-menu-shell {',
        '  position: relative;',
        '  display: grid;',
        '  gap: 0.65rem;',
        '}',
        '',
        '.context-menu-shell [data-slot="menu"] {',
        '  position: absolute;',
        '  left: 0;',
        '  top: calc(100% + 0.42rem);',
        '}',
        '',
        '.context-menu-shell--headless [data-slot="menu"] {',
        '  min-width: 14rem;',
        '  padding: 0.45rem;',
        '  border-radius: 0.75rem;',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  background: var(--tng-semantic-background-canvas);',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-context-menu-overview-tailwind.component.ts',
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
      title: 'headless-context-menu-overview-tailwind.component.html',
      code: [
        '<div class="relative grid gap-[0.65rem] [&_[data-slot=context-menu-trigger]]:cursor-context-menu [&_[data-slot=menu]]:absolute [&_[data-slot=menu]]:left-0 [&_[data-slot=menu]]:top-[calc(100%+0.42rem)] [&_[data-slot=menu]]:z-20 [&_[data-slot=menu]]:hidden [&_[data-slot=menu]]:min-w-[14rem] [&_[data-slot=menu]]:rounded-[0.8rem] [&_[data-slot=menu]]:border [&_[data-slot=menu]]:border-slate-300 [&_[data-slot=menu]]:bg-white [&_[data-slot=menu]]:p-[0.45rem] [&_[data-slot=menu]]:shadow-[0_14px_34px_-22px_rgba(15,23,42,0.4)] [&_[data-slot=menu][data-state=open]]:grid [&_[data-slot=menu-item]]:w-full [&_[data-slot=menu-item]]:rounded-[0.62rem] [&_[data-slot=menu-item]]:border-0 [&_[data-slot=menu-item]]:bg-transparent [&_[data-slot=menu-item]]:px-[0.66rem] [&_[data-slot=menu-item]]:py-[0.42rem] [&_[data-slot=menu-item]]:text-left [&_[data-slot=menu-item]]:text-[0.9rem] [&_[data-slot=menu-item]]:text-slate-700 [&_[data-slot=menu-item][data-active]]:bg-sky-100 [&_[data-slot=menu-item][data-active]]:text-sky-900">',
        '  <div class="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700" tabindex="0" [tngContextMenuTrigger]="menu">',
        '    Right-click asset row',
        '  </div>',
        '  <div tngMenu tngContextMenu #menu="tngContextMenu" aria-label="Asset actions" (tngMenuSelect)="onSelect($event)">',
        '    <button type="button" tngMenuItem tngMenuItemValue="open">Open</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="copy-link">Copy link</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="archive">Archive</button>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-context-menu-overview-tailwind.component.css',
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
