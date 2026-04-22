import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-button-overview-page',
  imports: [
    TngButtonComponent,
    TngCodeBlockComponent,
    TngIcon,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './button-overview-page.component.html',
  styleUrl: './button-overview-page.component.css',
})
export class ButtonOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainCount = signal(0);
  protected readonly tailwindCount = signal(0);

  protected readonly componentImportCode = [
    "import { TngButtonComponent } from '@tailng-ui/components';",
    "import { TngIcon } from '@tailng-ui/icons';",
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-button',
    '  tone="primary"',
    '  appearance="solid"',
    '  type="button"',
    '  (click)="submit()"',
    '>',
    '  Save changes',
    '</tng-button>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-button-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngButtonComponent],',
        "  templateUrl: './button-overview-plain-css.component.html',",
        "  styleUrl: './button-overview-plain-css.component.css',",
        '})',
        'export class ButtonOverviewPlainCssComponent {',
        '  protected readonly count = signal(0);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-overview-plain-css.component.html',
      code: [
        '<div class="button-overview-stack button-overview-stack--plain">',
        '  <tng-button tone="primary" appearance="solid" type="button" (click)="count.update((value) => value + 1)">',
        '    Save',
        '  </tng-button>',
        '  <tng-button tone="neutral" appearance="outline" type="button" [disabled]="true">',
        '    Disabled',
        '  </tng-button>',
        '  <p class="button-overview-status">clicked: {{ count() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-overview-plain-css.component.css',
      code: [
        '.button-overview-stack--plain {',
        '  display: grid;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        '',
        '@Component({',
        "  selector: 'app-button-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngIcon],',
        "  templateUrl: './button-overview-tailwind.component.html',",
        "  styleUrl: './button-overview-tailwind.component.css',",
        '})',
        'export class ButtonOverviewTailwindComponent {',
        '  protected readonly count = signal(0);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-overview-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="flex flex-wrap gap-3">',
        '    <tng-button tone="success" appearance="solid" type="button" (click)="count.update((value) => value + 1)">',
        '      <tng-icon icon="check" class="h-4 w-4"></tng-icon>',
        '      Publish',
        '    </tng-button>',
        '    <tng-button tone="neutral" appearance="ghost" type="button">',
        '      Secondary',
        '    </tng-button>',
        '  </div>',
        '  <p class="mt-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">clicked: {{ count() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected increment(scope: 'plain' | 'tailwind'): void {
    if (scope === 'plain') {
      this.plainCount.update((value) => value + 1);
      return;
    }

    this.tailwindCount.update((value) => value + 1);
  }
}
