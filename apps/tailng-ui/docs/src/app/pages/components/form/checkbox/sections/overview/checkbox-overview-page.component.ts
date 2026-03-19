import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCheckboxComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import { TngCheckbox as TngCheckboxPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-checkbox-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngCheckboxComponent,
    TngCheckboxPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './checkbox-overview-page.component.html',
  styleUrl: './checkbox-overview-page.component.css',
})
export class CheckboxOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly primitiveImportCode = "import { TngCheckbox } from '@tailng-ui/primitives';";

  protected readonly componentImportCode =
    "import { TngCheckboxComponent } from '@tailng-ui/components';";

  protected readonly primitiveUsageCode = [
    '<label class="checkbox-row">',
    '  <input tngCheckbox [checked]="true" />',
    '  <span>Email notifications</span>',
    '</label>',
    '',
    '<label class="checkbox-row">',
    '  <input tngCheckbox [indeterminate]="true" />',
    '  <span>Weekly digest (mixed)</span>',
    '</label>',
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-checkbox [checked]="true">Enable release notes</tng-checkbox>',
    '<tng-checkbox [readonly]="true" [indeterminate]="true">Readonly mixed state</tng-checkbox>',
    '',
  ].join('\n');

  protected readonly headlessExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngCheckbox } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-checkbox-headless-example',",
    '  imports: [TngCheckbox],',
    "  templateUrl: './checkbox-headless-example.component.html',",
    "  styleUrl: './checkbox-headless-example.component.css',",
    '})',
    'export class CheckboxHeadlessExampleComponent {}',
    '',
  ].join('\n');

  protected readonly plainCssExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngCheckboxComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-checkbox-plain-css-example',",
    '  imports: [TngCheckboxComponent],',
    "  templateUrl: './checkbox-plain-css-example.component.html',",
    "  styleUrl: './checkbox-plain-css-example.component.css',",
    '})',
    'export class CheckboxPlainCssExampleComponent {}',
    '',
  ].join('\n');

  protected readonly tailwindExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngCheckboxComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-checkbox-tailwind-example',",
    '  imports: [TngCheckboxComponent],',
    "  templateUrl: './checkbox-tailwind-example.component.html',",
    '})',
    'export class CheckboxTailwindExampleComponent {}',
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'checkbox-headless-example.component.ts',
      code: this.headlessExampleTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'checkbox-headless-example.component.html',
      code: [
        '<div class="checkbox-stack">',
        '  <label class="checkbox-row">',
        '    <input tngCheckbox [checked]="true" />',
        '    <span>Email notifications</span>',
        '  </label>',
        '  <label class="checkbox-row">',
        '    <input tngCheckbox [indeterminate]="true" />',
        '    <span>Weekly digest (mixed)</span>',
        '  </label>',
        '  <label class="checkbox-row">',
        '    <input tngCheckbox [readonly]="true" [checked]="true" />',
        '    <span>Readonly legal acknowledgement</span>',
        '  </label>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'checkbox-headless-example.component.css',
      code: [
        '.checkbox-stack { display: grid; gap: 0.7rem; }',
        '.checkbox-row {',
        '  align-items: center;',
        '  color: var(--tng-semantic-foreground-primary);',
        '  display: inline-flex;',
        '  gap: 0.55rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'checkbox-plain-css-example.component.ts',
      code: this.plainCssExampleTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'checkbox-plain-css-example.component.html',
      code: [
        '<div class="plain-checkbox-card">',
        '  <tng-checkbox [checked]="true">Email notifications</tng-checkbox>',
        '  <tng-checkbox [indeterminate]="true">Weekly digest (mixed)</tng-checkbox>',
        '  <tng-checkbox [readonly]="true" [checked]="true">Readonly legal acknowledgement</tng-checkbox>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'checkbox-plain-css-example.component.css',
      code: [
        '.plain-checkbox-card {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  display: grid;',
        '  gap: 0.75rem;',
        '  padding: 0.9rem 1rem;',
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
      title: 'checkbox-tailwind-example.component.ts',
      code: this.tailwindExampleTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'checkbox-tailwind-example.component.html',
      code: [
        '<div class="grid gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">',
        '  <tng-checkbox [checked]="true" class="text-[var(--tng-semantic-foreground-primary)]">Email notifications</tng-checkbox>',
        '  <tng-checkbox [indeterminate]="true" class="text-[var(--tng-semantic-foreground-primary)]">Weekly digest (mixed)</tng-checkbox>',
        '  <tng-checkbox [readonly]="true" [checked]="true" class="text-[var(--tng-semantic-foreground-primary)]">Readonly legal acknowledgement</tng-checkbox>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'checkbox-tailwind-example.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
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
