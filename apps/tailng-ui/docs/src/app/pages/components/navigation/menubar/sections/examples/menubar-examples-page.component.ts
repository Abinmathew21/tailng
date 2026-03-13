import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngMenuComponent, TngMenubarComponent } from '@tailng-ui/components';
import {
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
  TngMenubar,
  TngMenubarItem,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-menubar-examples-page',
  imports: [
    TngMenu,
    TngMenuComponent,
    TngMenuGroupLabel,
    TngMenuItem,
    TngMenuSeparator,
    TngMenubar,
    TngMenubarComponent,
    TngMenubarItem,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './menubar-examples-page.component.html',
  styleUrls: ['./menubar-examples-page.component.css'],
})
export class MenubarExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly headlessCommand = signal('No command yet');
  protected readonly plainCommand = signal('No command yet');
  protected readonly tailwindCommand = signal('No command yet');
  protected readonly cascadeCommand = signal('No command yet');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-examples-headless.component.ts',
      code: [
        "readonly lastCommand = signal('No command yet');",
        '',
        'onMenuSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-examples-headless.component.html',
      code: [
        '<div tngMenubar aria-label="Workspace commands">',
        '  <div class="menubar-item-shell">',
        '    <div tngMenu #fileMenu="tngMenu" (tngMenuSelect)="onMenuSelect($event)">',
        '      <button type="button" tngMenuItem tngMenuItemValue="Create document">New</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Open document">Open</button>',
        '    </div>',
        '    <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-examples-headless.component.css',
      code: '.menubar-item-shell { position: relative; }',
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-examples-plain-css.component.ts',
      code: [
        "readonly lastCommand = signal('No command yet');",
        '',
        'onMenuSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-examples-plain-css.component.html',
      code: [
        '<tng-menubar ariaLabel="Workspace commands">',
        '  <div class="menubar-item-shell">',
        '    <tng-menu #fileMenu="tngMenu" ariaLabel="File menu" (tngMenuSelect)="onMenuSelect($event)">',
        '      <button type="button" tngMenuItem tngMenuItemValue="Create document">New</button>',
        '      <button type="button" tngMenuItem tngMenuItemValue="Open document">Open</button>',
        '    </tng-menu>',
        '    <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
        '  </div>',
        '</tng-menubar>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-examples-plain-css.component.css',
      code: [
        '.menubar-shell {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.85rem;',
        '  display: inline-flex;',
        '  gap: 0.35rem;',
        '  padding: 0.35rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'menubar-examples-tailwind.component.ts',
      code: [
        "readonly lastCommand = signal('No command yet');",
        '',
        'onMenuSelect(event: TngMenuSelectEvent): void {',
        '  this.lastCommand.set(String(event.value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'menubar-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-menubar ariaLabel="Workspace commands">',
        '    <div class="menubar-item-shell">',
        '      <tng-menu #fileMenu="tngMenu" ariaLabel="File menu">',
        '        <button type="button" tngMenuItem tngMenuItemValue="Create document">New</button>',
        '      </tng-menu>',
        '      <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
        '    </div>',
        '  </tng-menubar>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'menubar-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onHeadlessCommandSelect(event: TngMenuSelectEvent): void {
    this.headlessCommand.set(String(event.value));
  }

  protected onPlainCommandSelect(event: TngMenuSelectEvent): void {
    this.plainCommand.set(String(event.value));
  }

  protected onTailwindCommandSelect(event: TngMenuSelectEvent): void {
    this.tailwindCommand.set(String(event.value));
  }

  protected onCascadeCommandSelect(event: TngMenuSelectEvent): void {
    this.cascadeCommand.set(String(event.value));
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
