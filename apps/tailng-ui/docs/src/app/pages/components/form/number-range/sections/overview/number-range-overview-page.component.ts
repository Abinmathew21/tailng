import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngNumberRangeComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../number-range.util';

@Component({
  selector: 'app-number-range-overview-page',
  imports: [
    NgTemplateOutlet,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngNumberRangeComponent,
  ],
  templateUrl: './number-range-overview-page.component.html',
  styleUrl: './number-range-overview-page.component.css',
})
export class NumberRangeOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly installationCode = [
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly basicUsageCode = [
    '<tng-number-range',
    '  [min]="0"',
    '  [max]="100"',
    '  ariaLabel="Price range"',
    '  minPlaceholder="Min"',
    '  maxPlaceholder="Max"',
    '  (valueChange)="onRangeChange($event)"',
    '></tng-number-range>',
    '',
  ].join('\n');

  protected readonly controlledUsageCode = [
    "import { Component, signal } from '@angular/core';",
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    "import type { TngNumberRangeValue } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-price-range',",
    '  standalone: true,',
    '  imports: [TngNumberRangeComponent],',
    '  template: `',
    '    <tng-number-range',
    '      [min]="0"',
    '      [max]="1000"',
    '      [value]="range()"',
    '      (valueChange)="range.set($event)"',
    '      ariaLabel="Price range"',
    '    ></tng-number-range>',
    '  `,',
    '})',
    'export class PriceRangeComponent {',
    '  protected readonly range = signal<TngNumberRangeValue>({ min: 100, max: 500 });',
    '}',
    '',
  ].join('\n');

  protected readonly defaultValueCode = [
    '<tng-number-range',
    '  [defaultValue]="{ min: 10, max: 90 }"',
    '  ariaLabel="Quantity range"',
    '></tng-number-range>',
    '',
  ].join('\n');

  protected readonly separatorCode = [
    '<!-- Default "—" separator -->',
    '<tng-number-range ariaLabel="Price range"></tng-number-range>',
    '',
    '<!-- Custom separator text -->',
    '<tng-number-range separator="to" ariaLabel="Distance range"></tng-number-range>',
    '',
    '<!-- Custom separator symbol -->',
    '<tng-number-range separator="↔" ariaLabel="Temperature range"></tng-number-range>',
    '',
  ].join('\n');

  protected readonly validationCode = [
    '<!-- Explicit invalid state via input -->',
    '<tng-number-range',
    '  ariaLabel="Price range"',
    '  [invalid]="true"',
    '></tng-number-range>',
    '',
    '<!-- Auto-computed: invalid when min > max or bounds exceeded -->',
    '<tng-number-range',
    '  [min]="0"',
    '  [max]="100"',
    '  [value]="{ min: 80, max: 20 }"',
    '  ariaLabel="Price range"',
    '></tng-number-range>',
    '',
  ].join('\n');

  protected readonly legacyFormsUsageCode = [
    "import { Component } from '@angular/core';",
    "import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';",
    "import { TngNumberRangeAngularFormsAdapter, TngNumberRangeComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-range-form',",
    '  standalone: true,',
    '  imports: [ReactiveFormsModule, TngNumberRangeComponent, TngNumberRangeAngularFormsAdapter],',
    '  template: `',
    '    <form [formGroup]="form">',
    '      <tng-number-range',
    '        tngAngularForms',
    '        formControlName="priceRange"',
    '        [min]="0"',
    '        [max]="1000"',
    '        ariaLabel="Price range"',
    '      ></tng-number-range>',
    '    </form>',
    '  `,',
    '})',
    'export class RangeFormComponent {',
    "  readonly form = new FormGroup({",
    "    priceRange: new FormControl({ min: 100, max: 500 }),",
    '  });',
    '}',
    '',
  ].join('\n');

  protected readonly testingNotesCode = [
    "const root = fixture.nativeElement.querySelector('.tng-number-range');",
    "const minInput = fixture.nativeElement.querySelector('.tng-number-range__input--min');",
    "const maxInput = fixture.nativeElement.querySelector('.tng-number-range__input--max');",
    '',
    "expect(root).not.toBeNull();",
    "expect(root?.hasAttribute('data-invalid')).toBe(false);",
    "expect(minInput?.value).toBe('100');",
    "expect(maxInput?.value).toBe('500');",
    '',
  ].join('\n');

  private readonly plainCssExampleHtmlCode = [
    '<label class="doc-cmp-nr-overview-plain-surface">',
    '  <span class="doc-cmp-nr-overview-plain-label">Price range</span>',
    '  <tng-number-range',
    '    [min]="0"',
    '    [max]="1000"',
    '    minPlaceholder="Min"',
    '    maxPlaceholder="Max"',
    '    ariaLabel="Price range"',
    '  ></tng-number-range>',
    '</label>',
    '',
  ].join('\n');

  private readonly plainCssExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-nr-overview-plain',",
    '  standalone: true,',
    '  imports: [TngNumberRangeComponent],',
    "  templateUrl: './doc-cmp-nr-overview-plain.component.html',",
    "  styleUrl: './doc-cmp-nr-overview-plain.component.css',",
    '})',
    'export class DocCmpNrOverviewPlainComponent {}',
    '',
  ].join('\n');

  private readonly plainCssExampleCssCode = [
    '.doc-cmp-nr-overview-plain-surface {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '  padding: 0.9rem;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.95rem;',
    '  background: color-mix(in srgb, var(--tng-semantic-background-surface) 88%, transparent);',
    '}',
    '',
    '.doc-cmp-nr-overview-plain-label {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  font-size: 0.78rem;',
    '  font-weight: 600;',
    '}',
    '',
  ].join('\n');

  private readonly tailwindExampleHtmlCode = [
    '<label class="grid gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-3">',
    '  <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-secondary)]">Price range</span>',
    '  <tng-number-range',
    '    [min]="0"',
    '    [max]="1000"',
    '    minPlaceholder="Min"',
    '    maxPlaceholder="Max"',
    '    ariaLabel="Price range"',
    '  ></tng-number-range>',
    '</label>',
    '',
  ].join('\n');

  private readonly tailwindExampleTsCode = [
    "import { Component } from '@angular/core';",
    "import { TngNumberRangeComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-nr-overview-tailwind',",
    '  standalone: true,',
    '  imports: [TngNumberRangeComponent],',
    "  templateUrl: './doc-cmp-nr-overview-tailwind.component.html',",
    '})',
    'export class DocCmpNrOverviewTailwindComponent {}',
    '',
  ].join('\n');

  private readonly tailwindExampleCssCode =
    '/* tng-number-range needs no CSS; optional utilities stay on the label wrapper only. */';

  protected readonly plainCssExampleCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'doc-cmp-nr-overview-plain.component.ts',
      code: this.plainCssExampleTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'doc-cmp-nr-overview-plain.component.html',
      code: this.plainCssExampleHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'doc-cmp-nr-overview-plain.component.css',
      code: this.plainCssExampleCssCode,
    },
  ]);

  protected readonly tailwindExampleCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'doc-cmp-nr-overview-tailwind.component.ts',
      code: this.tailwindExampleTsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'doc-cmp-nr-overview-tailwind.component.html',
      code: this.tailwindExampleHtmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'doc-cmp-nr-overview-tailwind.component.css',
      code: this.tailwindExampleCssCode,
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
