import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngContextMenuComponent } from '@tailng-ui/components';
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
  selector: 'app-context-menu-examples-page',
  imports: [
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
  templateUrl: './context-menu-examples-page.component.html',
  styleUrls: ['./context-menu-examples-page.component.css'],
})
export class ContextMenuExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessAction = signal('No action yet');
  protected readonly plainAction = signal('No action yet');
  protected readonly tailwindAction = signal('No action yet');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'context-menu-examples-headless.component.ts',
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
      title: 'context-menu-examples-headless.component.html',
      code: [
        '<div tabindex="0" [tngContextMenuTrigger]="menu">Right-click file row</div>',
        '<div tngMenu tngContextMenu #menu="tngContextMenu">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Copy path">Copy path</button>',
        '  <button type="button" tngMenuItem tngMenuItemValue="Open terminal">Open terminal</button>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'context-menu-examples-headless.component.css',
      code: '.context-target { cursor: context-menu; min-height: 3rem; }',
    },
  ]);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'context-menu-examples-plain-css.component.ts',
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
      title: 'context-menu-examples-plain-css.component.html',
      code: [
        '<div tabindex="0" [tngContextMenuTrigger]="menu">Right-click deployment row</div>',
        '<tng-context-menu #menu="tngContextMenu" ariaLabel="Deployment actions">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Retry deployment">Retry</button>',
        '  <button type="button" tngMenuItem tngMenuItemValue="Rollback deployment">Rollback</button>',
        '</tng-context-menu>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'context-menu-examples-plain-css.component.css',
      code: '.context-panel { min-width: 15rem; }',
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'context-menu-examples-tailwind.component.ts',
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
      title: 'context-menu-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border px-4 py-3" tabindex="0" [tngContextMenuTrigger]="menu">',
        '  Right-click node card',
        '</div>',
        '<tng-context-menu #menu="tngContextMenu" class="absolute left-0 top-full mt-2 shadow-lg">',
        '  <button type="button" tngMenuItem tngMenuItemValue="Inspect node">Inspect</button>',
        '</tng-context-menu>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'context-menu-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onHeadlessSelect(event: TngMenuSelectEvent): void {
    this.headlessAction.set(String(event.value));
  }

  protected onPlainSelect(event: TngMenuSelectEvent): void {
    this.plainAction.set(String(event.value));
  }

  protected onTailwindSelect(event: TngMenuSelectEvent): void {
    this.tailwindAction.set(String(event.value));
  }

}
