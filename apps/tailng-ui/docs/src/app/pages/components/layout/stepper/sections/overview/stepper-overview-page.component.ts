import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngStepperComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-stepper-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngStepperComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './stepper-overview-page.component.html',
  styleUrl: './stepper-overview-page.component.css',
})
export class StepperOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly componentImportCode = [
    "import { TngStepperComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'stepper-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngStepperComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-stepper-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngStepperComponent],',
        "  templateUrl: './stepper-overview-plain-css.component.html',",
        "  styleUrl: './stepper-overview-plain-css.component.css',",
        '})',
        'export class StepperOverviewPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-overview-plain-css.component.html',
      code: [
        '<div class="stepper-preview-shell stepper-preview-shell--plain">',
        '  <tng-stepper ariaLabel="Release pipeline">',
        '    <ol class="stepper-preview-list">',
        '      <li class="stepper-preview-item is-complete"><span class="stepper-preview-dot">✓</span> Draft</li>',
        '      <li aria-current="step" class="stepper-preview-item is-current"><span class="stepper-preview-dot">2</span> Review</li>',
        '      <li class="stepper-preview-item"><span class="stepper-preview-dot">3</span> Publish</li>',
        '    </ol>',
        '  </tng-stepper>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-overview-plain-css.component.css',
      code: [
        '.stepper-preview-shell--plain {',
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
      title: 'stepper-overview-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngStepperComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-stepper-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngStepperComponent],',
        "  templateUrl: './stepper-overview-tailwind.component.html',",
        "  styleUrl: './stepper-overview-tailwind.component.css',",
        '})',
        'export class StepperOverviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'stepper-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-stepper ariaLabel="Release pipeline">',
        '    <ol class="stepper-preview-list">',
        '      <li class="stepper-preview-item is-complete"><span class="stepper-preview-dot">✓</span> Draft</li>',
        '      <li aria-current="step" class="stepper-preview-item is-current"><span class="stepper-preview-dot">2</span> Review</li>',
        '      <li class="stepper-preview-item"><span class="stepper-preview-dot">3</span> Publish</li>',
        '    </ol>',
        '  </tng-stepper>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'stepper-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
