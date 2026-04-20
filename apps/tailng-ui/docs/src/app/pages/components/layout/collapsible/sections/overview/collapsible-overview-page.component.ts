import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngCollapsibleComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-collapsible-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngCollapsibleComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './collapsible-overview-page.component.html',
  styleUrl: './collapsible-overview-page.component.css',
})
export class CollapsibleOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);
  public readonly plainCssOpen = signal(true);
  public readonly tailwindOpen = signal(false);

  protected readonly componentImportCode =
    "import { TngCollapsibleComponent } from '@tailng-ui/components';";

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCollapsibleComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-collapsible-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngCollapsibleComponent],',
        "  templateUrl: './collapsible-overview-plain-css.component.html',",
        "  styleUrl: './collapsible-overview-plain-css.component.css',",
        '})',
        'export class CollapsibleOverviewPlainCssComponent {',
        '  readonly open = signal(true);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-overview-plain-css.component.html',
      code: [
        '<div class="collapsible-preview-shell collapsible-preview-shell--plain">',
        '  <tng-collapsible',
        '    title="Release pipeline"',
        '    [open]="open()"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <ol class="collapsible-preview-list">',
        '      <li class="collapsible-preview-item is-complete"><span class="collapsible-preview-dot">✓</span> Draft</li>',
        '      <li class="collapsible-preview-item is-current"><span class="collapsible-preview-dot">2</span> Review</li>',
        '      <li class="collapsible-preview-item"><span class="collapsible-preview-dot">3</span> Publish</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-overview-plain-css.component.css',
      code: [
        '.collapsible-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'collapsible-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCollapsibleComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-collapsible-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngCollapsibleComponent],',
        "  templateUrl: './collapsible-overview-tailwind.component.html',",
        "  styleUrl: './collapsible-overview-tailwind.component.css',",
        '})',
        'export class CollapsibleOverviewTailwindComponent {',
        '  readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'collapsible-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-collapsible',
        '    title="Release pipeline"',
        '    [open]="open()"',
        '    (openChange)="open.set($event)"',
        '  >',
        '    <ol class="collapsible-preview-list">',
        '      <li class="collapsible-preview-item is-complete"><span class="collapsible-preview-dot">✓</span> Draft</li>',
        '      <li class="collapsible-preview-item is-current"><span class="collapsible-preview-dot">2</span> Review</li>',
        '      <li class="collapsible-preview-item"><span class="collapsible-preview-dot">3</span> Publish</li>',
        '    </ol>',
        '  </tng-collapsible>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'collapsible-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
