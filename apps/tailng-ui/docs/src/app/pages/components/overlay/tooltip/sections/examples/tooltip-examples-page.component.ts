import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTooltipComponent } from '@tailng-ui/components';
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
  selector: 'app-tooltip-examples-page',
  imports: [TngTooltipComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './tooltip-examples-page.component.html',
  styleUrl: './tooltip-examples-page.component.css',
})
export class TooltipExamplesPageComponent implements OnDestroy {
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

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'tooltip-examples-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngTooltipComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-tooltip-examples-plain-css',",
        '  standalone: true,',
        '  imports: [TngTooltipComponent],',
        "  templateUrl: './tooltip-examples-plain-css.component.html',",
        "  styleUrl: './tooltip-examples-plain-css.component.css',",
        '})',
        'export class TooltipExamplesPlainCssComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tooltip-examples-plain-css.component.html',
      code: [
        '<div class="tooltip-example-shell tooltip-example-stage">',
        '  <tng-tooltip',
        '    triggerLabel="Archive release notes"',
        '    text="Moves notes to readonly archive."',
        '    side="bottom"',
        '    [openDelay]="100"',
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
      title: 'tooltip-examples-plain-css.component.css',
      code: [
        '.tooltip-example-shell {',
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
      title: 'tooltip-examples-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngTooltipComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-tooltip-examples-tailwind',",
        '  standalone: true,',
        '  imports: [TngTooltipComponent],',
        "  templateUrl: './tooltip-examples-tailwind.component.html',",
        "  styleUrl: './tooltip-examples-tailwind.component.css',",
        '})',
        'export class TooltipExamplesTailwindComponent {',
        '  protected readonly open = signal(false);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'tooltip-examples-tailwind.component.html',
      code: [
        '<div',
        '  class="rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4"',
        '>',
        '  <div class="grid min-h-[8.5rem] content-start justify-items-start gap-3">',
        '    <tng-tooltip',
        '      triggerLabel="Approve deployment"',
        '      side="top"',
        '      [openDelay]="150"',
        '      [closeDelay]="100"',
        '      (openChange)="open.set($event)"',
        '    >',
        '      <span class="block max-w-56 text-sm leading-6 text-[var(--tng-semantic-foreground-primary)]">',
        '        Rollout starts in us-east, then eu-west.',
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
      title: 'tooltip-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
