import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import {
  TngButtonToggleComponent,
  TngCodeBlockComponent,
} from '@tailng-ui/components';
import {
  TngButtonToggle as TngButtonTogglePrimitive,
  TngButtonToggleGroup as TngButtonToggleGroupPrimitive,
  type TngButtonToggleValue,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-button-toggle-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngButtonToggleComponent,
    TngButtonTogglePrimitive,
    TngButtonToggleGroupPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './button-toggle-overview-page.component.html',
  styleUrl: './button-toggle-overview-page.component.css',
})
export class ButtonToggleOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessAlign = signal<'left' | 'center' | 'right'>('center');
  protected readonly plainView = signal<'compact' | 'comfortable' | 'spacious'>('comfortable');
  protected readonly tailwindFilters = signal<readonly string[]>(['a11y', 'signals']);

  protected readonly primitiveImportCode = [
    "import { TngButtonToggleGroup, TngButtonToggle } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngButtonToggleGroupComponent, TngButtonToggleComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<section',
    '  tngButtonToggleGroup',
    '  [tngButtonToggleValue]="align()"',
    '  (valueChange)="onAlignChange($event)"',
    '>',
    '  <button tngButtonToggle tngButtonToggleValue="left">Left</button>',
    '  <button tngButtonToggle tngButtonToggleValue="center">Center</button>',
    '  <button tngButtonToggle tngButtonToggleValue="right">Right</button>',
    '</section>',
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    "<tng-button-toggle [pressed]=\"layoutDensity() === 'compact'\" (pressedChange)=\"onDensityPressed('compact', $event)\">",
    '  Compact',
    '</tng-button-toggle>',
    "<tng-button-toggle [pressed]=\"layoutDensity() === 'comfortable'\" (pressedChange)=\"onDensityPressed('comfortable', $event)\">",
    '  Comfortable',
    '</tng-button-toggle>',
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'button-toggle-headless-example.component.ts',
      code: [
        "readonly align = signal<'left' | 'center' | 'right'>('center');",
        '',
        'onAlignChange(value: string | number | null): void {',
        "  if (value === 'left' || value === 'center' || value === 'right') {",
        '    this.align.set(value);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-toggle-headless-example.component.html',
      code: [
        '<section',
        '  tngButtonToggleGroup',
        '  class="button-toggle-preview-group"',
        '  [tngButtonToggleValue]="align()"',
        '  (valueChange)="onAlignChange($event)"',
        '>',
        '  <button tngButtonToggle tngButtonToggleValue="left" class="button-toggle-preview-item">',
        '    Left',
        '  </button>',
        '  <button tngButtonToggle tngButtonToggleValue="center" class="button-toggle-preview-item">',
        '    Center',
        '  </button>',
        '  <button tngButtonToggle tngButtonToggleValue="right" class="button-toggle-preview-item">',
        '    Right',
        '  </button>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-toggle-headless-example.component.css',
      code: [
        '.button-toggle-preview-group {',
        '  display: inline-flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.5rem;',
        '}',
        '.button-toggle-preview-item {',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.65rem;',
        '  color: var(--tng-semantic-foreground-primary);',
        '  padding: 0.4rem 0.85rem;',
        '}',
        '.button-toggle-preview-item[data-state="on"] {',
        '  background: var(--tng-semantic-accent-brand);',
        '  border-color: var(--tng-semantic-accent-brand);',
        '  color: var(--tng-color-white);',
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
      title: 'button-toggle-plain-css-example.component.ts',
      code: [
        "readonly layoutDensity = signal<'compact' | 'comfortable' | 'spacious'>('comfortable');",
        '',
        "onDensityPressed(value: 'compact' | 'comfortable' | 'spacious', pressed: boolean): void {",
        '  if (pressed) {',
        '    this.layoutDensity.set(value);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-toggle-plain-css-example.component.html',
      code: [
        '<div class="plain-button-toggle-card">',
        "  <tng-button-toggle [pressed]=\"layoutDensity() === 'compact'\" (pressedChange)=\"onDensityPressed('compact', $event)\">",
        '    Compact',
        '  </tng-button-toggle>',
        "  <tng-button-toggle [pressed]=\"layoutDensity() === 'comfortable'\" (pressedChange)=\"onDensityPressed('comfortable', $event)\">",
        '    Comfortable',
        '  </tng-button-toggle>',
        "  <tng-button-toggle [pressed]=\"layoutDensity() === 'spacious'\" (pressedChange)=\"onDensityPressed('spacious', $event)\">",
        '    Spacious',
        '  </tng-button-toggle>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-toggle-plain-css-example.component.css',
      code: [
        '.plain-button-toggle-card {',
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
      title: 'button-toggle-tailwind-example.component.ts',
      code: [
        "readonly featureFilters = signal<readonly string[]>(['a11y', 'signals']);",
        '',
        "onFilterPressed(value: 'a11y' | 'signals' | 'dx', pressed: boolean): void {",
        '  const next = new Set(this.featureFilters());',
        '  if (pressed) {',
        '    next.add(value);',
        '  } else {',
        '    next.delete(value);',
        '  }',
        '  this.featureFilters.set(Array.from(next));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'button-toggle-tailwind-example.component.html',
      code: [
        '<div',
        '  class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60"',
        '>',
        "  <tng-button-toggle [pressed]=\"featureFilters().includes('a11y')\" (pressedChange)=\"onFilterPressed('a11y', $event)\">",
        '    Accessibility',
        '  </tng-button-toggle>',
        "  <tng-button-toggle [pressed]=\"featureFilters().includes('signals')\" (pressedChange)=\"onFilterPressed('signals', $event)\">",
        '    Signals',
        '  </tng-button-toggle>',
        "  <tng-button-toggle [pressed]=\"featureFilters().includes('dx')\" (pressedChange)=\"onFilterPressed('dx', $event)\">",
        '    DX',
        '  </tng-button-toggle>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'button-toggle-tailwind-example.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onHeadlessAlignChange(value: TngButtonToggleValue | null): void {
    if (value === 'left' || value === 'center' || value === 'right') {
      this.headlessAlign.set(value);
    }
  }

  protected onDensityPressed(
    value: 'compact' | 'comfortable' | 'spacious',
    pressed: boolean,
  ): void {
    if (pressed) {
      this.plainView.set(value);
    }
  }

  protected onFilterPressed(value: 'a11y' | 'signals' | 'dx', pressed: boolean): void {
    const next = new Set(this.tailwindFilters());
    if (pressed) {
      next.add(value);
    } else {
      next.delete(value);
    }

    this.tailwindFilters.set(Array.from(next));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
