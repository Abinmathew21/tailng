import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
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
  selector: 'app-headless-context-menu-examples-page',
  imports: [
    TngContextMenu,
    TngContextMenuTrigger,
    TngMenu,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './context-menu-examples-page.component.html',
  styleUrls: ['./context-menu-examples-page.component.css'],
})
export class HeadlessContextMenuExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainAction = signal('No action yet');
  protected readonly tailwindAction = signal('No action yet');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-context-menu-examples-plain.component.ts',
      code: [
        "readonly lastAction = signal('No action yet');",
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
      title: 'headless-context-menu-examples-plain.component.html',
      code: [
        '<div class="context-menu-shell context-menu-shell--anchored context-menu-shell--headless">',
        '  <div tabindex="0" [tngContextMenuTrigger]="menu">Right-click file row</div>',
        '  <div',
        '    tngMenu',
        '    tngContextMenu',
        '    #menu="tngContextMenu"',
        '    aria-label="File actions"',
        '    (tngMenuSelect)="onSelect($event)"',
        '  >',
        '    <div tngMenuGroupLabel>File actions</div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Copy path">Copy path</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Open terminal">Open terminal</button>',
        '    <div tngMenuSeparator></div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Archive file">Archive</button>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-context-menu-examples-plain.component.css',
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
      title: 'headless-context-menu-examples-tailwind.component.ts',
      code: [
        "readonly lastAction = signal('No action yet');",
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
      title: 'headless-context-menu-examples-tailwind.component.html',
      code: [
        '<div class="relative grid gap-[0.65rem] [&_[data-slot=context-menu-trigger]]:cursor-context-menu [&_[data-slot=menu]]:absolute [&_[data-slot=menu]]:left-0 [&_[data-slot=menu]]:top-[calc(100%+0.42rem)] [&_[data-slot=menu]]:z-20 [&_[data-slot=menu]]:hidden [&_[data-slot=menu]]:min-w-[14rem] [&_[data-slot=menu]]:rounded-[0.8rem] [&_[data-slot=menu]]:border [&_[data-slot=menu]]:border-slate-300 [&_[data-slot=menu]]:bg-white [&_[data-slot=menu]]:p-[0.45rem] [&_[data-slot=menu]]:shadow-[0_14px_34px_-22px_rgba(15,23,42,0.4)] [&_[data-slot=menu][data-state=open]]:grid [&_[data-slot=menu-item]]:w-full [&_[data-slot=menu-item]]:rounded-[0.62rem] [&_[data-slot=menu-item]]:border-0 [&_[data-slot=menu-item]]:bg-transparent [&_[data-slot=menu-item]]:px-[0.66rem] [&_[data-slot=menu-item]]:py-[0.42rem] [&_[data-slot=menu-item]]:text-left [&_[data-slot=menu-item]]:text-[0.9rem] [&_[data-slot=menu-item]]:text-slate-700 [&_[data-slot=menu-item][data-active]]:bg-sky-100 [&_[data-slot=menu-item][data-active]]:text-sky-900">',
        '  <div class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700" tabindex="0" [tngContextMenuTrigger]="menu">',
        '    Right-click node card',
        '  </div>',
        '  <div tngMenu tngContextMenu #menu="tngContextMenu" aria-label="Node actions" (tngMenuSelect)="onSelect($event)">',
        '    <button type="button" tngMenuItem tngMenuItemValue="Inspect node">Inspect</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Copy id">Copy ID</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Delete node">Delete node</button>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-context-menu-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainSelect(event: TngMenuSelectEvent): void {
    this.plainAction.set(String(event.value));
  }

  protected onTailwindSelect(event: TngMenuSelectEvent): void {
    this.tailwindAction.set(String(event.value));
  }
}
