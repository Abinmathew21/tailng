import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngContextMenuComponent } from '@tailng-ui/components';
import {
  TngContextMenuTrigger,
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
  selector: 'app-context-menu-examples-page',
  imports: [
    TngContextMenuComponent,
    TngContextMenuTrigger,
    TngMenuGroupLabel,
    TngMenuItem,
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

  protected readonly plainAction = signal('No action yet');
  protected readonly tailwindAction = signal('No action yet');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'context-menu-examples-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngContextMenuComponent } from '@tailng-ui/components';",
        "import {",
        "  TngContextMenuTrigger,",
        "  TngMenuGroupLabel,",
        "  TngMenuItem,",
        "  type TngMenuSelectEvent,",
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-context-menu-examples-plain-css',",
        '  standalone: true,',
        '  imports: [',
        '    TngContextMenuComponent,',
        '    TngContextMenuTrigger,',
        '    TngMenuGroupLabel,',
        '    TngMenuItem,',
        '  ],',
        "  templateUrl: './context-menu-examples-plain-css.component.html',",
        "  styleUrl: './context-menu-examples-plain-css.component.css',",
        '})',
        'export class ContextMenuExamplesPlainCssComponent {',
        "  readonly lastAction = signal('No action yet');",
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
      title: 'context-menu-examples-plain-css.component.html',
      code: [
        '<div class="context-menu-shell context-menu-shell--anchored">',
        '  <div tabindex="0" [tngContextMenuTrigger]="menu">Right-click deployment row</div>',
        '  <tng-context-menu',
        '    #menu="tngContextMenu"',
        '    ariaLabel="Deployment actions"',
        '    (tngMenuSelect)="onSelect($event)"',
        '  >',
        '    <div tngMenuGroupLabel>Deployment</div>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Retry deployment">Retry</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Rollback deployment">Rollback</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="View logs">View logs</button>',
        '  </tng-context-menu>',
        '</div>',
        '<p>last action: {{ lastAction() }}</p>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'context-menu-examples-plain-css.component.css',
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
        '/* Wrapper host already brings the panel surface; add slot styling for item spacing only. */',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'context-menu-examples-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngContextMenuComponent } from '@tailng-ui/components';",
        "import { TngContextMenuTrigger, TngMenuItem, type TngMenuSelectEvent } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-context-menu-examples-tailwind',",
        '  standalone: true,',
        '  imports: [TngContextMenuComponent, TngContextMenuTrigger, TngMenuItem],',
        "  templateUrl: './context-menu-examples-tailwind.component.html',",
        "  styleUrl: './context-menu-examples-tailwind.component.css',",
        '})',
        'export class ContextMenuExamplesTailwindComponent {',
        "  readonly lastAction = signal('No action yet');",
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
      title: 'context-menu-examples-tailwind.component.html',
      code: [
        '<div class="relative grid gap-3 [&_[data-slot=menu]]:absolute [&_[data-slot=menu]]:left-0 [&_[data-slot=menu]]:top-[calc(100%+0.42rem)] [&_[data-slot=menu]]:shadow-lg [&_[data-slot=menu-item]]:w-full [&_[data-slot=menu-item]]:rounded-lg [&_[data-slot=menu-item]]:px-3 [&_[data-slot=menu-item]]:py-2 [&_[data-slot=menu-item][data-active]]:bg-sky-100">',
        '  <div class="rounded-xl border px-4 py-3" tabindex="0" [tngContextMenuTrigger]="menu">',
        '    Right-click node card',
        '  </div>',
        '  <tng-context-menu',
        '    #menu="tngContextMenu"',
        '    ariaLabel="Node actions"',
        '    (tngMenuSelect)="onSelect($event)"',
        '  >',
        '    <button type="button" tngMenuItem tngMenuItemValue="Inspect node">Inspect</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Copy node id">Copy ID</button>',
        '    <button type="button" tngMenuItem tngMenuItemValue="Delete node">Delete node</button>',
        '  </tng-context-menu>',
        '</div>',
        '<p>last action: {{ lastAction() }}</p>',
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

  protected onPlainSelect(event: TngMenuSelectEvent): void {
    this.plainAction.set(String(event.value));
  }

  protected onTailwindSelect(event: TngMenuSelectEvent): void {
    this.tailwindAction.set(String(event.value));
  }

}
