import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngTooltipComponent } from '@tailng-ui/components';
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
  selector: 'app-tooltip-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngTooltipComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tooltip-overview-page.component.html',
  styleUrl: './tooltip-overview-page.component.css',
})
export class TooltipOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainOpen = signal(false);
  protected readonly tailwindOpen = signal(false);

  protected readonly componentImportCode = [
    "import { TngTooltipComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-tooltip',
    '  triggerLabel="Hover for hint"',
    '  text="Use this to filter countries quickly."',
    '  side="top"',
    '  [openDelay]="120"',
    '  [closeDelay]="80"',
    '></tng-tooltip>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tooltip-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngTooltipComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-tooltip-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngTooltipComponent],',
        "  templateUrl: './tooltip-overview-plain-css.component.html',",
        "  styleUrl: './tooltip-overview-plain-css.component.css',",
        '})',
        'export class TooltipOverviewPlainCssComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tooltip-overview-plain-css.component.html',
      code: [
        '<div class="tooltip-shell tooltip-stage">',
        '  <tng-tooltip',
        '    triggerLabel="Plain CSS hint"',
        '    text="Wrapper tooltip with semantic token styling."',
        '    side="bottom"',
        '    [openDelay]="120"',
        '    [closeDelay]="80"',
        '    (openChange)="open.set($event)"',
        '  ></tng-tooltip>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tooltip-overview-plain-css.component.css',
      code: [
        '.tooltip-shell {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.95rem;',
        '  padding: 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tooltip-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngTooltipComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-tooltip-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngTooltipComponent],',
        "  templateUrl: './tooltip-overview-tailwind.component.html',",
        "  styleUrl: './tooltip-overview-tailwind.component.css',",
        '})',
        'export class TooltipOverviewTailwindComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tooltip-overview-tailwind.component.html',
      code: [
        '<div',
        '  class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4"',
        '>',
        '  <div class="grid min-h-32 content-start justify-items-start gap-3">',
        '    <tng-tooltip',
        '      triggerLabel="Tailwind hint"',
        '      side="right"',
        '      [openDelay]="100"',
        '      [closeDelay]="80"',
        '      (openChange)="open.set($event)"',
        '    >',
        '      <span class="block max-w-56 text-sm leading-6 text-[var(--tng-semantic-foreground-primary)]">',
        '        Tokenized wrapper with utility-first content.',
        '      </span>',
        '    </tng-tooltip>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'tooltip-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
