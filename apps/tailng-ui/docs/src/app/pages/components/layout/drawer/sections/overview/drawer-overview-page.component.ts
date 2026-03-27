import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngDrawerComponent } from '@tailng-ui/components';
import {
  TngDrawer as TngDrawerPrimitive,
  TngDrawerContainer as TngDrawerContainerPrimitive,
  TngDrawerContent as TngDrawerContentPrimitive,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-drawer-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngDrawerPrimitive,
    TngDrawerContainerPrimitive,
    TngDrawerContentPrimitive,
    TngDrawerComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './drawer-overview-page.component.html',
  styleUrl: './drawer-overview-page.component.css',
})
export class DrawerOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);
  public readonly headlessOpen = signal(false);
  public readonly plainCssOpen = signal(false);
  public readonly tailwindOpen = signal(false);

  protected readonly primitiveImportCode = [
    "import { TngDrawerContainer, TngDrawer, TngDrawerContent } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode =
    "import { TngDrawerComponent } from '@tailng-ui/components';";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'drawer-overview-headless.component.ts',
      code: [
        'readonly headlessOpen = signal(false);',
        '',
        'onToggleHeadless(): void {',
        '  this.headlessOpen.update(v => !v);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'drawer-overview-headless.component.html',
      code: [
        '<section tngDrawerContainer class="drawer-shell">',
        '  <aside tngDrawer class="drawer-panel" [opened]="headlessOpen()" (openedChange)="headlessOpen.set($event)">',
        '    <nav>',
        '      <p>Navigation links</p>',
        '      <button type="button" (click)="headlessOpen.set(false)">Close</button>',
        '    </nav>',
        '  </aside>',
        '  <main tngDrawerContent class="drawer-content">',
        '    <button type="button" (click)="onToggleHeadless()">Toggle drawer</button>',
        '    <p>Main content area</p>',
        '  </main>',
        '</section>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'drawer-overview-plain.component.ts',
      code: [
        'readonly plainCssOpen = signal(false);',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'drawer-overview-plain.component.html',
      code: [
        '<section tngDrawerContainer>',
        '  <tng-drawer [opened]="plainCssOpen()" (openedChange)="plainCssOpen.set($event)">',
        '    <nav>Navigation</nav>',
        '  </tng-drawer>',
        '  <main tngDrawerContent>Main content</main>',
        '</section>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'drawer-overview-tailwind.component.ts',
      code: [
        'readonly tailwindOpen = signal(false);',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'drawer-overview-tailwind.component.html',
      code: [
        '<section tngDrawerContainer>',
        '  <tng-drawer [opened]="tailwindOpen()" (openedChange)="tailwindOpen.set($event)">',
        '    <nav class="p-4 space-y-2">Navigation</nav>',
        '  </tng-drawer>',
        '  <main tngDrawerContent class="p-4">Main content</main>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'drawer-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  public onToggleHeadless(): void {
    this.headlessOpen.update((v) => !v);
  }

  public onTogglePlainCss(): void {
    this.plainCssOpen.update((v) => !v);
  }

  public onToggleTailwind(): void {
    this.tailwindOpen.update((v) => !v);
  }

}
