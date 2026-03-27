import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngRadioComponent } from '@tailng-ui/components';
import { TngRadio as TngRadioPrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

type BillingPlan = 'enterprise' | 'pro' | 'starter';

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
  selector: 'app-radio-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngRadioComponent,
    TngRadioPrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './radio-overview-page.component.html',
  styleUrl: './radio-overview-page.component.css',
})
export class RadioOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessPlan = signal<BillingPlan>('pro');
  protected readonly plainCssPlan = signal<BillingPlan>('pro');
  protected readonly tailwindPlan = signal<BillingPlan>('pro');

  protected readonly primitiveImportCode = "import { TngRadio } from '@tailng-ui/primitives';";
  protected readonly componentImportCode = "import { TngRadioComponent } from '@tailng-ui/components';";

  protected readonly primitiveUsageCode = [
    '<label class="radio-row">',
    '  <input tngRadio name="billing" value="starter" [checked]="plan === \'starter\'" />',
    '  <span>Starter</span>',
    '</label>',
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-radio',
    '  name="billing"',
    '  value="pro"',
    '  [checked]="plan === \'pro\'"',
    '  (checkedChange)="onPlanChecked(\'pro\', $event)"',
    '>',
    '  Pro',
    '</tng-radio>',
    '',
  ].join('\n');

  protected readonly headlessCodeTabs = createCodeTabs(
    'radio-overview-headless',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadio } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      '  imports: [TngRadio],',
      "  templateUrl: './radio-overview-headless.component.html',",
      "  styleUrl: './radio-overview-headless.component.css',",
      '})',
      'export class RadioOverviewHeadlessComponent {',
      "  readonly plan = signal<'starter' | 'pro' | 'enterprise'>('pro');",
      '}',
      '',
    ].join('\n'),
    [
      '<fieldset class="radio-preview-stack">',
      '  <legend class="radio-preview-legend">Billing plan</legend>',
      '  <label class="radio-row">',
      '    <input tngRadio name="headless-plan" value="starter" [checked]="plan() === \'starter\'" />',
      '    <span>Starter</span>',
      '  </label>',
      '  <label class="radio-row">',
      '    <input tngRadio name="headless-plan" value="pro" [checked]="plan() === \'pro\'" />',
      '    <span>Pro</span>',
      '  </label>',
      '  <label class="radio-row">',
      '    <input tngRadio name="headless-plan" value="enterprise" [checked]="plan() === \'enterprise\'" />',
      '    <span>Enterprise</span>',
      '  </label>',
      '</fieldset>',
      '',
    ].join('\n'),
    [
      '.radio-preview-stack { display: grid; gap: 0.7rem; }',
      '.radio-preview-legend { margin-bottom: 0.25rem; }',
      '.radio-row { align-items: center; display: inline-flex; gap: 0.55rem; }',
      '',
    ].join('\n'),
  );

  protected readonly plainCssCodeTabs = createCodeTabs(
    'radio-overview-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngRadioComponent],',
      "  templateUrl: './radio-overview-plain-css.component.html',",
      "  styleUrl: './radio-overview-plain-css.component.css',",
      '})',
      'export class RadioOverviewPlainCssComponent {',
      "  readonly plan = signal<'starter' | 'pro' | 'enterprise'>('pro');",
      '}',
      '',
    ].join('\n'),
    [
      '<div class="plain-radio-card">',
      '  <tng-radio name="plain-plan" value="starter">Starter</tng-radio>',
      '  <tng-radio name="plain-plan" value="pro" [checked]="true">Pro</tng-radio>',
      '  <tng-radio name="plain-plan" value="enterprise">Enterprise</tng-radio>',
      '</div>',
      '',
    ].join('\n'),
    [
      '.plain-radio-card {',
      '  background: var(--tng-semantic-background-surface);',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.8rem;',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  padding: 0.9rem 1rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'radio-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngRadioComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngRadioComponent],',
      "  templateUrl: './radio-overview-tailwind.component.html',",
      '})',
      'export class RadioOverviewTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<div class="grid gap-3 rounded-xl border border-slate-300 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
      '  <tng-radio name="tw-plan" value="starter" class="text-slate-900 dark:text-slate-100">Starter</tng-radio>',
      '  <tng-radio name="tw-plan" value="pro" [checked]="true" class="text-slate-900 dark:text-slate-100">Pro</tng-radio>',
      '  <tng-radio name="tw-plan" value="enterprise" class="text-slate-900 dark:text-slate-100">Enterprise</tng-radio>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onHeadlessPlanChange(plan: BillingPlan, event: unknown): void {
    if (!(event instanceof Event)) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.checked) {
      return;
    }

    this.headlessPlan.set(plan);
  }

  protected onPlainCssPlanChange(plan: BillingPlan, checked: boolean): void {
    if (!checked) {
      return;
    }

    this.plainCssPlan.set(plan);
  }

  protected onTailwindPlanChange(plan: BillingPlan, checked: boolean): void {
    if (!checked) {
      return;
    }

    this.tailwindPlan.set(plan);
  }

}
