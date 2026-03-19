import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCheckboxComponent } from '@tailng-ui/components';
import { TngCheckbox as TngCheckboxPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

const deploymentRows = ['build', 'security', 'monitoring'] as const;
type DeploymentRow = (typeof deploymentRows)[number];
type ExampleVariant = 'headless' | 'plain-css' | 'tailwind-css';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: tsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

@Component({
  selector: 'app-checkbox-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngCheckboxComponent,
    TngCheckboxPrimitive,
  ],
  templateUrl: './checkbox-examples-page.component.html',
  styleUrl: './checkbox-examples-page.component.css',
})
export class CheckboxExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly rows = deploymentRows;

  private readonly headlessRows = signal<ReadonlySet<DeploymentRow>>(new Set(['build']));
  private readonly plainCssRows = signal<ReadonlySet<DeploymentRow>>(new Set(['build']));
  private readonly tailwindRows = signal<ReadonlySet<DeploymentRow>>(new Set(['build']));

  protected readonly consentHeadlessCodeTabs = createCodeTabs(
    'checkbox-consent-headless',
    [
      'import { Component } from "@angular/core";',
      'import { TngCheckbox } from "@tailng-ui/primitives";',
      '',
      '@Component({',
      '  imports: [TngCheckbox],',
      "  templateUrl: './checkbox-consent-headless.component.html',",
      "  styleUrl: './checkbox-consent-headless.component.css',",
      '})',
      'export class CheckboxConsentHeadlessComponent {}',
      '',
    ].join('\n'),
    [
      '<div class="checkbox-example-stack">',
      '  <label class="checkbox-row">',
      '    <input tngCheckbox [checked]="true" />',
      '    <span>I confirm release notes are reviewed.</span>',
      '  </label>',
      '  <label class="checkbox-row">',
      '    <input tngCheckbox [readonly]="true" [checked]="true" />',
      '    <span>Legal policy accepted (readonly).</span>',
      '  </label>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.checkbox-example-stack {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '}',
      '',
      '.checkbox-row {',
      '  align-items: center;',
      '  color: var(--tng-semantic-foreground-primary);',
      '  display: inline-flex;',
      '  gap: 0.55rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly consentPlainCssCodeTabs = createCodeTabs(
    'checkbox-consent-plain-css',
    [
      'import { Component } from "@angular/core";',
      'import { TngCheckboxComponent } from "@tailng-ui/components";',
      '',
      '@Component({',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './checkbox-consent-plain-css.component.html',",
      "  styleUrl: './checkbox-consent-plain-css.component.css',",
      '})',
      'export class CheckboxConsentPlainCssComponent {}',
      '',
    ].join('\n'),
    [
      '<div class="checkbox-example-stack checkbox-example-stack--plain">',
      '  <tng-checkbox [checked]="true">I confirm release notes are reviewed.</tng-checkbox>',
      '  <tng-checkbox [readonly]="true" [checked]="true">Legal policy accepted (readonly).</tng-checkbox>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.checkbox-example-stack--plain {',
      '  background: var(--tng-semantic-background-surface);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.75rem;',
      '  padding: 0.75rem 0.9rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly consentTailwindCodeTabs = createCodeTabs(
    'checkbox-consent-tailwind',
    [
      'import { Component } from "@angular/core";',
      'import { TngCheckboxComponent } from "@tailng-ui/components";',
      '',
      '@Component({',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './checkbox-consent-tailwind.component.html',",
      '})',
      'export class CheckboxConsentTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<div class="grid gap-3 rounded-xl border border-slate-300 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
      '  <tng-checkbox [checked]="true" class="text-slate-900 dark:text-slate-100">',
      '    I confirm release notes are reviewed.',
      '  </tng-checkbox>',
      '  <tng-checkbox [readonly]="true" [checked]="true" class="text-slate-900 dark:text-slate-100">',
      '    Legal policy accepted (readonly).',
      '  </tng-checkbox>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly triStateHeadlessCodeTabs = createCodeTabs(
    'checkbox-tri-state-headless',
    [
      'import { Component, signal } from "@angular/core";',
      'import { TngCheckbox } from "@tailng-ui/primitives";',
      '',
      '@Component({',
      '  imports: [TngCheckbox],',
      "  templateUrl: './checkbox-tri-state-headless.component.html',",
      "  styleUrl: './checkbox-tri-state-headless.component.css',",
      '})',
      'export class CheckboxTriStateHeadlessComponent {',
      "  readonly rows = ['build', 'security', 'monitoring'] as const;",
      "  readonly selected = signal(new Set(['build']));",
      '}',
      '',
    ].join('\n'),
    [
      '<div class="checkbox-example-stack checkbox-example-stack--tri-state">',
      '  <label class="checkbox-row">',
      '    <input',
      '      tngCheckbox',
      '      [checked]="areAllRowsChecked(\'headless\')"',
      '      [indeterminate]="isMixedRowsChecked(\'headless\')"',
      '      (change)="onHeadlessSelectAllChange($event)"',
      '    />',
      '    <span>Select all deployment checks</span>',
      '  </label>',
      '',
      '  <div class="checkbox-example-children">',
      '    @for (row of rows; track row) {',
      '      <label class="checkbox-row">',
      '        <input',
      '          tngCheckbox',
      '          [checked]="isRowChecked(\'headless\', row)"',
      '          (change)="onHeadlessRowChange(row, $event)"',
      '        />',
      '        <span>{{ row }}</span>',
      '      </label>',
      '    }',
      '  </div>',
      '',
      '  <p class="checkbox-example-summary">selected: {{ selectedSummary(\'headless\') }}</p>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.checkbox-example-stack--tri-state {',
      '  background: color-mix(in srgb, var(--tng-semantic-background-base) 95%, transparent);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.75rem;',
      '  padding: 0.75rem 0.9rem;',
      '}',
      '',
      '.checkbox-example-children {',
      '  border-left: 2px solid var(--tng-semantic-border-subtle);',
      '  display: grid;',
      '  gap: 0.55rem;',
      '  margin-left: 0.35rem;',
      '  padding-left: 0.7rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly triStatePlainCssCodeTabs = createCodeTabs(
    'checkbox-tri-state-plain-css',
    [
      'import { Component, signal } from "@angular/core";',
      'import { TngCheckboxComponent } from "@tailng-ui/components";',
      '',
      '@Component({',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './checkbox-tri-state-plain-css.component.html',",
      "  styleUrl: './checkbox-tri-state-plain-css.component.css',",
      '})',
      'export class CheckboxTriStatePlainCssComponent {',
      "  readonly rows = ['build', 'security', 'monitoring'] as const;",
      "  readonly selected = signal(new Set(['build']));",
      '}',
      '',
    ].join('\n'),
    [
      '<div class="checkbox-example-stack checkbox-example-stack--tri-state">',
      '  <tng-checkbox',
      '    [checked]="areAllRowsChecked(\'plain-css\')"',
      '    [indeterminate]="isMixedRowsChecked(\'plain-css\')"',
      '    (checkedChange)="onSelectAllChange(\'plain-css\', $event)"',
      '  >',
      '    Select all deployment checks',
      '  </tng-checkbox>',
      '',
      '  <div class="checkbox-example-children">',
      '    @for (row of rows; track row) {',
      '      <tng-checkbox',
      '        [checked]="isRowChecked(\'plain-css\', row)"',
      '        (checkedChange)="onRowChange(\'plain-css\', row, $event)"',
      '      >',
      '        {{ row }}',
      '      </tng-checkbox>',
      '    }',
      '  </div>',
      '',
      '  <p class="checkbox-example-summary">selected: {{ selectedSummary(\'plain-css\') }}</p>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.checkbox-example-stack--tri-state {',
      '  background: color-mix(in srgb, var(--tng-semantic-background-base) 95%, transparent);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.75rem;',
      '  padding: 0.75rem 0.9rem;',
      '}',
      '',
      '.checkbox-example-children {',
      '  border-left: 2px solid var(--tng-semantic-border-subtle);',
      '  display: grid;',
      '  gap: 0.55rem;',
      '  margin-left: 0.35rem;',
      '  padding-left: 0.7rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly triStateTailwindCodeTabs = createCodeTabs(
    'checkbox-tri-state-tailwind',
    [
      'import { Component, signal } from "@angular/core";',
      'import { TngCheckboxComponent } from "@tailng-ui/components";',
      '',
      '@Component({',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './checkbox-tri-state-tailwind.component.html',",
      '})',
      'export class CheckboxTriStateTailwindComponent {',
      "  readonly rows = ['build', 'security', 'monitoring'] as const;",
      "  readonly selected = signal(new Set(['build']));",
      '}',
      '',
    ].join('\n'),
    [
      '<div class="grid gap-3 rounded-xl border border-slate-300 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
      '  <tng-checkbox',
      '    [checked]="areAllRowsChecked(\'tailwind-css\')"',
      '    [indeterminate]="isMixedRowsChecked(\'tailwind-css\')"',
      '    (checkedChange)="onSelectAllChange(\'tailwind-css\', $event)"',
      '    class="text-slate-900 dark:text-slate-100"',
      '  >',
      '    Select all deployment checks',
      '  </tng-checkbox>',
      '',
      '  <div class="ml-2 grid gap-2 border-l-2 border-slate-300 pl-3 dark:border-slate-600">',
      '    @for (row of rows; track row) {',
      '      <tng-checkbox',
      '        [checked]="isRowChecked(\'tailwind-css\', row)"',
      '        (checkedChange)="onRowChange(\'tailwind-css\', row, $event)"',
      '        class="text-slate-900 dark:text-slate-100"',
      '      >',
      '        {{ row }}',
      '      </tng-checkbox>',
      '    }',
      '  </div>',
      '',
      '  <p class="text-xs lowercase text-slate-600 dark:text-slate-300">',
      '    selected: {{ selectedSummary(\'tailwind-css\') }}',
      '  </p>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly validationHeadlessCodeTabs = createCodeTabs(
    'checkbox-validation-headless',
    [
      'import { Component } from "@angular/core";',
      'import { TngCheckbox } from "@tailng-ui/primitives";',
      '',
      '@Component({',
      '  imports: [TngCheckbox],',
      "  templateUrl: './checkbox-validation-headless.component.html',",
      "  styleUrl: './checkbox-validation-headless.component.css',",
      '})',
      'export class CheckboxValidationHeadlessComponent {}',
      '',
    ].join('\n'),
    [
      '<label class="checkbox-row">',
      '  <input tngCheckbox [invalid]="true" />',
      '  <span>Security review is required before production deploy.</span>',
      '</label>',
      '',
    ].join('\n'),
    [
      '.checkbox-row {',
      '  align-items: center;',
      '  color: var(--tng-semantic-foreground-primary);',
      '  display: inline-flex;',
      '  gap: 0.55rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly validationPlainCssCodeTabs = createCodeTabs(
    'checkbox-validation-plain-css',
    [
      'import { Component } from "@angular/core";',
      'import { TngCheckboxComponent } from "@tailng-ui/components";',
      '',
      '@Component({',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './checkbox-validation-plain-css.component.html',",
      "  styleUrl: './checkbox-validation-plain-css.component.css',",
      '})',
      'export class CheckboxValidationPlainCssComponent {}',
      '',
    ].join('\n'),
    [
      '<div class="checkbox-example-stack">',
      '  <tng-checkbox [invalid]="true">',
      '    Security review is required before production deploy.',
      '  </tng-checkbox>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.checkbox-example-stack {',
      '  display: grid;',
      '  gap: 0.65rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly validationTailwindCodeTabs = createCodeTabs(
    'checkbox-validation-tailwind',
    [
      'import { Component } from "@angular/core";',
      'import { TngCheckboxComponent } from "@tailng-ui/components";',
      '',
      '@Component({',
      '  imports: [TngCheckboxComponent],',
      "  templateUrl: './checkbox-validation-tailwind.component.html',",
      '})',
      'export class CheckboxValidationTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<div class="rounded-xl border border-rose-300 bg-rose-50/70 p-4 dark:border-rose-500/70 dark:bg-rose-950/25">',
      '  <tng-checkbox [invalid]="true" class="text-rose-900 dark:text-rose-200">',
      '    Security review is required before production deploy.',
      '  </tng-checkbox>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected isRowChecked(variant: ExampleVariant, row: DeploymentRow): boolean {
    return this.readSelection(variant).has(row);
  }

  protected areAllRowsChecked(variant: ExampleVariant): boolean {
    return this.readSelection(variant).size === deploymentRows.length;
  }

  protected isMixedRowsChecked(variant: ExampleVariant): boolean {
    const count = this.readSelection(variant).size;
    return count > 0 && count < deploymentRows.length;
  }

  protected selectedSummary(variant: ExampleVariant): string {
    const selected = Array.from(this.readSelection(variant));
    return selected.length > 0 ? selected.join(', ') : 'none';
  }

  protected onRowChange(variant: ExampleVariant, row: DeploymentRow, checked: boolean): void {
    const next = new Set(this.readSelection(variant));
    if (checked) {
      next.add(row);
    } else {
      next.delete(row);
    }

    this.writeSelection(variant, next);
  }

  protected onSelectAllChange(variant: ExampleVariant, checked: boolean): void {
    this.writeSelection(variant, checked ? new Set(deploymentRows) : new Set());
  }

  protected onHeadlessSelectAllChange(event: Event): void {
    const checked = this.readCheckedFromChangeEvent(event);
    if (checked === null) {
      return;
    }

    this.onSelectAllChange('headless', checked);
  }

  protected onHeadlessRowChange(row: DeploymentRow, event: Event): void {
    const checked = this.readCheckedFromChangeEvent(event);
    if (checked === null) {
      return;
    }

    this.onRowChange('headless', row, checked);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private readSelection(variant: ExampleVariant): ReadonlySet<DeploymentRow> {
    if (variant === 'headless') {
      return this.headlessRows();
    }

    if (variant === 'plain-css') {
      return this.plainCssRows();
    }

    return this.tailwindRows();
  }

  private writeSelection(variant: ExampleVariant, rows: ReadonlySet<DeploymentRow>): void {
    if (variant === 'headless') {
      this.headlessRows.set(rows);
      return;
    }

    if (variant === 'plain-css') {
      this.plainCssRows.set(rows);
      return;
    }

    this.tailwindRows.set(rows);
  }

  private readCheckedFromChangeEvent(event: Event): boolean | null {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return null;
    }

    return target.checked;
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
